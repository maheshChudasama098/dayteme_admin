import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import {useTheme, alpha} from "@mui/material/styles";
import {Table} from "antd";

import {AdminRoutes} from "src/routes/routes";
import Iconify from "src/components/common/iconify";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import {CustomActionIconButton} from "src/components/common/CustomActionIconButton";

// Mock data for Compliance Documents
const MOCK_DATA = [
	{
		id: "DOC-001",
		title: "Company Registration Certificate",
		category: "Legal Registration",
		responsiblePerson: "Mark Steave",
		uploadDate: "2024-01-15",
		expiryDate: "2029-01-14",
		status: "Valid",
		lastUpdated: "2024-01-15",
	},
	{
		id: "DOC-002",
		title: "GST Registration",
		category: "Tax & Finance",
		responsiblePerson: "Mark Steave",
		uploadDate: "2024-02-10",
		expiryDate: "2027-02-09",
		status: "Valid",
		lastUpdated: "2024-02-10",
	},
	{
		id: "DOC-003",
		title: "Business License",
		category: "Operations",
		responsiblePerson: "Sarah Johnson",
		uploadDate: "2025-05-20",
		expiryDate: "2026-08-01",
		status: "Expiring Soon",
		lastUpdated: "2025-05-20",
	},
	{
		id: "DOC-004",
		title: "Data Protection Policy",
		category: "Privacy",
		responsiblePerson: "Legal Team",
		uploadDate: "2022-11-01",
		expiryDate: "2024-11-01",
		status: "Expired",
		lastUpdated: "2023-05-15",
	},
	{id: "DOC-005", title: "Payment Gateway Agreement", category: "Vendor Agreements", responsiblePerson: "Finance Team", uploadDate: "-", expiryDate: "-", status: "Missing", lastUpdated: "-"},
];

