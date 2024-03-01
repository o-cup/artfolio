import React from "react";
import { DescriptionWrap } from "./styles/worksStyle";
import Text from "../../shared/components/text";
import BackButton from "../../shared/components/backButton";

interface Props {
	data: WorkDetailType;
}

function WorksDescription({ data }: Props) {
	return (
		<DescriptionWrap>
			<Text typography="title1">{`<${data.title}>, ${data.year}`}</Text>
			<Text typography="body2_extraWide">{data.description}</Text>
			<BackButton text="works" />
		</DescriptionWrap>
	);
}

export default WorksDescription;
