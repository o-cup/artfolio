import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import GlobalStyle from "./styles/globalStyle";
import theme from "./styles/theme";
import LanguageProvider from "./context/LanguageProvider";
import { ModalProvider } from "./context/ModalProvider";
import AnimatedRoutes from "./components/animatedRoutes";

function App() {
	const [lang, setLang] = useState<Language>("en");

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
