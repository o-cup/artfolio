// POST /api/translate : 한국어 문장들을 영어로 번역해요.
//   body: { items: string[] } → { translations: string[] }
// Claude API(ANTHROPIC_API_KEY)를 사용해요. 키가 없으면 번역 없이 비워서 돌려줘요.

const AnthropicModule = require("@anthropic-ai/sdk");

const Anthropic = AnthropicModule.default || AnthropicModule;
const auth = require("./_lib/auth");

const SYSTEM = `You translate Korean text for the English version of the portfolio website of Park Mejung, a Korean fine-art photographer (still life).
Rules:
- Translate naturally, in the tone of a gallery/artist portfolio. Do not add or omit information.
- Keep everything inside < > brackets as titles; translate the title text but keep the brackets.
- Keep line breaks exactly as in the source.
- Keep numbers, years, and existing English/Latin words as they are.
- Place names: use the common English name (서울 → Seoul, 한국 → South Korea, 미국 → USA). Romanize gallery names that have no known English name.
- Exhibition categories: 개인전 → solo exhibition, 단체전 → group exhibition, 아트페어 → art fairs, 수상 → awards.
Return one translation per input item, in the same order.`;

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
		const client = new Anthropic();
		const response = await client.beta.messages.create({
			model: "claude-opus-5-5",
			max_tokens: 16000,
			betas: ["server-side-fallback-2026-07-01"],
			fallbacks: "default",
			output_config: {
				effort: "low",
				format: {
					type: "json_schema",
					schema: {
						type: "object",
						properties: { translations: { type: "array", items: { type: "string" } } },
						required: ["translations"],
						additionalProperties: false,
					},
				},
			},
			system: SYSTEM,
			messages: [{ role: "user", content: JSON.stringify({ items }) }],
		});

		if (response.stop_reason === "refusal") throw new Error("번역이 거절됐어요.");
		const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
		const { translations } = JSON.parse(text);
		if (!Array.isArray(translations) || translations.length !== items.length) {
			throw new Error("번역 결과 개수가 맞지 않아요.");
		}
		return res.status(200).json({ translations });
	} catch (e) {
		console.error(e);
		// 번역이 안 되어도 저장은 되게 해요. (영어는 나중에 고칠 수 있어요)
		return res.status(200).json({ translations: items.map(() => ""), skipped: true, detail: e.message });
	}
};
