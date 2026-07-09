import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { useTheme, alpha } from "@mui/material/styles";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from "@mui/lab";

import Iconify from "src/components/common/iconify";
import NotesManager from "src/components/common/NotesManager";
import { sweetAlertQuestion, sweetAlertSuccess } from "src/utils/sweet-alerts";

// Mock Data
const MOCK_TASK = {
	id: "TSK-002",
	title: "Resolve Critical Safety Report",
	description: "Review and resolve the safety report submitted regarding user U-192 for inappropriate behavior at a registered venue. Needs immediate action.",
	priority: "Critical",
	assignedTo: "Sarah Johnson",
	dueDate: "July 7, 2026, 05:00 PM",
	status: "In Progress",
	relatedModule: "Safety Center",
	relatedRecord: "REP-492",
	createdBy: "Mark Steave",
	createdDate: "July 7, 2026, 09:00 AM",
	internalNotes: "Awaiting response from venue owner."
};

const ACTIVITY_HISTORY = [
	{ id: 1, title: "Task Created", date: "Jul 7, 09:00 AM", user: "Mark Steave", icon: "solar:pen-new-square-bold", color: "info.main" },
	{ id: 2, title: "Assigned to Sarah Johnson", date: "Jul 7, 09:15 AM", user: "Mark Steave", icon: "solar:user-bold", color: "primary.main" },
	{ id: 3, title: "Status changed to In Progress", date: "Jul 7, 10:30 AM", user: "Sarah Johnson", icon: "solar:refresh-circle-bold", color: "warning.main" },
	{ id: 4, title: "Added Internal Note", date: "Jul 7, 11:00 AM", user: "Sarah Johnson", icon: "solar:document-add-bold", color: "text.secondary" },
];

