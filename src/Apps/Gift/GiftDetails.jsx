import React, {useEffect, useState} from "react";
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
import {useTheme, alpha} from "@mui/material/styles";

import {Table} from "antd";
import Iconify from "src/components/common/iconify";
import {GetAdminGiftDetailsServices} from "src/services/Gift.Services";
import {useDispatch} from "react-redux";

const GiftDetails = () => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");

	const [giftDetails, setGiftDetails] = useState({});

	useEffect(() => {
		function apiCallAction() {
			dispatch(
				GetAdminGiftDetailsServices(id, (res) => {
					if (res?.success) {
						setGiftDetails(res?.data || {});
					}
				}),
			);
		}
		if (id) {
			apiCallAction();
		}
	}, [dispatch, id]);

	const buyersList = [
		{id: 101, name: "Alice Johnson", date: "Jun 20, 2026", avatar: "https://randomuser.me/api/portraits/women/44.jpg"},
		{id: 102, name: "Bob Smith", date: "Jun 19, 2026", avatar: "https://randomuser.me/api/portraits/men/32.jpg"},
		{id: 103, name: "Charlie Davis", date: "Jun 18, 2026", avatar: "https://randomuser.me/api/portraits/men/46.jpg"},
		{id: 104, name: "Diana Evans", date: "Jun 15, 2026", avatar: "https://randomuser.me/api/portraits/women/68.jpg"},
		{id: 105, name: "Evan Stone", date: "Jun 14, 2026", avatar: "https://randomuser.me/api/portraits/men/22.jpg"},
	];

	const columns = [
		{
			title: "User",
			key: "user",
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={2} sx={{py: 1}}>
					<Avatar src={record.avatar} sx={{width: 44, height: 44, bgcolor: alpha(theme.palette.primary.main, 0.1)}} />
					<Box>
						<Typography variant="subtitle2" sx={{fontWeight: 800}}>
							{record.name}
						</Typography>
						<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 700}}>
							ID: #{record.id}
						</Typography>
					</Box>
				</Stack>
			),
		},
		{
			title: "Purchase Date",
			dataIndex: "date",
			key: "date",
			render: (text) => (
				<Chip label={text} size="small" icon={<Iconify icon="solar:calendar-bold" width={14} />} sx={{bgcolor: alpha(theme.palette.text.primary, 0.05), border: "none", fontWeight: 700}} />
			),
		},
		{
			title: "Status",
			key: "status",
			render: () => (
				<Chip
					label="Completed"
					size="small"
					sx={{
						bgcolor: alpha(theme.palette.success.main, 0.1),
						color: "success.main",
						fontWeight: 800,
						border: "none",
					}}
				/>
			),
		},
	];

	return (
		<Stack spacing={4}>
			{/* Header */}
			<Stack spacing={2} direction="row" sx={{justifyContent: "space-between", alignItems: "flex-start"}}>
				<Box>
					<Typography variant="h3" fontWeight={800} color="text.primary" gutterBottom>
						Gift Details
					</Typography>
					<Typography variant="body1" sx={{color: "text.secondary"}}>
						View detailed gift information and track user purchases.
					</Typography>
				</Box>

				<Button color="primary" variant="outlined" startIcon={<Iconify icon="eva:arrow-back-fill" />} onClick={() => navigate(-1)} sx={{borderRadius: 2, fontWeight: 800}}>
					Back
				</Button>
			</Stack>

			<Grid container spacing={4}>
				{/* Gift Info Card */}
				<Grid size={{xs: 12, md: 4}}>
					<Card
						sx={{
							p: 4,
							textAlign: "center",
							borderRadius: 4,
							boxShadow: theme.shadows[2],
							position: "relative",
							overflow: "hidden",
						}}>
						{/* Background watermark */}
						<Iconify
							icon="solar:gift-bold-duotone"
							sx={{
								position: "absolute",
								top: -20,
								left: -20,
								width: 160,
								height: 160,
								opacity: 0.03,
								transform: "rotate(-15deg)",
								pointerEvents: "none",
								color: "primary.main",
							}}
						/>

						<Avatar src={giftDetails?.image?.file_name} sx={{width: 96, height: 96, mx: "auto", mb: 3, bgcolor: alpha(theme.palette.secondary.main, 0.1), color: "secondary.main"}}>
							{!giftDetails?.image?.file_name && <Iconify icon="solar:gift-bold-duotone" width={48} />}
						</Avatar>

						<Typography variant="h5" sx={{fontWeight: 800, mb: 1}}>
							{giftDetails?.title || "Unknown Gift"}
						</Typography>

						<Chip
							label={`Type: ${giftDetails?.type || "Unknown"}`}
							size="small"
							sx={{
								mb: 4,
								fontWeight: 800,
								bgcolor: alpha(theme.palette.primary.main, 0.1),
								color: "primary.main",
								border: "none",
							}}
						/>

						<Divider sx={{borderStyle: "dashed", mb: 3}} />

						<Stack direction="row" justifyContent="space-around">
							<Box>
								<Box sx={{display: "flex", justifyContent: "center", alignItems: "center", mb: 0.5}}>
									<Typography variant="h4" sx={{fontWeight: 800, color: "text.primary"}}>
										{giftDetails?.required_coins || 0}
									</Typography>
								</Box>
								<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800}}>
									REQUIRED SPARKS
								</Typography>
							</Box>
							<Divider orientation="vertical" flexItem sx={{borderStyle: "dashed"}} />
							<Box>
								<Box sx={{display: "flex", justifyContent: "center", alignItems: "center", mb: 0.5}}>
									<Typography variant="h4" sx={{fontWeight: 800, color: "text.primary"}}>
										0
									</Typography>
								</Box>
								<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 800}}>
									TOTAL SENT
								</Typography>
							</Box>
						</Stack>
					</Card>
				</Grid>

				{/* Table Section */}
				<Grid size={{xs: 12, md: 8}}>
					<Card sx={{height: "100%", borderRadius: 4, boxShadow: theme.shadows[2]}}>
						<Box sx={{p: 3, borderBottom: `1px dashed ${theme.palette.divider}`}}>
							<Typography variant="h6" sx={{fontWeight: 800}}>
								Purchased By
							</Typography>
							<Typography variant="body2" color="text.secondary">
								List of users who recently purchased this gift
							</Typography>
						</Box>

						<Box sx={{p: 0}}>
							{/* Custom styles to override Ant Design table defaults and make it modern */}
							<Box
								sx={{
									"& .ant-table-wrapper": {borderRadius: 0},
									"& .ant-table": {background: "transparent"},
									"& .ant-table-thead > tr > th": {
										background: alpha(theme.palette.text.primary, 0.02),
										fontWeight: 800,
										color: "text.secondary",
										borderBottom: `1px dashed ${theme.palette.divider}`,
										textTransform: "uppercase",
										fontSize: "0.75rem",
									},
									"& .ant-table-tbody > tr > td": {
										borderBottom: `1px dashed ${theme.palette.divider}`,
									},
									"& .ant-table-tbody > tr:last-child > td": {
										borderBottom: "none",
									},
								}}>
								<Table className="custom-ant-table" columns={columns} dataSource={buyersList} rowKey="id" pagination={false} />
							</Box>
						</Box>
					</Card>
				</Grid>
			</Grid>
		</Stack>
	);
};

export default GiftDetails;
