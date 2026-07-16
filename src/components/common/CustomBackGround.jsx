import React from "react";

import Box from "@mui/material/Box";
import {useTheme} from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import {alpha, Stack} from "@mui/system";
import {Avatar, Card, Typography} from "@mui/material";
import {defaultImageUrl} from "../../utils/utils";
import {bgGradient} from "../../theme/css";

export const CustomBackGround = ({rightContent, imageName, headingText, subText}) => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				height: "100vh",
				overflow: {xs: "none", lg: "hidden"},
				...bgGradient({
					color: alpha(theme.palette.background.default, 0.9),
					imgUrl: "/assets/background/overlay_1.jpg",
					startColor: alpha(theme.palette.primary.main, 0.25),
					endColor: alpha(theme.palette.background.default, 0.1),
				}),
			}}>
			<Grid container sx={{height: "100vh"}} spacing={0}>
				<Grid
					size={{xs: 12, md: 6, lg: 5}}
					sx={{
						display: {xs: "none", md: "block"},
						height: "100%",
						backgroundImage: `linear-gradient(rgba(0, 0, 0,0.60), rgba(0, 0, 0, 0)), url(${defaultImageUrl(`/assets/background/${imageName}`)})`,
						// backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(https://images.unsplash.com/photo-1557682250-33bd709cbe85)`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}>
					<Stack alignItems="center" sx={{height: "100vh"}}>
						<Box sx={{px: 4}}>
							<Stack spacing={1} justifyContent="center" alignItems="center" sx={{mt: 4}}>
								<Avatar
									sx={{
										width: 120,
										height: 120,
										boxShadow: 0,
									}}
									src={defaultImageUrl(`/assets/logo.png`)}
									variant="rounded"
								/>
								<Typography variant="h4" align="center" color={theme.palette.mode !== "dark" ? "common.white" : "common.black"} justifyContent="end">
									{headingText}
								</Typography>
								<Typography align="center" variant="body2" color="text.secondary">
									{subText}
								</Typography>
								{/* <Box
									component="img"
									src={defaultImageUrl(`/assets/background/${imageName}`)}
									alt="illustration"
									sx={{
										height: "auto",
										width: "100%",
									}}
								/>  */}
							</Stack>
						</Box>
					</Stack>
				</Grid>

				<Grid
					size={{xs: 12, md: 6, lg: 7}}
					sx={{
						background: theme.palette.background.paper,
						// background: "#0f0509",
						height: 1,
					}}>
					<Card
						sx={{
							height: 1,
							borderRadius: 0,
							boxShadow: 3,
							background: theme.palette.background.default,
							// background: "#0f0509",
						}}>
						<Stack justifyContent="center" sx={{height: 1}} spacing={2}>
							<Box
								sx={{
									minHeight: "100vh",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}>
								<Box
									sx={{
										width: "100%",
										maxWidth: {sx: "100%", sm: "85%", lg: 500},
										// p: 5,
									}}>
									{rightContent}
								</Box>
							</Box>
						</Stack>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
};
