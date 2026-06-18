import React from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const Dashboard = () => {
	return (
		<Box>
			<Stack>
				<Typography variant="h6" fontWeight="100" color="text.primary">
					Welcome,{" "}
					<Typography component="span" variant="h6" color="primary.main" fontWeight={600}>
						Mark Steave
					</Typography>
				</Typography>
			</Stack>
		</Box>
	);
};

export default Dashboard;
