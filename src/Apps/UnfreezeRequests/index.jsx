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
import {useTheme, alpha} from "@mui/material/styles";
import {Table} from "antd";
import {useDispatch} from "react-redux";

import Iconify from "src/components/common/iconify";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import {CustomActionIconButton} from "src/components/common/CustomActionIconButton";
import {GetAdminUnfreezeRequestsServices} from "src/services/Users.Services";
import {fDate} from "src/utils/utils";
import UnfreezeFilter from "./UnfreezeFilter";
import ResolveRequestModel from "./ResolveRequestModel";

export default function UnfreezeRequestsList() {
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

	// Decision Modal state
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [isResolveOpen, setIsResolveOpen] = useState(false);

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
				GetAdminUnfreezeRequestsServices(params, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setList(res?.data?.unfreeze_requests || res?.data?.requests || []);
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

	const getStatusColor = (status) => {
		const txt = String(status).toLowerCase();
		if (txt === "approved") return "success";
		if (txt === "rejected") return "error";
		return "warning"; // pending
	};

	const columns = [
		{
			title: "User Details",
			key: "user",
			fixed: "left",
			width: 250,
			render: (_, record) => {
				const userObj = record?.user || record;
				return (
					<Stack direction="row" alignItems="center" spacing={1.5}>
						<Avatar variant="rounded" src={userObj?.image || userObj?.avatar} alt={userObj?.name}>
							{userObj?.name?.charAt(0) || "U"}
						</Avatar>
						<Box>
							<Typography variant="subtitle2" color="text.primary" noWrap sx={{fontWeight: 700}}>
								{userObj?.name || "Unknown User"}
							</Typography>
							<Typography variant="caption" color="text.secondary" noWrap>
								{userObj?.email || "No email"}
							</Typography>
						</Box>
					</Stack>
				);
			},
		},
		{
			title: "Contact Info",
			key: "contact",
			width: 180,
			render: (_, record) => {
				const userObj = record?.user || record;
				return (
					<Typography variant="body2" sx={{color: "text.primary"}}>
						{userObj?.phone_number || userObj?.mobile || "N/A"}
					</Typography>
				);
			},
		},
		{
			title: "Status",
			key: "status",
			width: 150,
			render: (_, record) => (
				<Chip label={record?.status || "Pending"} size="small" color={getStatusColor(record?.status)} variant="soft" sx={{fontWeight: 800, borderRadius: 1, textTransform: "capitalize"}} />
			),
		},
		{
			title: "Admin Notes",
			key: "admin_comment",
			width: 250,
			ellipsis: true,
			render: (_, record) => (
				<Typography variant="caption" sx={{color: "text.secondary"}}>
					{record?.admin_comment || "—"}
				</Typography>
			),
		},
		{
			title: "Requested At",
			key: "requested_at",
			width: 150,
			render: (_, record) => (
				<Typography variant="caption" sx={{color: "text.primary", fontWeight: 600}}>
					{fDate(record?.created_at || record?.updated_at)}
				</Typography>
			),
		},
		{
			title: "Action",
			key: "action",
			fixed: "right",
			align: "center",
			width: 120,
			render: (_, record) => {
				const isPending = String(record?.status).toLowerCase() === "pending";
				return (
					<Tooltip title={isPending ? "Resolve Request" : "Decision Submitted"}>
						<span>
							<CustomActionIconButton
								color="primary"
								disabled={!isPending}
								onClick={(e) => {
									e.stopPropagation();
									setSelectedRequest(record);
									setIsResolveOpen(true);
								}}>
								<Iconify icon="solar:shield-keyhole-bold-duotone" width={18} />
							</CustomActionIconButton>
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
				}}>
				<Box>
					<Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
						Unfreeze Requests
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						Review and resolve requests from frozen/paused users requesting to unfreeze their account.
					</Typography>
				</Box>
			</Stack>

			<Card>
				<Stack spacing={2}>
					<Stack
						spacing={2}
						direction="row"
						sx={{
							px: 2,
							pt: 2,
							justifyContent: "space-between",
							alignItems: "center",
						}}>
						<CustomSearchInput loading={loadingLoader} defaultValue={search} callBack={setSearch} placeholder="Search by name, email, phone..." width={{xs: "100%", md: 400}} />
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

			<UnfreezeFilter
				open={isFilterOpen}
				onClose={() => setIsFilterOpen(false)}
				filters={filters}
				setFilters={setFilters}
				onApply={() => {
					setPage(1);
					setApiFlag(!apiFlag);
				}}
			/>

			{isResolveOpen && selectedRequest && (
				<ResolveRequestModel
					open={isResolveOpen}
					onClose={() => {
						setIsResolveOpen(false);
						setSelectedRequest(null);
					}}
					request={selectedRequest}
					cdSuccess={() => setApiFlag(!apiFlag)}
				/>
			)}
		</Stack>
	);
}
