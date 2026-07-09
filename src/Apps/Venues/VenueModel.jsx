import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { CustomDialogModel } from "src/components/common/CustomDialogModel";
import { TextFieldForm, AutoCompleteSelectMenu } from "src/components/common/inputs";
import { CreateAdminVenueServices, UpdateAdminVenueServices } from "src/services/Venues.Services";
import { sweetAlerts, sweetAlertSuccess } from "src/utils/sweet-alerts";

const BOOLEAN_OPTIONS = [
	{ id: 1, name: "Yes" },
	{ id: 0, name: "No" },
];

export default function VenueModel({ open, onClose, onSuccess, data }) {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const isEdit = Boolean(data?.id);

	const formik = useFormik({
		initialValues: {
			title: data?.title || "",
			address: data?.address || "",
			latitude: data?.latitude || "",
			longitude: data?.longitude || "",
			image_url: data?.image_url || "",
			category: data?.category || "",
			start_time: data?.start_time || "",
			end_time: data?.end_time || "",
			parking: data?.parking !== undefined ? (data?.parking ? 1 : 0) : "",
			security: data?.security !== undefined ? (data?.security ? 1 : 0) : "",
			is_paid: data?.is_paid !== undefined ? (data?.is_paid ? 1 : 0) : "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			title: Yup.string().required("Title is required"),
			address: Yup.string().required("Address is required"),
			latitude: Yup.number().required("Latitude is required"),
			longitude: Yup.number().required("Longitude is required"),
			category: Yup.string().required("Category is required"),
			start_time: Yup.string().required("Start time is required"),
			end_time: Yup.string().required("End time is required"),
		}),
		onSubmit: (values) => {
			setLoading(true);
			const payload = {
				title: values.title,
				address: values.address,
				latitude: Number(values.latitude),
				longitude: Number(values.longitude),
				image_url: values.image_url,
				category: values.category,
				start_time: values.start_time,
				end_time: values.end_time,
				parking: Number(values.parking) || 0,
				security: Number(values.security) || 0,
				is_paid: Number(values.is_paid) || 0,
			};

			if (isEdit) {
				dispatch(
					UpdateAdminVenueServices(data.id, payload, (res) => {
						setLoading(false);
						if (res?.success) {
							sweetAlertSuccess("Venue updated successfully");
							if (onSuccess) onSuccess();
							onClose();
						} else {
							sweetAlerts("error", res?.message || "Failed to update venue");
						}
					})
				);
			} else {
				dispatch(
					CreateAdminVenueServices(payload, (res) => {
						setLoading(false);
						if (res?.success) {
							sweetAlertSuccess("Venue created successfully");
							if (onSuccess) onSuccess();
							onClose();
						} else {
							sweetAlerts("error", res?.message || "Failed to create venue");
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
			title={isEdit ? "Edit Venue" : "Create Venue"} 
			minWidth={800} 
			maxWidth={800}
			child={
				<form onSubmit={formik.handleSubmit} noValidate>
					<Stack spacing={3}>
						<Grid container spacing={2}>
							<Grid size={{xs: 12, md: 6}}>
								<TextFieldForm formik={formik} label="Venue Title" field="title" placeholder="Enter Title" required />
							</Grid>
							<Grid size={{xs: 12, md: 6}}>
								<TextFieldForm formik={formik} label="Category" field="category" placeholder="Enter Category" required />
							</Grid>
							
							<Grid size={{xs: 12}}>
								<TextFieldForm formik={formik} label="Address" field="address" placeholder="Enter Full Address" required />
							</Grid>
							
							<Grid size={{xs: 12, md: 6}}>
								<TextFieldForm formik={formik} label="Latitude" field="latitude" placeholder="e.g. 18.0179" type="number" required />
							</Grid>
							<Grid size={{xs: 12, md: 6}}>
								<TextFieldForm formik={formik} label="Longitude" field="longitude" placeholder="e.g. -76.8099" type="number" required />
							</Grid>

							<Grid size={{xs: 12, md: 6}}>
								<TextFieldForm formik={formik} label="Start Time (H:i:s)" field="start_time" placeholder="e.g. 09:00:00" required />
							</Grid>
							<Grid size={{xs: 12, md: 6}}>
								<TextFieldForm formik={formik} label="End Time (H:i:s)" field="end_time" placeholder="e.g. 22:00:00" required />
							</Grid>
							
							<Grid size={{xs: 12}}>
								<TextFieldForm formik={formik} label="Image URL" field="image_url" placeholder="Enter Image URL" />
							</Grid>

							<Grid size={{xs: 12, md: 4}}>
								<AutoCompleteSelectMenu formik={formik} label="Parking" field="parking" placeholder="Select" menuList={BOOLEAN_OPTIONS} valueKey="id" labelKey="name" />
							</Grid>
							<Grid size={{xs: 12, md: 4}}>
								<AutoCompleteSelectMenu formik={formik} label="Security" field="security" placeholder="Select" menuList={BOOLEAN_OPTIONS} valueKey="id" labelKey="name" />
							</Grid>
							<Grid size={{xs: 12, md: 4}}>
								<AutoCompleteSelectMenu formik={formik} label="Is Paid" field="is_paid" placeholder="Select" menuList={BOOLEAN_OPTIONS} valueKey="id" labelKey="name" />
							</Grid>
						</Grid>

						<Box sx={{ flexGrow: 1 }} />

						<Stack direction="row" spacing={2} sx={{ pt: 2, mt: 4, borderTop: '1px dashed', borderColor: 'divider', justifyContent: 'flex-end' }}>
							<Button variant="outlined" color="inherit" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit" variant="contained" color="primary" disabled={loading}>
								{isEdit ? "Update Venue" : "Save Venue"}
							</Button>
						</Stack>
					</Stack>
				</form>
			}
		/>
	);
}
