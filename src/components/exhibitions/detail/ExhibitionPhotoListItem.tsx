import styled from "styled-components";
import { useModal } from "../../../context/ModalProvider";

type Props = {
	id: number;
	imgUrl: string;
};

const ExhibitionPhotoListItem = ({ id: subId, imgUrl }: Props) => {
	const { openModal, setItemId } = useModal();

	const handleClick = () => {
		setItemId(subId);
		openModal();
	};

	return (
		<Styled.Wrap onClick={handleClick}>
			<Styled.Image src={imgUrl} alt={subId.toString()} />
		</Styled.Wrap>
	);
};

export default ExhibitionPhotoListItem;

const Styled = {
	Wrap: styled.li`
		cursor: pointer;
		position: relative;
		width: 100%;

		&:before {
			content: "";
			display: block;
			padding-top: 100%; // Creates a 1:1 aspect ratio box
		}
	`,
	Image: styled.img`
		width: 100%;
		height: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		position: absolute;
		top: 0;
		left: 0;
	`,
};
