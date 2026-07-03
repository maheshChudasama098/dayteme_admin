import React, { useEffect, useState } from "react";
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
import { GetAdminReportDetailsServices } from "src/services/Reports.Services";
import { useDispatch } from "react-redux";

const UserReportDetails = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");

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

	const reporter = reportDetails?.reporter_user || {};
	const reportedUser = reportDetails?.reported_user || {};

	const UserCard = ({title, user}) => (
		<Card sx={{p: 3, borderRadius: 2, height: "100%", display: "flex", flexDirection: "column"}}>
			<Typography variant="h6" sx={{fontWeight: 700}} gutterBottom>
				{title}
			</Typography>
			<Divider sx={{mb: 3}} />

			<Stack direction="row" spacing={3} alignItems="center" sx={{mb: 4}}>
				<Avatar src={user.avatar} sx={{width: 50, height: 50, bgcolor: "primary.main"}}>
					{user?.name?.charAt(0)}
				</Avatar>
				<Box>
					<Typography variant="subtitle1" sx={{fontWeight: 700}}>
						{user?.name || "Unknown"}
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
						{user?.email || "No email"}
					</Typography>
					{user?.status && (
						<Chip label={user.status} size="small" color={user.status === "Active" ? "success" : "warning"} variant="outlined" />
					)}
				</Box>
			</Stack>

			<Box sx={{mt: "auto"}}>
				<Button variant="contained" color="primary" fullWidth endIcon={<Iconify icon="eva:external-link-fill" />}>
					View Full Profile
				</Button>
			</Box>
		</Card>
	);

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
					{reportDetails?.status && <Chip label={reportDetails.status} color="warning" />}
				</Stack>

				<Divider sx={{mb: 3}} />

				<Grid container spacing={3}>
					<Grid size={{xs: 12, md: 4}}>
						<Typography variant="caption" sx={{color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5}}>
							Reason
						</Typography>
						<Typography variant="subtitle1" sx={{fontWeight: 600}}>
							{reportDetails?.report_type || "Unknown Reason"}
						</Typography>
					</Grid>
					<Grid size={{xs: 12, md: 4}}>
						<Typography variant="caption" sx={{color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5}}>
							Date Submitted
						</Typography>
						<Typography variant="subtitle1" sx={{fontWeight: 600}}>
							{reportDetails?.created_at ? new Date(reportDetails.created_at).toLocaleDateString() : "Unknown Date"}
						</Typography>
					</Grid>
					<Grid size={{xs: 12}}>
						<Typography variant="caption" sx={{color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5}}>
							Description
						</Typography>
						<Typography variant="body2">{reportDetails?.details || "No description provided."}</Typography>
					</Grid>
				</Grid>

				<Box sx={{mt: 4}}>
					<Stack direction="row" spacing={2}>
						<Button variant="contained" color="error">
							Ban Reported User
						</Button>
						<Button variant="outlined" color="primary">
							Dismiss Report
						</Button>
					</Stack>
				</Box>
			</Card>

			{/* Users Details */}
			<Grid container spacing={3}>
				<Grid size={{xs: 12, md: 6}}>
					<UserCard title="Reporter Details" user={reporter} />
				</Grid>
				<Grid size={{xs: 12, md: 6}}>
					<UserCard title="Reported User Details" user={reportedUser} />
				</Grid>
			</Grid>
		</Stack>
	);
};

export default UserReportDetails;
