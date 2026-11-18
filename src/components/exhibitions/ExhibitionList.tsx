import styled from "styled-components";
import { useContext } from "react";
import ExhibitionListItem from "./ExhibitionListItem";
import { DESKTOP_DEVICE, MOBILE_DEVICE } from "../../styles/theme";
import { LangContext } from "../../context/LanguageProvider";
import { exhibitionsData } from "../../shared/siteData";
import { sortExhibitionsNewestFirst } from "../../shared/exhibitionOrder";

const ExhibitionList = () => {
	const { lang } = useContext(LangContext);

	// 시작일 기준 최신순. 날짜 규칙은 한국어 날짜(연/월/일)로 판단해요.
	const koDate = new Map(exhibitionsData.ko.map((x) => [x.id, x.date]));
	const data = sortExhibitionsNewestFirst(exhibitionsData[lang], (x) => koDate.get(x.id) || x.date);

	return (
		<Styled.Wrap>
			{data.map((item) => (
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
