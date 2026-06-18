import {createTheme} from "@mui/material/styles";
import {palette} from "./palette";
import {typography} from "./typography";
import {overrides} from "./overrides";

export const getTheme = (themeColor = "primary", mode = "light") =>
	createTheme({
		...palette,
		palette: {
			...palette.palette,
			mode,
			primary: {
				...palette.palette[themeColor],
			},
			grey: {
				...palette.palette.grey,
				100: mode === "dark" ? "#212B36" : "#F9FAFB",
				200: mode === "dark" ? "#2C3848" : "#F4F6F8",
				300: mode === "dark" ? "#454F5B" : "#DFE3E8",
				400: mode === "dark" ? "#637381" : "#C4CDD5",
			},
			text: {
				...palette.palette.text,
				primary: mode === "dark" ? "#F9FAFB" : "#212B36",
				secondary: mode === "dark" ? "#C4CDD5" : "#637381",
				disabled: mode === "dark" ? "#637381" : "#919EAB",
			},
			shadows: {
				primary: mode === "dark" ? "#000000" : "#919EAB",
			},
			background: {
				...palette.background,
				default: mode === "dark" ? "#000000" : "#F4F6F8",
				paper: mode === "dark" ? "#141a21" : "#FFFFFF",
				neutral: mode === "dark" ? "#283039" : "#FFFFFF",
			},
		},

		typography,
		components: overrides,
		shape: {borderRadius: 6},
	});

const theme = getTheme();

export default theme;
