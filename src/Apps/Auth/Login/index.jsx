import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";

import * as Yup from "yup";
import {Form, Formik} from "formik";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {useTheme} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import Iconify from "src/components/common/iconify";
import {AdminRoutes, AuthRoutes} from "src/routes/routes";
import {CheckboxForm, TextFieldForm} from "src/components/common/inputs/index";
import {CustomBackGround} from "src/components/common/CustomBackGround";
import {LoginServices} from "src/services/Auth.Services";
import {getErrorMessage} from "src/utils/utils";

const LoginPage = () => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [errMsg, setErrMsg] = useState(null);
	const [showPassword, setShowPassword] = useState(true);
	const [formSubmitLoader, setFormSubmitLoader] = useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const onSubmit = (data) => {
		setErrMsg(null);
		setFormSubmitLoader(true);
		dispatch(
			LoginServices(data, (res) => {
				setFormSubmitLoader(false);
				if (res?.success) {
					localStorage.setItem("access_token", res?.data?.access_token);
					localStorage.setItem("user", JSON.stringify(res?.data?.user));
					// localStorage.setItem("refresh_token", res?.data?.refresh_token);
					navigate(AdminRoutes?.Dashboard);
				} else {
					const errorMessage = getErrorMessage(res);
					setErrMsg(errorMessage || res?.message || "Login failed. Please try again.");
				}
			}),
		);
	};

	return (
		<CustomBackGround
			imageName="bg3.png"
			headingText="Welcome to Dayteme Panel"
			subText="Welcome back! Please login to your account."
			rightContent={
				<Box sx={{}}>
					<Stack spacing={1.5}>
						<Avatar
							sx={{
								// backgroundColor: alpha(theme?.palette?.primary?.main, 0.15),
								backgroundColor: theme?.palette?.primary?.main,
								width: 55,
								height: 55,
								boxShadow: 1,
								// borderRadius: 20,
							}}
							variant="rounded">
							<Iconify icon="mingcute:love-fill" width={30} />
						</Avatar>

						<Typography variant="h4">Login</Typography>
						<Typography variant="body2" color="text.secondary">
							Log in to your workspace
						</Typography>

						<Formik
							enableReinitialize
							initialValues={{email: "", password: "", remember_me: false}}
							validationSchema={Yup.object().shape({
								email: Yup.string().email("Invalid email address").trim().lowercase().required("Email is required"),
								password: Yup.string().required("Password is required"),
								remember_me: Yup.boolean().default(false),
							})}
							onSubmit={onSubmit}>
							{(props) => (
								<Form autoComplete="off" noValidate>
									<Stack spacing={2}>
										{errMsg && <Alert severity="error">{errMsg}</Alert>}
										<TextFieldForm
											formik={props}
											label="Email"
											field="email"
											placeholder="Enter your email"
											InputLabelProps={{
												shrink: true,
											}}
											slotProps={{
												input: {
													startAdornment: (
														<InputAdornment>
															<Iconify icon="tabler:mail-filled" width={20} />
														</InputAdornment>
													),
												},
											}}
										/>

										<TextFieldForm
											formik={props}
											label="Password"
											field="password"
											placeholder="Enter password"
											type={!showPassword ? "text" : "password"}
											slotProps={{
												input: {
													startAdornment: (
														<InputAdornment>
															<Iconify icon="boxicons:lock-open-filled" width={20} />
														</InputAdornment>
													),
													endAdornment: (
														<InputAdornment position="end">
															<IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
																{showPassword ? <Iconify icon="solar:eye-closed-bold" width={20} /> : <Iconify icon="fluent:eye-12-filled" width={20} />}
															</IconButton>
														</InputAdornment>
													),
												},
											}}
										/>
										<Stack direction={"row"} sx={{alignItems: "center", justifyContent: "space-between"}}>
											<CheckboxForm formik={props} label="Remember Me" field="remember_me" />
											<Link
												style={{
													color: theme.palette.primary.main,
													...theme?.typography?.body2,
													fontWeight: 600,
												}}
												onMouseEnter={(e) => {
													e.target.style.textDecoration = "underline";
												}}
												onMouseLeave={(e) => {
													e.target.style.textDecoration = "none";
												}}
												to={AuthRoutes.ForgotPassword}>
												Forgot Password?
											</Link>
										</Stack>

										<Button
											type="submit"
											variant="contained"
											fullWidth
											disabled={formSubmitLoader}
											sx={{
												py: 1.5,
											}}>
											Login
										</Button>
									</Stack>
								</Form>
							)}
						</Formik>
					</Stack>
				</Box>
			}
		/>
	);
};

export default LoginPage;
