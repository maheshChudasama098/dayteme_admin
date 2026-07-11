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
import {fDate, fDateTime} from "src/utils/utils";

const getMethodIcon = (method) => {
	if (!method) return "solar:card-bold-duotone";
	const lower = method.toLowerCase();
	if (lower.includes("stripe")) return "logos:stripe";
	if (lower.includes("visa")) return "logos:visa";
	if (lower.includes("mastercard")) return "logos:mastercard";
	if (lower.includes("apple")) return "logos:apple-pay";
	if (lower.includes("paypal")) return "logos:paypal";
	return "solar:card-bold-duotone";
};

const formatCurrency = (amount, currency) => {
	try {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency || "USD",
		}).format(amount);
	} catch (e) {
		return `${amount} ${currency}`;
	}
};

const PaymentsTab = ({payments = []}) => {
	const theme = useTheme();

	if (!payments || payments.length === 0) {
		return (
			<Card sx={{p: 5, textAlign: "center", borderRadius: 4, border: "1px dashed", borderColor: "divider", boxShadow: "none"}}>
				<Stack alignItems="center" spacing={2}>
					<Box sx={{p: 2, borderRadius: "50%", bgcolor: alpha(theme.palette.text.disabled, 0.1), color: "text.disabled", display: "flex", alignItems: "center", justifyContent: "center"}}>
						<Iconify icon="solar:wallet-money-bold-duotone" width={48} />
					</Box>
					<Box>
						<Typography variant="h6" sx={{fontWeight: 800, mb: 0.5}}>
							No Payments Found
						</Typography>
						<Typography variant="body2" color="text.secondary">
							This user hasn't completed any transaction yet.
						</Typography>
					</Box>
				</Stack>
			</Card>
		);
	}

	return (
		<Grid container spacing={3}>
			{payments.map((payment) => {
				const isSuccess = payment.status === "succeeded" || payment.status === "completed";
				const isPending = payment.status === "pending" || payment.status === "processing";
				const statusColor = isSuccess ? "success" : isPending ? "warning" : "error";
				const statusText = payment.status?.toUpperCase() || "UNKNOWN";

				return (
					<Grid size={{xs: 12, md: 6}} key={payment.id}>
						<Card
							sx={{
								p: 3,
								borderRadius: 4,
								boxShadow: theme.shadows[1],
								position: "relative",
								overflow: "hidden",
								transition: "all 0.3s ease",
								border: "1px solid",
								borderColor: "divider",
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
									opacity: 0.03,
									transform: "rotate(-15deg)",
									pointerEvents: "none",
									color: `${statusColor}.main`,
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
												{formatCurrency(payment.amount_received, payment.currency)}
											</Typography>
											<Typography variant="caption" sx={{color: "warning.main", fontWeight: 800, display: "flex", alignItems: "center", gap: 0.5, mt: 0.5}}>
												<Iconify icon="solar:star-fall-bold" width={14} />
												+{payment.total_spark || 0} Sparks Purchased
											</Typography>
										</Box>
									</Box>
									<Chip
										label={statusText}
										size="small"
										color={statusColor}
										sx={{
											fontWeight: 800,
											px: 1,
											borderRadius: 1.5,
										}}
									/>
								</Stack>

								<Divider sx={{borderStyle: "dashed"}} />

								{/* Details row */}
								<Stack direction="row" justifyContent="space-between" flexWrap="wrap" useFlexGap sx={{gap: 2}}>
									<Box sx={{ minWidth: 150 }}>
										<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, display: "block", mb: 0.5}}>
											TRANSACTION ID
										</Typography>
										<Typography variant="body2" sx={{fontWeight: 700, fontFamily: "monospace", wordBreak: "break-all"}}>
											{payment.payment_intent_id || `ID: ${payment.id}`}
										</Typography>
									</Box>
									<Box>
										<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, display: "block", mb: 0.5}}>
											PROVIDER
										</Typography>
										<Stack direction="row" alignItems="center" spacing={1}>
											<Iconify icon={getMethodIcon(payment.provider)} width={20} />
											<Typography variant="body2" sx={{fontWeight: 700, textTransform: "capitalize"}}>
												{payment.provider}
											</Typography>
										</Stack>
									</Box>
								</Stack>

								<Grid container spacing={2}>
									<Grid size={{xs: 6}}>
										<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, display: "block", mb: 0.5}}>
											CREATED DATE
										</Typography>
										<Typography variant="body2" sx={{fontWeight: 700}}>
											{fDate(payment.created_at)}
										</Typography>
									</Grid>
									{payment.verified_at && (
										<Grid size={{xs: 6}}>
											<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800, display: "block", mb: 0.5}}>
												VERIFIED DATE
											</Typography>
											<Typography variant="body2" sx={{fontWeight: 700, color: "success.main"}}>
												{fDateTime(payment.verified_at)}
											</Typography>
										</Grid>
									)}
								</Grid>
							</Stack>
						</Card>
					</Grid>
				);
			})}
		</Grid>
	);
};

export default PaymentsTab;
