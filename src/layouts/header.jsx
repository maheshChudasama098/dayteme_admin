import PropTypes from "prop-types";
import {useSelector} from "react-redux";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import {useTheme} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import {useResponsive} from "src/hooks/use-responsive";

import Iconify from "src/components/common/iconify";

import {NAV, HEADER} from "./config-layout";
import AccountPopover from "./common/account-popover";

// ----------------------------------------------------------------------
export default function Header({onOpenNav, openNav}) {
	const theme = useTheme();

	const lgUp = useResponsive("up", "lg");

	const {pageHerder} = useSelector((state) => state?.common);

	const renderContent = (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				width: "100%",
				transition: "width 300ms ease-in-out",
				height: "100vh", // or parent height
				px: 2,
			}}>
			<Stack direction="row" alignItems="center" spacing={1}>
				<IconButton onClick={onOpenNav} sx={{mr: 1}}>
					<Iconify icon="eva:menu-2-fill" />
				</IconButton>
				<Typography variant="h6" color="primary.main" sx={{textTransform: "capitalize"}}>
					{pageHerder || ""}
				</Typography>
			</Stack>
			<Stack direction="row" alignItems="center" spacing={1.5}>
				<AccountPopover />
			</Stack>
		</Box>
	);

	return (
		<AppBar
			sx={{
				height: HEADER.H_MOBILE,
				zIndex: theme.zIndex.appBar - 50,
				boxShadow: 2,
				transition: "width 300ms ease-in-out",
				background: theme?.palette?.background?.paper,
				...(lgUp && {
					width: `calc(100% - ${openNav ? NAV.SORT_WIDTH : NAV.WIDTH + 1}px)`,
					height: HEADER.H_DESKTOP,
				}),
			}}>
			{renderContent}
		</AppBar>
	);
}

Header.propTypes = {
	onOpenNav: PropTypes.func,
	isActive: PropTypes.bool,
};
