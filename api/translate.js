// POST /api/translate : 한국어 문장들을 영어로 번역해요.
//   body: { items: string[] } → { translations: string[] }
// Claude API(ANTHROPIC_API_KEY)를 사용해요. 키가 없으면 번역 없이 비워서 돌려줘요.

const auth = require("./_lib/auth");
const { translateItems } = require("./_lib/translator");

module.exports = async (req, res) => {
	if (!auth.requireSession(req, res)) return undefined;
	if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

	const items = Array.isArray(req.body && req.body.items) ? req.body.items.map(String) : [];
	if (items.length === 0) return res.status(200).json({ translations: [] });
	if (items.length > 200) return res.status(400).json({ error: "한 번에 너무 많아요." });

	if (!process.env.ANTHROPIC_API_KEY) {
		return res.status(200).json({ translations: items.map(() => ""), skipped: true });
	}

	try {
		const styles = Array.isArray(req.body.styles) ? req.body.styles.map(String) : [];
		const translations = await translateItems(items, styles);
		return res.status(200).json({ translations });
	} catch (e) {
		console.error(e);
		// 번역이 안 되어도 저장은 되게 해요. (영어는 나중에 고칠 수 있어요)
		return res.status(200).json({ translations: items.map(() => ""), skipped: true, detail: e.message });
	}
};
