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
	background: none;
	padding: 0;
	border: none;
	margin: 0;
	display: flex;
	justify-content: center;
	align-content: center;
	${({ theme, typography }) => theme.text[typography]};
	color: ${({ active, theme }) => (active ? theme.colors.black : theme.colors.gray)};
	font-weight: ${({ active }) => (active ? "bold" : "regular")};

	&:hover {
		color: ${({ theme }) => theme.colors.black};
	}
`;

export default {};
