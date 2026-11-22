// Supabase Edge Function "translate": 관리 화면에서 저장할 때 한국어 → 영어로 번역해요.
// 올리는 법: Supabase 화면 → Edge Functions → Deploy a new function → Via Editor
//   → 이름 translate → 이 파일 내용을 통째로 붙여 넣고 [Deploy function]
// 키: Edge Functions → Secrets 에 ANTHROPIC_API_KEY 를 넣어요.
//   body: { items: string[], styles?: ("title" | "text")[] } → { translations: string[], skipped?: boolean }

import Anthropic from "npm:@anthropic-ai/sdk@1.12.0";
import { createClient } from "npm:@supabase/supabase-js@2.119.0";

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

// 사이트 코드에도 들어 있는 공개 키예요 (비밀 아님)
const PUBLISHABLE_KEY = "sb_publishable_qp4RAxqCQfaNPwy83u72Cg_-v2l1u6d";

const CORS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

async function translateItems(items: string[], styles: string[]): Promise<string[]> {
	const client = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });
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
	} as any);
	if (response.stop_reason === "refusal") throw new Error("refusal");
	if (response.stop_reason === "max_tokens") throw new Error("max_tokens");
	const text = response.content
		.filter((b: any) => b.type === "text")
		.map((b: any) => b.text)
		.join("");
	const { translations } = JSON.parse(text);
	if (!Array.isArray(translations) || translations.length !== items.length) throw new Error("count mismatch");
	return translations.map(String);
}

Deno.serve(async (req) => {
	if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
	if (req.method !== "POST") return json({ error: "POST only" }, 405);

	// 관리자만 쓸 수 있어요 (번역 비용이 들기 때문)
	const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY") || PUBLISHABLE_KEY, {
		global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
	});
	const { data: isAdmin } = await supabase.rpc("is_admin");
	if (!isAdmin) return json({ error: "관리자만 쓸 수 있어요." }, 401);

	const body = await req.json().catch(() => ({}));
	const items: string[] = Array.isArray(body.items) ? body.items.map(String) : [];
	const styles: string[] = Array.isArray(body.styles) ? body.styles.map(String) : [];
	if (items.length === 0) return json({ translations: [] });
	if (items.length > 200) return json({ error: "한 번에 너무 많아요." }, 400);
	if (!Deno.env.get("ANTHROPIC_API_KEY")) return json({ translations: items.map(() => ""), skipped: true });

	try {
		return json({ translations: await translateItems(items, styles) });
	} catch (e) {
		console.error(e);
		// 번역이 안 되어도 저장은 되게 해요.
		return json({ translations: items.map(() => ""), skipped: true });
	}
});
