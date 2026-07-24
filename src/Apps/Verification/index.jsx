import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

import {Table} from "antd";

import {useDispatch} from "react-redux";

import {AdminRoutes} from "src/routes/routes";

import Iconify from "src/components/common/iconify";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import {CustomActionIconButton} from "src/components/common/CustomActionIconButton";
import {GetAdminUserKycVerificationsServices} from "src/services/Users.Services";

import {fAge, fDate} from "src/utils/utils";
import VerificationFilter from "./VerificationFilter";

export default function VerificationList() {
	const navigate = useNavigate();
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
				GetAdminUserKycVerificationsServices(params, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setList(res?.data?.verifications || []);
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

	const getStatusColor = (statusText, statusCode) => {
		const code = statusCode !== undefined && statusCode !== null ? Number(statusCode) : -1;
		if (code === 1) return "success";
		if (code === 2) return "warning";
		if (code === 0) return "error";
		if (code === 3) return "default";

		const txt = String(statusText).toLowerCase();
		if (txt.includes("verified") || txt.includes("approve")) return "success";
		if (txt.includes("pending") || txt.includes("upload")) return "warning";
		if (txt.includes("reject") || txt.includes("unverified")) return "error";
		return "default";
	};

	const columns = [
		{
			title: "User Info",
			key: "user",
			fixed: "left",
			width: 250,
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1.5}>
					{/* <Avatar variant="rounded" sx={{width: 40, height: 40}} src={record?.kyc_front_photo} alt={record?.name}>
						{record?.name?.charAt(0)}
					</Avatar> */}
					<Box>
						<Typography variant="subtitle2" color="text.primary" noWrap>
							{record?.name || "Unknown"}
						</Typography>
						<Typography variant="caption" color="text.secondary" noWrap>
							{record?.email}
						</Typography>
					</Box>
				</Stack>
			),
		},
		// {
		// 	title: "Documents",
		// 	key: "details",
		// 	width: 200,
		// 	render: (_, record) => (
		// 		<Stack direction="row" spacing={1}>
		// 			{record?.kyc_front_photo && (
		// 				<Avatar variant="rounded" src={record?.kyc_front_photo} alt={record?.name}>
		// 					{record?.name?.charAt(0)}
		// 				</Avatar>
		// 			)}

		// 			{record?.kyc_back_photo && (
		// 				<Avatar variant="rounded" src={record?.kyc_back_photo} alt={record?.name}>
		// 					{record?.name?.charAt(0)}
		// 				</Avatar>
		// 			)}
		// 		</Stack>
		// 	),
		// },
		{
			title: "Verification Details",
			key: "details",
			width: 200,
			render: (_, record) => (
				<Stack direction="column">
					<Typography variant="subtitle2" sx={{color: "text.primary", fontWeight: 600}}>
						{record?.kyc_document?.name || "Not specified"}
					</Typography>
					{/* <Typography variant="caption" sx={{color: "text.secondary"}}>
						ID: {record?.id}
					</Typography> */}
				</Stack>
			),
		},

		{
			title: "Demographics",
			key: "demographics",
			width: 180,
			render: (_, record) => (
				<Stack direction="column">
					<Typography variant="subtitle2" sx={{color: "text.primary"}}>
						{record?.gender?.name || "N/A"}
						{record?.dob && ` • ${fAge(record.dob)} yrs`}
					</Typography>
					<Typography variant="caption" sx={{color: "text.secondary"}}>
						{record?.phone_number || record?.mobile || "No phone"}
					</Typography>
				</Stack>
			),
		},
		{
			title: "Status",
			key: "status",
			width: 150,
			render: (_, record) => (
				<Chip
					label={record?.document_verification_status_text || "Unverified"}
					size="small"
					color={getStatusColor(record?.document_verification_status_text, record?.document_verification_status)}
					variant="soft"
					sx={{fontWeight: 800, borderRadius: 1}}
				/>
			),
		},
		{
			title: "Submitted At",
			key: "submitted",
			width: 150,
			render: (_, record) => (
				<Typography variant="caption" sx={{color: "text.primary", fontWeight: 600}}>
					{fDate(record?.updated_at)}
				</Typography>
			),
		},
		{
			title: "Action",
			key: "action",
			fixed: "right",
			align: "center",
			width: 100,
			render: (_, record) => (
				<Tooltip title="Review Verification">
					<CustomActionIconButton
						color="primary"
						onClick={(e) => {
							e.stopPropagation();
							navigate(`${AdminRoutes?.VerificationDetails}?id=${record.id}`);
						}}>
						<Iconify icon="solar:document-text-bold-duotone" width={18} />
					</CustomActionIconButton>
				</Tooltip>
			),
		},
	];

	return (
		<Stack spacing={2}>
			<Stack spacing={2}>
				<Box>
					<Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
						Verification Management
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						Review identity verifications to ensure a safe and genuine dating environment.
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
						onRow={(record) => ({
							onClick: () => {
								if (!loadingLoader) {
									navigate(`${AdminRoutes?.VerificationDetails}?id=${record.id}`);
								}
							},
							style: {cursor: loadingLoader ? "default" : "pointer"},
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

			<VerificationFilter
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
}
