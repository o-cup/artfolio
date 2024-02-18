import styled from "styled-components";
import { DESKTOP_DEVICE, MOBILE_DEVICE } from "../../../../styles/theme";

export const StyledHeader = styled.header`
	position: fixed;
	display: flex;
	flex-direction: column;
	width: 100%;
	z-index: ${({ theme }) => theme.zIndex.header};
	background: ${({ theme }) => theme.colors.background};

	@media screen and ${DESKTOP_DEVICE} {
		height: ${({ theme }) => theme.heights.header.desktop};
	}

	@media screen and ${MOBILE_DEVICE} {
		height: ${({ theme }) => theme.heights.header.mobile};
	}
`;

export const HeaderContentWrap = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;

	@media screen and ${DESKTOP_DEVICE} {
		padding: 24px;
	}

	@media screen and ${MOBILE_DEVICE} {
		padding: 16px 12px 12px;
	}

	h1.title {
		font-size: 16px;
		font-weight: bold;
	}
`;

export const DesktopNavWrap = styled.nav`
	display: flex;
	align-items: center;
	gap: 48px;
	margin: 0 auto;
`;

export const MobileNavWrap = styled.nav`
	width: 100%;
	display: flex;
	align-items: center;
	gap: 24px;
	padding: 12px 12px 16px;
`;

export const LanguageWrap = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export default {};
