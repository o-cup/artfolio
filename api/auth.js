// /api/auth?action=...
//   me           : 로그인 상태 확인 (+ 구글 로그인 설정값)
//   login        : 비밀번호로 로그인
//   google       : 구글 계정으로 로그인 (비밀번호를 잊었을 때)
//   set-password : 새 비밀번호 만들기 (로그인 상태에서만)
//   logout       : 로그아웃

const auth = require("./_lib/auth");

const MIN_LENGTH = 6;

module.exports = async (req, res) => {
	const action = req.query.action;
	const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0] || "local";

	try {
		if (action === "me") {
			const session = auth.getSession(req);
			return res.status(200).json({
				loggedIn: Boolean(session),
				mustSetPassword: Boolean(session && session.reset),
				googleClientId: process.env.GOOGLE_CLIENT_ID || null,
			});
		}

		if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
		const body = req.body || {};

		if (action === "login") {
			if (auth.tooManyFailures(ip)) {
				return res.status(429).json({ error: "여러 번 틀려서 잠시 막혔어요. 15분 뒤에 다시 해 주세요." });
			}
			const ok = await auth.checkPassword(String(body.password || ""));
			if (!ok) {
				auth.recordFailure(ip);
				await new Promise((r) => setTimeout(r, 600));
				return res.status(401).json({ error: "비밀번호가 맞지 않아요. 다시 한 번 입력해 주세요." });
			}
			auth.clearFailures(ip);
			auth.setSessionCookie(res);
			return res.status(200).json({ ok: true });
		}

		if (action === "google") {
			const email = await auth.verifyGoogle(String(body.credential || ""));
			if (!email) {
				return res.status(403).json({ error: "이 구글 계정으로는 들어올 수 없어요. 등록된 계정으로 해 주세요." });
			}
			auth.setSessionCookie(res, { reset: true });
			return res.status(200).json({ ok: true });
		}

		if (action === "set-password") {
			if (!auth.requireSession(req, res)) return undefined;
			const password = String(body.password || "");
			if (password.length < MIN_LENGTH) {
				return res.status(400).json({ error: `비밀번호는 ${MIN_LENGTH}글자 이상으로 만들어 주세요.` });
			}
			await auth.setPassword(password);
			auth.setSessionCookie(res); // 새 비밀번호를 만들었으니 '재설정 필요' 표시를 없애요
			return res.status(200).json({ ok: true });
		}

		if (action === "logout") {
			auth.clearSessionCookie(res);
			return res.status(200).json({ ok: true });
		}

		return res.status(404).json({ error: "unknown action" });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: "문제가 생겼어요. 잠시 뒤 다시 해 주세요.", detail: e.message });
	}
};
