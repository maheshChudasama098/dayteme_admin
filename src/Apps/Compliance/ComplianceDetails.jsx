import React, {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {useTheme, alpha} from "@mui/material/styles";
import {Table} from "antd";

import Iconify from "src/components/common/iconify";
import {sweetAlertQuestion, sweetAlertSuccess} from "src/utils/sweet-alerts";

// Mock Data
const MOCK_DETAIL = {
	id: "DOC-003",
	title: "Business License",
	category: "Operations",
	description: "Official municipal business operation license for the Mumbai corporate office.",
	responsiblePerson: "Sarah Johnson",
	uploadDate: "May 20, 2025",
	expiryDate: "August 1, 2026",
	status: "Expiring Soon",
	lastUpdated: "May 20, 2025",
	fileType: "PDF",
	fileSize: "2.4 MB",
};

const VERSION_HISTORY = [
	{version: "v2.0", date: "May 20, 2025", uploadedBy: "Sarah Johnson", notes: "Renewed license for 2025-2026", active: true},
	{version: "v1.0", date: "Jan 10, 2024", uploadedBy: "Mark Steave", notes: "Initial business license upload", active: false},
];

export default function ComplianceDetails() {
	const theme = useTheme();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");

	const [actionAnchorEl, setActionAnchorEl] = useState(null);

	const doc = MOCK_DETAIL;

	const handleAction = (actionName) => {
		setActionAnchorEl(null);
		if (actionName === "Download") {
			sweetAlertSuccess("Download started");
			return;
		}

		sweetAlertQuestion(`Are you sure you want to ${actionName.toLowerCase()}?`, `Confirm ${actionName}`).then((result) => {
			if (result) {
				sweetAlertSuccess(`Successfully executed: ${actionName}`);
			}
		});
	};

	const columns = [
		{
			title: "Version",
			dataIndex: "version",
			key: "version",
			width: 100,
			render: (text, record) => (
				<Stack direction="row" alignItems="center" spacing={1}>
					<Typography variant="subtitle2" fontWeight="700">
						{text}
					</Typography>
					{record.active && <Chip label="Current" size="small" color="success" sx={{height: 20, fontSize: "0.7rem"}} />}
				</Stack>
			),
		},
		{
			title: "Date",
			dataIndex: "date",
			key: "date",
			width: 150,
			render: (text) => (
				<Typography variant="caption" sx={{color: "text.primary", fontWeight: 600}}>
					{text}
				</Typography>
			),
		},
		{
			title: "Uploaded By",
			dataIndex: "uploadedBy",
			key: "uploadedBy",
			width: 150,
			render: (text) => (
				<Typography variant="caption" sx={{color: "text.secondary", fontWeight: 600}}>
					{text}
				</Typography>
			),
		},
		{
			title: "Notes",
			dataIndex: "notes",
			key: "notes",
			width: 250,
			render: (text) => <Typography variant="body2">{text}</Typography>,
		},
		{
			title: "Action",
			key: "action",
			fixed: "right",
			align: "center",
			width: 100,
			render: () => (
				<Button size="small" color="primary" variant="outlined" sx={{borderRadius: 1}} onClick={() => handleAction("Download")}>
					Download
				</Button>
			),
		},
	];

	return (
		<Stack spacing={4}>
			{/* Page Header */}
			<Stack spacing={2} direction={{xs: "column", md: "row"}} sx={{justifyContent: "space-between", alignItems: {xs: "flex-start", md: "center"}}}>
				<Box>
					<Typography variant="h4" fontWeight="800" color="text.primary" gutterBottom>
						Document Details: {doc.title}
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						ID: {id || doc.id} • Manage document versions, details, and renewals.
					</Typography>
				</Box>

				<Stack direction="row" spacing={1.5}>
					<Button color="inherit" variant="outlined" startIcon={<Iconify icon="eva:arrow-back-fill" />} sx={{borderRadius: 8}} onClick={() => navigate(-1)}>
						Back
					</Button>
					<Button color="primary" variant="contained" startIcon={<Iconify icon="solar:settings-bold" />} sx={{borderRadius: 8}} onClick={(e) => setActionAnchorEl(e.currentTarget)}>
						Admin Actions
					</Button>
					<Menu
						anchorEl={actionAnchorEl}
						open={Boolean(actionAnchorEl)}
						onClose={() => setActionAnchorEl(null)}
						PaperProps={{sx: {width: 220, borderRadius: 2, mt: 1, boxShadow: "0px 5px 20px rgba(0,0,0,0.1)"}}}>
						<MenuItem onClick={() => handleAction("Upload New Version")} sx={{color: "primary.main"}}>
							<Iconify icon="solar:upload-bold" sx={{mr: 2}} /> Upload New Version
						</MenuItem>
						<MenuItem onClick={() => handleAction("Renew Document")} sx={{color: "success.main"}}>
							<Iconify icon="solar:refresh-circle-bold" sx={{mr: 2}} /> Renew Expired Doc
						</MenuItem>
						<MenuItem onClick={() => handleAction("Update Information")}>
							<Iconify icon="solar:pen-bold" sx={{mr: 2}} /> Edit Information
						</MenuItem>
						<MenuItem onClick={() => handleAction("Add Internal Note")}>
							<Iconify icon="solar:document-add-bold" sx={{mr: 2}} /> Add Internal Note
						</MenuItem>
						<Divider />
						<MenuItem onClick={() => handleAction("Download")}>
							<Iconify icon="solar:download-square-bold" sx={{mr: 2}} /> Download Current
						</MenuItem>
						<MenuItem onClick={() => handleAction("Archive Document")} sx={{color: "warning.main"}}>
							<Iconify icon="solar:archive-bold" sx={{mr: 2}} /> Archive Old Versions
						</MenuItem>
					</Menu>
				</Stack>
			</Stack>

			<Grid container spacing={3}>
				{/* Left Sidebar Info */}
				<Grid size={{xs: 12, md: 4}}>
					<Stack spacing={3}>
						<Card sx={{p: 3, borderRadius: 4, boxShadow: "0 5px 25px rgba(0,0,0,0.05)", border: "none", bgcolor: alpha(theme.palette.warning.main, 0.05)}}>
							<Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{mb: 2}}>
								<Box sx={{width: 64, height: 64, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main"}}>
									<Iconify icon="solar:document-text-bold-duotone" width={32} />
								</Box>
								<Chip label={doc.status} color="warning" sx={{fontWeight: 800, borderRadius: 1}} />
							</Stack>
							<Typography variant="h6" fontWeight="800" sx={{mb: 1}}>
								{doc.title}
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
								{doc.description}
							</Typography>
							<Divider sx={{mb: 2}} />
							<Stack spacing={2}>
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">
										Category
									</Typography>
									<Typography variant="subtitle2" fontWeight="700">
										{doc.category}
									</Typography>
								</Stack>
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">
										Responsible
									</Typography>
									<Typography variant="subtitle2" fontWeight="700">
										{doc.responsiblePerson}
									</Typography>
								</Stack>
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">
										File Info
									</Typography>
									<Typography variant="subtitle2" fontWeight="700">
										{doc.fileType} • {doc.fileSize}
									</Typography>
								</Stack>
							</Stack>
						</Card>

						<Card sx={{p: 3, borderRadius: 4, boxShadow: "0 5px 25px rgba(0,0,0,0.05)", border: "none"}}>
							<Typography variant="subtitle1" fontWeight="800" sx={{mb: 2}}>
								Validity & Renewals
							</Typography>
							<Stack spacing={2}>
								<Box sx={{p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`}}>
									<Typography variant="caption" fontWeight="800" color="warning.main" sx={{mb: 0.5, display: "block"}}>
										ACTION REQUIRED
									</Typography>
									<Typography variant="body2" fontWeight="600">
										This document expires in less than 30 days. Please arrange a renewal soon.
									</Typography>
								</Box>

								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Typography variant="body2" color="text.secondary">
										Upload Date
									</Typography>
									<Typography variant="subtitle2" fontWeight="700">
										{doc.uploadDate}
									</Typography>
								</Stack>
								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Typography variant="body2" color="text.secondary">
										Expiry Date
									</Typography>
									<Typography variant="subtitle1" fontWeight="800" color="warning.main">
										{doc.expiryDate}
									</Typography>
								</Stack>
							</Stack>
						</Card>
					</Stack>
				</Grid>

				{/* Right Main Content */}
				<Grid size={{xs: 12, md: 8}}>
					<Stack spacing={3}>
						<Card sx={{p: 0, borderRadius: 4, boxShadow: "0 5px 25px rgba(0,0,0,0.05)", border: "none"}}>
							<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{p: 3, borderBottom: `1px solid ${theme.palette.divider}`}}>
								<Typography variant="h6" fontWeight="800">
									Version History
								</Typography>
								<Button size="small" variant="outlined" startIcon={<Iconify icon="solar:upload-minimalistic-bold" />} onClick={() => handleAction("Upload New Version")}>
									Upload New
								</Button>
							</Stack>
							<Box
								sx={{
									"& .ant-table-wrapper": {borderRadius: 0},
									"& .ant-table": {background: "transparent"},
									"& .ant-table-thead > tr > th": {
										background: alpha(theme.palette.primary.main, 0.02),
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
								<Table className="custom-ant-table" columns={columns} dataSource={VERSION_HISTORY} scroll={{x: "max-content"}} pagination={false} rowKey="version" />
							</Box>
						</Card>

						<Card
							sx={{
								p: 3,
								borderRadius: 4,
								boxShadow: "0 5px 25px rgba(0,0,0,0.05)",
								border: "none",
								height: 400,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								// bgcolor: alpha(theme.palette.grey[500], 0.05),
							}}>
							<Iconify icon="solar:document-text-line-duotone" width={64} sx={{color: "text.secondary", mb: 2}} />
							<Typography variant="h6" fontWeight="700" sx={{mb: 1}}>
								Document Preview
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
								Preview is not available for this file type. Please download to view.
							</Typography>
							<Button variant="contained" color="primary" sx={{borderRadius: 8, px: 4}} startIcon={<Iconify icon="solar:download-square-bold" />} onClick={() => handleAction("Download")}>
								Download Document
							</Button>
						</Card>
					</Stack>
				</Grid>
			</Grid>
		</Stack>
	);
}
