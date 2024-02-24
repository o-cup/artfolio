import React, { createContext, useMemo } from "react";

interface LangContextType {
	lang: Language;
	setLang: (value: Language) => void;
}

export const LangContext = createContext<LangContextType>({
	lang: "en",
	setLang: () => null,
});

interface Props extends LangContextType {
	children: React.ReactElement;
}

const LanguageProvider = ({ lang, setLang, children }: Props) => {
	const value = useMemo(
		() => ({
			lang,
			setLang,
		}),
		[lang, setLang]
	);
	return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};

export default LanguageProvider;
