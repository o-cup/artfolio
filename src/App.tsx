import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import GlobalStyle from "./styles/globalStyle";
import theme from "./styles/theme";
import LanguageProvider from "./context/LanguageProvider";
import { isPreview } from "./shared/siteData";
import { ModalProvider } from "./context/ModalProvider";
import AnimatedRoutes from "./components/animatedRoutes";

function App() {
	// 관리 화면 미리보기는 엄마가 쓴 한국어가 바로 보이도록 한국어로 열어요.
	const [lang, setLang] = useState<Language>(isPreview ? "ko" : "en");

	return (
		<LanguageProvider lang={lang} setLang={setLang}>
			<ModalProvider>
				<ThemeProvider theme={theme}>
					<GlobalStyle />
					<BrowserRouter>
						<AnimatedRoutes />
					</BrowserRouter>
				</ThemeProvider>
			</ModalProvider>
		</LanguageProvider>
	);
}

export default App;
