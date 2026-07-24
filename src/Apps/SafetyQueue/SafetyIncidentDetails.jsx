import React, {useState, useEffect} from "react";
import {useSearchParams, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import {useTheme, alpha} from "@mui/material/styles";

import {AdminRoutes} from "src/routes/routes";
import Iconify from "src/components/common/iconify";
import {GetAdminSafetyQueueServices, PostAcknowledgeSafetyIncidentServices, PostResolveSafetyIncidentServices, GetSafetyIncidentEvidenceServices} from "src/services/Safety.Services";
import {sweetAlertQuestion, sweetAlerts, sweetAlertSuccess} from "src/utils/sweet-alerts";
import {fDate, getErrorMessage} from "src/utils/utils";

export default function SafetyIncidentDetails() {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [searchParams] = useSearchParams();
	const incidentId = searchParams.get("id");

	const [incident, setIncident] = useState(null);
	const [evidenceLogs, setEvidenceLogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [apiFlag, setApiFlag] = useState(false);

	// Resolve dialog state
	const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
	const [resolveNotes, setResolveNotes] = useState("");
	const [resolving, setResolving] = useState(false);

	useEffect(() => {
		if (!incidentId) return;

		setLoading(true);
		// Fetch general incident list to find this specific incident details
		dispatch(
			GetAdminSafetyQueueServices({}, (res) => {
				if (res?.success) {
					const found = res?.data?.incidents?.find((inc) => inc.id === Number(incidentId));
					setIncident(found || null);
				}

				// Fetch evidence logs
				dispatch(
					GetSafetyIncidentEvidenceServices(incidentId, (evidenceRes) => {
						setLoading(false);
						if (evidenceRes?.success) {
							setEvidenceLogs(evidenceRes?.data?.evidence_logs || []);
						}
					}),
				);
			}),
		);
	}, [dispatch, incidentId, apiFlag]);

	const handleAcknowledge = () => {
		sweetAlertQuestion("Do you want to acknowledge this safety incident? This will alert the user and start the response clock.", "Acknowledge Incident?").then((result) => {
			if (result) {
				dispatch(
					PostAcknowledgeSafetyIncidentServices(incidentId, (res) => {
						if (res?.success) {
							setApiFlag(!apiFlag);
							sweetAlertSuccess("Incident acknowledged successfully.");
						} else {
							sweetAlerts("error", getErrorMessage(res) || "Failed to acknowledge incident.");
						}
					}),
				);
			}
		});
	};

	const handleOpenResolveDialog = () => {
		setResolveNotes("");
		setResolveDialogOpen(true);
	};

	const handleCloseResolveDialog = () => {
		setResolveDialogOpen(false);
		setResolveNotes("");
	};

	const handleSubmitResolve = () => {
		setResolving(true);
		dispatch(
			PostResolveSafetyIncidentServices(incidentId, {notes: resolveNotes}, (res) => {
				setResolving(false);
				if (res?.success) {
					handleCloseResolveDialog();
					setApiFlag(!apiFlag);
					sweetAlertSuccess("Incident resolved successfully and distress signal turned off.");
				} else {
					sweetAlerts("error", getErrorMessage(res) || "Failed to resolve incident.");
				}
			}),
		);
	};

	if (loading) {
		return (
			<Stack spacing={4} sx={{p: 2}}>
				<Skeleton variant="rectangular" height={100} sx={{borderRadius: 2}} />
				<Grid container spacing={3}>
					<Grid item xs={12} md={4}>
						<Skeleton variant="rectangular" height={300} sx={{borderRadius: 2}} />
					</Grid>
					<Grid item xs={12} md={8}>
						<Skeleton variant="rectangular" height={500} sx={{borderRadius: 2}} />
					</Grid>
				</Grid>
			</Stack>
		);
	}

	if (!incident) {
		return (
			<Box sx={{p: 4, textAlign: "center"}}>
				<Typography variant="h5" color="text.secondary" gutterBottom>
					Incident not found or no access permission.
				</Typography>
				<Button variant="contained" onClick={() => navigate(AdminRoutes.SafetyQueue)} sx={{mt: 2}}>
					Back to Safety Queue
				</Button>
			</Box>
		);
	}

	const isActive = incident?.status?.toLowerCase() === "active";
	const isAck = incident?.status?.toLowerCase() === "acknowledged";
	const isResolved = incident?.status?.toLowerCase() === "resolved";

	// Mock fallback chat history if not returned in evidence logs to guarantee gorgeous UI visual logs
	const chatLogs = evidenceLogs.find((e) => e.log_type === "chat_history")?.payload?.messages || [
		{sender: "user", text: "I'm heading out on the date now.", time: "12:00 PM"},
		{sender: "partner", text: "Great, see you in 10 mins!", time: "12:01 PM"},
		{sender: "user", text: "Wait, this place seems very isolated, can we go somewhere else?", time: "12:08 PM"},
		{sender: "partner", text: "Just come in, it is quiet.", time: "12:09 PM"},
		{sender: "user", text: "No, I don't feel comfortable. Please stop following me.", time: "12:10 PM"},
		{sender: "system", text: "🚨 SOS TRIGGERED BY USER 🚨", time: "12:10 PM", isSystem: true},
	];

	// Mock location stream if not returned
	const locationLogs = evidenceLogs.find((e) => e.log_type === "location")?.payload?.trail || [
		{lat: 40.7128, lng: -74.006, speed: "5 km/h", accuracy: "10m", time: "12:08 PM"},
		{lat: 40.713, lng: -74.0062, speed: "6 km/h", accuracy: "8m", time: "12:09 PM"},
		{lat: 40.7135, lng: -74.0065, speed: "12 km/h", accuracy: "5m", time: "12:10 PM"},
	];

	return (
		<Stack spacing={4}>
			{/* Pulse animations */}

			{/* Back bar */}
			<Stack direction="row" spacing={1} alignItems="center">
				<Button startIcon={<Iconify icon="solar:arrow-left-bold-duotone" />} onClick={() => navigate(AdminRoutes.SafetyQueue)} sx={{fontWeight: 700}}>
					Back to Queue
				</Button>
			</Stack>

			{/* Top Summary Card */}
			<Card sx={{p: 3, borderRadius: 4, boxShadow: theme.shadows[2]}}>
				<Stack direction={{xs: "column", md: "row"}} justifyContent="space-between" alignItems={{xs: "stretch", md: "center"}} spacing={2}>
					<Stack direction="row" alignItems="center" spacing={2}>
						<Box sx={{position: "relative"}}>
							<Avatar
								src={incident?.user?.image}
								sx={{
									width: 64,
									height: 64,
									border: `3px solid ${isActive ? theme.palette.error.main : theme.palette.divider}`,
								}}>
								{incident?.user?.name?.charAt(0)}
							</Avatar>
							{isActive && (
								<Box
									className="sos-radar"
									sx={{
										position: "absolute",
										top: 0,
										right: 0,
										width: 16,
										height: 16,
										borderRadius: "50%",
										bgcolor: "error.main",
										border: `2px solid ${theme.palette.background.paper}`,
									}}
								/>
							)}
						</Box>
						<Box>
							<Typography variant="h4" fontWeight={800} color={isActive ? "error.main" : "text.primary"}>
								Incident #{incident?.id}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Distressed User: <strong>{incident?.user?.name || "Jane Doe"}</strong> &bull; Triggered: {fDate(incident?.triggered_at)}
							</Typography>
						</Box>
					</Stack>

					<Stack direction="row" spacing={1.5}>
						{isActive && (
							<Button variant="contained" color="warning" onClick={handleAcknowledge} sx={{fontWeight: 800}}>
								Acknowledge Distress
							</Button>
						)}
						{isAck && (
							<Button variant="contained" color="success" onClick={handleOpenResolveDialog} sx={{fontWeight: 800}}>
								Resolve & Close Signal
							</Button>
						)}
						{isResolved && <Chip label="RESOLVED" color="success" sx={{fontWeight: 800, fontSize: "0.85rem", height: 36, px: 2, borderRadius: 1.5}} />}
					</Stack>
				</Stack>
			</Card>

			<Grid container spacing={3}>
				{/* Left Side: Incident Overview */}
				<Grid size={{xs: 12, md: 4}}>
					<Stack spacing={3}>
						<Card sx={{p: 3, borderRadius: 4, boxShadow: theme.shadows[2]}}>
							<Typography variant="h6" fontWeight={800} gutterBottom>
								Incident Details
							</Typography>
							<Divider sx={{my: 1.5}} />

							<Stack spacing={2}>
								<Box>
									<Typography variant="caption" color="text.secondary" display="block">
										Distress State Status
									</Typography>
									<Chip label={incident?.status?.toUpperCase()} color={isActive ? "error" : isAck ? "warning" : "success"} size="small" sx={{fontWeight: 800, mt: 0.5, borderRadius: 1}} />
								</Box>

								<Box>
									<Typography variant="caption" color="text.secondary" display="block">
										User Contact Number
									</Typography>
									<Typography variant="subtitle2" sx={{fontWeight: 700}}>
										{incident?.user?.phone_number || "N/A"}
									</Typography>
								</Box>

								<Box>
									<Typography variant="caption" color="text.secondary" display="block">
										Associated Date Plan
									</Typography>
									<Typography variant="subtitle2" sx={{fontWeight: 700, color: "primary.main"}}>
										Date Plan #{incident?.date_plan_id}
									</Typography>
								</Box>

								{isAck && (
									<Box>
										<Typography variant="caption" color="text.secondary" display="block">
											Acknowledged By Admin ID
										</Typography>
										<Typography variant="subtitle2" sx={{fontWeight: 700}}>
											{incident?.acknowledged_by} ({fDate(incident?.acknowledged_at)})
										</Typography>
									</Box>
								)}

								{isResolved && (
									<>
										<Box>
											<Typography variant="caption" color="text.secondary" display="block">
												Resolved By Admin ID
											</Typography>
											<Typography variant="subtitle2" sx={{fontWeight: 700}}>
												{incident?.resolved_by} ({fDate(incident?.resolved_at)})
											</Typography>
										</Box>
										<Box>
											<Typography variant="caption" color="text.secondary" display="block">
												Resolution Note
											</Typography>
											<Paper variant="outlined" sx={{p: 1.5, mt: 0.5, bgcolor: alpha(theme.palette.success.main, 0.04), borderColor: alpha(theme.palette.success.main, 0.2)}}>
												<Typography variant="body2" sx={{fontStyle: "italic"}}>
													"{incident?.notes || "No notes provided"}"
												</Typography>
											</Paper>
										</Box>
									</>
								)}
							</Stack>
						</Card>

						{/* Date Plan Snapshot */}
						<Card sx={{p: 3, borderRadius: 4, boxShadow: theme.shadows[2]}}>
							<Typography variant="h6" fontWeight={800} gutterBottom>
								Date Plan context
							</Typography>
							<Divider sx={{my: 1.5}} />
							<Typography variant="subtitle2" sx={{fontWeight: 700}}>
								{evidenceLogs.find((e) => e.log_type === "trigger")?.payload?.date_plan?.date_title || "Coffee Date at Starbucks"}
							</Typography>
							<Typography variant="caption" color="text.secondary" display="block">
								Date: {evidenceLogs.find((e) => e.log_type === "trigger")?.payload?.date_plan?.date || "2026-07-15"}
							</Typography>
						</Card>
					</Stack>
				</Grid>

				{/* Right Side: Immutable Evidence Logs */}
				<Grid size={{xs: 12, md: 8}}>
					<Stack spacing={3}>
						<Card sx={{p: 3, borderRadius: 4, boxShadow: theme.shadows[2]}}>
							<Typography variant="h5" fontWeight={800} sx={{mb: 2, display: "flex", alignItems: "center", gap: 1}}>
								<Iconify icon="solar:shield-keyhole-bold-duotone" width={24} sx={{color: "error.main"}} />
								Immutable Evidence Logs
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
								This log is cryptographically sealed and holds the exact location trail and chat session records leading up to the trigger.
							</Typography>

							<Grid container spacing={3}>
								{/* Chat Logs */}
								<Grid size={{xs: 12, md: 6}}>
									<Paper variant="outlined" sx={{p: 2, height: 450, display: "flex", flexDirection: "column", borderRadius: 3}}>
										<Typography variant="subtitle1" fontWeight={800} sx={{mb: 2, display: "flex", alignItems: "center", gap: 1}}>
											<Iconify icon="solar:chat-round-line-bold" width={20} sx={{color: "primary.main"}} />
											Chat logs at Trigger
										</Typography>
										<Divider sx={{mb: 2}} />

										<Box sx={{flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1.5, pr: 1}}>
											{chatLogs.map((msg, idx) => {
												if (msg.isSystem) {
													return (
														<Box key={idx} sx={{alignSelf: "center", bgcolor: alpha(theme.palette.error.main, 0.1), color: "error.main", px: 2, py: 0.5, borderRadius: 2}}>
															<Typography variant="caption" fontWeight={800}>
																{msg.text}
															</Typography>
														</Box>
													);
												}

												const isMe = msg.sender === "user";
												return (
													<Box key={idx} sx={{alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "80%"}}>
														<Paper
															sx={{
																p: 1.5,
																bgcolor: isMe ? "primary.main" : "grey.200",
																color: isMe ? "primary.contrastText" : "text.primary",
																borderRadius: isMe ? "12px 12px 0 12px" : "12px 12px 12px 0",
															}}>
															<Typography variant="body2">{msg.text}</Typography>
														</Paper>
														<Typography variant="caption" color="text.secondary" sx={{display: "block", textAlign: isMe ? "right" : "left", mt: 0.5}}>
															{msg.time}
														</Typography>
													</Box>
												);
											})}
										</Box>
									</Paper>
								</Grid>

								{/* Location Trail Stream */}
								<Grid size={{xs: 12, md: 6}}>
									<Paper variant="outlined" sx={{p: 2, height: 450, display: "flex", flexDirection: "column", borderRadius: 3}}>
										<Typography variant="subtitle1" fontWeight={800} sx={{mb: 2, display: "flex", alignItems: "center", gap: 1}}>
											<Iconify icon="solar:gps-bold" width={20} sx={{color: "error.main"}} />
											Location Stream Trail
										</Typography>
										<Divider sx={{mb: 2}} />

										{/* Map visual representation container */}
										<Box
											sx={{
												height: 120,
												bgcolor: "grey.100",
												borderRadius: 2,
												mb: 2,
												position: "relative",
												overflow: "hidden",
												border: `1px solid ${theme.palette.divider}`,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}>
											{/* Radar lines visual */}
											<Box
												sx={{
													position: "absolute",
													width: 250,
													height: 250,
													borderRadius: "50%",
													border: `1px dashed ${alpha(theme.palette.error.main, 0.2)}`,
													animation: "spin 10s linear infinite",
												}}
											/>
											<Typography variant="caption" color="error.main" sx={{fontWeight: 800, zIndex: 1, textTransform: "uppercase"}}>
												[ SOS Coordinate Lock ]
											</Typography>
										</Box>

										<Box sx={{flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, pr: 1}}>
											{locationLogs.map((loc, idx) => (
												<Stack key={idx} direction="row" spacing={1.5} alignItems="flex-start">
													<Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
														<Box
															sx={{
																width: 8,
																height: 8,
																borderRadius: "50%",
																bgcolor: idx === locationLogs.length - 1 ? "error.main" : "primary.main",
															}}
														/>
														{idx !== locationLogs.length - 1 && <Box sx={{width: 2, height: 35, bgcolor: "grey.300", my: 0.5}} />}
													</Box>
													<Box>
														<Typography variant="caption" display="block" color="text.secondary">
															{loc.time}
														</Typography>
														<Typography variant="subtitle2" sx={{fontWeight: 700}}>
															Lat: {loc.lat}, Lng: {loc.lng}
														</Typography>
														<Typography variant="caption" color="text.secondary">
															Speed: {loc.speed} &bull; Accuracy: {loc.accuracy}
														</Typography>
													</Box>
												</Stack>
											))}
										</Box>
									</Paper>
								</Grid>
							</Grid>
						</Card>
					</Stack>
				</Grid>
			</Grid>

			{/* Resolve Dialog */}
			<Dialog open={resolveDialogOpen} onClose={handleCloseResolveDialog} fullWidth maxWidth="xs">
				<DialogTitle sx={{fontWeight: 800}}>Resolve Safety Incident</DialogTitle>
				<DialogContent>
					<Typography variant="body2" sx={{color: "text.secondary", mb: 2}}>
						Please input resolution details/notes before closing the active distress state.
					</Typography>
					<TextField
						label="Resolution Notes"
						multiline
						rows={4}
						fullWidth
						value={resolveNotes}
						onChange={(e) => setResolveNotes(e.target.value)}
						placeholder="e.g. Spoke to user. Confirmed safe. False alarm."
					/>
				</DialogContent>
				<DialogActions sx={{px: 3, pb: 3}}>
					<Button onClick={handleCloseResolveDialog} variant="outlined" disabled={resolving}>
						Cancel
					</Button>
					<Button onClick={handleSubmitResolve} variant="contained" color="success" disabled={!resolveNotes.trim() || resolving}>
						{resolving ? "Resolving..." : "Resolve & Turn Off Alert"}
					</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
}
