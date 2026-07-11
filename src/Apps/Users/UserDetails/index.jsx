import React, {useEffect, useState} from "react";
import {useSearchParams, useNavigate} from "react-router-dom";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import Iconify from "src/components/common/iconify";
import InterestedTab from "./InterestedTab";
import MatchesTab from "./MatchesTab";
import ProfileTab from "./ProfileTab";
import DatesTab from "./DatesTab";
import PaymentsTab from "./PaymentsTab";
import TimelineTab from "./TimelineTab";
import GiftsTab from "./GiftsTab";
import KycTab from "./KycTab";
import SparkHistoryTab from "./SparkHistoryTab";
import UserNoteModel from "./UserNoteModel";
import UserKycModel from "./UserKycModel";
import {useDispatch} from "react-redux";
import {GetAdminUserDetailsServices, GetAdminUserStatusesServices, PostAdminUserKycStatusServices, PostAdminUserStatusServices} from "src/services/Users.Services";
import {sweetAlertQuestion, sweetAlertSuccess, sweetAlerts} from "src/utils/sweet-alerts";
import {fDuration, getErrorMessage} from "src/utils/utils";
import {alpha} from "@mui/material";

const UserDetails = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");

	const [currentTab, setCurrentTab] = useState("profile");
	const [actionAnchorEl, setActionAnchorEl] = useState(null);

	const [kycDialogOpen, setKycDialogOpen] = useState(false);
	const [noteModelOpen, setNoteModelOpen] = useState(false);

	const [statuses, setStatuses] = useState([]);

	const handleTabChange = (event, newValue) => {
		setCurrentTab(newValue);
	};

	const [user, setUser] = useState({});

	useEffect(() => {
		function apiCallAction() {
			dispatch(
				GetAdminUserDetailsServices(id, (res) => {
					if (res?.success) {
						setUser(res?.data?.user || {});
					}
				}),
			);
		}
		if (id) {
			apiCallAction();
		}
	}, [dispatch, id]);

	useEffect(() => {
		function apiCallAction() {
			dispatch(
				GetAdminUserStatusesServices((res) => {
					if (res?.success) {
						setStatuses(res?.data?.statuses);
					}
				}),
			);
		}
		apiCallAction();
	}, [dispatch]);

	const educationWork = [user?.education_work?.job_title, user?.education_work?.company, user?.education_work?.school].filter(Boolean).join(" • ");
	const userImage = user?.photos?.length > 0 ? user.photos[0].file_name : "";

	const handleAdminAction = (actionName) => {
		setActionAnchorEl(null);
		if (actionName === "Update Verification") {
			setKycDialogOpen(true);
			return;
		}
		if (actionName === "Add Internal Note") {
			setNoteModelOpen(true);
			return;
		}

		sweetAlertQuestion(`Are you sure you want to ${actionName.toLowerCase()} this user?`, `Confirm ${actionName}`).then((result) => {
			if (result) {
				// Execute action logic
			}
		});
	};

	const handleAccountStatusChange = (newStatus) => {
		sweetAlertQuestion(`Are you sure you want to change user status to ${newStatus}?`, "Change Status?").then((result) => {
			if (result) {
				dispatch(
					PostAdminUserStatusServices(id, {status: newStatus}, (res) => {
						if (res?.success) {
							sweetAlertSuccess("Status updated successfully");
							dispatch(
								GetAdminUserDetailsServices(id, (resData) => {
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

	return (
		<Stack spacing={2}>
			{/* Page Header */}
			<Stack spacing={2} direction={{xs: "column", md: "row"}} sx={{justifyContent: "space-between", alignItems: {xs: "flex-start", md: "center"}}}>
				<Box>
					<Typography variant="h4" fontWeight="800" color="text.primary" gutterBottom>
						User Profile Details
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						View and manage {user?.name || "User"}'s account, verification, and history.
					</Typography>
				</Box>

				<Stack direction="row" spacing={1.5}>
					<Button color="primary" variant="outlined" startIcon={<Iconify icon="eva:arrow-back-fill" />} sx={{mb: 1, ml: -1}} onClick={() => navigate(-1)}>
						Back
					</Button>
					<Button color="primary" variant="contained" startIcon={<Iconify icon="solar:settings-bold" />} sx={{borderRadius: 8}} onClick={(e) => setActionAnchorEl(e.currentTarget)}>
						Admin Actions
					</Button>
					<Menu
						anchorEl={actionAnchorEl}
						open={Boolean(actionAnchorEl)}
						onClose={() => setActionAnchorEl(null)}
						PaperProps={{sx: {width: 220, borderRadius: 2, mt: 1, boxShadow: "0px 5px 20px rgba(0,0,0,0.1)"}}}>
						<MenuItem onClick={() => handleAccountStatusChange("freeze")} sx={{color: "info.main"}}>
							<Iconify icon="solar:snowflake-bold" sx={{mr: 2}} /> Freeze Account
						</MenuItem>
						<MenuItem onClick={() => handleAdminAction("Update Verification")}>
							<Iconify icon="solar:shield-check-bold" sx={{mr: 2}} /> Update Verification
						</MenuItem>
						<MenuItem onClick={() => handleAdminAction("Add Internal Note")}>
							<Iconify icon="solar:document-add-bold" sx={{mr: 2}} /> Add Note
						</MenuItem>
						<Divider />
						<MenuItem onClick={() => handleAccountStatusChange("suspended")} sx={{color: "warning.main"}}>
							<Iconify icon="solar:pause-circle-bold" sx={{mr: 2}} /> Suspend Account
						</MenuItem>
						<MenuItem onClick={() => handleAccountStatusChange("banned")} sx={{color: "error.main"}}>
							<Iconify icon="solar:danger-circle-bold" sx={{mr: 2}} /> Ban User
						</MenuItem>
					</Menu>
				</Stack>
			</Stack>

			{/* Summary KPI Widgets */}
			<Grid container spacing={3}>
				{[
					{title: "Completed Dates", value: user?.completed_dates_count || 0, icon: "solar:calendar-date-bold", color: "success.main"},
					{title: "Total Spark", value: user?.total_spark || 0, icon: "solar:star-fall-bold", color: "warning.main"},
					{title: "Reliability Score", value: user?.reliability_score || user?.reliability_label || "N/A", icon: "solar:heart-pulse-bold", color: "primary.main"},
					{title: "Safety Reports", value: user?.safety_reports_count || 0, icon: "solar:shield-warning-bold", color: "error.main"},
				].map((kpi, idx) => (
					<Grid size={{xs: 12, sm: 6, md: 3}} key={idx}>
						<Card sx={{p: 2, border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 2}}>
							<Box sx={{width: 48, height: 48, borderRadius: 2, bgcolor: `${kpi.color}15`, color: kpi.color, display: "flex", alignItems: "center", justifyContent: "center"}}>
								<Iconify icon={kpi.icon} width={24} />
							</Box>
							<Box>
								<Typography variant="h5" fontWeight="800">
									{kpi.value}
								</Typography>
								<Typography variant="body2" color="text.secondary" fontWeight="600">
									{kpi.title}
								</Typography>
							</Box>
						</Card>
					</Grid>
				))}
			</Grid>

			<Grid container spacing={3}>
				{/* Left Sidebar Profile Info */}
				<Grid size={{xs: 12, sm: 6, md: 4}}>
					<Card sx={{mb: 3, position: "relative", textAlign: "center", borderRadius: 4, overflow: "hidden", boxShadow: "0 5px 25px rgba(0,0,0,0.05)", border: "none"}}>
						<Box
							sx={{
								height: 140,
								position: "relative",
								backgroundImage: "url(https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?q=80&w=2000)",
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}
						/>
						<Avatar
							src={userImage}
							sx={{
								width: 120,
								height: 120,
								border: "4px solid #fff",
								margin: "-60px auto 0",
								position: "relative",
								zIndex: 1,
								boxShadow: 3,
							}}
						/>
						<Box sx={{p: 3, pt: 2}}>
							<Typography variant="h5" sx={{fontWeight: "800", mb: 0.5}}>
								{user?.name || ""}
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{mb: 2, fontWeight: 500}}>
								{user?.email || ""} • {user?.mobile || ""}
							</Typography>
							<Typography variant="body2" sx={{mb: 3, px: 2}}>
								{educationWork || ""}
							</Typography>

							<Stack spacing={1.5} sx={{textAlign: "left", bgcolor: "background.default", p: 2, borderRadius: 2}}>
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">
										Verification
									</Typography>
									<Chip label={user?.document_verification_status_text} color="success" />
								</Stack>
								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Typography variant="body2" color="text.secondary">
										Status
									</Typography>
									<Select
										size="small"
										value={user?.status?.toLowerCase() === "frozen" ? "freeze" : user?.status?.toLowerCase() || "active"}
										onChange={(e) => handleAccountStatusChange(e.target.value)}
										sx={{
											height: 28,
											fontSize: "0.75rem",
											fontWeight: 700,
											"& .MuiOutlinedInput-notchedOutline": {border: "none"},
											bgcolor: (theme) => {
												const st = user?.status?.toLowerCase();
												return alpha(
													st === "frozen" || st === "freeze" ? theme.palette.info.main : st === "suspended" ? theme.palette.warning.main : st === "banned" ? theme.palette.error.main : theme.palette.success.main,
													0.1,
												);
											},
											color: () => {
												const st = user?.status?.toLowerCase();
												return st === "frozen" || st === "freeze" ? "info.main" : st === "suspended" ? "warning.main" : st === "banned" ? "error.main" : "success.main";
											},
											borderRadius: 1,
										}}>
										{statuses?.map((status) => (
											<MenuItem value={status?.id}>{status?.name}</MenuItem>
										))}
									</Select>
								</Stack>
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">
										Subscription
									</Typography>
									<Typography variant="subtitle2" fontWeight="700" color="warning.main">
										Premium
									</Typography>
								</Stack>
								{/* <Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">
										Total Spark
									</Typography>
									<Typography variant="subtitle2" fontWeight="700" color="primary.main">
										{user?.total_spark || 0}
									</Typography>
								</Stack> */}
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">
										Last Active
									</Typography>
									<Typography variant="subtitle2" fontWeight="700">
										{fDuration(user.last_logged_in)}
									</Typography>
								</Stack>
							</Stack>
						</Box>
					</Card>

					<Card sx={{p: 3, borderRadius: 4, boxShadow: "0 5px 25px rgba(0,0,0,0.05)", border: "none"}}>
						<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 2}}>
							<Typography variant="subtitle1" sx={{fontWeight: "bold"}}>
								Photos ({user?.photos?.length || 0})
							</Typography>
							<Typography variant="body2" color="primary" sx={{cursor: "pointer", fontWeight: 700}}>
								View All
							</Typography>
						</Stack>
						{user?.photos?.length > 0 ? (
							<Box
								sx={{
									display: "grid",
									gap: 1,
									gridTemplateColumns: user.photos.length === 1 ? "1fr" : "repeat(2, 1fr)",
									gridTemplateRows: "repeat(2, 120px)",
								}}>
								{user.photos.slice(0, 3).map((p, i) => (
									<Box key={i} sx={{position: "relative", gridRow: (i === 0 && user.photos.length > 2) || user.photos.length <= 2 ? "span 2" : "span 1"}}>
										<Box
											component="img"
											src={p.file_name}
											sx={{
												width: "100%",
												height: "100%",
												borderRadius: 2,
												objectFit: "cover",
												display: "block",
											}}
										/>
										{i === 2 && user.photos.length > 3 && (
											<Box
												sx={{
													position: "absolute",
													inset: 0,
													bgcolor: "rgba(0,0,0,0.6)",
													borderRadius: 2,
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													color: "common.white",
													cursor: "pointer",
													transition: "all 0.2s",
													"&:hover": {bgcolor: "rgba(0,0,0,0.7)"},
												}}>
												<Typography variant="h6" fontWeight="bold">
													+{user.photos.length - 3}
												</Typography>
											</Box>
										)}
									</Box>
								))}
							</Box>
						) : (
							<Typography variant="body2" sx={{textAlign: "center", color: "text.secondary", py: 3, fontStyle: "italic"}}>
								No photos uploaded
							</Typography>
						)}
					</Card>
				</Grid>

				{/* Right Main Content area */}
				<Grid size={{xs: 12, sm: 6, md: 8}}>
					<Stack spacing={3}>
						<Card sx={{p: 1, borderRadius: 4, boxShadow: "0 5px 25px rgba(0,0,0,0.03)", border: "1px solid", borderColor: "divider"}}>
							<Tabs
								value={currentTab}
								onChange={handleTabChange}
								variant="scrollable"
								scrollButtons="auto"
								sx={{
									"& .MuiTab-root": {fontWeight: 600, textTransform: "none"},
									// "& .Mui-selected": {color: "primary.main"},
								}}>
								<Tab label="Profile" value="profile" icon={<Iconify icon="solar:user-bold" width={20} />} iconPosition="start" />
								<Tab label="KYC" value="kyc" icon={<Iconify icon="solar:shield-check-bold" width={20} />} iconPosition="start" />

								{/* <Tab label="Timeline" value="timeline" icon={<Iconify icon="solar:history-bold" width={20} />} iconPosition="start" /> */}
								<Tab label="Dates" value="dates" icon={<Iconify icon="solar:calendar-date-bold" width={20} />} iconPosition="start" />
								<Tab label="Payments" value="payments" icon={<Iconify icon="solar:wallet-money-bold" width={20} />} iconPosition="start" />
								{/* <Tab label="Interested" value="interested" icon={<Iconify icon="solar:heart-angle-bold" width={20} />} iconPosition="start" /> */}
								{/* <Tab label="Matches" value="matches" icon={<Iconify icon="solar:users-group-two-rounded-bold" width={20} />} iconPosition="start" /> */}
								<Tab label="Spark History" value="spark_history" icon={<Iconify icon="solar:star-fall-bold" width={20} />} iconPosition="start" />
							</Tabs>
						</Card>

						{currentTab === "profile" && <ProfileTab user={user} />}
						{currentTab === "timeline" && <TimelineTab />}
						{currentTab === "dates" && <DatesTab dates={user?.dates} />}
						{currentTab === "payments" && <PaymentsTab payments={user?.payments} />}
						{currentTab === "interested" && <InterestedTab />}
						{currentTab === "matches" && <MatchesTab />}
						{currentTab === "spark_history" && <SparkHistoryTab user={user} />}
						{currentTab === "kyc" && <KycTab user={user} setUser={setUser} />}
					</Stack>
				</Grid>
			</Grid>

			{kycDialogOpen && (
				<UserKycModel
					open={kycDialogOpen}
					onClose={() => setKycDialogOpen(false)}
					userId={id}
					currentStatus={user?.document_verification_status ?? 1}
					cdSuccess={() => {
						dispatch(
							GetAdminUserDetailsServices(id, (resData) => {
								if (resData?.success) {
									setUser(resData?.data?.user || {});
								}
							}),
						);
					}}
				/>
			)}
			{noteModelOpen && <UserNoteModel open={noteModelOpen} onClose={() => setNoteModelOpen(false)} userId={id} />}
		</Stack>
	);
};

export default UserDetails;
