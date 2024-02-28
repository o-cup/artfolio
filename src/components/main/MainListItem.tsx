import React from "react";
import { useNavigate } from "react-router-dom";
import { MainListItemWrap, MainWorkImageWrap, MainWorkTitleWrap } from "./styles/mainStyle";
import Text from "../../shared/components/text";

interface Props {
	data: MainWorkType;
}

function MainListItem({ data }: Props) {
	const navigate = useNavigate();
	return (
		<MainListItemWrap onClick={() => navigate(`/works/${data.id}`)}>
			<MainWorkImageWrap>
				<img src={data.imageUrl} alt={data.title} />
			</MainWorkImageWrap>
			<MainWorkTitleWrap>
				<Text typography="body2">{`<${data.title}>, ${data.year}`}</Text>
			</MainWorkTitleWrap>
		</MainListItemWrap>
	);
}

export default MainListItem;
