import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import {useState, useEffect} from "react";

import Box from "@mui/material/Box";
import {alpha} from "@mui/material";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";

import {usePathname} from "src/routes/hooks";
import {RouterLink} from "src/routes/components";

import {useResponsive} from "src/hooks/use-responsive";

import Iconify from "src/components/common/iconify";

import {NAV} from "./config-layout";
import {adminNavConfig} from "./config-navigation";

// ----------------------------------------------------------------------
export default function Nav({openNav, onCloseNav}) {
	const pathname = usePathname();
	const {userDetails} = useSelector((state) => state?.auth);

	const [openChild, setOpenChild] = useState(false);
	const [openMenus, setOpenMenus] = useState([]);
	const [filterNavItems, setFilterNavItems] = useState([]);

	const upLg = useResponsive("up", "lg");

	useEffect(() => {
		if (openNav) {
			onCloseNav();
		}
	}, [pathname]);

	useEffect(() => {
		function fun() {
			setFilterNavItems(adminNavConfig);
		}
		fun();
	}, [userDetails?.role?.name]);

	const renderMenu = (
		<Stack component="nav" spacing={0.3} sx={{px: 1}}>
			{filterNavItems.map((item) => (
				<NavItem key={item?.ModulesName} item={item} setOpenChild={setOpenChild} openChild={openChild} openMenus={openMenus} setOpenMenus={setOpenMenus} />
			))}
		</Stack>
	);

	const renderContent = (
		<Box sx={{mb: 2}}>
			<Box sx={{my: 1, px: 2.5, py: 1.2}}>
				<Stack
					direction="row"
					spacing={1}
					sx={{
						justifyItems: "center",
						alignItems: "center",
					}}>
					<Avatar
						sx={{
							background: (theme) => theme.palette.primary.main,
							borderRadius: 1.6,
							width: 35,
							height: 35,
							boxShadow: 2,
						}}>
						<Iconify icon="mingcute:love-fill" width={20} />
					</Avatar>
					<Typography variant="h5" sx={{fontWeight: 900}} color="text.primary">
						Daythe
					</Typography>
				</Stack>
			</Box>
			{renderMenu}
		</Box>
	);

	return (
		<Box
			sx={{
				flexShrink: {lg: 0},
				width: {lg: openNav ? NAV.SORT_WIDTH : NAV.WIDTH},
				transition: "width 300ms ease-in-out",
			}}>
			{upLg ? (
				<Box
					sx={(theme) => ({
						position: "fixed",
						height: "100vh",
						transition: "width 300ms ease-in-out",
						width: openNav ? NAV.SORT_WIDTH : NAV.WIDTH,
						background: theme?.palette?.background?.paper,
						boxShadow: 4,
						overflowY: "auto",
						overflowX: "hidden",
					})}>
					{renderContent}
				</Box>
			) : (
				<Drawer
					open={openNav}
					onClose={onCloseNav}
					PaperProps={{
						sx: {
							width: NAV.WIDTH,
							background: (theme) => theme?.palette?.background?.paper,
						},
					}}>
					{renderContent}
				</Drawer>
			)}
		</Box>
	);
}

Nav.propTypes = {
	isActive: PropTypes.bool,
	openNav: PropTypes.bool,
	onCloseNav: PropTypes.func,
};

// --------------------------------------------------------------------------------------------------------------------------------------------

function NavItem({item, openMenus, setOpenMenus}) {
	const pathname = usePathname();

	const isChildRouteActive = item.child?.some((child) => pathname.startsWith(child.path.replace(":id", "")));

	const active = item.path === pathname || isChildRouteActive;

	const showChildren = item.child?.some((child) => child.display);

	const isOpen = openMenus.includes(item.title);

	const toggleOpen = () => {
		if (!showChildren) return;

		setOpenMenus((prev) => (prev.includes(item.title) ? prev.filter((t) => t !== item.title) : [...prev, item.title]));
	};

	const handleClick = (e) => {
		if (showChildren) {
			e.preventDefault();
			toggleOpen();
		}
	};

	useEffect(() => {
		if (isChildRouteActive && !isOpen) {
			setOpenMenus((prev) => [...prev, item.title]);
		}
	}, [pathname]);

	return (
		<Box>
			<ListItemButton
				component={RouterLink}
				href={item.path}
				onClick={handleClick}
				sx={{
					borderRadius: 2.1,
					transition: "all 0.2s ease",
					color: (theme) => theme.palette.text.secondary,
					"&:hover": {
						color: (theme) => theme.palette.primary.main,
					},
					...(active && {
						color: (theme) => theme.palette.primary.main,
						bgcolor: (theme) => (theme.palette.mode === "dark" ? alpha(theme.palette.primary.lighter, 0.2) : alpha(theme.palette.primary.lighter, 0.6)),
						"&:hover": {
							color: (theme) => theme.palette.primary.main,
							bgcolor: (theme) => (theme.palette.mode === "dark" ? alpha(theme.palette.primary.lighter, 0.3) : alpha(theme.palette.primary.lighter, 0.7)),
						},
					}),
				}}>
				<Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" width="100%">
					<Stack direction="row" spacing={1} alignItems="center">
						<Box
							sx={{
								width: 18,
								height: 18,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}>
							<Iconify icon={item?.icon} />
						</Box>
						<Typography variant="body2" sx={{fontWeight: 400, ...(active && {fontWeight: 700})}}>
							{item?.title}
						</Typography>
					</Stack>

					{showChildren && (isOpen ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />)}
				</Stack>
			</ListItemButton>

			{showChildren && (
				<Collapse
					in={isOpen}
					timeout={300}
					easing={{
						enter: "cubic-bezier(0.4, 0, 0.2, 1)",
						exit: "cubic-bezier(0.4, 0, 0.2, 1)",
					}}>
					<Stack
						spacing={1}
						sx={{
							mx: 2,
							color: "text.primary",
							py: 0.5,
							px: 1,
							position: "relative",
							"&::before": {
								content: '""',
								position: "absolute",
								left: 3,
								top: 1,
								bottom: 20,
								width: "2px",
								bgcolor: "grey.400",
							},
						}}>
						{item.child
							.filter((child) => child.display)
							.map((child) => {
								const activeChild = child.path === pathname;

								return (
									<Box
										key={child.path}
										sx={{
											position: "relative",
											pl: 2.3,
											"&::before": {
												content: '""',
												position: "absolute",
												left: -5,
												top: 2,
												width: 14,
												height: 12,
												borderLeft: "2px solid",
												borderBottom: "2px solid",
												borderColor: "grey.400",
												borderBottomLeftRadius: "8px",
											},
										}}>
										<Typography
											component={RouterLink}
											href={child.path}
											sx={{
												typography: "body2",
												color: "text.secondary",
												textDecoration: "none",
												textTransform: "capitalize",
												transition: "all 0.2s ease",
												...(activeChild && {fontWeight: 600, color: "primary.main"}),
											}}>
											{child?.title}
										</Typography>
									</Box>
								);
							})}
					</Stack>
				</Collapse>
			)}
		</Box>
	);
}

NavItem.propTypes = {
	item: PropTypes.object,
};
