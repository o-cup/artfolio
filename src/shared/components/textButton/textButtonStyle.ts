import styled, { CSSObject } from "styled-components";

type ButtonProps = {
	size?: string;
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
	color: ${({ theme }) => theme.colors.gray};
	font-size: ${({ size }) => size || "16px"};
	font-weight: ${({ active }) => (active ? "bold" : "regular")};

	&:hover {
		color: ${({ theme }) => theme.colors.black};
	}
`;

export default {};
