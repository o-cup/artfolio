import styled from "styled-components";
import { useState } from "react"; // Import useState

type Props = {
	text: "works" | "exhibitions";
};

const BackButton = ({ text }: Props) => {
	const [isHovering, setIsHovering] = useState(false);
	return (
		<Styled.Wrap
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			onClick={() => window.history.back()}
		>
			<Styled.Icon src={isHovering ? "/icons/back-black.svg" : "/icons/back-gray.svg"} alt="back button" />
			<Styled.Text isHovering={isHovering}>{text}</Styled.Text>
		</Styled.Wrap>
	);
};

export default BackButton;

const Styled = {
	Wrap: styled.div`
		display: flex;
		align-items: center;
		height: 20px;
		cursor: pointer;
		margin-bottom: 24px;
	`,
	Icon: styled.img`
		margin-right: 4px;
	`,
	Text: styled.span<{ isHovering: boolean }>`
		font-size: 15px;
		color: ${({ theme, isHovering }) => (isHovering ? theme.colors.black : theme.colors.gray)};
	`,
};
