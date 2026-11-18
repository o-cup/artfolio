// 한국어 → 영어 번역 (Claude API). 관리 화면 서버(api/translate.js)와
// GitHub 자동 번역(scripts/translate-data.js)이 같이 써요.

const AnthropicModule = require("@anthropic-ai/sdk");

const Anthropic = AnthropicModule.default || AnthropicModule;

const SYSTEM = `You translate Korean text for the English version of the portfolio website of Park Mejung, a Korean fine-art photographer (still life).
Rules:
- Translate naturally, in the tone of a gallery/artist portfolio. Do not add or omit information.
- Keep everything inside < > brackets as titles; translate the title text but keep the brackets.
- Keep line breaks exactly as in the source.
- Keep numbers, years, and existing English/Latin words as they are.
- Place names: use the common English name (서울 → Seoul, 한국 → South Korea, 미국 → USA). Romanize gallery names that have no known English name.
- Exhibition categories: 개인전 → solo exhibition, 단체전 → group exhibition, 아트페어 → art fairs, 수상 → awards.
- Each input item has a "style":
  - "title": the English output must use standard English title case (as in book/exhibition titles): capitalize the first letter of every word, including the first and last word and words after a colon; keep lowercase only articles (a, an, the), coordinating conjunctions (and, but, or, nor, for, so, yet), and short prepositions (of, in, on, at, to, by, for, with, from, as, into, onto, via) when they are not the first or last word. Example: "Still Life for Things That Need a Goodbye, Mourning", "Delivering Hope 4-3", "AZIT Museum, Seoul, South Korea". Keep acronyms and existing brand spellings as they are (AIPAD, KATALOG). Apply this to the whole item, including gallery and place names.
  - "text": translate as normal sentences (sentence case). Exhibition categories stay lowercase (solo exhibition, group exhibition, art fairs, awards).
Return one translation per input item, in the same order.`;

/**
 * items(한국어 문장들)를 같은 순서의 영어 문장들로 돌려줘요. 실패하면 오류를 던져요.
 * styles[i]: "title"(영문 제목 형식: 단어 첫 글자 대문자) 또는 "text"(보통 문장). 없으면 "text".
 */
async function translateItems(items, styles = []) {
	if (items.length === 0) return [];
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
		messages: [
			{
				role: "user",
				content: JSON.stringify({
					items: items.map((text, i) => ({ text, style: styles[i] === "title" ? "title" : "text" })),
				}),
			},
		],
	});

	if (response.stop_reason === "refusal") throw new Error("번역이 거절됐어요.");
	if (response.stop_reason === "max_tokens") throw new Error("번역이 너무 길어서 잘렸어요.");
	const text = response.content
		.filter((b) => b.type === "text")
		.map((b) => b.text)
		.join("");
	const { translations } = JSON.parse(text);
	if (!Array.isArray(translations) || translations.length !== items.length) {
		throw new Error("번역 결과 개수가 맞지 않아요.");
	}
	return translations.map(String);
}

module.exports = { translateItems };
