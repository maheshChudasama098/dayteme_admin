import React from "react";
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

const UserDetails = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");

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

	return (
		<Stack spacing={3}>
			{/* Header Section */}
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

				{/* Right Column: Detailed Info */}
				<Grid size={{xs: 12, md: 8}}>
					<Card sx={{p: 3}}>
						<Stack spacing={3}>
							{/* Basic Details */}
							<Box>
								<Typography variant="h6" gutterBottom>
									Basic Information
								</Typography>
								<Divider sx={{mb: 2}} />
								<Grid container spacing={2}>
									<Grid size={{xs: 12, md: 6}}>
										<Typography variant="caption" color="text.secondary">
											Full Name
										</Typography>
										<Typography variant="body1">{user.fullName}</Typography>
									</Grid>
									<Grid size={{xs: 12, md: 6}}>
										<Typography variant="caption" color="text.secondary">
											Identify As
										</Typography>
										<Typography variant="body1">{user.identity}</Typography>
									</Grid>
									<Grid size={{xs: 12, md: 6}}>
										<Typography variant="caption" color="text.secondary">
											Likes to Date
										</Typography>
										<Typography variant="body1">{user.likeToDate}</Typography>
									</Grid>
									<Grid size={{xs: 12, md: 6}}>
										<Typography variant="caption" color="text.secondary">
											Born
										</Typography>
										<Typography variant="body1">{user.born}</Typography>
									</Grid>
									<Grid size={{xs: 12, md: 6}}>
										<Typography variant="caption" color="text.secondary">
											Height
										</Typography>
										<Typography variant="body1">{user.tallAreYou}</Typography>
									</Grid>
									<Grid size={{xs: 12, md: 6}}>
										<Typography variant="caption" color="text.secondary">
											Location
										</Typography>
										<Typography variant="body1">{user.location}</Typography>
									</Grid>
								</Grid>
							</Box>

							{/* About and Lifestyle */}
							<Box>
								<Typography variant="h6" gutterBottom>
									About & Lifestyle
								</Typography>
								<Divider sx={{mb: 2}} />
								<Stack spacing={2}>
									<Box>
										<Typography variant="caption" color="text.secondary">
											Tell us about you
										</Typography>
										<Typography variant="body1">{user.tellUsAboutYou}</Typography>
									</Box>
									<Box>
										<Typography variant="caption" color="text.secondary">
											A bit more about your lifestyle
										</Typography>
										<Typography variant="body1">{user.lifestyle}</Typography>
									</Box>
									<Box>
										<Typography variant="caption" color="text.secondary">
											Education & Work
										</Typography>
										<Typography variant="body1">{user.educationWork}</Typography>
									</Box>
								</Stack>
							</Box>

							{/* Dating Preferences */}
							<Box>
								<Typography variant="h6" gutterBottom>
									Dating Preferences
								</Typography>
								<Divider sx={{mb: 2}} />
								<Box>
									<Typography variant="caption" color="text.secondary">
										Kind of dates you enjoy
									</Typography>
									<Typography variant="body1">{user.datesYouEnjoy}</Typography>
								</Box>
							</Box>

							{/* Prompts */}
							<Box>
								<Typography variant="h6" gutterBottom>
									Profile Prompts
								</Typography>
								<Divider sx={{mb: 2}} />
								<Stack spacing={2}>
									{user.prompts.map((prompt, index) => (
										<Box key={index} sx={{bgcolor: "background.default", p: 2, borderRadius: 1}}>
											<Typography variant="subtitle2" color="primary" gutterBottom>
												{prompt.question}
											</Typography>
											<Typography variant="body2">{prompt.answer}</Typography>
										</Box>
									))}
								</Stack>
							</Box>
						</Stack>
					</Card>
				</Grid>
			</Grid>
		</Stack>
	);
};

export default UserDetails;
