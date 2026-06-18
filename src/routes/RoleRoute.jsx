import {useSelector} from "react-redux";
import {Navigate, Outlet, useOutletContext} from "react-router-dom";

import {AdminRoutes} from "./routes";

const RoleRoute = ({allowedRole}) => {
	const user = useSelector((state) => state.auth.user);
	const role = user?.role;
	const context = useOutletContext();

	if (role === allowedRole) {
		return <Outlet context={context} />;
	}

	const redirects = {
		admin: AdminRoutes?.Dashboard,
	};

	return <Navigate to={redirects[role] || AdminRoutes?.Dashboard} replace />;
};

export default RoleRoute;
