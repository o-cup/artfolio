// POST /api/upload : 사진 한 장을 미리 올려둬요. { data: base64 } → { blobId }
// (사진은 화면에서 미리 줄여서 보내기 때문에 한 장에 3MB를 넘지 않아요.)

const auth = require("./_lib/auth");
const store = require("./_lib/store");

module.exports = async (req, res) => {
	if (!auth.requireSession(req, res)) return undefined;
	if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

	try {
		const data = String((req.body && req.body.data) || "");
		if (!data || data.length > 4.2 * 1024 * 1024) {
			return res.status(400).json({ error: "사진이 너무 크거나 비어 있어요." });
		}
		const blobId = await store.createBlob(data);
		return res.status(200).json({ blobId });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: "사진을 올리다가 문제가 생겼어요.", detail: e.message });
	}
};
