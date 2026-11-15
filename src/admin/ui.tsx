// 여러 화면에서 같이 쓰는 부품들: 알림창, 저장 진행창, 입력칸, 사진 고르기

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Bi, Photo, photoFromFile } from "./model";
import type { RawContent } from "./api";
import { PREVIEW_KEY } from "../shared/siteData";

// ---------- 아이콘 (Google Material Symbols Rounded) ----------
// 기본 설정: fill 0 · weight 300 · grade -25 · optical size 48
// (사진 빼기 버튼만 fill 1 · weight 400 이라서 그 범위까지 함께 불러와요)
// 새 아이콘을 쓰려면 ICON_NAMES에 이름을 추가해야 해요 (구글이 쓰는 아이콘만 골라서 내려줘요).
const ICON_NAMES = [
	"add",
	"arrow_back",
	"arrow_downward",
	"arrow_forward",
	"arrow_outward",
	"arrow_upward",
	"calendar_month",
	"cancel",
	"check",
	"chevron_left",
	"chevron_right",
	"delete",
	"visibility",
	"visibility_off",
] as const;
export type IconName = typeof ICON_NAMES[number];

export function loadIconFont() {
	const id = "adm-material-symbols";
	if (document.getElementById(id)) return;
	const link = document.createElement("link");
	link.id = id;
	link.rel = "stylesheet";
	link.href = `https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,300..400,0..1,-25&icon_names=${[
		...ICON_NAMES,
	]
		.sort()
		.join(",")}&display=block`;
	document.head.appendChild(link);
}

export function Icon({ name }: { name: IconName }) {
	return (
		<span className="adm-icon" aria-hidden="true">
			{name}
		</span>
	);
}

// ---------- 알림/확인 창 ----------
type ConfirmOptions = {
	title: string;
	message?: React.ReactNode;
	ok: string;
	cancel?: string;
	danger?: boolean;
};
type Progress = { title: string; detail?: string } | null;
type Done = { title: string; message?: React.ReactNode; button?: string } | null;

type DialogApi = {
	confirm: (o: ConfirmOptions) => Promise<boolean>;
	setProgress: (p: Progress) => void;
	showDone: (d: NonNullable<Done>) => Promise<void>;
	/** 잠깐 떴다가 사라지는 알림 (한 줄씩) */
	showToast: (lines: string[]) => void;
	/**
	 * 화면을 어둡게 하고 로딩 표시만 보여주면서 일을 처리해요.
	 * 실제로 금방 끝나도 최소 1초는 보여줘서 화면이 깜빡이는 느낌이 없게 해요.
	 */
	withSpinner: <T>(work: () => Promise<T>) => Promise<T>;
};

const MIN_SPINNER_MS = 1000;
const DialogContext = createContext<DialogApi | null>(null);
export const useDialog = () => useContext(DialogContext) as DialogApi;

