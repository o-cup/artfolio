import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useContext, useEffect } from "react";
import Poster from "./Poster";
import Information from "./Information";
import exhibitionsData from "../exhibitionsData";
import Layout from "../../../shared/components/layout";
import BackButton from "./BackButton";
import ExhibitionPhotoList from "./ExhibitionPhotoList";
import { DESKTOP_DEVICE } from "../../../styles/theme";
import { LangContext } from "../../../context/LanguageProvider";

const ExhibitionDetail = () => {
	const { lang } = useContext(LangContext);
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const data = exhibitionsData[lang].find((item) => item.id === id);
	if (!data) return null;

	return (
		<Layout
			mainPaddingBottom={{
				desktop: "200px",
				mobile: "170px",
			}}
		>
			<Styled.Wrap>
				<StyledDesktop.LeftAreaWrap>
					<Poster data={data} />
					<Information data={data} />
					<BackButton />
				</StyledDesktop.LeftAreaWrap>
				<ExhibitionPhotoList data={data} />
			</Styled.Wrap>
		</Layout>
	);
};

export default ExhibitionDetail;

const Styled = {
	Wrap: styled.div`
		width: 100%;

		@media screen and (${DESKTOP_DEVICE}) {
			display: grid;
			grid-template-columns: 1fr 2fr;
			column-gap: 24px;
			padding: 75px 57px 0;
		}
	`,
};

const StyledDesktop = {
	LeftAreaWrap: styled.div``,
};
