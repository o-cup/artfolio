import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../shared/components/layout";
import MainList from "../components/main/MainList";
import Motion from "../shared/components/motion";

function Main() {
	const navigate = useNavigate();

	useEffect(() => {
		navigate("/works");
	}, []);

	return (
		<Motion>
			<Layout
				mainPaddingBottom={{
					desktop: "200px",
					mobile: "170px",
				}}
			>
				<MainList />
			</Layout>
		</Motion>
	);
}

export default Main;
