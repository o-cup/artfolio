import styled from "styled-components";
import { DESKTOP_DEVICE, MOBILE_DEVICE } from "../../../../styles/theme";

export const StyledFooter = styled.footer`
	display: flex;
	width: 100%;
	margin-top: auto;

	@media screen and ${DESKTOP_DEVICE} {
		padding: 24px;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
	}
	@media screen and ${MOBILE_DEVICE} {
		padding: 12px;
		gap: 12px;
		flex-direction: column;
	}
`;

export const ContactWrap = styled.div`
	display: flex;

	@media screen and ${DESKTOP_DEVICE} {
		gap: 36px;
	}
	@media screen and ${MOBILE_DEVICE} {
		gap: 24px;
	}

	> a {
		font-size: 14px;
		text-decoration: none;
		color: ${({ theme }) => theme.colors.gray};

		&:hover {
			color: ${({ theme }) => theme.colors.black};
		}
	}
`;

export const CopyrightWrap = styled.div`
	font-size: 12px;
	color: ${({ theme }) => theme.colors.black};
`;

export default {};
