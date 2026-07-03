import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import {useTheme, alpha} from "@mui/material/styles";

import Iconify from "src/components/common/iconify";

const mockGifts = Array.from({length: 10}).map((_, i) => {
	const recipients = ["Emma Watson", "Sophia Turner", "Olivia Davis", "Isabella Smith", "Mia Brown", "Charlotte Wilson", "Amelia Taylor", "Harper Anderson", "Evelyn Thomas", "Abigail Martinez"];
	const avatars = [
		"https://randomuser.me/api/portraits/women/12.jpg",
		"https://randomuser.me/api/portraits/women/43.jpg",
		"https://randomuser.me/api/portraits/women/24.jpg",
		"https://randomuser.me/api/portraits/women/65.jpg",
		"https://randomuser.me/api/portraits/women/78.jpg",
		"https://randomuser.me/api/portraits/women/19.jpg",
		"https://randomuser.me/api/portraits/women/90.jpg",
		"https://randomuser.me/api/portraits/women/33.jpg",
		"https://randomuser.me/api/portraits/women/55.jpg",
		"https://randomuser.me/api/portraits/women/8.jpg",
	];
	const types = ["Virtual Rose", "Diamond Ring", "Teddy Bear", "Concert Ticket", "Premium Match Boost", "Chocolate Box", "Virtual Rose", "Teddy Bear", "Diamond Ring", "Coffee Date"];
	const values = ["$5.00", "$49.99", "$12.99", "$25.00", "$9.99", "$8.50", "$5.00", "$12.99", "$49.99", "$4.50"];

	return {
		id: i + 1,
		trxId: `GFT-${Math.floor(Math.random() * 90000) + 10000}`,
		date: `Jul ${15 - i}, 2026`,
		recipientName: recipients[i],
		recipientAvatar: avatars[i],
		giftType: types[i],
		giftValue: values[i],
		status: i % 4 === 0 ? "Pending" : "Sent",
	};
});

const GiftsTab = () => {
	const theme = useTheme();

	return (
		<Grid container spacing={2}>
			{mockGifts.map((gift) => (
				<Grid size={{xs: 12, md: 6}} key={gift.id}>
					<Card
						sx={{
							p: 2,
							borderRadius: 4,
							boxShadow: theme.shadows[1],
							position: "relative",
							overflow: "hidden",
							transition: "all 0.3s ease",
							"&:hover": {
								transform: "translateY(-4px)",
								boxShadow: theme.shadows[8],
							},
						}}>
						{/* Background decorative icon */}
						<Iconify
							icon="solar:gift-bold-duotone"
							sx={{
								position: "absolute",
								right: -20,
								bottom: -20,
								width: 140,
								height: 140,
								opacity: 0.15,
								transform: "rotate(-15deg)",
								pointerEvents: "none",
								color: "primary.main",
							}}
						/>

						<Stack spacing={3} sx={{position: "relative", zIndex: 1}}>
							{/* Header row */}
							<Stack direction="row" justifyContent="space-between" alignItems="center">
								<Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
									<Avatar sx={{bgcolor: alpha(theme.palette.secondary.main, 0.1), color: "secondary.main", width: 56, height: 56, borderRadius: 2.5}}>
										<Iconify icon="solar:gift-bold-duotone" width={28} />
									</Avatar>
									<Box>
										<Typography variant="h6" sx={{fontWeight: 800, lineHeight: 1.2}}>
											{gift.giftType}
										</Typography>
										<Typography variant="caption" sx={{color: "text.secondary", fontWeight: 700}}>
											Value: {gift.giftValue}
										</Typography>
									</Box>
								</Box>
								<Chip
									icon={<Iconify icon={gift.status === "Sent" ? "solar:check-circle-bold-duotone" : "solar:clock-circle-bold-duotone"} width={16} />}
									label={gift.status}
									size="small"
									sx={{
										fontWeight: 800,
										px: 1,
										border: "none",
										backgroundColor: gift.status === "Sent" ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.warning.main, 0.1),
										color: gift.status === "Sent" ? "success.main" : "warning.main",
										"& .MuiChip-icon": {color: gift.status === "Sent" ? "success.main" : "warning.main"},
									}}
								/>
							</Stack>

							{/* Detail Box */}
							<Box sx={{p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.text.primary, 0.03)}}>
								<Stack direction="row" alignItems="center" justifyContent="space-between">
									<Stack direction="row" alignItems="center" spacing={2}>
										<Avatar src={gift.recipientAvatar} sx={{width: 44, height: 44, boxShadow: 1}} />
										<Box>
											<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, display: "block", lineHeight: 1.2, mb: 0.2}}>
												SENT TO
											</Typography>
											<Typography variant="subtitle2" sx={{fontWeight: 800}}>
												{gift.recipientName}
											</Typography>
										</Box>
									</Stack>
									<Box sx={{textAlign: "right"}}>
										<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, display: "block", lineHeight: 1.2, mb: 0.2}}>
											DATE
										</Typography>
										<Typography variant="subtitle2" sx={{fontWeight: 800}}>
											{gift.date}
										</Typography>
									</Box>
								</Stack>
							</Box>
						</Stack>
					</Card>
				</Grid>
			))}
		</Grid>
	);
};

export default GiftsTab;
