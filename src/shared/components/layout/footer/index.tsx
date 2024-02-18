import React from "react";
import { ContactWrap, CopyrightWrap, StyledFooter } from "./footerStyle";

const Footer = () => (
	<StyledFooter>
		<ContactWrap>
			<a href="/">facebook</a>
			<a href="/">email</a>
		</ContactWrap>
		<CopyrightWrap>
			<p>Copyrightⓒ Parkmejung All rights reserved.</p>
		</CopyrightWrap>
	</StyledFooter>
);

export default Footer;
