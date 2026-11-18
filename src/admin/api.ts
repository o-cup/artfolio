// 서버(api 폴더)와 이야기하는 함수들

export class ApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

async function call<T>(url: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
	let res: Response;
	try {
		res = await fetch(url, {
			method: options.method || "GET",
			credentials: "same-origin",
			headers: options.body !== undefined ? { "Content-Type": "application/json" } : undefined,
			body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
		});
	} catch (e) {
		throw new ApiError("인터넷 연결을 확인해 주세요.", 0);
	}
	let data: any = null;
	try {
		data = await res.json();
	} catch (e) {
		data = null;
	}
	if (!res.ok) {
		if (data && data.detail) console.error(data.detail);
		throw new ApiError((data && data.error) || "문제가 생겼어요. 잠시 뒤 다시 해 주세요.", res.status);
	}
	return data as T;
}

export type MeResponse = { loggedIn: boolean; mustSetPassword: boolean; googleClientId: string | null };

export const api = {
	me: () => call<MeResponse>("/api/auth?action=me"),
	login: (password: string) => call<{ ok: true }>("/api/auth?action=login", { method: "POST", body: { password } }),
	google: (credential: string) =>
		call<{ ok: true }>("/api/auth?action=google", { method: "POST", body: { credential } }),
	setPassword: (password: string) =>
		call<{ ok: true }>("/api/auth?action=set-password", { method: "POST", body: { password } }),
	logout: () => call<{ ok: true }>("/api/auth?action=logout", { method: "POST", body: {} }),
	content: () => call<RawContent>("/api/content"),
	save: (body: SaveBody) => call<{ ok: true }>("/api/content", { method: "POST", body }),
	upload: (data: string) => call<{ blobId: string }>("/api/upload", { method: "POST", body: { data } }),
	// styles: 칸마다 "title"(영문 제목 형식) 또는 "text"(보통 문장)
	translate: (items: string[], styles?: ("title" | "text")[]) =>
		call<{ translations: string[]; skipped?: boolean }>("/api/translate", { method: "POST", body: { items, styles } }),
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
	images?: { path: string; blobId: string }[];
	deletes?: string[];
};
