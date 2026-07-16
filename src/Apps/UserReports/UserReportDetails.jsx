import React, {useEffect, useState} from "react";
import {useSearchParams, useNavigate} from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";

import Iconify from "src/components/common/iconify";
import {GetAdminReportDetailsServices, PostAdminReportStatusUpdateServices} from "src/services/Reports.Services";
import {useDispatch} from "react-redux";
import {useHasPermission} from "src/hooks/use-permission";
import {sweetAlerts, sweetAlertSuccess, sweetAlertQuestion} from "src/utils/sweet-alerts";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {fDate, getErrorMessage} from "src/utils/utils";
import {AdminRoutes} from "src/routes/routes";
import {PostAdminUserStatusServices} from "src/services/Users.Services";

const UserCard = ({title, user, onNavigate, onBan}) => (
	<Card
		sx={{
			p: 3,
			borderRadius: 2,
			height: "100%",
			display: "flex",
			flexDirection: "column",
		}}>
		<Typography variant="h6" sx={{fontWeight: 700}} gutterBottom>
			{title}
		</Typography>
		<Divider sx={{mb: 3}} />

		<Stack direction="row" spacing={3} alignItems="center" sx={{mb: 4}}>
			<Avatar src={user.image} sx={{width: 50, height: 50, bgcolor: "primary.main"}} variant="rounded">
				{user?.name?.charAt(0)}
			</Avatar>
			<Box>
				<Typography variant="subtitle1" sx={{fontWeight: 700}}>
					{user?.name || "Unknown"}
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
					{user?.email || "No email"}
				</Typography>
				{user?.status && <Chip label={user.status} size="small" color={user.status === "Active" ? "success" : "warning"} variant="outlined" />}
			</Box>
		</Stack>

		<Box sx={{mt: "auto"}}>
			<Stack spacing={1.5} direction={"row"}>
				<Button
					variant="contained"
					color="primary"
					fullWidth
					endIcon={<Iconify icon="eva:external-link-fill" />}
					onClick={() => {
						if (user?.id && onNavigate) {
							onNavigate(user.id);
						}
					}}>
					View Full Profile
				</Button>
				{onBan && (
					<Button variant="contained" color="error" fullWidth onClick={onBan}>
						Ban User
					</Button>
				)}
			</Stack>
		</Box>
	</Card>
);

