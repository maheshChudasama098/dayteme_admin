import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import {useTheme, alpha} from "@mui/material/styles";
import {useDispatch} from "react-redux";
import {useHasPermission} from "src/hooks/use-permission";

import Iconify from "src/components/common/iconify";
import {sweetAlertQuestion, sweetAlertSuccess, sweetAlerts} from "src/utils/sweet-alerts";
import {GetAdminUserDetailsServices, PostAdminUserKycStatusServices, PostAdminUserStatusServices} from "src/services/Users.Services";
import {fAge, fDate, getErrorMessage} from "src/utils/utils";

export default function VerificationDetails() {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [searchParams] = useSearchParams();
	const userId = searchParams.get("id");
	const {hasPermission} = useHasPermission();

	const [actionAnchorEl, setActionAnchorEl] = useState(null);
	const [rejectAnchorEl, setRejectAnchorEl] = useState(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [orbaoneData, setOrbaoneData] = useState({});

	useEffect(() => {
		if (userId) {
			dispatch(
				GetAdminUserDetailsServices(userId, (res) => {
					setLoading(false);
					if (res?.success) {
						setUser(res?.data?.user || {});
					} else {
						sweetAlerts("error", getErrorMessage(res) || "Failed to load user details");
					}
				}),
			);
		}
	}, [userId, dispatch]);

	// useEffect(() => {
	// 	if (user?.orba_one_applicant_id) {
	// 		fetch(`https://api.orbaone.com/api/v1/applicants/${user.orba_one_applicant_id}`, {
	// 			method: "GET",
	// 			headers: {
	// 				AuthKey: "M2JjNWM5ZjM3YzZkNDIxOWFhNjA2MTg0ODkzMjhlODg6NzYzMTMyOGY3NDY1NDM4OWJlNGU0NmQ2Yjc2NWE4Nzk=",
	// 				Accept: "application/json",
	// 			},
	// 		})
	// 			.then((res) => res.json())
	// 			.then((data) => {
	// 				setOrbaoneData(data?.data);
	// 			})
	// 			.catch((err) => {
	// 				console.error("Orba One Fetch Error:", err);
	// 			});
	// 	}
	// }, [user?.orba_one_applicant_id]);

	const handleAction = (actionName) => {
		setActionAnchorEl(null);
		if (!userId) return;

		let statusToUpdate = null;
		let commentStr = "";
		let confirmationMsg = "";
		let apiCall = "kyc"; // "kyc" or "status"

		if (actionName === "Approve") {
			statusToUpdate = 1;
			commentStr = "Approved by Admin";
			confirmationMsg = "Are you sure you want to approve this verification?";
		} else if (actionName === "Request Retry") {
			statusToUpdate = 3;
			commentStr = "Reset/Retry requested by Admin";
			confirmationMsg = "Are you sure you want to reset this verification and request retry?";
		} else if (actionName === "Mark as Duplicate") {
			statusToUpdate = 0;
			commentStr = "Rejected: Duplicate Account";
			confirmationMsg = "Are you sure you want to reject this verification as duplicate?";
		} else if (actionName === "Escalate for Manual Review") {
			statusToUpdate = 2;
			commentStr = "Escalated for Manual Review";
			confirmationMsg = "Are you sure you want to set this verification to manual review status?";
		} else if (actionName === "Ban User") {
			apiCall = "status";
			confirmationMsg = "Are you sure you want to ban this user?";
		}

		sweetAlertQuestion(confirmationMsg, `Confirm ${actionName}`).then((result) => {
			if (result) {
				if (apiCall === "kyc") {
					dispatch(
						PostAdminUserKycStatusServices(userId, {status: statusToUpdate, comment: commentStr}, (res) => {
							if (res?.success) {
								sweetAlertSuccess(`KYC Status Updated: ${actionName}`);
								// reload user details
								setLoading(true);
								dispatch(
									GetAdminUserDetailsServices(userId, (resData) => {
										setLoading(false);
										if (resData?.success) {
											setUser(resData?.data?.user || {});
										}
									}),
								);
							} else {
								sweetAlerts("error", getErrorMessage(res));
							}
						}),
					);
				} else {
					dispatch(
						PostAdminUserStatusServices(userId, {status: "banned"}, (res) => {
							if (res?.success) {
								sweetAlertSuccess("User banned successfully");
								// reload user details
								setLoading(true);
								dispatch(
									GetAdminUserDetailsServices(userId, (resData) => {
										setLoading(false);
										if (resData?.success) {
											setUser(resData?.data?.user || {});
										}
									}),
								);
							} else {
								sweetAlerts("error", getErrorMessage(res));
							}
						}),
					);
				}
			}
		});
	};

	const handleReject = (reason) => {
		setRejectAnchorEl(null);
		if (!userId) return;

		sweetAlertQuestion(`Reject verification due to: ${reason}?`, "Confirm Rejection").then((result) => {
			if (result) {
				dispatch(
					PostAdminUserKycStatusServices(userId, {status: 0, comment: `Rejected: ${reason}`}, (res) => {
						if (res?.success) {
							sweetAlertSuccess("Verification Rejected");
							// reload user details
							setLoading(true);
							dispatch(
								GetAdminUserDetailsServices(userId, (resData) => {
									setLoading(false);
									if (resData?.success) {
										setUser(resData?.data?.user || {});
									}
								}),
							);
						} else {
							sweetAlerts("error", getErrorMessage(res));
						}
					}),
				);
			}
		});
	};

	if (loading) {
		return (
			<Stack spacing={4}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}>
					<Stack spacing={1}>
						<Skeleton variant="text" width={250} height={40} />
						<Skeleton variant="text" width={180} height={20} />
					</Stack>
					<Skeleton variant="rectangular" width={100} height={36} sx={{borderRadius: 2}} />
				</Box>
				<Grid container spacing={3}>
					<Grid size={{xs: 12, md: 4}}>
						<Skeleton variant="rectangular" height={300} sx={{borderRadius: 4}} />
					</Grid>
					<Grid size={{xs: 12, md: 8}}>
						<Skeleton variant="rectangular" height={500} sx={{borderRadius: 4}} />
					</Grid>
				</Grid>
			</Stack>
		);
	}

	const statusColor = user?.document_verification_status === 1 ? "success" : user?.document_verification_status === 2 ? "warning" : user?.document_verification_status === 0 ? "error" : "default";

	return (
		<Stack spacing={4}>
			{/* Page Header */}
			<Stack
				spacing={2}
				direction={{xs: "column", md: "row"}}
				sx={{
					justifyContent: "space-between",
					alignItems: {xs: "flex-start", md: "center"},
				}}>
				<Box>
					<Typography variant="h4" fontWeight="800" color="text.primary" gutterBottom>
						Verification Review: {user?.name || `User #${userId}`}
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						Review the submitted identity documents and finalize the KYC decision.
					</Typography>
				</Box>

				<Stack direction="row" spacing={1.5}>
					<Button color="primary" variant="outlined" startIcon={<Iconify icon="eva:arrow-back-fill" />} onClick={() => navigate(-1)}>
						Back
					</Button>
					{(hasPermission("verify_kyc") || hasPermission("manage_verification")) && (
						<Button color="primary" variant="contained" startIcon={<Iconify icon="solar:settings-bold" />} onClick={(e) => setActionAnchorEl(e.currentTarget)}>
							Admin Actions
						</Button>
					)}
					<Menu
						anchorEl={actionAnchorEl}
						open={Boolean(actionAnchorEl)}
						onClose={() => setActionAnchorEl(null)}
						PaperProps={{
							sx: {
								width: 220,
								borderRadius: 2,
								mt: 1,
								boxShadow: "0px 5px 20px rgba(0,0,0,0.1)",
							},
						}}>
						<MenuItem onClick={() => handleAction("Approve")} sx={{color: "success.main"}}>
							<Iconify icon="solar:check-circle-bold" sx={{mr: 2}} /> Approve Verification
						</MenuItem>
						<MenuItem
							onClick={(e) => {
								setActionAnchorEl(null);
								setRejectAnchorEl(e.currentTarget);
							}}
							sx={{color: "error.main"}}>
							<Iconify icon="solar:close-circle-bold" sx={{mr: 2}} /> Reject Verification
						</MenuItem>
						<MenuItem onClick={() => handleAction("Request Retry")}>
							<Iconify icon="solar:refresh-circle-bold" sx={{mr: 2}} /> Request Retry
						</MenuItem>
						<Divider />

						<MenuItem onClick={() => handleAction("Ban User")} sx={{color: "error.main"}}>
							<Iconify icon="solar:shield-cross-bold" sx={{mr: 2}} /> Ban User
						</MenuItem>
					</Menu>

					{/* Reject Reasons Submenu */}
					<Menu anchorEl={rejectAnchorEl} open={Boolean(rejectAnchorEl)} onClose={() => setRejectAnchorEl(null)} PaperProps={{sx: {width: 200, borderRadius: 2, mt: 1}}}>
						<MenuItem disabled>
							<Typography variant="caption" fontWeight="bold">
								REJECT REASON
							</Typography>
						</MenuItem>
						<MenuItem onClick={() => handleReject("Blurry Document")}>Blurry Document</MenuItem>
						<MenuItem onClick={() => handleReject("Invalid Document")}>Invalid Document</MenuItem>
						<MenuItem onClick={() => handleReject("Face Mismatch")}>Face Mismatch</MenuItem>
						<MenuItem onClick={() => handleReject("Fake Document")}>Fake Document</MenuItem>
						<MenuItem onClick={() => handleReject("Underage User")}>Underage User</MenuItem>
						<MenuItem onClick={() => handleReject("Other")}>Other...</MenuItem>
					</Menu>
				</Stack>
			</Stack>

			<Grid container spacing={3}>
				{/* Left Sidebar Info */}
				<Grid size={{xs: 12, md: 4}}>
					<Stack spacing={3}>
						<Card sx={{p: 3}}>
							<Typography variant="subtitle1" fontWeight="800" sx={{mb: 2}}>
								User Information
							</Typography>
							<Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
								<Avatar src={user?.photos[0]?.file_name} sx={{width: 64, height: 64}} variant="rounded">
									{user?.name?.charAt(0)}
								</Avatar>
								<Box>
									<Typography variant="h6" fontWeight="700">
										{user?.name || "Unknown"}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{user?.dob ? `${fAge(user?.dob)} yrs` : "N/A"} • {user?.gender?.name || "N/A"}
									</Typography>
								</Box>
							</Stack>
							<Divider sx={{my: 2}} />
							<Stack spacing={1.5}>
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">
										Email
									</Typography>
									<Typography variant="subtitle2" fontWeight="600">
										{user?.email || "N/A"}
									</Typography>
								</Stack>
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">
										Phone
									</Typography>
									<Typography variant="subtitle2" fontWeight="600">
										{user?.phone_number || user?.mobile || "N/A"}
									</Typography>
								</Stack>
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">
										Signup Date
									</Typography>
									<Typography variant="subtitle2" fontWeight="600">
										{fDate(user?.created_date)}
									</Typography>
								</Stack>
							</Stack>
						</Card>

						<Card
							sx={{
								p: 3,
							}}>
							<Typography variant="subtitle1" fontWeight="800" sx={{mb: 2}}>
								Verification Status Detail
							</Typography>
							<Stack spacing={2}>
								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Typography variant="body2" color="text.secondary">
										Verification Status
									</Typography>
									<Chip label={user?.document_verification_status_text || "Unverified"} color={statusColor} size="small" sx={{fontWeight: 800, borderRadius: 1}} />
								</Stack>
								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Typography variant="body2" color="text.secondary">
										Gender Matches
									</Typography>
									<Chip label={user?.gender?.name || "N/A"} color="success" size="small" variant="outlined" sx={{fontWeight: 700}} />
								</Stack>
								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Typography variant="body2" color="text.secondary">
										Account Status
									</Typography>
									<Chip label={user?.status || "Active"} color={user?.status === "active" ? "success" : "error"} size="small" variant="outlined" sx={{fontWeight: 700}} />
								</Stack>
							</Stack>
						</Card>
					</Stack>
				</Grid>

				{/* Right Main Content */}
				<Grid size={{xs: 12, md: 8}}>
					<Stack spacing={3}>
						<Card
							sx={{
								p: 3,
							}}>
							<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 3}}>
								<Typography variant="h6" fontWeight="800">
									Verification Submission
								</Typography>
								<Chip label={user?.document_verification_status_text || "Unverified"} color={statusColor} sx={{fontWeight: 800, borderRadius: 1}} />
							</Stack>
							<Grid container spacing={3}>
								<Grid size={{xs: 12, sm: 6}}>
									<Typography variant="body2" color="text.secondary">
										Document Type
									</Typography>
									<Typography variant="subtitle1" fontWeight="700">
										{user?.kyc_document_type || "Not provided"}
									</Typography>
								</Grid>
								<Grid size={{xs: 12, sm: 6}}>
									<Typography variant="body2" color="text.secondary">
										Last Updated
									</Typography>
									<Typography variant="subtitle1" fontWeight="700">
										{fDate(user?.updated_at)}
									</Typography>
								</Grid>
								<Grid size={{xs: 12, sm: 6}}>
									<Typography variant="body2" color="text.secondary">
										Document Number
									</Typography>
									<Typography variant="subtitle1" fontWeight="700">
										{user?.kyc_document_number || "Not provided"}
									</Typography>
								</Grid>
								<Grid size={{xs: 12, sm: 6}}>
									<Typography variant="body2" color="text.secondary">
										Full Name (Document)
									</Typography>
									<Typography variant="subtitle1" fontWeight="700">
										{orbaoneData?.idDocumentData?.fullName || "Not provided"}
									</Typography>
								</Grid>
								<Grid size={{xs: 12, sm: 6}}>
									<Typography variant="body2" color="text.secondary">
										Face Match Score
									</Typography>
									<Typography variant="subtitle1" fontWeight="700">
										{user?.kyc_face_match_score ? `${user.kyc_face_match_score}%` : "Not provided"}
									</Typography>
								</Grid>
								<Grid size={{xs: 12, sm: 6}}>
									<Typography variant="body2" color="text.secondary">
										Authentication Score
									</Typography>
									<Typography variant="subtitle1" fontWeight="700">
										{user?.kyc_approval_score ? `${user.kyc_approval_score}%` : "Not provided"}
									</Typography>
								</Grid>
							</Grid>
						</Card>

						<Card sx={{p: 3}}>
							<Typography variant="h6" fontWeight="800" sx={{mb: 3}}>
								Document Review
							</Typography>
							<Grid container spacing={3}>
								<Grid size={{xs: 12, sm: 4}}>
									<Typography variant="subtitle2" fontWeight="700" sx={{mb: 1}}>
										Government ID (Front)
									</Typography>
									{user?.kyc_front_photo_url || user?.kyc_front_photo ? (
										<Box
											component="img"
											src={user?.kyc_front_photo_url || user?.kyc_front_photo}
											sx={{
												width: "100%",
												borderRadius: 2,
												height: 200,
												objectFit: "cover",
												border: "1px solid",
												borderColor: "divider",
											}}
										/>
									) : (
										<Box
											sx={{
												p: 4,
												textAlign: "center",
												bgcolor: alpha(theme.palette.text.primary, 0.03),
												borderRadius: 2,
												border: "1px dashed",
												borderColor: "divider",
												height: 200,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}>
											<Typography variant="body2" color="text.secondary" fontWeight={600}>
												No photo uploaded
											</Typography>
										</Box>
									)}
								</Grid>
								<Grid size={{xs: 12, sm: 4}}>
									<Typography variant="subtitle2" fontWeight="700" sx={{mb: 1}}>
										Government ID (Back)
									</Typography>
									{user?.kyc_back_photo || user?.kyc_back_photo_url ? (
										<Box
											component="img"
											src={user?.kyc_back_photo || user?.kyc_back_photo_url}
											sx={{
												width: "100%",
												borderRadius: 2,
												height: 200,
												objectFit: "cover",
												border: "1px solid",
												borderColor: "divider",
											}}
										/>
									) : (
										<Box
											sx={{
												p: 4,
												textAlign: "center",
												bgcolor: alpha(theme.palette.text.primary, 0.03),
												borderRadius: 2,
												border: "1px dashed",
												borderColor: "divider",
												height: 200,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}>
											<Typography variant="body2" color="text.secondary" fontWeight={600}>
												No photo uploaded
											</Typography>
										</Box>
									)}
								</Grid>
								<Grid size={{xs: 12, sm: 4}}>
									<Typography variant="subtitle2" fontWeight="700" sx={{mb: 1}}>
										Profile Photo (Reference)
									</Typography>
									{user?.kyc_selfie_photo || user?.kyc_selfie_photo_url ? (
										<Box
											component="img"
											src={user?.kyc_selfie_photo || user?.kyc_selfie_photo_url}
											sx={{
												width: "100%",
												borderRadius: 2,
												height: 200,
												objectFit: "cover",
												border: "1px solid",
												borderColor: "divider",
											}}
										/>
									) : (
										<Box
											sx={{
												p: 4,
												textAlign: "center",
												bgcolor: alpha(theme.palette.text.primary, 0.03),
												borderRadius: 2,
												border: "1px dashed",
												borderColor: "divider",
												height: 200,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}>
											<Typography variant="body2" color="text.secondary" fontWeight={600}>
												No profile photo
											</Typography>
										</Box>
									)}
								</Grid>
							</Grid>

							<Box
								sx={{
									mt: 3,
									p: 2,
									bgcolor: alpha(theme.palette.primary.main, 0.05),
									borderRadius: 2,
								}}>
								<Typography variant="subtitle2" fontWeight="700" color="primary.main" sx={{mb: 1}}>
									Document Validation Info
								</Typography>
								<Typography variant="body2">
									Please review and compare the user's profile photo (reference) against the government ID front photo for consistency. Make sure name, age, and demographics match before approval.
								</Typography>
							</Box>

							{(hasPermission("verify_kyc") || hasPermission("manage_verification")) && (
								<Stack direction="row" spacing={1.5} justifyContent="flex-end" mt={2}>
									<Button variant="outlined" color="error" onClick={(e) => setRejectAnchorEl(e.currentTarget)}>
										Reject
									</Button>
									<Button variant="contained" color="success" onClick={() => handleAction("Approve")}>
										Approve
									</Button>
								</Stack>
							)}
						</Card>
					</Stack>
				</Grid>
			</Grid>
		</Stack>
	);
}
