import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GlobalStyle from "./styles/globalStyle";
import theme from "./styles/theme";
import LanguageProvider from "./context/LanguageProvider";
import Main from "./pages/Main";
import About from "./pages/About";

function App() {
	const [lang, setLang] = useState<Language>("en");

	return (
		<LanguageProvider lang={lang} setLang={setLang}>
			<ThemeProvider theme={theme}>
				<GlobalStyle />
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Main />} />
						<Route path="/about" element={<About />} />
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</LanguageProvider>
	);
}

export default App;
