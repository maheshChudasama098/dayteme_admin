import React, {useState} from "react";
import {useDispatch} from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import {Form, Formik} from "formik";

import {TextFieldForm, AutoCompleteSelectMultiple} from "src/components/common/inputs";
import {CustomDialogModel} from "src/components/common/CustomDialogModel";
import {PostAdminRoleServices, PutAdminRoleServices} from "src/services/Roles.Services";
import {sweetAlertSuccess} from "src/utils/sweet-alerts";
import {getErrorMessage} from "src/utils/utils";

const RoleModel = ({open, handleClose, cdSuccess, data, permissionsList = []}) => {
	const dispatch = useDispatch();
	const [errMsg, setErrMsg] = useState(null);
	const [loadingLoader, setLoadingLoader] = useState(false);

	const isSystemRole = Boolean(data?.is_system || data?.system);

	const initialPermissions = data?.permissions
		? (typeof data.permissions[0] === "object" ? data.permissions.map((p) => p.id) : data.permissions)
		: (data?.permission_ids || []);

	const HandleSubmit = (values) => {
		setLoadingLoader(true);
		setErrMsg(null);

		const payload = {
			name: values.name,
			description: values.description,
			permission_ids: values.permission_ids,
		};

		if (data?.id) {
			dispatch(
				PutAdminRoleServices(data?.id, payload, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						cdSuccess();
						sweetAlertSuccess("Role updated successfully");
					} else {
						setErrMsg(getErrorMessage(res));
					}
				})
			);
		} else {
			dispatch(
				PostAdminRoleServices(payload, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						cdSuccess();
						sweetAlertSuccess("Role added successfully");
					} else {
						setErrMsg(getErrorMessage(res));
					}
				})
			);
		}
	};

	return (
		<CustomDialogModel
			maxWidth={600}
			minWidth={500}
			open={open}
			handleClose={handleClose}
			title={data?.id ? "Edit Role" : "Create New Role"}
			subTitle={data?.id ? "Update role details and permissions." : "Add a new security role to the system."}
			child={
				<Box>
					<Formik
						enableReinitialize
						initialValues={{
							name: data?.name || "",
							slug: data?.slug || "",
							description: data?.description || "",
							permission_ids: initialPermissions,
						}}
						validationSchema={Yup.object().shape({
							name: Yup.string().trim().required("Role Name is required"),
							description: Yup.string().trim(),
							permission_ids: Yup.array().min(1, "Select at least one permission").required("Permissions are required"),
						})}
						onSubmit={HandleSubmit}
					>
						{(props) => (
							<Form autoComplete="off" noValidate>
								<Stack spacing={3}>
									{errMsg && <Alert severity="error">{errMsg}</Alert>}
									
									<Grid container spacing={2.5}>
										{/* Role Name */}
										<Grid size={{xs: 12, md: 12}}>
											<TextFieldForm 
												formik={props} 
												label="Role Name" 
												field="name" 
												placeholder="Enter role name (e.g. Moderator)" 
												disabled={isSystemRole}
											/>
										</Grid>

										{/* Slug (only displayed for existing roles) */}
										{data?.slug && (
											<Grid size={{xs: 12, md: 12}}>
												<TextFieldForm 
													formik={props} 
													label="Slug" 
													field="slug" 
													disabled 
												/>
											</Grid>
										)}

										{/* Description */}
										<Grid size={{xs: 12, md: 12}}>
											<TextFieldForm 
												formik={props} 
												label="Description" 
												field="description" 
												placeholder="Enter description of this role" 
												multiline
												rows={3}
												required={false}
											/>
										</Grid>

										{/* Permissions Multi Select */}
										<Grid size={{xs: 12, md: 12}}>
											<AutoCompleteSelectMultiple
												formik={props}
												label="Permissions"
												field="permission_ids"
												placeholder="Search and select permissions"
												menuList={permissionsList}
												valueKey="id"
												labelKey="name"
												showSelectAll
											/>
										</Grid>
									</Grid>

									<Stack spacing={1.5} direction="row" sx={{width: "100%", justifyContent: "flex-end", mt: 2}}>
										<Button
											type="button"
											variant="outlined"
											color="primary"
											disabled={loadingLoader}
											onClick={() => {
												props.resetForm();
												handleClose();
											}}
										>
											Cancel
										</Button>
										<Button type="submit" variant="contained" color="primary" disabled={!props.dirty || loadingLoader}>
											{data?.id ? "Save Changes" : "Add Role"}
										</Button>
									</Stack>
								</Stack>
							</Form>
						)}
					</Formik>
				</Box>
			}
		/>
	);
};

export default RoleModel;
