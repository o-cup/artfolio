// 사이트가 보여줄 데이터를 가져오는 곳이에요.
// - 보통: Supabase 데이터베이스에서 최신 내용을 읽어요. (관리 화면에서 저장하면 바로 반영)
// - Supabase가 응답하지 않으면: 코드에 들어 있는 JSON 파일(예전 내용)을 대신 보여줘요.
// - 관리 화면의 [미리보기](주소에 ?preview=1): 아직 저장하지 않은 내용을 보여줘요.
import worksJson from "../components/works/worksData.json";
import exhibitionsJson from "../components/exhibitions/exhibitionsData.json";
import aboutJson from "../components/about/aboutData.json";
import { ContentKey, supabase } from "./supabase";

export const PREVIEW_KEY = "pmj_admin_preview";

type PreviewData = {
	works?: typeof worksJson;
	exhibitions?: typeof exhibitionsJson;
	about?: typeof aboutJson;
};

/** 코드에 들어 있는 예전 데이터 (Supabase가 안 될 때 대신 써요) */
export const bundledData = { works: worksJson, exhibitions: exhibitionsJson, about: aboutJson };

// 처음 열릴 때 한 번만 확인해요. (미리보기 안에서 다른 화면으로 이동해도 계속 미리보기)
const preview: PreviewData | null = (() => {
	try {
		if (!new URLSearchParams(window.location.search).has("preview")) return null;
		return JSON.parse(window.localStorage.getItem(PREVIEW_KEY) || "null");
	} catch (e) {
		return null;
	}
})();

export const isPreview = Boolean(preview);
// loadSiteData()가 끝나면 최신 내용으로 바뀌어요. (화면은 그 다음에 그려요)
export let worksData = preview?.works || worksJson; // eslint-disable-line import/no-mutable-exports
export let exhibitionsData = preview?.exhibitions || exhibitionsJson; // eslint-disable-line import/no-mutable-exports
export let aboutData = preview?.about || aboutJson; // eslint-disable-line import/no-mutable-exports

/** Supabase에서 최신 내용을 읽어요. 6초 안에 못 읽으면 예전 데이터로 그냥 보여줘요. */
export async function loadSiteData(): Promise<void> {
	if (preview) return;
	try {
		const query = supabase.from("site_content").select("key, data");
		const timeout = new Promise<never>((_, reject) => {
			setTimeout(() => reject(new Error("timeout")), 6000);
		});
		const { data, error } = await Promise.race([query, timeout]);
		if (error) throw error;
		(data || []).forEach((row: { key: ContentKey; data: unknown }) => {
			if (row.key === "works") worksData = row.data as typeof worksJson;
			if (row.key === "exhibitions") exhibitionsData = row.data as typeof exhibitionsJson;
			if (row.key === "about") aboutData = row.data as typeof aboutJson;
		});
	} catch (e) {
		console.warn("Supabase에서 데이터를 못 읽어서 예전 데이터를 보여줘요.", e);
	}
}
