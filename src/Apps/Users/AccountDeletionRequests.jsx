import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import {useTheme} from "@mui/material/styles";
import {Table} from "antd";
import {useDispatch} from "react-redux";

import Iconify from "src/components/common/iconify";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import {GetAdminUserDeletionRequestsServices, PostAdminProcessUserDeletionRequestServices} from "src/services/Users.Services";
import {fDate, getErrorMessage} from "src/utils/utils";
import {sweetAlertQuestion, sweetAlerts, sweetAlertSuccess} from "src/utils/sweet-alerts";
import DeletionRequestFilter from "./DeletionRequestFilter";

export default function AccountDeletionRequests() {
	const theme = useTheme();
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();

	const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
	const [pageSize, setPageSize] = useState(Number(searchParams.get("pageSize")) || 10);
	const [totalRecord, setTotalRecord] = useState(0);
	const [search, setSearch] = useState(searchParams.get("search") || "");
	const [list, setList] = useState([]);
	const [loadingLoader, setLoadingLoader] = useState(false);
	const [apiFlag, setApiFlag] = useState(false);

	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filters, setFilters] = useState({
		status: searchParams.get("status") || "",
	});

	useEffect(() => {
		function apiCallAction() {
			setLoadingLoader(true);
			const params = {
				page,
				per_page: pageSize,
				search,
				...(filters.status !== "" && filters.status !== null && filters.status !== undefined && {status: filters.status}),
			};

			dispatch(
				GetAdminUserDeletionRequestsServices(params, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setList(res?.data?.deletion_requests || res?.data?.requests || []);
						setTotalRecord(res?.data?.pagination?.total || 0);
					}
				}),
			);
		}
		apiCallAction();
	}, [dispatch, apiFlag, search, page, pageSize, filters]);

	useEffect(() => {
		setSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			...(search && {search}),
			...(filters.status !== "" && filters.status !== null && filters.status !== undefined && {status: filters.status}),
		});
	}, [setSearchParams, page, pageSize, search, filters]);

	const handleProcessDeletion = (requestId) => {
		sweetAlertQuestion(
			"Are you sure you want to process this account deletion request? This action will permanently delete the user account and cannot be undone.",
			"Confirm Account Deletion?",
		)
			.then((isConfirmed) => {
				if (isConfirmed) {
					dispatch(
						PostAdminProcessUserDeletionRequestServices(requestId, (res) => {
							if (res?.success) {
								setApiFlag((prev) => !prev);
								sweetAlertSuccess("The user account deletion request has been processed successfully.", "Request Processed");
							} else {
								sweetAlerts("error", getErrorMessage(res));
							}
						}),
					);
				}
			})
			.catch((error) => {
				console.error("Error processing deletion:", error);
			});
	};

	const getStatusColor = (status) => {
		const txt = String(status).toLowerCase();
		if (txt === "processed") return "success";
		return "warning"; // pending
	};

	const columns = [
		{
			title: "User Name",
			key: "user",
			fixed: "left",
			width: 250,
			render: (_, record) => {
				const userObj = record?.user || record;
				return (
					<Stack direction="row" alignItems="center" spacing={1.5}>
						<Avatar
							variant="rounded"
							sx={{width: 40, height: 40, bgcolor: theme.palette.primary.lighter, color: theme.palette.primary.main, fontWeight: 700}}
							src={userObj?.image || userObj?.avatar}
							alt={userObj?.name}
						>
							{userObj?.name?.charAt(0) || "U"}
						</Avatar>
						<Typography variant="subtitle2" color="text.primary" noWrap sx={{fontWeight: 700}}>
							{userObj?.name || "Unknown User"}
						</Typography>
					</Stack>
				);
			},
		},
		{
			title: "Email",
			key: "email",
			width: 220,
			render: (_, record) => {
				const userObj = record?.user || record;
				return (
					<Typography variant="body2" sx={{color: "text.primary"}}>
						{userObj?.email || "No email"}
					</Typography>
				);
			},
		},
		{
			title: "Request Date",
			key: "created_at",
			width: 180,
			render: (_, record) => (
				<Typography variant="caption" sx={{color: "text.primary", fontWeight: 600}}>
					{fDate(record?.created_at || record?.updated_at)}
				</Typography>
			),
		},
		{
			title: "Status",
			key: "status",
			width: 150,
			render: (_, record) => (
				<Chip
					label={record?.status || "Pending"}
					size="small"
					color={getStatusColor(record?.status)}
					variant="soft"
					sx={{fontWeight: 800, borderRadius: 1, textTransform: "capitalize"}}
				/>
			),
		},
		{
			title: "Actions",
			key: "action",
			fixed: "right",
			align: "center",
			width: 160,
			render: (_, record) => {
				const isPending = String(record?.status).toLowerCase() === "pending";
				return (
					<Tooltip title={isPending ? "Process/Delete Account" : "Processed"}>
						<span>
							<Button
								variant="contained"
								color="error"
								size="small"
								disabled={!isPending}
								startIcon={<Iconify icon="solar:trash-bin-trash-bold-duotone" width={16} />}
								onClick={(e) => {
									e.stopPropagation();
									handleProcessDeletion(record?.id);
								}}
								sx={{
									textTransform: "capitalize",
									fontWeight: 700,
									borderRadius: 1.5,
									px: 2,
								}}
							>
								Process/Delete
							</Button>
						</span>
					</Tooltip>
				);
			},
		},
	];

	return (
		<Stack spacing={4}>
			<Stack
				spacing={2}
				direction={{xs: "column", md: "row"}}
				sx={{
					justifyContent: "space-between",
					alignItems: {xs: "flex-start", md: "center"},
				}}
			>
				<Box>
					<Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
						Account Deletion Requests
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						Review and process requests from users who have requested to delete their account.
					</Typography>
				</Box>
			</Stack>

			<Card>
				<Stack spacing={2}>
					<Stack
						spacing={2}
						direction="row"
						sx={{
							m: 2,
							px: 2,
							pt: 2,
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<CustomSearchInput
							loading={loadingLoader}
							defaultValue={search}
							callBack={setSearch}
							placeholder="Search by name or email..."
							width={{xs: "100%", md: 400}}
						/>
						<Stack direction="row" spacing={1}>
							{(() => {
								const activeCount = Object.values(filters).filter((v) => v !== "").length;
								return (
									<Button
										variant={activeCount > 0 ? "contained" : "outlined"}
										startIcon={<Iconify icon="solar:filter-bold-duotone" />}
										onClick={() => setIsFilterOpen(true)}
									>
										Filters {activeCount > 0 && `(${activeCount})`}
									</Button>
								);
							})()}
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
								: [...Array(pageSize)].map((_, i) => ({
										id: i,
									}))
						}
						scroll={{x: "max-content"}}
						pagination={false}
						rowKey="id"
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

			<DeletionRequestFilter
				open={isFilterOpen}
				onClose={() => setIsFilterOpen(false)}
				filters={filters}
				setFilters={setFilters}
				onApply={() => {
					setPage(1);
					setApiFlag((prev) => !prev);
				}}
			/>
		</Stack>
	);
}
