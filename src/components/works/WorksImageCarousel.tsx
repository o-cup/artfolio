import React, { useRef, useEffect } from "react";
import ModalViewer from "../../shared/components/modalViewer";
import { useModal } from "../../context/ModalProvider";
import { CarouselWrap } from "./styles/worksStyle";

interface Props {
	data: WorkDetailType;
}

function WorksImageCarousel({ data }: Props) {
	const { isModalOpen, openModal, setItemId } = useModal();
	const carouselRef = useRef<HTMLDivElement>(null); // Create a ref for the carousel

	const handleImgClick = (subId: number) => {
		openModal();
		setItemId(subId);
	};

	useEffect(() => {
		if (carouselRef.current) {
			carouselRef.current.scrollLeft = 0;
		}
	}, [data]);

	return (
		<>
			<CarouselWrap ref={carouselRef}>
				{data.images.map((image, index) => {
					const subId = index + 1;

					return (
						<img
							role="presentation"
							key={subId}
							src={image}
							alt={`carousel-img-${subId}`}
							onClick={() => handleImgClick(subId)}
						/>
					);
				})}
			</CarouselWrap>
			{isModalOpen && <ModalViewer totalCount={data.imgCount} category="works" />}
		</>
	);
}

export default WorksImageCarousel;
