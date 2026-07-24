import React, {useState} from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {useTheme, alpha} from "@mui/material/styles";
import Iconify from "src/components/common/iconify";
import {GetAdminUserDetailsServices} from "src/services/Users.Services";
import {useHasPermission} from "src/hooks/use-permission";
import {useDispatch} from "react-redux";
import UserKycModel from "./UserKycModel";

const KycTab = ({user, setUser}) => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const {hasPermission} = useHasPermission();

	const statusColor = user?.document_verification_status === 1 ? "success" : user?.document_verification_status === 2 ? "warning" : user?.document_verification_status === 0 ? "error" : "default";

	const [openKycModel, setOpenKycModel] = useState(false);

	const handleKycSuccess = () => {
		if (setUser) {
			dispatch(
				GetAdminUserDetailsServices(user?.id, (resData) => {
					if (resData?.success) {
						setUser(resData?.data?.user || {});
					}
				}),
			);
		}
	};

	return (
		<Stack spacing={3}>
			<Card sx={{p: 4, borderRadius: 4, boxShadow: theme.shadows[1], position: "relative", overflow: "hidden"}}>
				<Iconify
					icon="solar:shield-check-bold-duotone"
					sx={{
						position: "absolute",
						top: -20,
						right: -20,
						width: 140,
						height: 140,
						opacity: 0.03,
						transform: "rotate(-15deg)",
						pointerEvents: "none",
						color: "success.main",
					}}
				/>

				<Stack direction="row" spacing={2} alignItems="center" mb={4} sx={{position: "relative", zIndex: 1}}>
					<Box sx={{p: 1.5, borderRadius: 2.5, bgcolor: alpha(theme.palette.success.main, 0.1), color: "success.main", display: "flex", alignItems: "center", justifyContent: "center"}}>
						<Iconify icon="solar:shield-check-bold-duotone" width={28} />
					</Box>
					<Box sx={{flexGrow: 1}}>
						<Typography variant="h5" sx={{fontWeight: 800}}>
							KYC Details
						</Typography>
					</Box>
					<Chip label={user?.document_verification_status_text || "Unverified"} color={statusColor} sx={{fontWeight: 700}} />
					{hasPermission("manage_verification") && (
						<Button variant="contained" color="primary" size="small" startIcon={<Iconify icon="solar:pen-bold" />} onClick={() => setOpenKycModel(true)} sx={{ml: 2, borderRadius: 2}}>
							Update Status
						</Button>
					)}
				</Stack>

				<Grid container spacing={4} sx={{position: "relative", zIndex: 1}}>
					<Grid size={{xs: 12}}>
						<Grid container spacing={3}>
							<Grid size={{xs: 12, sm: 6, md: 3}}>
								<Box sx={{p: 3, bgcolor: alpha(theme.palette.text.primary, 0.03), borderRadius: 3, height: "100%"}}>
									<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 400, textTransform: "uppercase", display: "block", mb: 1}}>
										Document Type
									</Typography>
									<Typography variant="body2" sx={{fontWeight: 700}}>
										{user?.kyc_document_type || "Not provided"}
									</Typography>
								</Box>
							</Grid>
							<Grid size={{xs: 12, sm: 6, md: 3}}>
								<Box sx={{p: 3, bgcolor: alpha(theme.palette.text.primary, 0.03), borderRadius: 3, height: "100%"}}>
									<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 400, textTransform: "uppercase", display: "block", mb: 1}}>
										Document Number
									</Typography>
									<Typography variant="body2" sx={{fontWeight: 700}}>
										{user?.kyc_document_number || "Not provided"}
									</Typography>
								</Box>
							</Grid>
							<Grid size={{xs: 12, sm: 6, md: 3}}>
								<Box sx={{p: 3, bgcolor: alpha(theme.palette.text.primary, 0.03), borderRadius: 3, height: "100%"}}>
									<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 400, textTransform: "uppercase", display: "block", mb: 1}}>
										Face Match Score
									</Typography>
									<Typography variant="body2" sx={{fontWeight: 700}}>
										{user?.kyc_face_match_score ? `${user.kyc_face_match_score}%` : "Not provided"}
									</Typography>
								</Box>
							</Grid>
							<Grid size={{xs: 12, sm: 6, md: 3}}>
								<Box sx={{p: 3, bgcolor: alpha(theme.palette.text.primary, 0.03), borderRadius: 3, height: "100%"}}>
									<Typography variant="caption" sx={{color: "text.disabled", fontWeight: 400, textTransform: "uppercase", display: "block", mb: 1}}>
										Auth Score
									</Typography>
									<Typography variant="body2" sx={{fontWeight: 700}}>
										{user?.kyc_approval_score ? `${user.kyc_approval_score}%` : "Not provided"}
									</Typography>
								</Box>
							</Grid>
						</Grid>
					</Grid>

					<Grid size={{xs: 12}}>
						<Stack direction={{xs: "column", md: "row"}} spacing={3}>
							<Box sx={{flex: 1}}>
								<Typography variant="subtitle2" sx={{fontWeight: 800, mb: 1.5}}>
									Profile Photo
								</Typography>
								{user?.kyc_selfie_photo ? (
									<Box component="img" src={user?.kyc_selfie_photo} sx={{width: "100%", borderRadius: 2, border: "1px solid", borderColor: "divider"}} />
								) : (
									<Box sx={{p: 4, textAlign: "center", bgcolor: alpha(theme.palette.text.primary, 0.03), borderRadius: 2, border: "1px dashed", borderColor: "divider"}}>
										<Typography variant="body2" color="text.secondary" fontWeight={600}>
											No front photo uploaded
										</Typography>
									</Box>
								)}
							</Box>
							<Box sx={{flex: 1}}>
								<Typography variant="subtitle2" sx={{fontWeight: 800, mb: 1.5}}>
									Front Photo
								</Typography>
								{user?.kyc_front_photo ? (
									<Box component="img" src={user?.kyc_front_photo} sx={{width: "100%", borderRadius: 2, border: "1px solid", borderColor: "divider"}} />
								) : (
									<Box sx={{p: 4, textAlign: "center", bgcolor: alpha(theme.palette.text.primary, 0.03), borderRadius: 2, border: "1px dashed", borderColor: "divider"}}>
										<Typography variant="body2" color="text.secondary" fontWeight={600}>
											No front photo uploaded
										</Typography>
									</Box>
								)}
							</Box>

							<Box sx={{flex: 1}}>
								<Typography variant="subtitle2" sx={{fontWeight: 800, mb: 1.5}}>
									Back Photo
								</Typography>
								{user?.kyc_back_photo ? (
									<Box component="img" src={user?.kyc_back_photo} sx={{width: "100%", borderRadius: 2, border: "1px solid", borderColor: "divider"}} />
								) : (
									<Box sx={{p: 4, textAlign: "center", bgcolor: alpha(theme.palette.text.primary, 0.03), borderRadius: 2, border: "1px dashed", borderColor: "divider"}}>
										<Typography variant="body2" color="text.secondary" fontWeight={600}>
											No back photo uploaded
										</Typography>
									</Box>
								)}
							</Box>
						</Stack>
					</Grid>
				</Grid>
			</Card>

			<UserKycModel open={openKycModel} onClose={() => setOpenKycModel(false)} userId={user?.id} currentStatus={user?.document_verification_status} cdSuccess={handleKycSuccess} />
		</Stack>
	);
};

export default KycTab;
