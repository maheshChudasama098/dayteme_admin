import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useTheme, alpha } from "@mui/material/styles";
import { Table } from "antd";

import { AdminRoutes } from "src/routes/routes";
import Iconify from "src/components/common/iconify";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import { CustomActionIconButton } from "src/components/common/CustomActionIconButton";

// Mock data for Verification Queue
const MOCK_DATA = [
	{ id: "V-9021", userId: "U-110", name: "Alice Johnson", email: "alice@example.com", image: "", submittedAt: "2026-07-06 14:30", type: "Government ID", idType: "Passport", status: "Pending", riskScore: 24, queueTime: "15 mins", assignedAdmin: "Unassigned" },
	{ id: "V-9022", userId: "U-402", name: "Mahesh Chudasama", email: "mahesh@example.com", image: "", submittedAt: "2026-07-06 13:45", type: "Face Match", idType: "Aadhaar Card", status: "Manual Review", riskScore: 88, queueTime: "1 hr 10 mins", assignedAdmin: "Mark Steave" },
	{ id: "V-9023", userId: "U-918", name: "Priya Sharma", email: "priya@example.com", image: "", submittedAt: "2026-07-06 12:00", type: "Selfie Verification", idType: "None", status: "Approved", riskScore: 5, queueTime: "-", assignedAdmin: "Auto-System" },
	{ id: "V-9024", userId: "U-332", name: "John Doe", email: "john@example.com", image: "", submittedAt: "2026-07-06 11:20", type: "Government ID", idType: "Driving License", status: "Rejected", riskScore: 95, queueTime: "-", assignedAdmin: "Mark Steave" },
	{ id: "V-9025", userId: "U-754", name: "Rahul Verma", email: "rahul@example.com", image: "", submittedAt: "2026-07-06 10:15", type: "Face Match", idType: "National ID", status: "Duplicate Account", riskScore: 99, queueTime: "-", assignedAdmin: "Mark Steave" },
];

