// 전시 목록 / 전시 올리기·고치기 화면
// 사이트에는 마지막에 넣은 전시가 맨 앞에 보여요. 어드민 목록도 같은 순서(최신이 위)로 보여줘요.

import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "./api";
import { SAVED_MESSAGE, useAdmin, useDirty, useSaveError } from "./context";
import {
	autoTranslate,
	bi,
	Exhibition,
	EXHIBITION_TYPES,
	exhibitionForPreview,
	exhibitionsToRaw,
	formatDates,
	nextId,
	Photo,
	removedPhotos,
	uploadPhotos,
	withEulReul,
} from "./model";
import { BiField, DateField, EnToggle, Icon, PhotoGrid, SaveBar, SinglePhoto, photoSrc, useDialog } from "./ui";
import { ListItem, PageHead } from "./WorksPages";
import { sortExhibitionsNewestFirst } from "../shared/exhibitionOrder";

/** 시작일 기준 최신순 (사이트와 같은 규칙) */
const newestFirst = (list: Exhibition[]) => sortExhibitionsNewestFirst(list, (x) => formatDates(x).ko);
/** 데이터 파일에는 오래된 것부터 저장해요 (사이트는 뒤집어서 최신이 위) */
const oldestFirst = (list: Exhibition[]) => newestFirst(list).reverse();

export function ExhibitionsList() {
	const { model, setModel, go, rawBase } = useAdmin();
	const dialog = useDialog();
	const onError = useSaveError();
	// 시작일 기준 최신순 (순서는 자동으로 정해져요)
	const shown = newestFirst(model.exhibitions);

	// quiet: 순서 바꾸기처럼 가벼운 저장은 글자 없이 로딩 표시만 (최소 1초)
	const saveList = async (exhibitions: Exhibition[], message: string, deletes: string[] = [], quiet = false) => {
		const save = () => api.save({ message, files: { exhibitions: exhibitionsToRaw(exhibitions) }, deletes });
		try {
			if (quiet) {
				await dialog.withSpinner(save);
			} else {
				dialog.setProgress({ title: "저장하는 중이에요…" });
				await save();
				dialog.setProgress(null);
			}
			setModel({ ...model, exhibitions });
			return true;
		} catch (e) {
			await onError(e);
			return false;
		}
	};

	const remove = async (x: Exhibition) => {
		const ok = await dialog.confirm({
			title: `'${x.title.ko}' 전시를 지울까요?`,
			message: "지우면 사이트에서 사라지고, 포스터와 전시 사진도 함께 지워져요. 되돌릴 수 없어요.",
			ok: "네, 지울게요",
			cancel: "아니요",
			danger: true,
		});
		if (!ok) return;
		const before: Photo[] = [...(x.poster ? [x.poster] : []), ...x.images];
		const list = oldestFirst(model.exhibitions.filter((e) => e.id !== x.id));
		// 삭제는 확인 창으로 한 번 물어봤으니, 끝나면 짧은 알림(토스트)만 보여줘요
		if (await saveList(list, `전시 '${x.title.ko}' 삭제`, removedPhotos(before, []), true)) {
			dialog.showToast([`${withEulReul(x.title.ko)} 삭제했어요.`, "사이트에도 바로 반영돼요."]);
		}
	};

	return (
		<div className="adm-stack">
			<PageHead title="전시" desc="시작일 기준 최신순으로 자동 정렬돼요." back={() => go("/admin")}>
				<button type="button" className="adm-btn big primary" onClick={() => go("/admin/exhibitions/new")}>
					<Icon name="add" />
					새 전시
				</button>
			</PageHead>
			<div className="adm-list">
				{shown.map((x) => (
					<ListItem
						key={x.id}
						img={x.poster ? photoSrc(x.poster) : ""}
						poster
						title={x.title.ko}
						sub={
							<>
								{x.type} · {formatDates(x).ko}
								<br />
								{x.location.ko}
							</>
						}
						rawBase={rawBase}
						onEdit={() => go(`/admin/exhibitions/${x.id}`)}
						onDelete={() => remove(x)}
					/>
				))}
			</div>
		</div>
	);
}

