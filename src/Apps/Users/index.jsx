import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate, useSearchParams} from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import {alpha, Chip, useTheme} from "@mui/material";
import Typography from "@mui/material/Typography";

import {Table} from "antd";

import {AdminRoutes} from "src/routes/routes";
import Iconify from "src/components/common/iconify";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";

import UserModel from "./UserModel";
import UserFilter from "./UserFilter";
import {DeleteAdminUserServices, GetAdminUsersListServices, GetAdminUsersExportServices, PostAdminUserStatusServices, GetAdminUserStatusesServices} from "src/services/Users.Services";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import {CustomActionIconButton} from "src/components/common/CustomActionIconButton";
import {sweetAlertQuestion, sweetAlerts, sweetAlertSuccess} from "src/utils/sweet-alerts";
import {fAge, fDate, fDuration, getErrorMessage} from "src/utils/utils";

const Index = () => {
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

	const [statuses, setStatuses] = useState([]);
	const [list, setList] = useState([]);
	const [apiFlag, setApiFlag] = useState(false);

	const [loadingLoader, setLoadingLoader] = useState(false);
	const [isUserModalOpen, setIsUserModalOpen] = useState(false);
	const [userData, setUserData] = useState(null);

	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filters, setFilters] = useState({
		is_admin: searchParams.get("is_admin") || "",
		gender_id: searchParams.get("gender_id") || "",
		location_id: searchParams.get("location_id") || "",
		is_paused: searchParams.get("is_paused") || "",
	});

	useEffect(() => {
		function apiCallAction() {
			dispatch(
				GetAdminUserStatusesServices((res) => {
					if (res?.success) {
						setStatuses(res?.data?.statuses);
					}
				}),
			);
		}
		apiCallAction();
	}, [dispatch]);

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
				GetAdminUsersListServices(payLoad, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setLoadingLoader(false);
						// mapping dummy data for new requirements just in case API doesn't have it yet
						const enrichedData = res?.data?.users?.map((u) => ({
							...u,
							// reliability_score: u.reliability_score || Math.floor(Math.random() * 40) + 60,
							// completed_dates: u.completed_dates || Math.floor(Math.random() * 20),
							// no_show_count: u.no_show_count || Math.floor(Math.random() * 3),
							// verification_status: u.verification_status || (Math.random() > 0.5 ? "Verified" : "Pending"),
							// account_status: u.account_status || (Math.random() > 0.8 ? "Frozen" : "Active"),
							last_active: u.last_active || "15 mins ago",
							// signup_date: u.created_at || "Jan 2026",
						}));
						setList(enrichedData || []);
						setTotalRecode(res?.data?.pagination?.total || 0);
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
			...(filters.is_admin !== "" && {is_admin: filters.is_admin}),
			...(filters.gender_id !== "" && {gender_id: filters.gender_id}),
			...(filters.location_id !== "" && {location_id: filters.location_id}),
			...(filters.is_paused !== "" && {is_paused: filters.is_paused}),
		});
	}, [setSearchParams, page, pageSize, search, field, order, filters]);

	const DeleteActions = (id) => {
		sweetAlertQuestion("This user will be permanently deleted. You won’t be able to recover it.", "Delete User?")
			.then((result) => {
				if (result) {
					dispatch(
						DeleteAdminUserServices(id, (res) => {
							if (res?.success) {
								setApiFlag(!apiFlag);
								sweetAlertSuccess("User deleted successfully");
							} else {
								const errorMessage = getErrorMessage(res);
								sweetAlerts("error", errorMessage);
							}
						}),
					);
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleStatusChange = (userId, newStatus) => {
		sweetAlertQuestion(`Are you sure you want to change user status to ${newStatus}?`, "Change Status?").then((result) => {
			if (result) {
				dispatch(
					PostAdminUserStatusServices(userId, {status: newStatus}, (res) => {
						if (res?.success) {
							setApiFlag(!apiFlag);
							sweetAlertSuccess("Status updated successfully");
						} else {
							sweetAlerts("error", getErrorMessage(res));
						}
					}),
				);
			}
		});
	};

	const handleExport = () => {
		const payLoad = {
			search,
			...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined)),
		};
		setLoadingLoader(true);
		dispatch(
			GetAdminUsersExportServices(payLoad, (res) => {
				setLoadingLoader(false);
				if (res?.data) {
					const url = window.URL.createObjectURL(new Blob([res.data]));
					const link = document.createElement("a");
					link.href = url;
					link.setAttribute("download", "users_export.csv");
					document.body.appendChild(link);
					link.click();
					link.remove();
					sweetAlertSuccess("Export downloaded successfully");
				} else {
					sweetAlerts("error", "Failed to export data");
				}
			}),
		);
	};

	const columns = [
		{
			title: "User",
			key: "user",
			fixed: "left",
			width: 250,
			ellipsis: true,
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1.5}>
					<Avatar variant="rounded" sx={{width: 40, height: 40}} src={record?.image} alt={record?.name} />
					<Box>
						<Typography variant="subtitle2" color="text.primary" noWrap sx={{fontWeight: 700}}>
							{record?.name}
						</Typography>
						<Typography variant="caption" color="text.secondary" noWrap>
							{record?.email}
						</Typography>
					</Box>
				</Stack>
			),
		},
		{
			title: "Demographics",
			key: "demo",
			width: 150,
			render: (_, record) => (
				<Stack direction="column">
					<Typography variant="subtitle2" sx={{color: "text.primary"}}>
						{record?.gender?.name || "N/A"}
						{record?.dob && ` • ${fAge(record?.dob) || "0"} yrs`}
					</Typography>
					{record?.location?.name && (
						<Typography variant="caption" sx={{color: "text.secondary", alignItems: "center", gap: 0.4, display: "flex"}}>
							<Iconify icon={"weui:location-filled"} width={14} />
							{record?.location?.name || "Unknown"}
						</Typography>
					)}
				</Stack>
			),
		},
		{
			title: "Type",
			key: "is_admin",
			width: 150,
			render: (_, record) => {
				const isAdmin = record?.is_admin;
				const roleName = record?.roles?.[0]?.name;
				return (
					<Stack spacing={0.5} alignItems="flex-start">
						<Chip
							icon={<Iconify icon={isAdmin ? "solar:shield-check-bold" : "solar:shield-warning-bold"} width={16} />}
							label={isAdmin ? "Admin" : "User"}
							size="small"
							sx={{
								bgcolor: alpha(isAdmin ? theme.palette.success.main : theme.palette.error.main, 0.1),
								color: isAdmin ? "success.main" : "error.main",
								fontWeight: 700,
								border: "none",
							}}
						/>
						{isAdmin && roleName && (
							<Typography variant="caption" sx={{color: "text.secondary", fontWeight: 700, ml: 0.5}}>
								{roleName}
							</Typography>
						)}
					</Stack>
				);
			},
		},
		{
			title: "Reliability",
			key: "reliability",
			width: 120,
			render: (_, record) => {
				const score = record?.profile_completion_percentage || 0;
				const color = score >= 90 ? "success.main" : score >= 70 ? "warning.main" : "error.main";
				return (
					<Stack direction="row" alignItems="center" spacing={0.5}>
						<Iconify icon="solar:heart-pulse-bold" width={18} sx={{color}} />
						<Typography variant="subtitle2" sx={{color}}>
							{score}%
						</Typography>
					</Stack>
				);
			},
		},
		{
			title: "Date Stats",
			key: "datestats",
			width: 140,
			render: (_, record) => (
				<Stack direction="column">
					<Typography variant="caption" sx={{color: "success.main", fontWeight: 700}}>
						{record?.completed_dates_count} Completed
					</Typography>
					{/* <Typography variant="caption" sx={{color: record?.no_show_count > 0 ? "error.main" : "text.secondary", fontWeight: 600}}>
						{record?.no_show_count} No-Shows
					</Typography> */}
				</Stack>
			),
		},
		{
			title: "Activity",
			key: "activity",
			width: 150,
			render: (_, record) => (
				<Stack direction="column">
					<Typography variant="caption" sx={{color: "text.primary", fontWeight: 600}}>
						Last: {fDuration(record?.last_logged_in)}
					</Typography>
					<Typography variant="caption" sx={{color: "text.secondary"}}>
						Joined: {fDate(record?.created_date)}
					</Typography>
				</Stack>
			),
		},
		{
			title: "Status",
			key: "status",
			width: 140,
			render: (_, record) => {
				const status = record?.status?.toLowerCase() || "active";
				let color = "success.main";
				if (status === "freeze" || status === "frozen") color = "info.main";
				if (status === "suspended") color = "warning.main";
				if (status === "banned") color = "error.main";

				return (
					<Select
						size="small"
						value={status === "frozen" ? "freeze" : status}
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
						{statuses?.map((status) => (
							<MenuItem value={status?.id}>{status?.name}</MenuItem>
						))}
					</Select>
				);
			},
		},
		{
			title: "Action",
			dataIndex: "action",
			key: "action",
			fixed: "right",
			align: "center",
			width: 120,
			render: (_, record) => (
				<Stack spacing={0.5} direction="row" sx={{justifyContent: "right"}}>
					<CustomActionIconButton
						tooltip="View Profile"
						color="info"
						onClick={(e) => {
							e.stopPropagation();
							navigate(`${AdminRoutes?.UserDetails}?id=${record.id}`);
						}}>
						<Iconify icon="solar:eye-bold-duotone" width={16} />
					</CustomActionIconButton>

					<CustomActionIconButton
						color="info"
						tooltip="Edit User"
						onClick={(e) => {
							e.stopPropagation();
							setUserData(record);
							setIsUserModalOpen(true);
						}}>
						<Iconify icon="solar:pen-bold-duotone" width={16} />
					</CustomActionIconButton>

					<CustomActionIconButton
						tooltip="Delete User"
						color="error"
						onClick={(e) => {
							e.stopPropagation();
							DeleteActions(record?.id);
						}}>
						<Iconify icon="solar:trash-bin-trash-bold-duotone" width={16} />
					</CustomActionIconButton>
				</Stack>
			),
		},
	];

	return (
		<Stack spacing={4}>
			<Stack spacing={2} direction={{xs: "column", md: "row"}} sx={{justifyContent: "space-between", alignItems: {xs: "flex-start", md: "center"}}}>
				<Box>
					<Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
						User Management
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						Central hub for monitoring activity, reviewing accounts, and taking administrative actions.
					</Typography>
				</Box>

				<Stack spacing={1.5} direction={{xs: "column", md: "row"}} flexWrap="wrap">
					<Button onClick={handleExport} disabled={loadingLoader} variant="outlined" color="primary" startIcon={<Iconify icon="solar:download-bold-duotone" />}>
						Export CSV
					</Button>
					<Button
						color="primary"
						variant="contained"
						startIcon={<Iconify icon="solar:user-plus-bold" width={20} />}
						onClick={() => {
							setIsUserModalOpen(true);
							setUserData(null);
						}}>
						Add New User
					</Button>
				</Stack>
			</Stack>

			<Card >
				<Stack spacing={2}>
					<Stack spacing={2} direction="row" sx={{m: 2, px: 2, pt: 2, justifyContent: "space-between", alignItems: "center"}}>
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
						showSorterTooltip={false}
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
								: [...Array(pageSize >= totalRecode ? totalRecode : pageSize)].map((_, i) => ({
										key: i,
									}))
						}
						scroll={{x: "max-content"}}
						pagination={false}
						rowKey="id"
						onRow={(record) => ({
							onClick: () => navigate(`${AdminRoutes?.UserDetails}?id=${record.id}`),
							style: {cursor: "pointer"},
						})}
						onChange={(_, __, sorter) => {
							if (sorter?.field && sorter?.order) {
								setField(sorter?.field);
								setOrder(sorter?.order);
							} else {
								setField(null);
								setOrder(null);
							}
						}}
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

			{isUserModalOpen && (
				<UserModel
					open={isUserModalOpen}
					data={userData}
					handleClose={() => setIsUserModalOpen(false)}
					cdSuccess={() => {
						setApiFlag(!apiFlag);
						setIsUserModalOpen(false);
					}}
				/>
			)}

			<UserFilter
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

export default Index;
