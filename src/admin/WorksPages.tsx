// 작업 목록 / 작업 올리기·고치기 화면

import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "./api";
import { SAVED_MESSAGE, useAdmin, useDirty, useSaveError } from "./context";
import { autoTranslate, bi, nextId, removedPhotos, uploadPhotos, Work, withEulReul, workForPreview, worksToRaw } from "./model";
import { BiField, EnToggle, Icon, NewDot, PhotoGrid, SaveBar, SmartImg, TextField, photoSrc, useDialog } from "./ui";

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
}) {
	return (
		<div className="adm-list-item">
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
				<button type="button" className="adm-btn primary" onClick={onEdit}>
					수정
				</button>
				<button type="button" className="adm-btn danger adm-del" onClick={onDelete} aria-label="삭제">
					{/* PC에서는 '삭제' 글자, 휴대폰에서는 휴지통 아이콘만 */}
					<span className="adm-del-icon">
						<Icon name="delete" />
					</span>
					<span className="adm-del-text">삭제</span>
				</button>
			</div>
		</div>
	);
}

export function PageHead({ title, desc, back, children }: { title: string; desc?: string; back?: () => void; children?: React.ReactNode }) {
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
			<div className="adm-row">
				<div>
					<h1>{title}</h1>
					{desc && (
						<p className="adm-muted" style={{ marginTop: 6 }}>
							{desc}
						</p>
					)}
				</div>
				<div className="adm-spacer" />
				{children}
			</div>
		</div>
	);
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

	const move = async (i: number, d: number) => {
		const works = [...model.works];
		const [w] = works.splice(i, 1);
		works.splice(i + d, 0, w);
		if (await saveList(works, "작업 순서 변경", [], true)) {
			dialog.showToast(["순서를 바꿨어요.", "사이트 적용까지 2-3분 걸릴 수 있어요."]);
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
			dialog.showToast([`${withEulReul(w.title.ko)} 삭제했어요.`, "사이트에는 2-3분 후에 반영돼요."]);
		}
	};

	return (
		<div className="adm-stack">
			<PageHead title="작업" desc="사이트 첫 화면에 보이는 순서대로 나와 있어요." back={() => go("/admin")}>
				<button type="button" className="adm-btn big primary" onClick={() => go("/admin/works/new")}>
					<Icon name="add" />
					새 작업
				</button>
			</PageHead>
			<div className="adm-list">
				{model.works.length === 0 && <p className="adm-muted">아직 작업이 없어요.</p>}
				{model.works.map((w, i) => (
					<ListItem
						key={w.id}
						img={w.images[0] ? photoSrc(w.images[0]) : ""}
						title={w.title.ko}
						sub={`${w.year}년 · 사진 ${w.images.length}장`}
						rawBase={rawBase}
						onEdit={() => go(`/admin/works/${w.id}`)}
						onDelete={() => remove(w)}
						onUp={i > 0 ? () => move(i, -1) : undefined}
						onDown={i < model.works.length - 1 ? () => move(i, 1) : undefined}
					/>
				))}
			</div>
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
			const uploaded = await uploadPhotos(value.images, `works/${value.id}`, (done, total) =>
				dialog.setProgress({ title: "사진을 올리는 중이에요…", detail: `${total}장 중 ${done}장 끝났어요` })
			);
			dialog.setProgress({ title: "저장하는 중이에요…" });
			const works = isNew ? [value, ...model.works] : model.works.map((w) => (w.id === value.id ? value : w));
			await api.save({
				message: `작업 '${value.title.ko}' ${isNew ? "추가" : "수정"}`,
				files: { works: worksToRaw(works) },
				images: uploaded,
				deletes: isNew ? [] : removedPhotos(original.images, value.images),
			});
			setDirty(false);
			setModel({ ...model, works });
			dialog.setProgress(null);
			// 먼저 목록으로 옮긴 뒤, 목록 위에 완료 창을 띄워요 ([닫기]만 누르면 끝)
			await go("/admin/works");
			dialog.showDone({
				title: isNew ? "새 작업을 올렸어요" : "저장했어요",
				message: SAVED_MESSAGE,
				button: "닫기",
			});
		} catch (e) {
			await onError(e);
		}
	};

	return (
		<div className="adm-stack">
			<PageHead
				title={isNew ? "새 작업 올리기" : "작업 고치기"}
				back={() => go("/admin/works")}
			>
				<EnToggle showEn={showEn} setShowEn={setShowEn} />
			</PageHead>

			<div className="adm-card adm-stack">
				<h2>1. 사진</h2>
				<ul className="adm-muted adm-guide">
					<li>1번 사진이 대표 사진이에요.</li>
					<li>← → 화살표 버튼으로 순서를 바꿀 수 있어요.</li>
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
					const list = isNew ? [...model.works, draft] : model.works.map((x) => (x.id === draft.id ? draft : x));
					return { path: `/works/${draft.id}`, data: { works: worksToRaw(list) } };
				}}
			/>
		</div>
	);
}