export function DialogProvider({ children }: { children: React.ReactNode }) {
	const [confirmState, setConfirmState] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(
		null
	);
	const [progress, setProgress] = useState<Progress>(null);
	const [done, setDone] = useState<(NonNullable<Done> & { resolve: () => void }) | null>(null);

	const confirm = useCallback(
		(o: ConfirmOptions) => new Promise<boolean>((resolve) => setConfirmState({ ...o, resolve })),
		[]
	);
	const showDone = useCallback(
		(d: NonNullable<Done>) => new Promise<void>((resolve) => setDone({ ...d, resolve })),
		[]
	);
	const [toast, setToast] = useState<{ id: number; lines: string[] } | null>(null);
	const toastTimer = useRef<number>();
	const showToast = useCallback((lines: string[]) => {
		window.clearTimeout(toastTimer.current);
		setToast({ id: Date.now(), lines });
		toastTimer.current = window.setTimeout(() => setToast(null), 3500);
	}, []);
	useEffect(() => () => window.clearTimeout(toastTimer.current), []);

	const [spinning, setSpinning] = useState(false);
	const withSpinner = useCallback(async <T,>(work: () => Promise<T>): Promise<T> => {
		setSpinning(true);
		const minTime = new Promise((resolve) => window.setTimeout(resolve, MIN_SPINNER_MS));
		try {
			const result = await work();
			await minTime;
			return result;
		} finally {
			await minTime;
			setSpinning(false);
		}
	}, []);

	const value = useMemo(
		() => ({ confirm, setProgress, showDone, showToast, withSpinner }),
		[confirm, showDone, showToast, withSpinner]
	);

	const closeConfirm = (v: boolean) => {
		confirmState?.resolve(v);
		setConfirmState(null);
	};

	return (
		<DialogContext.Provider value={value}>
			{children}
			{confirmState && (
				<div className="adm-overlay" role="dialog" aria-modal="true">
					<div className="adm-dialog">
						<h2>{confirmState.title}</h2>
						{confirmState.message && <div className="adm-dialog-msg">{confirmState.message}</div>}
						<div className="actions">
							<button type="button" className="adm-btn" onClick={() => closeConfirm(false)}>
								{confirmState.cancel || "아니요"}
							</button>
							<button
								type="button"
								// eslint-disable-next-line jsx-a11y/no-autofocus
								autoFocus
								className={`adm-btn ${confirmState.danger ? "warning" : "primary"}`}
								onClick={() => closeConfirm(true)}
							>
								{confirmState.ok}
							</button>
						</div>
					</div>
				</div>
			)}
			{spinning && (
				<div className="adm-overlay" role="alert" aria-busy="true" aria-label="저장하는 중">
					<div className="adm-spinner on-dim" />
				</div>
			)}
			{progress && (
				<div className="adm-overlay" role="alertdialog" aria-live="polite">
					<div className="adm-dialog">
						<div className="adm-spinner" />
						<h2>{progress.title}</h2>
						{progress.detail && <p className="adm-muted">{progress.detail}</p>}
						<p className="adm-muted adm-small">이 창을 닫지 말고 잠시만 기다려 주세요.</p>
					</div>
				</div>
			)}
			{toast && (
				<div key={toast.id} className="adm-toast" role="status" aria-live="polite">
					{toast.lines.map((line) => (
						<p key={line}>{line}</p>
					))}
				</div>
			)}
			{done && (
				<div className="adm-overlay" role="dialog" aria-modal="true">
					<div className="adm-dialog">
						<h2>{done.title}</h2>
						{done.message && <div className="adm-dialog-msg">{done.message}</div>}
						<div className="actions">
							<button
								type="button"
								// eslint-disable-next-line jsx-a11y/no-autofocus
								autoFocus
								className="adm-btn big primary"
								onClick={() => {
									done.resolve();
									setDone(null);
								}}
							>
								{done.button || "확인"}
							</button>
						</div>
					</div>
				</div>
			)}
		</DialogContext.Provider>
	);
}

// ---------- 입력칸 (한국어 + 선택적으로 영어) ----------
type BiFieldProps = {
	label: string;
	hint?: string;
	value: Bi;
	onChange: (v: Bi) => void;
	multiline?: boolean;
	showEn: boolean;
	placeholder?: string;
	big?: boolean;
	/** 긴 한 줄짜리 글(이력 등): 칸 안에서 줄이 넘어가게 */
	wrap?: boolean;
};
export function BiField({ label, hint, value, onChange, multiline, showEn, placeholder, big, wrap }: BiFieldProps) {
	const id = `f-${value._k}`;
	const Tag = multiline || wrap ? "textarea" : "input";
	const cls = (multiline && "adm-textarea") || (wrap && "adm-textarea line") || "adm-input";
	return (
		<div className="adm-field">
			<label className="adm-label" htmlFor={id}>
				{label}
			</label>
			{hint && <span className="adm-hint">{hint}</span>}
			<Tag
				id={id}
				className={cls}
				rows={wrap ? 2 : undefined}
				style={multiline && big ? { minHeight: 360 } : undefined}
				value={value.ko}
				placeholder={placeholder}
				onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
					onChange({ ...value, ko: e.target.value })
				}
			/>
			{showEn && (
				<>
					<span className="adm-en-label">
						영어칸은 비워두면 자동으로 번역되고, 입력하면 입력한 내용이 반영돼요.
					</span>
					<Tag
						className={`${cls} en`}
						rows={wrap ? 2 : undefined}
						value={value.en}
						aria-label={`${label} 영어`}
						onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
							onChange({ ...value, en: e.target.value })
						}
					/>
				</>
			)}
		</div>
	);
}

