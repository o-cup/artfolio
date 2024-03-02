import React from "react";
import { CSSObject } from "styled-components";
import { StyledTextButton } from "./textButtonStyle";
import defaultTheme from "../../../styles/theme";

type TextButtonProps = {
	children: string;
	typography: keyof typeof defaultTheme.text;
	active?: boolean;
	customStyle?: CSSObject;
	handleClick?: (e: React.FormEvent<HTMLButtonElement>) => void;
};

const TextButton = ({ children, typography, active, customStyle, handleClick }: TextButtonProps) => (
	<StyledTextButton typography={typography} active={active} customStyle={customStyle} onClick={handleClick}>
		<span>{children}</span>
	</StyledTextButton>
);

TextButton.defaultProps = {
	active: false,
	customStyle: {},
	handleClick: () => null,
};

export default TextButton;
