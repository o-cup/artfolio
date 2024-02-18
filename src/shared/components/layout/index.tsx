import React from "react";
import Header from "./header";
import Footer from "./footer";
import { StyledLayout, StyledContent } from "./layoutStyle";

type LayoutProps = {
	children: React.ReactElement;
	mainPaddingBottom?: {
		desktop?: string;
		mobile?: string;
	};
};

const Layout: React.FC<LayoutProps> = ({ children, mainPaddingBottom }) => (
	<StyledLayout>
		<Header />
		<StyledContent mainPaddingBottom={mainPaddingBottom}>{children}</StyledContent>
		<Footer />
	</StyledLayout>
);

Layout.defaultProps = {
	mainPaddingBottom: {
		desktop: "",
		mobile: "",
	},
};
export default Layout;
