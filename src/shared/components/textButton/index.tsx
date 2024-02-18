import React from "react";
import { CSSObject } from "styled-components";
import { StyledTextButton } from "./textButtonStyle";

type TextButtonProps = {
	children: string;
	size?: string;
	active?: boolean;
	customStyle?: CSSObject;
	handleClick?: (e: React.FormEvent<HTMLButtonElement>) => void;
};

const TextButton = ({ children, size, active, customStyle, handleClick }: TextButtonProps) => (
	<StyledTextButton size={size} active={active} customStyle={customStyle} onClick={handleClick}>
		{children}
	</StyledTextButton>
);

TextButton.defaultProps = {
	size: "16px",
	active: false,
	customStyle: {},
	handleClick: () => null,
};

export default TextButton;
