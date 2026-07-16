import {AdminRoutes} from "src/routes/routes";

// Admin Routes with mapped permissions (supports arrays for view/manage capability authorization)
export const adminNavConfig = [
	{
		title: "Dashboard",
		path: AdminRoutes?.Dashboard,
		icon: "duo-icons:dashboard",
		permission: ["view_dashboard"],
	},
	{
		title: "Users",
		path: AdminRoutes?.UsersList,
		icon: "solar:users-group-rounded-bold-duotone",
		permission: ["manage_users", "view_users"],
		child: [
			{
				title: "Users List",
				path: AdminRoutes?.UsersList,
				display: true,
			},
			{
				title: "Deletion Requests",
				path: AdminRoutes?.AccountDeletionRequests,
				display: true,
			},
		],
	},
	{
		title: "Roles & Permissions",
		path: AdminRoutes?.RolesPermissions,
		icon: "solar:shield-user-bold-duotone",
		permission: ["manage_roles"],
	},
	{
		title: "Verification",
		path: AdminRoutes?.VerificationList,
		icon: "solar:shield-check-bold-duotone",
		permission: ["manage_verification", "verify_kyc"],
	},
	{
		title: "Unfreeze Requests",
		path: AdminRoutes?.UnfreezeRequestsList,
		icon: "lets-icons:lock-duotone",
		permission: ["manage_unfreeze"],
	},
	{
		title: "Tasks",
		path: AdminRoutes?.TasksList,
		icon: "solar:checklist-minimalistic-bold-duotone",
		permission: ["manage_tasks"],
	},
	{
		title: "Safety Center",
		path: AdminRoutes?.UserReportsList,
		icon: "solar:shield-warning-bold-duotone",
		permission: ["manage_reports", "view_reports", "resolve_reports"],
	},
	{
		title: "Question",
		path: AdminRoutes?.QuestionList,
		icon: "solar:document-text-bold-duotone",
		permission: ["manage_questions"],
	},
	{
		title: "Dates",
		path: AdminRoutes?.DateList,
		icon: "solar:calendar-date-bold-duotone",
		permission: ["manage_dates"],
	},
	{
		title: "Date Ratings",
		path: AdminRoutes?.DateRatingsList,
		icon: "solar:star-circle-bold-duotone",
		permission: ["manage_ratings"],
	},
	{
		title: "Location",
		path: AdminRoutes?.LocationList,
		icon: "duo-icons:location",
		permission: ["manage_locations"],
	},
	{
		title: "Gifts",
		path: AdminRoutes?.GiftList,
		icon: "solar:gift-bold-duotone",
		permission: ["manage_gifts"],
	},
	{
		title: "Payments",
		path: AdminRoutes?.PaymentList,
		icon: "solar:card-bold-duotone",
		permission: ["manage_payments", "view_payments"],
	},
	// {
	// 	title: "Revenue",
	// 	path: AdminRoutes?.Revenue,
	// 	icon: "solar:wad-of-money-bold-duotone",
	// 	permission: ["manage_revenue"],
	// },
	{
		title: "Audit Logs",
		path: AdminRoutes?.AuditLogsList,
		icon: "solar:history-bold-duotone",
		permission: ["manage_logs"],
	},
	{
		title: "Notes",
		path: AdminRoutes?.NotesList,
		icon: "solar:notes-bold-duotone",
		permission: ["manage_notes"],
	},
	{
		title: "Venues",
		path: AdminRoutes?.VenuesList,
		icon: "solar:buildings-2-bold-duotone",
		permission: ["manage_venues"],
	},
	{
		title: "Settings",
		path: AdminRoutes?.Settings,
		icon: "solar:settings-bold-duotone",
		permission: ["manage_settings"],
	},
];
