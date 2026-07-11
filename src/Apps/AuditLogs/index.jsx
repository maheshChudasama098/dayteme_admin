import React, {useState, useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import {useTheme} from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import {Table} from "antd";

import {AdminRoutes} from "src/routes/routes";
import Iconify from "src/components/common/iconify";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import {CustomActionIconButton} from "src/components/common/CustomActionIconButton";
import {GetAuditLogsService} from "src/services/AuditLogs.Services";
import dayjs from "dayjs";

const getStatusColor = (status) => {
	switch (status?.toLowerCase()) {
		case "created":
		case "success":
			return "success";
		case "deleted":
		case "failed":
			return "error";
		case "updated":
		case "warning":
			return "warning";
		default:
			return "default";
	}
};

export default function AuditLogsList() {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [searchParams, setSearchParams] = useSearchParams();

	// pagination and search
	const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
	const [pageSize, setPageSize] = useState(Number(searchParams.get("pageSize")) || 10);
	const [totalRecode, setTotalRecode] = useState(10);
	// search
	const [field, setField] = useState(searchParams.get("field") || null);
	const [order, setOrder] = useState(searchParams.get("order") || null);
	const [search, setSearch] = useState(searchParams.get("search") || "");

	const [list, setList] = useState([]);
	const [apiFlag, setApiFlag] = useState(false);

	const [loadingLoader, setLoadingLoader] = useState(false);

	useEffect(() => {
		function apiCallAction() {
			setLoadingLoader(true);

			const payLoad = {
				page,
				per_page: pageSize,
				field,
				order,
				search,
			};

			dispatch(
				GetAuditLogsService(payLoad, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setLoadingLoader(false);
						setList(res?.data?.logs);
						setTotalRecode(res?.data?.pagination?.total);
					}
				}),
			);
		}
		apiCallAction();
	}, [dispatch, apiFlag, search, page, pageSize, field, order]);

	useEffect(() => {
		setSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			...(search && {search}),
			...(field && {field}),
			...(order && {order}),
		});
	}, [setSearchParams, page, pageSize, search, field, order]);

	const columns = [
		{
			title: "Administrator",
			key: "admin",
			fixed: "left",
			width: 220,
			render: (_, record) => {
				const adminName = record?.causer?.name || "System";
				const email = record?.causer?.email || "System Auto";
				return (
					<Stack direction="row" alignItems="center" spacing={1.5}>
						<Avatar sx={{bgcolor: theme.palette.primary.main, }} variant="rounded">{adminName.charAt(0)}</Avatar>
						<Box>
							<Typography variant="subtitle2" color="text.primary" noWrap sx={{fontWeight: 700}}>
								{adminName}
							</Typography>
							<Typography variant="caption" color="text.secondary" noWrap>
								{email}
							</Typography>
						</Box>
					</Stack>
				);
			},
		},
		{
			title: "Action Performed",
			key: "action",
			width: 220,
			render: (_, record) => (
				<Stack direction="column">
					<Typography variant="subtitle2" sx={{color: "text.primary", fontWeight: 700, textTransform: "capitalize"}}>
						{record?.event}
					</Typography>
					<Typography variant="caption" sx={{color: "text.secondary", fontWeight: 600}}>
						{record?.log_name}
					</Typography>
				</Stack>
			),
		},
		{
			title: "Target Record",
			key: "target",
			width: 140,
			render: (_, record) => {
				const targetParts = record?.subject_type?.split("\\");
				const modelName = targetParts ? targetParts[targetParts.length - 1] : "N/A";
				return (
					<Typography variant="subtitle2" color="primary.main" sx={{fontWeight: 700, cursor: "pointer", "&:hover": {textDecoration: "underline"}}}>
						{modelName} #{record?.subject_id}
					</Typography>
				);
			},
		},
		{
			title: "Description",
			key: "reason",
			width: 200,
			render: (_, record) => (
				<Typography variant="body2" sx={{color: "text.secondary", fontStyle: "italic"}}>
					"{record?.description}"
				</Typography>
			),
		},
		{
			title: "Date & Time",
			key: "date",
			width: 180,
			render: (_, record) => (
				<Typography variant="subtitle2" sx={{fontWeight: 600}}>
					{dayjs(record?.created_at).format("DD MMM YYYY, hh:mm A")}
				</Typography>
			),
		},
		{
			title: "Status",
			key: "status",
			width: 120,
			render: (_, record) => {
				const status = record?.properties?.status || record?.event || "Success";
				return <Chip label={status} size="small" color={getStatusColor(status)} variant="soft" sx={{fontWeight: 800, borderRadius: 1, textTransform: "capitalize"}} />;
			},
		},
		{
			title: "Details",
			key: "details",
			fixed: "right",
			align: "center",
			width: 100,
			render: (_, record) => (
				<Tooltip title="View Log Details">
					<CustomActionIconButton
						color="primary"
						onClick={(e) => {
							e.stopPropagation();
							navigate(`${AdminRoutes?.AuditLogDetails}?id=${record.id}`);
						}}>
						<Iconify icon="solar:document-text-bold-duotone" width={18} />
					</CustomActionIconButton>
				</Tooltip>
			),
		},
	];

	return (
		<Stack spacing={4}>
			<Stack spacing={2} direction={{xs: "column", md: "row"}} sx={{justifyContent: "space-between", alignItems: {xs: "flex-start", md: "center"}}}>
				<Box>
					<Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
						Audit Logs
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						Monitor and review all administrative activities across the platform.
					</Typography>
				</Box>

				<Stack spacing={1.5} direction="row" flexWrap="wrap">
					<Button variant="outlined" color="primary" startIcon={<Iconify icon="solar:export-bold-duotone" />}>
						Export Logs
					</Button>
				</Stack>
			</Stack>

			<Card>
				<Stack spacing={2}>
					<Stack spacing={2} direction="row" sx={{m: 2, px: 2, pt: 2, justifyContent: "space-between", alignItems: "center"}}>
						<CustomSearchInput loading={loadingLoader} defaultValue={search} callBack={setSearch} placeholder="Search by admin name, action, or record ID..." width={{xs: "100%", md: 400}} />
						<Stack direction="row" spacing={1}>
							<Button variant="outlined" startIcon={<Iconify icon="solar:filter-bold-duotone" />}>
								Filters
							</Button>
						</Stack>
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
						dataSource={
							!loadingLoader
								? list
								: [...Array(pageSize >= totalRecode ? totalRecode : pageSize || 1)].map((_, i) => ({
										key: i,
									}))
						}
						scroll={{x: "max-content"}}
						pagination={false}
						rowKey="id"
						onRow={(record) => ({
							onClick: () => navigate(`${AdminRoutes?.AuditLogDetails}?id=${record.id}`),
							style: {cursor: "pointer"},
						})}
					/>

					<CustomPagination
						current={page}
						pageSize={pageSize}
						total={totalRecode}
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
