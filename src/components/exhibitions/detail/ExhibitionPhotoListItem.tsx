import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

type Props = {
	id: number;
	imgUrl: string;
};

const ExhibitionPhotoListItem = ({ id: subId, imgUrl }: Props) => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const handleClick = () => {
		const formattedSubId = subId < 10 ? `0${subId}` : subId.toString();
		navigate(`/exhibitions/${id}/${formattedSubId}`);
	};

	return (
		<Styled.Wrap onClick={handleClick}>
			<Styled.Image src={imgUrl} alt={subId.toString()} />
		</Styled.Wrap>
	);
};

export default ExhibitionPhotoListItem;

const Styled = {
	Wrap: styled.li``,
	Image: styled.img`
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
	`,
};
