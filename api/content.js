// GET  /api/content : 지금 저장된 작업물·전시·이력 데이터를 읽어와요.
// POST /api/content : 바뀐 데이터와 사진을 한 번에 저장해요.
//   body: { message, files: { works?, exhibitions?, about? }, images: [{ path, blobId }], deletes: [path] }

const auth = require("./_lib/auth");
const store = require("./_lib/store");

const FILES = {
	works: "src/components/works/worksData.json",
	exhibitions: "src/components/exhibitions/exhibitionsData.json",
	about: "src/components/about/aboutData.json",
};

// 사진은 정해진 폴더 안에만 넣고 지울 수 있어요.
const IMAGE_PATH = /^public\/(works|exhibitions)\/[0-9]{2,4}\/[A-Za-z0-9_-]+\.(jpe?g|png)$/;

function validate(key, data) {
	const ok =
		data &&
		data.ko &&
		data.en &&
		(key === "about"
			? data.ko.artist && data.en.artist && Array.isArray(data.ko.histories) && Array.isArray(data.en.histories)
			: Array.isArray(data.ko) && Array.isArray(data.en) && data.ko.length === data.en.length);
	if (!ok) throw new Error(`${key} 데이터 형식이 이상해요.`);
}

module.exports = async (req, res) => {
	if (!auth.requireSession(req, res)) return undefined;

	try {
		if (req.method === "GET") {
			const [works, exhibitions, about] = await Promise.all(
				Object.values(FILES).map((p) => store.readFile(p).then((t) => JSON.parse(t)))
			);
			return res.status(200).json({
				works,
				exhibitions,
				about,
				rawBase: store.isLocal()
					? ""
					: `https://raw.githubusercontent.com/${store.REPO}/${store.BRANCH}/public`,
			});
		}

		if (req.method !== "POST") return res.status(405).json({ error: "GET/POST only" });

		const { message, files = {}, images = [], deletes = [] } = req.body || {};
		const writes = [];

		Object.entries(files).forEach(([key, data]) => {
			if (!FILES[key]) throw new Error(`알 수 없는 파일: ${key}`);
			validate(key, data);
			writes.push({ path: FILES[key], text: `${JSON.stringify(data, null, 2)}\n` });
		});
		images.forEach((img) => {
			if (!IMAGE_PATH.test(img.path) || !img.blobId) throw new Error(`사진 경로가 이상해요: ${img.path}`);
			writes.push({ path: img.path, blobId: img.blobId });
		});
		deletes.forEach((p) => {
			if (!IMAGE_PATH.test(p)) throw new Error(`지울 수 없는 경로: ${p}`);
		});

		if (writes.length === 0 && deletes.length === 0) return res.status(200).json({ ok: true });

		const result = await store.commit({
			message: `어드민: ${String(message || "내용 수정").slice(0, 100)}`,
			writes,
			deletes,
		});
		return res.status(200).json({ ok: true, sha: result.sha });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: "저장하다가 문제가 생겼어요. 잠시 뒤 다시 해 주세요.", detail: e.message });
	}
};
