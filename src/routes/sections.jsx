import {lazy, Suspense} from "react";
import {Outlet, useRoutes, useLocation, Navigate} from "react-router-dom";

import {AnimatePresence} from "framer-motion";

import {AdminRoutes, AuthRoutes} from "./routes";

import DashboardLayout from "src/layouts/index";

import Loader from "src/components/common/Loaders/Loader";
import ProtectedRoute from "src/components/ProtectedRoute";
import RouteTransition from "src/components/common/Animated/RouteTransition";

// ─── Common ───────────────────────────────────────────────────────────────── //
export const NotFound = lazy(() => import("../Apps/NotFound"));
export const InternalServerError = lazy(() => import("../Apps/InternalServerError"));

export const LoginPage = lazy(() => import("../Apps/Auth/Login"));
export const ForgotPassword = lazy(() => import("../Apps/Auth/ForgotPassword"));
export const ResetPassword = lazy(() => import("../Apps/Auth/ResetPassword"));

export const Dashboard = lazy(() => import("../Apps/Dashboard"));
export const UsersList = lazy(() => import("../Apps/Users"));
export const UserDetails = lazy(() => import("../Apps/Users/UserDetails"));

export const LocationsList = lazy(() => import("../Apps/Locations"));
export const QuestionsList = lazy(() => import("../Apps/Questions"));
export const DateList = lazy(() => import("../Apps/Date"));
export const DateDetails = lazy(() => import("../Apps/Date/DateDetails"));
export const DateRatingsList = lazy(() => import("../Apps/DateRatings"));
export const GiftList = lazy(() => import("../Apps/Gift"));
export const GiftDetails = lazy(() => import("../Apps/Gift/GiftDetails"));

export const UserReportsList = lazy(() => import("../Apps/UserReports"));
export const UserReportDetails = lazy(() => import("../Apps/UserReports/UserReportDetails"));
export const PaymentList = lazy(() => import("../Apps/Payments"));
export const Profile = lazy(() => import("../Apps/Profile"));
export const VerificationList = lazy(() => import("../Apps/Verification"));
export const VerificationDetails = lazy(() => import("../Apps/Verification/VerificationDetails"));
export const ComplianceList = lazy(() => import("../Apps/Compliance"));
export const ComplianceDetails = lazy(() => import("../Apps/Compliance/ComplianceDetails"));
export const TasksList = lazy(() => import("../Apps/Tasks"));
export const TaskDetails = lazy(() => import("../Apps/Tasks/TaskDetails"));
export const AuditLogsList = lazy(() => import("../Apps/AuditLogs"));
export const AuditLogDetails = lazy(() => import("../Apps/AuditLogs/AuditLogDetails"));
export const NotesList = lazy(() => import("../Apps/Notes"));
export const VenuesList = lazy(() => import("../Apps/Venues"));

export default function Router() {
	const location = useLocation();

	const CommRoutes = [
		{path: "*", element: <NotFound />, index: true},
		{path: "/", element: <Navigate to="/login" replace />, index: true},
		{path: "/500", element: <InternalServerError />, index: true},
		{path: AuthRoutes.Login, element: <LoginPage />, index: true},
		{path: AuthRoutes.ForgotPassword, element: <ForgotPassword />, index: true},
		{path: AuthRoutes.ResetPassword, element: <ResetPassword />, index: true},
	];

	const Rotes = [
		{path: AdminRoutes?.Dashboard, element: <Dashboard />},
		{path: AdminRoutes?.UsersList, element: <UsersList />},
		{path: AdminRoutes?.UserDetails, element: <UserDetails />},
		{path: AdminRoutes?.LocationList, element: <LocationsList />},
		{path: AdminRoutes?.QuestionList, element: <QuestionsList />},
		{path: AdminRoutes?.DateList, element: <DateList />},
		{path: AdminRoutes?.DateDetails, element: <DateDetails />},
		{path: AdminRoutes?.DateRatingsList, element: <DateRatingsList />},
		{path: AdminRoutes?.GiftList, element: <GiftList />},
		{path: AdminRoutes?.GiftDetails, element: <GiftDetails />},
		{path: AdminRoutes?.UserReportsList, element: <UserReportsList />},
		{path: AdminRoutes?.UserReportDetails, element: <UserReportDetails />},
		{path: AdminRoutes?.PaymentList, element: <PaymentList />},
		{path: AdminRoutes?.Profile, element: <Profile />},
		{path: AdminRoutes?.VerificationList, element: <VerificationList />},
		{path: AdminRoutes?.VerificationDetails, element: <VerificationDetails />},
		{path: AdminRoutes?.ComplianceList, element: <ComplianceList />},
		{path: AdminRoutes?.ComplianceDetails, element: <ComplianceDetails />},
		{path: AdminRoutes?.TasksList, element: <TasksList />},
		{path: AdminRoutes?.TaskDetails, element: <TaskDetails />},
		{path: AdminRoutes?.AuditLogsList, element: <AuditLogsList />},
		{path: AdminRoutes?.AuditLogDetails, element: <AuditLogDetails />},
		{path: AdminRoutes?.NotesList, element: <NotesList />},
		{path: AdminRoutes?.VenuesList, element: <VenuesList />},
	];

	const routes = useRoutes([
		{
			element: (
				<DashboardLayout>
					<ProtectedRoute>
						<Suspense fallback={<Loader />}>
							<AnimatePresence mode="wait">
								<RouteTransition key={location.pathname}>
									<Outlet />
								</RouteTransition>
							</AnimatePresence>
						</Suspense>
					</ProtectedRoute>
				</DashboardLayout>
			),
			children: [...Rotes],
		},

		...CommRoutes,
	]);

	return routes;
}
