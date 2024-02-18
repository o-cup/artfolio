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
	padding: 0;
	border: none;
	margin: 0;
	${({ theme, typography }) => theme.text[typography]};
	color: ${({ theme }) => theme.colors.gray};
	font-weight: ${({ active }) => (active ? "bold" : "regular")};

	&:hover {
		color: ${({ theme }) => theme.colors.black};
	}
`;

export default {};
