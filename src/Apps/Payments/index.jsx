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

import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import Iconify from "src/components/common/iconify";
import CustomTooltip from "src/components/common/CustomTooltip";
import Button from "@mui/material/Button";
import {GetAdminPaymentsListServices, GetAdminPaymentsExportServices} from "src/services/Payments.Services";
import PaymentFilter from "./PaymentFilter";
import {sweetAlerts, sweetAlertSuccess} from "src/utils/sweet-alerts";

const PaymentList = () => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
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

	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filters, setFilters] = useState({
		user_id: searchParams.get("user_id") || "",
		status: searchParams.get("status") || "",
		provider: searchParams.get("provider") || "",
		payment_intent_id: searchParams.get("payment_intent_id") || "",
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
				GetAdminPaymentsListServices(payLoad, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setLoadingLoader(false);
						setList(res?.data?.payments);
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
			...(filters.user_id !== "" && {user_id: filters.user_id}),
			...(filters.status !== "" && {status: filters.status}),
			...(filters.provider !== "" && {provider: filters.provider}),
			...(filters.payment_intent_id !== "" && {payment_intent_id: filters.payment_intent_id}),
		});
	}, [setSearchParams, page, pageSize, search, field, order, filters]);

	const columns = [
		{
			title: "Transaction Info",
			key: "info",
			render: (_, record) => (
				<Box>
					<Typography variant="subtitle2" sx={{fontWeight: 800, color: "text.primary"}}>
						{record?.payment_intent_id || record?.id}
					</Typography>
					<Typography variant="caption" sx={{color: "text.secondary", fontWeight: 600}}>
						{record?.created_at ? new Date(record.created_at).toLocaleDateString() : ""}
					</Typography>
				</Box>
			),
		},
		{
			title: "User",
			key: "user",
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1.5} sx={{py: 0.5}}>
					<Avatar src={record?.user?.image} sx={{bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main"}} variant="rounded">
						{record?.user?.name?.charAt(0)}
					</Avatar>
					<Box>
						<Typography variant="subtitle2" sx={{fontWeight: 700, color: "text.primary"}}>
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
			title: "Sparks",
			dataIndex: "total_spark",
			key: "total_spark",
			render: (total_spark) => (
				<Typography variant="body2" sx={{fontWeight: 600, color: "text.secondary"}}>
					{total_spark} Sparks
				</Typography>
			),
		},
		{
			title: "Amount",
			key: "amount",
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={0.5}>
					<Iconify icon="solar:wad-of-money-bold-duotone" width={18} sx={{color: "success.main"}} />
					<Typography variant="subtitle2" sx={{fontWeight: 800, color: "success.main"}}>
						{record?.amount_received} {record?.currency}
					</Typography>
				</Stack>
			),
		},
		{
			title: "Provider",
			dataIndex: "provider",
			key: "provider",
			render: (provider) => {
				let icon = "solar:card-bold-duotone";
				let color = "primary.main";
				if (provider === "stripe") {
					icon = "logos:stripe";
					color = "inherit";
				}
				if (provider === "apple") {
					icon = "cib:apple-pay";
					color = "inherit";
				}
				if (provider === "google") {
					icon = "logos:google-pay";
					color = "inherit";
				}

				return (
					<Stack direction="row" alignItems="center" spacing={1}>
						<Iconify icon={icon} width={20} sx={{color}} />
						<Typography variant="caption" sx={{fontWeight: 700, color: "text.secondary", textTransform: "capitalize"}}>
							{provider}
						</Typography>
					</Stack>
				);
			},
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (status) => {
				let color = "default";
				if (status === "succeeded") color = "success";
				if (status === "pending") color = "warning";
				if (status === "failed") color = "error";

				return (
					<Chip
						label={status}
						size="small"
						sx={{
							bgcolor: alpha(theme.palette[color]?.main || theme.palette.grey[500], 0.1),
							color: color === "default" ? "text.primary" : `${color}.main`,
							fontWeight: 800,
							border: "none",
							borderRadius: 1.5,
							textTransform: "capitalize",
						}}
					/>
				);
			},
		},
		{
			title: "Action",
			key: "action",
			align: "center",
			width: 90,
			render: (_, record) => (
				<CustomTooltip label="View Receipt">
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
						}}>
						<Iconify icon="solar:document-text-bold-duotone" width={18} />
					</Box>
				</CustomTooltip>
			),
		},
	];

	return (
		<Stack spacing={4}>
			<Stack spacing={2} direction="row" sx={{justifyContent: "space-between", alignItems: "flex-start"}}>
				<Box>
					<Typography variant="h3" fontWeight={800} color="text.primary" gutterBottom>
						Payments Overview
					</Typography>
					<Typography variant="body1" sx={{color: "text.secondary"}}>
						View and manage all user transactions, subscriptions, and one-time payments.
					</Typography>
				</Box>

				<Box>
					<Stack spacing={1.5} direction={{xs: "column", md: "row"}}>
						<Button
							onClick={() => {
								const payLoad = {search, ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined))};
								setLoadingLoader(true);
								dispatch(
									GetAdminPaymentsExportServices(payLoad, (res) => {
										setLoadingLoader(false);
										if (res?.data) {
											const url = window.URL.createObjectURL(new Blob([res.data]));
											const link = document.createElement("a");
											link.href = url;
											link.setAttribute("download", "payments_export.csv");
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
						<CustomSearchInput loading={loadingLoader} defaultValue={search} callBack={setSearch} placeholder="Search Transactions..." width={400} />
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

			<PaymentFilter
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

export default PaymentList;
