import React, {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {useTheme, alpha} from "@mui/material/styles";

import Iconify from "src/components/common/iconify";
import NotesManager from "src/components/common/NotesManager";
import {sweetAlertQuestion, sweetAlertSuccess} from "src/utils/sweet-alerts";

// Mock Data
const MOCK_DETAIL = {
	user: {
		name: "Mahesh Chudasama",
		age: 26,
		gender: "Male",
		email: "mahesh@example.com",
		phone: "+91 9876543210",
		signupDate: "Jan 10, 2026",
		image: "",
	},
	verification: {
		docType: "Aadhaar Card",
		status: "Manual Review",
		submittedAt: "2026-07-06 13:45",
		attempts: 2,
		aiResult: "High Risk Detected (Face Mismatch)",
		riskScore: 88,
		duplicateMatch: "U-192 (80% similarity)",
		faceMatchResult: "34% Match",
		ageResult: "Match (26)",
	},
	documents: {
		frontImg: "https://images.unsplash.com/photo-1621252179027-94459d278660?q=80",
		backImg: "https://images.unsplash.com/photo-1621252179027-94459d278660?q=80",
		selfieImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80",
	},
};

export default function VerificationDetails() {
	const theme = useTheme();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");

	const [actionAnchorEl, setActionAnchorEl] = useState(null);
	const [rejectAnchorEl, setRejectAnchorEl] = useState(null);

	const {user, verification, documents} = MOCK_DETAIL;

	const handleAction = (actionName) => {
		setActionAnchorEl(null);
		sweetAlertQuestion(`Are you sure you want to ${actionName.toLowerCase()} this verification?`, `Confirm ${actionName}`).then((result) => {
			if (result) {
				sweetAlertSuccess(`Successfully executed: ${actionName}`);
				if (actionName === "Approve") navigate(-1);
			}
		});
	};

	const handleReject = (reason) => {
		setRejectAnchorEl(null);
		sweetAlertQuestion(`Reject verification due to: ${reason}?`, "Confirm Rejection").then((result) => {
			if (result) {
				sweetAlertSuccess("Verification Rejected");
				navigate(-1);
			}
		});
	};

	return (
		<Stack spacing={4}>
			{/* Page Header */}
			<Stack spacing={2} direction={{xs: "column", md: "row"}} sx={{justifyContent: "space-between", alignItems: {xs: "flex-start", md: "center"}}}>
				<Box>
					<Typography variant="h4" fontWeight="800" color="text.primary" gutterBottom>
						Verification Review: {id || "V-9022"}
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						Review the submitted identity documents and finalize the KYC decision.
					</Typography>
				</Box>

				<Stack direction="row" spacing={1.5}>
					<Button color="inherit" variant="outlined" startIcon={<Iconify icon="eva:arrow-back-fill" />} sx={{borderRadius: 8}} onClick={() => navigate(-1)}>
						Back
					</Button>
					<Button color="primary" variant="contained" startIcon={<Iconify icon="solar:settings-bold" />} sx={{borderRadius: 8}} onClick={(e) => setActionAnchorEl(e.currentTarget)}>
						Admin Actions
					</Button>
					<Menu
						anchorEl={actionAnchorEl}
						open={Boolean(actionAnchorEl)}
						onClose={() => setActionAnchorEl(null)}
						PaperProps={{sx: {width: 220, borderRadius: 2, mt: 1, boxShadow: "0px 5px 20px rgba(0,0,0,0.1)"}}}>
						<MenuItem onClick={() => handleAction("Approve")} sx={{color: "success.main"}}>
							<Iconify icon="solar:check-circle-bold" sx={{mr: 2}} /> Approve Verification
						</MenuItem>
						<MenuItem
							onClick={(e) => {
								setActionAnchorEl(null);
								setRejectAnchorEl(e.currentTarget);
							}}
							sx={{color: "error.main"}}>
							<Iconify icon="solar:close-circle-bold" sx={{mr: 2}} /> Reject Verification
						</MenuItem>
						<MenuItem onClick={() => handleAction("Request Retry")}>
							<Iconify icon="solar:refresh-circle-bold" sx={{mr: 2}} /> Request Retry
						</MenuItem>
						<Divider />
						<MenuItem onClick={() => handleAction("Mark as Duplicate")} sx={{color: "warning.main"}}>
							<Iconify icon="solar:users-group-two-rounded-bold" sx={{mr: 2}} /> Mark as Duplicate
						</MenuItem>
						<MenuItem onClick={() => handleAction("Escalate for Manual Review")}>
							<Iconify icon="solar:danger-triangle-bold" sx={{mr: 2}} /> Escalate
						</MenuItem>
						<MenuItem onClick={() => handleAction("Ban User")} sx={{color: "error.main"}}>
							<Iconify icon="solar:shield-cross-bold" sx={{mr: 2}} /> Ban User
						</MenuItem>
					</Menu>

					{/* Reject Reasons Submenu */}
					<Menu anchorEl={rejectAnchorEl} open={Boolean(rejectAnchorEl)} onClose={() => setRejectAnchorEl(null)} PaperProps={{sx: {width: 200, borderRadius: 2, mt: 1}}}>
						<MenuItem disabled>
							<Typography variant="caption" fontWeight="bold">
								REJECT REASON
							</Typography>
						</MenuItem>
						<MenuItem onClick={() => handleReject("Blurry Document")}>Blurry Document</MenuItem>
						<MenuItem onClick={() => handleReject("Invalid Document")}>Invalid Document</MenuItem>
						<MenuItem onClick={() => handleReject("Face Mismatch")}>Face Mismatch</MenuItem>
						<MenuItem onClick={() => handleReject("Fake Document")}>Fake Document</MenuItem>
						<MenuItem onClick={() => handleReject("Underage User")}>Underage User</MenuItem>
						<MenuItem onClick={() => handleReject("Other")}>Other...</MenuItem>
					</Menu>
				</Stack>
			</Stack>

			<Grid container spacing={3}>
				{/* Left Sidebar Info */}
				<Grid size={{xs: 12, md: 4}}>
					<Stack spacing={3}>
						<Card sx={{p: 3, borderRadius: 4, boxShadow: "0 5px 25px rgba(0,0,0,0.05)", border: "none"}}>
							<Typography variant="subtitle1" fontWeight="800" sx={{mb: 2}}>
								User Information
							</Typography>
							<Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
								<Avatar src={user.image} sx={{width: 64, height: 64}} />
								<Box>
									<Typography variant="h6" fontWeight="700">
										{user.name}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{user.age} yrs • {user.gender}
									</Typography>
								</Box>
							</Stack>
							<Divider sx={{my: 2}} />
							<Stack spacing={1.5}>
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">
										Email
									</Typography>
									<Typography variant="subtitle2" fontWeight="600">
										{user.email}
									</Typography>
								</Stack>
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">
										Phone
									</Typography>
									<Typography variant="subtitle2" fontWeight="600">
										{user.phone}
									</Typography>
								</Stack>
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="body2" color="text.secondary">
										Signup Date
									</Typography>
									<Typography variant="subtitle2" fontWeight="600">
										{user.signupDate}
									</Typography>
								</Stack>
							</Stack>
						</Card>

						<Card sx={{p: 3, borderRadius: 4, boxShadow: "0 5px 25px rgba(0,0,0,0.05)", border: "none"}}>
							<Typography variant="subtitle1" fontWeight="800" sx={{mb: 2}}>
								Verification Intelligence
							</Typography>
							<Stack spacing={2}>
								<Box sx={{p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.1), border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`}}>
									<Typography variant="caption" fontWeight="800" color="error.main" sx={{mb: 0.5, display: "block"}}>
										AI Risk Analysis
									</Typography>
									<Typography variant="body2" fontWeight="600">
										{verification.aiResult}
									</Typography>
								</Box>

								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Typography variant="body2" color="text.secondary">
										Risk Score
									</Typography>
									<Typography variant="subtitle1" fontWeight="800" color="error.main">
										{verification.riskScore}/100
									</Typography>
								</Stack>
								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Typography variant="body2" color="text.secondary">
										Face Match
									</Typography>
									<Chip label={verification.faceMatchResult} color="error" size="small" variant="outlined" sx={{fontWeight: 700}} />
								</Stack>
								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Typography variant="body2" color="text.secondary">
										Age Check
									</Typography>
									<Chip label={verification.ageResult} color="success" size="small" variant="outlined" sx={{fontWeight: 700}} />
								</Stack>
								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Typography variant="body2" color="text.secondary">
										Duplicate Match
									</Typography>
									<Typography variant="subtitle2" fontWeight="600" color="warning.main">
										{verification.duplicateMatch}
									</Typography>
								</Stack>
							</Stack>
						</Card>
					</Stack>
				</Grid>

				{/* Right Main Content */}
				<Grid size={{xs: 12, md: 8}}>
					<Stack spacing={3}>
						<Card sx={{p: 3, borderRadius: 4, boxShadow: "0 5px 25px rgba(0,0,0,0.05)", border: "none"}}>
							<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 3}}>
								<Typography variant="h6" fontWeight="800">
									Verification Submission
								</Typography>
								<Chip label={verification.status} color="info" sx={{fontWeight: 800, borderRadius: 1}} />
							</Stack>
							<Grid container spacing={3}>
								<Grid item xs={12} sm={4}>
									<Typography variant="body2" color="text.secondary">
										Document Type
									</Typography>
									<Typography variant="subtitle1" fontWeight="700">
										{verification.docType}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={4}>
									<Typography variant="body2" color="text.secondary">
										Submitted At
									</Typography>
									<Typography variant="subtitle1" fontWeight="700">
										{verification.submittedAt}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={4}>
									<Typography variant="body2" color="text.secondary">
										Attempts
									</Typography>
									<Typography variant="subtitle1" fontWeight="700">
										{verification.attempts}
									</Typography>
								</Grid>
							</Grid>
						</Card>

						<Card sx={{p: 3, borderRadius: 4, boxShadow: "0 5px 25px rgba(0,0,0,0.05)", border: "none"}}>
							<Typography variant="h6" fontWeight="800" sx={{mb: 3}}>
								Document Review
							</Typography>
							<Grid container spacing={3}>
								<Grid item xs={12} sm={6}>
									<Typography variant="subtitle2" fontWeight="700" sx={{mb: 1}}>
										Government ID (Front)
									</Typography>
									<Box component="img" src={documents.frontImg} sx={{width: "100%", borderRadius: 2, height: 200, objectFit: "cover", border: "1px solid", borderColor: "divider"}} />
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="subtitle2" fontWeight="700" sx={{mb: 1}}>
										Selfie / Face Match
									</Typography>
									<Box component="img" src={documents.selfieImg} sx={{width: "100%", borderRadius: 2, height: 200, objectFit: "cover", border: "1px solid", borderColor: "divider"}} />
								</Grid>
							</Grid>
							<Box sx={{mt: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2}}>
								<Typography variant="subtitle2" fontWeight="700" color="primary.main" sx={{mb: 1}}>
									Document Validation Results
								</Typography>
								<Typography variant="body2">
									• Text extraction successful.
									<br />• Edges detected. No tampering evident.
									<br />• Face match failed (34% threshold). Manual review required.
								</Typography>
							</Box>
						</Card>

						<NotesManager 
							targetId={id || "V-9022"} 
							targetType="Verification Request" 
							mockNotes={[
								{ id: "NOTE-1", adminName: "System", content: "Requested manual verification review due to face mismatch.", date: "Jul 6, 2026, 01:45 PM", isOwn: false }
							]} 
						/>

						{/* Quick Actions at bottom */}
						<Stack direction="row" spacing={2} justifyContent="flex-end" sx={{pt: 2}}>
							<Button variant="outlined" color="error" sx={{borderRadius: 8, px: 4}} onClick={(e) => setRejectAnchorEl(e.currentTarget)}>
								Reject
							</Button>
							<Button variant="contained" color="success" sx={{borderRadius: 8, px: 4}} onClick={() => handleAction("Approve")}>
								Approve
							</Button>
						</Stack>
					</Stack>
				</Grid>
			</Grid>
		</Stack>
	);
}
