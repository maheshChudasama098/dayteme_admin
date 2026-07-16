import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {useNavigate, useSearchParams} from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import {useTheme, alpha} from "@mui/material/styles";

import {Table} from "antd";

import {AdminRoutes} from "src/routes/routes";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import Iconify from "src/components/common/iconify";
import DateFilter from "./DateFilter";
import {GetAdminDatesListServices, GetAdminDatesExportServices, PostAdminDateStatusServices} from "src/services/Dates.Services";
import {sweetAlerts, sweetAlertSuccess, sweetAlertQuestion} from "src/utils/sweet-alerts";
import {Button} from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {fDate, getErrorMessage} from "src/utils/utils";

const DateList = () => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	// pagination and search
	const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
	const [pageSize, setPageSize] = useState(Number(searchParams.get("pageSize")) || 10);
	const [totalRecode, setTotalRecode] = useState(10);
	// search
	const field = searchParams.get("field") || null;
	const order = searchParams.get("order") || null;
	const [search, setSearch] = useState(searchParams.get("search") || "");

	const [list, setList] = useState([]);
	const [apiFlag, setApiFlag] = useState(false);

	const [loadingLoader, setLoadingLoader] = useState(false);

	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filters, setFilters] = useState({
		status: searchParams.get("status") || "",
	});

	const resolveStatusId = (record) => {
		if (record?.status !== undefined && record?.status !== null) {
			return Number(record.status);
		}
		const text = String(record?.status_text || "").toLowerCase();
		if (text === "completed") return 3;
		if (text === "cancelled") return 7;
		if (text === "active") return 1;
		if (text === "connected") return 2;
		if (text === "draft") return 0;
		return 1;
	};

	const handleStatusChange = (dateId, newStatus) => {
		const statusLabel = newStatus === 3 ? "Completed" : "Cancelled";
		sweetAlertQuestion(`Are you sure you want to change this date status to ${statusLabel}?`, "Change Status?").then((result) => {
			if (result) {
				dispatch(
					PostAdminDateStatusServices(dateId, {status: Number(newStatus)}, (res) => {
						if (res?.success) {
							setApiFlag((prev) => !prev);
							sweetAlertSuccess(`Status updated to ${statusLabel} successfully`);
						} else {
							sweetAlerts("error", getErrorMessage(res));
						}
					}),
				);
			}
		});
	};

	useEffect(() => {
		function apiCallAction() {
			setLoadingLoader(true);

			const payLoad = {
				page,
				per_page: pageSize,
				field,
				order,
				search,
				...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== "" && v !== null && v !== undefined)),
			};

			dispatch(
				GetAdminDatesListServices(payLoad, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setLoadingLoader(false);
						setList(res?.data?.date_plans);
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
			...(filters.status !== "" && {status: filters.status}),
		});
	}, [setSearchParams, page, pageSize, search, field, order, filters]);

	const columns = [
		{
			title: "User Info",
			key: "info",
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1.5}>
					<Avatar variant="rounded" src={record?.user?.image} />
					<Box>
						<Typography variant="subtitle2" sx={{fontWeight: 800, color: "text.primary"}}>
							{record?.user?.name}
						</Typography>
						<Typography variant="caption" sx={{color: "text.secondary"}}>
							{record?.user?.email}
						</Typography>
					</Box>
				</Stack>
			),
		},
		{
			title: "Date Info",
			key: "date_info",
			render: (_, record) => (
				<Stack direction="column">
					<Typography variant="subtitle2" sx={{fontWeight: 700, color: "text.primary"}}>
						{record?.date_title}
					</Typography>
					<Typography variant="caption" sx={{color: "text.secondary"}}>
						{fDate(record?.date)} {record?.start_time ? `at ${record?.start_time}` : ""}
					</Typography>
				</Stack>
			),
		},

		{
			title: "Location",
			key: "location",
			render: (_, record) => (
				<Stack direction="column">
					<Typography variant="subtitle2" sx={{fontWeight: 700, color: "text.primary"}}>
						{record?.address_title}
					</Typography>
					<Typography variant="caption" sx={{color: "text.secondary"}}>
						{record?.address}
					</Typography>
				</Stack>
			),
		},
		{
			title: "Status",
			key: "status",
			render: (_, record) => {
				const currentStatusId = resolveStatusId(record);
				const statusText = record?.status_text || "Unknown";

				// Determine color
				let color = theme.palette.info.main;
				if (currentStatusId === 3 || statusText.toLowerCase() === "completed") {
					color = theme.palette.success.main;
				} else if (currentStatusId === 7 || statusText.toLowerCase() === "cancelled") {
					color = theme.palette.error.main;
				} else if (statusText.toLowerCase() === "active") {
					color = theme.palette.success.main;
				} else if (statusText.toLowerCase() === "upcoming") {
					color = theme.palette.info.main;
				} else {
					color = theme.palette.warning.main;
				}

				return (
					<Select
						size="small"
						value={currentStatusId}
						onChange={(e) => handleStatusChange(record.id, e.target.value)}
						onClick={(e) => e.stopPropagation()}
						sx={{
							height: 30,
							fontSize: "0.75rem",
							fontWeight: 800,
							color: color,
							bgcolor: alpha(color, 0.05),
							"& .MuiOutlinedInput-notchedOutline": {borderColor: alpha(color, 0.3)},
							"&:hover .MuiOutlinedInput-notchedOutline": {borderColor: color},
							"&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: color},
							"& .MuiSelect-icon": {color: color},
							borderRadius: 1.5,
						}}>
						{currentStatusId !== 3 && currentStatusId !== 7 && (
							<MenuItem value={currentStatusId} disabled>
								{statusText}
							</MenuItem>
						)}
						<MenuItem value={3} sx={{fontWeight: 600}}>
							Completed
						</MenuItem>
						<MenuItem value={7} sx={{fontWeight: 600}}>
							Cancelled
						</MenuItem>
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
						navigate(`${AdminRoutes?.DateDetails}?id=${record.id}`);
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
					<Typography variant="h3" color="text.primary" gutterBottom>
						Dates Overview
					</Typography>
					<Typography variant="body1" sx={{color: "text.secondary"}}>
						Manage and view all scheduled dates between users on the platform.
					</Typography>
				</Box>

				<Box>
					<Stack spacing={1.5} direction={{xs: "column", md: "row"}}>
						<Button
							onClick={() => {
								const payLoad = {search, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== "" && v !== null && v !== undefined))};
								setLoadingLoader(true);
								dispatch(
									GetAdminDatesExportServices(payLoad, (res) => {
										setLoadingLoader(false);
										if (res?.data) {
											const url = window.URL.createObjectURL(new Blob([res.data]));
											const link = document.createElement("a");
											link.href = url;
											link.setAttribute("download", "dates_export.csv");
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
							startIcon={<Iconify icon="solar:download-bold-duotone" />}>
							Export CSV
						</Button>
					</Stack>
				</Box>
			</Stack>

			<Card sx={{borderRadius: 4, boxShadow: theme.shadows[2], overflow: "hidden"}}>
				<Stack spacing={2}>
					<Stack spacing={1} direction="row" sx={{px: 2, pt: 2, justifyContent: "space-between"}}>
						<CustomSearchInput loading={loadingLoader} defaultValue={search} callBack={setSearch} placeholder="Search Date..." width={400} />
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
							onClick: () => navigate(`${AdminRoutes?.DateDetails}?id=${record.id}`),
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

			<DateFilter
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

export default DateList;
