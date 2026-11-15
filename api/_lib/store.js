// 사이트 파일을 읽고 쓰는 곳.
// - 실제 사이트(Vercel): GitHub 저장소에 커밋 → Vercel이 자동으로 다시 배포
// - 내 컴퓨터에서 테스트할 때(LOCAL_REPO_DIR 설정): 내 컴퓨터의 폴더에 바로 저장

const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

const LOCAL_DIR = process.env.LOCAL_REPO_DIR;
const REPO = process.env.GITHUB_REPO || "o-cup/artfolio";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const TOKEN = process.env.GITHUB_TOKEN;

function isLocal() {
	return Boolean(LOCAL_DIR);
}

async function gh(method, url, body) {
	if (!TOKEN) throw new Error("GITHUB_TOKEN 환경변수가 설정되지 않았어요.");
	const res = await fetch(`https://api.github.com/repos/${REPO}${url}`, {
		method,
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			Accept: "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28",
			"Content-Type": "application/json",
		},
		body: body ? JSON.stringify(body) : undefined,
	});
	if (res.status === 404 && method === "GET") return null;
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GitHub ${method} ${url} 실패 (${res.status}): ${text.slice(0, 300)}`);
	}
	return res.json();
}

// 파일 하나를 글자로 읽기. 없으면 null.
async function readFile(filePath) {
	if (isLocal()) {
		const full = path.join(LOCAL_DIR, filePath);
		return fs.existsSync(full) ? fs.readFileSync(full, "utf8") : null;
	}
	const data = await gh("GET", `/contents/${encodeURI(filePath)}?ref=${BRANCH}`);
	if (!data) return null;
	return Buffer.from(data.content, "base64").toString("utf8");
}

const stagingDir = path.join(os.tmpdir(), "artfolio-admin-staging");

// 사진 하나를 미리 올려두고, 나중에 저장할 때 쓸 번호(blobId)를 돌려줘요.
async function createBlob(base64) {
	if (isLocal()) {
		fs.mkdirSync(stagingDir, { recursive: true });
		const id = crypto.randomBytes(12).toString("hex");
		fs.writeFileSync(path.join(stagingDir, id), Buffer.from(base64, "base64"));
		return id;
	}
	const blob = await gh("POST", "/git/blobs", { content: base64, encoding: "base64" });
	return blob.sha;
}

// 여러 파일 변경을 한 번에 저장(커밋 하나 = 배포 한 번).
// writes: [{ path, text } | { path, blobId }], deletes: [path]
async function commit({ message, writes = [], deletes = [] }) {
	if (isLocal()) {
		writes.forEach((w) => {
			const full = path.join(LOCAL_DIR, w.path);
			fs.mkdirSync(path.dirname(full), { recursive: true });
			if (w.text !== undefined) fs.writeFileSync(full, w.text);
			else fs.copyFileSync(path.join(stagingDir, w.blobId), full);
		});
		deletes.forEach((p) => {
			const full = path.join(LOCAL_DIR, p);
			if (fs.existsSync(full)) fs.unlinkSync(full);
		});
		return { sha: "local" };
	}

	// 다른 곳에서 동시에 바뀐 경우를 대비해 한 번 더 시도해요.
	for (let attempt = 0; attempt < 3; attempt += 1) {
		const ref = await gh("GET", `/git/ref/heads/${BRANCH}`);
		const headSha = ref.object.sha;
		const head = await gh("GET", `/git/commits/${headSha}`);

		const tree = [
			...writes.map((w) =>
				w.text !== undefined
					? { path: w.path, mode: "100644", type: "blob", content: w.text }
					: { path: w.path, mode: "100644", type: "blob", sha: w.blobId }
			),
		];
		// 지울 파일은 실제로 있는 것만 (없는 파일을 지우려 하면 GitHub이 거부해요)
		for (const p of deletes) {
			const exists = await gh("GET", `/contents/${encodeURI(p)}?ref=${headSha}`);
			if (exists) tree.push({ path: p, mode: "100644", type: "blob", sha: null });
		}

		const newTree = await gh("POST", "/git/trees", { base_tree: head.tree.sha, tree });
		const newCommit = await gh("POST", "/git/commits", {
			message,
			tree: newTree.sha,
			parents: [headSha],
		});
		try {
			await gh("PATCH", `/git/refs/heads/${BRANCH}`, { sha: newCommit.sha, force: false });
			return { sha: newCommit.sha };
		} catch (e) {
			if (attempt === 2) throw e;
		}
	}
	throw new Error("저장에 실패했어요.");
}

module.exports = { readFile, createBlob, commit, isLocal, REPO, BRANCH };
