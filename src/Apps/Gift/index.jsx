import {useDispatch} from "react-redux";
import {useSearchParams, useNavigate} from "react-router-dom";
import React, {useState, useEffect} from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import {useTheme, alpha} from "@mui/material/styles";

import {Table} from "antd";

import Iconify from "src/components/common/iconify";
import CustomTooltip from "src/components/common/CustomTooltip";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import {CustomActionIconButton} from "src/components/common/CustomActionIconButton";

import {sweetAlertQuestion, sweetAlertSuccess} from "src/utils/sweet-alerts";
import {GetAdminGiftsListServices, DeleteAdminGiftServices} from "src/services/Gift.Services";

import GiftModel from "./GiftModel";
import {AdminRoutes} from "src/routes/routes";
import {Avatar} from "@mui/material";

export default function Gifts() {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();

	// pagination and search
	const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
	const [pageSize, setPageSize] = useState(Number(searchParams.get("pageSize")) || 10);
	const [totalRecode, setTotalRecode] = useState(4);
	// search
	const [search, setSearch] = useState(searchParams.get("search") || "");
	const [field, setField] = useState(searchParams.get("field") || null);
	const [order, setOrder] = useState(searchParams.get("order") || null);

	const [isCreateOpen, setIsCreateOpen] = useState(false);

	const [list, setList] = useState([]);
	const [apiFlag, setApiFlag] = useState(false);
	const [loadingLoader, setLoadingLoader] = useState(false);

	const [selectedGift, setSelectedGift] = useState({});

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
				GetAdminGiftsListServices(payLoad, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setList(res?.data?.gifts || res?.data);
						if (res?.data?.pagination) {
							setTotalRecode(res?.data?.pagination?.total);
						}
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
		sweetAlertQuestion("This Gift will be Deleted. You won’t be able to recover it.", "Delete Gift?").then((result) => {
			if (result) {
				dispatch(
					DeleteAdminGiftServices(id, (res) => {
						if (res?.success) {
							sweetAlertSuccess("Gift deleted successfully");
							setTotalRecode((prev) => prev - 1);
							setApiFlag(!apiFlag);
						}
					}),
				);
			}
		});
	};

	const CreateHandleSuccess = () => {
		setIsCreateOpen(false);
		setTimeout(() => {
			if (!selectedGift?.id) {
				setPage(1);
			}
			setApiFlag(!apiFlag);
		}, 1000);
	};

	const columns = [
		{
			title: "Image",
			key: "image",
			width: 80,
			render: (_, record) => <Avatar src={record?.image?.file_name} variant="rounded" sx={{bgcolor: alpha(theme.palette.primary.main, 0.1)}} />,
		},
		{
			title: "Gift Name",
			dataIndex: "title",
			key: "title",
			render: (title) => (
				<Typography variant="subtitle2" sx={{color: "text.primary"}}>
					{title}
				</Typography>
			),
		},
		{
			title: "Type",
			dataIndex: "type",
			key: "type",
			render: (type) => (
				<Chip
					label={type}
					size="small"
					sx={{
						bgcolor: alpha(type === "Virtual" ? theme.palette.info.main : theme.palette.secondary.main, 0.1),
						color: type === "Virtual" ? "info.main" : "secondary.main",
						fontWeight: 800,
						border: "none",
						borderRadius: 1.5,
					}}
				/>
			),
		},
		{
			title: "Required Sparks",
			dataIndex: "required_coins",
			key: "required_coins",
			sorter: true,
			render: (val) => (
				<Stack direction="row" alignItems="center" spacing={0.5}>
					<Iconify icon="solar:wad-of-money-bold-duotone" width={18} sx={{color: "warning.main"}} />
					<Typography variant="subtitle2" sx={{fontWeight: 800, color: "warning.main"}}>
						{val}
					</Typography>
				</Stack>
			),
		},
		{
			title: "Action",
			key: "action",
			align: "center",
			fixed: "right",
			width: 120,
			render: (_, record) => (
				<Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
					<CustomActionIconButton
						tooltip="Edit gift"
						color="success"
						onClick={(e) => {
							e.stopPropagation();
							setSelectedGift(record);
							setIsCreateOpen(true);
						}}>
						<Iconify icon="solar:pen-bold-duotone" width={16} />
					</CustomActionIconButton>

					<CustomActionIconButton
						color="error"
						tooltip="Delete gift"
						onClick={(e) => {
							e.stopPropagation();
							DeleteSubmit(record.id);
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
						Gifts Management
					</Typography>
					<Typography variant="body1" sx={{color: "text.secondary"}}>
						Total {totalRecode} Gifts found
					</Typography>
				</Box>

				<Box>
					<Stack spacing={1.5} direction="row">
						<Button
							color="primary"
							variant="contained"
							startIcon={<Iconify icon="solar:gift-bold-duotone" width={20} />}
							sx={{borderRadius: 2, fontWeight: 800, boxShadow: theme.shadows[2]}}
							onClick={() => {
								setSelectedGift(null);
								setIsCreateOpen(true);
							}}>
							Add New Gift
						</Button>
					</Stack>
				</Box>
			</Stack>

			<Card sx={{borderRadius: 4, boxShadow: theme.shadows[2], overflow: "hidden"}}>
				<Stack spacing={2}>
					<Stack spacing={1} direction="row" sx={{m: 2, px: 2, pt: 2, pb: 1, justifyContent: "space-between"}}>
						<CustomSearchInput loading={loadingLoader} defaultValue={search} callBack={handleSearch} placeholder="Search Gift..." width={400} />
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
							onRow={(record) => ({
								onClick: () => navigate(`${AdminRoutes?.GiftDetails}?id=${record.id}`),
								style: {cursor: "pointer"},
							})}
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

			{isCreateOpen && (
				<GiftModel
					open={isCreateOpen}
					handleClose={() => {
						setIsCreateOpen(false);
						setSelectedGift(null);
					}}
					cdSuccess={CreateHandleSuccess}
					data={selectedGift}
				/>
			)}
		</Stack>
	);
}
