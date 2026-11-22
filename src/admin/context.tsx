// 어드민 화면들이 같이 쓰는 상태와 도우미

import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { Model } from "./model";
import { useDialog } from "./ui";

// ---------- 공통 상태 ----------
type AdminCtx = {
	model: Model;
	setModel: (m: Model) => void;
	rawBase: string;
	go: (path: string) => void;
	setDirty: (d: boolean) => void;
	showEn: boolean;
	setShowEn: (v: boolean) => void;
	logout: () => void;
};
export const Ctx = createContext<AdminCtx | null>(null);
export const useAdmin = () => useContext(Ctx) as AdminCtx;

/** 편집 화면에서: 바뀐 내용이 있는지 알려주기 */
export function useDirty(current: unknown, initial: unknown) {
	const { setDirty } = useAdmin();
	const dirty = useMemo(() => JSON.stringify(current) !== JSON.stringify(initial), [current, initial]);
	useEffect(() => {
		setDirty(dirty);
		return () => setDirty(false);
	}, [dirty, setDirty]);
	return dirty;
}

/** 저장하다 실패했을 때 공통 안내 */
export function useSaveError() {
	const dialog = useDialog();
	return useCallback(
		async (e: unknown) => {
			dialog.setProgress(null);
			const msg = e instanceof Error ? e.message : "알 수 없는 문제가 생겼어요.";
			await dialog.showDone({
				title: "저장하지 못했어요",
				message: (
					<>
						<p>{msg}</p>
						<p style={{ marginTop: 12 }}>
							쓰신 내용은 그대로 남아 있어요. 잠시 뒤 [저장하기]를 다시 눌러 주세요.
						</p>
					</>
				),
			});
		},
		[dialog]
	);
}

