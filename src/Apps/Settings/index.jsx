import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import {useTheme, alpha} from "@mui/material/styles";

import Iconify from "src/components/common/iconify";
import {TextFieldForm} from "src/components/common/inputs";
import {sweetAlerts, sweetAlertSuccess} from "src/utils/sweet-alerts";
import {GetAdminSettingsServices, UpdateAdminSettingServices} from "src/services/Settings.Services";

export default function Settings() {
	const theme = useTheme();
	const dispatch = useDispatch();

	const [initialValue, setInitialValue] = useState(null);
	const [settingDescription, setSettingDescription] = useState("");
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [errorMsg, setErrorMsg] = useState(null);

	// Fetch Settings
	useEffect(() => {
		dispatch(
			GetAdminSettingsServices((res) => {
				setLoading(false);
				if (res?.success) {
					const settingsList = res?.data?.settings || [];
					const sparkSetting = settingsList.find((item) => item.key === "spark_value");
					if (sparkSetting) {
						setInitialValue(sparkSetting.value);
						setSettingDescription(sparkSetting.description || "The value or credit amount associated with a spark.");
					} else {
						// Default if spark_value isn't found in database yet
						setInitialValue("100");
						setSettingDescription("The value or credit amount associated with a spark.");
					}
				} else {
					setErrorMsg(res?.message || "Failed to fetch settings from server.");
					// Fallback to local default to allow editing
					setInitialValue("100");
				}
			})
		);
	}, [dispatch]);

	// Handle Submit
	const handleSubmit = (values) => {
		setSubmitting(true);
		setErrorMsg(null);
		
		dispatch(
			UpdateAdminSettingServices("spark_value", {value: String(values.spark_value)}, (res) => {
				setSubmitting(false);
				if (res?.success) {
					sweetAlertSuccess(res?.message || "Settings updated successfully.");
					setInitialValue(String(values.spark_value));
				} else {
					sweetAlerts("error", res?.message || "Failed to update setting.");
				}
			})
		);
	};

	return (
		<Stack spacing={4} sx={{maxWidth: 800, mx: "auto", py: 2}}>
			{/* Top Header */}
			<Box>
				<Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
					System Settings
				</Typography>
				<Typography variant="body2" sx={{color: "text.secondary"}}>
					Configure system-wide settings, variables, rewards, and threshold limits.
				</Typography>
			</Box>

			{loading ? (
				<Card sx={{p: 4}}>
					<Stack spacing={3}>
						<Skeleton variant="text" width="40%" height={32} />
						<Skeleton variant="rectangular" height={56} sx={{borderRadius: 1}} />
						<Skeleton variant="rectangular" height={80} sx={{borderRadius: 1}} />
						<Skeleton variant="rectangular" width={150} height={42} sx={{borderRadius: 1, selfAlign: "flex-end"}} />
					</Stack>
				</Card>
			) : (
				<Card
					sx={{
						p: 4,
						border: "1px solid",
						borderColor: "transparent",
						transition: "all 0.3s ease",
						boxShadow: theme.shadows[4],
						"&:hover": {
							borderColor: alpha(theme.palette.primary.main, 0.15),
							boxShadow: `0 12px 24px -4px ${alpha(theme.palette.primary.main, 0.08)}`,
						},
					}}>
					<Formik
						enableReinitialize
						initialValues={{
							spark_value: initialValue || "",
						}}
						validationSchema={Yup.object().shape({
							spark_value: Yup.number()
								.typeError("Referral reward must be a valid number")
								.integer("Referral reward must be a whole number")
								.min(0, "Referral reward cannot be negative")
								.required("Referral reward value is required"),
						})}
						onSubmit={handleSubmit}>
						{(props) => (
							<Form autoComplete="off" noValidate>
								<Stack spacing={4}>
									{/* Section Info Header */}
									<Stack direction="row" spacing={2} alignItems="center">
										<Box
											sx={{
												p: 1.5,
												borderRadius: 2,
												backgroundColor: alpha(theme.palette.primary.main, 0.08),
												color: "primary.main",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}>
											<Iconify icon="solar:star-circle-bold-duotone" width={32} />
										</Box>
										<Box>
											<Typography variant="h6" fontWeight={700}>
												User Referral Reward Setting
											</Typography>
											{/* <Typography variant="caption" color="text.disabled" sx={{fontFamily: "monospace"}}>
												Setting Key: spark_value
											</Typography> */}
										</Box>
									</Stack>

									{errorMsg && <Alert severity="error">{errorMsg}</Alert>}

									{/* Spark Value Input */}
									<Box>
										<TextFieldForm
											formik={props}
											label="Referral Spark Reward (Spark Value)"
											field="spark_value"
											placeholder="e.g. 250"
											type="number"
											slotProps={{
												input: {
													startAdornment: (
														<InputAdornment position="start">
															<Iconify icon="solar:star-circle-linear" width={20} sx={{color: "text.secondary"}} />
														</InputAdornment>
													),
												},
											}}
										/>
									</Box>

									{/* Detailed Explanation */}
									<Alert severity="info" variant="outlined" sx={{borderStyle: "dashed", py: 1.5}}>
										<Typography variant="subtitle2" fontWeight={700} gutterBottom>
											About the User Referral System
										</Typography>
										<Typography variant="body2" color="text.secondary">
											The <code>spark_value</code> represents the reward value for the user referral system. 
											When a new user signs up using another user's referral code, this value is credited 
											to the referring user's Spark balance. Use this setting to configure that reward amount.
										</Typography>
									</Alert>

									{/* Form Action Buttons */}
									<Stack direction="row" justifyContent="flex-end" spacing={2}>
										{props.dirty && !submitting && (
											<Button
												variant="outlined"
												color="inherit"
												type="button"
												onClick={() => props.resetForm()}>
												Reset Changes
											</Button>
										)}
										<Button
											type="submit"
											variant="contained"
											color="primary"
											disabled={!props.dirty || submitting}
											startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Iconify icon="solar:diskette-bold" />}
											sx={{px: 3, py: 1}}>
											{submitting ? "Saving..." : "Save Settings"}
										</Button>
									</Stack>
								</Stack>
							</Form>
						)}
					</Formik>
				</Card>
			)}
		</Stack>
	);
}
