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
import {useTheme} from "@mui/material/styles";
import {Table} from "antd";

import Iconify from "src/components/common/iconify";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import {CustomActionIconButton} from "src/components/common/CustomActionIconButton";

import {GetAdminVenuesListServices, GetAdminVenuesExportServices, DeleteAdminVenueServices} from "src/services/Venues.Services";
import VenueFilter from "./VenueFilter";
import VenueModel from "./VenueModel";
import {sweetAlertQuestion, sweetAlertSuccess, sweetAlerts} from "src/utils/sweet-alerts";
import {getErrorMessage} from "src/utils/utils";

export default function VenuesList() {
	const theme = useTheme();
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();

	const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
	const [pageSize, setPageSize] = useState(Number(searchParams.get("pageSize")) || 10);
	const [totalRecode, setTotalRecode] = useState(0);
	const [search, setSearch] = useState(searchParams.get("search") || "");

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
	}, [dispatch, apiFlag, search, page, pageSize, filters]);

	useEffect(() => {
		setSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			...(search && {search}),
			...(filters.category !== "" && {category: filters.category}),
			...(filters.parking !== "" && {parking: filters.parking}),
			...(filters.security !== "" && {security: filters.security}),
			...(filters.is_paid !== "" && {is_paid: filters.is_paid}),
		});
	}, [setSearchParams, page, pageSize, search, filters]);

	const handleDelete = (id) => {
		sweetAlertQuestion("Are you sure you want to delete this venue?", "You won't be able to revert this!").then((res) => {
			if (res) {
				dispatch(
					DeleteAdminVenueServices(id, (resp) => {
						if (resp?.success) {
							sweetAlertSuccess("Venue deleted successfully!");
							setApiFlag(!apiFlag);
						} else {
							const error = getErrorMessage(resp);
							sweetAlerts("error", error);
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
				<Stack direction="row" alignItems="center" spacing={1}>
					<Avatar src={record?.image_url} alt={record?.title} variant="rounded" />
					<Box>
						<Typography variant="subtitle2" color="text.primary" noWrap>
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
			title: "Type",
			key: "is_paid",
			width: 100,
			render: (_, record) => <Chip label={record.is_paid ? "Paid" : "Free"} variant="filled" color={record.is_paid ? "error" : "success"} />,
		},
		{
			title: "Amenities",
			key: "amenities",
			width: 200,
			render: (_, record) => (
				<Stack direction="row" spacing={1} flexWrap="wrap">
					{Boolean(record.parking) && <Chip label="Parking" variant="outlined" color="primary" />}
					{Boolean(record.security) && <Chip label="Security" variant="outlined" color="secondary" />}
				</Stack>
			),
		},

		{
			title: "Availability",
			key: "availability",
			width: 150,
			render: (_, record) => (
				<Typography variant="caption" sx={{color: "text.secondary"}}>
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
						color="info"
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
						startIcon={<Iconify icon="solar:download-bold-duotone" />}>
						Export CSV
					</Button>
					<Button
						color="primary"
						variant="contained"
						startIcon={<Iconify icon="solar:add-circle-bold-duotone" />}
						onClick={() => {
							setSelectedVenue({});
							setIsModelOpen(true);
						}}>
						Add Venue
					</Button>
				</Stack>
			</Stack>

			<Card sx={{borderRadius: 4, boxShadow: theme.shadows[2], overflow: "hidden"}}>
				<Stack spacing={2}>
					<Stack spacing={2} direction="row" sx={{px: 2, pt: 2, justifyContent: "space-between"}}>
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

					<Table
						className="custom-ant-table"
						columns={
							!loadingLoader
								? columns
								: columns.map((col) => ({
										...col,
										render: () => <Skeleton variant="text" animation="wave" height={40} />,
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
