import {Link, useNavigate} from "react-router-dom";
import React, {useState, useEffect} from "react";

import {AuthRoutes} from "src/routes/routes";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {useTheme} from "@mui/material";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";

import * as Yup from "yup";
import {Form, Formik} from "formik";

import Iconify from "src/components/common/iconify";
import {OTPFieldForm, TextFieldForm} from "src/components/common/inputs";
import {CustomBackGround} from "src/components/common/CustomBackGround";
import {useDispatch} from "react-redux";
import {ForgotPasswordServices, resendOTPServices, verifyOTPServices} from "src/services/Auth.Services";
import {getErrorMessage} from "src/utils/utils";

const RESEND_COOLDOWN = 60; // 60 seconds cooldown

function ForgotPassword() {
	const theme = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [formSubmitLoader, setFormSubmitLoader] = useState(false);
	const [cooldownSeconds, setCooldownSeconds] = useState(0);

	const [email, setEmail] = useState("");
	const [error, setError] = React.useState("");
	const [isEmailSent, setIsEmailSent] = React.useState(false);

	// Cooldown timer effect
	useEffect(() => {
		let interval;
		if (cooldownSeconds > 0) {
			interval = setInterval(() => {
				setCooldownSeconds((prev) => prev - 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [cooldownSeconds]);

	const handleForgotPassword = (values) => {
		// setError(null);
		// setFormSubmitLoader(true);
		// setEmail(values.email);
		// setIsEmailSent(true);

		setError(null);

		setFormSubmitLoader(true);
		setEmail(values.email);

		dispatch(
			ForgotPasswordServices({email: values.email}, (response) => {
				setFormSubmitLoader(false);
				if (response?.success) {
					setIsEmailSent(true);
					setCooldownSeconds(RESEND_COOLDOWN);
				} else {
					const errorMessage = getErrorMessage(response);
					setError(errorMessage || response?.message || "Please try again.");
				}
			}),
		);
	};

	const handleResendOTP = (values) => {
		setError(null);

		setFormSubmitLoader(true);
		setEmail(values.email);

		dispatch(
			resendOTPServices({email: values.email}, (response) => {
				setFormSubmitLoader(false);
				if (response?.success) {
					setIsEmailSent(true);
					setCooldownSeconds(RESEND_COOLDOWN);
				} else {
					const errorMessage = getErrorMessage(response);
					setError(errorMessage || response?.message || "Please try again.");
				}
			}),
		);
	};

	const handleVerifyCode = (values) => {
		setError(null);
		dispatch(
			verifyOTPServices({email, otp: values.code}, (response) => {
				if (response?.success) {
					const verified = response?.data?.verified;
					if (!verified) {
						setError(response?.message || "Reset token was not returned by the server.");
						return;
					} else {
						navigate(AuthRoutes.ResetPassword, {state: {email}});
					}
				} else {
					const errorMessage = getErrorMessage(response);
					setError(errorMessage || response?.message || "Please try again.");
				}
			}),
		);
	};

	return (
		<CustomBackGround
			imageName="bg3.png"
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

					<Stack spacing={1.5}>
						<Typography variant="h4">{isEmailSent ? "Verify Reset Code" : "Forgot Password"}</Typography>
						<Typography variant="body2" sx={{color: "text.secondary"}}>
							{isEmailSent ? "Enter the 6 digit code sent to your email to continue." : "Enter your workspace email and we will send you a reset code."}
						</Typography>

						{error && <Alert severity="error">{error}</Alert>}
						{!isEmailSent ? (
							<Formik
								enableReinitialize
								initialValues={{email: ""}}
								validationSchema={Yup.object().shape({
									email: Yup.string().email("Invalid email address").required("Email is required"),
								})}
								onSubmit={handleForgotPassword}>
								{(props) => (
									<Form autoComplete="off" noValidate>
										<Stack spacing={2}>
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
																<i className="fa-solid fa-envelope fa-lg" />
															</InputAdornment>
														),
													},
												}}
											/>

											<Button type="submit" variant="contained" color="primary" fullWidth disabled={formSubmitLoader} sx={{py: 1.5}}>
												Send Reset Code
											</Button>
										</Stack>
									</Form>
								)}
							</Formik>
						) : (
							<Formik
								enableReinitialize
								initialValues={{code: ""}}
								validationSchema={Yup.object().shape({
									code: Yup.string()
										.required("Code is required")
										.matches(/^\d{6}$/, "OTP must be 6 digits"),
								})}
								onSubmit={handleVerifyCode}>
								{(props) => (
									<Form autoComplete="off" noValidate>
										<Stack spacing={1.5}>
											<OTPFieldForm formik={props} label="code" field="code" />
											<Typography
												variant="body2"
												sx={{
													cursor: cooldownSeconds > 0 ? "not-allowed" : "pointer",
													fontWeight: 600,
													opacity: cooldownSeconds > 0 ? 0.5 : 1,
													color: cooldownSeconds > 0 ? "text.disabled" : "primary.main",
												}}
												onClick={() => {
													if (cooldownSeconds === 0) {
														handleResendOTP({email});
													}
												}}>
												<Stack direction={"row"} sx={{alignItems: "center"}}>
													<Iconify icon="tabler:reload" />
													{cooldownSeconds > 0 ? `Resend Code (${cooldownSeconds}s)` : "Resend Code"}
												</Stack>
											</Typography>
											<Button type="submit" variant="contained" color="primary" fullWidth disabled={formSubmitLoader} sx={{py: 1.5}}>
												Verify Code
											</Button>
										</Stack>
									</Form>
								)}
							</Formik>
						)}

						<Typography variant="body2" sx={{color: "text.secondary"}}>
							Remembered your password?{" "}
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
								Back to login
							</Link>
						</Typography>
					</Stack>
				</Stack>
			}
		/>
	);
}

export default ForgotPassword;
