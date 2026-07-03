import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import {useTheme, alpha} from "@mui/material/styles";

import Iconify from "src/components/common/iconify";

const mockPayments = Array.from({length: 7}).map((_, i) => {
	const statuses = ["Completed", "Completed", "Pending", "Failed", "Completed", "Completed", "Completed"];
	const amounts = ["$14.99", "$29.99", "$9.99", "$49.99", "$5.00", "$14.99", "$99.99"];
	const methods = ["Visa **** 4242", "Mastercard **** 8812", "PayPal", "Apple Pay", "Visa **** 4242", "Stripe", "Visa **** 4242"];
	const types = ["1 Month Premium", "3 Months Premium", "Boost Pack (5)", "12 Months Premium", "Gift Purchase", "1 Month Premium", "Lifetime Access"];

	return {
		id: i + 1,
		trxId: `TRX-${Math.floor(Math.random() * 90000) + 10000}`,
		date: `Jun ${29 - i}, 2026`,
		amount: amounts[i],
		status: statuses[i],
		method: methods[i],
		type: types[i],
	};
});

const getMethodIcon = (method) => {
	if (method.includes("Visa")) return "logos:visa";
	if (method.includes("Mastercard")) return "logos:mastercard";
	if (method.includes("Apple")) return "logos:apple-pay";
	if (method.includes("PayPal")) return "logos:paypal";
	return "solar:card-bold-duotone";
};

const PaymentsTab = () => {
	const theme = useTheme();

	return (
		<Grid container spacing={2}>
			{mockPayments.map((payment) => (
				<Grid size={{xs: 12, md: 6}} key={payment.id}>
					<Card
						sx={{
							p: 2,
							borderRadius: 4,
							boxShadow: theme.shadows[1],
							position: "relative",
							overflow: "hidden",
							transition: "all 0.3s ease",
							"&:hover": {
								transform: "translateY(-4px)",
								boxShadow: theme.shadows[8],
							},
						}}>
						{/* Background decorative icon */}
						<Iconify
							icon="solar:wallet-money-bold-duotone"
							sx={{
								position: "absolute",
								right: -20,
								bottom: -20,
								width: 140,
								height: 140,
								opacity: 0.15,
								transform: "rotate(-15deg)",
								pointerEvents: "none",
								color: "success.main",
							}}
						/>

						<Stack spacing={2.5} sx={{position: "relative", zIndex: 1}}>
							{/* Header row */}
							<Stack direction="row" justifyContent="space-between" alignItems="center">
								<Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
									<Avatar sx={{bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", width: 56, height: 56, borderRadius: 2.5}}>
										<Iconify icon="solar:bill-list-bold-duotone" width={28} />
									</Avatar>
									<Box>
										<Typography variant="h5" sx={{fontWeight: 800, lineHeight: 1.2}}>
											{payment.amount}
										</Typography>
										<Typography variant="caption" sx={{color: "text.secondary", fontWeight: 700}}>
											{payment.type}
										</Typography>
									</Box>
								</Box>
								<Chip
									label={payment.status}
									size="small"
									sx={{
										fontWeight: 800,
										px: 1,
										border: "none",
										backgroundColor:
											payment.status === "Completed" ? alpha(theme.palette.success.main, 0.1) : payment.status === "Pending" ? alpha(theme.palette.warning.main, 0.1) : alpha(theme.palette.error.main, 0.1),
										color: payment.status === "Completed" ? "success.main" : payment.status === "Pending" ? "warning.main" : "error.main",
									}}
								/>
							</Stack>

							<Divider sx={{borderStyle: "dashed"}} />

							{/* Details row */}
							<Stack direction="row" justifyContent="space-between" flexWrap="wrap" useFlexGap sx={{gap: 2}}>
								<Box>
									<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, display: "block", mb: 0.5}}>
										TRANSACTION ID
									</Typography>
									<Typography variant="body2" sx={{fontWeight: 700, fontFamily: "monospace"}}>
										{payment.trxId}
									</Typography>
								</Box>
								<Box>
									<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, display: "block", mb: 0.5}}>
										PAYMENT METHOD
									</Typography>
									<Stack direction="row" alignItems="center" spacing={1}>
										<Iconify icon={getMethodIcon(payment.method)} width={20} />
										<Typography variant="body2" sx={{fontWeight: 700}}>
											{payment.method}
										</Typography>
									</Stack>
								</Box>
							</Stack>
							<Box>
								<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, display: "block", mb: 0.5}}>
									DATE
								</Typography>
								<Typography variant="body2" sx={{fontWeight: 700}}>
									{payment.date}
								</Typography>
							</Box>
						</Stack>
					</Card>
				</Grid>
			))}
		</Grid>
	);
};

export default PaymentsTab;
