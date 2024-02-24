import React from "react";
import { MainListItemWrap, MainWorkImageWrap, MainWorkTitleWrap } from "./styles/mainStyle";
import Text from "../../shared/components/text";

interface Props {
	data: WorkType;
}

function MainListItem({ data }: Props) {
	return (
		<MainListItemWrap>
			<MainWorkImageWrap>
				<img src={data.imageUrl} alt={data.title} />
			</MainWorkImageWrap>
			<MainWorkTitleWrap>
				<Text typography="body2" color="gray">{`<${data.title}>, ${data.year}`}</Text>
			</MainWorkTitleWrap>
		</MainListItemWrap>
	);
}

export default MainListItem;