export function TextField({
	label,
	hint,
	value,
	onChange,
	type = "text",
	placeholder,
	inputMode,
}: {
	label: string;
	hint?: string;
	value: string;
	onChange: (v: string) => void;
	type?: string;
	placeholder?: string;
	inputMode?: "numeric" | "text";
}) {
	const id = useRef(`t-${Math.random().toString(36).slice(2)}`).current;
	return (
		<div className="adm-field">
			<label className="adm-label" htmlFor={id}>
				{label}
			</label>
			{hint && <span className="adm-hint">{hint}</span>}
			<input
				id={id}
				className="adm-input"
				type={type}
				value={value}
				placeholder={placeholder}
				inputMode={inputMode}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
}

// ---------- 날짜 고르기 (큰 달력) ----------
// 브라우저 기본 달력은 너무 작고 모양을 바꿀 수 없어서 직접 만들었어요.
// 값은 "2025-06-21" 형식으로 주고받아요.
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const pad2 = (n: number) => String(n).padStart(2, "0");
const toIso = (y: number, m: number, d: number) => `${y}-${pad2(m + 1)}-${pad2(d)}`;
const parseIso = (v: string) => {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
	return m ? { y: Number(m[1]), m: Number(m[2]) - 1, d: Number(m[3]) } : null;
};
export const formatKoDate = (v: string) => {
	const p = parseIso(v);
	return p ? `${p.y}년 ${p.m + 1}월 ${p.d}일` : "";
};

export function DateField({
	label,
	value,
	onChange,
	placeholder = "날짜를 골라 주세요",
	openAt = "",
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	/** 값이 비어 있을 때 달력을 처음 열 날짜 (예: 종료일은 시작일 달부터) */
	openAt?: string;
}) {
	const id = useRef(`d-${Math.random().toString(36).slice(2)}`).current;
	const [open, setOpen] = useState(false);
	const wrapRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

	const close = useCallback(() => {
		setOpen(false);
		triggerRef.current?.focus();
	}, []);

	useEffect(() => {
		if (!open) return undefined;
		const onDown = (e: MouseEvent) => {
			if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
		};
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
		document.addEventListener("mousedown", onDown);
		window.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDown);
			window.removeEventListener("keydown", onKey);
		};
	}, [open, close]);

	return (
		<div className="adm-field adm-date" ref={wrapRef}>
			<label className="adm-label" htmlFor={id}>
				{label}
			</label>
			<button
				id={id}
				ref={triggerRef}
				type="button"
				className={`adm-input adm-date-trigger ${value ? "" : "empty"}`}
				aria-haspopup="dialog"
				aria-expanded={open}
				onClick={() => setOpen(!open)}
			>
				<span>{value ? formatKoDate(value) : placeholder}</span>
				<Icon name="calendar_month" />
			</button>
			{open && (
				<>
					<div className="adm-cal-dim" onClick={() => setOpen(false)} aria-hidden="true" />
					<Calendar
						label={label}
						value={value}
						openAt={openAt}
						onPick={(v) => {
							onChange(v);
							close();
						}}
						onClear={() => {
							onChange("");
							close();
						}}
						onClose={close}
					/>
				</>
			)}
		</div>
	);
}

