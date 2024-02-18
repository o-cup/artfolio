import React from "react";
import { useMediaQuery } from "react-responsive";
import TextButton from "../../textButton";
import { DesktopNavWrap, HeaderContentWrap, LanguageWrap, MobileNavWrap, StyledHeader } from "./headerStyle";
import { MOBILE_DEVICE } from "../../../../styles/theme";

const Header = () => {
	const isMobile = useMediaQuery({ query: MOBILE_DEVICE });

	return (
		<StyledHeader>
			<HeaderContentWrap>
				<h1 className="title">Parkmejung</h1>
				{!isMobile && (
					<DesktopNavWrap>
						<TextButton typography="body1" active={false}>
							works
						</TextButton>
						<TextButton typography="body1" active={false}>
							about
						</TextButton>
						<TextButton typography="body1" active={false}>
							exhibitions
						</TextButton>
					</DesktopNavWrap>
				)}
				<LanguageWrap>
					<TextButton typography="body2" active={false}>
						KO
					</TextButton>
					<TextButton typography="body2" active={false}>
						EN
					</TextButton>
				</LanguageWrap>
			</HeaderContentWrap>
			{isMobile && (
				<MobileNavWrap>
					<TextButton typography="body1" active={false}>
						works
					</TextButton>
					<TextButton typography="body1" active={false}>
						about
					</TextButton>
					<TextButton typography="body1" active={false}>
						exhibitions
					</TextButton>
				</MobileNavWrap>
			)}
		</StyledHeader>
	);
};

export default Header;
