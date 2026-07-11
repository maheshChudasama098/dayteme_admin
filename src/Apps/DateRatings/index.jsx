import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {useNavigate, useSearchParams} from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import {useTheme, alpha} from "@mui/material/styles";

import {Table} from "antd";

import {AdminRoutes} from "src/routes/routes";
import CustomPagination from "src/components/common/CustomPagination";
import Iconify from "src/components/common/iconify";
import Button from "@mui/material/Button";
import {GetAdminDateRatingsListServices, GetAdminDateRatingsExportServices} from "src/services/Dates.Services";
import DateRatingFilter from "./DateRatingFilter";
import {sweetAlerts, sweetAlertSuccess} from "src/utils/sweet-alerts";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import {fDate} from "src/utils/utils";
import {CustomActionIconButton} from "src/components/common/CustomActionIconButton";

const DateRatingsList = () => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	// pagination and search
	const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
	const [pageSize, setPageSize] = useState(Number(searchParams.get("pageSize")) || 10);
	const [totalRecode, setTotalRecode] = useState(4);
	// search
	const [search, setSearch] = useState(searchParams.get("search") || "");
	const [field, setField] = useState(searchParams.get("field") || null);
	const [order, setOrder] = useState(searchParams.get("order") || null);
	const [list, setList] = useState([]);
	const [apiFlag, setApiFlag] = useState(false);
	const [loadingLoader, setLoadingLoader] = useState(false);

	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filters, setFilters] = useState({
		date_plan_id: searchParams.get("date_plan_id") || "",
		user_id: searchParams.get("user_id") || "",
		review_type: searchParams.get("review_type") || "",
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
				GetAdminDateRatingsListServices(payLoad, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setList(res?.data?.ratings || []);
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
			...(filters.date_plan_id !== "" && {date_plan_id: filters.date_plan_id}),
			...(filters.user_id !== "" && {user_id: filters.user_id}),
			...(filters.review_type !== "" && {review_type: filters.review_type}),
		});
	}, [setSearchParams, page, pageSize, search, field, order, filters]);

	const columns = [
		{
			title: "Date Info",
			key: "dateTitle",
			width: 300,
			render: (_, record) => (
				<Box>
					<Typography variant="subtitle2" sx={{fontWeight: 800, color: "text.primary"}}>
						{record?.date_plan?.date_title}
					</Typography>
					<Typography variant="caption" sx={{color: "text.secondary"}}>
						{fDate(record?.date_plan?.date)}
					</Typography>
				</Box>
			),
		},
		{
			title: "Rated By",
			key: "user",
			width: 300,
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1}>
					<Avatar variant="rounded" sx={{bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main"}}>
						{record?.reviewer_user?.name?.charAt(0)}
					</Avatar>
					<Box>
						<Typography variant="subtitle2" sx={{color: "text.primary"}}>
							{record?.reviewer_user?.name}
						</Typography>
						<Typography variant="caption" sx={{color: "text.secondary"}}>
							{record?.reviewer_user?.email}
						</Typography>
					</Box>
				</Stack>
			),
		},
		{
			title: "Partner Rated",
			key: "partner",
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1}>
					<Avatar variant="rounded" sx={{bgcolor: alpha(theme.palette.secondary.main, 0.1), color: "secondary.main"}}>
						{record?.date_plan?.creator?.name?.charAt(0)}
					</Avatar>
					<Box>
						<Typography variant="subtitle2" sx={{fontWeight: 700, color: "text.primary"}}>
							{record?.date_plan?.creator?.name}
						</Typography>
						<Typography variant="caption" sx={{color: "text.secondary"}}>
							{record?.date_plan?.creator?.email}
						</Typography>
					</Box>
				</Stack>
			),
		},
		{
			title: "Rating",
			dataIndex: "average_score",
			key: "rating",
			render: (average_score) => <Rating value={Number(average_score) || 0} precision={0.1} readOnly size="small" sx={{color: "warning.main"}} />,
		},
		// {
		// 	title: "Feedback",
		// 	dataIndex: "text",
		// 	key: "feedback",
		// 	ellipsis: true,
		// 	render: (text) => (
		// 		<Typography variant="body2" sx={{color: "text.secondary", fontStyle: "italic"}}>
		// 			"{text}"
		// 		</Typography>
		// 	),
		// },
		{
			title: "Type",
			dataIndex: "review_type_label",
			key: "status",
			render: (review_type_label) => (
				<Chip
					label={review_type_label}
					size="small"
					sx={{
						bgcolor: alpha(review_type_label === "Public" ? theme.palette.success.main : theme.palette.warning.main, 0.1),
						color: review_type_label === "Public" ? "success.main" : "warning.main",
						border: "none",
					}}
				/>
			),
		},
		{
			title: "Action",
			key: "action",
			align: "center",
			width: 90,
			render: (_, record) => (
				<CustomActionIconButton
					tooltip="View Detail"
					color="primary"
					children={<Iconify icon="solar:eye-bold-duotone" />}
					onClick={(e) => {
						e.stopPropagation();
						navigate(`${AdminRoutes?.DateDetails}?id=${record.date_plan_id}`);
					}}
				/>
			),
		},
	];

	return (
		<Stack spacing={4}>
			<Stack spacing={2} direction="row" sx={{justifyContent: "space-between", alignItems: "flex-start"}}>
				<Box>
					<Typography variant="h3" fontWeight={800} color="text.primary" gutterBottom>
						Date Ratings
					</Typography>
					<Typography variant="body1" sx={{color: "text.secondary"}}>
						Manage and review all ratings and feedback submitted after dates.
					</Typography>
				</Box>

				<Box>
					<Stack spacing={1.5} direction={{xs: "column", md: "row"}}>
						<Button
							onClick={() => {
								const payLoad = {search, ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined))};
								setLoadingLoader(true);
								dispatch(
									GetAdminDateRatingsExportServices(payLoad, (res) => {
										setLoadingLoader(false);
										if (res?.data) {
											const url = window.URL.createObjectURL(new Blob([res.data]));
											const link = document.createElement("a");
											link.href = url;
											link.setAttribute("download", "date_ratings_export.csv");
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
					</Stack>
				</Box>
			</Stack>

			<Card sx={{borderRadius: 4, boxShadow: theme.shadows[2], overflow: "hidden"}}>
				<Stack spacing={2}>
					<Stack spacing={1} direction="row" sx={{m: 2, px: 2, pt: 2, pb: 1, justifyContent: "space-between"}}>
						<CustomSearchInput loading={loadingLoader} defaultValue={search} callBack={setSearch} placeholder="Search Ratings..." width={400} />
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

			<DateRatingFilter
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

export default DateRatingsList;
