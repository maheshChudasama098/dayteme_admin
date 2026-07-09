import {AdminRoutes} from "src/routes/routes";

// Admin Routes
export const adminNavConfig = [
	{
		title: "Dashboard",
		path: AdminRoutes?.Dashboard,
		icon: "duo-icons:dashboard",
	},
	{
		title: "Users",
		path: AdminRoutes?.UsersList,
		icon: "solar:users-group-rounded-bold-duotone",
	},
	{
		title: "Tasks",
		path: AdminRoutes?.TasksList,
		icon: "solar:checklist-minimalistic-bold-duotone",
	},
	{
		title: "Verification",
		path: AdminRoutes?.VerificationList,
		icon: "solar:shield-check-bold-duotone",
	},
	{
		title: "Safety Center",
		path: AdminRoutes?.UserReportsList,
		icon: "solar:shield-warning-bold-duotone",
	},
	{
		title: "Question",
		path: AdminRoutes?.QuestionList,
		icon: "solar:document-text-bold-duotone",
	},
	{
		title: "Compliance",
		path: AdminRoutes?.ComplianceList,
		icon: "solar:document-text-bold-duotone",
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
		title: "Location",
		path: AdminRoutes?.LocationList,
		icon: "fluent:location-48-filled",
	},
	{
		title: "Gifts",
		path: AdminRoutes?.GiftList,
		icon: "fluent:location-48-filled",
	},
	{
		title: "Payments",
		path: AdminRoutes?.PaymentList,
		icon: "mdi:credit-card-outline",
	},
	{
		title: "Audit Logs",
		path: AdminRoutes?.AuditLogsList,
		icon: "solar:history-bold-duotone",
	},
	{
		title: "Notes",
		path: AdminRoutes?.NotesList,
		icon: "solar:notes-bold-duotone",
	},
	{
		title: "Venues",
		path: AdminRoutes?.VenuesList,
		icon: "solar:buildings-2-bold-duotone",
	},
];
