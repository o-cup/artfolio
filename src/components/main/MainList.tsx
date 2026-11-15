import React, { useContext } from "react";
import { MainListWrap } from "./styles/mainStyle";
import { worksData } from "../../shared/siteData";
import MainListItem from "./MainListItem";
import { LangContext } from "../../context/LanguageProvider";

function MainList() {
	const { lang } = useContext(LangContext);

	return (
		<MainListWrap>
			{worksData[lang].map((work) => (
				<MainListItem
					key={work.id}
					data={{ id: work.id, title: work.title, year: work.year, imageUrl: work.images[0] }}
				/>
			))}
		</MainListWrap>
	);
}

export default MainList;
