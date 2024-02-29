import styled from "styled-components";
import ExhibitionPhotoListItem from "./ExhibitionPhotoListItem";
import { DESKTOP_DEVICE } from "../../../styles/theme";

type Props = {
	data: ExhibitionDataType;
};

const ExhibitionPhotoList = ({ data }: Props) => {
	const { id, imgCount } = data;
	const imgCountArr = Array.from({ length: imgCount }, (_, i) => i + 1);

	return (
		<Styled.Wrap>
			{imgCountArr.map((number) => {
				const imgUrl = `/exhibitions/${id}/${number}.jpeg`;
				return <ExhibitionPhotoListItem key={number} id={number} imgUrl={imgUrl} />;
			})}
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
