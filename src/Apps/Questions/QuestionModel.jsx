import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

import * as Yup from "yup";
import {Form, Formik} from "formik";

import {CheckboxForm, TextFieldForm} from "src/components/common/inputs";
import {CustomDialogModel} from "src/components/common/CustomDialogModel";
import {PostAdminPromptsCreateServices, PutAdminPromptsUpdateServices} from "src/services/Prompts.Services";
import {sweetAlertSuccess} from "src/utils/sweet-alerts";
import {getErrorMessage} from "src/utils/utils";

const QuestionModel = ({open, handleClose, cdSuccess, data}) => {
	const dispatch = useDispatch();

	const [errMsg, setErrMsg] = useState(null);
	const [modelOpenFlag, setModelOpenFlag] = useState(false);
	const [loadingLoader, setLoadingLoader] = useState(false);

	const handleCloseAction = () => {
		setModelOpenFlag(false);
		handleClose();
	};

	useEffect(() => {
		const handleOpen = () => {
			setErrMsg(null);
			setLoadingLoader(false);
			setModelOpenFlag(open);
		};
		handleOpen();
	}, [open]);

	const HandleSubmit = (values) => {
		setLoadingLoader(true);
		if (data?.id) {
			dispatch(
				PutAdminPromptsUpdateServices(data?.id, values, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setModelOpenFlag(false);
						cdSuccess();
						sweetAlertSuccess("Location updated successfully");
					} else {
						const errorMessage = getErrorMessage(res);
						setErrMsg(errorMessage);
					}
				}),
			);
		} else {
			dispatch(
				PostAdminPromptsCreateServices(values, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setModelOpenFlag(false);
						cdSuccess();
						sweetAlertSuccess("Question added successfully");
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
			maxWidth={500}
			minWidth={500}
			open={modelOpenFlag}
			handleClose={handleCloseAction}
			title={data?.id ? "Edit Question" : "Create New Question"}
			subTitle={data?.id ? "Update a question." : "Add a new question."}
			child={
				<Box>
					<Formik
						enableReinitialize
						initialValues={{
							question: data?.question || "",
							sort_order: data?.sort_order || 1,
							is_active: data?.is_active || false,
						}}
						validationSchema={Yup.object().shape({
							question: Yup.string().trim().min(2, "Question must be at least 2 characters").required("Question is required"),
							sort_order: Yup.number().min(1, "Sort order must be a positive number").required("Sort order is required"),
							is_active: Yup.boolean().required("Question is required"),
						})}
						onSubmit={HandleSubmit}>
						{(props) => (
							<Form autoComplete="off" noValidate>
								<Stack spacing={2}>
									{errMsg && <Alert severity="error">{errMsg}</Alert>}

									<TextFieldForm formik={props} label="Question" field="question" multiline rows={3} />

									<TextFieldForm formik={props} label="Sort Order" field="sort_order" type="number" />

									<CheckboxForm formik={props} field="is_active" label="Is Active" />

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
											{data?.id ? "Save Change" : "Add Question"}
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

export default QuestionModel;
