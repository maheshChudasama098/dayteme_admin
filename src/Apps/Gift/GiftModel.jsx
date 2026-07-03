import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import * as Yup from "yup";
import {Form, Formik} from "formik";

import {TextFieldForm, AutoCompleteSelectMenu} from "src/components/common/inputs";
import {CustomDialogModel} from "src/components/common/CustomDialogModel";
import {PostAdminGiftServices, PutAdminGiftServices} from "src/services/Gift.Services";
import {sweetAlertSuccess} from "src/utils/sweet-alerts";

const GiftModel = ({open, handleClose, cdSuccess, data}) => {
	const dispatch = useDispatch();

	const [errMsg, setErrMsg] = useState(null);
	const [loadingLoader, setLoadingLoader] = useState(false);

	useEffect(() => {
		const handleOpen = () => {
			setErrMsg(null);
			setLoadingLoader(false);
		};
		handleOpen();
	}, [open]);

	const HandleSubmit = (values) => {
		setLoadingLoader(true);

		const formData = new FormData();
		formData.append("title", values.title);
		formData.append("type", values.type);
		formData.append("required_coins", values.required_coins);

		if (values.image instanceof File) {
			formData.append("image", values.image);
		}

		if (data?.id) {
			formData.append("_method", "PUT");
			dispatch(
				PutAdminGiftServices(data.id, formData, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						cdSuccess();
						sweetAlertSuccess("Gift updated successfully");
					} else {
						setErrMsg(res?.message || "Failed to update gift");
					}
				}),
			);
		} else {
			dispatch(
				PostAdminGiftServices(formData, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						cdSuccess();
						sweetAlertSuccess("Gift added successfully");
					} else {
						setErrMsg(res?.message || "Failed to add gift");
					}
				}),
			);
		}
	};

	const typeOptions = [
		{id: "Physical", name: "Physical"},
		{id: "Virtual", name: "Virtual"},
	];

	return (
		<CustomDialogModel
			maxWidth={500}
			minWidth={500}
			open={open}
			handleClose={handleClose}
			title={data?.id ? "Edit Gift" : "Create New Gift"}
			subTitle={data?.id ? "Update an existing gift." : "Add a new gift."}
			child={
				<Box>
					<Formik
						enableReinitialize
						initialValues={{
							title: data?.title || "",
							type: data?.type || "Virtual",
							required_coins: data?.required_coins || "",
							image: null,
						}}
						validationSchema={Yup.object().shape({
							title: Yup.string().trim().max(255).required("Gift title is required"),
							type: Yup.string().required("Type is required"),
							required_coins: Yup.number().required("Required coins is required").min(1, "Coins must be at least 1"),
						})}
						onSubmit={HandleSubmit}>
						{(props) => (
							<Form autoComplete="off" noValidate>
								<Stack spacing={2}>
									{errMsg && <Alert severity="error">{errMsg}</Alert>}

									<TextFieldForm formik={props} label="Gift Title" field="title" />

									<Grid container spacing={2}>
										<Grid size={{xs: 12, md: 6}}>
											<AutoCompleteSelectMenu formik={props} label="Gift Type" field="type" menuList={typeOptions} labelKey="name" valueKey="id" />
										</Grid>
										<Grid size={{xs: 12, md: 6}}>
											<TextFieldForm formik={props} label="Required Sparks" field="required_coins" type="number" />
										</Grid>
									</Grid>

									<Box>
										<Button variant="outlined" component="label" fullWidth sx={{py: 1.5, borderStyle: "dashed"}}>
											{props.values.image ? props.values.image.name : "Upload Gift Image (Max 5MB)"}
											<input
												type="file"
												hidden
												accept="image/*"
												onChange={(e) => {
													if (e.target.files && e.target.files[0]) {
														props.setFieldValue("image", e.target.files[0]);
													}
												}}
											/>
										</Button>
									</Box>

									<Stack spacing={1} direction="row" sx={{width: "100%", justifyContent: "flex-end", mt: 2}}>
										<Button
											type="button"
											variant="outlined"
											color="primary"
											fullWidth
											disabled={loadingLoader}
											onClick={() => {
												props.resetForm();
												handleClose();
											}}>
											Cancel
										</Button>
										<Button type="submit" variant="contained" fullWidth color="primary" disabled={!props.dirty || loadingLoader}>
											{data?.id ? "Save Change" : "Add Gift"}
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

export default GiftModel;
