import Layout from "../shared/components/layout";
import ExhibitionList from "../components/exhibitions/ExhibitionList";

function Exhibitions() {
	return (
		<Layout
			mainPaddingBottom={{
				desktop: "200px",
				mobile: "170px",
			}}
		>
			<ExhibitionList />
		</Layout>
	);
}

export default Exhibitions;
