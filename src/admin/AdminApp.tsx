// 어드민 화면의 시작점: 로그인 확인 → 데이터 불러오기 → 각 화면으로 연결

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./admin.css";
import { api, ApiError, RawContent } from "./api";
import { fromRaw, Model } from "./model";
import { DialogProvider, Icon, loadIconFont, useDialog } from "./ui";
import { Ctx, useAdmin } from "./context";
import { WorkEdit, WorksList } from "./WorksPages";
import { ExhibitionEdit, ExhibitionsList } from "./ExhibitionsPages";
import AboutEdit from "./AboutPage";
import { LoginPage, SetPasswordPage } from "./LoginPages";

// ---------- 화면 틀 ----------
const MENU = [
	{ path: "/admin/works", label: "작업" },
	{ path: "/admin/about", label: "소개 · 이력" },
	{ path: "/admin/exhibitions", label: "전시" },
];

function TopBar() {
	const { go, logout } = useAdmin();
	const { pathname } = useLocation();
	return (
		<header className="adm-top">
			<div className="adm-top-inner">
				<button type="button" className="adm-brand" onClick={() => go("/admin")}>
					Parkmejung<span className="adm-badge">admin</span>
				</button>
				<nav className="adm-nav">
					{MENU.map((m) => (
						<button
							key={m.path}
							type="button"
							className={`adm-navlink ${pathname.startsWith(m.path) ? "on" : ""}`}
							onClick={() => go(m.path)}
						>
							{m.label}
						</button>
					))}
				</nav>
				<div className="adm-top-side">
					<a className="adm-navlink" href="/works" target="_blank" rel="noreferrer">
						사이트
						<Icon name="arrow_outward" />
					</a>
					<button type="button" className="adm-navlink" onClick={logout}>
						로그아웃
					</button>
				</div>
			</div>
		</header>
	);
}

function Home() {
	const { go } = useAdmin();
	const items = [
		{ path: "/admin/works", title: "작업", desc: "작업을 편집해요" },
		{ path: "/admin/about", title: "소개 · 이력", desc: "작가 소개글과 전시·수상 이력을 고쳐요" },
		{ path: "/admin/exhibitions", title: "전시", desc: "전시 소식을 편집해요" },
	];
	return (
		<div className="adm-stack">
			<div>
				<h1 className="adm-greeting">박미정님, 안녕하세요</h1>
				<p className="adm-muted" style={{ marginTop: 0, fontSize: 22 }}>
					무엇을 편집할까요?
				</p>
			</div>
			<div className="adm-menu">
				{items.map((it) => (
					<button key={it.path} type="button" className="adm-menu-item" onClick={() => go(it.path)}>
						<h2>{it.title}</h2>
						<span className="adm-muted">{it.desc}</span>
					</button>
				))}
			</div>
			<hr className="adm-divider" />
			<div className="adm-notice">
				저장한 내용은 <b>2~3분 뒤</b>에 사이트에 보여요. 한국어만 쓰시면 영어는 자동으로 번역돼요.
			</div>
			<div className="adm-row">
				<button type="button" className="adm-btn" onClick={() => go("/admin/password")}>
					비밀번호 바꾸기
				</button>
			</div>
		</div>
	);
}

