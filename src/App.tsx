import React from "react";
import GlobalStyle from "./styles/globalStyle";
import Portal from "./components/Portal";
import DetailView from "./components/DetailView";

function App() {
	return (
		<>
			<GlobalStyle />
			<div className="App">
				<p>메인</p>
				<Portal isOpen={false} onClose={() => console.log("close")}>
					<DetailView />
				</Portal>
			</div>
		</>
	);
}

export default App;
