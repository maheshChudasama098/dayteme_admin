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

import Typography from "@mui/material/Typography";

import Iconify from "src/components/common/iconify";
import InterestedTab from "./InterestedTab";
import MatchesTab from "./MatchesTab";
import ProfileTab from "./ProfileTab";
import DatesTab from "./DatesTab";
import PaymentsTab from "./PaymentsTab";
import TimelineTab from "./TimelineTab";
import GiftsTab from "./GiftsTab";
import {useDispatch} from "react-redux";
import {GetAdminUserDetailsServices} from "src/services/Users.Services";
import {sweetAlertQuestion} from "src/utils/sweet-alerts";

const UserDetails = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");

	const [currentTab, setCurrentTab] = useState("profile");
	const [actionAnchorEl, setActionAnchorEl] = useState(null);

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

	const educationWork = [user?.education_work?.job_title, user?.education_work?.company, user?.education_work?.school].filter(Boolean).join(" • ");
	const userImage = user?.photos?.length > 0 ? user.photos[0].file_name : "";

	const handleAdminAction = (actionName) => {
		setActionAnchorEl(null);
		sweetAlertQuestion(`Are you sure you want to ${actionName.toLowerCase()} this user?`, `Confirm ${actionName}`).then((result) => {
			if (result) {
				// Execute action logic
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
					<Button color="inherit" variant="outlined" startIcon={<Iconify icon="eva:arrow-back-fill" />} sx={{borderRadius: 8}} onClick={() => navigate(-1)}>
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
						<MenuItem onClick={() => handleAdminAction("Freeze Account")} sx={{color: "info.main"}}>
							<Iconify icon="solar:snowflake-bold" sx={{mr: 2}} /> Freeze Account
						</MenuItem>
						<MenuItem onClick={() => handleAdminAction("Reset Verification")}>
							<Iconify icon="solar:shield-cross-bold" sx={{mr: 2}} /> Reset Verification
						</MenuItem>
						<MenuItem onClick={() => handleAdminAction("Add Internal Note")}>
							<Iconify icon="solar:document-add-bold" sx={{mr: 2}} /> Add Note
						</MenuItem>
						<Divider />
						<MenuItem onClick={() => handleAdminAction("Suspend Account")} sx={{color: "warning.main"}}>
							<Iconify icon="solar:pause-circle-bold" sx={{mr: 2}} /> Suspend Account
						</MenuItem>
						<MenuItem onClick={() => handleAdminAction("Ban User")} sx={{color: "error.main"}}>
							<Iconify icon="solar:danger-circle-bold" sx={{mr: 2}} /> Ban User
						</MenuItem>
					</Menu>
				</Stack>
			</Stack>

			{/* Summary KPI Widgets */}
			<Grid container spacing={3}>
				{[
					{title: "Completed Dates", value: user?.completed_dates || 14, icon: "solar:calendar-date-bold", color: "success.main"},
					{title: "No-Shows", value: user?.no_shows || 1, icon: "solar:ghost-bold", color: "error.main"},
					{title: "Reliability Score", value: user?.reliability_score || "94%", icon: "solar:heart-pulse-bold", color: "primary.main"},
					{title: "Safety Reports", value: user?.reports || 0, icon: "solar:shield-warning-bold", color: "warning.main"},
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
								{user?.name || "Mahesh"}
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{mb: 2, fontWeight: 500}}>
								{user?.email || "mahesh@example.com"} • {user?.phone_number || "+91 9876543210"}
							</Typography>
							<Typography variant="body2" sx={{mb: 3, px: 2}}>
								{educationWork || "Software Engineer • InnovateTech • Mumbai Univ"}
							</Typography>

							<Stack spacing={1.5} sx={{textAlign: "left", bgcolor: "background.default", p: 2, borderRadius: 2}}>
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">
										Verification
									</Typography>
									<Chip label="Fully Verified" color="success" size="small" sx={{fontWeight: 700, height: 20}} />
								</Stack>
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">
										Status
									</Typography>
									<Chip label="Active" color="primary" size="small" sx={{fontWeight: 700, height: 20}} />
								</Stack>
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">
										Subscription
									</Typography>
									<Typography variant="subtitle2" fontWeight="700" color="warning.main">
										Premium
									</Typography>
								</Stack>
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">
										Last Active
									</Typography>
									<Typography variant="subtitle2" fontWeight="700">
										15 mins ago
									</Typography>
								</Stack>
							</Stack>
						</Box>
					</Card>

					<Card sx={{p: 3, borderRadius: 4, boxShadow: "0 5px 25px rgba(0,0,0,0.05)", border: "none"}}>
						<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 2}}>
							<Typography variant="subtitle1" sx={{fontWeight: "bold"}}>
								Photos ({user?.photos?.length || 3})
							</Typography>
							<Typography variant="body2" color="primary" sx={{cursor: "pointer", fontWeight: 700}}>
								View All
							</Typography>
						</Stack>
						<Grid container spacing={1}>
							{(user?.photos?.length > 0 ? user.photos.slice(0, 3).map((p) => p.file_name) : [1, 2, 3]).map((img, i) => (
								<Grid item xs={4} key={i}>
									<Box
										component="img"
										src={typeof img === "string" ? img : "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?q=80"}
										sx={{width: "100%", borderRadius: 2, objectFit: "cover", aspectRatio: "1/1", display: "block"}}
									/>
								</Grid>
							))}
						</Grid>
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
								<Tab label="Timeline" value="timeline" icon={<Iconify icon="solar:history-bold" width={20} />} iconPosition="start" />
								<Tab label="Dates" value="dates" icon={<Iconify icon="solar:calendar-date-bold" width={20} />} iconPosition="start" />
								<Tab label="Payments" value="payments" icon={<Iconify icon="solar:wallet-money-bold" width={20} />} iconPosition="start" />
								<Tab label="Interested" value="interested" icon={<Iconify icon="solar:heart-angle-bold" width={20} />} iconPosition="start" />
								<Tab label="Matches" value="matches" icon={<Iconify icon="solar:users-group-two-rounded-bold" width={20} />} iconPosition="start" />
							</Tabs>
						</Card>

						{currentTab === "profile" && <ProfileTab user={user} />}
						{currentTab === "timeline" && <TimelineTab />}
						{currentTab === "dates" && <DatesTab />}
						{currentTab === "payments" && <PaymentsTab />}
						{currentTab === "interested" && <InterestedTab />}
						{currentTab === "matches" && <MatchesTab />}
					</Stack>
				</Grid>
			</Grid>
		</Stack>
	);
};

export default UserDetails;
