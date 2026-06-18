import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

import * as Yup from "yup";
import {Form, Formik} from "formik";

import {TextFieldForm} from "src/components/common/inputs";
import {CustomDialogModel} from "src/components/common/CustomDialogModel";

const LocationModel = ({open, handleClose, cdSuccess, data}) => {
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
		if (data?.id) {
			values.id = data.id;
		}
	};

	return (
		<CustomDialogModel
			maxWidth={500}
			minWidth={500}
			open={open}
			handleClose={handleClose}
			title={data?.id ? "Edit Location" : "Create New Location"}
			subTitle={data?.id ? "Update a location to your organization." : "Add a new location to your organization."}
			child={
				<Box>
					<Formik
						enableReinitialize
						initialValues={{
							name: data?.name || "",
							description: data?.description || "",
						}}
						validationSchema={Yup.object().shape({
							name: Yup.string().trim().min(2, "Location name must be at least 2 characters").required("Location name is required"),
							description: Yup.string().required("Description is required"),
						})}
						onSubmit={HandleSubmit}>
						{(props) => (
							<Form autoComplete="off" noValidate>
								<Stack spacing={2}>
									{errMsg && <Alert severity="error">{errMsg}</Alert>}
									<TextFieldForm formik={props} label="Location Name" field="name" />
									<TextFieldForm formik={props} label="Description" field="description" multiline rows={3} />

									<Stack spacing={1} direction="row" sx={{width: "100%", justifyContent: "flex-end"}}>
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
											{data?.id ? "Save Change" : "Add Location"}
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

export default LocationModel;