function Calendar({
	label,
	value,
	openAt,
	onPick,
	onClear,
	onClose,
}: {
	label: string;
	value: string;
	openAt: string;
	onPick: (v: string) => void;
	onClear: () => void;
	onClose: () => void;
}) {
	const now = new Date();
	const todayIso = toIso(now.getFullYear(), now.getMonth(), now.getDate());
	const picked = parseIso(value) || parseIso(openAt);
	const [year, setYear] = useState(picked ? picked.y : now.getFullYear());
	const [month, setMonth] = useState(picked ? picked.m : now.getMonth());
	// "days": 날짜 고르기, "months": 연도·월 빨리 고르기 (몇 년 전 전시도 쉽게)
	const [view, setView] = useState<"days" | "months">("days");
	const ref = useRef<HTMLDivElement>(null);
	// 달력이 화면 아래로 잘리지 않게, 열리면 보이는 곳까지 스크롤해요.
	useEffect(() => {
		ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
	}, []);

	const step = (d: number) => {
		const t = new Date(year, month + d, 1);
		setYear(t.getFullYear());
		setMonth(t.getMonth());
	};

	const first = new Date(year, month, 1).getDay();
	const count = new Date(year, month + 1, 0).getDate();
	const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
	while (cells.length % 7) cells.push(null);

	return (
		<div className="adm-cal" ref={ref} role="dialog" aria-label={`${label} 고르기`}>
			{view === "days" ? (
				<>
					<div className="adm-cal-head">
						<button type="button" className="adm-cal-nav" onClick={() => step(-1)} aria-label="이전 달">
							<Icon name="chevron_left" />
						</button>
						<button type="button" className="adm-cal-title" onClick={() => setView("months")}>
							{year}년 {month + 1}월
						</button>
						<button type="button" className="adm-cal-nav" onClick={() => step(1)} aria-label="다음 달">
							<Icon name="chevron_right" />
						</button>
					</div>
					<div className="adm-cal-grid" role="grid">
						{WEEKDAYS.map((w) => (
							<span key={w} className="adm-cal-wd" role="columnheader">
								{w}
							</span>
						))}
						{cells.map((d, i) =>
							d === null ? (
								// eslint-disable-next-line react/no-array-index-key
								<span key={`e${i}`} />
							) : (
								<button
									key={d}
									type="button"
									className={`adm-cal-day ${toIso(year, month, d) === value ? "on" : ""} ${
										toIso(year, month, d) === todayIso ? "today" : ""
									}`}
									aria-pressed={toIso(year, month, d) === value}
									aria-label={`${year}년 ${month + 1}월 ${d}일`}
									onClick={() => onPick(toIso(year, month, d))}
								>
									{d}
								</button>
							)
						)}
					</div>
				</>
			) : (
				<>
					<div className="adm-cal-head">
						<button type="button" className="adm-cal-nav" onClick={() => setYear(year - 1)} aria-label="이전 해">
							<Icon name="chevron_left" />
						</button>
						<span className="adm-cal-title static">{year}년</span>
						<button type="button" className="adm-cal-nav" onClick={() => setYear(year + 1)} aria-label="다음 해">
							<Icon name="chevron_right" />
						</button>
					</div>
					<div className="adm-cal-months">
						{Array.from({ length: 12 }, (_, m) => (
							<button
								key={m}
								type="button"
								className={`adm-cal-month ${m === month ? "on" : ""}`}
								onClick={() => {
									setMonth(m);
									setView("days");
								}}
							>
								{m + 1}월
							</button>
						))}
					</div>
				</>
			)}
			<div className="adm-cal-foot">
				{value ? (
					<button type="button" className="adm-btn text" onClick={onClear}>
						날짜 지우기
					</button>
				) : (
					<span />
				)}
				<div className="adm-cal-foot-right">
					<button type="button" className="adm-btn" onClick={onClose}>
						닫기
					</button>
					<button type="button" className="adm-btn secondary" onClick={() => onPick(todayIso)}>
						오늘
					</button>
				</div>
			</div>
		</div>
	);
}

// ---------- 사진 ----------
/** 새로 추가한(아직 저장 안 한) 사진 표시: 초록색 점 */
export function NewDot({ label = "새 사진" }: { label?: string }) {
	return (
		<svg className="adm-new-dot" width="8" height="8" viewBox="0 0 8 8" role="img" aria-label={label}>
			<title>{label}</title>
			<circle cx="4" cy="4" r="4" />
		</svg>
	);
}

export function photoSrc(p: Photo) {
	return p.preview || p.url || "";
}

