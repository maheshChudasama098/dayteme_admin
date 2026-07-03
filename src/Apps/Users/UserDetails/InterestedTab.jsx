import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {useTheme, alpha} from "@mui/material/styles";

import Iconify from "src/components/common/iconify";

const InterestedTab = () => {
	const theme = useTheme();

	const dummyLikes = [
		{
			id: 1,
			name: "Bob Smith",
			age: 28,
			images: [
				"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop",
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop",
				"https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=300&fit=crop",
			],
			matchRate: "85%",
			rating: "4.8",
			date: "13 Jun 2026 7:44 am",
			location: "New York, USA",
			activeTime: "Active 2h ago",
		},
		{
			id: 2,
			name: "Charlie Davis",
			age: 31,
			images: [
				"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=300&fit=crop",
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
				"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=300&fit=crop",
			],
			matchRate: "90%",
			rating: "4.9",
			date: "12 Jun 2026 6:44 am",
			location: "Los Angeles, USA",
			activeTime: "Active 1d ago",
		},
		{
			id: 3,
			name: "Evan Stone",
			age: 26,
			images: [
				"https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=300&fit=crop",
				"https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&h=300&fit=crop",
				"https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=300&fit=crop",
			],
			matchRate: "70%",
			rating: "3.5",
			date: "11 Jun 2026 5:44 am",
			location: "Chicago, USA",
			activeTime: "Active 3h ago",
		},
	];

	return (
		<Grid container spacing={3}>
			{dummyLikes.map((like) => (
				<Grid size={{xs: 12, md: 6}} key={like.id}>
					<Card sx={{
						p: 2, 
						borderRadius: 4, 
						boxShadow: theme.shadows[1],
						transition: "transform 0.2s ease, box-shadow 0.2s ease",
						"&:hover": {
							transform: "translateY(-4px)",
							boxShadow: theme.shadows[8],
						}
					}}>
						{/* Images Section */}
						<Box sx={{display: "flex", gap: 1, mb: 3, height: 180}}>
							<Box sx={{flex: 2, position: "relative", borderRadius: 3, overflow: "hidden", boxShadow: 1}}>
								<img src={like.images[0]} alt="main" style={{width: "100%", height: "100%", objectFit: "cover"}} />
								<Box sx={{
									position: "absolute",
									bottom: 8,
									left: 8,
									bgcolor: alpha(theme.palette.background.paper, 0.85),
									backdropFilter: "blur(4px)",
									px: 1,
									py: 0.5,
									borderRadius: 2,
									display: "flex",
									alignItems: "center",
									gap: 0.5
								}}>
									<Iconify icon="solar:star-fall-bold" width={14} sx={{color: "warning.main"}} />
									<Typography variant="caption" sx={{fontWeight: 800, color: "text.primary"}}>
										{like.matchRate}
									</Typography>
								</Box>
							</Box>
							<Box sx={{flex: 1, display: "flex", flexDirection: "column", gap: 1}}>
								<Box sx={{flex: 1, borderRadius: 2.5, overflow: "hidden", boxShadow: 1}}>
									<img src={like.images[1]} alt="sub1" style={{width: "100%", height: "100%", objectFit: "cover"}} />
								</Box>
								<Box sx={{flex: 1, borderRadius: 2.5, overflow: "hidden", boxShadow: 1}}>
									<img src={like.images[2]} alt="sub2" style={{width: "100%", height: "100%", objectFit: "cover"}} />
								</Box>
							</Box>
						</Box>

						{/* Content Section */}
						<Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
							<Box>
								<Typography variant="h6" fontWeight={800}>
									{like.name}, {like.age}
								</Typography>
								<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, textTransform: "uppercase"}}>
									Liked on {like.date}
								</Typography>
							</Box>
							<IconButton size="small" sx={{bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", "&:hover": {bgcolor: alpha(theme.palette.primary.main, 0.2)}}}>
								<Iconify icon="solar:heart-bold" width={20} />
							</IconButton>
						</Stack>

						<Stack spacing={1.5} mb={3}>
							<Stack direction="row" spacing={1.5} alignItems="center">
								<Box sx={{p: 0.8, borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.1), color: "error.main", display: "flex"}}>
									<Iconify icon="solar:map-point-bold-duotone" width={18} />
								</Box>
								<Typography variant="body2" sx={{fontWeight: 600, color: "text.secondary"}}>
									{like.location}
								</Typography>
							</Stack>
							<Stack direction="row" spacing={1.5} alignItems="center">
								<Box sx={{p: 0.8, borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.1), color: "info.main", display: "flex"}}>
									<Iconify icon="solar:clock-circle-bold-duotone" width={18} />
								</Box>
								<Typography variant="body2" sx={{fontWeight: 600, color: "text.secondary"}}>
									{like.activeTime}
								</Typography>
							</Stack>
						</Stack>

						<Box sx={{p: 1.5, borderRadius: 3, bgcolor: alpha(theme.palette.success.main, 0.05), display: "flex", justifyContent: "space-between", alignItems: "center"}}>
							<Stack direction="row" spacing={1.5} alignItems="center" color="success.main">
								<Box sx={{p: 0.5, borderRadius: 1.5, bgcolor: alpha(theme.palette.success.main, 0.1), display: "flex"}}>
									<Iconify icon="solar:users-group-two-rounded-bold-duotone" width={20} />
								</Box>
								<Typography variant="subtitle2" fontWeight={800}>
									Matched
								</Typography>
							</Stack>
							<IconButton size="small" sx={{color: "text.disabled"}}>
								<Iconify icon="solar:menu-dots-bold" />
							</IconButton>
						</Box>
					</Card>
				</Grid>
			))}
		</Grid>
	);
};

export default InterestedTab;
