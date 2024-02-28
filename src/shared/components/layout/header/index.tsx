import { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useLocation, useNavigate } from "react-router-dom";
import TextButton from "../../textButton";
import { DesktopNavWrap, HeaderContentWrap, LanguageWrap, MobileNavWrap, StyledHeader } from "./headerStyle";
import { MOBILE_DEVICE } from "../../../../styles/theme";
import { LangContext } from "../../../../context/LanguageProvider";

const Header = () => {
	const isMobile = useMediaQuery({ query: MOBILE_DEVICE });
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { lang, setLang } = useContext(LangContext);

	const [activeNav, setActiveNav] = useState<"" | "about" | "exhibitions">("");

	useEffect(() => {
		if (pathname === "/about") {
			setActiveNav("about");
		} else if (pathname.startsWith("/exhibitions")) {
			setActiveNav("exhibitions");
		} else {
			setActiveNav(""); // works도 words/:id 생기면 exhibitions 처럼 처리해야됑
		}
	}, [pathname]);

	return (
		<StyledHeader>
			<HeaderContentWrap>
				<h1 className="title">Parkmejung</h1>
				{!isMobile && (
					<DesktopNavWrap>
						<TextButton
							typography="body1"
							active={activeNav === ""}
							handleClick={() => {
								navigate("/");
							}}
						>
							works
						</TextButton>
						<TextButton
							typography="body1"
							active={activeNav === "about"}
							handleClick={() => {
								navigate("/about");
							}}
						>
							about
						</TextButton>
						<TextButton
							typography="body1"
							active={activeNav === "exhibitions"}
							handleClick={() => {
								navigate("/exhibitions");
							}}
						>
							exhibitions
						</TextButton>
					</DesktopNavWrap>
				)}
				<LanguageWrap>
					<TextButton typography="body2" active={lang === "ko"} handleClick={() => setLang("ko")}>
						KO
					</TextButton>
					<TextButton typography="body2" active={lang === "en"} handleClick={() => setLang("en")}>
						EN
					</TextButton>
				</LanguageWrap>
			</HeaderContentWrap>
			{isMobile && (
				<MobileNavWrap>
					<TextButton typography="body1" active={activeNav === ""} handleClick={() => navigate("/")}>
						works
					</TextButton>
					<TextButton typography="body1" active={activeNav === "about"} handleClick={() => navigate("/about")}>
						about
					</TextButton>
					<TextButton
						typography="body1"
						active={activeNav === "exhibitions"}
						handleClick={() => navigate("/exhibitions")}
					>
						exhibitions
					</TextButton>
				</MobileNavWrap>
			)}
		</StyledHeader>
	);
};

export default Header;
