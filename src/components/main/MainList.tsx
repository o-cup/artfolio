import React from "react";
import { MainListWrap } from "./styles/mainStyle";
import dummyData from "./dummyData.json";
import MainListItem from "./MainListItem";

function MainList() {
	return (
		<MainListWrap>
			{dummyData.map((data) => (
				<MainListItem key={data.id} data={data} />
			))}
		</MainListWrap>
	);
}

export default MainList;
