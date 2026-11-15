import styled from "styled-components";
import ExhibitionPhotoListItem from "./ExhibitionPhotoListItem";
import { DESKTOP_DEVICE } from "../../../styles/theme";

type Props = {
	data: ExhibitionDataType;
};

const ExhibitionPhotoList = ({ data }: Props) => {
	const { images } = data;

	return (
		<Styled.Wrap>
			{images.map((imgUrl, index) => (
				<ExhibitionPhotoListItem key={imgUrl} id={index + 1} imgUrl={imgUrl} />
			))}
		</Styled.Wrap>
	);
};

export default ExhibitionPhotoList;

const Styled = {
	Wrap: styled.ul`
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4px;
		padding: 0 12px;

		@media screen and (${DESKTOP_DEVICE}) {
			gap: 15px;
			padding: 0;
			grid-template-columns: repeat(4, 1fr);
			align-content: start;
		}
	`,
};
