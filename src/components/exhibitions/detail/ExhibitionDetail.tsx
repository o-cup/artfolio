import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useContext, useEffect } from "react";
import Poster from "./Poster";
import Information from "./Information";
import exhibitionsData from "../exhibitionsData.json";
import Layout from "../../../shared/components/layout";
import ExhibitionPhotoList from "./ExhibitionPhotoList";
import { DESKTOP_DEVICE } from "../../../styles/theme";
import { LangContext } from "../../../context/LanguageProvider";
import ModalViewer from "../../../shared/components/modalViewer";
import { useModal } from "../../../context/ModalProvider";
import Motion from "../../../shared/components/motion";

const ExhibitionDetail = () => {
	const { lang } = useContext(LangContext);
	const { id } = useParams<{ id: string }>();
	const { isModalOpen } = useModal();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const data = exhibitionsData[lang].find((item) => item.id === id);
	if (!data) return null;

	const totalCount = data?.imgCount;

	return (
		<Motion>
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
					</StyledDesktop.LeftAreaWrap>
					<ExhibitionPhotoList data={data} />
				</Styled.Wrap>
			</Layout>
			{isModalOpen && <ModalViewer totalCount={totalCount} category="exhibitions" />}
		</Motion>
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
