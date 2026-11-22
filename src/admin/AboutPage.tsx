// 소개 · 이력 고치기 화면

import React, { useMemo, useRef, useState } from "react";
import { api } from "./api";
import { useAdmin, useDirty, useSaveError } from "./context";
import { About, aboutToRaw, autoTranslate, bi, Bi, newKey } from "./model";
import { BiField, DragHandle, EnToggle, Icon, SaveBar, useDialog, useFlip, useGroupDragSort } from "./ui";
import { PageHead } from "./WorksPages";

function move<T>(list: T[], i: number, d: number): T[] {
	const next = [...list];
	const [x] = next.splice(i, 1);
	next.splice(i + d, 0, x);
	return next;
}

export default function AboutEdit() {
	const { model, setModel, go, showEn, setShowEn, setDirty } = useAdmin();
	const dialog = useDialog();
	const onError = useSaveError();
	const original = useMemo(() => model.about, []); // eslint-disable-line react-hooks/exhaustive-deps
	const [about, setAbout] = useState<About>(original);
	// 위로/아래로로 순서가 바뀌면 움직임으로 보여줘요
	const pageRef = useRef<HTMLDivElement>(null);
	const [flash, setFlash] = useState<{ key: string; at: number } | null>(null);
	const flashOn = (key: string) => setFlash({ key, at: Date.now() });
	useFlip(pageRef, about.sections.map((sec) => `${sec._k}:${sec.lines.map((l) => l._k).join(".")}`).join("|"), flash);
	// 카테고리별 접힘 상태 (화면에서만, 저장되지 않아요). 처음엔 모두 펼침
	const [closed, setClosed] = useState<Set<string>>(new Set());
	const toggle = (k: string) =>
		setClosed((prev) => {
			const next = new Set(prev);
			if (next.has(k)) next.delete(k);
			else next.add(k);
			return next;
		});
	const dirty = useDirty(about, original);

	const setSection = (si: number, patch: Partial<About["sections"][number]>) =>
		setAbout({ ...about, sections: about.sections.map((s, i) => (i === si ? { ...s, ...patch } : s)) });

	// 이력 줄 끌어서 옮기기 (같은 카테고리 안에서)
	const dragLine = useGroupDragSort();
	const moveLine = (sk: string) => (from: number, to: number) =>
		setAbout((prev) => ({
			...prev,
			sections: prev.sections.map((sec) => {
				if (sec._k !== sk) return sec;
				const lines = [...sec.lines];
				const [x] = lines.splice(from, 1);
				lines.splice(to, 0, x);
				return { ...sec, lines };
			}),
		}));

	const setLine = (si: number, li: number, v: Bi) =>
		setSection(si, { lines: about.sections[si].lines.map((l, i) => (i === li ? v : l)) });

	const removeLine = async (si: number, li: number) => {
		const line = about.sections[si].lines[li];
		if (line.ko.trim()) {
			const ok = await dialog.confirm({
				title: "이 줄을 지울까요?",
				message: line.ko,
				ok: "네, 지울게요",
				cancel: "아니요",
				danger: true,
			});
			if (!ok) return;
		}
		setSection(si, { lines: about.sections[si].lines.filter((_, i) => i !== li) });
	};

	const removeSection = async (si: number) => {
		const s = about.sections[si];
		const ok = await dialog.confirm({
			title: `'${s.title.ko}' 카테고리를 통째로 지울까요?`,
			message: `안에 있는 ${s.lines.length}줄도 함께 지워져요.`,
			ok: "네, 지울게요",
			cancel: "아니요",
			danger: true,
		});
		if (ok) setAbout({ ...about, sections: about.sections.filter((_, i) => i !== si) });
	};

	const save = async () => {
		try {
			dialog.setProgress({ title: "영어로 번역하는 중이에요…" });
			const { value } = await autoTranslate(about, original);
			dialog.setProgress({ title: "저장하는 중이에요…" });
			await api.save({ message: "소개·이력 수정", files: { about: aboutToRaw(value) } });
			const cleaned = {
				...value,
				sections: value.sections.map((s) => ({ ...s, lines: s.lines.filter((l) => l.ko.trim()) })),
			};
			setDirty(false);
			setModel({ ...model, about: cleaned });
			dialog.setProgress(null);
			await dialog.showDone({
				title: "저장했어요",
				button: "처음 화면으로",
			});
			go("/admin");
		} catch (e) {
			await onError(e);
		}
	};

	return (
		<div className="adm-stack" ref={pageRef}>
			<PageHead title="소개 · 이력" desc="사이트의 about 화면에 보이는 내용이에요." back={() => go("/admin")}>
				<EnToggle showEn={showEn} setShowEn={setShowEn} />
			</PageHead>

			<div className="adm-card adm-stack">
				<h2>작가 소개</h2>
				<BiField label="이름" value={about.name} onChange={(name) => setAbout({ ...about, name })} showEn={showEn} />
				<BiField
					label="소개글"
					value={about.intro}
					onChange={(intro) => setAbout({ ...about, intro })}
					multiline
					showEn={showEn}
				/>
			</div>

			{about.sections.map((s, si) => (
				<div key={s._k} className="adm-card adm-stack" data-flip={s._k} data-sort-list>
					<div className="adm-cat-head">
						<h2>카테고리 {si + 1}</h2>
						<button
							type="button"
							className={`adm-chevron ${closed.has(s._k) ? "" : "open"}`}
							onClick={() => toggle(s._k)}
							aria-expanded={!closed.has(s._k)}
							aria-label={closed.has(s._k) ? "이력 줄 펼치기" : "이력 줄 접기"}
							title={closed.has(s._k) ? "펼치기" : "접기"}
						>
							<Icon name="expand_more" />
						</button>
					</div>
					<div className="adm-section-head">
						<div style={{ flex: 1, minWidth: 220 }}>
							<BiField
								label="타입"
								placeholder="예: 개인전, 단체전, 아트페어, 수상"
								value={s.title}
								onChange={(title) => setSection(si, { title })}
								showEn={showEn}
							/>
						</div>
						<div className="adm-row">
							<button
								type="button"
								className="adm-btn medium"
								disabled={si === 0}
								onClick={() => {
									setAbout({ ...about, sections: move(about.sections, si, -1) });
									flashOn(s._k);
								}}
								aria-label="카테고리 위로"
							>
								<Icon name="arrow_upward" />
								위로
							</button>
							<button
								type="button"
								className="adm-btn medium"
								disabled={si === about.sections.length - 1}
								onClick={() => {
									setAbout({ ...about, sections: move(about.sections, si, 1) });
									flashOn(s._k);
								}}
								aria-label="카테고리 아래로"
							>
								<Icon name="arrow_downward" />
								아래로
							</button>
							<button
								type="button"
								className="adm-btn medium danger"
								onClick={() => removeSection(si)}
								aria-label="카테고리 삭제"
							>
								삭제
							</button>
						</div>
					</div>

					{!closed.has(s._k) && (
						<>
							<button
								type="button"
								className="adm-btn primary medium"
								style={{ alignSelf: "flex-start" }}
								onClick={() => setSection(si, { lines: [bi(), ...s.lines] })}
							>
								<Icon name="add" />맨 위에 새 줄 추가
							</button>

							{s.lines.map((l, li) => {
								const drag = dragLine(s._k, li, moveLine(s._k));
								return (
									<div
										key={l._k}
										className={`adm-line ${drag.dragging ? "dragging" : ""}`}
										data-flip={l._k}
										data-sort-item
										data-flip-skip={drag.dragging ? "" : undefined}
									>
										<DragHandle onPointerDown={drag.onPointerDown} />
										<span className="adm-tag number adm-line-num" aria-hidden="true">
											{li + 1}
										</span>
										<BiField
											label={`${li + 1}번째 줄`}
											hideLabel
											growOnMobile
											value={l}
											onChange={(v) => setLine(si, li, v)}
											showEn={showEn}
											placeholder="예: 2025 <전시 제목> 갤러리 이름, 서울, 한국"
										/>
										<div className="adm-line-actions">
											<button
												type="button"
												className="adm-btn small"
												disabled={li === 0}
												onClick={() => {
													setSection(si, { lines: move(s.lines, li, -1) });
													flashOn(l._k);
												}}
												aria-label="위로"
											>
												<Icon name="arrow_upward" />
											</button>
											<button
												type="button"
												className="adm-btn small"
												disabled={li === s.lines.length - 1}
												onClick={() => {
													setSection(si, { lines: move(s.lines, li, 1) });
													flashOn(l._k);
												}}
												aria-label="아래로"
											>
												<Icon name="arrow_downward" />
											</button>
											<button
												type="button"
												className="adm-btn small danger"
												onClick={() => removeLine(si, li)}
												aria-label="삭제"
												title="삭제"
											>
												<Icon name="delete" />
											</button>
										</div>
									</div>
								);
							})}
						</>
					)}
				</div>
			))}

			<button
				type="button"
				className="adm-btn"
				style={{ alignSelf: "flex-start" }}
				onClick={() =>
					setAbout({ ...about, sections: [...about.sections, { _k: newKey(), title: bi(), lines: [bi()] }] })
				}
			>
				<Icon name="add" />새 카테고리 추가 (예: 레지던시, 소장처)
			</button>

			<SaveBar
				dirty={dirty}
				onSave={save}
				onCancel={() => go("/admin")}
				onPreview={() => ({ path: "/about", data: { about: aboutToRaw(about) } })}
			/>
		</div>
	);
}
