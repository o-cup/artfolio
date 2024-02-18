import React from "react";
import Layout from "../shared/components/layout";
import Text from "../shared/components/text";
import MainList from "../components/main/MainList";

function Main() {
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