const UserReportDetails = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");
	const {hasPermission} = useHasPermission();

	const [reportDetails, setReportDetails] = useState({});

	useEffect(() => {
		function apiCallAction() {
			dispatch(
				GetAdminReportDetailsServices(id, (res) => {
					if (res?.success) {
						setReportDetails(res?.data || {});
					}
				}),
			);
		}
		if (id) {
			apiCallAction();
		}
	}, [dispatch, id]);

	const handleStatusChange = (newStatus) => {
		sweetAlertQuestion(`Are you sure you want to change report status to ${newStatus}?`, "Change Status?").then((result) => {
			if (result) {
				dispatch(
					PostAdminReportStatusUpdateServices(id, {status: newStatus}, (res) => {
						if (res?.success) {
							setReportDetails((prev) => ({...prev, status: newStatus}));
							sweetAlertSuccess("Report status updated successfully");
						} else {
							sweetAlerts("error", res?.message || "Failed to update status");
						}
					}),
				);
			}
		});
	};

	const handleBanUser = () => {
		const userId = reportedUser?.id;
		if (!userId) return;

		sweetAlertQuestion("Are you sure you want to ban this user?", "Confirm Ban").then((result) => {
			if (result) {
				dispatch(
					PostAdminUserStatusServices(userId, {status: "banned"}, (res) => {
						if (res?.success) {
							sweetAlertSuccess("User banned successfully");
							dispatch(
								GetAdminReportDetailsServices(id, (resData) => {
									if (resData?.success) {
										setReportDetails(resData?.data || {});
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

	const reporter = reportDetails?.reporter_user || {};
	const reportedUser = reportDetails?.reported_user || {};

	return (
		<Stack spacing={3}>
			{/* Header */}
			<Stack spacing={2} direction="row" sx={{justifyContent: "space-between", alignItems: "flex-start"}}>
				<Box>
					<Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
						Report Details
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						Review details of the report and the users involved.
					</Typography>
				</Box>

				<Button color="primary" variant="outlined" startIcon={<Iconify icon="eva:arrow-back-fill" />} onClick={() => navigate(-1)}>
					Back
				</Button>
			</Stack>

			{/* Main Report Info */}
			<Card sx={{p: 3, borderRadius: 2}}>
				<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
					<Typography variant="h6" sx={{fontWeight: 700}}>
						Report Information
					</Typography>
					{reportDetails?.status && (
						<Select
							size="small"
							value={reportDetails?.status?.toLowerCase() || "pending"}
							disabled={!hasPermission("resolve_reports") && !hasPermission("manage_reports")}
							onChange={(e) => handleStatusChange(e.target.value)}
							sx={{
								height: 30,
								fontSize: "0.75rem",
								fontWeight: 800,
								color: reportDetails?.status?.toLowerCase() === "resolved" ? "success.main" : reportDetails?.status?.toLowerCase() === "dismissed" ? "text.secondary" : "warning.main",
								"& .MuiOutlinedInput-notchedOutline": {
									borderColor: reportDetails?.status?.toLowerCase() === "resolved" ? "success.main" : reportDetails?.status?.toLowerCase() === "dismissed" ? "text.secondary" : "warning.main",
								},
								"&:hover .MuiOutlinedInput-notchedOutline": {
									borderColor: reportDetails?.status?.toLowerCase() === "resolved" ? "success.main" : reportDetails?.status?.toLowerCase() === "dismissed" ? "text.secondary" : "warning.main",
								},
								"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
									borderColor: reportDetails?.status?.toLowerCase() === "resolved" ? "success.main" : reportDetails?.status?.toLowerCase() === "dismissed" ? "text.secondary" : "warning.main",
								},
								"& .MuiSelect-icon": {
									color: reportDetails?.status?.toLowerCase() === "resolved" ? "success.main" : reportDetails?.status?.toLowerCase() === "dismissed" ? "text.secondary" : "warning.main",
								},
							}}>
							<MenuItem value="pending">Pending</MenuItem>
							<MenuItem value="resolved">Resolved</MenuItem>
							<MenuItem value="dismissed">Dismissed</MenuItem>
						</Select>
					)}
				</Stack>

				<Divider sx={{mb: 3}} />

				<Grid container spacing={3}>
					<Grid size={{xs: 12, md: 4}}>
						<Typography
							variant="caption"
							sx={{
								color: "text.secondary",
								fontWeight: 700,
								display: "block",
								mb: 0.5,
							}}>
							Reason
						</Typography>
						<Typography variant="subtitle1" sx={{fontWeight: 600}}>
							{reportDetails?.report_type || "Unknown Reason"}
						</Typography>
					</Grid>
					<Grid size={{xs: 12, md: 4}}>
						<Typography
							variant="caption"
							sx={{
								color: "text.secondary",
								fontWeight: 700,
								display: "block",
								mb: 0.5,
							}}>
							Date Submitted
						</Typography>
						<Typography variant="subtitle1" sx={{fontWeight: 600}}>
							{fDate(reportDetails?.created_at)}
						</Typography>
					</Grid>
					<Grid size={{xs: 12}}>
						<Typography
							variant="caption"
							sx={{
								color: "text.secondary",
								fontWeight: 700,
								display: "block",
								mb: 0.5,
							}}>
							Description
						</Typography>
						<Typography variant="body2">{reportDetails?.details || "No description provided."}</Typography>
					</Grid>
				</Grid>

				{reportDetails?.status !== "dismissed" && (hasPermission("resolve_reports") || hasPermission("manage_reports")) && (
					<Box sx={{mt: 4}}>
						<Button variant="outlined" color="primary" onClick={() => handleStatusChange("dismissed")}>
							Dismiss Report
						</Button>
					</Box>
				)}
			</Card>

			{/* Users Details */}
			<Grid container spacing={3}>
				<Grid size={{xs: 12, md: 6}}>
					<UserCard title="Reporter Details" user={reporter} onNavigate={(userId) => navigate(`${AdminRoutes?.UserDetails}?id=${userId}`)} />
				</Grid>
				<Grid size={{xs: 12, md: 6}}>
					<UserCard
						title="Reported User Details"
						user={reportedUser}
						onNavigate={(userId) => navigate(`${AdminRoutes?.UserDetails}?id=${userId}`)}
						onBan={hasPermission("moderate_users") || hasPermission("manage_users") ? handleBanUser : null}
					/>
				</Grid>
			</Grid>
		</Stack>
	);
};

export default UserReportDetails;
