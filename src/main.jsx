import {Provider} from "react-redux";
import {StrictMode, Suspense} from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import {HelmetProvider} from "react-helmet-async";
import {store} from "src/redux/store/index.jsx";

import "./index.css";
import App from "./App.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<HelmetProvider>
		<Provider store={store}>
			<BrowserRouter basename="/">
				<Suspense>
					<App />
				</Suspense>
			</BrowserRouter>
		</Provider>
	</HelmetProvider>,
);
