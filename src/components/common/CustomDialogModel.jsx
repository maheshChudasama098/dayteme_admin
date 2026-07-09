import React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {Stack} from "@mui/material";

export const CustomDialogModel = ({open, child, title, subTitle, handleClose, closeBtn = true, minWidth = 400, maxWidth = 400, ...props}) => (
	<Dialog
		open={open}
		maxWidth="lg"
		// fullWidth
		sx={{
			"& .MuiPaper-root": {
				borderRadius: 3,
				maxHeight: "90vh",
				overflowY: "auto",
			},
		}}
		PaperProps={{
			sx: {
				minWidth: minWidth || "auto",
				maxWidth: maxWidth || "none",
			},
		}}
		onClose={handleClose}
		{...props}>
		<Card
			sx={{
				p: 3,
				width: 1,
				borderRadius: 0,
				minWidth,
				display: "flex",
				flexDirection: "column",
				boxShadow :0
			}}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-start",
				}}>
				<Stack sx={{mb: 4}}>
					<Typography variant="h6" color="text.primary">
						{title}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{subTitle}
					</Typography>
				</Stack>
				{closeBtn && (
					<IconButton onClick={handleClose} size="small">
						<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 16 16">
							<path
								fill="currentColor"
								fill-rule="evenodd"
								d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8L3.47 4.53a.75.75 0 0 1 0-1.06"
								clip-rule="evenodd"
							/>
						</svg>
					</IconButton>
				)}
			</Box>
			{child}
		</Card>
	</Dialog>
);

CustomDialogModel.propTypes = {
	open: PropTypes.bool,
	handleClose: PropTypes.func,
	message: PropTypes.string,
	minWidth: PropTypes.number,
};
