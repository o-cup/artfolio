import styled from "styled-components";
import { DESKTOP_DEVICE, MOBILE_DEVICE } from "../../../styles/theme";

export const StyledLayout = styled.div`
	width: 100%;
	min-width: 320px;
	min-height: 100vh;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: ${({ theme }) => theme.colors.background};
`;

export const StyledContent = styled.main<{
	mainPaddingBottom?: {
		desktop?: string;
		mobile?: string;
	};
}>`
	width: 100%;

	@media screen and ${DESKTOP_DEVICE} {
		padding-top: ${({ theme }) => theme.heights.header.desktop};
		padding-bottom: ${({ mainPaddingBottom }) => mainPaddingBottom?.desktop || ""};
	}
	@media screen and ${MOBILE_DEVICE} {
		padding-top: ${({ theme }) => theme.heights.header.mobile};
		padding-bottom: ${({ mainPaddingBottom }) => mainPaddingBottom?.mobile || ""};
	}
`;

export default {};
