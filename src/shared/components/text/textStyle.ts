import styled, { CSSObject } from "styled-components";
import defaultTheme from "../../../styles/theme";

type TextProps = {
	typography: keyof typeof defaultTheme.text;
	color?: keyof typeof defaultTheme.colors;
	customStyle?: CSSObject;
};

export const StyledText = styled.span.attrs(({ customStyle }: TextProps) => ({
	style: {
		...customStyle,
	},
}))<TextProps>`
	display: inline-block;
	${({ theme, typography }) => theme.text[typography]};
	color: ${({ theme, color }) => (color ? theme.colors[color] : theme.colors.black)};
	white-space: pre-line;
	word-break: keep-all;
`;

export default {};
