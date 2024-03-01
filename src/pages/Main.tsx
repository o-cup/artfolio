import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../shared/components/layout";
import MainList from "../components/main/MainList";
import Motion from "../shared/components/motion";
import { useModal } from "../context/ModalProvider";

function Main() {
	const navigate = useNavigate();

	const { closeModal } = useModal();

	useEffect(() => {
		navigate("/works");
		closeModal(); // words:id 내에서 모달 오픈 후 모바일 네이티브 뒤로가기 시 모달이 열린 상태인 문제 처리
	}, []);

	return (
		<Motion>
			<Layout
				mainPaddingBottom={{
					desktop: "200px",
					mobile: "170px",
				}}
			>
				<MainList />
			</Layout>
		</Motion>
	);
}

export default Main;
