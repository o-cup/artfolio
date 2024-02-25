import styled from "styled-components";

type Props = {
	id: number;
	imgUrl: string;
};

const ExhibitionPhotoListItem = ({ id, imgUrl }: Props) => (
	<Styled.Wrap>
		<Styled.Image src={imgUrl} alt={id.toString()} />
	</Styled.Wrap>
);

export default ExhibitionPhotoListItem;

const Styled = {
	Wrap: styled.li``,
	Image: styled.img`
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
	`,
};
