import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Main from "../../pages/Main";
import Works from "../../pages/Works";
import About from "../../pages/About";
import Exhibitions from "../../pages/Exhibitions";
import ExhibitionDetail from "../exhibitions/detail/ExhibitionDetail";

const AnimatedRoutes = () => {
	const location = useLocation();

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
