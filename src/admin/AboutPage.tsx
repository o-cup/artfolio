// 소개 · 이력 고치기 화면

import React, { useMemo, useState } from "react";
import { api } from "./api";
import { SAVED_MESSAGE, useAdmin, useDirty, useSaveError } from "./context";
import { About, aboutToRaw, autoTranslate, bi, Bi, newKey } from "./model";
import { BiField, EnToggle, Icon, SaveBar, useDialog } from "./ui";
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
	const dirty = useDirty(about, original);

	const setSection = (si: number, patch: Partial<About["sections"][number]>) =>
		setAbout({ ...about, sections: about.sections.map((s, i) => (i === si ? { ...s, ...patch } : s)) });

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
				message: SAVED_MESSAGE,
				button: "처음 화면으로",
			});
			go("/admin");
		} catch (e) {
			await onError(e);
		}
	};

	return (
		<div className="adm-stack">
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
				<div key={s._k} className="adm-card adm-stack">
					<h2>카테고리</h2>
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
								className="adm-btn small"
								disabled={si === 0}
								onClick={() => setAbout({ ...about, sections: move(about.sections, si, -1) })}
								aria-label="카테고리 위로"
							>
								<Icon name="arrow_upward" />
								위로
							</button>
							<button
								type="button"
								className="adm-btn small"
								disabled={si === about.sections.length - 1}
								onClick={() => setAbout({ ...about, sections: move(about.sections, si, 1) })}
								aria-label="카테고리 아래로"
							>
								<Icon name="arrow_downward" />
								아래로
							</button>
							<button
								type="button"
								className="adm-btn small danger"
								onClick={() => removeSection(si)}
								aria-label="카테고리 삭제"
							>
								삭제
							</button>
						</div>
					</div>

					<button
						type="button"
						className="adm-btn primary"
						style={{ alignSelf: "flex-start" }}
						onClick={() => setSection(si, { lines: [bi(), ...s.lines] })}
					>
						<Icon name="add" />
						맨 위에 새 줄 추가
					</button>

					{s.lines.map((l, li) => (
						<div key={l._k} className="adm-line">
							<BiField
								label={`${li + 1}.`}
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
									onClick={() => setSection(si, { lines: move(s.lines, li, -1) })}
									aria-label="위로"
								>
									<Icon name="arrow_upward" />
								</button>
								<button
									type="button"
									className="adm-btn small"
									disabled={li === s.lines.length - 1}
									onClick={() => setSection(si, { lines: move(s.lines, li, 1) })}
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
					))}
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
				<Icon name="add" />
				새 카테고리 추가 (예: 레지던시, 소장처)
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
