import React from "react";
import Layout from "../shared/components/layout";
import Text from "../shared/components/text";

function Main() {
	return (
		<Layout
			mainPaddingBottom={{
				desktop: "200px",
				mobile: "170px",
			}}
		>
			{/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
			<Text typography="body1" color="gray">
				// TODO: main
			</Text>
		</Layout>
	);
}

export default Main;
