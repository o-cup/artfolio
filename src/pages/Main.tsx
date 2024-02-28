import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../shared/components/layout";
import MainList from "../components/main/MainList";

function Main() {
	const navigate = useNavigate();

	useEffect(() => {
		navigate("/works");
	}, []);

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
			<Layout
				mainPaddingBottom={{
					desktop: "200px",
					mobile: "170px",
				}}
			>
				<MainList />
			</Layout>
		</motion.div>
	);
}

export default Main;
