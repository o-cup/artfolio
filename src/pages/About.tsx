import Layout from "../shared/components/layout";
import AboutContent from "../components/about/AboutContent";
import Motion from "../shared/components/motion";

function About() {
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
