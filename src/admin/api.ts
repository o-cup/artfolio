// Supabase(데이터베이스·사진 보관함·로그인)와 이야기하는 함수들
import { bundledData } from "../shared/siteData";
import { ContentKey, PHOTO_BASE, PHOTO_BUCKET, supabase } from "../shared/supabase";

export class ApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

const NETWORK = "인터넷 연결을 확인해 주세요.";

function fail(e: { message?: string; status?: number } | null, fallback: string): never {
	if (e?.message) console.error(e.message);
	const msg = e?.message || "";
	if (/fetch|network/i.test(msg)) throw new ApiError(NETWORK, 0);
	throw new ApiError(fallback, e?.status || 500);
}

const KEYS: ContentKey[] = ["works", "exhibitions", "about"];

export const api = {
	/** 로그인돼 있으면 이메일, 아니면 null */
	me: async (): Promise<string | null> => {
		const { data } = await supabase.auth.getSession();
		return data.session?.user.email || null;
	},
	login: async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
		if (!error) return;
		if (/invalid login|invalid credentials/i.test(error.message)) {
			throw new ApiError("이메일이나 비밀번호가 맞지 않아요.", 400);
		}
		fail(error, "로그인하지 못했어요. 잠시 뒤 다시 해 주세요.");
	},
	/** 비밀번호 재설정 메일 보내기. 메일 속 링크를 누르면 /admin/reset 으로 와요. */
	sendResetMail: async (email: string) => {
		const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
			redirectTo: `${window.location.origin}/admin/reset`,
		});
		if (error && /rate limit|seconds/i.test(error.message)) {
			throw new ApiError("메일을 너무 자주 보냈어요. 1시간쯤 뒤에 다시 해 주세요.", 429);
		}
		if (error) fail(error, "메일을 보내지 못했어요. 잠시 뒤 다시 해 주세요.");
	},
	setPassword: async (password: string) => {
		const { error } = await supabase.auth.updateUser({ password });
		if (error && /different from the old/i.test(error.message)) {
			throw new ApiError("지금 쓰는 비밀번호와 다른 비밀번호로 만들어 주세요.", 400);
		}
		if (error) fail(error, "비밀번호를 바꾸지 못했어요. 잠시 뒤 다시 해 주세요.");
	},
	logout: async () => {
		await supabase.auth.signOut();
	},
	/** 데이터베이스에서 내용을 읽어요. 아직 없는 부분은 예전 JSON으로 채워서 한 번 저장해 둬요. */
	content: async (): Promise<RawContent> => {
		const { data, error } = await supabase.from("site_content").select("key, data");
		if (error) fail(error, "내용을 불러오지 못했어요. 잠시 뒤 다시 해 주세요.");
		const found = new Map((data || []).map((r: { key: ContentKey; data: any }) => [r.key, r.data]));
		const missing = KEYS.filter((k) => !found.has(k));
		if (missing.length > 0) {
			const rows = missing.map((key) => ({ key, data: bundledData[key] }));
			const { error: seedError } = await supabase.from("site_content").upsert(rows);
			if (seedError) fail(seedError, "처음 내용을 옮기지 못했어요. 관리자 이메일 설정을 확인해 주세요.");
			rows.forEach((r) => found.set(r.key, r.data));
		}
		return {
			works: found.get("works"),
			exhibitions: found.get("exhibitions"),
			about: found.get("about"),
			rawBase: "",
		};
	},
	/** 바뀐 내용을 저장하고, 빠진 사진은 보관함에서 지워요. */
	save: async (body: SaveBody) => {
		const rows = Object.entries(body.files).map(([key, data]) => ({
			key,
			data,
			updated_at: new Date().toISOString(),
		}));
		if (rows.length > 0) {
			const { error } = await supabase.from("site_content").upsert(rows);
			if (error) fail(error, "저장하다가 문제가 생겼어요. 잠시 뒤 다시 해 주세요.");
		}
		const paths = (body.deletes || [])
			.filter((u) => u.startsWith(PHOTO_BASE))
			.map((u) => decodeURIComponent(u.slice(PHOTO_BASE.length)));
		if (paths.length > 0) {
			// 사진 지우기가 실패해도 저장은 된 거라 그냥 넘어가요.
			const { error } = await supabase.storage.from(PHOTO_BUCKET).remove(paths);
			if (error) console.error(error.message);
		}
	},
	/** 사진 한 장(JPG)을 보관함에 올리고 주소를 돌려줘요. path 예: "works/04/abc-1.jpg" */
	upload: async (blob: Blob, path: string, overwrite = false): Promise<string> => {
		const { error } = await supabase.storage
			.from(PHOTO_BUCKET)
			.upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000", upsert: overwrite });
		if (error) fail(error as any, "사진을 올리다가 문제가 생겼어요.");
		return `${PHOTO_BASE}${path}`;
	},
	// styles: 칸마다 "title"(영문 제목 형식) 또는 "text"(보통 문장)
	translate: async (items: string[], styles?: ("title" | "text")[]) => {
		const { data, error } = await supabase.functions.invoke("translate", { body: { items, styles } });
		if (error) fail(error as any, "번역하지 못했어요.");
		return data as { translations: string[]; skipped?: boolean };
	},
};

// ----- 사이트에 저장되는 원래 데이터 모양 -----
export type RawWork = {
	id: string;
	title: string;
	year: string;
	description: string;
	images: string[];
	imgCount: number;
};
export type RawExhibition = {
	id: string;
	type: string;
	title: string;
	date: string;
	location: string;
	posterUrl: string;
	imgCount: number;
	images: string[];
};
export type RawAboutLang = {
	artist: { name: string; about: string };
	histories: { title: string; details: string[] }[];
};
export type RawContent = {
	works: { ko: RawWork[]; en: RawWork[] };
	exhibitions: { ko: RawExhibition[]; en: RawExhibition[] };
	about: { ko: RawAboutLang; en: RawAboutLang };
	rawBase: string;
};
export type SaveBody = {
	message: string;
	files: Partial<Pick<RawContent, "works" | "exhibitions" | "about">>;
	/** 빠진 사진 주소들 (보관함에 있는 사진만 실제로 지워요) */
	deletes?: string[];
};
