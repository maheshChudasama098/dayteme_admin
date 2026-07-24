import React, {useState, useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useDispatch} from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import {useTheme, alpha} from "@mui/material/styles";
import {Table} from "antd";

import {AdminRoutes} from "src/routes/routes";
import Iconify from "src/components/common/iconify";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import {CustomActionIconButton} from "src/components/common/CustomActionIconButton";
import {GetAdminSafetyQueueServices, PostAcknowledgeSafetyIncidentServices, PostResolveSafetyIncidentServices} from "src/services/Safety.Services";
import {sweetAlertQuestion, sweetAlerts, sweetAlertSuccess} from "src/utils/sweet-alerts";
import {fDate, getErrorMessage} from "src/utils/utils";

export default function SafetyQueue() {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();

	// pagination and search
	const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
	const [pageSize, setPageSize] = useState(Number(searchParams.get("pageSize")) || 10);
	const [totalRecord, setTotalRecord] = useState(0);
	const [search, setSearch] = useState(searchParams.get("search") || "");
	const [status, setStatus] = useState(searchParams.get("status") || "all");

	const [list, setList] = useState([]);
	const [apiFlag, setApiFlag] = useState(false);
	const [loadingLoader, setLoadingLoader] = useState(false);

	// Resolve dialog state
	const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
	const [selectedIncidentId, setSelectedIncidentId] = useState(null);
	const [resolveNotes, setResolveNotes] = useState("");
	const [resolving, setResolving] = useState(false);

	useEffect(() => {
		function apiCallAction() {
			setLoadingLoader(true);

			const payLoad = {
				page,
				per_page: pageSize,
				search: search || undefined,
				status: status === "all" ? undefined : status,
			};

			dispatch(
				GetAdminSafetyQueueServices(payLoad, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setList(res?.data?.incidents || []);
						if (res?.data?.pagination) {
							setTotalRecord(res?.data?.pagination?.total || res?.data?.incidents?.length || 0);
						} else {
							setTotalRecord(res?.data?.incidents?.length || 0);
						}
					} else {
						setList([]);
						setTotalRecord(0);
					}
				}),
			);
		}
		apiCallAction();
	}, [dispatch, apiFlag, search, page, pageSize, status]);

	useEffect(() => {
		setSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			...(search && {search}),
			status,
		});
	}, [setSearchParams, page, pageSize, search, status]);

	const handleStatusTabChange = (event, newValue) => {
		setStatus(newValue);
		setPage(1);
	};

	const handleAcknowledge = (id) => {
		sweetAlertQuestion("Do you want to acknowledge this safety incident? This will alert the user and start the response clock.", "Acknowledge Incident?").then((result) => {
			if (result) {
				dispatch(
					PostAcknowledgeSafetyIncidentServices(id, (res) => {
						if (res?.success) {
							setApiFlag(!apiFlag);
							sweetAlertSuccess("Incident acknowledged successfully.");
						} else {
							sweetAlerts("error", getErrorMessage(res) || "Failed to acknowledge incident.");
						}
					}),
				);
			}
		});
	};

	const handleOpenResolveDialog = (id) => {
		setSelectedIncidentId(id);
		setResolveNotes("");
		setResolveDialogOpen(true);
	};

	const handleCloseResolveDialog = () => {
		setResolveDialogOpen(false);
		setSelectedIncidentId(null);
		setResolveNotes("");
	};

	const handleSubmitResolve = () => {
		if (!selectedIncidentId) return;
		setResolving(true);
		dispatch(
			PostResolveSafetyIncidentServices(selectedIncidentId, {notes: resolveNotes}, (res) => {
				setResolving(false);
				if (res?.success) {
					handleCloseResolveDialog();
					setApiFlag(!apiFlag);
					sweetAlertSuccess("Incident resolved successfully and distress signal turned off.");
				} else {
					sweetAlerts("error", getErrorMessage(res) || "Failed to resolve incident.");
				}
			}),
		);
	};

	const getStatusColor = (incidentStatus) => {
		switch (incidentStatus?.toLowerCase()) {
			case "active":
				return "error";
			case "acknowledged":
				return "warning";
			case "resolved":
				return "success";
			default:
				return "default";
		}
	};

	const columns = [
		{
			title: "Distressed User",
			key: "user",
			fixed: "left",
			width: 250,
			render: (_, record) => {
				const u = record?.user || {};
				const isActive = record?.status?.toLowerCase() === "active";
				return (
					<Stack direction="row" alignItems="center" spacing={1.5} sx={{py: 0.5}}>
						<Box sx={{position: "relative"}}>
							<Avatar
								variant="rounded"
								src={u?.image}
								alt={u?.name}
								sx={{
									bgcolor: alpha(isActive ? theme.palette.error.main : theme.palette.primary.main, 0.1),
									color: isActive ? "error.main" : "primary.main",
								}}>
								{u?.name?.charAt(0)}
							</Avatar>

							{isActive && (
								<Box
									className="sos-pulse"
									sx={{
										position: "absolute",
										top: -4,
										right: -4,
										width: 12,
										height: 12,
										borderRadius: "50%",
										bgcolor: "error.main",
										border: `2px solid ${theme.palette.background.paper}`,
									}}
								/>
							)}
						</Box>
						<Box>
							<Typography variant="subtitle2" sx={{color: isActive ? "error.main" : "text.primary"}}>
								{u?.name || "Unknown User"}
							</Typography>
							<Typography variant="caption" color="text.secondary" display="block">
								{u?.email}
							</Typography>
							{/* <Typography variant="caption" color="text.secondary" display="block">
								{u?.phone_number || "No Phone"}
							</Typography> */}
						</Box>
					</Stack>
				);
			},
		},
		{
			title: "Date Plan ID",
			dataIndex: "date_plan_id",
			key: "date_plan_id",
			width: 120,
			render: (val) => <Chip label={`Plan #${val}`} size="small" variant="outlined" sx={{fontWeight: 600, borderRadius: 1}} />,
		},
		{
			title: "Triggered At",
			dataIndex: "triggered_at",
			key: "triggered_at",
			width: 180,
			render: (val) => (
				<Typography variant="subtitle2" color="text.primary">
					{fDate(val)}
				</Typography>
			),
		},
		{
			title: "Status",
			key: "status",
			width: 140,
			render: (_, record) => {
				const s = record?.status || "active";
				return <Chip label={s.toUpperCase()} size="small" color={getStatusColor(s)} variant="soft" sx={{fontWeight: 800, borderRadius: 1.5}} />;
			},
		},
		{
			title: "Handling Info",
			key: "handling_info",
			width: 250,
			render: (_, record) => {
				const isResolved = record?.status?.toLowerCase() === "resolved";
				const isAck = record?.status?.toLowerCase() === "acknowledged";
				if (isResolved) {
					return (
						<Stack spacing={0.5}>
							{/* <Typography variant="caption" display="block" color="text.secondary">
								Resolved by Admin ID: <strong>{record?.resolved_by || "System"}</strong>
							</Typography> */}
							{record?.notes && (
								<Typography variant="caption" color="text.secondary" sx={{fontStyle: "italic"}} noWrap>
									"{record.notes}"
								</Typography>
							)}
						</Stack>
					);
				}
				if (isAck) {
					return (
						<Typography variant="caption" color="text.secondary">
							Acknowledged by Admin ID: <strong>{record?.acknowledged_by || "System"}</strong>
						</Typography>
					);
				}
				return (
					<Typography variant="caption" color="error.main" sx={{fontWeight: 600}}>
						Awaiting Response
					</Typography>
				);
			},
		},
		{
			title: "Action",
			key: "action",
			fixed: "right",
			align: "center",
			width: 160,
			render: (_, record) => {
				const s = record?.status?.toLowerCase() || "active";
				return (
					<Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
						{s === "active" && (
							<Tooltip title="Acknowledge Incident">
								<Button
									size="small"
									variant="contained"
									color="warning"
									onClick={(e) => {
										e.stopPropagation();
										handleAcknowledge(record.id);
									}}
									sx={{fontSize: "0.75rem", fontWeight: 700}}>
									Ack
								</Button>
							</Tooltip>
						)}
						{s === "acknowledged" && (
							<Tooltip title="Resolve Incident">
								<Button
									size="small"
									variant="contained"
									color="success"
									onClick={(e) => {
										e.stopPropagation();
										handleOpenResolveDialog(record.id);
									}}
									sx={{fontSize: "0.75rem", fontWeight: 700}}>
									Resolve
								</Button>
							</Tooltip>
						)}
						<Tooltip title="View Evidence Logs">
							<CustomActionIconButton
								color="info"
								onClick={(e) => {
									e.stopPropagation();
									navigate(`${AdminRoutes?.SafetyIncidentDetails}?id=${record.id}`);
								}}>
								<Iconify icon="solar:eye-bold-duotone" width={16} />
							</CustomActionIconButton>
						</Tooltip>
					</Stack>
				);
			},
		},
	];

	return (
		<Stack spacing={4}>
			<Stack spacing={2} direction={{xs: "column", md: "row"}} sx={{justifyContent: "space-between", alignItems: {xs: "flex-start", md: "center"}}}>
				<Box>
					<Typography variant="h3" fontWeight={800} color="text.primary" gutterBottom sx={{display: "flex", alignItems: "center", gap: 1}}>
						Safety Queue (SOS)
					</Typography>
					<Typography variant="body1" sx={{color: "text.secondary"}}>
						Monitor and manage real-time distress safety incidents triggered by platform users.
					</Typography>
				</Box>
			</Stack>

			{/* Custom Pulse Styling for SOS signals */}

			<Card sx={{borderRadius: 4, boxShadow: theme.shadows[2], overflow: "hidden"}}>
				<Stack spacing={2}>
					<Box sx={{px: 2, pt: 1}}>
						<Tabs value={status} onChange={handleStatusTabChange} aria-label="safety queue status tabs">
							<Tab label="All Incidents" value="all" sx={{fontWeight: 700}} />
							<Tab label="Active SOS" value="active" sx={{fontWeight: 700}} />
							<Tab label="Acknowledged" value="acknowledged" sx={{fontWeight: 700}} />
							<Tab label="Resolved" value="resolved" sx={{fontWeight: 700}} />
						</Tabs>
					</Box>

					<Stack spacing={1} direction="row" sx={{m: 2, px: 2, pt: 1, justifyContent: "space-between", alignItems: "center"}}>
						<CustomSearchInput loading={loadingLoader} defaultValue={search} callBack={setSearch} placeholder="Search by distressed user name, email or phone..." width={{xs: "100%", md: 400}} />
					</Stack>

					<Table
						className="custom-ant-table"
						columns={
							!loadingLoader
								? columns
								: columns.map((col) => ({
										...col,
										render: () => <Skeleton variant="rounded" animation="wave" sx={{width: "100%", height: 32, borderRadius: 1}} />,
									}))
						}
						dataSource={!loadingLoader ? list : [...Array(pageSize)].map((_, i) => ({key: i}))}
						scroll={{x: "max-content"}}
						pagination={false}
						rowKey="id"
						onRow={(record) => ({
							onClick: () => {
								if (record.id) {
									navigate(`${AdminRoutes?.SafetyIncidentDetails}?id=${record.id}`);
								}
							},
							style: {cursor: "pointer"},
						})}
					/>

					<CustomPagination
						current={page}
						pageSize={pageSize}
						total={totalRecord}
						onShowSizeChange={(p, ps) => {
							setPage(p);
							setPageSize(ps);
						}}
						onChange={(e) => setPage(e)}
					/>
				</Stack>
			</Card>

			{/* Resolve Dialog */}
			<Dialog open={resolveDialogOpen} onClose={handleCloseResolveDialog} fullWidth maxWidth="xs">
				<DialogTitle sx={{fontWeight: 800}}>Resolve Safety Incident</DialogTitle>
				<DialogContent>
					<Typography variant="body2" sx={{color: "text.secondary", mb: 2}}>
						Please input resolution details/notes before closing the active distress state.
					</Typography>
					<TextField
						label="Resolution Notes"
						multiline
						rows={4}
						fullWidth
						value={resolveNotes}
						onChange={(e) => setResolveNotes(e.target.value)}
						placeholder="e.g. Spoke to user. Confirmed safe. False alarm."
					/>
				</DialogContent>
				<DialogActions sx={{px: 3, pb: 3}}>
					<Button onClick={handleCloseResolveDialog} variant="outlined" disabled={resolving}>
						Cancel
					</Button>
					<Button onClick={handleSubmitResolve} variant="contained" color="success" disabled={!resolveNotes.trim() || resolving}>
						{resolving ? "Resolving..." : "Resolve & Turn Off Alert"}
					</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
}
