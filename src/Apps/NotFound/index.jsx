import React from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import {Dynamic404Illustration} from "src/components/common/Illustrations";
import {imageUlr} from "src/constance";
import {AdminRoutes, AuthRoutes} from "src/routes/routes";

export default function NotFound() {
	const token = localStorage.getItem("token");
	return (
		<Box
			sx={{
				background: (theme) => theme.palette.background.default,
			}}>
			<Stack
				spacing={3}
				alignItems="center"
				justifyContent="center"
				sx={{
					minHeight: "100vh",
					textAlign: "center",
				}}>
				<Dynamic404Illustration
					sx={{
						width: "100%",
						maxWidth: 450,
						height: "auto",
					}}
				/>

				<Typography variant="h4" fontWeight={600} color="text.primary">
					Sorry, page not found!
				</Typography>

				<Typography variant="body2" color="text.disabled" sx={{maxWidth: 500}}>
					Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL or the page has been moved.
				</Typography>

				<Button
					href={imageUlr + `${token ? AdminRoutes.Dashboard : AuthRoutes.Login}`}
					variant="contained"
					size="large"
					color="primary"
					sx={{
						px: 4,
					}}>
					Go to Home
				</Button>
			</Stack>
		</Box>
	);
}
