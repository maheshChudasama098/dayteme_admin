import {useDispatch} from "react-redux";
import {useSearchParams} from "react-router-dom";
import React, {useState, useEffect} from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import {useTheme, alpha} from "@mui/material/styles";

import {Table} from "antd";

import Iconify from "src/components/common/iconify";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import {CustomActionIconButton} from "src/components/common/CustomActionIconButton";

import {sweetAlertQuestion, sweetAlerts, sweetAlertSuccess} from "src/utils/sweet-alerts";

import LocationModel from "./LocationModel";
import {DeleteAdminLocationServices, GetAdminLocationsListServices, GetAdminLocationsExportServices} from "src/services/Locations.Services";
import {fDateTime, getErrorMessage} from "src/utils/utils";

export default function Tickets() {
	const theme = useTheme();
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();

	// pagination and search
	const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
	const [pageSize, setPageSize] = useState(Number(searchParams.get("pageSize")) || 10);
	const [totalRecode, setTotalRecode] = useState(5);
	// search
	const [search, setSearch] = useState(searchParams.get("search") || "");
	const [field, setField] = useState(searchParams.get("field") || null);
	const [order, setOrder] = useState(searchParams.get("order") || null);

	const [isCreateOpen, setIsCreateOpen] = useState(false);

	const [list, setList] = useState();
	const [apiFlag, setApiFlag] = useState(false);
	const [loadingLoader, setLoadingLoader] = useState(false);

	const [selectedLocation, setSelectedLocation] = useState({});

	const handleSearch = (value) => {
		setSearch(value);
		setPage(1);
	};

	const handleSort = (field, order) => {
		setField(field);
		setOrder(order);
		setPage(1);
	};

	const DeleteSubmit = (id) => {
		sweetAlertQuestion("This Location will be permanently deleted. You won’t be able to recover it.", "Delete Location?")
			.then((result) => {
				if (result) {
					dispatch(
						DeleteAdminLocationServices(id, (res) => {
							if (res?.success) {
								setApiFlag(!apiFlag);
								sweetAlertSuccess("Location deleted successfully");
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

	const CreateHandleSuccess = () => {
		setIsCreateOpen(false);
		setTimeout(() => {
			if (!selectedLocation?.id) {
				setPage(1);
			}
			setApiFlag(!apiFlag);
		}, 1000);
	};

	const handleExport = () => {
		const payLoad = {
			search,
		};
		setLoadingLoader(true);
		dispatch(
			GetAdminLocationsExportServices(payLoad, (res) => {
				setLoadingLoader(false);
				if (res?.data) {
					const url = window.URL.createObjectURL(new Blob([res.data]));
					const link = document.createElement("a");
					link.href = url;
					link.setAttribute("download", "locations_export.csv");
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
				GetAdminLocationsListServices(payLoad, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setLoadingLoader(false);
						setList(res?.data?.locations);
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
			title: "Location Name",
			dataIndex: "name",
			key: "name",
			render: (name) => (
				<Typography variant="subtitle2" sx={{fontWeight: 800, color: "text.primary"}}>
					{name}
				</Typography>
			),
		},
		{
			title: "Latitude",
			dataIndex: "lat",
			key: "lat",
			render: (lat) => (
				<Typography variant="caption" sx={{color: "text.secondary"}}>
					{lat}
				</Typography>
			),
		},
		{
			title: "Longitude",
			dataIndex: "long",
			key: "long",
			render: (long) => (
				<Typography variant="caption" sx={{color: "text.secondary"}}>
					{long}
				</Typography>
			),
		},
		{
			title: "created at",
			dataIndex: "created_at",
			key: "created_at",
			render: (date) => (
				<Typography variant="caption" sx={{color: "text.secondary"}}>
					{fDateTime(date)}
				</Typography>
			),
		},
		{
			title: "Action",
			key: "action",
			align: "center",
			fixed: "right",
			width: 120,
			render: (_, record) => (
				<Stack spacing={0.5} direction="row" sx={{justifyContent: "right"}}>
					<CustomActionIconButton
						tooltip="Edit Location"
						color="success"
						onClick={(e) => {
							e.stopPropagation();
							setSelectedLocation(record);
							setIsCreateOpen(true);
						}}>
						<Iconify icon="solar:pen-bold-duotone" width={16} />
					</CustomActionIconButton>

					<CustomActionIconButton
						color="error"
						tooltip="Delete Location"
						onClick={(e) => {
							e.stopPropagation();
							DeleteSubmit(record?.id);
						}}>
						<Iconify icon="solar:trash-bin-trash-bold-duotone" width={16} />
					</CustomActionIconButton>
				</Stack>
			),
		},
	];

	return (
		<Stack spacing={4}>
			<Stack spacing={2} direction="row" sx={{justifyContent: "space-between", alignItems: "flex-start"}}>
				<Box>
					<Typography variant="h3" fontWeight={800} color="text.primary" gutterBottom>
						Locations Management
					</Typography>
					<Typography variant="body1" sx={{color: "text.secondary"}}>
						Total {totalRecode} Locations found
					</Typography>
				</Box>

				<Box>
					<Stack spacing={1.5} direction={{xs: "column", md: "row"}}>
						<Button
							onClick={handleExport}
							disabled={loadingLoader}
							variant="outlined"
							color="primary"
							startIcon={<Iconify icon="solar:download-bold-duotone" />}
							sx={{borderRadius: 2, fontWeight: 800}}
						>
							Export CSV
						</Button>
						<Button
							color="primary"
							variant="contained"
							startIcon={<Iconify icon="ic:round-add-location-alt" width={18} />}
							sx={{borderRadius: 2, fontWeight: 800, boxShadow: theme.shadows[2]}}
							onClick={() => {
								setIsCreateOpen(true);
								setSelectedLocation({});
							}}>
							Add New Location
						</Button>
					</Stack>
				</Box>
			</Stack>

			<Card sx={{borderRadius: 4, boxShadow: theme.shadows[2], overflow: "hidden"}}>
				<Stack spacing={2}>
					<Stack spacing={1} direction="row" sx={{m: 2, px: 2, pt: 2, pb: 1, justifyContent: "space-between"}}>
						<CustomSearchInput loading={loadingLoader} defaultValue={search} callBack={handleSearch} placeholder="Search Location..." width={400} />
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
							onChange={(_, __, sorter) => {
								if (sorter?.field && sorter?.order) {
									handleSort(sorter?.field, sorter?.order);
								} else {
									handleSort(null, null);
								}
							}}
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

			<LocationModel
				open={isCreateOpen}
				handleClose={() => {
					setIsCreateOpen(false);
					setSelectedLocation(null);
				}}
				cdSuccess={CreateHandleSuccess}
				data={selectedLocation}
			/>
		</Stack>
	);
}
