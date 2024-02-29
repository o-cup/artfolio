import styled from "styled-components";
import { useContext } from "react";
import ExhibitionListItem from "./ExhibitionListItem";
import { DESKTOP_DEVICE, MOBILE_DEVICE } from "../../styles/theme";
import { LangContext } from "../../context/LanguageProvider";
import exhibitionsData from "./exhibitionsData.json";

const ExhibitionList = () => {
	const { lang } = useContext(LangContext);

	return (
		<Styled.Wrap>
			{exhibitionsData[lang].map((item) => (
				<ExhibitionListItem key={item.id} data={item} />
			))}
		</Styled.Wrap>
	);
};
export default ExhibitionList;

const Styled = {
	Wrap: styled.ul`
		display: flex;
		flex-wrap: wrap;

		@media screen and (${DESKTOP_DEVICE}) {
			column-gap: 24px;
			row-gap: 62px;
			padding: 32px 30px;
		}

		@media screen and (${MOBILE_DEVICE}) {
			justify-content: space-between;
			row-gap: 32px;
			padding: 0 12px;
		}
	`,
};
