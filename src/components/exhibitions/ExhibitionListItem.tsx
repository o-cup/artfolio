import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { DESKTOP_DEVICE, MOBILE_DEVICE } from "../../styles/theme";

type Props = {
	data: {
		id: string;
		imgUrl: string;
	};
};

const ExhibitionListItem = ({ data }: Props) => {
	const navigate = useNavigate();

	const { id, imgUrl } = data;

	return (
		<Styled.Wrap onClick={() => navigate(`/exhibitions/${id}`)}>
			<Styled.Poster src={imgUrl} alt="poster" />
		</Styled.Wrap>
	);
};

export default ExhibitionListItem;

const itemWidth = "calc((100vw - (30px * 2) - (24px * 4)) / 5)";

const Styled = {
	Wrap: styled.li`
		@media screen and (${DESKTOP_DEVICE}) {
			width: ${itemWidth};
			cursor: pointer;
		}

		@media screen and (${MOBILE_DEVICE}) {
			width: 45vw;
		}
	`,
	Poster: styled.img`
		width: 100%;
		/* object-fit: cover; */
	`,
};
