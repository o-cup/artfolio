import styled from "styled-components";
import { DESKTOP_DEVICE, MOBILE_DEVICE } from "../../../styles/theme";

export const CarouselWrap = styled.div`
	display: flex;
	overflow-x: auto;
	-ms-overflow-style: none;
	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
	scroll-snap-type: x mandatory;

	> img {
		scroll-snap-align: start;
		cursor: pointer;
	}

	@media screen and (${DESKTOP_DEVICE}) {
		margin-top: 100px;
		height: 500px;
		gap: 48px;
		scroll-padding-left: 48px;

		> img:first-child {
			margin-left: 56px;
		}

		> img:last-child {
			margin-right: 56px;
		}
	}

	@media screen and (${MOBILE_DEVICE}) {
		height: 480px;
		gap: 8px;
		scroll-padding-left: 8px;

		> img:first-child {
			margin-left: 12px;
		}

		> img:last-child {
			margin-right: 12px;
		}
	}
`;

export const DescriptionWrap = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;

	gap: 16px;
	@media screen and (${DESKTOP_DEVICE}) {
		padding: 150px 56px 0;
		max-width: 746px;
	}

	@media screen and (${MOBILE_DEVICE}) {
		padding: 80px 12px 0;
	}
`;

export default {};
