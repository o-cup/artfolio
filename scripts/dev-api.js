// 내 컴퓨터에서 어드민을 테스트할 때만 쓰는 작은 서버예요. (실제 사이트에서는 Vercel이 api/ 폴더를 실행해요)
// 사용법: npm run dev:api 와 npm start 를 함께 실행 → 브라우저에서 http://localhost:3000/admin
// 이 모드에서는 GitHub이 아니라 내 컴퓨터의 파일에 바로 저장돼요.

const http = require("http");
const path = require("path");

const ROOT = path.join(__dirname, "..");
process.env.LOCAL_REPO_DIR = process.env.LOCAL_REPO_DIR || ROOT;
process.env.AUTH_SECRET = process.env.AUTH_SECRET || "local-dev-secret-local-dev-secret-0000";
process.env.ADMIN_SETUP_PASSWORD = process.env.ADMIN_SETUP_PASSWORD || "test1234";

const PORT = 3001;

http
	.createServer(async (req, res) => {
		const url = new URL(req.url, `http://localhost:${PORT}`);
		const name = url.pathname.replace(/^\/api\//, "").replace(/[^a-z-]/g, "");
		let handler;
		try {
			handler = require(path.join(ROOT, "api", `${name}.js`));
		} catch (e) {
			res.writeHead(404);
			return res.end("not found");
		}

		const chunks = [];
		for await (const c of req) chunks.push(c);
		const raw = Buffer.concat(chunks).toString();
		req.query = Object.fromEntries(url.searchParams);
		try {
			req.body = raw ? JSON.parse(raw) : {};
		} catch (e) {
			req.body = {};
		}
		res.status = (code) => {
			res.statusCode = code;
			return res;
		};
		res.json = (obj) => {
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify(obj));
		};
		return handler(req, res);
	})
	.listen(PORT, () => console.log(`admin api ready on http://localhost:${PORT} (setup password: ${process.env.ADMIN_SETUP_PASSWORD})`));
