import {AdminRoutes} from "src/routes/routes";

// Admin Routes
export const adminNavConfig = [
	{
		title: "Dashboard",
		path: AdminRoutes?.Dashboard,
		icon: "ic:round-dashboard",
	},
	{
		title: "Users",
		path: AdminRoutes?.UsersList,
		icon: "solar:users-group-rounded-bold",
	},
	{
		title: "Location",
		path: AdminRoutes?.LocationList,
		icon: "fluent:location-48-filled",
	},
	{
		title: "Questions",
		path: AdminRoutes?.QuestionList,
		icon: "mdi:frequently-asked-questions",
	},
	{
		title: "Dates",
		path: AdminRoutes?.DateList,
		icon: "basil:calendar-solid",
	},
	{
		title: "Date Ratings",
		path: AdminRoutes?.DateRatingsList,
		icon: "mdi:star-circle",
	},
	{
		title: "Gifts",
		path: AdminRoutes?.GiftList,
		icon: "mdi:gift",
	},
	{
		title: "User Reports",
		path: AdminRoutes?.UserReportsList,
		icon: "ic:round-report-problem",
	},
	{
		title: "Payments",
		path: AdminRoutes?.PaymentList,
		icon: "mdi:credit-card-outline",
	},
];
