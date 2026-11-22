import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { loadSiteData } from "./shared/siteData";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

// 관리 화면은 스스로 데이터를 불러오니까 기다리지 않아요.
const isAdmin = window.location.pathname.startsWith("/admin");
(isAdmin ? Promise.resolve() : loadSiteData()).then(() => {
	root.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
});
