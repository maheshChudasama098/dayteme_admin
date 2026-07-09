import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import dayjs from "dayjs";

import * as Yup from "yup";
import {Form, Formik} from "formik";

import {TextFieldForm, AutoCompleteSelectMenu, DatePickerCustom} from "src/components/common/inputs";
import {CustomDialogModel} from "src/components/common/CustomDialogModel";
import {GetAdminsListServices} from "src/services/Users.Services";
import {PostAdminTaskAddServices, PutAdminTaskServices, GetTaskPriorityListServices, GetTaskStatusListServices} from "src/services/Tasks.Services";
import {sweetAlertSuccess} from "src/utils/sweet-alerts";
import {getErrorMessage} from "src/utils/utils";

const TaskModel = ({open, handleClose, cdSuccess, data}) => {
	const dispatch = useDispatch();

	const [errMsg, setErrMsg] = useState(null);
	const [admins, setAdmins] = useState([]);
	const [priorities, setPriorities] = useState([]);
	const [statuses, setStatuses] = useState([]);
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
		const fetchInitialData = () => {
			dispatch(
				GetAdminsListServices({page: 1, per_page: 100}, (res) => {
					if (res?.success) setAdmins(res?.data?.admins || []);
				}),
			);
			dispatch(
				GetTaskPriorityListServices((res) => {
					if (res?.success) setPriorities(res?.data?.task_priority || []);
				}),
			);
			dispatch(
				GetTaskStatusListServices((res) => {
					if (res?.success) setStatuses(res?.data?.task_status || []);
				}),
			);
		};
		fetchInitialData();
	}, [dispatch]);

	const HandleSubmit = (values) => {
		setLoadingLoader(true);
        
        const payload = {
            ...values,
            due_date: values.due_date ? dayjs(values.due_date).format("YYYY-MM-DD") : null
        };

		if (data?.id) {
			dispatch(
				PutAdminTaskServices(data?.id, payload, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setModelOpenFlag(false);
						cdSuccess();
						sweetAlertSuccess("Task updated successfully");
					} else {
						const errorMessage = getErrorMessage(res);
						setErrMsg(errorMessage);
					}
				}),
			);
		} else {
			dispatch(
				PostAdminTaskAddServices(payload, (res) => {
					setLoadingLoader(false);
					if (res?.success) {
						setModelOpenFlag(false);
						cdSuccess();
						sweetAlertSuccess("Task created successfully");
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
			title={data?.id ? "Edit Task" : "Create New Task"}
			subTitle={data?.id ? "Update task details." : "Add a new task to the system."}
			child={
				<Box>
					<Formik
						enableReinitialize
						initialValues={{
							title: data?.title || "",
							priority: data?.priority?.id || data?.priority || "",
							status: data?.status?.id || data?.status || "",
							due_date: data?.due_date || null,
							assigned_admin_id: data?.assigned_admin_id || "",
						}}
						validationSchema={Yup.object().shape({
							title: Yup.string().trim().required("Title is required"),
							priority: Yup.number().required("Priority is required"),
							status: Yup.number().required("Status is required"),
							due_date: Yup.string().nullable().required("Due Date is required"),
							assigned_admin_id: Yup.number().required("Assigned Admin is required"),
						})}
						onSubmit={HandleSubmit}>
						{(props) => (
							<Form autoComplete="off" noValidate>
								<Stack spacing={2}>
									{errMsg && <Alert severity="error">{errMsg}</Alert>}
									<Grid container spacing={2}>
										<Grid size={{xs: 12, md: 12}}>
											<TextFieldForm formik={props} label="Title" field="title" placeholder="Enter task title" />
										</Grid>
										<Grid size={{xs: 12, md: 6}}>
											<AutoCompleteSelectMenu formik={props} label="Priority" field="priority" placeholder="Select Priority" menuList={priorities} valueKey="id" labelKey="name" />
										</Grid>
										<Grid size={{xs: 12, md: 6}}>
											<AutoCompleteSelectMenu formik={props} label="Status" field="status" placeholder="Select Status" menuList={statuses} valueKey="id" labelKey="name" />
										</Grid>
										<Grid size={{xs: 12, md: 6}}>
											<TextFieldForm type="date" formik={props} label="Due Date" field="due_date" />
										</Grid>
										<Grid size={{xs: 12, md: 6}}>
											<AutoCompleteSelectMenu formik={props} label="Assigned Admin" field="assigned_admin_id" placeholder="Select Admin" menuList={admins} valueKey="id" labelKey="name" />
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
											{data?.id ? "Save Changes" : "Create Task"}
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

export default TaskModel;
