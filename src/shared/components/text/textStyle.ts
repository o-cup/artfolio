import styled, { CSSObject } from "styled-components";
import defaultTheme from "../../../styles/theme";

type TextProps = {
	typography: keyof typeof defaultTheme.text;
	customStyle?: CSSObject;
};

export const StyledText = styled.span.attrs(({ customStyle }: TextProps) => ({
	style: {
		...customStyle,
	},
}))<TextProps>`
	display: inline-block;
	${({ theme, typography }) => theme.text[typography]};
`;

export default {};
