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
						<TextButton active={false}>works</TextButton>
						<TextButton active={false}>about</TextButton>
						<TextButton active={false}>exhibitions</TextButton>
					</DesktopNavWrap>
				)}
				<LanguageWrap>
					<TextButton active={false} size="14px">
						KO
					</TextButton>
					<TextButton active={false} size="14px">
						EN
					</TextButton>
				</LanguageWrap>
			</HeaderContentWrap>
			{isMobile && (
				<MobileNavWrap>
					<TextButton active={false}>works</TextButton>
					<TextButton active={false}>about</TextButton>
					<TextButton active={false}>exhibitions</TextButton>
				</MobileNavWrap>
			)}
		</StyledHeader>
	);
};

export default Header;
