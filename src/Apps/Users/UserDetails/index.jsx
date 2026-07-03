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

import Typography from "@mui/material/Typography";

import Iconify from "src/components/common/iconify";
import InterestedTab from "./InterestedTab";
import MatchesTab from "./MatchesTab";
import ProfileTab from "./ProfileTab";
import DatesTab from "./DatesTab";
import PaymentsTab from "./PaymentsTab";
import GiftsTab from "./GiftsTab";
import {useDispatch} from "react-redux";
import {GetAdminUserDetailsServices} from "src/services/Users.Services";

const UserDetails = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");

	const [currentTab, setCurrentTab] = useState("profile");

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

	return (
		<Stack spacing={2}>
			<Stack spacing={2} direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
				<Box>
					<Typography variant="h4" color="text.primary">
						User Profile Details
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						View all comprehensive details about the user's dating profile.
					</Typography>
				</Box>

				<Box>
					<Button color="primary" variant="outlined" startIcon={<Iconify icon="eva:arrow-back-fill" />} onClick={() => navigate(-1)}>
						Back
					</Button>
				</Box>
			</Stack>

			<Grid container spacing={2}>
				<Grid size={{xs: 12, md: 4}}>
					<Card sx={{mb: 3, position: "relative", textAlign: "center"}}>
						<Box
							sx={{
								height: 120,
								position: "relative",
								backgroundImage: "url(https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?q=80&w=2000)",
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}
						/>
						<Avatar
							src={userImage}
							sx={{
								width: 100,
								height: 100,
								border: "4px solid #fff",
								margin: "-50px auto 0",
								position: "relative",
								zIndex: 1,
								boxShadow: 3,
							}}
						/>
						<Box sx={{p: 3, pt: 2}}>
							<Typography variant="h5" sx={{fontWeight: "bold", mb: 0.5}}>
								{user?.name}
							</Typography>
							<Typography variant="body2" sx={{mb: 0.5}}>
								{user?.email}
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
								{educationWork || "No education/work provided"}
							</Typography>
							<Stack direction="row" spacing={1} justifyContent="center">
								<Chip label={user?.is_admin ? "Admin" : "Active"} color="success" size="small" variant="outlined" />
								<Chip label={`Rate: ${user?.average_rating || 0}/5`} color="primary" size="small" variant="outlined" />
							</Stack>
						</Box>
					</Card>

					<Card sx={{p: 2}}>
						<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 2}}>
							<Typography variant="subtitle1" sx={{fontWeight: "bold"}}>
								Uploads
							</Typography>
							<Typography variant="body2" color="primary" sx={{cursor: "pointer"}}>
								View All
							</Typography>
						</Stack>
						<Grid container spacing={1}>
							{(user?.photos?.length > 0 ? user.photos.slice(0, 3).map((p) => p.file_name) : []).map((img, i) => (
								<Grid size={{xs: 4}} key={i}>
									<Box component="img" src={img} sx={{width: "100%", borderRadius: 1, objectFit: "cover", aspectRatio: "1/1", display: "block"}} />
								</Grid>
							))}
						</Grid>
					</Card>
				</Grid>
				<Grid size={{xs: 12, md: 8}}>
					<Stack spacing={2}>
						<Box sx={{display: "flex", justifyContent: "center", alignItems: "flex-end"}}>
							<Tabs value={currentTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
								<Tab label="Profile" value="profile" disableRipple icon={<Iconify icon="gridicons:user" width={20} />} iconPosition="start" />
								<Tab label="Interested" value="interested" disableRipple icon={<Iconify icon="icon-park-solid:like" width={16} />} iconPosition="start" />
								<Tab label="Matches" value="matches" disableRipple icon={<Iconify icon="heroicons-solid:duplicate" width={20} />} iconPosition="start" />
								<Tab label="Dates" value="dates" disableRipple icon={<Iconify icon="basil:calendar-solid" width={20} />} iconPosition="start" />
								<Tab label="Payments" value="payments" disableRipple icon={<Iconify icon="fa7-solid:money-check-alt" width={20} />} iconPosition="start" />
								<Tab label="Gifts" value="gifts" disableRipple icon={<Iconify icon="solar:gift-bold" width={20} />} iconPosition="start" />
							</Tabs>
						</Box>
						{currentTab === "profile" && <ProfileTab user={user} />}
						{currentTab === "interested" && <InterestedTab />}
						{currentTab === "matches" && <MatchesTab />}
						{currentTab === "dates" && <DatesTab />}
						{currentTab === "payments" && <PaymentsTab />}
						{currentTab === "gifts" && <GiftsTab />}
					</Stack>
				</Grid>
			</Grid>
		</Stack>
	);
};

export default UserDetails;
