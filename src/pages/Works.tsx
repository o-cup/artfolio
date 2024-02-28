import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import Layout from "../shared/components/layout";
import { LangContext } from "../context/LanguageProvider";
import worksData from "../components/works/worksData.json";
import WorksImageCarousel from "../components/works/WorksImageCarousel";
import WorksDescription from "../components/works/WorksDescription";

function Works() {
	const { lang } = useContext(LangContext);
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const data = worksData[lang].find((item) => item.id === id);
	if (!data) return null;

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
			<Layout
				mainPaddingBottom={{
					desktop: "500px",
					mobile: "500px",
				}}
			>
				<>
					<WorksImageCarousel data={data} />
					<WorksDescription data={data} />
				</>
			</Layout>
		</motion.div>
	);
}

export default Works;
