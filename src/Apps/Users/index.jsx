import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate, useSearchParams} from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import {alpha, useTheme} from "@mui/material";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";

import {Table} from "antd";

import {AdminRoutes} from "src/routes/routes";
import Iconify from "src/components/common/iconify";
import CustomSelect from "src/components/common/CustomSelect";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";

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
	const [priorityFilter, setPriorityFilter] = useState(searchParams.get("priority") || -1);
	const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || -1);

	const dummyUsers = [
		{
			id: 1,
			name: "Angelique Morse",
			email: "benny89@yahoo.com",
			phone: "+46 8 123 456",
			educationWork: "Content Creator at Wuckert Inc",
			status: "Banned",
			gender: "Female",
			born: "1995-04-12",
			location: "New York",
			image: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
		},
		{
			id: 2,
			name: "Ariana Lang",
			email: "avery43@hotmail.com",
			phone: "+54 11 1234-5678",
			educationWork: "IT Administrator at Feest Group",
			status: "Pending",
			gender: "Female",
			born: "1992-08-23",
			location: "Los Angeles",
			image: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
		},
		{
			id: 3,
			name: "Aspen Schmitt",
			email: "mireya13@hotmail.com",
			phone: "+34 91 123 4567",
			educationWork: "Financial Planner at Kihn",
			status: "Banned",
			gender: "Male",
			born: "1988-11-05",
			location: "Chicago",
			image: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
		},
		{
			id: 4,
			name: "Brycen Jimenez",
			email: "tyrel.greenholt@gmail.com",
			phone: "+52 55 1234 5678",
			educationWork: "HR Recruiter at Rempel",
			status: "Active",
			gender: "Male",
			born: "1990-02-14",
			location: "Houston",
			image: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
		},
		{
			id: 5,
			name: "Chase Day",
			email: "joana.simonis84@gmail.com",
			phone: "+86 10 1234 5678",
			educationWork: "Graphic Designer at Mraz",
			status: "Banned",
			gender: "Male",
			born: "1998-07-30",
			location: "Phoenix",
			image: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
		},
		{
			id: 6,
			name: "Fiona Gallagher",
			email: "fiona@example.com",
			phone: "+1 555 123 4567",
			educationWork: "Manager",
			status: "Active",
			gender: "Female",
			born: "1993-09-19",
			location: "Philadelphia",
			image: "https://api.dicebear.com/7.x/avataaars/svg?seed=6",
		},
		{
			id: 7,
			name: "George Miller",
			email: "george@example.com",
			phone: "+1 555 987 6543",
			educationWork: "Director",
			status: "Inactive",
			gender: "Male",
			born: "1985-12-25",
			location: "San Antonio",
			image: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",
		},
		{
			id: 8,
			name: "Hannah Abbott",
			email: "hannah@example.com",
			phone: "+1 555 321 0987",
			educationWork: "Student",
			status: "Active",
			gender: "Female",
			born: "1997-03-08",
			location: "San Diego",
			image: "https://api.dicebear.com/7.x/avataaars/svg?seed=8",
		},
		{
			id: 9,
			name: "Ian Somerhalder",
			email: "ian@example.com",
			phone: "+1 555 654 3210",
			educationWork: "Actor",
			status: "Active",
			gender: "Male",
			born: "1980-10-10",
			location: "Dallas",
			image: "https://api.dicebear.com/7.x/avataaars/svg?seed=9",
		},
		{
			id: 10,
			name: "Julia Roberts",
			email: "julia@example.com",
			phone: "+1 555 111 2222",
			educationWork: "Actress",
			status: "Active",
			gender: "Female",
			born: "1982-05-21",
			location: "San Jose",
			image: "https://api.dicebear.com/7.x/avataaars/svg?seed=10",
		},
	];

	const [list, setList] = useState(dummyUsers);
	const [loadingLoader, setLoadingLoader] = useState(false);

	const columns = [
		{
			title: "User",
			key: "user",
			fixed: "left",
			width: 350,
			ellipsis: true,
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={2}>
					{/* <Avatar src={record.image} sx={{width: 40, height: 40, border: "1px solid #dcdcdc"}} /> */}

					<Box
						sx={{
							p: "1px",
							borderRadius: 50,
							background: (theme) => `linear-gradient(135deg,${alpha(theme.palette?.primary?.main, 0.9)} 0%, ${theme.palette?.common.white} 100%)`,
						}}>
						<Avatar
							src={record.image}
							alt={record?.name}
							sx={{
								width: 40,
								height: 40,
								border: (theme) => `solid 3px ${theme.palette.background.default}`,
								background: (theme) => theme.palette.background.paper,
							}}
						/>
					</Box>
					<Box>
						<Typography variant="subtitle2" color="text.primary">
							{record.name}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{record.email}
						</Typography>
					</Box>
				</Stack>
			),
		},
		{
			title: "Phone Number",
			dataIndex: "phone",
			key: "phone",
			width: 300,
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={2}>
					<Box>
						<Typography variant="subtitle2" color="text.primary">
							{record.phone}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{record.location}
						</Typography>
					</Box>
				</Stack>
			),
		},
		{
			title: "Education / Work",
			dataIndex: "educationWork",
			key: "educationWork",
			ellipsis: true,
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			sorter: true,
			render: (status) => <Chip label={status} size="small" color={status === "Active" ? "success" : status === "Pending" ? "warning" : "error"} sx={{borderRadius: 1}} />,
		},
		{
			title: "Action",
			dataIndex: "action",
			key: "action",
			fixed: "right",
			align: "center",
			width: 90,
			render: () => <Iconify icon="eva:edit-fill" sx={{color: "text.secondary", cursor: "pointer"}} />,
		},
	];

	return (
		<Stack spacing={2}>
			<Stack spacing={2} direction="row" sx={{justifyContent: "space-between"}}>
				<Box>
					<Typography variant="h4" color="text.primary">
						User Management
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						Manage your.
					</Typography>
				</Box>

				<Box>
					<Stack spacing={1} direction="row">
						<Button variant="outlined" color="primary" startIcon={<Iconify icon="material-symbols:download-rounded" />}>
							Export CSV
						</Button>
						<Button
							color="primary"
							variant="contained"
							startIcon={<Iconify icon="fluent-emoji-high-contrast:plus" width={12} />}
							onClick={() => {
								// setIsUserModalOpen(true);
								// setUserData(null);
							}}>
							Add New User
						</Button>
					</Stack>
				</Box>
			</Stack>

			<Card>
				<Stack spacing={2}>
					<Stack spacing={1} direction="row" sx={{m: 2, px: 2, pt: 2, justifyContent: "space-between"}}>
						<CustomSearchInput loading={loadingLoader} defaultValue={search} callBack={setSearch} placeholder="Search by..." width={400} />
						<Stack spacing={1} direction="row">
							<CustomSelect
								label="Priorities"
								menuList={[{name: "Priority", id: -1}]}
								valueKey="id"
								labelKey="name"
								defaultValue={priorityFilter}
								callBackAction={(e) => {
									setPriorityFilter(e);
									setPage(1);
								}}
							/>
							<CustomSelect
								label="Sort"
								menuList={[{status_name: "Status", id: -1}]}
								valueKey="id"
								labelKey="status_name"
								defaultValue={statusFilter}
								callBackAction={(e) => {
									setStatusFilter(e);
									setPage(1);
								}}
							/>
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
		</Stack>
	);
};

export default Index;
