import styled from "styled-components";
import ExhibitionPhotoListItem from "./ExhibitionPhotoListItem";
import { PREFIX } from "../exhibitionsData";
import { DESKTOP_DEVICE } from "../../../styles/theme";

type Props = {
	data: ExhibitionDataType;
};

const ExhibitionPhotoList = ({ data }: Props) => {
	const { id, exhibitionPhotoCount } = data;
	const photoCountArr = Array.from({ length: exhibitionPhotoCount }, (_, i) => i + 1);

	return (
		<Styled.Wrap>
			{photoCountArr.map((number) => {
				const imgUrl = `${PREFIX}/${id}/${number}.jpeg`;
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
			gap: 24px;
		}
	`,
};
