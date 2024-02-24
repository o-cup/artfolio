import React, { useContext } from "react";
import { MainListWrap } from "./styles/mainStyle";
import mainData from "./mainData.json";
import MainListItem from "./MainListItem";
import { LangContext } from "../../context/LanguageProvider";

function MainList() {
	const { lang } = useContext(LangContext);

	return (
		<MainListWrap>
			{mainData[lang].map((data) => (
				<MainListItem key={data.id} data={data} />
			))}
		</MainListWrap>
	);
}

export default MainList;
