import styled from "styled-components";
import Text from "../text";
import { DESKTOP_DEVICE } from "../../../styles/theme";

type Props = {
	handleClick: () => void;
};

const CloseButton = ({ handleClick }: Props) => (
	<Styled.Wrap onClick={handleClick}>
		<img src="/icons/close.svg" alt="close" />
		<Text typography="body2" customStyle={{ fontWeight: "bold" }}>
			close
		</Text>
	</Styled.Wrap>
);
export default CloseButton;

const Styled = {
	Wrap: styled.div`
		position: absolute;
		top: 16px;
		right: 16px;
		display: flex;
		align-items: center;
		cursor: pointer;
		z-index: 999;

		@media screen and (${DESKTOP_DEVICE}) {
			top: 24px;
			right: 24px;
		}
	`,
};
