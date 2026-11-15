// 사이트가 보여줄 데이터를 가져오는 곳이에요.
// 보통은 JSON 파일 그대로지만, 관리 화면의 [미리보기]에서 열렸을 때(주소에 ?preview=1)는
// 아직 저장하지 않은 내용(관리 화면이 잠깐 맡겨둔 것)을 대신 보여줘요.
import worksJson from "../components/works/worksData.json";
import exhibitionsJson from "../components/exhibitions/exhibitionsData.json";
import aboutJson from "../components/about/aboutData.json";

export const PREVIEW_KEY = "pmj_admin_preview";

type PreviewData = {
	works?: typeof worksJson;
	exhibitions?: typeof exhibitionsJson;
	about?: typeof aboutJson;
};

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
export const worksData = preview?.works || worksJson;
export const exhibitionsData = preview?.exhibitions || exhibitionsJson;
export const aboutData = preview?.about || aboutJson;
