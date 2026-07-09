import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {useSearchParams} from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import {useTheme, alpha} from "@mui/material/styles";
import {Table} from "antd";

import Iconify from "src/components/common/iconify";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import CustomTooltip from "src/components/common/CustomTooltip";
import {CustomActionIconButton} from "src/components/common/CustomActionIconButton";

import {GetAdminVenuesListServices, GetAdminVenuesExportServices, DeleteAdminVenueServices} from "src/services/Venues.Services";
import VenueFilter from "./VenueFilter";
import VenueModel from "./VenueModel";
import {sweetAlertQuestion, sweetAlertSuccess, sweetAlerts} from "src/utils/sweet-alerts";

export default function VenuesList() {
	const theme = useTheme();
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();

	const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
	const [pageSize, setPageSize] = useState(Number(searchParams.get("pageSize")) || 10);
	const [totalRecode, setTotalRecode] = useState(0);
	const [search, setSearch] = useState(searchParams.get("search") || "");
	const [field, setField] = useState(searchParams.get("field") || null);
	const [order, setOrder] = useState(searchParams.get("order") || null);

	const [list, setList] = useState([]);
	const [apiFlag, setApiFlag] = useState(false);
	const [loadingLoader, setLoadingLoader] = useState(false);

	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filters, setFilters] = useState({
		category: searchParams.get("category") || "",
		parking: searchParams.get("parking") || "",
		security: searchParams.get("security") || "",
		is_paid: searchParams.get("is_paid") || "",
	});

	const [isModelOpen, setIsModelOpen] = useState(false);
	const [selectedVenue, setSelectedVenue] = useState({});

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
				GetAdminVenuesListServices(payLoad, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setList(res?.data?.data || res?.data?.venues || res?.data || []);
						if (res?.data?.pagination) {
							setTotalRecode(res?.data?.pagination?.total);
						} else if (res?.data?.total) {
							setTotalRecode(res?.data?.total);
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
			...(filters.category !== "" && {category: filters.category}),
			...(filters.parking !== "" && {parking: filters.parking}),
			...(filters.security !== "" && {security: filters.security}),
			...(filters.is_paid !== "" && {is_paid: filters.is_paid}),
		});
	}, [setSearchParams, page, pageSize, search, field, order, filters]);

	const handleDelete = (id) => {
		sweetAlertQuestion("Are you sure you want to delete this venue?", "You won't be able to revert this!", "warning", "Yes, delete it!").then((res) => {
			if (res.isConfirmed) {
				dispatch(
					DeleteAdminVenueServices(id, (resp) => {
						if (resp?.success) {
							sweetAlertSuccess("Venue deleted successfully!");
							setApiFlag(!apiFlag);
						} else {
							sweetAlerts("error", resp?.message || "Failed to delete venue");
						}
					}),
				);
			}
		});
	};

	const columns = [
		{
			title: "Title & Details",
			key: "title",
			width: 250,
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={2}>
					<Avatar src={record?.image_url} alt={record?.title} variant="rounded" sx={{ width: 48, height: 48 }} />
					<Box>
						<Typography variant="subtitle2" color="text.primary" noWrap sx={{fontWeight: 700}}>
							{record?.title}
						</Typography>
						<Typography variant="caption" sx={{color: "text.secondary"}}>
							{record?.category}
						</Typography>
					</Box>
				</Stack>
			),
		},
		{
			title: "Address",
			key: "address",
			width: 300,
			render: (_, record) => (
				<Box>
					<Typography variant="body2" color="text.primary">
						{record?.address}
					</Typography>
					<Typography variant="caption" sx={{color: "text.secondary"}}>
						{record?.latitude}, {record?.longitude}
					</Typography>
				</Box>
			),
		},
		{
			title: "Amenities",
			key: "amenities",
			width: 150,
			render: (_, record) => (
				<Stack direction="row" spacing={0.5} flexWrap="wrap">
					{Boolean(record.parking) && <Chip label="Parking" size="small" variant="outlined" color="primary" sx={{height: 20, fontSize: "0.65rem"}} />}
					{Boolean(record.security) && <Chip label="Security" size="small" variant="outlined" color="secondary" sx={{height: 20, fontSize: "0.65rem"}} />}
				</Stack>
			),
		},
		{
			title: "Type",
			key: "is_paid",
			width: 100,
			render: (_, record) => (
				<Chip 
					label={Boolean(record.is_paid) ? "Paid" : "Free"} 
					size="small" 
					variant="outlined" 
					color={Boolean(record.is_paid) ? "error" : "success"} 
					sx={{height: 20, fontSize: "0.65rem"}} 
				/>
			),
		},
		{
			title: "Availability",
			key: "availability",
			width: 150,
			render: (_, record) => (
				<Typography variant="subtitle2" sx={{fontWeight: 600, color: "text.secondary"}}>
					{record?.start_time} - {record?.end_time}
				</Typography>
			),
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
						children={<Iconify icon="solar:pen-bold-duotone" />}
						color="success"
						onClick={() => {
							setSelectedVenue(record);
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
						Venues
					</Typography>
					<Typography variant="body1" sx={{color: "text.secondary"}}>
						Manage all date venues, their availability, and location properties.
					</Typography>
				</Box>

				<Box>
					<Stack spacing={1.5} direction={{xs: "column", md: "row"}}>
						<Button
							onClick={() => {
								const payLoad = {search, ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined))};
								setLoadingLoader(true);
								dispatch(
									GetAdminVenuesExportServices(payLoad, (res) => {
										setLoadingLoader(false);
										if (res?.data) {
											const url = window.URL.createObjectURL(new Blob([res.data]));
											const link = document.createElement("a");
											link.href = url;
											link.setAttribute("download", "venues_export.csv");
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
						<Button
							color="primary"
							variant="contained"
							startIcon={<Iconify icon="solar:add-circle-bold-duotone" />}
							sx={{borderRadius: 2, fontWeight: 800}}
							onClick={() => {
								setSelectedVenue({});
								setIsModelOpen(true);
							}}>
							Add Venue
						</Button>
					</Stack>
				</Box>
			</Stack>

			<Card sx={{borderRadius: 4, boxShadow: theme.shadows[2], overflow: "hidden"}}>
				<Stack spacing={2}>
					<Stack spacing={2} direction="row" sx={{m: 2, px: 2, pt: 2, pb: 1, justifyContent: "space-between"}}>
						<CustomSearchInput loading={loadingLoader} defaultValue={search} callBack={setSearch} placeholder="Search by name or address..." width={{xs: "100%", md: 400}} />
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

			{isModelOpen && <VenueModel open={isModelOpen} onClose={() => setIsModelOpen(false)} data={selectedVenue} onSuccess={() => setApiFlag(!apiFlag)} />}

			<VenueFilter
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
