import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { CustomDialogModel } from "src/components/common/CustomDialogModel";
import { TextFieldForm } from "src/components/common/inputs";
import { CreateAdminNoteServices } from "src/services/Notes.Services";
import { sweetAlerts, sweetAlertSuccess } from "src/utils/sweet-alerts";

export default function UserNoteModel({ open, onClose, onSuccess, userId }) {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);

	const formik = useFormik({
		initialValues: {
			note: "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			note: Yup.string().required("Note content is required"),
		}),
		onSubmit: (values) => {
			setLoading(true);
			const payload = { note: values.note, user_id: userId };

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
		},
	});

	return (
		<CustomDialogModel 
			open={open} 
			handleClose={onClose} 
			title="Create Note" 
			minWidth={500} 
			maxWidth={500}
			child={
				<form onSubmit={formik.handleSubmit} noValidate>
					<Stack spacing={3}>
						<TextFieldForm formik={formik} label="Note Content" field="note" placeholder="Write internal note here..." required multiline rows={6} />

						<Box sx={{ flexGrow: 1 }} />

						<Stack direction="row" spacing={2} sx={{ pt: 2, mt: 4, borderTop: '1px dashed', borderColor: 'divider' }}>
							<Button fullWidth variant="outlined" color="inherit" onClick={onClose}>
								Cancel
							</Button>
							<Button fullWidth type="submit" variant="contained" color="primary" disabled={loading}>
								Save Note
							</Button>
						</Stack>
					</Stack>
				</form>
			}
		/>
	);
}
