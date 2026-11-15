import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Main from "../../pages/Main";
import Works from "../../pages/Works";
import About from "../../pages/About";
import Exhibitions from "../../pages/Exhibitions";
import ExhibitionDetail from "../exhibitions/detail/ExhibitionDetail";

// 관리자 화면은 따로 불러와서, 일반 방문자용 사이트는 가볍게 유지해요.
const AdminApp = lazy(() => import("../../admin/AdminApp"));

const AnimatedRoutes = () => {
	const location = useLocation();

	if (location.pathname === "/admin" || location.pathname.startsWith("/admin/")) {
		return (
			<Suspense fallback={null}>
				<Routes>
					<Route path="/admin/*" element={<AdminApp />} />
				</Routes>
			</Suspense>
		);
	}

	return (
		<AnimatePresence mode="wait">
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<Main />} />
				<Route path="/works" element={<Main />} />
				<Route path="/works/:id" element={<Works />} />
				<Route path="/about" element={<About />} />
				<Route path="/exhibitions" element={<Exhibitions />} />
				<Route path="/exhibitions/:id" element={<ExhibitionDetail />} />
			</Routes>
		</AnimatePresence>
	);
};

export default AnimatedRoutes;