function LoggedIn({ onLogout }: { onLogout: () => void }) {
	const navigate = useNavigate();
	const dialog = useDialog();
	const [raw, setRaw] = useState<RawContent | null>(null);
	const [model, setModel] = useState<Model | null>(null);
	const [loadError, setLoadError] = useState("");
	// "영어 번역도 같이 보기"는 기억하지 않고, 화면을 열 때마다 꺼진 상태로 시작해요.
	const [showEn, setShowEn] = useState(false);
	const { pathname } = useLocation();
	useEffect(() => setShowEn(false), [pathname]);
	const dirtyRef = useRef(false);

	const load = useCallback(() => {
		setLoadError("");
		api
			.content()
			.then((r) => {
				setRaw(r);
				setModel(fromRaw(r));
			})
			.catch((e: ApiError) => {
				if (e.status === 401) onLogout();
				else setLoadError(e.message);
			});
	}, [onLogout]);

	useEffect(load, [load]);

	useEffect(() => {
		const warn = (e: BeforeUnloadEvent) => {
			if (!dirtyRef.current) return;
			e.preventDefault();
			e.returnValue = "";
		};
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, []);

	const go = useCallback(
		async (path: string) => {
			if (dirtyRef.current) {
				const leave = await dialog.confirm({
					title: "아직 저장하지 않았어요",
					message: "지금 나가면 작성한 내용이 사라져요.\n그래도 나갈까요?",
					ok: "나가기",
					cancel: "계속 작성",
					danger: true,
				});
				if (!leave) return;
				dirtyRef.current = false;
			}
			navigate(path);
			window.scrollTo(0, 0);
		},
		[dialog, navigate]
	);

	const setDirty = useCallback((d: boolean) => {
		dirtyRef.current = d;
	}, []);

	const logout = useCallback(async () => {
		const ok = await dialog.confirm({
			title: "로그아웃할까요?",
			message: "다음에 들어올 때 비밀번호를 다시 넣어야 해요.",
			ok: "로그아웃",
			cancel: "그대로 있기",
		});
		if (!ok) return;
		await api.logout().catch(() => null);
		onLogout();
	}, [dialog, onLogout]);

	const ctx = useMemo(
		() =>
			model && raw
				? { model, setModel, rawBase: raw.rawBase, go, setDirty, showEn, setShowEn, logout }
				: null,
		[model, raw, go, setDirty, showEn, setShowEn, logout]
	);

	if (loadError) {
		return (
			<main className="adm-main">
				<div className="adm-card adm-stack">
					<div className="adm-error">{loadError}</div>
					<button type="button" className="adm-btn big primary" onClick={load}>
						다시 불러오기
					</button>
				</div>
			</main>
		);
	}
	if (!ctx) {
		return (
			<main className="adm-main" style={{ textAlign: "center", paddingTop: 120 }}>
				<div className="adm-spinner" />
				<p style={{ marginTop: 20 }}>불러오는 중이에요…</p>
			</main>
		);
	}

	return (
		<Ctx.Provider value={ctx}>
			<TopBar />
			<main className="adm-main">
				<Routes>
					<Route index element={<Home />} />
					<Route path="works" element={<WorksList />} />
					<Route path="works/:id" element={<WorkEdit />} />
					<Route path="exhibitions" element={<ExhibitionsList />} />
					<Route path="exhibitions/:id" element={<ExhibitionEdit />} />
					<Route path="about" element={<AboutEdit />} />
					<Route
						path="password"
						element={<SetPasswordPage mode="change" onDone={() => go("/admin")} onCancel={() => go("/admin")} />}
					/>
					<Route path="*" element={<Home />} />
				</Routes>
			</main>
		</Ctx.Provider>
	);
}

type AuthState = "loading" | "out" | "in" | "mustSet" | "error";

function Gate() {
	const [state, setState] = useState<AuthState>("loading");
	const [googleClientId, setGoogleClientId] = useState<string | null>(null);

	const check = useCallback(() => {
		api
			.me()
			.then((me) => {
				setGoogleClientId(me.googleClientId);
				if (!me.loggedIn) setState("out");
				else setState(me.mustSetPassword ? "mustSet" : "in");
			})
			.catch(() => setState("error"));
	}, []);
	useEffect(check, [check]);

	const onLogout = useCallback(() => setState("out"), []);

	if (state === "loading") return null;
	if (state === "error") {
		return (
			<div className="adm-login adm-stack">
				<div className="adm-error">인터넷 연결을 확인하고 다시 시도해 주세요.</div>
				<button type="button" className="adm-btn big primary block" onClick={check}>
					다시 시도
				</button>
			</div>
		);
	}
	if (state === "out") return <LoginPage googleClientId={googleClientId} onLoggedIn={check} />;
	if (state === "mustSet") {
		return (
			<main className="adm-main">
				<SetPasswordPage mode="reset" onDone={() => setState("in")} />
			</main>
		);
	}
	return <LoggedIn onLogout={onLogout} />;
}

export default function AdminApp() {
	useEffect(() => {
		loadIconFont();
		const prev = document.title;
		document.title = "사이트 관리 | Park Mejung";
		return () => {
			document.title = prev;
		};
	}, []);
	return (
		<div className="adm">
			<DialogProvider>
				<Gate />
			</DialogProvider>
		</div>
	);
}