export function ExhibitionEdit() {
	const { id } = useParams<{ id: string }>();
	const { model, setModel, go, rawBase, showEn, setShowEn, setDirty } = useAdmin();
	const dialog = useDialog();
	const onError = useSaveError();
	const isNew = id === "new";

	const original = useMemo<Exhibition | null>(() => {
		if (isNew) {
			return {
				id: nextId(model.exhibitions.map((x) => x.id)),
				type: EXHIBITION_TYPES[0].ko,
				title: bi(),
				location: bi(),
				dateMode: "pick",
				start: "",
				end: "",
				dateText: bi(),
				poster: null,
				images: [],
			};
		}
		return model.exhibitions.find((x) => x.id === id) || null;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const [ex, setEx] = useState<Exhibition | null>(original);
	const dirty = useDirty(ex, original);

	if (!ex || !original) {
		return (
			<div className="adm-card adm-stack">
				<p>이 전시를 찾을 수 없어요.</p>
				<button type="button" className="adm-btn" onClick={() => go("/admin/exhibitions")}>
					전시 목록으로
				</button>
			</div>
		);
	}

	const set = (patch: Partial<Exhibition>) => setEx({ ...ex, ...patch });

	const save = async () => {
		const problems: string[] = [];
		if (!ex.title.ko.trim()) problems.push("전시 제목");
		if (ex.dateMode === "pick" && !ex.start) problems.push("시작일");
		if (ex.dateMode === "text" && !ex.dateText.ko.trim()) problems.push("날짜");
		if (!ex.location.ko.trim()) problems.push("장소");
		if (!ex.poster) problems.push("포스터 사진");
		if (problems.length) {
			await dialog.showDone({
				title: "빠진 내용이 있어요",
				message: `${problems.join(", ")}을(를) 채워 주세요.`,
				button: "알겠어요",
			});
			return;
		}
		if (ex.dateMode === "pick" && ex.end && ex.end < ex.start) {
			await dialog.showDone({ title: "종료일이 시작일보다 빨라요", button: "알겠어요" });
			return;
		}
		try {
			dialog.setProgress({ title: "영어로 번역하는 중이에요…" });
			const { value } = await autoTranslate(ex, isNew ? null : original);
			const folder = `exhibitions/${value.id}`;
			const progress = (done: number, total: number) =>
				dialog.setProgress({ title: "사진을 올리는 중이에요…", detail: `${total}장 중 ${done}장 끝났어요` });
			if (value.poster) await uploadPhotos([value.poster], folder, progress, "0_poster_");
			await uploadPhotos(value.images, folder, progress);

			dialog.setProgress({ title: "저장하는 중이에요…" });
			const list = oldestFirst(
				isNew ? [...model.exhibitions, value] : model.exhibitions.map((x) => (x.id === value.id ? value : x))
			);
			const before = [...(original.poster ? [original.poster] : []), ...original.images];
			const after = [...(value.poster ? [value.poster] : []), ...value.images];
			await api.save({
				message: `전시 '${value.title.ko}' ${isNew ? "추가" : "수정"}`,
				files: { exhibitions: exhibitionsToRaw(list) },
				deletes: isNew ? [] : removedPhotos(before, after),
			});
			setDirty(false);
			setModel({ ...model, exhibitions: list });
			dialog.setProgress(null);
			// 먼저 목록으로 옮긴 뒤, 목록 위에 완료 창을 띄워요 ([닫기]만 누르면 끝)
			await go("/admin/exhibitions");
			dialog.showDone({
				title: isNew ? "새 전시를 올렸어요" : "저장했어요",
				message: SAVED_MESSAGE,
				button: "닫기",
			});
		} catch (e) {
			await onError(e);
		}
	};

	return (
		<div className="adm-stack">
			<PageHead title={isNew ? "새 전시 올리기" : "전시 고치기"} back={() => go("/admin/exhibitions")}>
				<EnToggle showEn={showEn} setShowEn={setShowEn} />
			</PageHead>

			<div className="adm-card adm-stack">
				<h2>1. 전시 정보</h2>
				<div className="adm-field">
					<span className="adm-label">구분</span>
					<div className="adm-choices" role="radiogroup" aria-label="구분">
						{EXHIBITION_TYPES.map((t) => (
							<button
								key={t.ko}
								type="button"
								role="radio"
								aria-checked={ex.type === t.ko}
								className={`adm-choice ${ex.type === t.ko ? "on" : ""}`}
								onClick={() => set({ type: t.ko })}
							>
								{ex.type === t.ko && <Icon name="check" />}
								{t.ko}
							</button>
						))}
					</div>
				</div>
				<BiField
					label="전시 제목"
					placeholder="예: <STRANGER 단체전>"
					value={ex.title}
					onChange={(title) => set({ title })}
					showEn={showEn}
				/>

				{ex.dateMode === "pick" ? (
					<div className="adm-stack" style={{ gap: 10 }}>
						<div className="adm-row" style={{ alignItems: "flex-start" }}>
							<div className="adm-date-col">
								<DateField label="시작일" value={ex.start} onChange={(start) => set({ start })} />
							</div>
							<div className="adm-date-col">
								<DateField label="종료일" value={ex.end} openAt={ex.start} onChange={(end) => set({ end })} />
							</div>
						</div>
						<div>
							<button
								type="button"
								className="adm-linkbtn"
								onClick={() => set({ dateMode: "text", dateText: { ...ex.dateText, ko: ex.dateText.ko || formatDates(ex).ko } })}
							>
								날짜를 직접 글로 쓰고 싶어요 (예: 2025)
							</button>
						</div>
					</div>
				) : (
					<div className="adm-stack" style={{ gap: 10 }}>
						<BiField
							label="날짜"
							placeholder="예: 2025/6/21 - 2025/6/27"
							value={ex.dateText}
							onChange={(dateText) => set({ dateText })}
							showEn={showEn}
						/>
						<div>
							<button type="button" className="adm-linkbtn" onClick={() => set({ dateMode: "pick" })}>
								달력에서 날짜 고르기
							</button>
						</div>
					</div>
				)}

				<BiField
					label="장소"
					placeholder="예: 룩인사이드, 서울, 한국"
					value={ex.location}
					onChange={(location) => set({ location })}
					showEn={showEn}
				/>
			</div>

			<div className="adm-card adm-stack">
				<h2>2. 포스터</h2>
				<p className="adm-muted">전시 목록에 크게 보이는 사진이에요.</p>
				<SinglePhoto photo={ex.poster} onChange={(poster) => set({ poster })} rawBase={rawBase} />
			</div>

			<div className="adm-card adm-stack">
				<h2>3. 전시 사진 (선택)</h2>
				<p className="adm-muted">전시장 모습 사진이에요. 없으면 비워 두셔도 돼요.</p>
				<PhotoGrid photos={ex.images} onChange={(images) => set({ images })} rawBase={rawBase} />
			</div>

			<SaveBar
				dirty={dirty || isNew}
				onSave={save}
				onCancel={() => go("/admin/exhibitions")}
				onPreview={() => {
					const draft = exhibitionForPreview(ex);
					const list = isNew
						? [...model.exhibitions, draft]
						: model.exhibitions.map((x) => (x.id === draft.id ? draft : x));
					return { path: `/exhibitions/${draft.id}`, data: { exhibitions: exhibitionsToRaw(list) } };
				}}
			/>
		</div>
	);
}
