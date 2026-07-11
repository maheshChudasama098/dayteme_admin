import React, {useEffect, useState} from "react";
import {useSearchParams, useNavigate} from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import {useTheme, alpha} from "@mui/material/styles";

import Iconify from "src/components/common/iconify";
import { useDispatch } from "react-redux";
import { GetAdminDateDetailsServices, GetAdminDateRatingsServices, PostAdminDateStatusServices } from "src/services/Dates.Services";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { sweetAlertQuestion, sweetAlerts, sweetAlertSuccess } from "src/utils/sweet-alerts";
import { getErrorMessage } from "src/utils/utils";

const DateDetails = () => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");

	const [datePlan, setDatePlan] = useState({});
	const [ratings, setRatings] = useState([]);
	const [apiFlag, setApiFlag] = useState(false);

	const resolveStatusId = (record) => {
		if (record?.status !== undefined && record?.status !== null) {
			return Number(record.status);
		}
		const text = String(record?.status_text || "").toLowerCase();
		if (text === "completed") return 3;
		if (text === "cancelled") return 7;
		if (text === "active") return 1;
		if (text === "connected") return 2;
		if (text === "draft") return 0;
		return 1;
	};

	const handleStatusChange = (newStatus) => {
		const statusLabel = newStatus === 3 ? "Completed" : "Cancelled";
		sweetAlertQuestion(
			`Are you sure you want to change this date status to ${statusLabel}?`,
			"Change Status?"
		).then((result) => {
			if (result) {
				dispatch(
					PostAdminDateStatusServices(id, {status: Number(newStatus)}, (res) => {
						if (res?.success) {
							setApiFlag((prev) => !prev);
							sweetAlertSuccess(`Status updated to ${statusLabel} successfully`);
						} else {
							sweetAlerts("error", getErrorMessage(res));
						}
					})
				);
			}
		});
	};

	const getStatusColor = (statusId, statusText) => {
		const text = String(statusText || "").toLowerCase();
		if (statusId === 3 || text === "completed") return theme.palette.success.main;
		if (statusId === 7 || text === "cancelled") return theme.palette.error.main;
		if (text === "active") return theme.palette.success.main;
		if (text === "upcoming") return theme.palette.info.main;
		return theme.palette.warning.main;
	};

	useEffect(() => {
		function apiCallAction() {
			dispatch(
				GetAdminDateDetailsServices(id, (res) => {
					if (res?.success) {
						setDatePlan(res?.data?.date_plan || {});
					}
				}),
			);
			dispatch(
				GetAdminDateRatingsServices(id, (res) => {
					if (res?.success) {
						setRatings(res?.data?.ratings || []);
					}
				}),
			);
		}
		if (id) {
			apiCallAction();
		}
	}, [dispatch, id, apiFlag]);

	const host = {
		name: datePlan?.user?.name || "Unknown",
		avatar: "", 
		role: "Creator",
	};
	return (
		<Box>
			{/* Back button */}
			<Button sx={{mb: 3}} startIcon={<Iconify icon="eva:arrow-back-fill" />} onClick={() => navigate(-1)}>
				Back
			</Button>

			{/* Header */}
			<Box mb={4}>
				<Typography variant="h3" fontWeight={800} color="text.primary" gutterBottom>
					Date Details
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Review all information, attendees, and preferences for this date setup.
				</Typography>
			</Box>

			{/* Main Container */}
			<Grid container spacing={3}>
				{/* Left Side: Image & Attendees */}
				<Grid size={{xs: 12, md: 4, lg: 5}}>
					<Stack spacing={3}>
						<Card
							sx={{
								position: "relative",
								borderRadius: 4,
								boxShadow: theme.shadows[2],
								overflow: "hidden",
								minHeight: 320,
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}>
							{/* Boosted Badge */}
							{datePlan?.boost_feed && (
								<Chip
									icon={<Iconify icon="mingcute:fire-fill" width={16} />}
									label="Boosted"
									size="small"
									sx={{
										position: "absolute",
										top: 20,
										left: 20,
										backgroundColor: "#e81c4f",
										color: "#fff",
										fontWeight: 800,
										"& .MuiChip-icon": {color: "#fff"},
									}}
								/>
							)}
						</Card>

						{/* Attendees Card */}
						<Card sx={{p: 3, borderRadius: 4, boxShadow: theme.shadows[1]}}>
							<Typography variant="overline" sx={{color: "text.secondary", fontWeight: 800, display: "block", mb: 2}}>
								ATTENDEES
							</Typography>
							<Stack spacing={2}>
								{/* Host */}
								<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05)}}>
									<Stack direction="row" alignItems="center" spacing={2}>
										<Avatar src={host.avatar} sx={{width: 48, height: 48, border: `2px solid ${theme.palette.primary.main}`, color: "primary.main", bgcolor: alpha(theme.palette.primary.main, 0.2)}}>
											{host.name.charAt(0)}
										</Avatar>
										<Box>
											<Typography variant="subtitle2" sx={{fontWeight: 800}}>
												{host.name}
											</Typography>
											{datePlan?.user?.email && (
												<Typography variant="caption" color="text.secondary" sx={{display: "block", mb: 0.5}}>
													{datePlan.user.email}
												</Typography>
											)}
											<Typography variant="caption" color="primary.main" sx={{fontWeight: 700}}>
												{host.role}
											</Typography>
										</Box>
									</Stack>
									<IconButton size="small" sx={{color: "primary.main"}}>
										<Iconify icon="solar:chat-round-dots-bold-duotone" />
									</IconButton>
								</Stack>
								
								{/* Guest / Reviewers */}
								{ratings.length > 0 && ratings.map((rating) => {
									const reviewer = rating.reviewer_user;
									return (
										<Stack key={rating.id} direction="row" alignItems="center" justifyContent="space-between" sx={{p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.secondary.main, 0.05)}}>
											<Stack direction="row" alignItems="center" spacing={2}>
												<Avatar sx={{width: 48, height: 48, bgcolor: alpha(theme.palette.secondary.main, 0.2), color: "secondary.main"}}>
													{reviewer?.name?.charAt(0) || "G"}
												</Avatar>
												<Box>
													<Typography variant="subtitle2" sx={{fontWeight: 800}}>
														{reviewer?.name || "Unknown"}
													</Typography>
													{reviewer?.email && (
														<Typography variant="caption" color="text.secondary" sx={{display: "block", mb: 0.5}}>
															{reviewer.email}
														</Typography>
													)}
													<Stack direction="row" alignItems="center" spacing={0.5}>
														<Iconify icon="solar:star-bold" width={14} sx={{color: "warning.main"}} />
														<Typography variant="caption" color="secondary.main" sx={{fontWeight: 700}}>
															{rating.average_score}/5 Rating
														</Typography>
													</Stack>
												</Box>
											</Stack>
											<IconButton size="small" sx={{color: "secondary.main"}}>
												<Iconify icon="solar:chat-round-dots-bold-duotone" />
											</IconButton>
										</Stack>
									);
								})}
							</Stack>
						</Card>
					</Stack>
				</Grid>

				{/* Right Side: Details Content */}
				<Grid size={{xs: 12, md: 8, lg: 7}}>
					<Card sx={{p: {xs: 3, md: 4}, borderRadius: 4, boxShadow: theme.shadows[1], height: "100%", display: "flex", flexDirection: "column"}}>
						{/* Header inside content */}
						<Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{mb: 4}}>
							<Box>
								<Typography variant="h4" fontWeight={800} color="text.primary" sx={{mb: 0.5, textTransform: "capitalize"}}>
									{datePlan?.date_title || "Date Setup"}
								</Typography>
								<Stack direction="row" spacing={1.5} alignItems="center" sx={{mt: 0.5}}>
									<Typography variant="body2" color="text.secondary" sx={{fontWeight: 600}}>
										Ref: #{datePlan?.id}
									</Typography>
									<Typography variant="body2" color="text.secondary" sx={{fontWeight: 600}}>
										•
									</Typography>
									<Select
										size="small"
										value={resolveStatusId(datePlan)}
										onChange={(e) => handleStatusChange(e.target.value)}
										sx={{
											height: 26,
											fontSize: "0.75rem",
											fontWeight: 800,
											color: getStatusColor(resolveStatusId(datePlan), datePlan?.status_text),
											bgcolor: alpha(getStatusColor(resolveStatusId(datePlan), datePlan?.status_text), 0.05),
											"& .MuiOutlinedInput-notchedOutline": {borderColor: alpha(getStatusColor(resolveStatusId(datePlan), datePlan?.status_text), 0.3)},
											"&:hover .MuiOutlinedInput-notchedOutline": {borderColor: getStatusColor(resolveStatusId(datePlan), datePlan?.status_text)},
											"&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: getStatusColor(resolveStatusId(datePlan), datePlan?.status_text)},
											"& .MuiSelect-icon": {color: getStatusColor(resolveStatusId(datePlan), datePlan?.status_text)},
											borderRadius: 1,
										}}>
										{resolveStatusId(datePlan) !== 3 && resolveStatusId(datePlan) !== 7 && (
											<MenuItem value={resolveStatusId(datePlan)} disabled>
												{datePlan?.status_text || "Unknown"}
											</MenuItem>
										)}
										<MenuItem value={3} sx={{ fontWeight: 600 }}>Completed</MenuItem>
										<MenuItem value={7} sx={{ fontWeight: 600 }}>Cancelled</MenuItem>
									</Select>
								</Stack>
								{(datePlan?.created_at || datePlan?.updated_at) && (
									<Typography variant="caption" color="text.disabled" sx={{display: "block", mt: 0.5}}>
										Created: {datePlan?.created_at ? new Date(datePlan.created_at).toLocaleString() : ""} | Updated: {datePlan?.updated_at ? new Date(datePlan.updated_at).toLocaleString() : ""}
									</Typography>
								)}
							</Box>
							<Box sx={{p: 1, borderRadius: 2, backgroundColor: alpha("#e81c4f", 0.1), color: "#e81c4f"}}>
								<Iconify icon="ph:tree-evergreen-fill" width={28} />
							</Box>
						</Stack>

						<Divider sx={{borderStyle: "dashed", mb: 4}} />

						{/* Description */}
						{datePlan?.description && (
							<>
								<Box sx={{mb: 4}}>
									<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, display: "block", mb: 1}}>
										DESCRIPTION
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{datePlan.description}
									</Typography>
								</Box>
								<Divider sx={{borderStyle: "dashed", mb: 4}} />
							</>
						)}

						{/* Date & Time & Location */}
						<Grid container spacing={3} sx={{mb: 4}}>
							<Grid size={{xs: 12, sm: 6}}>
								<Stack direction="row" spacing={2} alignItems="flex-start">
									<Box sx={{p: 1, borderRadius: 2, backgroundColor: alpha(theme.palette.primary.main, 0.1), color: "primary.main"}}>
										<Iconify icon="solar:calendar-bold-duotone" width={24} />
									</Box>
									<Box>
										<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, display: "block", mb: 0.5}}>
											SCHEDULE
										</Typography>
										<Typography variant="subtitle2" fontWeight={800} color="text.primary">
											{datePlan?.date ? new Date(datePlan.date).toLocaleDateString() : "TBD"}
										</Typography>
										<Typography variant="body2" color="text.secondary" sx={{fontWeight: 600}}>
											{datePlan?.start_time || ""} {datePlan?.end_time ? `- ${datePlan.end_time}` : ""}
										</Typography>
									</Box>
								</Stack>
							</Grid>
							<Grid size={{xs: 12, sm: 6}}>
								<Stack direction="row" spacing={2} alignItems="flex-start">
									<Box sx={{p: 1, borderRadius: 2, backgroundColor: alpha(theme.palette.error.main, 0.1), color: "error.main"}}>
										<Iconify icon="solar:map-point-bold-duotone" width={24} />
									</Box>
									<Box>
										<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, display: "block", mb: 0.5}}>
											VENUE
										</Typography>
										<Typography variant="subtitle2" fontWeight={800} color="text.primary">
											{datePlan?.address_title || "Unknown"}
										</Typography>
										<Typography variant="body2" color="text.secondary" sx={{fontWeight: 600}}>
											{datePlan?.address || "No address provided"}
										</Typography>
									</Box>
								</Stack>
							</Grid>
						</Grid>

						{/* Date Details & Budget */}
						<Box sx={{p: 2.5, borderRadius: 3, bgcolor: alpha(theme.palette.text.primary, 0.03), mb: 3}}>
							<Typography variant="overline" sx={{color: "text.secondary", fontWeight: 800, display: "block", mb: 1.5}}>
								DATE DETAILS & BUDGET
							</Typography>
							<Stack direction="row" flexWrap="wrap" gap={1}>
								{datePlan?.kind_of_date_enjoy?.map((kind) => (
									<Chip key={kind.id} label={kind.name} sx={{bgcolor: alpha(theme.palette.secondary.main, 0.1), color: "secondary.main", fontWeight: 700, border: "none"}} />
								))}
								{datePlan?.estimated_budget?.name && <Chip label={datePlan.estimated_budget.name} sx={{bgcolor: alpha(theme.palette.background.paper, 0.8), fontWeight: 700, border: "none"}} />}
								{datePlan?.bill_preference?.name && <Chip label={datePlan.bill_preference.name} sx={{bgcolor: alpha(theme.palette.background.paper, 0.8), fontWeight: 700, border: "none"}} />}
								{datePlan?.dress_code?.name && <Chip label={datePlan.dress_code.name} sx={{bgcolor: alpha(theme.palette.background.paper, 0.8), fontWeight: 700, border: "none"}} />}
								{datePlan?.discoverable && (
									<Chip
										icon={<Iconify icon="mdi:eye" width={16} />}
										label="Discoverable"
										sx={{bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", fontWeight: 800, border: "none", "& .MuiChip-icon": {color: "primary.main"}}}
									/>
								)}
								{datePlan?.flexible && (
									<Chip
										icon={<Iconify icon="mdi:clock-fast" width={16} />}
										label="Flexible Time"
										sx={{bgcolor: alpha(theme.palette.info.main, 0.1), color: "info.main", fontWeight: 800, border: "none", "& .MuiChip-icon": {color: "info.main"}}}
									/>
								)}
							</Stack>
						</Box>

						{/* Audience Preferences */}
						<Box sx={{p: 2.5, borderRadius: 3, bgcolor: alpha(theme.palette.text.primary, 0.03)}}>
							<Typography variant="overline" sx={{color: "text.secondary", fontWeight: 800, display: "block", mb: 1.5}}>
								AUDIENCE PREFERENCES
							</Typography>
							<Stack direction="row" flexWrap="wrap" gap={1}>
								<Chip label={datePlan?.gender?.name || "Everyone"} sx={{bgcolor: alpha(theme.palette.background.paper, 0.8), fontWeight: 700, border: "none"}} />
								<Chip label={datePlan?.age_range ? `${datePlan.age_range} yrs` : "Any Age"} sx={{bgcolor: alpha(theme.palette.background.paper, 0.8), fontWeight: 700, border: "none"}} />
							</Stack>
						</Box>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
};

export default DateDetails;
