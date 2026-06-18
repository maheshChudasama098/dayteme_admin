import {useEffect, useMemo} from "react";

import {ThemeProvider} from "@mui/material";
import AppRoutes from "./routes/sections.jsx";

import {getTheme} from "./theme";

// import "./App.css";
import "../src/assets/styles/antd.styles.css";
import "../src/assets/styles/big.calendar.styles.css";

import "@fortawesome/fontawesome-free/css/all.min.css";

import {useSelector} from "react-redux";

function App() {
	const role = useSelector((state) => state.auth?.userDetails?.role?.name);
	const {themeColor, themeMode} = useSelector((state) => state.common);

	const theme = useMemo(() => getTheme(themeColor, themeMode), [themeColor, themeMode]);

	useEffect(() => {
		if (typeof document !== "undefined") {
			const root = document.documentElement;
			/* Table header background color and text color  */
			root.style.setProperty("--palette-table-header-background", theme?.palette?.background?.default);
			root.style.setProperty("--palette-table-header-background-hover", theme?.palette?.background?.default);
			root.style.setProperty("--palette-table-header-color", theme?.palette.text?.secondary);
			root.style.setProperty("--palette-table-header-border-color", theme?.palette.grey[300]);

			/* Table body background color and text color  */
			root.style.setProperty("--palette-table-body-background", theme?.palette?.background?.neutral);
			root.style.setProperty("--palette-table-body-background-hover", theme?.palette?.background?.neutral);
			root.style.setProperty("--palette-table-body-color", theme?.palette.text?.primary);
			root.style.setProperty("--palette-table-body-border-color", theme?.palette.grey[200]);

			/* Table body background color  */
			root.style.setProperty("--palette-table-header-sorting-icon", theme?.palette.grey[600]);

			root.style.setProperty("--palette-primary-dark", theme?.palette.primary.dark);
			root.style.setProperty("--palette-primary-darker", theme?.palette.primary.darker);
			root.style.setProperty("--palette-primary-main", theme?.palette.primary.main);
			root.style.setProperty("--palette-primary-light", theme?.palette.primary.light);
			root.style.setProperty("--palette-primary-lighter", theme?.palette.primary.lighter);

			root.style.setProperty("--palette-background-paper", theme?.palette?.background.paper);
			root.style.setProperty("--palette-grey-400", theme?.palette.grey[400]);

			root.style.setProperty("--swal-background", themeMode === "dark" ? theme?.palette?.background.paper : theme?.palette?.common?.white);
			root.style.setProperty("--swal-text", theme.palette.text.primary);
			root.style.setProperty("--swal-text-secondary", theme.palette.text.secondary);

			root.style.setProperty("--swal-success", theme.palette.success.main);

			root.style.setProperty("--swal-radius", `${theme.shape.borderRadius * 4}px`);
			root.style.setProperty("--swal-shadow", theme.shadows[10]);
		}
	}, [themeMode, theme]);

	return (
		<ThemeProvider theme={theme}>
			<AppRoutes role={role} />
		</ThemeProvider>
	);
}

export default App;
