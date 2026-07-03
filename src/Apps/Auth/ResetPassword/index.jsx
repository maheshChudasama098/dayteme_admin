import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";

import * as Yup from "yup";
import {Formik, Form} from "formik";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {alpha, useTheme} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import {PASSWORD_REGEX} from "src/constance";
import {AuthRoutes} from "src/routes/routes";
import Iconify from "src/components/common/iconify";
import {TextFieldForm} from "src/components/common/inputs";
import {CustomBackGround} from "src/components/common/CustomBackGround";
import {ResetPasswordServices} from "src/services/Auth.Services";
import {getErrorMessage} from "src/utils/utils";

function Index() {
	const theme = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const email = location.state?.email;

	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [formSubmitLoader, setFormSubmitLoader] = useState(false);

	const handleClickShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const onSubmit = (values) => {
		console.log("email", email);
		setError("");
		if (!email) {
			setError("Email is missing. Please restart the forgot password flow.");
			return;
		}
		setFormSubmitLoader(true);
		dispatch(
			ResetPasswordServices(
				{
					email: email,
					password: values.newPassword,
					password_confirmation: values.confirmPassword,
				},
				(res) => {
					setFormSubmitLoader(false);

					if (res?.success) {
						setMessage(res?.message || "Password reset successfully.");
						navigate(AuthRoutes.Login);
					} else {
						const errorMessage = getErrorMessage(res);
						setError(errorMessage || res?.message || "Please try again.");
					}
				},
			),
		);
	};

	return (
		<CustomBackGround
			imageName="bg.png"
			headingText="Manage the job"
			subText="More effectively with optimized workflows."
			rightContent={
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

					<Typography variant="h4">Reset Password</Typography>
					<Typography variant="body2" color="text.secondary">
						Choose a strong new password for your account.
					</Typography>

					<Formik
						initialValues={{
							newPassword: "",
							confirmPassword: "",
						}}
						validationSchema={Yup.object().shape({
							newPassword: Yup.string()
								.matches(PASSWORD_REGEX, "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character")
								.required("New password is required"),

							confirmPassword: Yup.string()
								.oneOf([Yup.ref("newPassword"), null], "Passwords must match")
								.required("Confirm Password is required"),
						})}
						onSubmit={onSubmit}>
						{(props) => (
							<Form autoComplete="off" noValidate>
								<Stack spacing={2}>
									{error && <Alert severity="error">{error}</Alert>}
									{message && <Alert severity="success">{message}</Alert>}

									<TextFieldForm
										formik={props}
										label="New Password"
										field="newPassword"
										placeholder="Enter new password"
										type={showPassword ? "text" : "password"}
										slotProps={{
											input: {
												startAdornment: (
													<InputAdornment position="start">
														<Iconify icon="boxicons:lock-open-filled" width={20} />
													</InputAdornment>
												),
												endAdornment: (
													<InputAdornment position="end">
														<IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
															{!showPassword ? <Iconify icon="solar:eye-closed-bold" width={20} /> : <Iconify icon="fluent:eye-12-filled" width={20} />}
														</IconButton>
													</InputAdornment>
												),
											},
										}}
									/>

									<TextFieldForm
										formik={props}
										label="Confirm Password"
										field="confirmPassword"
										placeholder="Confirm password"
										type="password"
										slotProps={{
											input: {
												startAdornment: (
													<InputAdornment position="start">
														<Iconify icon="boxicons:lock-open-filled" width={20} />
													</InputAdornment>
												),
											},
										}}
									/>

									<Button
										type="submit"
										variant="contained"
										fullWidth
										disabled={formSubmitLoader}
										sx={{
											py: 1.5,
										}}>
										Reset Password
									</Button>

									<Typography variant="body2" color="text.secondary" align="center">
										Want to go back?{" "}
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
											to={AuthRoutes.Login}>
											Return to Login
										</Link>
									</Typography>
								</Stack>
							</Form>
						)}
					</Formik>
				</Stack>
			}
		/>
	);
}

export default Index;
