import React from "react";
import { ContactWrap, CopyrightWrap, StyledFooter } from "./footerStyle";

const Footer = () => (
	<StyledFooter>
		<ContactWrap>
			<a href="https://www.facebook.com/parkmejung.art" target="_blank" rel="noopener noreferrer">
				facebook
			</a>
			<a href="mailto:parkmejung.art@gmail.com">email</a>
		</ContactWrap>
		<CopyrightWrap>
			<p>Copyrightⓒ Parkmejung All rights reserved.</p>
		</CopyrightWrap>
	</StyledFooter>
);

export default Footer;
