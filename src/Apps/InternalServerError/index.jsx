import React from "react";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {DynamicServerIllustration} from "src/components/common/Illustrations";

export default function InternalServerError() {
	return (
		<Box
			sx={{
				background: (theme) => theme.palette.background.default,
			}}>
			<Stack
				spacing={0}
				alignItems="center"
				justifyContent="center"
				sx={{
					minHeight: "100vh",
					textAlign: "center",
					background: "background.default",
				}}>
				<DynamicServerIllustration
					sx={{
						width: "100%",
						maxWidth: 350,
						height: "auto",
					}}
				/>
				<Stack sx={{pt: 3}} spacing={1}>
					<Typography variant="h4" fontWeight={600} color="text.primary">
						Internal Server Error
					</Typography>

					<Typography variant="body2" color="text.disabled" sx={{maxWidth: 500}}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
					</Typography>
				</Stack>
			</Stack>
		</Box>
	);
}
