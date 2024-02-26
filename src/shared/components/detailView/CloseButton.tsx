import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import Text from "../text";
import { DESKTOP_DEVICE } from "../../../styles/theme";

const CloseButton = () => {
	const navigate = useNavigate();

	const { id } = useParams<{ id: string }>();

	const handleClick = () => {
		navigate(`/exhibitions/${id}`);
	};

	return (
		<Styled.Wrap onClick={handleClick}>
			<img src="/icons/close.svg" alt="close" />
			<Text typography="body2" customStyle={{ fontWeight: "bold" }}>
				close
			</Text>
		</Styled.Wrap>
	);
};

export default CloseButton;

const Styled = {
	Wrap: styled.div`
		position: absolute;
		top: 16px;
		right: 16px;
		display: flex;
		align-items: center;
		cursor: pointer;
		z-index: 1;

		@media screen and (${DESKTOP_DEVICE}) {
			top: 24px;
			right: 24px;
		}
	`,
};
