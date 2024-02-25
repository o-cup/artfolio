import styled from "styled-components";

const BackButton = () => (
	<Styled.Wrap onClick={() => window.history.back()}>
		<Styled.Icon src="/icons/back.svg" alt="back button" />
		<Styled.Text>exhibitions</Styled.Text>
	</Styled.Wrap>
);

export default BackButton;

const Styled = {
	Wrap: styled.div`
		padding: 0 20px;
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
		color: #99959d;
	`,
};
