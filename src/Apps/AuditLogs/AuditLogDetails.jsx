import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import { useTheme, alpha } from "@mui/material/styles";

import Iconify from "src/components/common/iconify";
import { GetAuditLogDetailsService } from "src/services/AuditLogs.Services";

export default function AuditLogDetails() {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");
	
	const [log, setLog] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (id) {
			setLoading(true);
			dispatch(
				GetAuditLogDetailsService(id, (res) => {
					setLoading(false);
					if (res?.success) {
						setLog(res?.data || {});
					}
				})
			);
		}
	}, [dispatch, id]);

	if (loading) {
		return (
			<Stack spacing={4}>
				<Skeleton variant="text" width="40%" height={60} />
				<Grid container spacing={3}>
					<Grid size={{xs: 12, md: 8}}>
						<Skeleton variant="rectangular" width="100%" height={300} sx={{borderRadius: 4}} />
					</Grid>
					<Grid size={{xs: 12, md: 4}}>
						<Skeleton variant="rectangular" width="100%" height={300} sx={{borderRadius: 4}} />
					</Grid>
				</Grid>
			</Stack>
		);
	}

	return (
		<Stack spacing={4}>
			{/* Page Header */}
			<Stack spacing={2} direction={{xs: 'column', md: 'row'}} sx={{justifyContent: "space-between", alignItems: {xs: 'flex-start', md: 'center'}}}>
				<Box>
					<Typography variant="h4" fontWeight="800" color="text.primary" gutterBottom>
						Audit Log: {id || log.id}
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						A permanent, tamper-proof record of this administrative action.
					</Typography>
				</Box>

				<Stack direction="row" spacing={1.5}>
					<Button color="inherit" variant="outlined" startIcon={<Iconify icon="eva:arrow-back-fill" />} sx={{borderRadius: 8}} onClick={() => navigate(-1)}>
						Back to Logs
					</Button>
				</Stack>
			</Stack>
			
			<Alert severity="info" sx={{borderRadius: 2, '& .MuiAlert-message': { width: '100%' }}}>
				<Typography variant="body2" sx={{fontWeight: 600}}>Security Notice: Audit logs are append-only and cannot be modified or deleted.</Typography>
			</Alert>

			<Grid container spacing={3}>
				{/* Left Column: Action & Changes */}
				<Grid size={{xs: 12, md: 12}}>
					<Stack spacing={3}>
						<Card sx={{p: 3, borderRadius: 4, boxShadow: '0 5px 25px rgba(0,0,0,0.05)', border: 'none'}}>
							<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 3}}>
								<Box>
									<Typography variant="h6" fontWeight="800" sx={{mb: 0.5}}>Action Details</Typography>
									<Typography variant="body2" color="text.secondary">Recorded on {log.created_at ? new Date(log.created_at).toLocaleString() : "Unknown"}</Typography>
								</Box>
								<Chip label={log.event || "Unknown"} color="success" size="small" variant="soft" sx={{fontWeight: 800, borderRadius: 1, textTransform: 'capitalize'}} />
							</Stack>
							
							<Grid container spacing={3} sx={{mb: 3}}>
								<Grid size={{xs: 12, sm: 4}}>
									<Typography variant="caption" color="text.secondary" fontWeight="700" sx={{textTransform: 'uppercase'}}>Event Description</Typography>
									<Typography variant="subtitle1" fontWeight="800" color="primary.main" sx={{textTransform: 'capitalize'}}>{log.description}</Typography>
								</Grid>
								<Grid size={{xs: 12, sm: 4}}>
									<Typography variant="caption" color="text.secondary" fontWeight="700" sx={{textTransform: 'uppercase'}}>Log Name</Typography>
									<Typography variant="subtitle1" fontWeight="700">{log.log_name}</Typography>
								</Grid>
								<Grid size={{xs: 12, sm: 4}}>
									<Typography variant="caption" color="text.secondary" fontWeight="700" sx={{textTransform: 'uppercase'}}>Target Model</Typography>
									<Typography variant="subtitle1" fontWeight="700" sx={{color: 'info.main', cursor: 'pointer', '&:hover': {textDecoration: 'underline'}}}>
										{log.subject_type?.split('\\').pop()} #{log.subject_id} {log.subject?.name ? `(${log.subject.name})` : ''}
									</Typography>
								</Grid>
							</Grid>

						</Card>

						<Card sx={{p: 3, borderRadius: 4, boxShadow: '0 5px 25px rgba(0,0,0,0.05)', border: 'none'}}>
							<Typography variant="h6" fontWeight="800" sx={{mb: 3}}>Data Changes</Typography>
							<Grid container spacing={2}>
								<Grid size={{xs: 12, md: 6}}>
									<Typography variant="subtitle2" fontWeight="700" color="text.secondary" sx={{mb: 1}}>Previous Value (Before)</Typography>
									<Box component="pre" sx={{
										p: 2, 
										bgcolor: alpha(theme.palette.error.main, 0.05), 
										border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
										borderRadius: 2,
										overflowX: 'auto',
										fontSize: '0.85rem',
										fontFamily: 'monospace',
										color: 'error.main',
										minHeight: 100
									}}>
										{log?.changes?.old ? JSON.stringify(log.changes.old, null, 2) : "N/A"}
									</Box>
								</Grid>
								<Grid size={{xs: 12, md: 6}}>
									<Typography variant="subtitle2" fontWeight="700" color="text.secondary" sx={{mb: 1}}>New Value (After)</Typography>
									<Box component="pre" sx={{
										p: 2, 
										bgcolor: alpha(theme.palette.success.main, 0.05), 
										border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
										borderRadius: 2,
										overflowX: 'auto',
										fontSize: '0.85rem',
										fontFamily: 'monospace',
										color: 'success.main',
										minHeight: 100
									}}>
										{log?.changes?.attributes ? JSON.stringify(log.changes.attributes, null, 2) : "N/A"}
									</Box>
								</Grid>
							</Grid>
						</Card>
					</Stack>
				</Grid>

				{/* Right Column: Actor & Metadata */}
				<Grid size={{xs: 12, md: 12}}>
					<Stack spacing={3}>
						<Card sx={{p: 3, borderRadius: 4, boxShadow: '0 5px 25px rgba(0,0,0,0.05)', border: 'none'}}>
							<Typography variant="subtitle1" fontWeight="800" sx={{mb: 2}}>Actor / Causer</Typography>
							{log.causer ? (
								<Stack direction="row" alignItems="center" spacing={2} sx={{mb: 3}}>
									<Avatar sx={{width: 48, height: 48, bgcolor: theme.palette.primary.main}}>{log.causer?.name?.charAt(0) || "U"}</Avatar>
									<Box>
										<Typography variant="subtitle1" fontWeight="800">{log.causer?.name || "System Actor"}</Typography>
										<Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>
											{log.causer?.email || `${log.causer_type?.split('\\').pop()} #${log.causer_id}`}
										</Typography>
									</Box>
								</Stack>
							) : (
								<Alert severity="warning" sx={{borderRadius: 1}}>
									System Action / Unknown Actor
								</Alert>
							)}
						</Card>
						
						<Card sx={{p: 3, borderRadius: 4, boxShadow: '0 5px 25px rgba(0,0,0,0.05)', border: 'none'}}>
							<Typography variant="subtitle1" fontWeight="800" sx={{mb: 2}}>Additional Metadata</Typography>
							<Stack spacing={2}>
								<Box>
									<Typography variant="caption" color="text.secondary" fontWeight="700">Raw Properties</Typography>
									<Box component="pre" sx={{
										mt: 1, p: 2,
										bgcolor: alpha(theme.palette.info.main, 0.05),
										border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
										borderRadius: 2,
										fontSize: '0.75rem',
										fontFamily: 'monospace',
										color: 'info.main',
										overflowX: 'auto'
									}}>
										{log?.properties ? JSON.stringify(log.properties, null, 2) : "[]"}
									</Box>
								</Box>
							</Stack>
						</Card>
					</Stack>
				</Grid>
			</Grid>
		</Stack>
	);
}
