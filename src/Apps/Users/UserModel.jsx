import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

import * as Yup from "yup";
import {Form, Formik} from "formik";

import {TextFieldForm, AutoCompleteSelectMenu, CheckboxForm} from "src/components/common/inputs";
import {CustomDialogModel} from "src/components/common/CustomDialogModel";
import {GetLocationsListServices} from "src/services/Locations.Services";
import {PostAdminUserAddServices, PutAdminUserServices} from "src/services/Users.Services";
import {sweetAlertSuccess} from "src/utils/sweet-alerts";
import {getErrorMessage} from "src/utils/utils";

const UserModel = ({open, handleClose, cdSuccess, data}) => {
	const dispatch = useDispatch();

	const [errMsg, setErrMsg] = useState(null);
	const [location, setLocation] = useState([]);
	const [modelOpenFlag, setModelOpenFlag] = useState(false);
	const [loadingLoader, setLoadingLoader] = useState(false);

	useEffect(() => {
		const handleOpen = () => {
			setErrMsg(null);
			setLoadingLoader(false);
			setModelOpenFlag(open);
		};
		handleOpen();
	}, [open]);

	useEffect(() => {
		const handleOpen = () => {
			dispatch(
				GetLocationsListServices((res) => {
					setLoadingLoader(false);
					setLocation(res?.data?.location);
				}),
			);
		};
		handleOpen();
	}, [dispatch]);

	const HandleSubmit = (values) => {
		setLoadingLoader(true);
		if (data?.id) {
			dispatch(
				PutAdminUserServices(data?.id, values, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setModelOpenFlag(false);
						cdSuccess();
						sweetAlertSuccess("User updated successfully");
					} else {
						const errorMessage = getErrorMessage(res);
						setErrMsg(errorMessage);
					}
				}),
			);
		} else {
			dispatch(
				PostAdminUserAddServices(values, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setModelOpenFlag(false);
						cdSuccess();
						sweetAlertSuccess("User added successfully");
					} else {
						const errorMessage = getErrorMessage(res);
						setErrMsg(errorMessage);
					}
				}),
			);
		}
	};

	return (
		<CustomDialogModel
			maxWidth={600}
			minWidth={500}
			open={modelOpenFlag}
			handleClose={handleClose}
			title={data?.id ? "Edit User" : "Create New User"}
			subTitle={data?.id ? "Update user details." : "Add a new user to the system."}
			child={
				<Box>
					<Formik
						enableReinitialize
						initialValues={{
							name: data?.name || "",
							email: data?.email || "",
							phone_number: data?.phone_number || "",
							location: data?.location?.id || "",
							is_admin: data?.is_admin || false,
						}}
						validationSchema={Yup.object().shape({
							name: Yup.string().trim().required("Name is required"),
							email: Yup.string().email("Invalid email").required("Email is required"),
							phone_number: Yup.string().trim().required("Phone is required"),
							location: Yup.string().trim().required("Location is required"),
							is_admin: Yup.boolean(),
						})}
						onSubmit={HandleSubmit}>
						{(props) => (
							<Form autoComplete="off" noValidate>
								<Stack spacing={2}>
									{errMsg && <Alert severity="error">{errMsg}</Alert>}
									<Grid container spacing={1}>
										<Grid size={{xs: 12, md: 12}}>
											<CheckboxForm formik={props} label="Is Admin" field="is_admin" />
										</Grid>
										<Grid size={{xs: 12, md: 12}}>
											<TextFieldForm formik={props} label="Name" field="name" placeholder="Enter user's name" />
										</Grid>
										<Grid size={{xs: 12, md: 12}}>
											<TextFieldForm formik={props} label="Email" field="email" type="email" placeholder="Enter user's email" />
										</Grid>
										<Grid size={{xs: 12, md: 12}}>
											<TextFieldForm formik={props} label="Phone Number" field="phone_number" placeholder="Enter user's phone number" />
										</Grid>
										<Grid size={{xs: 12, md: 12}}>
											<AutoCompleteSelectMenu formik={props} label="Location" field="location" placeholder="Enter user's location" menuList={location} valueKey="id" labelKey="name" />
										</Grid>
									</Grid>

									<Stack spacing={1} direction="row" sx={{width: "100%", justifyContent: "flex-end", mt: 3}}>
										<Button
											type="button"
											variant="outlined"
											color="primary"
											disabled={loadingLoader}
											onClick={() => {
												props.resetForm();
												handleClose();
											}}>
											Cancel
										</Button>
										<Button type="submit" variant="contained" color="primary" disabled={!props.dirty || loadingLoader}>
											{data?.id ? "Save Change" : "Add User"}
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

export default UserModel;
