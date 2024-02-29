import { CarouselWrap } from "./styles/worksStyle";
import ModalViewer from "../../shared/components/modalViewer";
import { useModal } from "../../context/ModalProvider";

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
				{data.images.map((image) => {
					const subId = data.images.indexOf(image) + 1;

					// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
					return <img key={image} src={image} alt={image} onClick={() => handleImgClick(subId)} />;
				})}
			</CarouselWrap>
			{isModalOpen && <ModalViewer totalCount={data.imgCount} category="works" />}
		</>
	);
}

export default WorksImageCarousel;
