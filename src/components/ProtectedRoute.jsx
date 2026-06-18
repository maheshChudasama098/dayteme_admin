import {useEffect} from "react";
import {useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";

import {isAuthenticated} from "../utils/auth-utils";
import {AuthRoutes} from "../routes/routes";

const ProtectedRoute = ({children}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const {userDetails} = useSelector((state) => state?.auth);

	useEffect(() => {
		if (!isAuthenticated()) {
			navigate(AuthRoutes.Login, {replace: true});
		}
	}, [navigate]);

	useEffect(() => {
		if (isAuthenticated() && !userDetails?.role?.name) {
			// getLoginData();
		}
	}, [location?.pathname, userDetails]);

	// If not authenticated, don't render children
	if (!isAuthenticated()) {
		return null;
	}

	return children;
};

export default ProtectedRoute;
