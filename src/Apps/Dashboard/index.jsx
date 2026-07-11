import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import {useTheme, alpha} from "@mui/material/styles";

import ReactApexChart from "react-apexcharts";
import Iconify from "src/components/common/iconify";
import {useNavigate} from "react-router-dom";
import {GetAdminDashboardServices} from "src/services/Users.Services";
import {AdminRoutes} from "src/routes/routes";
import {useDispatch} from "react-redux";

const Dashboard = () => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [dashboardData, setDashboardData] = useState(null);

	const adminName = dashboardData?.admin?.name || "Mark Steave";

	const summaryStats = [
		{title: "Total Users", value: dashboardData?.metrics?.total_users || 0, icon: "solar:users-group-two-rounded-bold-duotone", color: "primary", path: AdminRoutes.UsersList},
		{title: "Verified Users", value: dashboardData?.metrics?.verified_users || 0, icon: "solar:user-check-bold-duotone", color: "success", path: AdminRoutes.VerificationList},
		{title: "Verified Pending", value: dashboardData?.metrics?.pending_verification || 0, icon: "solar:user-speak-bold-duotone", color: "warning", path: AdminRoutes.VerificationList},
		{title: "Gender Ratio", value: dashboardData?.metrics?.male_female_ratio || 0, icon: "solar:pie-chart-2-bold-duotone", color: "info"},
		{title: "Active Users", value: dashboardData?.metrics?.daily_active_users || 0, icon: "solar:graph-up-bold-duotone", color: "primary"},
		{title: "Daily Rev", value: dashboardData?.metrics?.revenue_today || 0, icon: "solar:wad-of-money-bold-duotone", color: "success", path: AdminRoutes.PaymentList},
		{title: "Monthly Rev", value: dashboardData?.metrics?.revenue_month || 0, icon: "solar:wallet-money-bold-duotone", color: "success", path: AdminRoutes.PaymentList},
		{title: "Reports", value: dashboardData?.metrics?.open_safety_reports || 0, icon: "solar:shield-warning-bold-duotone", color: "error", path: AdminRoutes.UserReportsList},
		{title: "Events", value: dashboardData?.metrics?.total_users || 0, icon: "solar:calendar-date-bold-duotone", color: "info", path: AdminRoutes.VenuesList},
		{title: "Matches", value: dashboardData?.metrics?.active_matches || 0, icon: "solar:heart-bold-duotone", color: "error"},
		{title: "Premium", value: dashboardData?.metrics?.premium_subscribers || 0, icon: "solar:crown-star-bold-duotone", color: "warning"},
		{title: "Dates", value: dashboardData?.metrics?.dates_scheduled || 0, icon: "solar:calendar-minimalistic-bold-duotone", color: "success", path: AdminRoutes.DateList},
	];

	const chartCategories = dashboardData?.platform_growth?.map((item) => item.month) || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

	const chartOptions = {
		chart: {type: "area", toolbar: {show: false}, fontFamily: "inherit"},
		dataLabels: {enabled: false},
		stroke: {curve: "smooth", width: 3},
		xaxis: {
			categories: chartCategories,
			axisBorder: {show: false},
			axisTicks: {show: false},
		},
		yaxis: {labels: {style: {colors: "#9e9e9e"}}},
		colors: ["#ff4081", "#1976d2"],
		fill: {type: "gradient", gradient: {shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100]}},
		legend: {position: "top", horizontalAlign: "right"},
		grid: {strokeDashArray: 3, borderColor: "#e0e0e0"},
	};

	const chartSeries = [
		{name: "New Users", data: dashboardData?.platform_growth?.map((item) => item.new_users) || [0, 0, 0, 0, 0, 0, 0]},
		{name: "Matches", data: dashboardData?.platform_growth?.map((item) => item.matches) || [0, 0, 0, 0, 0, 0, 0]},
	];

	const recentUsers = dashboardData?.new_members || [];

	useEffect(() => {
		function apiCallAction() {
			dispatch(
				GetAdminDashboardServices((res) => {
					if (res?.success) {
						setDashboardData(res.data);
					}
				}),
			);
		}
		apiCallAction();
	}, [dispatch]);

	return (
		<Stack spacing={3}>
			{/* Header */}
			<Box>
				<Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom>
					Dashboard Overview
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Welcome back, {adminName}! Here is what's happening on your dating platform today.
				</Typography>
			</Box>

			{/* Summary Widgets */}
			<Grid container spacing={2}>
				{summaryStats.map((stat, index) => (
					<Grid size={{xs: 6, sm: 4, md: 3, lg: 2}} key={index}>
						<Card
							variant="outlined"
							onClick={() => stat.path && navigate(stat.path)}
							sx={{
								p: 1.4,
								borderRadius: 3,
								display: "flex",
								alignItems: "center",
								gap: 1.5,
								borderColor: "divider",
								cursor: stat.path ? "pointer" : "default",
								transition: "all 0.2s ease-in-out",
								"&:hover": {
									boxShadow: stat.path ? theme.shadows[3] : "none",
									transform: stat.path ? "translateY(-2px)" : "none",
									borderColor: stat.path ? `${stat.color}.main` : "divider",
								},
							}}>
							<Box
								sx={{
									width: 40,
									height: 40,
									minWidth: 40,
									borderRadius: 2,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									bgcolor: alpha(theme.palette[stat.color].main, 0.1),
									color: `${stat.color}.main`,
								}}>
								<Iconify icon={stat.icon} width={20} />
							</Box>
							<Box sx={{minWidth: 0}}>
								<Typography variant="h6" fontWeight={800} noWrap>
									{stat.value}
								</Typography>
								<Typography variant="caption" color="text.secondary" fontWeight={600} noWrap sx={{display: "block"}}>
									{stat.title}
								</Typography>
							</Box>
						</Card>
					</Grid>
				))}
			</Grid>

			<Grid container spacing={2}>
				{/* Chart Area */}
				<Grid size={{xs: 12, md: 8}}>
					<Card variant="outlined" sx={{p: 3, borderRadius: 2, borderColor: "divider", height: "100%"}}>
						<Typography variant="h6" fontWeight={700} gutterBottom>
							Platform Growth
						</Typography>
						<Typography variant="body2" color="text.secondary" mb={3}>
							Registrations and Matches over the last 7 months
						</Typography>
						<Box sx={{height: 320}}>
							<ReactApexChart options={chartOptions} series={chartSeries} type="area" height="100%" />
						</Box>
					</Card>
				</Grid>

				{/* Recent Users List */}
				<Grid size={{xs: 12, md: 4}}>
					<Card variant="outlined" sx={{p: 3, borderRadius: 2, borderColor: "divider", height: "100%"}}>
						<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
							<Typography variant="h6" fontWeight={700}>
								New Members
							</Typography>
							<Chip label="Today" size="small" color="primary" variant="outlined" />
						</Stack>

						<Stack spacing={3}>
							{recentUsers.map((user) => (
								<Stack direction="row" spacing={2} alignItems="center" key={user.id}>
									<Avatar src={user.profile_photo_url} sx={{width: 42, height: 42}} variant="rounded" />
									<Box sx={{flexGrow: 1, minWidth: 0}}>
										<Typography variant="subtitle2" noWrap>
											{user.name}
										</Typography>
										<Stack direction="row" alignItems="center" spacing={0.5} sx={{color: "text.secondary"}}>
											<Iconify icon="mdi:map-marker" width={14} />
											<Typography variant="caption" noWrap>
												{user.location}
											</Typography>
										</Stack>
									</Box>
									<Typography variant="caption" color="text.disabled" sx={{whiteSpace: "nowrap"}}>
										{user.time_ago}
									</Typography>
								</Stack>
							))}
						</Stack>
					</Card>
				</Grid>
			</Grid>
		</Stack>
	);
};

export default Dashboard;
