import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { useModal } from "../../../context/ModalProvider";

type Props = {
	children: React.ReactNode;
};

const Portal: React.FC<Props> = ({ children }) => {
	const { closeModal, isModalOpen } = useModal();

	useEffect(() => {
		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				closeModal();
			}
		};

		window.addEventListener("keyup", handleKeyUp);
		document.body.classList.add("no-scroll");

		return () => {
			window.removeEventListener("keyup", handleKeyUp);
			document.body.classList.remove("no-scroll");
		};
	}, [closeModal]);

	if (!isModalOpen) return null;

	return ReactDOM.createPortal(
		<ModalContent onClick={(e) => e.stopPropagation()}>{children}</ModalContent>,
		document.getElementById("portal-root")!
	);
};

export default Portal;

const ModalContent = styled.div`
	background-color: white;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 99;

	width: 100vw;
	height: 100%;
`;
