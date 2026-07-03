import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {Alert, alpha, Box, Button, Card, Grid, Stack, Tab, Tabs, Typography} from "@mui/material";

import {Form, Formik} from "formik";
import * as Yup from "yup";

import {NAME_REGEX, PASSWORD_REGEX, ColorCards} from "src/constance";
import {TextFieldForm} from "src/components/common/inputs";
import {UpdateProfileServices, ChangePasswordServices} from "src/services/Profile.Services";
import {sweetAlerts, sweetAlertSuccess} from "src/utils/sweet-alerts";
import {getErrorMessage} from "src/utils/utils";
import {useSearchParams} from "react-router-dom";
import Iconify from "src/components/common/iconify";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

const Settings = () => {
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();

	const {userDetails} = useSelector((state) => state.auth);
	const {themeColor, themeMode} = useSelector((state) => state.common);

	const [activeTab, setActiveTab] = useState("profile");

	const [profileErrMsg, setProfileErrMsg] = useState(null);
	const [pwdErrMsg, setPwdErrMsg] = useState(null);
	const [loadingProfile, setLoadingProfile] = useState(false);
	const [loadingPassword, setLoadingPassword] = useState(false);

	const [showCurrentPassword, setShowCurrentPassword] = useState(true);
	const [showNewPassword, setShowNewPassword] = useState(true);
	const [showConfirmPassword, setShowConfirmPassword] = useState(true);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	useEffect(() => {
		function fun() {
			setActiveTab(searchParams.get("tab") || "profile");
		}
		fun();
	}, [searchParams]);

	const handleProfileSubmit = (values) => {
		setLoadingProfile(true);
		setProfileErrMsg(null);

		dispatch(
			UpdateProfileServices(values, (res) => {
				setLoadingProfile(false);
				if (res?.success) {
					sweetAlertSuccess(res?.message || "Profile updated successfully");
					const updatedUser = {...userDetails, name: values.name, phone_number: values.phone_number, number: values.phone_number};
					localStorage.setItem("user", JSON.stringify(updatedUser));
					dispatch({
						type: "USER_DETAILS",
						details: updatedUser,
					});
				} else {
					const error = getErrorMessage(res);
					setProfileErrMsg(error);
				}
			}),
		);
	};

	// ─── Password submit ──────────────────────────────────────────────── //
	const handlePasswordSubmit = (values, {resetForm}) => {
		setLoadingPassword(true);
		setPwdErrMsg(null);
		const {confirm_password, ...payload} = values;
		payload.new_password_confirmation = confirm_password;

		dispatch(
			ChangePasswordServices(payload, (res) => {
				setLoadingPassword(false);
				if (res?.status) {
					sweetAlerts("success", res?.message || "Password changed successfully");
					resetForm();
				} else {
					setPwdErrMsg(res?.message || "Failed to change password");
				}
			}),
		);
	};

	// ─── Render ───────────────────────────────────────────────────────── //
	const handleThemeSubmit = (values) => {
		if (values.themeMode !== themeMode) {
			dispatch({type: "THEME_MODE_CHANGE", payload: values.themeMode});
		}
		if (values.themeColor !== themeColor) {
			dispatch({type: "THEME_COLOR_CHANGE", payload: values.themeColor});
		}
		sweetAlerts("success", "Theme settings updated successfully");
	};

	return (
		<Stack spacing={3}>
			<Box>
				<Typography variant="h4" color="text.primary">
					Profile
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Manage your profile
				</Typography>
			</Box>

			{/* Tabs card */}
			<Card sx={{p: 2}}>
				<Tabs
					value={activeTab}
					onChange={(_, v) => {
						setActiveTab(v);
						setSearchParams({tab: v});
						setProfileErrMsg(null);
						setPwdErrMsg(null);
					}}>
					<Tab icon={<Iconify icon="solar:user-bold" />} label="Profile" value={"profile"} iconPosition="start" />
					<Tab icon={<Iconify icon="solar:lock-password-bold" />} label="Change Password" value={"password"} iconPosition="start" />
				</Tabs>

				<Box sx={{p: 2}}>
					{activeTab === "profile" && (
						<Formik
							enableReinitialize
							initialValues={{
								name: userDetails?.name || "",
								email: userDetails?.email || "",
								phone_number: userDetails?.phone_number || "",
							}}
							validationSchema={Yup.object().shape({
								name: Yup.string()
									.matches(NAME_REGEX, "Name can only contain letters, numbers, spaces, hyphens, and apostrophes")
									.min(2, "Name must be at least 2 characters")
									.max(60, "Name must be at most 60 characters")
									.required("Full name is required"),
								email: Yup.string().email("Invalid email address").required("Email is required"),
								phone_number: Yup.number().required("Phone number is required"),
							})}
							onSubmit={handleProfileSubmit}>
							{(props) => (
								<Form autoComplete="off" noValidate>
									<Stack spacing={3}>
										{/* Profile form */}
										<Stack spacing={2}>
											<Typography variant="body2" sx={{fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px"}}>
												Personal Information
											</Typography>

											{profileErrMsg && <Alert severity="error">{profileErrMsg}</Alert>}

											<Stack direction="row" spacing={2}>
												<Box sx={{flex: 1}}>
													<TextFieldForm formik={props} label="Full Name" field="name" required />
												</Box>
												<Box sx={{flex: 1}} />
											</Stack>

											<Stack direction="row" spacing={2}>
												<Box sx={{flex: 1}}>
													<TextFieldForm formik={props} label="Email" field="email" required />
												</Box>
												<Box sx={{flex: 1}} />
											</Stack>

											<Stack direction="row" spacing={2}>
												<Box sx={{flex: 1}}>
													<TextFieldForm formik={props} label="Phone Number" field="phone_number" required />
												</Box>
												<Box sx={{flex: 1}} />
											</Stack>

											<Stack direction="row" spacing={2}>
												<Box sx={{flex: 1}}></Box>
												<Box sx={{flex: 1}} />
											</Stack>

											<Stack direction="row" justifyContent="flex-end" spacing={1}>
												{props.dirty && !loadingProfile && (
													<Button variant="outlined" color="primary" type="button" onClick={() => props.resetForm()}>
														Cancel
													</Button>
												)}
												<Button type="submit" variant="contained" color="primary" disabled={!props.dirty || loadingProfile}>
													Save Changes
												</Button>
											</Stack>
										</Stack>
									</Stack>
								</Form>
							)}
						</Formik>
					)}

					{activeTab === "password" && (
						<Formik
							initialValues={{current_password: "", new_password: "", confirm_password: ""}}
							validationSchema={Yup.object().shape({
								current_password: Yup.string().required("Current password is required"),
								new_password: Yup.string().matches(PASSWORD_REGEX, "Password must be at least 8 characters with uppercase, lowercase, number, and special character").required("New password is required"),
								confirm_password: Yup.string()
									.oneOf([Yup.ref("new_password")], "Passwords do not match")
									.required("Please confirm your new password"),
							})}
							onSubmit={handlePasswordSubmit}>
							{(props) => (
								<Form autoComplete="off" noValidate>
									<Stack spacing={2}>
										<Typography variant="body2" sx={{fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px"}}>
											Change Password
										</Typography>

										{pwdErrMsg && <Alert severity="error">{pwdErrMsg}</Alert>}

										<Stack direction="row" spacing={2}>
											<Box sx={{flex: 1}}>
												<TextFieldForm
													formik={props}
													label="Current Password"
													field="current_password"
													type={!showCurrentPassword ? "text" : "password"}
													slotProps={{
														input: {
															endAdornment: (
																<InputAdornment position="end">
																	<IconButton onClick={() => setShowCurrentPassword((s) => !s)} onMouseDown={handleMouseDownPassword} edge="end">
																		{showCurrentPassword ? <Iconify icon="solar:eye-closed-bold" width={20} /> : <Iconify icon="fluent:eye-12-filled" width={20} />}
																	</IconButton>
																</InputAdornment>
															),
														},
													}}
												/>
											</Box>
											<Box sx={{flex: 1}} />
										</Stack>

										<Stack direction="row" spacing={2}>
											<Box sx={{flex: 1}}>
												<TextFieldForm
													formik={props}
													label="New Password"
													field="new_password"
													type={!showNewPassword ? "text" : "password"}
													slotProps={{
														input: {
															endAdornment: (
																<InputAdornment position="end">
																	<IconButton onClick={() => setShowNewPassword((s) => !s)} onMouseDown={handleMouseDownPassword} edge="end">
																		{showNewPassword ? <Iconify icon="solar:eye-closed-bold" width={20} /> : <Iconify icon="fluent:eye-12-filled" width={20} />}
																	</IconButton>
																</InputAdornment>
															),
														},
													}}
												/>
											</Box>
											<Box sx={{flex: 1}}></Box>
										</Stack>

										<Stack direction="row" spacing={2}>
											<Box sx={{flex: 1}}>
												<TextFieldForm
													formik={props}
													label="Confirm New Password"
													field="confirm_password"
													type={!showConfirmPassword ? "text" : "password"}
													slotProps={{
														input: {
															endAdornment: (
																<InputAdornment position="end">
																	<IconButton onClick={() => setShowConfirmPassword((s) => !s)} onMouseDown={handleMouseDownPassword} edge="end">
																		{showConfirmPassword ? <Iconify icon="solar:eye-closed-bold" width={20} /> : <Iconify icon="fluent:eye-12-filled" width={20} />}
																	</IconButton>
																</InputAdornment>
															),
														},
													}}
												/>
											</Box>
											<Box sx={{flex: 1}} />
										</Stack>

										<Stack direction="row" justifyContent="flex-end" spacing={1}>
											{props.dirty && !loadingPassword && (
												<Button variant="outlined" type="button" color="primary" onClick={() => props.resetForm()}>
													Cancel
												</Button>
											)}
											<Button type="submit" variant="contained" color="primary" disabled={!props.dirty || loadingPassword}>
												Update Password
											</Button>
										</Stack>
									</Stack>
								</Form>
							)}
						</Formik>
					)}

					{activeTab === "theme" && (
						<Box>
							<Formik enableReinitialize initialValues={{themeMode: themeMode || "", themeColor: themeColor || ""}} validationSchema={Yup.object().shape({})} onSubmit={handleThemeSubmit}>
								{(props) => (
									<Form autoComplete="off" noValidate>
										<Grid container spacing={2} alignItems="stretch">
											<Grid size={{xs: 12, md: 3}}>
												<Stack
													spacing={2}
													sx={{
														height: "100%",
														p: 2,
														border: "1px solid",
														borderColor: "divider",
														borderRadius: 3,
														justifyContent: "space-between",
														cursor: "pointer",
													}}
													onClick={() => {
														props.setFieldValue("themeMode", props?.values?.themeMode === "light" ? "dark" : "light");
													}}>
													<Typography variant="subtitle2" color="text.secondary" sx={{mb: 1}}>
														Theme Mode
													</Typography>

													<Box
														sx={{
															flex: 1,
															display: "flex",
															borderRadius: 3,
															alignItems: "center",
															justifyContent: "center",
															backgroundColor: (theme) => alpha(theme.palette[props.values.themeMode === "light" ? "primary" : "warning"].main, 0.08),
															color: (theme) => theme.palette[props.values.themeMode === "light" ? "primary" : "warning"].main,
														}}>
														<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" width="22%" height="auto" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path
																opacity="0.4"
																d="M16.9462 11.0863C16.9759 11.0875 17.0055 11.0886 17.035 11.0898C20.1966 11.2176 22.5 13.3358 22.5 16.5C22.5 19.6642 20.1966 21.7824 17.035 21.9102C15.7057 21.9639 14.0498 22 12 22C9.9502 22 8.2943 21.9639 6.965 21.9102C3.80337 21.7824 1.5 19.6642 1.5 16.5C1.5 14.0317 2.90165 12.1999 5.019 11.4529C5.2406 8.2951 7.3872 6.02435 10.6413 6.00125C10.7585 6.00045 10.878 6 11 6C11.122 6 11.2415 6.00045 11.3587 6.00125C14.4855 6.02345 16.5897 8.1208 16.9462 11.0863Z"
																fill="currentColor"></path>
															<path
																d="M19.2407 2.28853C19.5263 2.12002 19.5419 1.62921 19.2169 1.57222C18.1306 1.38179 16.9755 1.56344 15.9464 2.17059C14.4123 3.07575 13.5394 4.70186 13.501 6.38837C15.4283 7.12677 16.6785 8.86242 16.9459 11.0863L17.0347 11.0898C17.7391 11.1183 18.401 11.2456 19.0042 11.4612C19.6324 11.3806 20.2555 11.1732 20.8383 10.8294C21.8673 10.2222 22.5988 9.2907 22.9806 8.23415C23.0948 7.918 22.6711 7.6864 22.3855 7.8549C20.8813 8.74235 18.958 8.2157 18.0896 6.6786C17.2212 5.1415 17.7366 3.17599 19.2407 2.28853Z"
																fill="currentColor"></path>
														</svg>
													</Box>
												</Stack>
											</Grid>
											<Grid size={{xs: 12, md: 9}}>
												<Stack
													spacing={2}
													sx={{
														height: "100%",
														p: 2,
														border: "1px solid",
														borderColor: "divider",
														borderRadius: 3,
													}}>
													<Typography variant="subtitle2" color="text.secondary" sx={{mb: 1}}>
														Theme Color
													</Typography>
													<Grid container spacing={1}>
														{ColorCards.map((item) => (
															<Grid size={4} key={item.key}>
																<Box
																	sx={(theme) => ({
																		p: 2,
																		borderRadius: 3,
																		cursor: "pointer",
																		backgroundColor: props.values.themeColor === item.key ? alpha(theme.palette[item.key].main, 0.08) : "",
																		color: theme.palette[item.key].main,
																		display: "flex",
																		flexDirection: "column",
																		alignItems: "center",
																		justifyContent: "center",
																		minHeight: 60,
																		transition: "all .2s ease",
																		// border: "1px solid",
																		// borderColor: "divider",
																		"&:hover": {
																			backgroundColor: alpha(theme.palette[item.key].main, 0.1),
																			transform: "translateY(-2px)",
																		},
																	})}
																	onClick={() => {
																		props.setFieldValue("themeColor", item?.key);
																	}}>
																	<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" width="34" height="34" fill="none" xmlns="http://www.w3.org/2000/svg">
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
												</Stack>
											</Grid>

											<Grid size={{xs: 12, md: 12}}>
												<Stack direction="row" justifyContent="flex-end" spacing={1}>
													{props.dirty && !loadingProfile && (
														<Button variant="outlined" color="primary" type="button" onClick={() => props.resetForm()}>
															Cancel
														</Button>
													)}
													<Button type="submit" variant="contained" color="primary" disabled={!props.dirty || loadingProfile}>
														Save Changes
													</Button>
												</Stack>
											</Grid>
										</Grid>
									</Form>
								)}
							</Formik>
						</Box>
					)}
				</Box>
			</Card>
		</Stack>
	);
};

export default Settings;
