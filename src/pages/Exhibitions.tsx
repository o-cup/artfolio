import { useEffect } from "react";
import Layout from "../shared/components/layout";
import ExhibitionList from "../components/exhibitions/ExhibitionList";
import Motion from "../shared/components/motion";

function Exhibitions() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<Motion>
			<Layout
				mainPaddingBottom={{
					desktop: "200px",
					mobile: "170px",
				}}
			>
				<ExhibitionList />
			</Layout>
		</Motion>
	);
}

export default Exhibitions;
