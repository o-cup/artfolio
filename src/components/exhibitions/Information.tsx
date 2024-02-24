import React from "react";
import styled from "styled-components";
import Text from "../../shared/components/text";

const Information = () => (
	<Styled.Information>
		<Text typography="body2" color="gray">
			solo exhibition
		</Text>
		<Text typography="title1" color="black">
			Still Life with Bladwin
		</Text>
		<Text typography="body2" color="black">
			3/9/2019 - 22/9/2019
		</Text>
		<Text typography="body2" color="black">
			Space 291, Seoul, South Korea
		</Text>
	</Styled.Information>
);

export default Information;

const Styled = {
	Information: styled.section`
		border: 1px solid orange;
		display: flex;
		flex-direction: column;

		> span:first-child {
			margin-bottom: 6px;
			font-weight: bold;
		}

		> span:nth-child(2) {
			margin-bottom: 24px;
		}

		> span:last-child {
			margin-bottom: 32px;
		}
	`,
};
