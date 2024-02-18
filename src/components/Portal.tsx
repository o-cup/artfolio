import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

interface PortalProps {
	children: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
}

const Portal: React.FC<PortalProps> = ({ children, isOpen, onClose }) => {
	if (!isOpen) return null;

	const portalRoot = document.getElementById("portal-root");
	if (!portalRoot) return null;

	return ReactDOM.createPortal(
		<Styled.Overlay
			onClick={() => {
				console.log("click");
			}}
		>
			<Styled.Content onClick={(e) => e.stopPropagation()}>{children}</Styled.Content>
		</Styled.Overlay>,
		portalRoot
	);
};

export default Portal;

const Styled = {
	Overlay: styled.div`
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5); // Semi-transparent background
		display: flex;
		justify-content: center;
		align-items: center;
	`,
	Content: styled.div`
		background: white;
		padding: 20px;
		border-radius: 5px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	`,
};
