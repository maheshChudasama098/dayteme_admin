import PropTypes from "prop-types";

import Box from "@mui/material/Box";

import {useResponsive} from "../hooks/use-responsive";
import {NAV, HEADER} from "./config-layout";

// ----------------------------------------------------------------------

const SPACING = 30;

export default function Main({children, sx, ...other}) {
	const lgUp = useResponsive("up", "lg");

	return (
		<Box
			component="main"
			sx={{
				minHeight: "100vh",
				flexGrow: 1,
				display: "flex",
				flexDirection: "column",
				py: `${HEADER.H_MOBILE + SPACING}px`,
				px: 5,
				...(lgUp && {
					py: `${HEADER.H_DESKTOP + SPACING}px`,
					width: `calc(100% - ${NAV.WIDTH}px)`,
				}),
				background: (theme) => theme?.palette?.background?.default,
				...sx,
			}}
			{...other}>
			{children}
		</Box>
	);
}

Main.propTypes = {
	children: PropTypes.node,
	sx: PropTypes.object,
};
