import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { DESKTOP_DEVICE, MOBILE_DEVICE } from "../../styles/theme";
import Text from "../../shared/components/text";

type Props = {
	data: ExhibitionDataType;
};

const ExhibitionListItem = ({ data }: Props) => {
	const navigate = useNavigate();
	const { id, posterUrl, type, title, date, location } = data;

	return (
		<Styled.Wrap onClick={() => navigate(`/exhibitions/${id}`)}>
			<Styled.Poster src={posterUrl} alt="poster" />
			<Text typography="body2" color="gray" customStyle={{ fontSize: "12px" }}>
				{type}
			</Text>
			<Text typography="body2" customStyle={{ marginBottom: "12px" }}>
				{title}
			</Text>
			<Text typography="body2" customStyle={{ fontSize: "12px" }}>
				{date}
			</Text>
			<Text typography="body2" customStyle={{ fontSize: "12px" }}>
				{location}
			</Text>
		</Styled.Wrap>
	);
};

export default ExhibitionListItem;

const itemWidth = "calc((100vw - (30px * 2) - (24px * 4)) / 5)";

const Styled = {
	Wrap: styled.li`
		cursor: pointer;
		line-height: 24px;

		> span {
			display: inline-block;
		}

		@media screen and (${DESKTOP_DEVICE}) {
			width: ${itemWidth};
		}

		@media screen and (${MOBILE_DEVICE}) {
			width: 45vw;
		}
	`,
	Poster: styled.img`
		width: 100%;
		/* margin-bottom: 8px; */
	`,
};
