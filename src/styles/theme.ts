export const MOBILE_DEVICE = "(max-width: 480px)";
export const DESKTOP_DEVICE = "(min-width: 481px)";

const defaultTheme = {
	fontFamily: {
		ko: "",
		en: "",
	},
	text: {
		title1: {
			fontSize: "18px",
			lineHeight: "18px",
			fontWeight: "bold",
		},
		body1: {
			fontSize: "16px",
			lineHeight: "18px",
		},
		body2: {
			fontSize: "14px",
			lineHeight: "16px",
		},
		body2_wide: {
			fontSize: "14px",
			lineHeight: "18px",
		},
		body2_extraWide: {
			fontSize: "14px",
			lineHeight: "20px",
		},
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

export type ThemeType = typeof defaultTheme;

export default defaultTheme;
