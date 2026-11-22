// 작업 목록 / 작업 올리기·고치기 화면

import React, { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "./api";
import { useAdmin, useDirty, useSaveError } from "./context";
import {
	autoTranslate,
	bi,
	nextId,
	removedPhotos,
	uploadPhotos,
	Work,
	withEulReul,
	workForPreview,
	worksToRaw,
} from "./model";
import {
	BiField,
	edgeScroll,
	layoutRect,
	EnToggle,
	Icon,
	NewDot,
	PhotoGrid,
	useFlip,
	SaveBar,
	SmartImg,
	TextField,
	photoSrc,
	useDialog,
} from "./ui";

export function ListItem({
	img,
	poster,
	title,
	sub,
	onEdit,
	onDelete,
	onUp,
	onDown,
	rawBase,
	reorder,
	drag,
	flipKey,
}: {
	img: string;
	poster?: boolean;
	title: string;
	sub: React.ReactNode;
	onEdit: () => void;
	onDelete: () => void;
	onUp?: () => void;
	onDown?: () => void;
	rawBase: string;
	/** 순서 변경 중이면 위로/아래로만, 아니면 수정/삭제만 보여요 */
	reorder?: boolean;
	/** 순서 변경 중 왼쪽 손잡이로 끌어서 옮기기 */
	drag?: DragHandleProps;
	/** 순서가 바뀔 때 움직임용 고유키 */
	flipKey?: string;
}) {
	return (
		<div
			className={`adm-list-item ${drag?.dragging ? "dragging" : ""}`}
			data-sort-item
			data-flip={flipKey}
			data-flip-skip={drag?.dragging ? "" : undefined}
		>
			{reorder && drag && (
				<button
					type="button"
					className="adm-drag-handle"
					aria-label="끌어서 순서 바꾸기"
					title="끌어서 순서 바꾸기"
					onPointerDown={drag.onPointerDown}
				>
					<Icon name="drag_indicator" />
				</button>
			)}
			{img ? (
				<SmartImg className={`adm-thumb ${poster ? "poster" : ""}`} src={img} rawBase={rawBase} alt="" />
			) : (
				<div className="adm-thumb" />
			)}
			<div className="adm-list-text">
				<div className="adm-list-title">{title || "(제목 없음)"}</div>
				<div className="adm-muted">{sub}</div>
			</div>
			<div className="adm-row adm-actions">
				{reorder ? (
					<div className="adm-order">
						<button type="button" className="adm-btn small text" onClick={onUp} disabled={!onUp} title="위로">
							<Icon name="arrow_upward" />
							위로
						</button>
						<button type="button" className="adm-btn small text" onClick={onDown} disabled={!onDown} title="아래로">
							<Icon name="arrow_downward" />
							아래로
						</button>
					</div>
				) : (
					<>
						<button type="button" className="adm-btn secondary medium" onClick={onEdit}>
							수정
						</button>
						<button type="button" className="adm-btn danger medium adm-del" onClick={onDelete} aria-label="삭제">
							{/* PC에서는 '삭제' 글자, 휴대폰에서는 휴지통 아이콘만 */}
							<span className="adm-del-icon">
								<Icon name="delete" />
							</span>
							<span className="adm-del-text">삭제</span>
						</button>
					</>
				)}
			</div>
		</div>
	);
}

export function PageHead({
	title,
	desc,
	back,
	children,
}: {
	title: string;
	desc?: string;
	back?: () => void;
	children?: React.ReactNode;
}) {
	return (
		<div className="adm-stack" style={{ gap: 12 }}>
			{back && (
				<div>
					<button type="button" className="adm-btn plain" style={{ paddingLeft: 8 }} onClick={back}>
						<Icon name="arrow_back" />
						뒤로 가기
					</button>
				</div>
			)}
			<div className="adm-row adm-pagehead">
				<div>
					<h1>{title}</h1>
					{desc && (
						<p className="adm-muted" style={{ marginTop: 6 }}>
							{desc}
						</p>
					)}
				</div>
				<div className="adm-spacer" />
				{children && <div className="adm-pagehead-actions">{children}</div>}
			</div>
		</div>
	);
}

/**
 * [순서 변경] 모드: 위로/아래로는 화면에서만 바꾸고, [저장하기]를 눌러야 한 번에 저장해요.
 * (여러 번 옮기는 도중의 순서가 사이트에 보이지 않게)
 */
export function useReorder<T>(items: T[]) {
	const { setDirty } = useAdmin();
	const [draft, setDraft] = useState<T[] | null>(null);
	const changed = Boolean(draft && draft.some((x, i) => x !== items[i]));
	const start = () => setDraft([...items]);
	const stop = () => {
		setDraft(null);
		setDirty(false);
	};
	const moveTo = (from: number, to: number) => {
		setDraft((prev) => {
			if (!prev) return prev;
			const list = [...prev];
			const [x] = list.splice(from, 1);
			list.splice(to, 0, x);
			setDirty(list.some((y, k) => y !== items[k]));
			return list;
		});
	};
	const move = (i: number, d: number) => {
		if (!draft) return;
		const list = [...draft];
		const [x] = list.splice(i, 1);
		list.splice(i + d, 0, x);
		setDraft(list);
		setDirty(list.some((y, k) => y !== items[k]));
	};
	/** 정해진 규칙으로 한 번에 정렬 (화면에서만, 저장은 [저장하기]) */
	const sortBy = (compare: (a: T, b: T) => number) => {
		if (!draft) return;
		const list = [...draft].sort(compare);
		setDraft(list);
		setDirty(list.some((y, k) => y !== items[k]));
	};
	return { active: draft !== null, list: draft || items, changed, start, stop, move, moveTo, sortBy };
}

type DragHandleProps = {
	dragging: boolean;
	onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
};

/**
 * 손잡이를 잡고 위아래로 끌면 순서가 바뀌어요 (마우스·손가락 모두).
 * 끄는 동안 다른 항목의 가운데를 지나면 자리를 바꿔요. 화면 끝으로 가면 자동으로 스크롤해요.
 * (항목이 자리를 바꾸면 손잡이가 화면에서 옮겨지므로, 움직임은 창 전체에서 들어요)
 */
export function useDragSort(listRef: React.RefObject<HTMLElement>, moveTo: (from: number, to: number) => void) {
	const [dragIndex, setDragIndex] = useState<number | null>(null);
	const current = useRef<number | null>(null);
	const moveRef = useRef(moveTo);
	moveRef.current = moveTo;

	const onMove = (e: PointerEvent) => {
		const from = current.current;
		if (from === null || !listRef.current) return;
		e.preventDefault();
		edgeScroll(e.clientY);
		const list = listRef.current;
		const y = e.clientY - list.getBoundingClientRect().top;
		const items = Array.from(list.querySelectorAll<HTMLElement>("[data-sort-item]"));
		let to = from;
		items.forEach((el, k) => {
			const r = layoutRect(el, list);
			const mid = r.top + r.height / 2;
			if (k < from && y < mid) to = Math.min(to, k);
			if (k > from && y > mid) to = Math.max(to, k);
		});
		if (to !== from) {
			moveRef.current(from, to);
			current.current = to;
			setDragIndex(to);
		}
	};
	const onUp = () => {
		current.current = null;
		setDragIndex(null);
		window.removeEventListener("pointermove", onMove);
		window.removeEventListener("pointerup", onUp);
		window.removeEventListener("pointercancel", onUp);
	};

	const handle = (i: number): DragHandleProps => ({
		dragging: dragIndex === i,
		onPointerDown: (e) => {
			e.preventDefault();
			current.current = i;
			setDragIndex(i);
			window.addEventListener("pointermove", onMove, { passive: false });
			window.addEventListener("pointerup", onUp);
			window.addEventListener("pointercancel", onUp);
		},
	});
	return handle;
}

export function WorksList() {
	const { model, setModel, go, rawBase } = useAdmin();
	const dialog = useDialog();
	const onError = useSaveError();

	// quiet: 순서 바꾸기처럼 가벼운 저장은 글자 없이 로딩 표시만 (최소 1초)
	const saveList = async (works: Work[], message: string, deletes: string[] = [], quiet = false) => {
		const save = () => api.save({ message, files: { works: worksToRaw(works) }, deletes });
		try {
			if (quiet) {
				await dialog.withSpinner(save);
			} else {
				dialog.setProgress({ title: "저장하는 중이에요…" });
				await save();
				dialog.setProgress(null);
			}
			setModel({ ...model, works });
			return true;
		} catch (e) {
			await onError(e);
			return false;
		}
	};

	const order = useReorder(model.works);
	const listRef = useRef<HTMLDivElement>(null);
	const dragHandle = useDragSort(listRef, order.moveTo);
	const [flash, setFlash] = useState<{ key: string; at: number } | null>(null);
	useFlip(listRef, order.list.map((w) => w.id).join(","), flash);
	const saveOrder = async () => {
		if (await saveList(order.list, "작업 순서 변경", [], true)) {
			order.stop();
			dialog.showToast(["순서를 바꿨어요."]);
		}
	};

	const remove = async (w: Work) => {
		const ok = await dialog.confirm({
			title: `'${w.title.ko}' 작업을 지울까요?`,
			message: "지우면 사이트에서 사라지고, 사진도 함께 지워져요. 되돌릴 수 없어요.",
			ok: "네, 지울게요",
			cancel: "아니요",
			danger: true,
		});
		if (!ok) return;
		const works = model.works.filter((x) => x.id !== w.id);
		// 삭제는 확인 창으로 한 번 물어봤으니, 끝나면 짧은 알림(토스트)만 보여줘요
		if (await saveList(works, `작업 '${w.title.ko}' 삭제`, removedPhotos(w.images, []), true)) {
			dialog.showToast([`${withEulReul(w.title.ko)} 삭제했어요.`]);
		}
	};

	return (
		<div className="adm-stack">
			<PageHead
				title="작업"
				desc={
					order.active
						? "위로/아래로 버튼으로 순서를 바꾼 뒤 [저장하기]를 눌러 주세요."
						: "사이트 첫 화면에 보이는 순서대로 나와 있어요."
				}
				back={() => go("/admin")}
			>
				{order.active && (
					<button
						type="button"
						className="adm-btn small"
						// 연도가 최근인 작업이 위로 (같은 연도끼리는 지금 순서 그대로)
						onClick={() => order.sortBy((a, b) => Number(b.year || 0) - Number(a.year || 0))}
					>
						최신순으로 정렬
					</button>
				)}
				{!order.active && (
					<>
						{model.works.length > 1 && (
							<button type="button" className="adm-btn big" onClick={order.start}>
								순서 변경
							</button>
						)}
						<button type="button" className="adm-btn big primary" onClick={() => go("/admin/works/new")}>
							<Icon name="add" />새 작업
						</button>
					</>
				)}
			</PageHead>
			<div className="adm-list" ref={listRef}>
				{model.works.length === 0 && <p className="adm-muted">아직 작업이 없어요.</p>}
				{order.list.map((w, i) => (
					<ListItem
						key={w.id}
						img={w.images[0] ? photoSrc(w.images[0]) : ""}
						title={w.title.ko}
						sub={`${w.year}년 · 사진 ${w.images.length}장`}
						rawBase={rawBase}
						reorder={order.active}
						drag={dragHandle(i)}
						flipKey={w.id}
						onEdit={() => go(`/admin/works/${w.id}`)}
						onDelete={() => remove(w)}
						onUp={
							i > 0
								? () => {
										order.move(i, -1);
										setFlash({ key: w.id, at: Date.now() });
								  }
								: undefined
						}
						onDown={
							i < order.list.length - 1
								? () => {
										order.move(i, 1);
										setFlash({ key: w.id, at: Date.now() });
								  }
								: undefined
						}
					/>
				))}
			</div>
			{order.active && <SaveBar dirty={order.changed} onSave={saveOrder} onCancel={order.stop} />}
		</div>
	);
}

export function WorkEdit() {
	const { id } = useParams<{ id: string }>();
	const { model, setModel, go, rawBase, showEn, setShowEn, setDirty } = useAdmin();
	const dialog = useDialog();
	const onError = useSaveError();
	const isNew = id === "new";

	const original = useMemo<Work | null>(() => {
		if (isNew) {
			return {
				id: nextId(model.works.map((w) => w.id)),
				year: String(new Date().getFullYear()),
				title: bi(),
				description: bi(),
				images: [],
			};
		}
		return model.works.find((w) => w.id === id) || null;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const [work, setWork] = useState<Work | null>(original);
	const dirty = useDirty(work, original);

	if (!work || !original) {
		return (
			<div className="adm-card adm-stack">
				<p>이 작업을 찾을 수 없어요.</p>
				<button type="button" className="adm-btn" onClick={() => go("/admin/works")}>
					작업 목록으로
				</button>
			</div>
		);
	}

	const save = async () => {
		if (!work.title.ko.trim()) {
			await dialog.showDone({ title: "제목을 써 주세요", button: "알겠어요" });
			return;
		}
		if (work.images.length === 0) {
			await dialog.showDone({ title: "사진을 한 장 이상 넣어 주세요", button: "알겠어요" });
			return;
		}
		try {
			dialog.setProgress({ title: "영어로 번역하는 중이에요…" });
			const { value } = await autoTranslate(work, isNew ? null : original);
			await uploadPhotos(value.images, `works/${value.id}`, (done, total) =>
				dialog.setProgress({ title: "사진을 올리는 중이에요…", detail: `${total}장 중 ${done}장 끝났어요` })
			);
			dialog.setProgress({ title: "저장하는 중이에요…" });
			const works = isNew ? [value, ...model.works] : model.works.map((w) => (w.id === value.id ? value : w));
			await api.save({
				message: `작업 '${value.title.ko}' ${isNew ? "추가" : "수정"}`,
				files: { works: worksToRaw(works) },
				deletes: isNew ? [] : removedPhotos(original.images, value.images),
			});
			setDirty(false);
			setModel({ ...model, works });
			dialog.setProgress(null);
			// 먼저 목록으로 옮긴 뒤, 목록 위에 완료 창을 띄워요 ([닫기]만 누르면 끝)
			await go("/admin/works");
			dialog.showDone({
				title: isNew ? "새 작업을 올렸어요" : "저장했어요",
				button: "닫기",
			});
		} catch (e) {
			await onError(e);
		}
	};

	return (
		<div className="adm-stack">
			<PageHead title={isNew ? "새 작업 올리기" : "작업 고치기"} back={() => go("/admin/works")}>
				<EnToggle showEn={showEn} setShowEn={setShowEn} />
			</PageHead>

			<div className="adm-card adm-stack">
				<h2>1. 사진</h2>
				<ul className="adm-muted adm-guide">
					<li>1번 사진이 대표 사진이에요.</li>
					<li>드래그 앤 드롭하거나 ← → 화살표 버튼으로 순서를 바꿀 수 있어요.</li>
					<li>
						새로 추가한 사진은 <NewDot label="초록색 점" />
						으로 표시돼요.
					</li>
				</ul>
				<PhotoGrid
					photos={work.images}
					onChange={(images) => setWork({ ...work, images })}
					rawBase={rawBase}
					coverLabel="대표"
				/>
			</div>

			<div className="adm-card adm-stack">
				<h2>2. 작품 정보</h2>
				<BiField
					label="제목"
					placeholder="예: 보내야하는 사물들을 위한 정물"
					value={work.title}
					onChange={(title) => setWork({ ...work, title })}
					showEn={showEn}
				/>
				<div style={{ maxWidth: 240 }}>
					<TextField
						label="연도"
						placeholder="예: 2025"
						value={work.year}
						inputMode="numeric"
						onChange={(year) => setWork({ ...work, year: year.replace(/[^0-9]/g, "").slice(0, 4) })}
					/>
				</div>
				<BiField
					label="작품 설명"
					value={work.description}
					onChange={(description) => setWork({ ...work, description })}
					multiline
					big
					showEn={showEn}
				/>
			</div>

			<SaveBar
				dirty={dirty || isNew}
				onSave={save}
				onCancel={() => go("/admin/works")}
				onPreview={() => {
					const draft = workForPreview(work);
					// 저장할 때처럼 새 작업은 맨 앞에 넣어요
					const list = isNew ? [draft, ...model.works] : model.works.map((x) => (x.id === draft.id ? draft : x));
					return { path: `/works/${draft.id}`, data: { works: worksToRaw(list) } };
				}}
			/>
		</div>
	);
}
