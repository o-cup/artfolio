import React from "react";
import styled from "styled-components";

const Poster = () => (
	<Styled.Poster>
		<Styled.Image />
	</Styled.Poster>
);

export default Poster;

const Styled = {
	Poster: styled.section`
		border: 1px solid blue;
		margin-bottom: 32px;
	`,
	Image: styled.div`
		width: 300px;
		height: 400px;
		border: 1px solid pink;
		margin: 0 auto;
	`,
};
