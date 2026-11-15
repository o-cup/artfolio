import styled from "styled-components";
import { DESKTOP_DEVICE, MOBILE_DEVICE } from "../../../styles/theme";

export const MainListWrap = styled.ul`
	display: flex;
	flex-wrap: wrap;

	@media screen and ${DESKTOP_DEVICE} {
		column-gap: 24px;
		row-gap: 62px;
		padding: 32px 30px;
	}

	@media screen and ${MOBILE_DEVICE} {
		justify-content: space-between;
		row-gap: 32px;
		padding: 0 12px;
	}
`;

const itemWidth = "calc((100vw - (30px * 2) - (24px * 4)) / 5)";

export const MainWorkImageWrap = styled.div`
	position: relative;
	overflow: hidden;

	/* 다른 작업에 마우스를 올렸을 때 이 사진을 흐리게 덮는 막 (평소엔 안 보여요) */
	&::after {
		content: "";
		position: absolute;
		inset: 0;
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
		background: rgba(217, 217, 217, 0.01);
		opacity: 0;
		transition: opacity 0.25s ease;
		pointer-events: none;
	}

	@media screen and ${DESKTOP_DEVICE} {
		width: ${itemWidth};
		height: calc(${itemWidth} * (4 / 3));
	}

	@media screen and ${MOBILE_DEVICE} {
		row-gap: 32px;
		width: 45vw;
		height: calc(45vw * (4 / 3));
	}

	> img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

export const MainWorkTitleWrap = styled.div`
	margin-top: 8px;
`;

export const MainListItemWrap = styled.li`
	@media screen and ${DESKTOP_DEVICE} {
		width: ${itemWidth};
		cursor: pointer;
	}

	@media screen and ${MOBILE_DEVICE} {
		width: 45vw;
	}

	&:hover {
		${MainWorkTitleWrap} > span {
			font-weight: bold;
		}
	}

	/* 한 작업에 마우스를 올리면, 나머지 작업 사진은 흐리게 (마우스가 있는 PC에서만) */
	@media (hover: hover) {
		${MainListWrap}:has(> li:hover) &:not(:hover) ${MainWorkImageWrap}::after {
			opacity: 1;
		}
	}
`;

export default {};
