// import React from "react";

import styled from "styled-components";
import { DESKTOP_DEVICE, MOBILE_DEVICE } from "../../styles/theme";

type Props = {
	url: string;
};

const ExhibitionListItem = ({ url }: Props) => (
	<Styled.Wrap>
		<Styled.Poster src={url} />
	</Styled.Wrap>
);

export default ExhibitionListItem;

const itemWidth = "calc((100vw - (30px * 2) - (24px * 4)) / 5)";

const Styled = {
	Wrap: styled.li`
		@media screen and (${DESKTOP_DEVICE}) {
			width: ${itemWidth};
			cursor: pointer;
		}

		@media screen and (${MOBILE_DEVICE}) {
			width: 45vw;
		}
	`,
	Poster: styled.img`
		width: 100%;
		/* object-fit: cover; */
	`,
};
