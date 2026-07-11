import React from "react";
import {Stack, Box, Button} from "@mui/material";
import {TextFieldForm} from "src/components/common/inputs/TextFieldForm";
import {AutoCompleteSelectMenu} from "src/components/common/inputs/AutoCompleteSelectMenu";
import {useDispatch} from "react-redux";
import {PostAdminUserKycStatusServices} from "src/services/Users.Services";
import {sweetAlerts, sweetAlertSuccess} from "src/utils/sweet-alerts";
import {CustomDialogModel} from "src/components/common/CustomDialogModel";

import * as Yup from "yup";
import {Form, Formik} from "formik";
import {getErrorMessage} from "src/utils/utils";

const UserKycModel = ({open, onClose, userId, currentStatus, cdSuccess}) => {
	const dispatch = useDispatch();

	const HandleSubmit = (values, formik) => {
		dispatch(
			PostAdminUserKycStatusServices(userId, {status: values.status, comment: values.comment}, (res) => {
				formik?.setSubmitting(false);
				if (res?.success) {
					sweetAlertSuccess("KYC Status Updated Successfully");
					formik?.resetForm();
					if (cdSuccess) cdSuccess();
					onClose();
				} else {
					const error = getErrorMessage(res);
					sweetAlerts("error", error);
				}
			}),
		);
	};

	return (
		<CustomDialogModel
			maxWidth={500}
			minWidth={500}
			open={open}
			handleClose={onClose}
			title="Update Verification Status"
			child={
				<Box>
					<Formik
						enableReinitialize
						initialValues={{
							status: currentStatus ?? 1,
							comment: "",
						}}
						validationSchema={Yup.object().shape({
							status: Yup.string().required("Status is required"),
							comment: Yup.string().when("status", (status, schema) => {
								// status can be an array in Yup v1, or a single value in older versions. 
								// We'll safely check if it equals 1 or '1'.
								const val = Array.isArray(status) ? status[0] : status;
								if (String(val) === "1") {
									return schema.nullable();
								}
								return schema.required("Comment is required");
							}),
						})}
						onSubmit={HandleSubmit}>
						{(props) => (
							<Form autoComplete="off" noValidate>
								<Stack spacing={3} sx={{mt: 2}}>
									<AutoCompleteSelectMenu
										formik={props}
										label="Status"
										field="status"
										menuList={[
											{id: 0, label: "Rejected / Unverified"},
											{id: 1, label: "Verified"},
											{id: 2, label: "Uploaded / Pending"},
											{id: 3, label: "Reset / Cleared"},
										]}
										valueKey="id"
										labelKey="label"
									/>
									<TextFieldForm 
										formik={props} 
										field="comment" 
										label={String(props.values.status) === "1" ? "Admin Comment (Optional)" : "Admin Comment (Required)"} 
										multiline 
										rows={3} 
										placeholder="Add notes or state reason for the rejection / status change..." 
									/>
									<Box sx={{display: "flex", justifyContent: "flex-end", pt: 2}}>
										<Button onClick={onClose} color="inherit" sx={{mr: 2}}>
											Cancel
										</Button>
										<Button type="submit" variant="contained" color="primary" disabled={props.isSubmitting}>
											{props.isSubmitting ? "Updating..." : "Update Status"}
										</Button>
									</Box>
								</Stack>
							</Form>
						)}
					</Formik>
				</Box>
			}
		/>
	);
};

export default UserKycModel;
