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
];
