import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../shared/components/layout";
import MainList from "../components/main/MainList";

function Main() {
	const navigate = useNavigate();

	useEffect(() => {
		navigate("/works");
	}, []);

	return (
		<Layout
			mainPaddingBottom={{
				desktop: "200px",
				mobile: "170px",
			}}
		>
			<MainList />
		</Layout>
	);
}

export default Main;
