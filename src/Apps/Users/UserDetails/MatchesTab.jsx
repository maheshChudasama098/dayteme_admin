import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import {useTheme, alpha} from "@mui/material/styles";

import Iconify from "src/components/common/iconify";

const MatchesTab = () => {
	const theme = useTheme();

	const dummyChats = [
		{
			id: 1,
			name: "Diana Evans",
			age: 27,
			images: [
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop",
				"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=300&fit=crop",
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop",
			],
			matchRate: "95%",
			rating: "5.0",
			date: "14 Jun 2026 9:00 am",
			location: "Miami, USA",
			lastMessage: "Hey, how are you? Let's catch up soon!",
		},
		{
			id: 2,
			name: "Frank Wright",
			age: 30,
			images: [
				"https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=300&fit=crop",
				"https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=300&fit=crop",
				"https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=300&fit=crop",
			],
			matchRate: "80%",
			rating: "4.2",
			date: "10 Jun 2026 2:15 pm",
			location: "Seattle, USA",
			lastMessage: "Are we still on for tomorrow?",
		},
	];

	return (
		<Grid container spacing={3}>
			{dummyChats.map((chat) => (
				<Grid size={{xs: 12, md: 6}} key={chat.id}>
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
								<img src={chat.images[0]} alt="main" style={{width: "100%", height: "100%", objectFit: "cover"}} />
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
										{chat.matchRate}
									</Typography>
								</Box>
							</Box>
							<Box sx={{flex: 1, display: "flex", flexDirection: "column", gap: 1}}>
								<Box sx={{flex: 1, borderRadius: 2.5, overflow: "hidden", boxShadow: 1}}>
									<img src={chat.images[1]} alt="sub1" style={{width: "100%", height: "100%", objectFit: "cover"}} />
								</Box>
								<Box sx={{flex: 1, borderRadius: 2.5, overflow: "hidden", boxShadow: 1}}>
									<img src={chat.images[2]} alt="sub2" style={{width: "100%", height: "100%", objectFit: "cover"}} />
								</Box>
							</Box>
						</Box>

						{/* Content Section */}
						<Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
							<Box>
								<Typography variant="h6" fontWeight={800}>
									{chat.name}, {chat.age}
								</Typography>
								<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, textTransform: "uppercase"}}>
									Last Message: {chat.date}
								</Typography>
							</Box>
							<IconButton size="small" sx={{bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", "&:hover": {bgcolor: alpha(theme.palette.primary.main, 0.2)}}}>
								<Iconify icon="solar:chat-square-bold" width={20} />
							</IconButton>
						</Stack>

						<Stack spacing={1.5} mb={3}>
							<Stack direction="row" spacing={1.5} alignItems="center">
								<Box sx={{p: 0.8, borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.1), color: "error.main", display: "flex"}}>
									<Iconify icon="solar:map-point-bold-duotone" width={18} />
								</Box>
								<Typography variant="body2" sx={{fontWeight: 600, color: "text.secondary"}}>
									{chat.location}
								</Typography>
							</Stack>
							<Stack direction="row" spacing={1.5} alignItems="flex-start">
								<Box sx={{p: 0.8, borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.1), color: "info.main", display: "flex"}}>
									<Iconify icon="solar:chat-line-bold-duotone" width={18} />
								</Box>
								<Typography variant="body2" color="text.secondary" sx={{fontWeight: 600, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", mt: 0.2}}>
									"{chat.lastMessage}"
								</Typography>
							</Stack>
						</Stack>

						<Box sx={{p: 1.5, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), display: "flex", justifyContent: "space-between", alignItems: "center"}}>
							<Button size="small" variant="contained" color="primary" sx={{borderRadius: 2, textTransform: "none", fontWeight: 700, px: 3, boxShadow: theme.shadows[2]}} startIcon={<Iconify icon="solar:letter-bold" />}>
								Open Chat
							</Button>
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

export default MatchesTab;
