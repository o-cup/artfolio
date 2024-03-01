import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const BackButton = () => {
	const navigate = useNavigate();

	return (
		<Styled.Wrap onClick={() => navigate("/")}>
			<Styled.Icon src="/icons/back-gray.svg" alt="back button" />
			<Styled.Text>works</Styled.Text>
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
	Text: styled.span`
		font-size: 15px;
		color: ${({ theme }) => theme.colors.gray};

		&:hover {
			color: ${({ theme }) => theme.colors.black};
		}
	`,
};
