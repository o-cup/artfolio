import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { DESKTOP_DEVICE, MOBILE_DEVICE } from "../../styles/theme";

type Props = {
	data: ExhibitionDataType;
};

const ExhibitionListItem = ({ data }: Props) => {
	const navigate = useNavigate();
	const { id, posterUrl, type, title, date, location } = data;

	return (
		<Styled.Wrap onClick={() => navigate(`/exhibitions/${id}`)}>
			<Styled.Poster src={posterUrl} alt="poster" />
			<StyledText.Type>{type}</StyledText.Type>
			<StyledText.Title> {title}</StyledText.Title>
			<StyledText.Date>{date}</StyledText.Date>
			<StyledText.Location>{location}</StyledText.Location>
		</Styled.Wrap>
	);
};

export default ExhibitionListItem;

const itemWidth = "calc((100vw - (30px * 2) - (24px * 4)) / 5)";

const Styled = {
	Wrap: styled.li`
		cursor: pointer;

		@media screen and (${DESKTOP_DEVICE}) {
			width: ${itemWidth};
			line-height: 24px;
		}

		@media screen and (${MOBILE_DEVICE}) {
			width: 45vw;
		}
	`,
	Poster: styled.img`
		width: 100%;
	`,
};
const StyledText = {
	Type: styled.p`
		font-size: 12px;
		color: ${({ theme }) => theme.colors.gray};
		line-height: 18px;
	`,
	Title: styled.p`
		font-size: 14px;
		color: ${({ theme }) => theme.colors.black};
		margin-bottom: 12px;
	`,
	Date: styled.p`
		font-size: 12px;
		line-height: 16px;
		color: ${({ theme }) => theme.colors.black};
	`,
	Location: styled.p`
		font-size: 12px;
		line-height: 16px;
		color: ${({ theme }) => theme.colors.black};
	`,
};
