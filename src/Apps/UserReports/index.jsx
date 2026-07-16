import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {useSearchParams, useNavigate} from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import {useTheme, alpha} from "@mui/material/styles";

import {Table} from "antd";

import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import Iconify from "src/components/common/iconify";
import Button from "@mui/material/Button";
import {AdminRoutes} from "src/routes/routes";
import {GetAdminReportsListServices, GetAdminReportsExportServices, PostAdminReportStatusUpdateServices} from "src/services/Reports.Services";
import ReportFilter from "./ReportFilter";
import {sweetAlerts, sweetAlertSuccess, sweetAlertQuestion} from "src/utils/sweet-alerts";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {fDate} from "src/utils/utils";

const UserReportsList = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();

	// pagination and search
	const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
	const [pageSize, setPageSize] = useState(Number(searchParams.get("pageSize")) || 10);
	const [totalRecode, setTotalRecode] = useState(5);
	// search
	const [search, setSearch] = useState(searchParams.get("search") || "");
	const [field, setField] = useState(searchParams.get("field") || null);
	const [order, setOrder] = useState(searchParams.get("order") || null);

	const [list, setList] = useState([]);
	const [apiFlag, setApiFlag] = useState(false);
	const [loadingLoader, setLoadingLoader] = useState(false);

	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filters, setFilters] = useState({
		reporter_user_id: searchParams.get("reporter_user_id") || "",
		reported_user_id: searchParams.get("reported_user_id") || "",
		report_type_id: searchParams.get("report_type_id") || "",
	});

	useEffect(() => {
		function apiCallAction() {
			setLoadingLoader(true);

			const payLoad = {
				page,
				per_page: pageSize,
				field,
				order,
				search,
				...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined)),
			};

			dispatch(
				GetAdminReportsListServices(payLoad, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setLoadingLoader(false);
						setList(res?.data?.reports);
						setTotalRecode(res?.data?.pagination?.total);
					}
				}),
			);
		}
		apiCallAction();
	}, [dispatch, apiFlag, search, page, pageSize, field, order, filters]);

	useEffect(() => {
		setSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			...(search && {search}),
			...(field && {field}),
			...(order && {order}),
			...(filters.reporter_user_id !== "" && {reporter_user_id: filters.reporter_user_id}),
			...(filters.reported_user_id !== "" && {reported_user_id: filters.reported_user_id}),
			...(filters.report_type_id !== "" && {report_type_id: filters.report_type_id}),
		});
	}, [setSearchParams, page, pageSize, search, field, order, filters]);

	const handleStatusChange = (reportId, newStatus) => {
		sweetAlertQuestion(`Are you sure you want to change report status to ${newStatus}?`, "Change Status?").then((result) => {
			if (result) {
				dispatch(
					PostAdminReportStatusUpdateServices(reportId, {status: newStatus}, (res) => {
						if (res?.success) {
							setApiFlag(!apiFlag);
							sweetAlertSuccess("Report status updated successfully");
						} else {
							sweetAlerts("error", res?.message || "Failed to update status");
						}
					}),
				);
			}
		});
	};

	const columns = [
		{
			title: "Reporter",
			key: "reporter",
			width: 250,
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1.5} sx={{py: 0.5}}>
					<Avatar variant="rounded" src={record?.reporter_user?.image} sx={{bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main"}}>
						{record?.reporter_user?.name?.charAt(0)}
					</Avatar>
					<Box>
						<Typography variant="subtitle2" sx={{color: "text.primary"}}>
							{record?.reporter_user?.name}
						</Typography>
						<Typography variant="caption" sx={{color: "text.secondary"}}>
							{record?.reporter_user?.email}
						</Typography>
					</Box>
				</Stack>
			),
		},
		{
			title: "Reported User",
			key: "reportedUser",
			width: 250,
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1.5} sx={{py: 0.5}}>
					<Avatar variant="rounded" src={record?.reported_user?.image} sx={{bgcolor: alpha(theme.palette.error.main, 0.1), color: "error.main"}}>
						{record?.reported_user?.name?.charAt(0)}
					</Avatar>
					<Box>
						<Typography variant="subtitle2" sx={{color: "error.main"}}>
							{record?.reported_user?.name}
						</Typography>
						<Typography variant="caption" sx={{color: "text.secondary"}}>
							{record?.reported_user?.email}
						</Typography>
					</Box>
				</Stack>
			),
		},
		{
			title: "Report Details",
			key: "details",
			width: 300,
			render: (_, record) => (
				<Stack direction="column">
					<Typography variant="subtitle2" sx={{color: "text.primary"}}>
						{record?.report_type}
					</Typography>
					{record?.details && (
						<Typography variant="caption" sx={{color: "text.secondary", fontStyle: "italic", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden"}}>
							"{record?.details}"
						</Typography>
					)}
				</Stack>
			),
		},
		{
			title: "Date",
			dataIndex: "created_at",
			key: "created_at",
			width: 120,
			render: (created_at) => (
				<Typography variant="body2" sx={{color: "text.secondary"}}>
					{fDate(created_at)}
				</Typography>
			),
		},
		{
			title: "Status",
			key: "status",
			width: 140,
			render: (_, record) => {
				const status = record?.status?.toLowerCase() || "pending";
				let color = "warning.main";
				if (status === "resolved") color = "success.main";
				if (status === "dismissed") color = "text.secondary";

				return (
					<Select
						size="small"
						value={status}
						onChange={(e) => handleStatusChange(record.id, e.target.value)}
						onClick={(e) => e.stopPropagation()}
						sx={{
							height: 30,
							fontSize: "0.75rem",
							fontWeight: 800,
							color: color,
							"& .MuiOutlinedInput-notchedOutline": {borderColor: color},
							"&:hover .MuiOutlinedInput-notchedOutline": {borderColor: color},
							"&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: color},
							"& .MuiSelect-icon": {color: color},
						}}>
						<MenuItem value="pending">Pending</MenuItem>
						<MenuItem value="resolved">Resolved</MenuItem>
						<MenuItem value="dismissed">Dismissed</MenuItem>
					</Select>
				);
			},
		},
		{
			title: "Action",
			key: "action",
			align: "center",
			width: 90,
			render: (_, record) => (
				<Box
					sx={{
						display: "inline-flex",
						justifyContent: "center",
						alignItems: "center",
						p: 1,
						borderRadius: 2,
						bgcolor: alpha(theme.palette.primary.main, 0.1),
						color: "primary.main",
						cursor: "pointer",
						transition: "background 0.2s",
						"&:hover": {bgcolor: alpha(theme.palette.primary.main, 0.2)},
					}}
					onClick={(e) => {
						e.stopPropagation();
						navigate(`${AdminRoutes?.UserReportDetails}?id=${record.id}`);
					}}>
					<Iconify icon="solar:eye-bold-duotone" width={18} />
				</Box>
			),
		},
	];

	return (
		<Stack spacing={4}>
			<Stack spacing={2} direction="row" sx={{justifyContent: "space-between", alignItems: "flex-start"}}>
				<Box>
					<Typography variant="h3" fontWeight={800} color="text.primary" gutterBottom>
						Safety Queue
					</Typography>
					<Typography variant="body1" sx={{color: "text.secondary"}}>
						Review and manage moderation reports submitted by users against other users.
					</Typography>
				</Box>

				<Box>
					<Stack spacing={1.5} direction={{xs: "column", md: "row"}}>
						<Button
							onClick={() => {
								const payLoad = {search, ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined))};
								setLoadingLoader(true);
								dispatch(
									GetAdminReportsExportServices(payLoad, (res) => {
										setLoadingLoader(false);
										if (res?.data) {
											const url = window.URL.createObjectURL(new Blob([res.data]));
											const link = document.createElement("a");
											link.href = url;
											link.setAttribute("download", "reports_export.csv");
											document.body.appendChild(link);
											link.click();
											link.remove();
											sweetAlertSuccess("Export downloaded successfully");
										} else {
											sweetAlerts("error", "Failed to export data");
										}
									}),
								);
							}}
							disabled={loadingLoader}
							variant="outlined"
							color="primary"
							startIcon={<Iconify icon="solar:download-bold-duotone" />}
							sx={{borderRadius: 2, fontWeight: 800}}>
							Export CSV
						</Button>
					</Stack>
				</Box>
			</Stack>

			<Card sx={{borderRadius: 4, boxShadow: theme.shadows[2], overflow: "hidden"}}>
				<Stack spacing={2}>
					<Stack spacing={1} direction="row" sx={{m: 2, px: 2, pt: 2, pb: 1, justifyContent: "space-between"}}>
						<CustomSearchInput loading={loadingLoader} defaultValue={search} callBack={setSearch} placeholder="Search Reports..." width={400} />
						<Stack direction="row" spacing={1}>
							{(() => {
								const activeCount = Object.values(filters).filter((v) => v !== "").length;
								return (
									<Button variant={activeCount > 0 ? "contained" : "outlined"} startIcon={<Iconify icon="solar:filter-bold-duotone" />} onClick={() => setIsFilterOpen(true)}>
										Filters {activeCount > 0 && `(${activeCount})`}
									</Button>
								);
							})()}
						</Stack>
					</Stack>

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
							"& .ant-table-tbody > tr:hover > td": {
								background: alpha(theme.palette.primary.main, 0.01),
							},
							"& .ant-table-tbody > tr:last-child > td": {
								borderBottom: "none",
							},
						}}>
						<Table
							className="custom-ant-table"
							showSorterTooltip={false}
							columns={
								!loadingLoader
									? columns
									: columns.map((col) => ({
											...col,
											render: () => <Skeleton variant="" animation="wave" sx={{width: "100%", height: 25, borderRadius: 1}} />,
										}))
							}
							dataSource={
								!loadingLoader
									? list
									: [...Array(pageSize >= totalRecode ? totalRecode : pageSize)].map((_, i) => ({
											key: i,
										}))
							}
							scroll={{x: "max-content"}}
							pagination={false}
							rowKey="id"
							onRow={(record) => ({
								onClick: () => navigate(`${AdminRoutes?.UserReportDetails}?id=${record.id}`),
								style: {cursor: "pointer"},
							})}
						/>
					</Box>

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

			<ReportFilter
				open={isFilterOpen}
				onClose={() => setIsFilterOpen(false)}
				filters={filters}
				setFilters={setFilters}
				onApply={() => {
					setPage(1);
					setApiFlag(!apiFlag);
				}}
			/>
		</Stack>
	);
};

export default UserReportsList;
