import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {useNavigate, useSearchParams} from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import {useTheme, alpha} from "@mui/material/styles";
import {Table} from "antd";

import Iconify from "src/components/common/iconify";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import CustomTooltip from "src/components/common/CustomTooltip";
import {CustomActionIconButton} from "src/components/common/CustomActionIconButton";

import {GetAdminNotesListServices, GetAdminNotesExportServices, DeleteAdminNoteServices} from "src/services/Notes.Services";
import NoteFilter from "./NoteFilter";
import NoteModel from "./NoteModel";
import {sweetAlertQuestion, sweetAlertSuccess, sweetAlerts} from "src/utils/sweet-alerts";

export default function NotesList() {
	const theme = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
	const [pageSize, setPageSize] = useState(Number(searchParams.get("pageSize")) || 10);
	const [totalRecode, setTotalRecode] = useState(5);
	const [search, setSearch] = useState(searchParams.get("search") || "");
	const [field, setField] = useState(searchParams.get("field") || null);
	const [order, setOrder] = useState(searchParams.get("order") || null);

	const [list, setList] = useState([]);
	const [apiFlag, setApiFlag] = useState(false);
	const [loadingLoader, setLoadingLoader] = useState(false);

	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filters, setFilters] = useState({
		user_id: searchParams.get("user_id") || "",
		admin_id: searchParams.get("admin_id") || "",
	});

	const [isModelOpen, setIsModelOpen] = useState(false);
	const [selectedNote, setSelectedNote] = useState({});

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
				GetAdminNotesListServices(payLoad, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setList(res?.data?.notes || res?.data || []);
						if (res?.data?.pagination) {
							setTotalRecode(res?.data?.pagination?.total);
						}
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
			...(filters.admin_id !== "" && {admin_id: filters.admin_id}),
		});
	}, [setSearchParams, page, pageSize, search, field, order, filters]);

	const handleDelete = (id) => {
		sweetAlertQuestion("Are you sure you want to delete this note?", "You won't be able to revert this!", "warning", "Yes, delete it!").then((res) => {
			if (res) {
				dispatch(
					DeleteAdminNoteServices(id, (resp) => {
						if (resp?.success) {
							sweetAlertSuccess("Note deleted successfully!");
							setApiFlag(!apiFlag);
						} else {
							sweetAlerts("error", resp?.message || "Failed to delete note");
						}
					}),
				);
			}
		});
	};

	const columns = [
		{
			title: "Administrator",
			key: "admin",
			width: 250,
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1.5}>
					<Avatar sx={{width: 32, height: 32, bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main"}}>{record?.admin?.name?.charAt(0) || "A"}</Avatar>
					<Box>
						<Typography variant="subtitle2" color="text.primary" noWrap sx={{fontWeight: 700}}>
							{record?.admin?.name}
						</Typography>
						<Typography variant="caption" sx={{color: "text.secondary"}}>
							{record?.admin?.email}
						</Typography>
					</Box>
				</Stack>
			),
		},
		{
			title: "Target User",
			key: "target",
			width: 250,
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1.5}>
					<Avatar sx={{width: 32, height: 32, bgcolor: alpha(theme.palette.secondary.main, 0.1), color: "secondary.main"}}>{record?.user?.name?.charAt(0) || "U"}</Avatar>
					<Box>
						<Typography variant="subtitle2" color="text.primary" noWrap sx={{fontWeight: 700}}>
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
			title: "Note Content",
			dataIndex: "note",
			key: "content",
			width: 350,
			render: (text) => (
				<Typography variant="body2" sx={{color: "text.secondary"}}>
					"{text}"
				</Typography>
			),
		},
		{
			title: "Date & Time",
			dataIndex: "created_at",
			key: "date",
			width: 180,
			render: (created_at) => <Typography variant="body2">{created_at ? new Date(created_at).toLocaleDateString() : ""}</Typography>,
		},
		{
			title: "Action",
			key: "action",
			align: "center",
			width: 120,
			render: (_, record) => (
				<Stack direction="row" spacing={0.5} justifyContent="center">
					<CustomActionIconButton
						tooltip="Edit"
						color="info"
						children={<Iconify icon="solar:pen-bold-duotone" />}
						onClick={() => {
							setSelectedNote(record);
							setIsModelOpen(true);
						}}
					/>
					<CustomActionIconButton tooltip="Delete" children={<Iconify icon="solar:trash-bin-trash-bold-duotone" />} color="error" onClick={() => handleDelete(record.id)} />
				</Stack>
			),
		},
	];

	return (
		<Stack spacing={4}>
			<Stack spacing={2} direction={{xs: "column", md: "row"}} sx={{justifyContent: "space-between", alignItems: {xs: "flex-start", md: "center"}}}>
				<Box>
					<Typography variant="h3" fontWeight={800} color="text.primary" gutterBottom>
						Internal Notes
					</Typography>
					<Typography variant="body1" sx={{color: "text.secondary"}}>
						View and manage all internal notes attached to users.
					</Typography>
				</Box>

				<Box>
					<Stack spacing={1.5} direction={{xs: "column", md: "row"}}>
						<Button
							onClick={() => {
								const payLoad = {search, ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined))};
								setLoadingLoader(true);
								dispatch(
									GetAdminNotesExportServices(payLoad, (res) => {
										setLoadingLoader(false);
										if (res?.data) {
											const url = window.URL.createObjectURL(new Blob([res.data]));
											const link = document.createElement("a");
											link.href = url;
											link.setAttribute("download", "notes_export.csv");
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
						<Button
							color="primary"
							variant="contained"
							startIcon={<Iconify icon="solar:add-circle-bold-duotone" />}
							onClick={() => {
								setSelectedNote({});
								setIsModelOpen(true);
							}}>
							Add Note
						</Button>
					</Stack>
				</Box>
			</Stack>

			<Card sx={{borderRadius: 4, boxShadow: theme.shadows[2], overflow: "hidden"}}>
				<Stack spacing={2}>
					<Stack spacing={2} direction="row" sx={{m: 2, px: 2, pt: 2, pb: 1, justifyContent: "space-between"}}>
						<CustomSearchInput loading={loadingLoader} defaultValue={search} callBack={setSearch} placeholder="Search by content, admin, or user..." width={{xs: "100%", md: 400}} />
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
								background: alpha(theme.palette.primary.main, 0.04),
								fontWeight: 800,
								color: "text.secondary",
								borderBottom: `1px solid ${theme.palette.divider}`,
								textTransform: "uppercase",
								fontSize: "0.75rem",
								letterSpacing: 0.5,
							},
							"& .ant-table-tbody > tr > td": {
								borderBottom: `1px dashed ${theme.palette.divider}`,
								py: 2,
							},
							"& .ant-table-tbody > tr:hover > td": {
								background: alpha(theme.palette.primary.main, 0.02),
							},
							"& .ant-table-tbody > tr:last-child > td": {
								borderBottom: "none",
							},
						}}>
						<Table
							className="custom-ant-table"
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

			{isModelOpen && <NoteModel open={isModelOpen} onClose={() => setIsModelOpen(false)} data={selectedNote} onSuccess={() => setApiFlag(!apiFlag)} />}

			<NoteFilter
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
