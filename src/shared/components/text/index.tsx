import React from "react";
import { CSSObject } from "styled-components";
import { StyledText } from "./textStyle";
import defaultTheme from "../../../styles/theme";

type TextProps = {
	children: string;
	typography: keyof typeof defaultTheme.text;
	customStyle?: CSSObject;
};

const TextButton = ({ children, typography, customStyle }: TextProps) => (
	<StyledText typography={typography} customStyle={customStyle}>
		{children}
	</StyledText>
);

TextButton.defaultProps = {
	customStyle: {},
};

export default TextButton;
