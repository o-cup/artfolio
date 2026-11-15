// 로그인 화면, 비밀번호 만들기/바꾸기 화면

import React, { useEffect, useRef, useState } from "react";
import { api } from "./api";
import { useDialog } from "./ui";

declare global {
	interface Window {
		google?: any;
	}
}

function loadGoogleScript(): Promise<void> {
	if (window.google?.accounts?.id) return Promise.resolve();
	return new Promise((resolve, reject) => {
		const s = document.createElement("script");
		s.src = "https://accounts.google.com/gsi/client";
		s.async = true;
		s.onload = () => resolve();
		s.onerror = () => reject(new Error("google script"));
		document.head.appendChild(s);
	});
}

function GoogleButton({ clientId, onCredential }: { clientId: string; onCredential: (c: string) => void }) {
	const ref = useRef<HTMLDivElement>(null);
	const [failed, setFailed] = useState(false);
	const cbRef = useRef(onCredential);
	cbRef.current = onCredential;
	useEffect(() => {
		let cancelled = false;
		loadGoogleScript()
			.then(() => {
				if (cancelled || !ref.current) return;
				window.google.accounts.id.initialize({
					client_id: clientId,
					callback: (r: { credential: string }) => cbRef.current(r.credential),
				});
				window.google.accounts.id.renderButton(ref.current, {
					type: "standard",
					theme: "outline",
					size: "large",
					text: "continue_with",
					shape: "rectangular",
					locale: "ko",
					width: 320,
				});
			})
			.catch(() => setFailed(true));
		return () => {
			cancelled = true;
		};
	}, [clientId]);
	if (failed) return <div className="adm-error">구글 버튼을 불러오지 못했어요. 인터넷 연결을 확인해 주세요.</div>;
	return <div ref={ref} style={{ minHeight: 44 }} />;
}

function PasswordInput({
	value,
	onChange,
	label,
	autoComplete,
	autoFocus,
	onEnter,
}: {
	value: string;
	onChange: (v: string) => void;
	label: string;
	autoComplete: string;
	autoFocus?: boolean;
	onEnter?: () => void;
}) {
	const [show, setShow] = useState(false);
	const id = useRef(`p-${Math.random().toString(36).slice(2)}`).current;
	return (
		<div className="adm-field">
			<label className="adm-label" htmlFor={id}>
				{label}
			</label>
			<input
				id={id}
				className="adm-input"
				style={{ fontSize: 18, letterSpacing: show ? 0 : 3 }}
				type={show ? "text" : "password"}
				value={value}
				autoComplete={autoComplete}
				// eslint-disable-next-line jsx-a11y/no-autofocus
				autoFocus={autoFocus}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter" && onEnter) onEnter();
				}}
			/>
			<label className="adm-toggle">
				<input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
				비밀번호 글자 보이게 하기
			</label>
		</div>
	);
}

