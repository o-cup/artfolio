import styled from "styled-components";
import { DESKTOP_DEVICE } from "../../../styles/theme";

type Props = {
	data: ExhibitionDataType;
};

const Poster = ({ data }: Props) => (
	<Styled.Poster>
		<Styled.Image src={data.posterUrl} />
	</Styled.Poster>
);

export default Poster;

const Styled = {
	Poster: styled.section`
		margin-bottom: 32px;
		display: flex;
		justify-content: center;
	`,
	Image: styled.img`
		width: 80%;

		@media screen and (${DESKTOP_DEVICE}) {
			width: 100%;
		}
	`,
};
