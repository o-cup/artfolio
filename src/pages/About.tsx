import React from "react";
import Layout from "../shared/components/layout";
import AboutContent from "../components/about/AboutContent";

function About() {
	return (
		<Layout
			mainPaddingBottom={{
				desktop: "200px",
				mobile: "170px",
			}}
		>
			<AboutContent />
		</Layout>
	);
}

export default About;
