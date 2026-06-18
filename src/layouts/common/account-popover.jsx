import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState, useCallback} from "react";

import Box from "@mui/material/Box";
import {alpha} from "@mui/material";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";

import {defaultFile} from "src/utils/utils";
import {logout} from "src/utils/auth-utils";

import {ColorCards} from "src/constance";

//----------------------------------------------

export default function AccountPopover() {
	const [open, setOpen] = useState(null);
	const [notifOpen, setNotifOpen] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);

	const dispatch = useDispatch();

	const handleOpen = (event) => {
		setOpen(event.currentTarget);
	};
	const handleClose = () => {
		setOpen(null);
	};
	// const handleOpenNotif = () => {
	// 	setOpen(null);
	// 	setNotifOpen(true);
	// };
	const handleCloseNotif = () => {
		setNotifOpen(false);
	};

	const {userDetails} = useSelector((state) => state?.auth);
	const {themeColor, themeMode} = useSelector((state) => state.common);

	const persistedAvatarSrc = defaultFile(userDetails?.avatar);

	// Increment badge in real time when a new notification arrives
	const handleNewNotification = useCallback(() => {
		setUnreadCount((prev) => prev + 1);
	}, []);

	// Fetch on mount and every time the notification drawer closes
	useEffect(() => {
		if (notifOpen) return;
	}, [dispatch, notifOpen]);

	// const handleColorChange = (color) => {
	// 	dispatch({type: "THEME_COLOR_CHANGE", payload: color});
	// };
	// const handleModelChange = (model) => {
	// 	dispatch({type: "THEME_MODE_CHANGE", payload: model});
	// };

	const handleThemeSubmit = (values) => {
		dispatch({type: "THEME_MODE_CHANGE", payload: values?.themeMode});
	};

	return (
		<Box>
			<Stack direction="row" spacing={1.5} sx={{alignItems: "center", cursor: "pointer"}} onClick={handleOpen}>
				<Box
					sx={{
						p: "1px",
						borderRadius: 50,
						background: (theme) => `linear-gradient(135deg,${alpha(theme.palette?.success?.main, 0.9)} 0%, ${alpha(theme.palette?.info?.main, 0.9)} 100%)`,
					}}>
					<Avatar
						src={persistedAvatarSrc}
						alt={userDetails?.name}
						sx={{
							width: 38,
							height: 38,
							border: (theme) => `solid 2px ${theme.palette.background.paper}`,
							background: (theme) => theme.palette.primary.main,
						}}>
						<Typography variant="caption" fontWeight={600}>
							{userDetails?.name
								?.split(" ")
								?.map((n) => n[0])
								?.slice(0, 2)
								?.join("")
								?.toUpperCase()}
						</Typography>
					</Avatar>
				</Box>
			</Stack>

			{/* Profile Drawer */}
			<Drawer
				open={open}
				onClose={handleClose}
				anchor="right"
				PaperProps={{
					sx: {
						width: {xs: "80%", sm: "50%", md: 400},
					},
				}}>
				<Box
					sx={{
						minHeight: "100%",
						// display: "flex",
						// flexDirection: "column",
						background: (theme) => `linear-gradient(240deg, ${alpha(theme.palette.primary.light, 0.0)} , ${alpha(theme.palette.background.default, 0.1)} , ${alpha(theme.palette.error.light, 0.1)})`,
					}}>
					{/* Header */}
					<Box
						sx={{
							px: 3,
							pt: 3,
							pb: 4,
							textAlign: "center",
						}}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								mb: 2,
							}}>
							<Box
								sx={{
									p: "3px",
									borderRadius: "50%",
									background: (theme) => `linear-gradient(135deg,${theme.palette.success.main} 0%,${theme.palette.info.main} 100%)`,
								}}>
								<Avatar
									src={persistedAvatarSrc}
									alt={userDetails?.name}
									sx={{
										width: 96,
										height: 96,
										border: (theme) => `solid 4px ${theme.palette.background.paper}`,
										bgcolor: "primary.main",
										fontSize: 30,
										fontWeight: 700,
									}}>
									{userDetails?.name
										?.split(" ")
										?.map((n) => n[0])
										?.slice(0, 2)
										?.join("")
										?.toUpperCase()}
								</Avatar>
							</Box>
						</Box>

						<Typography variant="h5" fontWeight={700}>
							{userDetails?.name}
						</Typography>

						<Typography variant="body2" color="text.secondary" sx={{mt: 0.5}}>
							{userDetails?.email}
						</Typography>
					</Box>

					<Divider sx={{borderStyle: "dashed"}} />

					<Box sx={{p: 2}}>
						{[
							{label: "Home", icon: <i className="fa-solid fa-house" />},
							{label: "Profile", icon: <i className="fa-solid fa-user" />},
							{label: "Change Password", icon: <i className="fa-solid fa-key" />},
						].map((item) => (
							<MenuItem
								key={item.label}
								{...(item.path ? {component: Link, to: item.path} : {})}
								onClick={item.onClick ?? handleClose}
								sx={{
									py: 1,
									borderRadius: 2,
								}}>
								<ListItemIcon
									sx={{
										color: "text.secondary",
										fontSize: 16,
									}}>
									{item.icon}
								</ListItemIcon>

								<Typography variant="body1" sx={{flex: 1}}>
									{item.label}
								</Typography>

								{item.badge > 0 && (
									<Box
										sx={(theme) => ({
											minWidth: 22,
											height: 22,
											borderRadius: 1.5,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											backgroundColor: alpha(theme.palette.error.main, 0.12),
											color: "error.main",
											fontWeight: 700,
											fontSize: 11,
										})}>
										{item.badge > 99 ? "99+" : item.badge}
									</Box>
								)}
							</MenuItem>
						))}
					</Box>

					<Box sx={{mx: 2, borderRadius: 3}}>
						<Box
							sx={(theme) => ({
								px: 2,
								py: 1,
								borderRadius: 2,
								cursor: "pointer",
								backgroundColor: alpha(theme.palette[themeMode === "light" ? "primary" : "warning"].main, 0.08),
								color: theme.palette[themeMode === "light" ? "primary" : "warning"].main,
								minHeight: 50,
							})}
							onClick={() => {
								handleThemeSubmit({themeMode: themeMode === "light" ? "dark" : "light"});
							}}>
							<Stack direction="row" sx={{alignItems: "center", justifyContent: "space-between"}}>
								<Typography variant="subtitle2" color="text.secondary">
									Mode
								</Typography>
								<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" width="34" height="34" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										opacity="0.4"
										d="M16.9462 11.0863C16.9759 11.0875 17.0055 11.0886 17.035 11.0898C20.1966 11.2176 22.5 13.3358 22.5 16.5C22.5 19.6642 20.1966 21.7824 17.035 21.9102C15.7057 21.9639 14.0498 22 12 22C9.9502 22 8.2943 21.9639 6.965 21.9102C3.80337 21.7824 1.5 19.6642 1.5 16.5C1.5 14.0317 2.90165 12.1999 5.019 11.4529C5.2406 8.2951 7.3872 6.02435 10.6413 6.00125C10.7585 6.00045 10.878 6 11 6C11.122 6 11.2415 6.00045 11.3587 6.00125C14.4855 6.02345 16.5897 8.1208 16.9462 11.0863Z"
										fill="currentColor"></path>
									<path
										d="M19.2407 2.28853C19.5263 2.12002 19.5419 1.62921 19.2169 1.57222C18.1306 1.38179 16.9755 1.56344 15.9464 2.17059C14.4123 3.07575 13.5394 4.70186 13.501 6.38837C15.4283 7.12677 16.6785 8.86242 16.9459 11.0863L17.0347 11.0898C17.7391 11.1183 18.401 11.2456 19.0042 11.4612C19.6324 11.3806 20.2555 11.1732 20.8383 10.8294C21.8673 10.2222 22.5988 9.2907 22.9806 8.23415C23.0948 7.918 22.6711 7.6864 22.3855 7.8549C20.8813 8.74235 18.958 8.2157 18.0896 6.6786C17.2212 5.1415 17.7366 3.17599 19.2407 2.28853Z"
										fill="currentColor"></path>
								</svg>
							</Stack>
						</Box>
					</Box>

					<Box sx={{m: 2, p: 1, borderRadius: 3}}>
						<Typography variant="subtitle2" color="text.secondary" sx={{mb: 1}}>
							Theme Color
						</Typography>

						<Grid container spacing={1}>
							{ColorCards.map((item) => (
								<Grid size={4} key={item.key}>
									<Box
										sx={(theme) => ({
											p: 2,
											borderRadius: 2,
											cursor: "pointer",
											backgroundColor: themeColor === item.key ? alpha(theme.palette[item.key].main, 0.08) : "",
											color: theme.palette[item.key].main,
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "center",
											minHeight: 50,
											transition: "all .2s ease",
											"&:hover": {
												backgroundColor: alpha(theme.palette[item.key].light, 0.1),
												transform: "translateY(-2px)",
											},
										})}
										onClick={() => {
											handleThemeSubmit({themeColor: item?.key});
										}}>
										<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path
												opacity="0.4"
												fill-rule="evenodd"
												clip-rule="evenodd"
												d="M20.828 4.172C22 5.343 22 7.229 22 11V13C22 16.771 22 18.657 20.828 19.828C19.657 21 17.771 21 14 21H9V3H14C17.771 3 19.657 3 20.828 4.172Z"
												fill="currentColor"></path>
											<path
												d="M18.5 9.244C18.6989 9.244 18.8897 9.32302 19.0303 9.46367C19.171 9.60432 19.25 9.79509 19.25 9.994C19.25 10.1929 19.171 10.3837 19.0303 10.5243C18.8897 10.665 18.6989 10.744 18.5 10.744H12.5C12.3011 10.744 12.1103 10.665 11.9697 10.5243C11.829 10.3837 11.75 10.1929 11.75 9.994C11.75 9.79509 11.829 9.60432 11.9697 9.46367C12.1103 9.32302 12.3011 9.244 12.5 9.244H18.5ZM17.5 13.244C17.6989 13.244 17.8897 13.323 18.0303 13.4637C18.171 13.6043 18.25 13.7951 18.25 13.994C18.25 14.1929 18.171 14.3837 18.0303 14.5243C17.8897 14.665 17.6989 14.744 17.5 14.744H13.5C13.3011 14.744 13.1103 14.665 12.9697 14.5243C12.829 14.3837 12.75 14.1929 12.75 13.994C12.75 13.7951 12.829 13.6043 12.9697 13.4637C13.1103 13.323 13.3011 13.244 13.5 13.244H17.5ZM2 12.994V10.994C2 7.223 2 5.337 3.172 4.166C4.146 3.191 6.364 3.027 9 3V20.988C6.364 20.961 4.146 20.797 3.172 19.822C2 18.651 2 16.765 2 12.994Z"
												fill="currentColor"></path>
										</svg>
									</Box>
								</Grid>
							))}
						</Grid>
					</Box>

					<Box sx={{px: 3, py: 1, flex: 1}}>
						<Button
							fullWidth
							color="error"
							variant="contained"
							onClick={logout}
							startIcon={
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
									<path d="M0 0h24v24H0z" fill="none" />
									<path
										fill="currentColor"
										fillRule="evenodd"
										d="M16.125 12a.75.75 0 0 0-.75-.75H4.402l1.961-1.68a.75.75 0 1 0-.976-1.14l-3.5 3a.75.75 0 0 0 0 1.14l3.5 3a.75.75 0 1 0 .976-1.14l-1.96-1.68h10.972a.75.75 0 0 0 .75-.75"
										clipRule="evenodd"
									/>
									<path
										fill="currentColor"
										d="M9.375 8c0 .702 0 1.053.169 1.306a1 1 0 0 0 .275.275c.253.169.604.169 1.306.169h4.25a2.25 2.25 0 0 1 0 4.5h-4.25c-.702 0-1.053 0-1.306.168a1 1 0 0 0-.275.276c-.169.253-.169.604-.169 1.306c0 2.828 0 4.243.879 5.121c.878.879 2.292.879 5.12.879h1c2.83 0 4.243 0 5.122-.879c.879-.878.879-2.293.879-5.121V8c0-2.828 0-4.243-.879-5.121S19.203 2 16.375 2h-1c-2.829 0-4.243 0-5.121.879c-.879.878-.879 2.293-.879 5.121"
									/>
								</svg>
							}
							sx={{
								fontWeight: 600,
								fontSize: 14,
							}}>
							Logout
						</Button>
					</Box>
				</Box>
			</Drawer>
		</Box>
	);
}
