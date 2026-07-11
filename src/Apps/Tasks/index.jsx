import React, {useState, useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import {useTheme} from "@mui/material/styles";
import {Table} from "antd";

import {AdminRoutes} from "src/routes/routes";
import Iconify from "src/components/common/iconify";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import {CustomActionIconButton} from "src/components/common/CustomActionIconButton";
import {useDispatch} from "react-redux";

import TaskModel from "./TaskModel";
import TaskFilter from "./TaskFilter";
import {DeleteAdminTaskServices, GetAdminTasksListServices} from "src/services/Tasks.Services";
import {sweetAlertQuestion, sweetAlerts, sweetAlertSuccess} from "src/utils/sweet-alerts";
import {fDate, fTruncateWords, getErrorMessage} from "src/utils/utils";

export default function TaskList() {
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

	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
	const [taskData, setTaskData] = useState(null);

	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filters, setFilters] = useState({
		due_date: searchParams.get("due_date") || "",
		start_date: searchParams.get("start_date") || "",
		end_date: searchParams.get("end_date") || "",
		priority: searchParams.get("priority") || "",
		status: searchParams.get("status") || "",
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
				GetAdminTasksListServices(payLoad, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setLoadingLoader(false);
						setList(res?.data?.tasks);
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
			...(filters.due_date && {due_date: filters.due_date}),
			...(filters.start_date && {start_date: filters.start_date}),
			...(filters.end_date && {end_date: filters.end_date}),
			...(filters.priority && {priority: filters.priority}),
			...(filters.status && {status: filters.status}),
		});
	}, [setSearchParams, page, pageSize, search, field, order, filters]);

	const DeleteActions = (id) => {
		sweetAlertQuestion("This task will be permanently deleted. You won’t be able to recover it.", "Delete Task?")
			.then((result) => {
				if (result) {
					dispatch(
						DeleteAdminTaskServices(id, (res) => {
							if (res?.success) {
								setApiFlag(!apiFlag);
								sweetAlertSuccess("Task deleted successfully");
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

	const getStatusColor = (status) => {
		switch (status) {
			case "Open":
				return "info";
			case "In Progress":
				return "warning";
			case "Completed":
				return "success";
			case "Cancelled":
				return "default";
			case "Overdue":
				return "error";
			default:
				return "default";
		}
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case "Critical":
				return theme.palette.error.main;
			case "High":
				return theme.palette.warning.main;
			case "Medium":
				return theme.palette.info.main;
			case "Low":
				return theme.palette.text.secondary;
			default:
				return theme.palette.text.primary;
		}
	};

	const columns = [
		{
			title: "Task Title",
			key: "title",
			fixed: "left",
			width: 250,
			ellipsis: true,
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1.5}>
					<Box sx={{width: 15, height: 15, borderRadius: "50%", bgcolor: getPriorityColor(record.priority_label)}} />
					<Box>
						<Typography variant="subtitle2" color="text.primary" noWrap>
							{fTruncateWords(record.title, 20)}
						</Typography>
					</Box>
				</Stack>
			),
		},
		{
			title: "Priority",
			key: "priority",
			width: 120,
			render: (_, record) => (
				<Typography variant="subtitle2" sx={{color: getPriorityColor(record.priority_label)}}>
					{record.priority_label}
				</Typography>
			),
		},
		{
			title: "Status",
			key: "status",
			width: 120,
			render: (_, record) => <Chip label={record.status_label} size="small" color={getStatusColor(record.status_label)} variant="soft" sx={{fontWeight: 800, borderRadius: 5}} />,
		},
		{
			title: "Assigned To",
			dataIndex: "assignedTo",
			key: "assignedTo",
			width: 180,
			render: (_, record) => {
				const text = record?.assignee?.name || "Unassigned";
				return (
					<Stack direction="row" alignItems="center" spacing={1}>
						<Avatar sx={{width: 24, height: 24, fontSize: 12}}>{text.charAt(0)}</Avatar>
						<Typography variant="subtitle2">{text}</Typography>
					</Stack>
				);
			},
		},
		{
			title: "Due Date",
			key: "dueDate",
			width: 130,
			render: (_, record) => (
				<Typography variant="subtitle2" sx={{color: record.status_label === "Overdue" ? "error.main" : "text.primary"}}>
					{fDate(record?.due_date)}
				</Typography>
			),
		},
		{
			title: "Created By",
			key: "createdBy",
			width: 140,
			render: (_, record) => (
				<Stack direction="column">
					<Typography variant="caption" sx={{color: "text.primary", fontWeight: 600}}>
						{record?.creator?.name || "System"}
					</Typography>
					<Typography variant="caption" sx={{color: "text.secondary"}}>
						{fDate(record?.created_at)}
					</Typography>
				</Stack>
			),
		},
		{
			title: "Action",
			key: "action",
			fixed: "right",
			align: "center",
			width: 100,
			render: (_, record) => (
				<Stack spacing={0.5} direction="row" sx={{justifyContent: "right"}}>
					{/* <Tooltip title="View Task Details">
						<CustomActionIconButton
							color="info"
							onClick={(e) => {
								e.stopPropagation();
								navigate(`${AdminRoutes?.TaskDetails}?id=${record.task_id}`);
							}}>
							<Iconify icon="solar:eye-bold-duotone" width={16} />
						</CustomActionIconButton>
					</Tooltip> */}
					<Tooltip title="Edit Task">
						<CustomActionIconButton
							color="info"
							onClick={(e) => {
								e.stopPropagation();
								setTaskData({
									...record,
									id: record.task_id,
								});
								setIsTaskModalOpen(true);
							}}>
							<Iconify icon="solar:pen-bold-duotone" width={16} />
						</CustomActionIconButton>
					</Tooltip>
					<Tooltip title="Delete Task">
						<CustomActionIconButton
							color="error"
							onClick={(e) => {
								e.stopPropagation();
								DeleteActions(record.task_id);
							}}>
							<Iconify icon="solar:trash-bin-trash-bold-duotone" width={16} />
						</CustomActionIconButton>
					</Tooltip>
				</Stack>
			),
		},
	];

	return (
		<Stack spacing={4}>
			<Stack spacing={2} direction={{xs: "column", md: "row"}} sx={{justifyContent: "space-between", alignItems: {xs: "flex-start", md: "center"}}}>
				<Box>
					<Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
						Task Management
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						Organize, assign, and track daily operational tasks across the platform.
					</Typography>
				</Box>

				<Stack spacing={1.5} direction="row" flexWrap="wrap">
					<Button variant="outlined" color="primary" startIcon={<Iconify icon="solar:export-bold-duotone" />}>
						Export Tasks
					</Button>
					<Button
						variant="contained"
						color="primary"
						startIcon={<Iconify icon="solar:pen-new-square-bold" />}
						onClick={() => {
							setIsTaskModalOpen(true);
							setTaskData(null);
						}}>
						Create Task
					</Button>
				</Stack>
			</Stack>

			<Card >
				<Stack spacing={2}>
					<Stack spacing={1} direction="row" sx={{m: 2, px: 2, pt: 2, justifyContent: "space-between", alignItems: "center"}}>
						<CustomSearchInput loading={loadingLoader} defaultValue={search} callBack={setSearch} placeholder="Search tasks by title, ID, assignee..." width={{xs: "100%", md: 400}} />
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
								: [...Array(pageSize >= totalRecode ? totalRecode : pageSize || 1)].map((_, i) => ({
										key: i,
									}))
						}
						scroll={{x: "max-content"}}
						pagination={false}
						rowKey="task_id"
						// onRow={(record) => ({
						// 	onClick: () => navigate(`${AdminRoutes?.TaskDetails}?id=${record.task_id}`),
						// 	style: {cursor: "pointer"},
						// })}
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

			<TaskModel
				open={isTaskModalOpen}
				data={taskData}
				handleClose={() => setIsTaskModalOpen(false)}
				cdSuccess={() => {
					setApiFlag(!apiFlag);
					setIsTaskModalOpen(false);
				}}
			/>

			<TaskFilter
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
