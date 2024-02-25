import { useParams } from "react-router-dom";
import Poster from "./Poster";
import Information from "./Information";
import exhibitionsData from "./exhibitionsData";

const ExhibitionDetail = () => {
	const { id } = useParams<{ id: string }>();

	const data = exhibitionsData.kr.find((item) => item.id === id);
	if (!data) return null;

	return (
		<div>
			<Poster data={data} />
			<Information />
		</div>
	);
};

export default ExhibitionDetail;
