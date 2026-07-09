import React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Iconify from "src/components/common/iconify";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

export default function CustomDrawer({ open, onClose, title, children, width = 400 }) {
	return (
		<Drawer anchor="right" open={open} onClose={onClose}>
			<Box sx={{ width: { xs: "100vw", sm: width }, display: "flex", flexDirection: "column", height: "100%" }}>
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
					<Typography variant="h6" fontWeight={700}>
						{title}
					</Typography>
					<IconButton onClick={onClose}>
						<Iconify icon="eva:close-fill" />
					</IconButton>
				</Stack>
				<Divider />
				<Box sx={{ p: 2, flex: 1, overflowY: "auto" }}>
					{children}
				</Box>
			</Box>
		</Drawer>
	);
}
