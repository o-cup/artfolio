import { DefaultTheme } from "styled-components";

export const MOBILE_DEVICE = "(max-width: 480px)";
export const DESKTOP_DEVICE = "(min-width: 481px)";

const theme: DefaultTheme = {
	fontFamily: {
		ko: "",
		en: "",
	},
	colors: {
		background: "#F0F0EF",
		black: "#37313D",
		gray: "#7B7780",
	},
	device: {
		mobile: "screen and (max-width: 480px)",
		desktop: "screen and (min-width: 481px)",
	},
	heights: {
		header: {
			mobile: "92px",
			desktop: "66px",
		},
	},
	zIndex: {
		header: 10,
	},
};

export type ThemeType = { theme: typeof theme };

export default theme;
