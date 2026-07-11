import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import {useTheme, alpha} from "@mui/material/styles";
import moment from "moment";

import Iconify from "src/components/common/iconify";
import {fDate, fDateTime} from "src/utils/utils";

const getStatusColor = (status) => {
	switch (status) {
		case 1: // Requested
			return "info";
		case 2: // Accepted
			return "primary";
		case 3: // Completed
			return "success";
		case 4: // Rejected
			return "error";
		default:
			return "secondary";
	}
};

const formatTime = (timeStr) => {
	if (!timeStr) return "";
	return moment(timeStr, "HH:mm:ss").format("hh:mm A");
};

const DatesTab = ({dates = []}) => {
	const theme = useTheme();

	if (!dates || dates.length === 0) {
		return (
			<Card sx={{p: 5, textAlign: "center", borderRadius: 4, border: "1px dashed", borderColor: "divider", boxShadow: "none"}}>
				<Stack alignItems="center" spacing={2}>
					<Box sx={{p: 2, borderRadius: "50%", bgcolor: alpha(theme.palette.text.disabled, 0.1), color: "text.disabled", display: "flex", alignItems: "center", justifyContent: "center"}}>
						<Iconify icon="solar:calendar-date-bold-duotone" width={48} />
					</Box>
					<Box>
						<Typography variant="h6" sx={{fontWeight: 800, mb: 0.5}}>
							No Dates Found
						</Typography>
						<Typography variant="body2" color="text.secondary">
							This user hasn't scheduled any dates yet.
						</Typography>
					</Box>
				</Stack>
			</Card>
		);
	}

	return (
		<Grid container spacing={3}>
			{dates.map((dateItem) => {
				const statusColor = getStatusColor(dateItem.status);
				const statusLabel = dateItem.status_label || "Unknown";
				const isCreator = dateItem.role === "creator";

				return (
					<Grid size={{xs: 12, md: 6}} key={dateItem.id}>
						<Card
							sx={{
								p: 3,
								borderRadius: 4,
								boxShadow: theme.shadows[1],
								position: "relative",
								overflow: "hidden",
								transition: "all 0.3s ease",
								border: "1px solid",
								borderColor: "divider",
								"&:hover": {
									transform: "translateY(-4px)",
									boxShadow: theme.shadows[8],
								},
							}}>
							{/* Background decorative icon */}
							<Iconify
								icon="solar:heart-bold-duotone"
								sx={{
									position: "absolute",
									right: -20,
									bottom: -20,
									width: 130,
									height: 130,
									opacity: 0.03,
									transform: "rotate(-15deg)",
									pointerEvents: "none",
									color: `${statusColor}.main`,
								}}
							/>

							<Stack spacing={2.5} sx={{position: "relative", zIndex: 1}}>
								{/* Header section */}
								<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
									<Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
										<Avatar sx={{bgcolor: alpha(theme.palette[statusColor].main, 0.1), color: `${statusColor}.main`, width: 56, height: 56, borderRadius: 2.5}}>
											<Iconify icon="solar:calendar-date-bold-duotone" width={28} />
										</Avatar>
										<Box>
											<Typography variant="h6" sx={{fontWeight: 800, lineHeight: 1.2}}>
												{dateItem.date_title || "Unnamed Date"}
											</Typography>
											<Typography variant="caption" sx={{color: "text.secondary", fontWeight: 700}}>
												ID: #{dateItem.id}
											</Typography>
										</Box>
									</Box>
									<Chip
										label={statusLabel}
										size="small"
										color={statusColor}
										sx={{
											fontWeight: 800,
											px: 1,
											borderRadius: 1.5,
										}}
									/>
								</Stack>

								<Divider sx={{borderStyle: "dashed"}} />

								{/* Info details */}
								<Grid container spacing={2}>
									<Grid size={{xs: 6}}>
										<Stack direction="row" spacing={1} alignItems="center">
											<Iconify icon="solar:calendar-bold" sx={{color: "text.secondary"}} width={18} />
											<Box>
												<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, display: "block"}}>
													DATE
												</Typography>
												<Typography variant="body2" sx={{fontWeight: 700}}>
													{fDate(dateItem.date)}
												</Typography>
											</Box>
										</Stack>
									</Grid>
									<Grid size={{xs: 6}}>
										<Stack direction="row" spacing={1} alignItems="center">
											<Iconify icon="solar:clock-circle-bold" sx={{color: "text.secondary"}} width={18} />
											<Box>
												<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, display: "block"}}>
													START TIME
												</Typography>
												<Typography variant="body2" sx={{fontWeight: 700}}>
													{formatTime(dateItem.start_time)}
												</Typography>
											</Box>
										</Stack>
									</Grid>
								</Grid>

								<Grid container spacing={2}>
									<Grid size={{xs: 6}}>
										<Stack direction="row" spacing={1} alignItems="center">
											<Iconify icon="solar:user-bold" sx={{color: "text.secondary"}} width={18} />
											<Box>
												<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, display: "block"}}>
													USER ROLE
												</Typography>
												<Chip
													label={isCreator ? "Creator" : "Guest"}
													size="small"
													variant="outlined"
													color={isCreator ? "primary" : "secondary"}
													sx={{
														fontWeight: 700,
														height: 20,
														fontSize: "0.7rem",
													}}
												/>
											</Box>
										</Stack>
									</Grid>
									<Grid size={{xs: 6}}>
										<Stack direction="row" spacing={1} alignItems="center">
											<Iconify icon="solar:calendar-add-bold" sx={{color: "text.secondary"}} width={18} />
											<Box>
												<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, display: "block"}}>
													CREATED AT
												</Typography>
												<Typography variant="body2" sx={{fontWeight: 700}}>
													{fDateTime(dateItem.created_at)}
												</Typography>
											</Box>
										</Stack>
									</Grid>
								</Grid>
							</Stack>
						</Card>
					</Grid>
				);
			})}
		</Grid>
	);
};

export default DatesTab;