export default function VerificationList() {
	const theme = useTheme();
	const navigate = useNavigate();
	
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [search, setSearch] = useState("");

	const getStatusColor = (status) => {
		switch (status) {
			case 'Approved': return 'success';
			case 'Pending': return 'warning';
			case 'Manual Review': return 'info';
			case 'Rejected': return 'error';
			case 'Duplicate Account': return 'error';
			default: return 'default';
		}
	};

	const columns = [
		{
			title: "User Info",
			key: "user",
			fixed: "left",
			width: 250,
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1.5}>
					<Avatar variant="rounded" sx={{width: 40, height: 40}} src={record.image} alt={record.name} />
					<Box>
						<Typography variant="subtitle2" color="text.primary" noWrap sx={{fontWeight: 700}}>
							{record.name}
						</Typography>
						<Typography variant="caption" color="text.secondary" noWrap>
							ID: {record.userId}
						</Typography>
					</Box>
				</Stack>
			),
		},
		{
			title: "Verification Details",
			key: "details",
			width: 200,
			render: (_, record) => (
				<Stack direction="column">
					<Typography variant="subtitle2" sx={{color: "text.primary", fontWeight: 600}}>
						{record.type}
					</Typography>
					<Typography variant="caption" sx={{color: "text.secondary"}}>
						Doc: {record.idType}
					</Typography>
				</Stack>
			),
		},
		{
			title: "Status",
			key: "status",
			width: 150,
			render: (_, record) => (
				<Chip
					label={record.status}
					size="small"
					color={getStatusColor(record.status)}
					variant="soft"
					sx={{fontWeight: 800, borderRadius: 1}}
				/>
			),
		},
		{
			title: "Risk Score",
			key: "risk",
			width: 120,
			render: (_, record) => {
				const color = record.riskScore > 80 ? "error.main" : record.riskScore > 50 ? "warning.main" : "success.main";
				return (
					<Typography variant="subtitle2" sx={{fontWeight: 800, color}}>
						{record.riskScore}/100
					</Typography>
				);
			}
		},
		{
			title: "Queue Time",
			key: "queue",
			width: 150,
			render: (_, record) => (
				<Stack direction="column">
					<Typography variant="caption" sx={{color: "text.primary", fontWeight: 600}}>
						{record.queueTime}
					</Typography>
					<Typography variant="caption" sx={{color: "text.secondary"}}>
						Assigned: {record.assignedAdmin}
					</Typography>
				</Stack>
			),
		},
		{
			title: "Submitted",
			key: "submitted",
			width: 150,
			render: (_, record) => (
				<Typography variant="caption" sx={{color: "text.primary", fontWeight: 600}}>
					{record.submittedAt}
				</Typography>
			),
		},
		{
			title: "Action",
			key: "action",
			fixed: "right",
			align: "center",
			width: 100,
			render: (_, record) => (
				<Tooltip title="Review Verification">
					<CustomActionIconButton
						color="primary"
						onClick={(e) => {
							e.stopPropagation();
							navigate(`${AdminRoutes?.VerificationDetails}?id=${record.id}`);
						}}>
						<Iconify icon="solar:document-text-bold-duotone" width={18} />
					</CustomActionIconButton>
				</Tooltip>
			),
		},
	];

	return (
		<Stack spacing={4}>
			<Stack spacing={2} direction={{xs: 'column', md: 'row'}} sx={{justifyContent: "space-between", alignItems: {xs: 'flex-start', md: 'center'}}}>
				<Box>
					<Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
						Verification Management
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						Review identity verifications to ensure a safe and genuine dating environment.
					</Typography>
				</Box>

				<Stack spacing={1.5} direction="row" flexWrap="wrap">
					<Button variant="outlined" color="primary" startIcon={<Iconify icon="solar:sort-by-time-bold-duotone" />} sx={{borderRadius: 8, fontWeight: 700}}>
						Auto-Assign Queue
					</Button>
				</Stack>
			</Stack>

			<Card sx={{ borderRadius: 4, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', border: 'none' }}>
				<Stack spacing={2}>
					<Stack spacing={2} direction="row" sx={{m: 2, px: 1, pt: 1, justifyContent: "space-between", alignItems: "center"}}>
						<CustomSearchInput loading={false} defaultValue={search} callBack={setSearch} placeholder="Search by name, User ID..." width={{xs: '100%', md: 400}} />
						<Stack direction="row" spacing={1}>
							<Button variant="outlined" startIcon={<Iconify icon="solar:filter-bold-duotone" />} sx={{borderRadius: 8}}>
								Filters
							</Button>
						</Stack>
					</Stack>
					<Box
						sx={{
							"& .ant-table-wrapper": {borderRadius: 0},
							"& .ant-table": {background: "transparent"},
							"& .ant-table-thead > tr > th": {
								background: alpha(theme.palette.primary.main, 0.04),
								fontWeight: 800,
								color: "text.secondary",
								borderBottom: `1px solid ${theme.palette.divider}`,
								textTransform: "uppercase",
								fontSize: "0.75rem",
								letterSpacing: 0.5,
							},
							"& .ant-table-tbody > tr > td": {
								borderBottom: `1px dashed ${theme.palette.divider}`,
								py: 2,
							},
							"& .ant-table-tbody > tr:hover > td": {
								background: alpha(theme.palette.primary.main, 0.02),
							},
							"& .ant-table-tbody > tr:last-child > td": {
								borderBottom: "none",
							},
						}}>
						<Table
							className="custom-ant-table"
							columns={columns}
							dataSource={MOCK_DATA}
							scroll={{x: "max-content"}}
							pagination={false}
							rowKey="id"
							onRow={(record) => ({
								onClick: () => navigate(`${AdminRoutes?.VerificationDetails}?id=${record.id}`),
								style: {cursor: "pointer"},
							})}
						/>
					</Box>

					<Box sx={{p: 2, borderTop: `1px solid ${theme.palette.divider}`}}>
						<CustomPagination
							current={page}
							pageSize={pageSize}
							total={5}
							onShowSizeChange={(p, ps) => {
								setPage(p);
								setPageSize(ps);
							}}
							onChange={(e) => setPage(e)}
						/>
					</Box>
				</Stack>
			</Card>
		</Stack>
	);
}
