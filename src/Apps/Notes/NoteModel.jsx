import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { CustomDialogModel } from "src/components/common/CustomDialogModel";
import { TextFieldForm, AutoCompleteSelectMenu } from "src/components/common/inputs";
import { CreateAdminNoteServices, UpdateAdminNoteServices } from "src/services/Notes.Services";
import { GetAdminUsersListServices } from "src/services/Users.Services";
import { sweetAlerts, sweetAlertSuccess } from "src/utils/sweet-alerts";

export default function NoteModel({ open, onClose, onSuccess, data }) {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [usersList, setUsersList] = useState([]);
	const isEdit = Boolean(data?.id);

	useEffect(() => {
		if (!isEdit && open) {
			dispatch(
				GetAdminUsersListServices({ per_page: 500, page: 1 }, (res) => {
					if (res?.success) {
						setUsersList(res?.data?.users || []);
					}
				})
			);
		}
	}, [isEdit, open, dispatch]);

	const formik = useFormik({
		initialValues: {
			user_id: data?.user_id || data?.user?.id || "",
			note: data?.note || "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			user_id: isEdit ? Yup.string() : Yup.string().required("User ID is required"),
			note: Yup.string().required("Note content is required"),
		}),
		onSubmit: (values) => {
			setLoading(true);
			const payload = { note: values.note };
			if (!isEdit) {
				payload.user_id = values.user_id;
			}

			if (isEdit) {
				dispatch(
					UpdateAdminNoteServices(data.id, payload, (res) => {
						setLoading(false);
						if (res?.success) {
							sweetAlertSuccess("Note updated successfully");
							if (onSuccess) onSuccess();
							onClose();
						} else {
							sweetAlerts("error", res?.message || "Failed to update note");
						}
					})
				);
			} else {
				dispatch(
					CreateAdminNoteServices(payload, (res) => {
						setLoading(false);
						if (res?.success) {
							sweetAlertSuccess("Note created successfully");
							if (onSuccess) onSuccess();
							onClose();
						} else {
							sweetAlerts("error", res?.message || "Failed to create note");
						}
					})
				);
			}
		},
	});

	return (
		<CustomDialogModel 
			open={open} 
			handleClose={onClose} 
			title={isEdit ? "Edit Note" : "Create Note"} 
			minWidth={500} 
			maxWidth={500}
			child={
				<form onSubmit={formik.handleSubmit} noValidate>
					<Stack spacing={3}>
						{!isEdit && (
							<AutoCompleteSelectMenu formik={formik} label="Target User" field="user_id" placeholder="Select User" menuList={usersList} valueKey="id" labelKey="name" required />
						)}

						<TextFieldForm formik={formik} label="Note Content" field="note" placeholder="Write internal note here..." required multiline rows={6} />

						<Box sx={{ flexGrow: 1 }} />

						<Stack direction="row" spacing={2} sx={{ pt: 2, mt: 4, borderTop: '1px dashed', borderColor: 'divider' }}>
							<Button fullWidth variant="outlined" color="inherit" onClick={onClose}>
								Cancel
							</Button>
							<Button fullWidth type="submit" variant="contained" color="primary" disabled={loading}>
								{isEdit ? "Update Note" : "Save Note"}
							</Button>
						</Stack>
					</Stack>
				</form>
			}
		/>
	);
}
