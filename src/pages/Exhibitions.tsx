import { motion } from "framer-motion";
import Layout from "../shared/components/layout";
import ExhibitionList from "../components/exhibitions/ExhibitionList";

function Exhibitions() {
	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
			<Layout
				mainPaddingBottom={{
					desktop: "200px",
					mobile: "170px",
				}}
			>
				<ExhibitionList />
			</Layout>
		</motion.div>
	);
}

export default Exhibitions;
