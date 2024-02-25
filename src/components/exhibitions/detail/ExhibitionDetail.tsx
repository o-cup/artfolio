import { useParams } from "react-router-dom";
import styled from "styled-components";
import Poster from "./Poster";
import Information from "./Information";
import exhibitionsData from "../exhibitionsData";
import Layout from "../../../shared/components/layout";
import BackButton from "./BackButton";
import ExhibitionPhotoList from "./ExhibitionPhotoList";

const ExhibitionDetail = () => {
	const { id } = useParams<{ id: string }>();

	const data = exhibitionsData.kr.find((item) => item.id === id);
	if (!data) return null;

	return (
		<Layout
			mainPaddingBottom={{
				desktop: "200px",
				mobile: "170px",
			}}
		>
			<Styled.Wrap>
				<>
					<Poster data={data} />
					<Information data={data} />
					<BackButton />
				</>
				<ExhibitionPhotoList data={data} />
			</Styled.Wrap>
		</Layout>
	);
};

export default ExhibitionDetail;

const Styled = {
	Wrap: styled.div`
		width: 100%;
	`,
};
