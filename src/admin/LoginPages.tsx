// 로그인 화면, 비밀번호 만들기/바꾸기 화면

import React, { useRef, useState } from "react";
import { api } from "./api";
import { Icon, useDialog } from "./ui";

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
			<div className="adm-pw">
				<input
					id={id}
					className="adm-input"
					style={{ letterSpacing: show ? 0 : 3 }}
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
				{/* 눈 아이콘은 지금 상태를 보여줘요: 뜬 눈 = 글자 보임, 감은 눈 = 숨김 */}
				<button
					type="button"
					className="adm-pw-eye"
					onClick={() => setShow(!show)}
					aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
					aria-pressed={show}
					title={show ? "비밀번호 숨기기" : "비밀번호 보기"}
				>
					<Icon name={show ? "visibility" : "visibility_off"} />
				</button>
			</div>
		</div>
	);
}

/** 비밀번호 재설정 링크가 만료됐을 때 등, 주소에 담겨 온 오류 */
function linkError(): string {
	const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search);
	if (!params.get("error")) return "";
	return "메일 속 링크가 만료됐어요. 아래 '비밀번호가 생각나지 않으세요?'를 눌러 메일을 다시 받아 주세요.";
}

export function LoginPage({ onLoggedIn }: { onLoggedIn: () => void }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(linkError);
	const [busy, setBusy] = useState(false);
	const [forgot, setForgot] = useState(false);
	const [mailSent, setMailSent] = useState(false);

	const submit = async () => {
		if (!email.trim() || !password) {
			setError("이메일과 비밀번호를 넣어 주세요.");
			return;
		}
		setBusy(true);
		setError("");
		try {
			await api.login(email, password);
			onLoggedIn();
		} catch (e) {
			setError(e instanceof Error ? e.message : "다시 시도해 주세요.");
			setBusy(false);
		}
	};

	const sendMail = async () => {
		if (!email.trim()) {
			setError("이메일을 넣어 주세요.");
			return;
		}
		setBusy(true);
		setError("");
		try {
			await api.sendResetMail(email);
			setMailSent(true);
		} catch (e) {
			setError(e instanceof Error ? e.message : "다시 시도해 주세요.");
		}
		setBusy(false);
	};

	return (
		<div className="adm-login adm-stack">
			<div className="adm-login-brand">
				<p className="name">
					Parkmejung<span className="adm-badge">admin</span>
				</p>
			</div>
			<div className="adm-stack">
				<div className="adm-field">
					<label className="adm-label" htmlFor="adm-email">
						이메일
					</label>
					<input
						id="adm-email"
						className="adm-input"
						type="email"
						inputMode="email"
						autoComplete="username"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				{!forgot && (
					<PasswordInput
						label="비밀번호"
						value={password}
						onChange={setPassword}
						autoComplete="current-password"
						onEnter={submit}
					/>
				)}
				{error && <div className="adm-error">{error}</div>}
				{!forgot && (
					<button type="button" className="adm-btn big primary block" onClick={submit} disabled={busy}>
						{busy ? "확인하는 중…" : "로그인"}
					</button>
				)}
				{forgot && mailSent && (
					<div className="adm-notice">
						<b>메일을 보냈어요.</b> 메일함을 열고, 메일 속 링크를 누르면 새 비밀번호를 만들 수 있어요. 메일이
						안 보이면 스팸함도 확인해 주세요.
					</div>
				)}
				{forgot && !mailSent && (
					<button type="button" className="adm-btn big primary block" onClick={sendMail} disabled={busy}>
						{busy ? "보내는 중…" : "비밀번호 재설정 메일 받기"}
					</button>
				)}
			</div>

			<div className="adm-stack adm-login-forgot">
				{!forgot ? (
					<button
						type="button"
						className="adm-linkbtn"
						onClick={() => {
							setForgot(true);
							setError("");
						}}
					>
						비밀번호가 생각나지 않으세요?
					</button>
				) : (
					<button
						type="button"
						className="adm-linkbtn"
						onClick={() => {
							setForgot(false);
							setMailSent(false);
							setError("");
						}}
					>
						로그인으로 돌아가기
					</button>
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
			{onCancel && (
				<div>
					<button type="button" className="adm-btn plain" style={{ paddingLeft: 8 }} onClick={onCancel}>
						<Icon name="arrow_back" />
						뒤로 가기
					</button>
				</div>
			)}
			<div>
				<h1>{mode === "reset" ? "새 비밀번호 만들기" : "비밀번호 변경"}</h1>
				<p className="adm-muted" style={{ marginTop: 8 }}>
					{mode === "reset"
						? "앞으로 쓸 새 비밀번호를 만들어 주세요."
						: "변경할 비밀번호를 입력해 주세요."}
				</p>
			</div>
			<div className="adm-stack">
				<PasswordInput label="새 비밀번호 (6글자 이상)" value={pw} onChange={setPw} autoComplete="new-password" autoFocus />
				<PasswordInput
					label="새 비밀번호 확인"
					value={pw2}
					onChange={setPw2}
					autoComplete="new-password"
					onEnter={submit}
				/>
				{error && <div className="adm-error">{error}</div>}
				<button type="button" className="adm-btn big primary block" onClick={submit}>
					새 비밀번호로 변경
				</button>
			</div>
		</div>
	);
}
