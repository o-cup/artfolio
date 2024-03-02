import { useModal } from "../../context/ModalProvider";
import ModalViewer from "../../shared/components/modalViewer";
import { CarouselWrap } from "./styles/worksStyle";

interface Props {
	data: WorkDetailType;
}

function WorksImageCarousel({ data }: Props) {
	const { isModalOpen, openModal, setItemId } = useModal();

	const handleImgClick = (subId: number) => {
		openModal();
		setItemId(subId);
	};

	return (
		<>
			<CarouselWrap>
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
