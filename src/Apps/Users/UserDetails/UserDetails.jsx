import React, {useState} from "react";
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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import Iconify from "src/components/common/iconify";
import CustomBreadcrumbs from "src/components/common/CustomBreadcrumbs";

const UserDetails = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");

	const [currentTab, setCurrentTab] = useState("profile");

	const handleTabChange = (event, newValue) => {
		setCurrentTab(newValue);
	};

	// Dummy data simulating a comprehensive user profile
	const user = {
		id: id || "1",
		image: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (id || "1"),
		name: "Alice",
		email: "alice.johnson@example.com",
		identity: "Woman",
		likeToDate: "Men",
		fullName: "Alice Johnson",
		born: "1995-04-12",
		location: "New York, USA",
		tellUsAboutYou: "I love exploring the city, trying new coffee shops, and reading sci-fi novels. Always up for an adventure or a quiet night in.",
		tallAreYou: "5'6\" (168 cm)",
		lifestyle: "Active, Non-smoker, Social drinker, Dog lover",
		datesYouEnjoy: "Coffee dates, Museum visits, Hiking, Dinner at a cozy restaurant",
		prompts: [
			{question: "A life goal of mine...", answer: "To visit every national park."},
			{question: "I geek out on...", answer: "Vintage cameras and photography."},
			{question: "My most controversial opinion is...", answer: "Pineapple belongs on pizza."},
		],
		educationWork: "Software Engineer at TechCorp • B.S. in Computer Science",
		status: "Active",
		rate: "4.8/5",
	};

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

	const dummyPayments = [
		{id: "TXN-001", amount: "$49.99", date: "2026-06-15", status: "Completed", plan: "Premium 1 Month"},
		{id: "TXN-002", amount: "$9.99", date: "2026-05-10", status: "Completed", plan: "Profile Boost"},
	];

	const dummyGifts = [
		{id: 1, name: "Rose Bouquet", type: "Sent to Bob", date: "2026-06-20", value: "$15"},
		{id: 2, name: "Coffee Voucher", type: "Received from Charlie", date: "2026-06-18", value: "$10"},
	];

	return (
		<Stack spacing={2}>
			{/* Header Section */}
			<Box>
				<Typography variant="h4" color="text.primary">
					User Profile Details
				</Typography>
				<Typography variant="body2" sx={{color: "text.secondary"}}>
					View all comprehensive details about the user's dating profile.
				</Typography>
			</Box>

			<Grid container spacing={3}>
				{/* Left Column: Avatar & Quick Info */}
				<Grid size={{xs: 12, md: 4}}>
					<Card sx={{p: 3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center"}}>
						<Avatar src={user.image} sx={{width: 150, height: 150, mb: 2, boxShadow: 3}} />
						<Typography variant="h5" gutterBottom>
							{user.name}
						</Typography>
						<Typography variant="body2" color="text.secondary" gutterBottom>
							{user.email}
						</Typography>
						<Stack direction="row" spacing={1} sx={{mt: 1, mb: 2}}>
							<Chip label={user.status} color="success" size="small" variant="outlined" />
							<Chip label={`Rate: ${user.rate}`} color="primary" size="small" variant="outlined" />
						</Stack>
					</Card>
				</Grid>

				{/* Right Column: Detailed Info & Tabs */}
				<Grid size={{xs: 12, md: 8}}>
					<Card sx={{height: "100%"}}>
						<Box sx={{borderBottom: 1, borderColor: "divider"}}>
							<Tabs value={currentTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{px: 3, pt: 2}}>
								<Tab label="Profile" value="profile" />
								<Tab label="Likes" value="likes" />
								<Tab label="Chats" value="chats" />
								<Tab label="Payments" value="payments" />
								<Tab label="Gifts" value="gifts" />
							</Tabs>
						</Box>

						<Box sx={{p: 3}}>
							{/* Tab: Profile */}
							{currentTab === "profile" && (
								<Stack spacing={4}>
									{/* Basic Information */}
									<Card variant="outlined" sx={{p: 3, borderRadius: 3, borderColor: "divider"}}>
										<Stack direction="row" spacing={2} alignItems="center" mb={3}>
											<Box sx={{width: 40, height: 40, borderRadius: 2, bgcolor: "primary.light", color: "primary.dark", display: "flex", alignItems: "center", justifyContent: "center"}}>
												<Iconify icon="mdi:account-details" width={24} />
											</Box>
											<Typography variant="h6" fontWeight={700}>
												Basic Information
											</Typography>
										</Stack>
										<Grid container spacing={3}>
											{[
												{label: "Full Name", value: user.fullName, icon: "mdi:account-outline"},
												{label: "Identify As", value: user.identity, icon: "mdi:gender-male-female"},
												{label: "Likes to Date", value: user.likeToDate, icon: "mdi:heart-outline"},
												{label: "Born", value: user.born, icon: "mdi:cake-variant-outline"},
												{label: "Height", value: user.tallAreYou, icon: "mdi:human-male-height"},
												{label: "Location", value: user.location, icon: "mdi:map-marker-outline"},
											].map((item, index) => (
												<Grid size={{xs: 12, sm: 6, md: 4}} key={index}>
													<Stack direction="row" spacing={2} alignItems="center">
														<Iconify icon={item.icon} sx={{color: "text.disabled", width: 24, height: 24}} />
														<Box>
															<Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
																{item.label}
															</Typography>
															<Typography variant="body1" fontWeight={500}>
																{item.value}
															</Typography>
														</Box>
													</Stack>
												</Grid>
											))}
										</Grid>
									</Card>

									{/* About & Lifestyle */}
									<Card variant="outlined" sx={{p: 3, borderRadius: 3, borderColor: "divider"}}>
										<Stack direction="row" spacing={2} alignItems="center" mb={3}>
											<Box sx={{width: 40, height: 40, borderRadius: 2, bgcolor: "secondary.light", color: "secondary.dark", display: "flex", alignItems: "center", justifyContent: "center"}}>
												<Iconify icon="mdi:creation" width={24} />
											</Box>
											<Typography variant="h6" fontWeight={700}>
												Lifestyle & Preferences
											</Typography>
										</Stack>

										<Grid container spacing={3}>
											<Grid size={{xs: 12, md: 6}}>
												<Box sx={{p: 2, bgcolor: "background.default", borderRadius: 2, height: "100%", border: "1px solid", borderColor: "divider"}}>
													<Typography variant="subtitle2" color="text.secondary" gutterBottom>
														Tell us about you
													</Typography>
													<Typography variant="body2">{user.tellUsAboutYou}</Typography>
												</Box>
											</Grid>
											<Grid size={{xs: 12, md: 6}}>
												<Stack spacing={2}>
													<Box sx={{p: 2, bgcolor: "background.default", borderRadius: 2, border: "1px solid", borderColor: "divider"}}>
														<Typography variant="subtitle2" color="text.secondary" gutterBottom>
															Lifestyle
														</Typography>
														<Stack direction="row" flexWrap="wrap" gap={1}>
															{user.lifestyle.split(", ").map((item, idx) => (
																<Chip key={idx} label={item} size="small" variant="outlined" />
															))}
														</Stack>
													</Box>
													<Box sx={{p: 2, bgcolor: "background.default", borderRadius: 2, border: "1px solid", borderColor: "divider"}}>
														<Typography variant="subtitle2" color="text.secondary" gutterBottom>
															Education & Work
														</Typography>
														<Typography variant="body2">{user.educationWork}</Typography>
													</Box>
												</Stack>
											</Grid>
											<Grid size={{xs: 12}}>
												<Box sx={{p: 2, bgcolor: "background.default", borderRadius: 2, border: "1px solid", borderColor: "divider"}}>
													<Typography variant="subtitle2" color="text.secondary" gutterBottom>
														Kind of dates you enjoy
													</Typography>
													<Typography variant="body2">{user.datesYouEnjoy}</Typography>
												</Box>
											</Grid>
										</Grid>
									</Card>

									{/* Profile Prompts */}
									<Box>
										<Stack direction="row" spacing={2} alignItems="center" mb={3}>
											<Box sx={{width: 40, height: 40, borderRadius: 2, bgcolor: "info.light", color: "info.dark", display: "flex", alignItems: "center", justifyContent: "center"}}>
												<Iconify icon="mdi:chat-processing-outline" width={24} />
											</Box>
											<Typography variant="h6" fontWeight={700}>
												Profile Prompts
											</Typography>
										</Stack>
										<Grid container spacing={2}>
											{user.prompts.map((prompt, index) => (
												<Grid size={{xs: 12, md: 6}} key={index}>
													<Box sx={{p: 3, borderRadius: 3, bgcolor: "background.default", border: "1px dashed", borderColor: "divider", height: "100%"}}>
														<Typography variant="subtitle2" color="primary.main" gutterBottom sx={{display: "flex", alignItems: "center", gap: 1}}>
															<Iconify icon="mdi:format-quote-open" /> {prompt.question}
														</Typography>
														<Typography variant="body1" fontWeight={500} sx={{fontStyle: "italic", pl: 3}}>
															"{prompt.answer}"
														</Typography>
													</Box>
												</Grid>
											))}
										</Grid>
									</Box>
								</Stack>
							)}

							{/* Tab: Likes */}
							{currentTab === "likes" && (
								<Grid container spacing={3}>
									{dummyLikes.map((like) => (
										<Grid size={{xs: 12, md: 6}} key={like.id}>
											<Card variant="outlined" sx={{p: 2, borderRadius: 3, borderColor: "divider"}}>
												{/* Images Section */}
												<Box sx={{display: "flex", gap: 1, mb: 2, height: 160}}>
													<Box sx={{flex: 2, position: "relative", borderRadius: 2, overflow: "hidden"}}>
														<img src={like.images[0]} alt="main" style={{width: "100%", height: "100%", objectFit: "cover"}} />
														<Box sx={{position: "absolute", top: 8, left: 8, bgcolor: "rgba(0,0,0,0.6)", color: "#fff", px: 1, py: 0.5, borderRadius: 1, fontSize: "0.75rem", fontWeight: "bold"}}>
															{like.matchRate} Match
														</Box>
														<Box
															sx={{
																position: "absolute",
																top: 8,
																right: 8,
																bgcolor: "#ffc107",
																color: "#000",
																px: 1,
																py: 0.5,
																borderRadius: 1,
																fontSize: "0.75rem",
																fontWeight: "bold",
																display: "flex",
																alignItems: "center",
																gap: 0.5,
															}}>
															<Iconify icon="mdi:star" width={14} /> {like.rating}
														</Box>
													</Box>
													<Box sx={{flex: 1, display: "flex", flexDirection: "column", gap: 1}}>
														<Box sx={{flex: 1, borderRadius: 2, overflow: "hidden"}}>
															<img src={like.images[1]} alt="sub1" style={{width: "100%", height: "100%", objectFit: "cover"}} />
														</Box>
														<Box sx={{flex: 1, borderRadius: 2, overflow: "hidden"}}>
															<img src={like.images[2]} alt="sub2" style={{width: "100%", height: "100%", objectFit: "cover"}} />
														</Box>
													</Box>
												</Box>

												{/* Content Section */}
												<Typography variant="caption" color="text.secondary">
													Liked on: {like.date}
												</Typography>
												<Typography variant="subtitle1" fontWeight={700} sx={{mt: 0.5, mb: 1}}>
													{like.name}, {like.age}
												</Typography>

												<Stack spacing={1}>
													<Stack direction="row" spacing={1} alignItems="center">
														<Iconify icon="mdi:map-marker" sx={{color: "error.main", width: 18}} />
														<Typography variant="body2" color="text.secondary">
															{like.location}
														</Typography>
													</Stack>
													<Stack direction="row" spacing={1} alignItems="center">
														<Iconify icon="mdi:clock-outline" sx={{color: "info.main", width: 18}} />
														<Typography variant="body2" color="text.secondary">
															{like.activeTime}
														</Typography>
													</Stack>
												</Stack>

												<Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2}}>
													<Stack direction="row" spacing={1} alignItems="center" color="success.main">
														<Iconify icon="mdi:account-group" width={18} />
														<Typography variant="caption" fontWeight={600}>
															Matched
														</Typography>
													</Stack>
													<Iconify icon="mdi:dots-vertical" sx={{color: "text.secondary", cursor: "pointer"}} />
												</Box>
											</Card>
										</Grid>
									))}
								</Grid>
							)}

							{/* Tab: Chats */}
							{currentTab === "chats" && (
								<Grid container spacing={3}>
									{dummyChats.map((chat) => (
										<Grid size={{xs: 12, md: 6}} key={chat.id}>
											<Card variant="outlined" sx={{p: 2, borderRadius: 3, borderColor: "divider"}}>
												{/* Images Section */}
												<Box sx={{display: "flex", gap: 1, mb: 2, height: 160}}>
													<Box sx={{flex: 2, position: "relative", borderRadius: 2, overflow: "hidden"}}>
														<img src={chat.images[0]} alt="main" style={{width: "100%", height: "100%", objectFit: "cover"}} />
														<Box sx={{position: "absolute", top: 8, left: 8, bgcolor: "rgba(0,0,0,0.6)", color: "#fff", px: 1, py: 0.5, borderRadius: 1, fontSize: "0.75rem", fontWeight: "bold"}}>
															{chat.matchRate} Match
														</Box>
														<Box
															sx={{
																position: "absolute",
																top: 8,
																right: 8,
																bgcolor: "#ffc107",
																color: "#000",
																px: 1,
																py: 0.5,
																borderRadius: 1,
																fontSize: "0.75rem",
																fontWeight: "bold",
																display: "flex",
																alignItems: "center",
																gap: 0.5,
															}}>
															<Iconify icon="mdi:star" width={14} /> {chat.rating}
														</Box>
													</Box>
													<Box sx={{flex: 1, display: "flex", flexDirection: "column", gap: 1}}>
														<Box sx={{flex: 1, borderRadius: 2, overflow: "hidden"}}>
															<img src={chat.images[1]} alt="sub1" style={{width: "100%", height: "100%", objectFit: "cover"}} />
														</Box>
														<Box sx={{flex: 1, borderRadius: 2, overflow: "hidden"}}>
															<img src={chat.images[2]} alt="sub2" style={{width: "100%", height: "100%", objectFit: "cover"}} />
														</Box>
													</Box>
												</Box>

												{/* Content Section */}
												<Typography variant="caption" color="text.secondary">
													Last Message: {chat.date}
												</Typography>
												<Typography variant="subtitle1" fontWeight={700} sx={{mt: 0.5, mb: 1}}>
													{chat.name}, {chat.age}
												</Typography>

												<Stack spacing={1}>
													<Stack direction="row" spacing={1} alignItems="center">
														<Iconify icon="mdi:map-marker" sx={{color: "error.main", width: 18}} />
														<Typography variant="body2" color="text.secondary">
															{chat.location}
														</Typography>
													</Stack>
													<Stack direction="row" spacing={1} alignItems="flex-start">
														<Iconify icon="mdi:message-text-outline" sx={{color: "info.main", width: 18, mt: 0.2}} />
														<Typography variant="body2" color="text.secondary" sx={{display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"}}>
															"{chat.lastMessage}"
														</Typography>
													</Stack>
												</Stack>

												<Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2}}>
													<Button size="small" variant="contained" color="primary" sx={{borderRadius: 2, textTransform: "none"}}>
														Open Chat
													</Button>
													<Iconify icon="mdi:dots-vertical" sx={{color: "text.secondary", cursor: "pointer"}} />
												</Box>
											</Card>
										</Grid>
									))}
								</Grid>
							)}

							{/* Tab: Payments */}
							{currentTab === "payments" && (
								<Grid container spacing={3}>
									{dummyPayments.map((payment) => (
										<Grid size={{xs: 12, md: 6}} key={payment.id}>
											<Card variant="outlined" sx={{p: 2}}>
												<Stack spacing={1}>
													<Stack direction="row" justifyContent="space-between" alignItems="center">
														<Typography variant="subtitle1" fontWeight={600}>
															{payment.amount}
														</Typography>
														<Chip label={payment.status} color="success" size="small" />
													</Stack>
													<Typography variant="body2" color="text.primary">
														{payment.plan}
													</Typography>
													<Typography variant="caption" color="text.secondary">
														TXN: {payment.id} • {payment.date}
													</Typography>
												</Stack>
											</Card>
										</Grid>
									))}
								</Grid>
							)}

							{/* Tab: Gifts */}
							{currentTab === "gifts" && (
								<Grid container spacing={3}>
									{dummyGifts.map((gift) => (
										<Grid size={{xs: 12, md: 6}} key={gift.id}>
											<Card variant="outlined" sx={{p: 2}}>
												<Stack direction="row" spacing={2} alignItems="center">
													<Avatar sx={{bgcolor: "primary.light", color: "primary.main"}}>
														<Iconify icon="mdi:gift" />
													</Avatar>
													<Box>
														<Typography variant="subtitle1">{gift.name}</Typography>
														<Typography variant="body2" color="text.secondary">
															{gift.type}
														</Typography>
														<Typography variant="caption" color="text.secondary">
															{gift.value} • {gift.date}
														</Typography>
													</Box>
												</Stack>
											</Card>
										</Grid>
									))}
								</Grid>
							)}
						</Box>
					</Card>
				</Grid>
			</Grid>
		</Stack>
	);
};

export default UserDetails;
