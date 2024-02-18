import React from "react";
import { CSSObject } from "styled-components";
import { StyledText } from "./textStyle";
import defaultTheme from "../../../styles/theme";

type TextProps = {
	children: string;
	typography: keyof typeof defaultTheme.text;
	color?: keyof typeof defaultTheme.colors;
	customStyle?: CSSObject;
};

const TextButton = ({ children, typography, color, customStyle }: TextProps) => (
	<StyledText typography={typography} color={color} customStyle={customStyle}>
		{children}
	</StyledText>
);

TextButton.defaultProps = {
	color: "black",
	customStyle: {},
};

export default TextButton;
