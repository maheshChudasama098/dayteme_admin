import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import {useTheme, alpha} from "@mui/material/styles";

import {CustomDialogModel} from "src/components/common/CustomDialogModel";
import {GetAdminRoleByIdServices} from "src/services/Roles.Services";
import {getErrorMessage, fDate} from "src/utils/utils";

const RoleViewModel = ({open, handleClose, roleId}) => {
	const theme = useTheme();
	const dispatch = useDispatch();
	
	const [loading, setLoading] = useState(true);
	const [role, setRole] = useState(null);
	const [errMsg, setErrMsg] = useState(null);

	useEffect(() => {
		if (open && roleId) {
			Promise.resolve().then(() => {
				setLoading(true);
				setErrMsg(null);
			});
			dispatch(
				GetAdminRoleByIdServices(roleId, (res) => {
					setLoading(false);
					if (res?.success) {
						setRole(res?.data?.role || res?.data || null);
					} else {
						setErrMsg(getErrorMessage(res));
					}
				})
			);
		}
	}, [dispatch, open, roleId]);

	return (
		<CustomDialogModel
			maxWidth={600}
			minWidth={500}
			open={open}
			handleClose={handleClose}
			title="View Role Details"
			subTitle="Detailed overview of role metadata and permissions."
			child={
				<Box sx={{mt: 1}}>
					{loading ? (
						<Stack spacing={2.5}>
							<Skeleton variant="text" width="60%" height={30} />
							<Skeleton variant="text" width="40%" height={20} />
							<Divider />
							<Skeleton variant="rectangular" height={80} sx={{borderRadius: 1}} />
							<Skeleton variant="text" width="30%" height={25} />
							<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{gap: 1}}>
								<Skeleton variant="rounded" width={80} height={25} />
								<Skeleton variant="rounded" width={100} height={25} />
								<Skeleton variant="rounded" width={90} height={25} />
							</Stack>
						</Stack>
					) : errMsg ? (
						<Alert severity="error">{errMsg}</Alert>
					) : role ? (
						<Stack spacing={3}>
							{/* Basic Info */}
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<Typography variant="caption" color="text.secondary" fontWeight={600}>
										Role Name
									</Typography>
									<Typography variant="body1" fontWeight={700} color="text.primary">
										{role.name}
									</Typography>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Typography variant="caption" color="text.secondary" fontWeight={600}>
										Slug
									</Typography>
									<Typography variant="body1" fontWeight={600} color="text.secondary">
										<code>{role.slug || "N/A"}</code>
									</Typography>
								</Grid>
								
								<Grid item xs={12} sm={6}>
									<Typography variant="caption" color="text.secondary" fontWeight={600}>
										Role Type
									</Typography>
									<Box sx={{mt: 0.5}}>
										<Chip
											label={role.is_system || role.system ? "System Role" : "Custom Role"}
											color={role.is_system || role.system ? "warning" : "success"}
											size="small"
											variant="outlined"
											sx={{fontWeight: 700}}
										/>
									</Box>
								</Grid>

								{role.created_at && (
									<Grid item xs={12} sm={6}>
										<Typography variant="caption" color="text.secondary" fontWeight={600}>
											Created At
										</Typography>
										<Typography variant="body1" fontWeight={600}>
											{fDate(role.created_at)}
										</Typography>
									</Grid>
								)}
							</Grid>

							<Divider />

							{/* Description */}
							<Box>
								<Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom display="block">
									Description
								</Typography>
								<Typography variant="body2" color="text.secondary" sx={{fontStyle: role.description ? "normal" : "italic"}}>
									{role.description || "No description provided for this role."}
								</Typography>
							</Box>

							{/* Permissions */}
							<Box>
								<Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom display="block">
									Assigned Permissions ({role.permissions?.length || 0})
								</Typography>
								{role.permissions && role.permissions.length > 0 ? (
									<Box sx={{display: "flex", flexWrap: "wrap", gap: 1, mt: 1}}>
										{role.permissions.map((perm) => (
											<Chip
												key={perm.id}
												label={perm.name}
												size="small"
												sx={{
													bgcolor: alpha(theme.palette.primary.main, 0.08),
													color: "primary.main",
													fontWeight: 600,
													border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
												}}
											/>
										))}
									</Box>
								) : (
									<Typography variant="body2" color="text.disabled" sx={{fontStyle: "italic"}}>
										No permissions assigned to this role.
									</Typography>
								)}
							</Box>

							<Stack direction="row" justifyContent="flex-end" sx={{mt: 1}}>
								<Button variant="outlined" color="primary" onClick={handleClose}>
									Close
								</Button>
							</Stack>
						</Stack>
					) : (
						<Typography variant="body2" color="text.secondary">No role details found.</Typography>
					)}
				</Box>
			}
		/>
	);
};

export default RoleViewModel;
