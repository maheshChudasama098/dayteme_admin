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
import CustomSearchInput from "src/components/common/CustomSearchInput";
import Iconify from "src/components/common/iconify";

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

	const dummyRatings = [
		{id: 1, dateTitle: "Coffee at Starbucks", user: {name: "Alice Johnson", avatar: "https://randomuser.me/api/portraits/women/44.jpg"}, partner: {name: "Bob Smith", avatar: "https://randomuser.me/api/portraits/men/46.jpg"}, rating: 5, feedback: "Great time! Bob is really funny.", status: "Approved", dateId: 1},
		{id: 2, dateTitle: "Dinner Date", user: {name: "Ariana Lang", avatar: "https://randomuser.me/api/portraits/women/68.jpg"}, partner: {name: "Charlie Davis", avatar: "https://randomuser.me/api/portraits/men/33.jpg"}, rating: 4, feedback: "Food was good, conversation was decent.", status: "Approved", dateId: 2},
		{id: 3, dateTitle: "Movie Night", user: {name: "Fiona Gallagher", avatar: "https://randomuser.me/api/portraits/women/24.jpg"}, partner: {name: "George Miller", avatar: "https://randomuser.me/api/portraits/men/12.jpg"}, rating: 2, feedback: "He talked through the whole movie.", status: "Pending", dateId: 3},
		{id: 4, dateTitle: "Museum Tour", user: {name: "Hannah Abbott", avatar: "https://randomuser.me/api/portraits/women/11.jpg"}, partner: {name: "Ian Somerhalder", avatar: "https://randomuser.me/api/portraits/men/50.jpg"}, rating: 5, feedback: "We both love art, it was perfect.", status: "Approved", dateId: 4},
	];

	const [list, setList] = useState(dummyRatings);
	const [loadingLoader, setLoadingLoader] = useState(false);

	useEffect(() => {
		setSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			...(search && {search}),
		});
	}, [setSearchParams, page, pageSize, search]);

	const columns = [
		{
			title: "Date Info",
			dataIndex: "dateTitle",
			key: "dateTitle",
			render: (title) => (
				<Typography variant="subtitle2" sx={{fontWeight: 800, color: "text.primary"}}>
					{title}
				</Typography>
			)
		},
		{
			title: "Rated By",
			key: "user",
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1.5} sx={{py: 0.5}}>
					<Avatar src={record.user.avatar} sx={{width: 32, height: 32, bgcolor: alpha(theme.palette.primary.main, 0.1)}} />
					<Typography variant="subtitle2" sx={{fontWeight: 700, color: "text.primary"}}>
						{record.user.name}
					</Typography>
				</Stack>
			),
		},
		{
			title: "Partner Rated",
			key: "partner",
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1.5} sx={{py: 0.5}}>
					<Avatar src={record.partner.avatar} sx={{width: 32, height: 32, bgcolor: alpha(theme.palette.secondary.main, 0.1)}} />
					<Typography variant="subtitle2" sx={{fontWeight: 700, color: "text.primary"}}>
						{record.partner.name}
					</Typography>
				</Stack>
			),
		},
		{
			title: "Rating",
			dataIndex: "rating",
			key: "rating",
			render: (rating) => <Rating value={rating} readOnly size="small" sx={{color: "warning.main"}} />
		},
		{
			title: "Feedback",
			dataIndex: "feedback",
			key: "feedback",
			ellipsis: true,
			render: (feedback) => (
				<Typography variant="body2" sx={{color: "text.secondary", fontStyle: "italic"}}>
					"{feedback}"
				</Typography>
			)
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (status) => (
				<Chip 
					label={status} 
					size="small" 
					sx={{
						bgcolor: alpha(
							status === "Approved" ? theme.palette.success.main : theme.palette.warning.main, 0.1
						),
						color: status === "Approved" ? "success.main" : "warning.main",
						fontWeight: 800,
						border: "none",
						borderRadius: 1.5
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
				<Box sx={{
					display: "inline-flex", 
					justifyContent: "center", 
					alignItems: "center", 
					p: 1, 
					borderRadius: 2, 
					bgcolor: alpha(theme.palette.primary.main, 0.1),
					color: "primary.main",
					cursor: "pointer",
					transition: "background 0.2s",
					"&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.2) }
				}} onClick={(e) => {
					e.stopPropagation();
					navigate(`${AdminRoutes?.DateDetails}?id=${record.dateId}`);
				}}>
					<Iconify icon="solar:eye-bold-duotone" width={18} />
				</Box>
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
			</Stack>

			<Card sx={{borderRadius: 4, boxShadow: theme.shadows[2], overflow: "hidden"}}>
				<Stack spacing={2}>
					<Stack spacing={1} direction="row" sx={{m: 2, px: 2, pt: 2, pb: 1, justifyContent: "space-between"}}>
						<CustomSearchInput loading={loadingLoader} defaultValue={search} callBack={setSearch} placeholder="Search Ratings..." width={400} />
					</Stack>

					<Box sx={{
						"& .ant-table-wrapper": {borderRadius: 0},
						"& .ant-table": {background: "transparent"},
						"& .ant-table-thead > tr > th": {
							background: alpha(theme.palette.text.primary, 0.02), 
							fontWeight: 800, 
							color: "text.secondary", 
							borderBottom: `1px dashed ${theme.palette.divider}`,
							textTransform: "uppercase",
							fontSize: "0.75rem"
						},
						"& .ant-table-tbody > tr > td": {
							borderBottom: `1px dashed ${theme.palette.divider}`
						},
						"& .ant-table-tbody > tr:hover > td": {
							background: alpha(theme.palette.primary.main, 0.01)
						},
						"& .ant-table-tbody > tr:last-child > td": {
							borderBottom: "none"
						}
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
								onClick: () => navigate(`${AdminRoutes?.DateDetails}?id=${record.dateId}`),
								style: {cursor: "pointer"},
							})}
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
		</Stack>
	);
};

export default DateRatingsList;
