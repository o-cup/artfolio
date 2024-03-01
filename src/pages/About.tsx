import { useEffect } from "react";
import Layout from "../shared/components/layout";
import AboutContent from "../components/about/AboutContent";
import Motion from "../shared/components/motion";

function About() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<Motion>
			<Layout
				mainPaddingBottom={{
					desktop: "200px",
					mobile: "170px",
				}}
			>
				<AboutContent />
			</Layout>
		</Motion>
	);
}

export default About;