export default function ComplianceList() {
	const theme = useTheme();
	const navigate = useNavigate();

	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [search, setSearch] = useState("");

	const getStatusColor = (status) => {
		switch (status) {
			case "Valid":
				return "success";
			case "Expiring Soon":
				return "warning";
			case "Expired":
				return "error";
			case "Missing":
				return "default";
			default:
				return "default";
		}
	};

	const columns = [
		{
			title: "Document Title",
			key: "title",
			fixed: "left",
			width: 280,
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1.5}>
					<Box sx={{width: 40, height: 40, borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main"}}>
						<Iconify icon="solar:document-text-bold-duotone" width={24} />
					</Box>
					<Box>
						<Typography variant="subtitle2" color="text.primary" noWrap sx={{fontWeight: 700}}>
							{record.title}
						</Typography>
						<Typography variant="caption" color="text.secondary" noWrap>
							ID: {record.id}
						</Typography>
					</Box>
				</Stack>
			),
		},
		{
			title: "Category",
			dataIndex: "category",
			key: "category",
			width: 180,
			render: (text) => (
				<Typography variant="subtitle2" sx={{fontWeight: 600}}>
					{text}
				</Typography>
			),
		},
		{
			title: "Status",
			key: "status",
			width: 150,
			render: (_, record) => <Chip label={record.status} size="small" color={getStatusColor(record.status)} variant="soft" sx={{fontWeight: 800, borderRadius: 1}} />,
		},
		{
			title: "Responsible",
			dataIndex: "responsiblePerson",
			key: "responsiblePerson",
			width: 160,
			render: (text) => (
				<Typography variant="caption" sx={{color: "text.primary", fontWeight: 600}}>
					{text}
				</Typography>
			),
		},
		{
			title: "Expiry Date",
			key: "expiryDate",
			width: 150,
			render: (_, record) => (
				<Typography variant="subtitle2" sx={{color: record.status === "Expired" ? "error.main" : record.status === "Expiring Soon" ? "warning.main" : "text.primary", fontWeight: 700}}>
					{record.expiryDate}
				</Typography>
			),
		},
		{
			title: "Last Updated",
			dataIndex: "lastUpdated",
			key: "lastUpdated",
			width: 150,
			render: (text) => (
				<Typography variant="caption" sx={{color: "text.secondary", fontWeight: 600}}>
					{text}
				</Typography>
			),
		},
		{
			title: "Action",
			key: "action",
			fixed: "right",
			align: "center",
			width: 120,
			render: (_, record) => (
				<Stack spacing={0.5} direction="row" sx={{justifyContent: "center"}}>
					<Tooltip title="View Details">
						<CustomActionIconButton
							color="primary"
							onClick={(e) => {
								e.stopPropagation();
								navigate(`${AdminRoutes?.ComplianceDetails}?id=${record.id}`);
							}}>
							<Iconify icon="solar:eye-bold-duotone" width={18} />
						</CustomActionIconButton>
					</Tooltip>
					<Tooltip title="Download Document">
						<CustomActionIconButton
							color="info"
							disabled={record.status === "Missing"}
							onClick={(e) => {
								e.stopPropagation();
								// download logic
							}}>
							<Iconify icon="solar:download-square-bold-duotone" width={18} />
						</CustomActionIconButton>
					</Tooltip>
				</Stack>
			),
		},
	];

	return (
		<Stack spacing={4}>
			<Stack spacing={2} direction={{xs: "column", md: "row"}} sx={{justifyContent: "space-between", alignItems: {xs: "flex-start", md: "center"}}}>
				<Box>
					<Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
						Compliance Management
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						Track and manage legal, regulatory, and business compliance documents.
					</Typography>
				</Box>

				<Stack spacing={1.5} direction="row" flexWrap="wrap">
					<Button variant="outlined" color="primary" startIcon={<Iconify icon="solar:export-bold-duotone" />} sx={{borderRadius: 8, fontWeight: 700}}>
						Export Report
					</Button>
					<Button variant="contained" color="primary" startIcon={<Iconify icon="solar:document-add-bold" width={20} />} sx={{borderRadius: 8, fontWeight: 700, boxShadow: theme.shadows[4]}}>
						Upload Document
					</Button>
				</Stack>
			</Stack>

			<Stack spacing={2}>
				<Alert severity="warning" icon={<Iconify icon="solar:danger-circle-bold" width={24} />} sx={{borderRadius: 2, fontWeight: 600, "& .MuiAlert-message": {width: "100%"}}}>
					<Stack direction={{xs: "column", sm: "row"}} justifyContent="space-between" alignItems={{xs: "flex-start", sm: "center"}}>
						<span>You have 1 document expiring soon and 1 expired document. Action required.</span>
						<Button size="small" color="inherit" variant="outlined" sx={{mt: {xs: 1, sm: 0}}}>
							View Alerts
						</Button>
					</Stack>
				</Alert>
			</Stack>

			<Card sx={{borderRadius: 4, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)", border: "none"}}>
				<Stack spacing={2}>
					<Stack spacing={2} direction="row" sx={{m: 2, px: 1, pt: 1, justifyContent: "space-between", alignItems: "center"}}>
						<CustomSearchInput loading={false} defaultValue={search} callBack={setSearch} placeholder="Search by document title, category..." width={{xs: "100%", md: 400}} />
						<Stack direction="row" spacing={1}>
							<Button variant="outlined" startIcon={<Iconify icon="solar:filter-bold-duotone" />} sx={{borderRadius: 8}}>
								Filters
							</Button>
						</Stack>
					</Stack>
					<Box>
						<Table
							className="custom-ant-table"
							columns={columns}
							dataSource={MOCK_DATA}
							scroll={{x: "max-content"}}
							pagination={false}
							rowKey="id"
							onRow={(record) => ({
								onClick: () => navigate(`${AdminRoutes?.ComplianceDetails}?id=${record.id}`),
								style: {cursor: "pointer"},
							})}
						/>
					</Box>

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
				</Stack>
			</Card>
		</Stack>
	);
}
