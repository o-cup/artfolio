import React from "react";
import styled from "styled-components";

const DetailView = () => (
	<Styled.DetailView>
		<h1>Detail View</h1>
	</Styled.DetailView>
);

export default DetailView;

const Styled = {
	DetailView: styled.div`
		width: 100vw;
		height: 100vh;
	`,
};
