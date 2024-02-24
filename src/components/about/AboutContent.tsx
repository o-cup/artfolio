import React, { useContext } from "react";
import { AboutArtistWrap, AboutContentWrap, AboutHistoriesWrap } from "./styles/aboutStyle";
import { LangContext } from "../../context/LanguageProvider";
import aboutData from "./aboutData.json";
import Text from "../../shared/components/text";

function AboutContent() {
	const { lang } = useContext(LangContext);

	return (
		<AboutContentWrap>
			<AboutArtistWrap>
				<Text typography="title1">{aboutData[lang].artist.name}</Text>
				<Text typography="body2_extraWide">{aboutData[lang].artist.about}</Text>
			</AboutArtistWrap>
			<AboutHistoriesWrap>
				{aboutData[lang].histories.map((history) => (
					<div className="history" key={history.title}>
						<Text typography="body2_extraWide" customStyle={{ fontWeight: "bold" }}>
							{history.title}
						</Text>
						<ul>
							{history.details.map((detail) => (
								<li key={detail}>
									<Text typography="body2_extraWide">{detail}</Text>
								</li>
							))}
						</ul>
					</div>
				))}
			</AboutHistoriesWrap>
		</AboutContentWrap>
	);
}

export default AboutContent;
