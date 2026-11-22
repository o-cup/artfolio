// 어드민 화면에서 다루는 데이터 모양과, 사이트 데이터(JSON)로 바꾸는 함수들.
// 한국어/영어 짝을 하나로 묶어서(Bi) 다루고, 한국어가 바뀐 부분만 자동 번역해요.

import { api, RawAboutLang, RawContent, RawExhibition, RawWork } from "./api";

let keySeq = 0;
export const newKey = () => {
	keySeq += 1;
	return `k${keySeq}`;
};

/** 한국어 + 영어 한 쌍 */
export type Bi = { _k: string; ko: string; en: string };
export const bi = (ko = "", en = ""): Bi => ({ _k: newKey(), ko, en });

/** 사진 한 장: 이미 사이트에 있는 사진(url) 또는 새로 고른 사진(file) */
export type Photo = { key: string; url?: string; file?: File; preview?: string };
export const photoFromUrl = (url: string): Photo => ({ key: newKey(), url });
export const photoFromFile = (file: File): Photo => ({
	key: newKey(),
	file,
	preview: URL.createObjectURL(file),
});

export type Work = { id: string; year: string; title: Bi; description: Bi; images: Photo[] };

export type DateMode = "pick" | "text";
export type Exhibition = {
	id: string;
	type: string; // 한국어 구분 (개인전, 단체전 ...)
	title: Bi;
	location: Bi;
	dateMode: DateMode;
	start: string; // yyyy-mm-dd
	end: string;
	dateText: Bi; // 날짜를 직접 쓰는 경우
	poster: Photo | null;
	images: Photo[];
};

export type AboutSection = { _k: string; title: Bi; lines: Bi[] };
export type About = { name: Bi; intro: Bi; sections: AboutSection[] };

export type Model = { works: Work[]; exhibitions: Exhibition[]; about: About };

export const EXHIBITION_TYPES: { ko: string; en: string }[] = [
	{ ko: "개인전", en: "solo exhibition" },
	{ ko: "단체전", en: "group exhibition" },
	{ ko: "아트페어", en: "art fair" },
	{ ko: "저널", en: "journal" },
];
const typeEn = (ko: string) => EXHIBITION_TYPES.find((t) => t.ko === ko)?.en || ko;

// ---------- 날짜 ----------
const KO_DATE = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
const pad = (n: string | number) => String(n).padStart(2, "0");
function koToIso(s: string): string | null {
	const m = s.trim().match(KO_DATE);
	return m ? `${m[1]}-${pad(m[2])}-${pad(m[3])}` : null;
}
function isoParts(iso: string) {
	const [y, m, d] = iso.split("-");
	return { y, m: String(Number(m)), d: String(Number(d)) };
}
export function formatDates(e: Exhibition): { ko: string; en: string } {
	if (e.dateMode === "text") return { ko: e.dateText.ko, en: e.dateText.en || e.dateText.ko };
	const parts = [e.start, e.end].filter(Boolean).map(isoParts);
	return {
		ko: parts.map((p) => `${p.y}/${p.m}/${p.d}`).join(" - "),
		en: parts.map((p) => `${p.d}/${p.m}/${p.y}`).join(" - "),
	};
}

// ---------- 사이트 데이터 → 어드민 데이터 ----------
export function fromRaw(raw: RawContent): Model {
	const works = raw.works.ko.map((k, i) => {
		const e = raw.works.en.find((x) => x.id === k.id) || raw.works.en[i];
		return {
			id: k.id,
			year: k.year,
			title: bi(k.title, e?.title),
			description: bi(k.description, e?.description),
			images: k.images.map(photoFromUrl),
		};
	});

	const exhibitions = raw.exhibitions.ko.map((k, i) => {
		const e = raw.exhibitions.en.find((x) => x.id === k.id) || raw.exhibitions.en[i];
		const [s, en, ...rest] = k.date.split(" - ");
		const start = s ? koToIso(s) : null;
		const end = en ? koToIso(en) : "";
		const pickable = start !== null && end !== null && rest.length === 0;
		return {
			id: k.id,
			type: k.type,
			title: bi(k.title, e?.title),
			location: bi(k.location, e?.location),
			dateMode: (pickable ? "pick" : "text") as DateMode,
			start: start || "",
			end: end || "",
			dateText: bi(k.date, e?.date),
			poster: k.posterUrl ? photoFromUrl(k.posterUrl) : null,
			images: (k.images || []).map(photoFromUrl),
		};
	});

	const ko = raw.about.ko;
	const en = raw.about.en;
	const about: About = {
		name: bi(ko.artist.name, en.artist.name),
		intro: bi(ko.artist.about, en.artist.about),
		sections: ko.histories.map((h, i) => ({
			_k: newKey(),
			title: bi(h.title, en.histories[i]?.title),
			lines: h.details.map((d, j) => bi(d, en.histories[i]?.details[j])),
		})),
	};

	return { works, exhibitions, about };
}

