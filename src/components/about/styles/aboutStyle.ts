import styled from "styled-components";
import { DESKTOP_DEVICE, MOBILE_DEVICE } from "../../../styles/theme";

export const AboutContentWrap = styled.div`
	display: flex;
	flex-direction: column;
	gap: 136px;

	@media screen and ${DESKTOP_DEVICE} {
		padding: 120px 24px 0;
	}

	@media screen and ${MOBILE_DEVICE} {
		padding: 48px 12px;
	}
`;

export const AboutArtistWrap = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;

	@media screen and ${DESKTOP_DEVICE} {
		max-width: 746px;
	}
`;

export const AboutHistoriesWrap = styled.div`
	display: flex;
	flex-direction: column;
	gap: 56px;

	ul {
		padding-top: 16px;

		li {
			position: relative;
			padding-left: 20px;
		}

		li::before {
			position: absolute;
			content: "∙";
			width: 20px;
			${({ theme }) => theme.text.body2_extraWide};
			top: 0;
			left: 0;
			text-align: center;
		}
	}
`;

export default {};
