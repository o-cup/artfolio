import styled, { CSSObject } from "styled-components";
import defaultTheme from "../../../styles/theme";

type ButtonProps = {
	typography: keyof typeof defaultTheme.text;
	active?: boolean;
	customStyle?: CSSObject;
};

export const StyledTextButton = styled.button.attrs(({ customStyle }: ButtonProps) => ({
	style: {
		...customStyle,
	},
}))<ButtonProps>`
	display: inline-block;
	background: none;
	border: none;
	outline: none;
	margin: 0;
	padding: 0;
	font-size: 0;

	> span {
		display: inline-block;
		vertical-align: middle;
		${({ theme, typography }) => theme.text[typography]};
		${({ active }) => (active ? "font-weight: bold" : "")};
		color: ${({ theme, active }) => (active ? theme.colors.black : theme.colors.gray)};
	}

	&:hover {
		> span {
			color: ${({ theme }) => theme.colors.black};
		}
	}
`;

export default {};