// ---------- 어드민 데이터 → 사이트 데이터 ----------
const urls = (photos: Photo[]) => photos.map((p) => p.url).filter((u): u is string => Boolean(u));

export function worksToRaw(works: Work[]): RawContent["works"] {
	const make = (lang: "ko" | "en"): RawWork[] =>
		works.map((w) => {
			const images = urls(w.images);
			return {
				id: w.id,
				title: w.title[lang] || w.title.ko,
				year: w.year,
				description: w.description[lang] || w.description.ko,
				images,
				imgCount: images.length,
			};
		});
	return { en: make("en"), ko: make("ko") };
}

export function exhibitionsToRaw(list: Exhibition[]): RawContent["exhibitions"] {
	const make = (lang: "ko" | "en"): RawExhibition[] =>
		list.map((x) => {
			const images = urls(x.images);
			const dates = formatDates(x);
			return {
				id: x.id,
				type: lang === "ko" ? x.type : typeEn(x.type),
				title: x.title[lang] || x.title.ko,
				date: dates[lang],
				location: x.location[lang] || x.location.ko,
				posterUrl: x.poster?.url || "",
				imgCount: images.length,
				images,
			};
		});
	return { ko: make("ko"), en: make("en") };
}

export function aboutToRaw(a: About): RawContent["about"] {
	const make = (lang: "ko" | "en"): RawAboutLang => ({
		artist: { name: a.name[lang] || a.name.ko, about: a.intro[lang] || a.intro.ko },
		histories: a.sections.map((s) => ({
			title: s.title[lang] || s.title.ko,
			details: s.lines.filter((l) => l.ko.trim()).map((l) => l[lang] || l.ko),
		})),
	});
	return { en: make("en"), ko: make("ko") };
}

// ---------- 새 번호 ----------
export function nextId(ids: string[]): string {
	const max = ids.reduce((m, id) => Math.max(m, Number(id) || 0), 0);
	return String(max + 1).padStart(2, "0");
}

// ---------- 자동 번역 ----------
function collectBi(value: unknown, out: Bi[], path: string, styles?: Map<string, TranslateStyle>): Bi[] {
	if (Array.isArray(value)) value.forEach((v, i) => collectBi(v, out, `${path}.${i}`, styles));
	else if (value && typeof value === "object" && !(value instanceof File)) {
		const o = value as Record<string, unknown>;
		if (typeof o._k === "string" && typeof o.ko === "string" && typeof o.en === "string") {
			out.push(o as Bi);
			styles?.set(o._k, styleForPath(path));
		} else Object.entries(o).forEach(([k, v]) => collectBi(v, out, `${path}.${k}`, styles));
	}
	return out;
}

/**
 * 번역 방식: "title" = 영문 제목 형식(단어 첫 글자 대문자, and·of 같은 짧은 단어는 소문자)
 * 작업 제목, 전시 제목, 장소, 이력 줄은 제목 형식. 설명·소개글·카테고리 이름 등은 보통 문장.
 */
export type TranslateStyle = "title" | "text";
function styleForPath(path: string): TranslateStyle {
	if (/\.sections\.\d+\.title$/.test(path)) return "text"; // 이력 카테고리 이름 (사이트는 소문자: solo exhibition)
	if (/\.(title|location)$/.test(path) || /\.lines\.\d+$/.test(path)) return "title";
	return "text";
}

