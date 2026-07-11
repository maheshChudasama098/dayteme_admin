import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";

import {isAuthenticated} from "../utils/auth-utils";
import {AuthRoutes, AdminRoutes} from "../routes/routes";
import {GetAdminRoleByIdServices} from "../services/Roles.Services";
import {useHasPermission} from "../hooks/use-permission";
import {adminNavConfig} from "../layouts/config-navigation";

const getRequiredPermissionForPath = (pathname) => {
	// First check exact match in adminNavConfig or its children
	for (const item of adminNavConfig) {
		if (item.path === pathname) return item.permission;
		if (item.child) {
			const childMatch = item.child.find((c) => c.path === pathname);
			if (childMatch) return childMatch.permission || item.permission;
		}
	}

	// Check sub-paths / details matches
	if (pathname.startsWith("/user/details") || pathname.startsWith("/users/")) {
		return ["manage_users", "view_users"];
	}
	if (pathname.startsWith("/verification/details")) {
		return ["manage_verification", "verify_kyc"];
	}
	if (pathname.startsWith("/compliance/details")) {
		return ["manage_compliance"];
	}
	if (pathname.startsWith("/tasks/details")) {
		return ["manage_tasks"];
	}
	if (pathname.startsWith("/user-reports/details")) {
		return ["manage_reports", "view_reports", "resolve_reports"];
	}
	if (pathname.startsWith("/venues/details")) {
		return ["manage_venues"];
	}
	if (pathname.startsWith("/dates/details")) {
		return ["manage_dates"];
	}
	if (pathname.startsWith("/gifts/details")) {
		return ["manage_gifts"];
	}
	if (pathname.startsWith("/audit-logs/details")) {
		return ["manage_logs"];
	}

	// Default fallback: search if any nav path is a prefix of pathname
	const prefixMatch = adminNavConfig.find((item) => {
		if (!item.path || item.path === "/" || item.path === "/dashboard") return false;
		return pathname.startsWith(item.path);
	});
	if (prefixMatch) return prefixMatch.permission;

	return null;
};

const ProtectedRoute = ({children}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const {userDetails, permissions} = useSelector((state) => state?.auth);
	const {hasPermission} = useHasPermission();

	// Fetch permissions if authenticated but permissions list is empty
	useEffect(() => {
		if (isAuthenticated()) {
			const roleId = userDetails?.role_id || userDetails?.role?.id;
			if (roleId && (!permissions || permissions.length === 0)) {
				dispatch(
					GetAdminRoleByIdServices(roleId, (res) => {
						if (res?.success) {
							const roleData = res?.data?.role || res?.data;
							const perms = roleData?.permissions || [];
							dispatch({
								type: "USER_PERMISSION",
								permissions: perms,
							});
							localStorage.setItem("permissions", JSON.stringify(perms));
						}
					})
				);
			}
		}
	}, [dispatch, permissions, userDetails]);

	useEffect(() => {
		if (!isAuthenticated()) {
			navigate(AuthRoutes.Login, {replace: true});
		}
	}, [navigate]);

	// Page-level permission checks
	const requiredPermission = getRequiredPermissionForPath(location.pathname);
	const authorized = hasPermission(requiredPermission);

	useEffect(() => {
		if (isAuthenticated() && !authorized) {
			navigate(AdminRoutes.Dashboard, {replace: true});
		}
	}, [location.pathname, authorized, navigate]);

	// If not authenticated or not authorized, don't render children
	if (!isAuthenticated() || !authorized) {
		return null;
	}

	return children;
};

export default ProtectedRoute;
