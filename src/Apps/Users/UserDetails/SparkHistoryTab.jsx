import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {useTheme, alpha} from "@mui/material/styles";
import Iconify from "src/components/common/iconify";
import { fDate } from "src/utils/utils";

const SparkHistoryTab = ({user}) => {
	const theme = useTheme();
	const sparkHistory = user?.spark_history || [];

	return (
		<Stack spacing={3}>
			<Card sx={{p: 4, borderRadius: 4, boxShadow: theme.shadows[1], position: "relative", overflow: "hidden"}}>
				{/* Watermark */}
				<Iconify
					icon="solar:star-fall-bold-duotone"
					sx={{
						position: "absolute",
						top: -20,
						right: -20,
						width: 140,
						height: 140,
						opacity: 0.03,
						transform: "rotate(-15deg)",
						pointerEvents: "none",
						color: "warning.main",
					}}
				/>

				<Stack direction="row" spacing={2} alignItems="center" mb={4} sx={{position: "relative", zIndex: 1}}>
					<Box sx={{p: 1.5, borderRadius: 2.5, bgcolor: alpha(theme.palette.warning.main, 0.1), color: "warning.main", display: "flex", alignItems: "center", justifyContent: "center"}}>
						<Iconify icon="solar:star-fall-bold-duotone" width={28} />
					</Box>
					<Box sx={{flexGrow: 1}}>
						<Typography variant="h5" sx={{fontWeight: 800}}>
							Spark History
						</Typography>
					</Box>
					<Stack direction="row" spacing={1} alignItems="center">
						<Typography variant="body2" color="text.secondary" fontWeight={600}>
							Total Balance:
						</Typography>
						<Typography variant="h6" fontWeight={800} color="warning.main">
							{user?.total_spark || 0}
						</Typography>
					</Stack>
				</Stack>

				<Box sx={{position: "relative", zIndex: 1}}>
					{sparkHistory.length > 0 ? (
						<TableContainer sx={{borderRadius: 2, border: "1px solid", borderColor: "divider"}}>
							<Table>
								<TableHead sx={{bgcolor: alpha(theme.palette.text.primary, 0.03)}}>
									<TableRow>
										<TableCell sx={{fontWeight: 700}}>Date & Time</TableCell>
										<TableCell sx={{fontWeight: 700}}>Description</TableCell>
										<TableCell sx={{fontWeight: 700}}>Type</TableCell>
										<TableCell sx={{fontWeight: 700}} align="right">Amount</TableCell>
										<TableCell sx={{fontWeight: 700}} align="right">Balance Before</TableCell>
										<TableCell sx={{fontWeight: 700}} align="right">Balance After</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{sparkHistory.map((row) => (
										<TableRow key={row.id} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
											<TableCell sx={{fontWeight: 600}}>
												{fDate(row.created_at)}
											</TableCell>
											<TableCell>
												{row.description}
											</TableCell>
											<TableCell>
												<Chip 
													label={row.type.toUpperCase()} 
													size="small" 
													color={row.type === "credit" ? "success" : "error"} 
													sx={{fontWeight: 700, borderRadius: 1}} 
												/>
											</TableCell>
											<TableCell align="right" sx={{fontWeight: 700, color: row.type === "credit" ? "success.main" : "error.main"}}>
												{row.type === "credit" ? "+" : "-"}{row.amount}
											</TableCell>
											<TableCell align="right" sx={{fontWeight: 600, color: "text.secondary"}}>
												{row.balance_before}
											</TableCell>
											<TableCell align="right" sx={{fontWeight: 700}}>
												{row.balance_after}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					) : (
						<Box sx={{p: 4, textAlign: "center", bgcolor: alpha(theme.palette.text.primary, 0.03), borderRadius: 2, border: "1px dashed", borderColor: "divider"}}>
							<Typography variant="body2" color="text.secondary" fontWeight={600}>
								No spark history available.
							</Typography>
						</Box>
					)}
				</Box>
			</Card>
		</Stack>
	);
};

export default SparkHistoryTab;
