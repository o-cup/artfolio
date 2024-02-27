import styled from "styled-components";
import { DESKTOP_DEVICE } from "../../../styles/theme";
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

		@media screen and (${DESKTOP_DEVICE}) {
			aspect-ratio: 1 / 1;
			position: relative;
		}
	`,
	Image: styled.img`
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;

		@media screen and (${DESKTOP_DEVICE}) {
			position: absolute;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	`,
};
