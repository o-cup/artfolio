import { motion } from "framer-motion";
import Layout from "../shared/components/layout";
import AboutContent from "../components/about/AboutContent";

function About() {
	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
			<Layout
				mainPaddingBottom={{
					desktop: "200px",
					mobile: "170px",
				}}
			>
				<AboutContent />
			</Layout>
		</motion.div>
	);
}

export default About;