/** 원래 값(orig)과 비교해서, 한국어가 새로 쓰였거나 바뀌었는데 영어는 손대지 않은 칸만 번역해요. */
export async function autoTranslate<T>(current: T, orig: unknown): Promise<{ value: T; failed: boolean }> {
	const before = new Map(collectBi(orig, [], "").map((b) => [b._k, b]));
	const value = JSON.parse(JSON.stringify(current, (k, v) => (v instanceof File ? undefined : v))) as T;
	// File 객체는 JSON으로 복사되지 않으니, 사진 정보는 원래 객체를 그대로 다시 넣어요.
	restoreFiles(value, current);

	const styles = new Map<string, TranslateStyle>();
	const todo = collectBi(value, [], "", styles).filter((b) => {
		const o = before.get(b._k);
		if (!b.ko.trim()) return false;
		if (!b.en.trim()) return true; // 영어칸이 비어 있으면 자동 번역
		// 예전에 번역이 안 돼서 한국어가 그대로 들어간 칸도 다시 번역해요
		if (b.en === b.ko && /[가-힣]/.test(b.ko)) return true;
		if (!o) return false; // 새로 생긴 칸인데 영어를 직접 썼다면 그대로
		return b.ko !== o.ko && b.en === o.en;
	});
	if (todo.length === 0) return { value, failed: false };

	let failed = false;
	try {
		const { translations, skipped } = await api.translate(
			todo.map((b) => b.ko),
			todo.map((b) => styles.get(b._k) || "text")
		);
		failed = Boolean(skipped);
		todo.forEach((b, i) => {
			// 번역이 안 되면 일단 한국어를 그대로 넣어요. 다음에 저장할 때 이런 칸을 다시 번역해요.
			// eslint-disable-next-line no-param-reassign
			b.en = translations[i] || b.ko;
		});
	} catch (e) {
		failed = true;
		todo.forEach((b) => {
			// eslint-disable-next-line no-param-reassign
			b.en = b.ko;
		});
	}
	return { value, failed };
}

function restoreFiles(target: any, source: any) {
	if (Array.isArray(source)) source.forEach((s, i) => restoreFiles(target[i], s));
	else if (source && typeof source === "object") {
		Object.keys(source).forEach((k) => {
			if (source[k] instanceof File) {
				// eslint-disable-next-line no-param-reassign
				target[k] = source[k];
			} else restoreFiles(target[k], source[k]);
		});
	}
}

// ---------- 사진 줄이기 + 올리기 ----------
function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error("decode"));
		img.src = src;
	});
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
	return new Promise((resolve) => {
		canvas.toBlob((b) => resolve(b), "image/jpeg", quality);
	});
}

/** 사진을 웹용 크기(긴 쪽 2400px, JPG)로 줄여요. */
export async function shrinkPhoto(file: File): Promise<Blob> {
	const src = URL.createObjectURL(file);
	let img: HTMLImageElement;
	try {
		img = await loadImage(src);
	} catch (e) {
		throw new Error(
			`'${file.name}' 사진은 열 수 없는 형식이에요. JPG나 PNG 사진으로 다시 골라 주세요.`
		);
	} finally {
		URL.revokeObjectURL(src);
	}
	const attempts: [number, number][] = [
		[2400, 0.86],
		[2400, 0.75],
		[2000, 0.75],
		[1600, 0.7],
	];
	for (const [maxSide, quality] of attempts) {
		const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
		const canvas = document.createElement("canvas");
		canvas.width = Math.round(img.naturalWidth * scale);
		canvas.height = Math.round(img.naturalHeight * scale);
		const ctx = canvas.getContext("2d");
		if (!ctx) break;
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		// eslint-disable-next-line no-await-in-loop
		const blob = await canvasToJpeg(canvas, quality);
		if (blob && blob.size < 2_300_000) return blob;
	}
	throw new Error(`'${file.name}' 사진이 너무 커요. 다른 사진으로 골라 주세요.`);
}

/**
 * 새로 고른 사진들을 Supabase 사진 보관함에 올리고, 주소(url)를 붙여줘요.
 * folder 예: "works/04" → https://…/photos/works/04/lq3k9x-1.jpg
 */
export async function uploadPhotos(
	photos: Photo[],
	folder: string,
	onProgress: (done: number, total: number) => void,
	namePrefix = ""
): Promise<void> {
	const pending = photos.filter((p) => p.file && !p.url);
	const stamp = Date.now().toString(36);
	for (let i = 0; i < pending.length; i += 1) {
		onProgress(i, pending.length);
		const photo = pending[i];
		const blob = await shrinkPhoto(photo.file as File);
		photo.url = await api.upload(blob, `${folder}/${namePrefix}${stamp}-${i + 1}.jpg`);
	}
	onProgress(pending.length, pending.length);
}

/** 원래 있던 사진 중 빠진 것들의 주소 (보관함에 있는 사진만 실제로 지워져요) */
export function removedPhotos(before: Photo[], after: Photo[]): string[] {
	const keep = new Set(urls(after));
	return urls(before).filter((u) => !keep.has(u));
}

