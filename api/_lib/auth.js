// 로그인 관련 도구들.
// 비밀번호는 그대로 저장하지 않고, 서버 비밀키(AUTH_SECRET)를 섞어 풀 수 없는 형태(해시)로만
// admin/auth.json 에 저장해요. 비밀키가 없으면 이 파일을 봐도 비밀번호를 알아낼 수 없어요.

const crypto = require("crypto");
const store = require("./store");

const AUTH_FILE = "admin/auth.json";
const COOKIE = "pmj_admin";
const SESSION_DAYS = 180; // 한 번 로그인하면 약 6개월 유지

function secret() {
	const s = process.env.AUTH_SECRET;
	if (!s || s.length < 32) throw new Error("AUTH_SECRET 환경변수(32자 이상)가 필요해요.");
	return s;
}

function b64url(buf) {
	return Buffer.from(buf).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function hmac(text) {
	return b64url(crypto.createHmac("sha256", secret()).update(text).digest());
}

function scrypt(password, salt) {
	const peppered = crypto.createHmac("sha256", secret()).update(password).digest();
	return new Promise((resolve, reject) => {
		crypto.scrypt(peppered, salt, 32, { N: 16384, r: 8, p: 1 }, (err, key) =>
			err ? reject(err) : resolve(key)
		);
	});
}

async function readAuth() {
	const text = await store.readFile(AUTH_FILE);
	return text ? JSON.parse(text) : null;
}

async function checkPassword(password) {
	const auth = await readAuth();
	if (!auth) {
		// 아직 비밀번호를 만든 적이 없으면, 처음 설정용 비밀번호(ADMIN_SETUP_PASSWORD)로 들어올 수 있어요.
		const setup = process.env.ADMIN_SETUP_PASSWORD;
		if (!setup) return false;
		const a = Buffer.from(hmac(password));
		const b = Buffer.from(hmac(setup));
		return a.length === b.length && crypto.timingSafeEqual(a, b);
	}
	const key = await scrypt(password, Buffer.from(auth.salt, "base64"));
	const expected = Buffer.from(auth.hash, "base64");
	return key.length === expected.length && crypto.timingSafeEqual(key, expected);
}

async function setPassword(password) {
	const salt = crypto.randomBytes(16);
	const key = await scrypt(password, salt);
	const record = {
		note: "관리자 비밀번호(암호화됨). 직접 고치지 마세요.",
		salt: salt.toString("base64"),
		hash: key.toString("base64"),
		updatedAt: new Date().toISOString(),
	};
	await store.commit({
		message: "어드민: 비밀번호 변경",
		writes: [{ path: AUTH_FILE, text: `${JSON.stringify(record, null, 2)}\n` }],
	});
}

function parseCookies(req) {
	const out = {};
	(req.headers.cookie || "").split(";").forEach((part) => {
		const i = part.indexOf("=");
		if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
	});
	return out;
}

function setSessionCookie(res, extra = {}) {
	const payload = b64url(JSON.stringify({ exp: Date.now() + SESSION_DAYS * 864e5, ...extra }));
	const value = `${payload}.${hmac(payload)}`;
	const secure = store.isLocal() ? "" : " Secure;";
	res.setHeader(
		"Set-Cookie",
		`${COOKIE}=${value}; Path=/; HttpOnly;${secure} SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}`
	);
}

function clearSessionCookie(res) {
	res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

function getSession(req) {
	const raw = parseCookies(req)[COOKIE];
	if (!raw) return null;
	const [payload, sig] = raw.split(".");
	if (!payload || !sig) return null;
	const a = Buffer.from(sig);
	const b = Buffer.from(hmac(payload));
	if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
	try {
		const data = JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
		return data.exp > Date.now() ? data : null;
	} catch (e) {
		return null;
	}
}

// 로그인한 사람만 쓸 수 있는 기능에서 사용
function requireSession(req, res) {
	const s = getSession(req);
	if (!s) {
		res.status(401).json({ error: "로그인이 필요해요." });
		return null;
	}
	return s;
}

// 구글 로그인 확인 (비밀번호를 잊었을 때)
async function verifyGoogle(credential) {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const allowed = (process.env.ALLOWED_GOOGLE_EMAILS || "")
		.split(",")
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean);
	if (!clientId || allowed.length === 0) throw new Error("구글 로그인이 아직 설정되지 않았어요.");

	const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
	if (!res.ok) return null;
	const info = await res.json();
	const email = String(info.email || "").toLowerCase();
	const ok =
		info.aud === clientId &&
		(info.email_verified === true || info.email_verified === "true") &&
		Number(info.exp) * 1000 > Date.now() &&
		allowed.includes(email);
	return ok ? email : null;
}

// 아주 간단한 연속 실패 방지 (같은 서버 인스턴스 안에서만)
const failures = new Map();
function tooManyFailures(ip) {
	const f = failures.get(ip);
	return f && f.count >= 10 && Date.now() - f.since < 15 * 60 * 1000;
}
function recordFailure(ip) {
	const f = failures.get(ip);
	if (!f || Date.now() - f.since > 15 * 60 * 1000) failures.set(ip, { count: 1, since: Date.now() });
	else f.count += 1;
}
function clearFailures(ip) {
	failures.delete(ip);
}

module.exports = {
	readAuth,
	checkPassword,
	setPassword,
	setSessionCookie,
	clearSessionCookie,
	getSession,
	requireSession,
	verifyGoogle,
	tooManyFailures,
	recordFailure,
	clearFailures,
};
