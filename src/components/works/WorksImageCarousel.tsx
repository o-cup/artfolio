import React from "react";
import { CarouselWrap } from "./styles/worksStyle";

interface Props {
	data: WorkDetailType;
}

function WorksImageCarousel({ data }: Props) {
	return (
		<CarouselWrap>
			{data.images.map((image) => (
				<img key={image} src={image} alt={image} />
			))}
		</CarouselWrap>
	);
}

export default WorksImageCarousel;