/** 사이트에 아직 반영되기 전 사진은 GitHub에서 대신 보여줘요. */
export function SmartImg({
	src,
	rawBase,
	className,
	alt,
}: {
	src: string;
	rawBase: string;
	className?: string;
	alt: string;
}) {
	const [failed, setFailed] = useState(false);
	const real = failed && rawBase && src.startsWith("/") ? `${rawBase}${src}` : src;
	return <img className={className} src={real} alt={alt} onError={() => setFailed(true)} loading="lazy" />;
}

const ACCEPT = "image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.heic";

function useFilePicker(onFiles: (files: File[]) => void, multiple: boolean) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [drag, setDrag] = useState(false);
	const input = (
		<input
			ref={inputRef}
			type="file"
			accept={ACCEPT}
			multiple={multiple}
			style={{ display: "none" }}
			onChange={(e) => {
				const files = Array.from(e.target.files || []);
				if (files.length) onFiles(files);
				e.target.value = "";
			}}
		/>
	);
	const dropProps = {
		onDragOver: (e: React.DragEvent) => {
			e.preventDefault();
			setDrag(true);
		},
		onDragLeave: () => setDrag(false),
		onDrop: (e: React.DragEvent) => {
			e.preventDefault();
			setDrag(false);
			const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
			if (files.length) onFiles(multiple ? files : files.slice(0, 1));
		},
	};
	return { input, open: () => inputRef.current?.click(), drag, dropProps };
}

export function PhotoGrid({
	photos,
	onChange,
	rawBase,
	coverLabel,
}: {
	photos: Photo[];
	onChange: (p: Photo[]) => void;
	rawBase: string;
	coverLabel?: string;
}) {
	const picker = useFilePicker((files) => onChange([...photos, ...files.map(photoFromFile)]), true);
	const move = (i: number, d: number) => {
		const next = [...photos];
		const [item] = next.splice(i, 1);
		next.splice(i + d, 0, item);
		onChange(next);
	};
	return (
		<div className="adm-photos">
			{photos.map((p, i) => (
				<div key={p.key} className={`adm-photo ${i === 0 && coverLabel ? "cover" : ""}`}>
					<div className="adm-photo-thumb">
						<SmartImg src={photoSrc(p)} rawBase={rawBase} alt={`${i + 1}번 사진`} />
						<button
							type="button"
							className="adm-photo-remove"
							aria-label={`${i + 1}번 사진 빼기`}
							title="이 사진 빼기"
							onClick={() => onChange(photos.filter((x) => x.key !== p.key))}
						>
							<Icon name="cancel" />
						</button>
					</div>
					<div className="adm-photo-label">
						<span className="adm-tag number" aria-label={`${i + 1}번`}>
							{i + 1}
						</span>
						{i === 0 && coverLabel && <span className="adm-tag positive">{coverLabel}</span>}
						{p.file && <NewDot />}
					</div>
					<div className="adm-photo-actions">
						<button
							type="button"
							className="adm-btn small"
							disabled={i === 0}
							onClick={() => move(i, -1)}
							aria-label="앞으로"
							title="앞으로"
						>
							<Icon name="arrow_back" />
						</button>
						<button
							type="button"
							className="adm-btn small"
							disabled={i === photos.length - 1}
							onClick={() => move(i, 1)}
							aria-label="뒤로"
							title="뒤로"
						>
							<Icon name="arrow_forward" />
						</button>
					</div>
				</div>
			))}
			<button
				type="button"
				className={`adm-add-photo ${picker.drag ? "drag" : ""}`}
				onClick={picker.open}
				{...picker.dropProps}
			>
				<span className="plus"><Icon name="add" /></span>
				사진 추가
				<span className="adm-hint">여러 장을 한꺼번에 고를 수 있어요</span>
			</button>
			{picker.input}
		</div>
	);
}

