import React from "react";
import { MainWorkTitleWrap, MainWorkImageWrap, MainListItemWrap } from "./styles/mainStyle";
import Text from "../../shared/components/text";

interface Props {
	data: WorkType;
}

function MainListItem({ data }: Props) {
	return (
		<MainListItemWrap>
			<MainWorkImageWrap>
				<img src={data.imageUrl} alt={data.title.en} />
			</MainWorkImageWrap>
			<MainWorkTitleWrap>
				<Text typography="body2" color="gray">{`<${data.title.en}>, ${data.year}`}</Text>
			</MainWorkTitleWrap>
		</MainListItemWrap>
	);
}

export default MainListItem;
