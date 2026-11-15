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
			<PosterWrap>
				<Styled.Poster src={posterUrl} alt="poster" />
			</PosterWrap>
			<StyledText.Type>{type}</StyledText.Type>
			<StyledText.Title> {title}</StyledText.Title>
			<StyledText.Date>{date}</StyledText.Date>
			<StyledText.Location>{location}</StyledText.Location>
		</Styled.Wrap>
	);
};

export default ExhibitionListItem;

const itemWidth = "calc((100vw - (30px * 2) - (24px * 4)) / 5)";

const PosterWrap = styled.div`
	position: relative;
	overflow: hidden;

	/* 다른 전시에 마우스를 올렸을 때 이 포스터를 흐리게 덮는 막 (평소엔 안 보여요) */
	&::after {
		content: "";
		position: absolute;
		inset: 0;
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
		background: rgba(217, 217, 217, 0.01);
		opacity: 0;
		transition: opacity 0.25s ease;
		pointer-events: none;
	}
`;

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

		&:hover {
			p:nth-child(3) {
				font-weight: bold;
			}
		}

		/* 한 전시에 마우스를 올리면, 나머지 전시 포스터는 흐리게 (마우스가 있는 PC에서만) */
		@media (hover: hover) {
			ul:has(> li:hover) > &:not(:hover) ${PosterWrap}::after {
				opacity: 1;
			}
		}
	`,
	Poster: styled.img`
		display: block;
		width: 100%;
	`,
};
const StyledText = {
	Type: styled.p`
		font-size: 12px;
		color: ${({ theme }) => theme.colors.gray};
		line-height: 16px;
	`,
	Title: styled.p`
		font-size: 14px;
		color: ${({ theme }) => theme.colors.black};
		margin-bottom: 12px;
		line-height: 16px;
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
