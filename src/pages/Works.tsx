import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../shared/components/layout";
import { LangContext } from "../context/LanguageProvider";
import worksData from "../components/works/worksData.json";
import WorksImageCarousel from "../components/works/WorksImageCarousel";
import WorksDescription from "../components/works/WorksDescription";
import Motion from "../shared/components/motion";

function Works() {
	const { lang } = useContext(LangContext);
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const data = worksData[lang].find((item) => item.id === id);
	if (!data) return null;

	return (
		<Motion>
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
		</Motion>
	);
}

export default Works;