export function SinglePhoto({
	photo,
	onChange,
	rawBase,
}: {
	photo: Photo | null;
	onChange: (p: Photo | null) => void;
	rawBase: string;
}) {
	const picker = useFilePicker((files) => onChange(photoFromFile(files[0])), false);
	return (
		<div className="adm-photos">
			{photo ? (
				<div className="adm-photo poster">
					<SmartImg src={photoSrc(photo)} rawBase={rawBase} alt="포스터" />
					<button type="button" className="adm-btn small" onClick={picker.open}>
						다른 사진으로 바꾸기
					</button>
				</div>
			) : (
				<button
					type="button"
					className={`adm-add-photo ${picker.drag ? "drag" : ""}`}
					onClick={picker.open}
					{...picker.dropProps}
				>
					<span className="plus"><Icon name="add" /></span>
					사진 추가
				</button>
			)}
			{picker.input}
		</div>
	);
}

export type PreviewRequest = { path: string; data: Partial<RawContent> };

export function SaveBar({
	onSave,
	onCancel,
	onPreview,
	saveLabel = "저장하기",
	dirty,
}: {
	onSave: () => void;
	onCancel: () => void;
	/** 지금 고친 내용으로 사이트가 어떻게 보일지 */
	onPreview?: () => PreviewRequest;
	saveLabel?: string;
	dirty: boolean;
}) {
	const [preview, setPreview] = useState<PreviewRequest | null>(null);
	return (
		<>
		{preview && <PreviewScreen request={preview} onClose={() => setPreview(null)} />}
		<div className="adm-savebar">
			<div className="adm-savebar-inner">
				<span className="adm-muted adm-small" style={{ marginRight: "auto" }}>
					{dirty ? "아직 저장하지 않은 내용이 있어요" : "바뀐 내용이 없어요"}
				</span>
				<button type="button" className="adm-btn big" onClick={onCancel}>
					취소
				</button>
				{onPreview && (
					<button type="button" className="adm-btn secondary" onClick={() => setPreview(onPreview())}>
						미리보기
					</button>
				)}
				<button type="button" className="adm-btn big primary" onClick={onSave} disabled={!dirty}>
					{saveLabel}
				</button>
			</div>
		</div>
		</>
	);
}

/** 저장하기 전에, 사이트에 실제로 어떻게 보일지 사이트 화면을 그대로 띄워서 보여줘요. */
function PreviewScreen({ request, onClose }: { request: PreviewRequest; onClose: () => void }) {
	const [mobile, setMobile] = useState(false);
	const ready = useMemo(() => {
		try {
			window.localStorage.setItem(PREVIEW_KEY, JSON.stringify(request.data));
			return true;
		} catch (e) {
			return false;
		}
	}, [request]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [onClose]);

	return (
		<div className="adm-preview" role="dialog" aria-modal="true" aria-label="미리보기">
			<div className="adm-preview-bar">
				<div className="adm-preview-title">
					<strong>미리보기</strong>
					<span className="adm-muted adm-small">아직 저장되지 않았어요</span>
				</div>
				<div className="adm-preview-tabs" role="tablist" aria-label="화면 크기">
					<button type="button" role="tab" aria-selected={!mobile} className={!mobile ? "on" : ""} onClick={() => setMobile(false)}>
						PC
					</button>
					<button type="button" role="tab" aria-selected={mobile} className={mobile ? "on" : ""} onClick={() => setMobile(true)}>
						휴대폰
					</button>
				</div>
				<button type="button" className="adm-btn" onClick={onClose}>
					닫기
				</button>
			</div>
			<div className="adm-preview-stage">
				{ready ? (
					<iframe
						title="사이트 미리보기"
						className={`adm-preview-frame ${mobile ? "mobile" : ""}`}
						src={`${request.path}?preview=1`}
					/>
				) : (
					<p className="adm-muted">미리보기를 열 수 없어요. 저장한 뒤 사이트에서 확인해 주세요.</p>
				)}
			</div>
		</div>
	);
}

export function EnToggle({ showEn, setShowEn }: { showEn: boolean; setShowEn: (v: boolean) => void }) {
	return (
		<label className="adm-toggle adm-muted">
			<input type="checkbox" checked={showEn} onChange={(e) => setShowEn(e.target.checked)} />
			영어 번역도 같이 보기 (선택)
		</label>
	);
}