export function LoginPage({ googleClientId, onLoggedIn }: { googleClientId: string | null; onLoggedIn: () => void }) {
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);
	const [forgot, setForgot] = useState(false);

	const submit = async () => {
		if (!password) {
			setError("비밀번호를 넣어 주세요.");
			return;
		}
		setBusy(true);
		setError("");
		try {
			await api.login(password);
			onLoggedIn();
		} catch (e) {
			setError(e instanceof Error ? e.message : "다시 시도해 주세요.");
			setBusy(false);
		}
	};

	const onGoogle = async (credential: string) => {
		setError("");
		try {
			await api.google(credential);
			onLoggedIn();
		} catch (e) {
			setError(e instanceof Error ? e.message : "다시 시도해 주세요.");
		}
	};

	return (
		<div className="adm-login adm-stack">
			<div className="adm-login-brand">
				<p className="name">Parkmejung</p>
				<p className="adm-muted">사이트 관리</p>
			</div>
			<div className="adm-card adm-stack">
				<PasswordInput
					label="비밀번호"
					value={password}
					onChange={setPassword}
					autoComplete="current-password"
					autoFocus
					onEnter={submit}
				/>
				{error && <div className="adm-error">{error}</div>}
				<button type="button" className="adm-btn big primary block" onClick={submit} disabled={busy}>
					{busy ? "확인하는 중…" : "들어가기"}
				</button>
				<p className="adm-hint">한 번 들어가면 이 컴퓨터에서는 6개월 동안 다시 넣지 않아도 돼요.</p>
			</div>

			<div className="adm-card adm-stack">
				{!forgot ? (
					<button type="button" className="adm-linkbtn" onClick={() => setForgot(true)}>
						비밀번호가 생각나지 않으세요?
					</button>
				) : (
					<>
						<h3>비밀번호가 생각나지 않을 때</h3>
						{googleClientId ? (
							<>
								<p>
									아래 <b>구글 버튼</b>을 눌러 본인 구글 계정(Gmail)으로 확인하면, 새 비밀번호를 만들
									수 있어요.
								</p>
								<GoogleButton clientId={googleClientId} onCredential={onGoogle} />
							</>
						) : (
							<p>구글 확인 기능이 아직 준비되지 않았어요. 따님께 연락해 주세요.</p>
						)}
					</>
				)}
			</div>
		</div>
	);
}

export function SetPasswordPage({
	mode,
	onDone,
	onCancel,
}: {
	mode: "reset" | "change";
	onDone: () => void;
	onCancel?: () => void;
}) {
	const dialog = useDialog();
	const [pw, setPw] = useState("");
	const [pw2, setPw2] = useState("");
	const [error, setError] = useState("");

	const submit = async () => {
		if (pw.length < 6) {
			setError("비밀번호는 6글자 이상으로 만들어 주세요.");
			return;
		}
		if (pw !== pw2) {
			setError("두 칸에 넣은 비밀번호가 서로 달라요. 똑같이 넣어 주세요.");
			return;
		}
		setError("");
		dialog.setProgress({ title: "새 비밀번호를 저장하는 중이에요…" });
		try {
			await api.setPassword(pw);
			dialog.setProgress(null);
			await dialog.showDone({
				title: "새 비밀번호를 만들었어요",
				message: "다음부터는 이 비밀번호로 들어오시면 돼요. 잊지 않게 수첩에 적어 두세요.",
			});
			onDone();
		} catch (e) {
			dialog.setProgress(null);
			setError(e instanceof Error ? e.message : "다시 시도해 주세요.");
		}
	};

	return (
		<div className="adm-stack" style={{ maxWidth: 560, margin: "0 auto" }}>
			<div>
				<h1>{mode === "reset" ? "새 비밀번호 만들기" : "비밀번호 바꾸기"}</h1>
				<p className="adm-muted" style={{ marginTop: 8 }}>
					{mode === "reset"
						? "구글 계정 확인이 끝났어요. 앞으로 쓸 새 비밀번호를 만들어 주세요."
						: "앞으로 쓸 새 비밀번호를 두 번 똑같이 넣어 주세요."}
				</p>
			</div>
			<div className="adm-card adm-stack">
				<PasswordInput label="새 비밀번호 (6글자 이상)" value={pw} onChange={setPw} autoComplete="new-password" autoFocus />
				<PasswordInput
					label="새 비밀번호 한 번 더"
					value={pw2}
					onChange={setPw2}
					autoComplete="new-password"
					onEnter={submit}
				/>
				{error && <div className="adm-error">{error}</div>}
				<div className="adm-row">
					{onCancel && (
						<button type="button" className="adm-btn big" onClick={onCancel}>
							취소
						</button>
					)}
					<button type="button" className="adm-btn big primary" style={{ flex: 1 }} onClick={submit}>
						새 비밀번호 저장하기
					</button>
				</div>
			</div>
		</div>
	);
}