export default function TaskDetails() {
	const theme = useTheme();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");

	const [actionAnchorEl, setActionAnchorEl] = useState(null);
	const [statusAnchorEl, setStatusAnchorEl] = useState(null);
	
	const task = MOCK_TASK;

	const handleAction = (actionName) => {
		setActionAnchorEl(null);
		setStatusAnchorEl(null);
		
		sweetAlertQuestion(`Are you sure you want to ${actionName.toLowerCase()}?`, `Confirm ${actionName}`).then((result) => {
			if (result) {
				sweetAlertSuccess(`Successfully executed: ${actionName}`);
			}
		});
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'Critical': return theme.palette.error.main;
			case 'High': return theme.palette.warning.main;
			case 'Medium': return theme.palette.info.main;
			case 'Low': return theme.palette.text.secondary;
			default: return theme.palette.text.primary;
		}
	};

	return (
		<Stack spacing={4}>
			{/* Page Header */}
			<Stack spacing={2} direction={{xs: 'column', md: 'row'}} sx={{justifyContent: "space-between", alignItems: {xs: 'flex-start', md: 'center'}}}>
				<Box>
					<Typography variant="h4" fontWeight="800" color="text.primary" gutterBottom>
						Task Details: {id || task.id}
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						View and manage task progress, assignment, and related records.
					</Typography>
				</Box>

				<Stack direction="row" spacing={1.5}>
					<Button color="inherit" variant="outlined" startIcon={<Iconify icon="eva:arrow-back-fill" />} sx={{borderRadius: 8}} onClick={() => navigate(-1)}>
						Back
					</Button>
					<Button 
						color="success" 
						variant="contained" 
						startIcon={<Iconify icon="solar:check-circle-bold" />} 
						sx={{borderRadius: 8}}
						onClick={() => handleAction("Mark as Completed")}
					>
						Complete Task
					</Button>
					<Button 
						color="primary" 
						variant="contained" 
						startIcon={<Iconify icon="solar:settings-bold" />} 
						sx={{borderRadius: 8}}
						onClick={(e) => setActionAnchorEl(e.currentTarget)}
					>
						Actions
					</Button>
					<Menu
						anchorEl={actionAnchorEl}
						open={Boolean(actionAnchorEl)}
						onClose={() => setActionAnchorEl(null)}
						PaperProps={{ sx: { width: 220, borderRadius: 2, mt: 1, boxShadow: '0px 5px 20px rgba(0,0,0,0.1)' } }}
					>
						<MenuItem onClick={(e) => { setActionAnchorEl(null); setStatusAnchorEl(e.currentTarget); }}><Iconify icon="solar:transfer-horizontal-bold" sx={{mr: 2}}/> Update Status</MenuItem>
						<MenuItem onClick={() => handleAction("Assign Task")}><Iconify icon="solar:user-id-bold" sx={{mr: 2}}/> Re-assign Task</MenuItem>
						<MenuItem onClick={() => handleAction("Edit Details")}><Iconify icon="solar:pen-bold" sx={{mr: 2}}/> Edit Details</MenuItem>
						<MenuItem onClick={() => handleAction("Add Internal Note")}><Iconify icon="solar:document-add-bold" sx={{mr: 2}}/> Add Note</MenuItem>
						<MenuItem onClick={() => handleAction("Change Priority")}><Iconify icon="solar:danger-circle-bold" sx={{mr: 2}}/> Change Priority</MenuItem>
						<Divider />
						<MenuItem onClick={() => handleAction("Cancel Task")} sx={{color: 'error.main'}}><Iconify icon="solar:trash-bin-trash-bold" sx={{mr: 2}}/> Cancel Task</MenuItem>
					</Menu>
					
					<Menu
						anchorEl={statusAnchorEl}
						open={Boolean(statusAnchorEl)}
						onClose={() => setStatusAnchorEl(null)}
						PaperProps={{ sx: { width: 180, borderRadius: 2, mt: 1 } }}
					>
						<MenuItem disabled><Typography variant="caption" fontWeight="bold">SET STATUS</Typography></MenuItem>
						<MenuItem onClick={() => handleAction("Status to Open")}>Open</MenuItem>
						<MenuItem onClick={() => handleAction("Status to In Progress")}>In Progress</MenuItem>
						<MenuItem onClick={() => handleAction("Status to Completed")}>Completed</MenuItem>
					</Menu>
				</Stack>
			</Stack>

			<Grid container spacing={3}>
				{/* Left Main Content */}
				<Grid item xs={12} md={8}>
					<Stack spacing={3}>
						<Card sx={{p: 3, borderRadius: 4, boxShadow: '0 5px 25px rgba(0,0,0,0.05)', border: 'none'}}>
							<Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{mb: 3}}>
								<Box>
									<Typography variant="h5" fontWeight="800" sx={{mb: 1}}>{task.title}</Typography>
									<Stack direction="row" spacing={2} alignItems="center">
										<Chip label={task.status} color={task.status === 'In Progress' ? 'warning' : 'default'} size="small" sx={{fontWeight: 800, borderRadius: 1}} />
										<Stack direction="row" alignItems="center" spacing={0.5}>
											<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getPriorityColor(task.priority) }} />
											<Typography variant="subtitle2" sx={{color: getPriorityColor(task.priority), fontWeight: 700}}>{task.priority} Priority</Typography>
										</Stack>
									</Stack>
								</Box>
							</Stack>
							
							<Typography variant="body1" sx={{color: "text.secondary", mb: 4, lineHeight: 1.6}}>
								{task.description}
							</Typography>
							
							<Divider sx={{mb: 3}} />
							
							<Grid container spacing={3}>
								<Grid item xs={12} sm={6}>
									<Typography variant="caption" color="text.secondary" fontWeight="700" sx={{textTransform: 'uppercase', letterSpacing: 0.5}}>Assigned To</Typography>
									<Stack direction="row" alignItems="center" spacing={1.5} sx={{mt: 1}}>
										<Avatar sx={{width: 32, height: 32, bgcolor: theme.palette.primary.main}}>{task.assignedTo.charAt(0)}</Avatar>
										<Typography variant="subtitle1" fontWeight="700">{task.assignedTo}</Typography>
									</Stack>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="caption" color="text.secondary" fontWeight="700" sx={{textTransform: 'uppercase', letterSpacing: 0.5}}>Due Date & Time</Typography>
									<Typography variant="subtitle1" fontWeight="700" sx={{mt: 1, color: 'error.main'}}>{task.dueDate}</Typography>
								</Grid>
							</Grid>
						</Card>

						<NotesManager 
							targetId={task.id} 
							targetType="Task" 
							mockNotes={[
								{ id: "NOTE-1", adminName: "Mark Steave", content: "Awaiting response from venue owner.", date: "Jul 7, 2026, 09:30 AM", isOwn: false }
							]} 
						/>
					</Stack>
				</Grid>

				{/* Right Sidebar Info */}
				<Grid item xs={12} md={4}>
					<Stack spacing={3}>
						<Card sx={{p: 3, borderRadius: 4, boxShadow: '0 5px 25px rgba(0,0,0,0.05)', border: 'none', bgcolor: alpha(theme.palette.primary.main, 0.02)}}>
							<Typography variant="subtitle1" fontWeight="800" sx={{mb: 2}}>Related Record</Typography>
							<Stack spacing={2}>
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">Module</Typography>
									<Typography variant="subtitle2" fontWeight="700">{task.relatedModule}</Typography>
								</Stack>
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">Record ID</Typography>
									<Typography variant="subtitle2" fontWeight="700" color="primary.main" sx={{cursor: 'pointer', '&:hover': {textDecoration: 'underline'}}}>
										{task.relatedRecord}
									</Typography>
								</Stack>
								<Button variant="outlined" color="primary" fullWidth sx={{mt: 1, borderRadius: 8}} endIcon={<Iconify icon="solar:arrow-right-up-bold" />} onClick={() => handleAction("View Related Record")}>
									View Record
								</Button>
							</Stack>
						</Card>

						<Card sx={{p: 3, borderRadius: 4, boxShadow: '0 5px 25px rgba(0,0,0,0.05)', border: 'none'}}>
							<Typography variant="subtitle1" fontWeight="800" sx={{mb: 3}}>Activity History</Typography>
							
							<Timeline sx={{ p: 0, m: 0, '& .MuiTimelineItem-root:before': { flex: 0, padding: 0 } }}>
								{ACTIVITY_HISTORY.map((item, index) => (
									<TimelineItem key={item.id} sx={{ minHeight: 60 }}>
										<TimelineSeparator>
											<TimelineDot sx={{ bgcolor: 'transparent', boxShadow: 'none', m: 0 }}>
												<Box sx={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(theme.palette.grey[500], 0.1), color: item.color }}>
													<Iconify icon={item.icon} width={14} />
												</Box>
											</TimelineDot>
											{index < ACTIVITY_HISTORY.length - 1 && <TimelineConnector sx={{ bgcolor: 'divider' }} />}
										</TimelineSeparator>
										<TimelineContent sx={{ py: 0.5, px: 2 }}>
											<Typography variant="subtitle2" fontWeight="700">{item.title}</Typography>
											<Typography variant="caption" color="text.secondary" display="block">
												{item.date} • by {item.user}
											</Typography>
										</TimelineContent>
									</TimelineItem>
								))}
							</Timeline>
						</Card>
					</Stack>
				</Grid>
			</Grid>
		</Stack>
	);
}
