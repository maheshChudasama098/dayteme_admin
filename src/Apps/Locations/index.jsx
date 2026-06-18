import {useDispatch} from "react-redux";
import {useSearchParams} from "react-router-dom";
import React, {useState, useEffect} from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import {Table} from "antd";

import Iconify from "src/components/common/iconify";
import CustomTooltip from "src/components/common/CustomTooltip";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";

import {sweetAlertQuestion, sweetAlertSuccess} from "src/utils/sweet-alerts";

import LocationModel from "./LocationModel";

export default function Tickets() {
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

	const dummyLocations = [
		{id: 1, name: "New York, USA", description: "The Big Apple, USA"},
		{id: 2, name: "Los Angeles, USA", description: "City of Angels, CA"},
		{id: 3, name: "London, UK", description: "Capital of England"},
		{id: 4, name: "Paris, France", description: "City of Love"},
		{id: 5, name: "Tokyo, Japan", description: "Bustling Metropolis"},
	];

	const [list, setList] = useState(dummyLocations);
	const [apiFlag, setApiFlag] = useState(false);
	const [loadingLoader, setLoadingLoader] = useState(false);

	const [selectedLocation, setSelectedLocation] = useState({});

	useEffect(() => {
		function apiCallAction() {
			setLoadingLoader(false);
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
		sweetAlertQuestion("This Location will be Deleted. You won’t be able to recover it.", "Delete Location?").then((result) => {
			if (result) {
				setList(list.filter((loc) => loc.id !== id));
				setTotalRecode((prev) => prev - 1);
				sweetAlertSuccess("Location deleted successfully");
			}
		});
	};

	const CreateHandleSuccess = () => {
		setIsCreateOpen(false);
		sweetAlertSuccess(selectedLocation?.id ? "Update Location successfully" : "Create New Location successfully");
		setTimeout(() => {
			if (!selectedLocation?.id) {
				setPage(1);
			}
			setApiFlag(!apiFlag);
		}, 1000);
	};

	const columns = [
		{
			title: "Location Name",
			dataIndex: "name",
			key: "name",
			sorter: true,
		},
		{
			title: "Description",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "Action",
			key: "action",
			align: "center",
			fixed: "right",
			width: 120,
			render: (_, record) => (
				<Stack direction="row" spacing={0} justifyContent="center">
					<CustomTooltip label="Edit location">
						<IconButton
							onClick={() => {
								setSelectedLocation(record);
								setIsCreateOpen(true);
							}}>
							<Iconify icon="tabler:edit-filled" sx={{color: "text.secondary"}} />
						</IconButton>
					</CustomTooltip>
					<CustomTooltip label="Delete location">
						<IconButton onClick={() => DeleteSubmit(record.id)} color="error">
							<Iconify icon="fa6-solid:delete-left" />
						</IconButton>
					</CustomTooltip>
				</Stack>
			),
		},
	];

	return (
		<Stack spacing={2}>
			<Stack spacing={2} direction="row" sx={{justifyContent: "space-between"}}>
				<Box>
					<Typography variant="h4" color="text.primary">
						Location
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						Total {totalRecode} Locations found
					</Typography>
				</Box>

				<Box>
					<Stack spacing={1} direction="row">
						<Button
							color="primary"
							variant="contained"
							startIcon={<Iconify icon="fluent-emoji-high-contrast:plus" width={12} />}
							onClick={() => {
								setIsCreateOpen(true);
							}}>
							Add New Location
						</Button>
					</Stack>
				</Box>
			</Stack>

			<Card>
				<Stack spacing={2}>
					<Stack spacing={1} direction="row" sx={{m: 2, px: 2, pt: 2, justifyContent: "space-between"}}>
						<CustomSearchInput loading={loadingLoader} defaultValue={search} callBack={handleSearch} placeholder="Search Location..." width={400} />
					</Stack>

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
