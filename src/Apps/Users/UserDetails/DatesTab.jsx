import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import {useTheme, alpha} from "@mui/material/styles";

import Iconify from "src/components/common/iconify";

const dateImages = [
	"https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600",
	"https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600",
	"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600",
	"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600",
	"https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600",
];

const mockDates = Array.from({length: 5}).map((_, i) => ({
	id: i + 1,
	image: dateImages[i % dateImages.length],
	isBoosted: i % 2 === 0,
	title: `Date Setup #${i + 213}`,
	subtitle: "131123123sasdasd",
	date: "Monday, Jun 29",
	time: "10:35 - 12:40",
	locationTitle: "The Velvet Room",
	locationAddress: "124 Cocktail Blvd, Midtown",
	budget: "$50-$100",
	treating: "I'm treating",
	dressCode: "Smart Casual",
	visibility: "Discoverable",
	genderPref: "Non-binary",
	agePref: "44-61 yrs",
	trustPref: "Trusted",
}));

const DatesTab = () => {
	const theme = useTheme();

	return (
		<Grid container spacing={2}>
			{mockDates.map((date) => (
				<Grid size={{xs: 12, md: 6}} key={date.id}>
					<Card
						sx={{
							display: "flex",
							flexDirection: "column",
							height: "100%",
							boxShadow: theme.shadows[1],
							transition: "transform 0.2s ease, box-shadow 0.2s ease",
							"&:hover": {
								transform: "translateY(-4px)",
								boxShadow: theme.shadows[8],
							},
						}}>
						{/* Top Image */}
						<Box sx={{position: "relative", width: "100%", height: 180}}>
							<Box component="img" src={date.image} alt={date.title} sx={{width: "100%", height: "100%", objectFit: "cover"}} />
							{date.isBoosted && (
								<Chip
									icon={<Iconify icon="mingcute:fire-fill" width={14} />}
									label="Boosted"
									size="small"
									sx={{
										position: "absolute",
										top: 12,
										left: 12,
										backgroundColor: "#e81c4f",
										color: "#fff",
										fontWeight: "bold",
										fontSize: "0.7rem",
										"& .MuiChip-icon": {color: "#fff"},
									}}
								/>
							)}
						</Box>

						{/* Bottom Details */}
						<Box sx={{p: 2.5, flex: 1, display: "flex", flexDirection: "column"}}>
							<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 2}}>
								<Box>
									<Typography variant="h6" sx={{fontWeight: 800, lineHeight: 1.2}}>
										{date.title}
									</Typography>
									<Typography variant="caption" sx={{color: "text.secondary", fontWeight: 600}}>
										ID: {date.subtitle}
									</Typography>
								</Box>
							</Stack>

							<Stack spacing={2} sx={{mb: 2}}>
								<Stack direction="row" spacing={1.5} alignItems="center">
									<Box sx={{p: 0.8, borderRadius: 2, backgroundColor: alpha(theme.palette.primary.main, 0.1), display: "flex"}}>
										<Iconify icon="solar:calendar-bold" width={18} sx={{color: "primary.main"}} />
									</Box>
									<Typography variant="body2" sx={{fontSize: "0.85rem", fontWeight: 600}}>
										{date.date}{" "}
										<Box component="span" sx={{color: "text.secondary", ml: 0.5, fontWeight: 400}}>
											({date.time})
										</Box>
									</Typography>
								</Stack>
								<Stack direction="row" spacing={1.5} alignItems="flex-start">
									<Box sx={{p: 0.8, borderRadius: 2, backgroundColor: alpha(theme.palette.error.main, 0.1), display: "flex"}}>
										<Iconify icon="solar:map-point-bold" width={18} sx={{color: "error.main"}} />
									</Box>
									<Box>
										<Typography variant="body2" sx={{fontSize: "0.85rem", fontWeight: 600}}>
											{date.locationTitle}
										</Typography>
										<Typography variant="caption" color="text.secondary" sx={{display: "block", lineHeight: 1.2}}>
											{date.locationAddress}
										</Typography>
									</Box>
								</Stack>
							</Stack>

							<Divider sx={{my: 2, borderStyle: "dashed"}} />

							<Stack spacing={2} sx={{mt: "auto"}}>
								<Box>
									<Typography variant="overline" sx={{color: "text.secondary", fontWeight: 800, display: "block", mb: 0.5}}>
										DETAILS & BUDGET
									</Typography>
									<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
										<Chip label={date.budget} size="small" sx={{backgroundColor: alpha(theme.palette.text.primary, 0.05), fontWeight: 600, border: "none"}} />
										<Chip label={date.treating} size="small" sx={{backgroundColor: alpha(theme.palette.text.primary, 0.05), fontWeight: 600, border: "none"}} />
										<Chip label={date.dressCode} size="small" sx={{backgroundColor: alpha(theme.palette.text.primary, 0.05), fontWeight: 600, border: "none"}} />
										<Chip
											icon={<Iconify icon="mdi:eye" width={14} />}
											label={date.visibility}
											size="small"
											sx={{backgroundColor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", fontWeight: 700, border: "none", "& .MuiChip-icon": {color: "primary.main"}}}
										/>
									</Stack>
								</Box>

								<Box>
									<Typography variant="overline" sx={{color: "text.secondary", fontWeight: 800, display: "block", mb: 0.5}}>
										PREFERENCES
									</Typography>
									<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
										<Chip label={date.genderPref} size="small" sx={{backgroundColor: alpha(theme.palette.text.primary, 0.05), fontWeight: 600, border: "none"}} />
										<Chip label={date.agePref} size="small" sx={{backgroundColor: alpha(theme.palette.text.primary, 0.05), fontWeight: 600, border: "none"}} />
										<Chip
											icon={<Iconify icon="mdi:shield-check" width={14} />}
											label={date.trustPref}
											size="small"
											sx={{backgroundColor: alpha(theme.palette.success.main, 0.1), color: "success.main", fontWeight: 700, border: "none", "& .MuiChip-icon": {color: "success.main"}}}
										/>
									</Stack>
								</Box>
							</Stack>
						</Box>
					</Card>
				</Grid>
			))}
		</Grid>
	);
};

export default DatesTab;
