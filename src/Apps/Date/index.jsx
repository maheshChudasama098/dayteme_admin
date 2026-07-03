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
import {GetAdminDatesListServices} from "src/services/Dates.Services";

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
			title: "User Info",
			key: "info",
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1.5}>
					<Avatar variant="rounded" />
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
						{record?.date} {record?.start_time ? `at ${record?.start_time}` : ""}
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
			dataIndex: "status_text",
			key: "status",
			render: (status_text) => (
				<Chip
					label={status_text}
					size="small"
					sx={{
						bgcolor: alpha(status_text === "Active" ? theme.palette.success.main : status_text === "Upcoming" ? theme.palette.info.main : theme.palette.warning.main, 0.1),
						color: status_text === "Active" ? "success.main" : status_text === "Upcoming" ? "info.main" : "warning.main",
						fontWeight: 800,
						border: "none",
						borderRadius: 1.5,
					}}
				/>
			),
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
					<Typography variant="h3" fontWeight={800} color="text.primary" gutterBottom>
						Dates Overview
					</Typography>
					<Typography variant="body1" sx={{color: "text.secondary"}}>
						Manage and view all scheduled dates between users on the platform.
					</Typography>
				</Box>
			</Stack>

			<Card sx={{borderRadius: 4, boxShadow: theme.shadows[2], overflow: "hidden"}}>
				<Stack spacing={2}>
					<Stack spacing={1} direction="row" sx={{m: 2, px: 2, pt: 2, pb: 1, justifyContent: "space-between"}}>
						<CustomSearchInput loading={loadingLoader} defaultValue={search} callBack={setSearch} placeholder="Search Date..." width={400} />
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
								onClick: () => navigate(`${AdminRoutes?.DateDetails}?id=${record.id}`),
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
		</Stack>
	);
};

export default DateList;
