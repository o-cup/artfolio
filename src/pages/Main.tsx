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
		// 처음 한 번만 실행하려는 의도라 의존성을 비워 둬요 (Vercel 빌드가 경고를 오류로 취급해서 표시)
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
