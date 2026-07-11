import React from "react";
import {useSearchParams} from "react-router-dom";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {useTheme, alpha} from "@mui/material/styles";

import Iconify from "src/components/common/iconify";

const ProfileTab = ({user}) => {
	const theme = useTheme();

	const educationWork = [user?.education_work?.job_title, user?.education_work?.company, user?.education_work?.school].filter(Boolean).join(" • ");
	const likesToDate = user?.who_would_you_like_to_date?.map((w) => w.name).join(", ") || "Unknown";

	const lifestyle = [
		user?.drinks?.name ? `Drinks: ${user.drinks.name}` : null,
		user?.smoking?.name ? `Smoking: ${user.smoking.name}` : null,
		user?.workout?.name ? `Workout: ${user.workout.name}` : null,
		user?.diet?.name ? `Diet: ${user.diet.name}` : null,
	].filter(Boolean);

	const datesYouEnjoy = user?.kind_of_date_enjoy?.map((k) => k.name).join(", ") || "None specified";

	return (
		<Stack spacing={3}>
			{/* Basic Information */}
			<Card sx={{p: 4, borderRadius: 4, boxShadow: theme.shadows[1], position: "relative", overflow: "hidden"}}>
				{/* Watermark */}
				<Iconify
					icon="solar:user-id-bold-duotone"
					sx={{
						position: "absolute",
						top: -20,
						right: -20,
						width: 140,
						height: 140,
						opacity: 0.03,
						transform: "rotate(-15deg)",
						pointerEvents: "none",
						color: "primary.main",
					}}
				/>

				<Stack direction="row" spacing={2} alignItems="center" mb={4} sx={{position: "relative", zIndex: 1}}>
					<Box sx={{p: 1.2, borderRadius: 2.5, bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center"}}>
						<Iconify icon="solar:user-id-bold-duotone" width={25} />
					</Box>
					<Typography variant="h6" sx={{fontWeight: 800}}>
						Basic Information
					</Typography>
				</Stack>

				<Grid container spacing={4} sx={{position: "relative", zIndex: 1}}>
					{[
						{label: "Full Name", value: user?.name || "Unknown", icon: "solar:user-rounded-bold-duotone", color: "primary"},
						{label: "GENDER", value: user?.gender?.name || "Unknown", icon: "solar:users-group-two-rounded-bold-duotone", color: "secondary"},
						{label: "Likes to Date", value: likesToDate, icon: "solar:heart-bold-duotone", color: "error"},
						{
							label: "Born",
							value: user?.dob
								? new Date(user.dob).toLocaleDateString("en-GB", {
										day: "2-digit",
										month: "short",
										year: "numeric",
									})
								: "Unknown",
							icon: "solar:calendar-date-bold-duotone",
							color: "warning",
						},
						{label: "Height", value: user?.height_value ? `${user.height_value} ${user.height_type || ""}` : "Unknown", icon: "solar:ruler-cross-pen-bold-duotone", color: "info"},
						{label: "Location", value: user?.location?.name || "Unknown", icon: "solar:map-point-bold-duotone", color: "success"},
					].map((item, index) => (
						<Grid size={{xs: 12, sm: 6, md: 4}} key={index}>
							<Stack direction="row" spacing={2} alignItems="center">
								<Box sx={{p: 1.2, borderRadius: 2, bgcolor: alpha(theme.palette[item.color].main, 0.1), color: `${item.color}.main`, display: "flex", alignItems: "center", justifyContent: "center"}}>
									<Iconify icon={item.icon} width={24} />
								</Box>
								<Box>
									<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, textTransform: "uppercase", display: "block", mb: 0.2}}>
										{item.label}
									</Typography>
									<Typography variant="subtitle2" sx={{fontWeight: 700}}>
										{item.value}
									</Typography>
								</Box>
							</Stack>
						</Grid>
					))}
				</Grid>
			</Card>

			{/* About & Lifestyle */}
			<Card sx={{p: 4, borderRadius: 4, boxShadow: theme.shadows[1], position: "relative", overflow: "hidden"}}>
				{/* Watermark */}
				<Iconify
					icon="solar:star-fall-minimalistic-bold-duotone"
					sx={{
						position: "absolute",
						top: -20,
						right: -20,
						width: 140,
						height: 140,
						opacity: 0.03,
						transform: "rotate(-15deg)",
						pointerEvents: "none",
						color: "secondary.main",
					}}
				/>

				<Stack direction="row" spacing={2} alignItems="center" mb={4} sx={{position: "relative", zIndex: 1}}>
					<Box sx={{p: 1.5, borderRadius: 2.5, bgcolor: alpha(theme.palette.secondary.main, 0.1), color: "secondary.main", display: "flex", alignItems: "center", justifyContent: "center"}}>
						<Iconify icon="solar:star-fall-minimalistic-bold-duotone" width={28} />
					</Box>
					<Typography variant="h5" sx={{fontWeight: 800}}>
						Lifestyle & Preferences
					</Typography>
				</Stack>

				<Grid container spacing={3} sx={{position: "relative", zIndex: 1}}>
					<Grid size={{xs: 12, md: 6}}>
						<Box sx={{p: 3, bgcolor: alpha(theme.palette.text.primary, 0.03), borderRadius: 3, height: "100%"}}>
							<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, textTransform: "uppercase", display: "block", mb: 1}}>
								Tell us about you
							</Typography>
							<Typography variant="body1" sx={{fontWeight: 600, lineHeight: 1.6}}>
								{user?.about_us || "Not provided."}
							</Typography>
						</Box>
					</Grid>
					<Grid size={{xs: 12, md: 6}}>
						<Stack spacing={3} sx={{height: "100%"}}>
							<Box sx={{p: 3, bgcolor: alpha(theme.palette.text.primary, 0.03), borderRadius: 3}}>
								<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, textTransform: "uppercase", display: "block", mb: 1.5}}>
									Lifestyle
								</Typography>
								<Stack direction="row" flexWrap="wrap" gap={1}>
									{lifestyle.length > 0 ? (
										lifestyle.map((item, idx) => <Chip key={idx} label={item} size="small" sx={{bgcolor: alpha(theme.palette.background.paper, 0.8), fontWeight: 700, border: "none"}} />)
									) : (
										<Typography variant="body2" sx={{fontWeight: 600, color: "text.secondary"}}>
											Not provided
										</Typography>
									)}
								</Stack>
							</Box>
							<Box sx={{p: 3, bgcolor: alpha(theme.palette.text.primary, 0.03), borderRadius: 3, flex: 1}}>
								<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, textTransform: "uppercase", display: "block", mb: 1}}>
									Education & Work
								</Typography>
								<Typography variant="body2" sx={{fontWeight: 600}}>
									{educationWork || "Not provided"}
								</Typography>
							</Box>
						</Stack>
					</Grid>
					<Grid size={{xs: 12}}>
						<Box sx={{p: 3, bgcolor: alpha(theme.palette.text.primary, 0.03), borderRadius: 3}}>
							<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, textTransform: "uppercase", display: "block", mb: 1}}>
								Kind of dates you enjoy
							</Typography>
							<Typography variant="body1" sx={{fontWeight: 600, lineHeight: 1.6}}>
								{datesYouEnjoy}
							</Typography>
						</Box>
					</Grid>

					{/* Emergency Contacts & Preferences */}
					<Grid size={{xs: 12, md: 6}}>
						<Box sx={{p: 3, bgcolor: alpha(theme.palette.text.primary, 0.03), borderRadius: 3, height: "100%"}}>
							<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, textTransform: "uppercase", display: "block", mb: 1.5}}>
								Emergency Contacts
							</Typography>
							{user?.emergency_contacts?.length > 0 ? (
								<Stack spacing={2}>
									{user.emergency_contacts.map((contact, i) => (
										<Stack direction="row" justifyContent="space-between" alignItems="center" key={i} sx={{p: 1.5, bgcolor: "background.paper", borderRadius: 2}}>
											<Box>
												<Typography variant="body2" sx={{fontWeight: 700}}>{contact.full_name}</Typography>
												<Typography variant="caption" sx={{color: "text.secondary", fontWeight: 600}}>{contact.relationship}</Typography>
											</Box>
											<Typography variant="body2" sx={{fontWeight: 600, color: "primary.main"}}>{contact.phone_number}</Typography>
										</Stack>
									))}
								</Stack>
							) : (
								<Typography variant="body2" sx={{fontWeight: 600, color: "text.secondary", fontStyle: "italic"}}>
									No emergency contacts provided.
								</Typography>
							)}
						</Box>
					</Grid>
					<Grid size={{xs: 12, md: 6}}>
						<Box sx={{p: 3, bgcolor: alpha(theme.palette.text.primary, 0.03), borderRadius: 3, height: "100%"}}>
							<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, textTransform: "uppercase", display: "block", mb: 1.5}}>
								App Preferences
							</Typography>
							<Stack spacing={1.5}>
								{[
									{ label: "Show My Age", value: user?.show_my_age },
									{ label: "Show Gender in Profile", value: user?.show_gender_in_profile },
									{ label: "Receive Weekly Date Ideas", value: user?.send_weekly_date_ideas }
								].map((pref, i) => (
									<Stack direction="row" justifyContent="space-between" key={i}>
										<Typography variant="body2" sx={{fontWeight: 600, color: "text.secondary"}}>{pref.label}</Typography>
										<Chip label={pref.value ? "Yes" : "No"} size="small" color={pref.value ? "success" : "default"} sx={{fontWeight: 700, height: 20}} />
									</Stack>
								))}
							</Stack>
						</Box>
					</Grid>
				</Grid>
			</Card>

			{/* Profile Prompts */}
			<Card sx={{p: 4, borderRadius: 4, boxShadow: theme.shadows[1], position: "relative", overflow: "hidden"}}>
				{/* Watermark */}
				<Iconify
					icon="solar:chat-square-call-bold-duotone"
					sx={{
						position: "absolute",
						top: -20,
						right: -20,
						width: 140,
						height: 140,
						opacity: 0.03,
						transform: "rotate(-15deg)",
						pointerEvents: "none",
						color: "info.main",
					}}
				/>

				<Stack direction="row" spacing={2} alignItems="center" mb={4} sx={{position: "relative", zIndex: 1}}>
					<Box sx={{p: 1.5, borderRadius: 2.5, bgcolor: alpha(theme.palette.info.main, 0.1), color: "info.main", display: "flex", alignItems: "center", justifyContent: "center"}}>
						<Iconify icon="solar:chat-square-call-bold-duotone" width={28} />
					</Box>
					<Typography variant="h5" sx={{fontWeight: 800}}>
						Profile Prompts
					</Typography>
				</Stack>

				<Grid container spacing={3} sx={{position: "relative", zIndex: 1}}>
					{user?.prompt_answers?.length > 0 ? (
						user.prompt_answers.map((prompt, index) => (
							<Grid size={{xs: 12, md: 6}} key={index}>
								<Box
									sx={{
										p: 3,
										borderRadius: 3,
										bgcolor: alpha(theme.palette.info.main, 0.04),
										borderLeft: `4px solid ${theme.palette.info.main}`,
										height: "100%",
									}}>
									<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, textTransform: "uppercase", display: "block", mb: 0.5}}>
										{prompt?.prompt?.question}
									</Typography>
									<Typography variant="body1" sx={{fontWeight: 700, color: "text.primary", fontStyle: "italic"}}>
										"{prompt.answer}"
									</Typography>
								</Box>
							</Grid>
						))
					) : (
						<Grid size={{xs: 12}}>
							<Typography variant="body2" sx={{fontWeight: 600, color: "text.secondary", fontStyle: "italic", textAlign: "center"}}>
								No prompts answered.
							</Typography>
						</Grid>
					)}
				</Grid>
			</Card>
		</Stack>
	);
};

export default ProfileTab;