// ---------- 예전 사진 옮기기 (한 번만) ----------
/** 사이트 폴더(public)에 있던 예전 사진 주소: "/works/01/1.jpeg" 처럼 / 로 시작해요 */
const isOldPhoto = (u: string) => u.startsWith("/");

function allPhotoUrls(raw: RawContent): string[] {
	const out: string[] = [];
	[...raw.works.ko, ...raw.works.en].forEach((w) => out.push(...w.images));
	[...raw.exhibitions.ko, ...raw.exhibitions.en].forEach((x) => {
		if (x.posterUrl) out.push(x.posterUrl);
		out.push(...(x.images || []));
	});
	return out;
}

export const oldPhotoCount = (raw: RawContent) => new Set(allPhotoUrls(raw).filter(isOldPhoto)).size;

/**
 * 예전 사진을 웹용 크기로 줄여서 Supabase 사진 보관함으로 옮기고, 주소를 바꾼 새 데이터를 돌려줘요.
 * 중간에 멈춰도 다시 하면 처음부터 덮어써요.
 */
export async function moveOldPhotos(
	raw: RawContent,
	onProgress: (done: number, total: number) => void
): Promise<Pick<RawContent, "works" | "exhibitions">> {
	const todo = Array.from(new Set(allPhotoUrls(raw).filter(isOldPhoto)));
	const moved = new Map<string, string>();
	let done = 0;
	onProgress(0, todo.length);

	const moveOne = async (url: string) => {
		const res = await fetch(url);
		if (!res.ok) throw new Error(`예전 사진(${url})을 찾지 못했어요.`);
		const name = url.split("/").pop() || "photo";
		const blob = await shrinkPhoto(new File([await res.blob()], name));
		// "/works/01/1.jpeg" → "works/01/1.jpg"
		const path = `${url.slice(1).replace(/\.(jpe?g|png)$/i, "")}.jpg`;
		moved.set(url, await api.upload(blob, path, true));
		done += 1;
		onProgress(done, todo.length);
	};

	// 두 장씩 같이 옮겨요 (너무 많이 하면 컴퓨터가 버거워요)
	let next = 0;
	const worker = async () => {
		while (next < todo.length) {
			const url = todo[next];
			next += 1;
			await moveOne(url); // eslint-disable-line no-await-in-loop
		}
	};
	await Promise.all([worker(), worker()]);

	const swap = (u: string) => moved.get(u) || u;
	const works = {
		ko: raw.works.ko.map((w) => ({ ...w, images: w.images.map(swap) })),
		en: raw.works.en.map((w) => ({ ...w, images: w.images.map(swap) })),
	};
	const fixEx = (x: RawExhibition) => ({
		...x,
		posterUrl: x.posterUrl ? swap(x.posterUrl) : "",
		images: (x.images || []).map(swap),
	});
	const exhibitions = { ko: raw.exhibitions.ko.map(fixEx), en: raw.exhibitions.en.map(fixEx) };
	return { works, exhibitions };
}

// ---------- 미리보기 ----------
/** 아직 올리지 않은 사진도 미리보기에서 보이도록, 화면에 보이는 주소를 그대로 써요. */
export const asPreviewPhoto = (p: Photo): Photo => ({ ...p, url: p.preview || p.url });
export const workForPreview = (w: Work): Work => ({ ...w, images: w.images.map(asPreviewPhoto) });
export const exhibitionForPreview = (x: Exhibition): Exhibition => ({
	...x,
	poster: x.poster ? asPreviewPhoto(x.poster) : null,
	images: x.images.map(asPreviewPhoto),
});

// ---------- 한국어 조사 ----------
/** "개인전" → "개인전을", "<STRANGER 단체전>" → "<STRANGER 단체전>을", "Vanity" → "Vanity를" */
export function withEulReul(word: string): string {
	const chars = word.split("").filter((c) => /[가-힣ㄱ-ㅣA-Za-z0-9]/.test(c));
	const last = chars[chars.length - 1] || "";
	let batchim = false;
	if (/[가-힣]/.test(last)) batchim = (last.charCodeAt(0) - 0xac00) % 28 !== 0;
	else if (/[ㄱ-ㅎ]/.test(last)) batchim = true; // 자음 이름(기역, 니은…)은 모두 받침이 있어요
	else if (/[0-9]/.test(last)) batchim = "013678".includes(last);
	else if (/[A-Za-z]/.test(last)) batchim = "lmnLMN".includes(last);
	return `${word}${batchim ? "을" : "를"}`;
}
