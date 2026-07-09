import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CustomDrawer from "src/components/common/CustomDrawer";
import { TextFieldForm, AutoCompleteSelectMenu } from "src/components/common/inputs";
import { GetTaskPriorityListServices, GetTaskStatusListServices } from "src/services/Tasks.Services";
import { useFormik } from "formik";
import dayjs from "dayjs";

export default function TaskFilter({ open, onClose, filters, setFilters, onApply }) {
	const dispatch = useDispatch();
	const [priorities, setPriorities] = useState([]);
	const [statuses, setStatuses] = useState([]);

	useEffect(() => {
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
	}, [dispatch]);

	const formik = useFormik({
		initialValues: {
			due_date: filters.due_date || "",
			start_date: filters.start_date || "",
			end_date: filters.end_date || "",
			priority: filters.priority ? Number(filters.priority) : "",
			status: filters.status ? Number(filters.status) : "",
		},
		enableReinitialize: true,
		onSubmit: (values) => {
			const payload = {
				...values,
				due_date: values.due_date ? dayjs(values.due_date).format("YYYY-MM-DD") : "",
				start_date: values.start_date ? dayjs(values.start_date).format("YYYY-MM-DD") : "",
				end_date: values.end_date ? dayjs(values.end_date).format("YYYY-MM-DD") : "",
			};
			setFilters(payload);
			if (onApply) onApply(payload);
			onClose();
		},
	});

	const handleClear = () => {
		const emptyFilters = {
			due_date: "",
			start_date: "",
			end_date: "",
			priority: "",
			status: "",
		};
		formik.resetForm({ values: emptyFilters });
		setFilters(emptyFilters);
		if (onApply) onApply(emptyFilters);
		onClose();
	};

	return (
		<CustomDrawer open={open} onClose={onClose} title="Filter Tasks" width={460}>
			<form onSubmit={formik.handleSubmit} noValidate>
				<Stack spacing={3}>
					<TextFieldForm type="date" formik={formik} label="Due Date" field="due_date" required={false} />

					<Stack direction="row" spacing={2}>
						<TextFieldForm type="date" formik={formik} label="Start Date" field="start_date" required={false} />
						<TextFieldForm type="date" formik={formik} label="End Date" field="end_date" required={false} />
					</Stack>

					<AutoCompleteSelectMenu formik={formik} label="Priority" field="priority" placeholder="Select Priority" menuList={priorities} valueKey="id" labelKey="name" required={false} />

					<AutoCompleteSelectMenu formik={formik} label="Status" field="status" placeholder="Select Status" menuList={statuses} valueKey="id" labelKey="name" required={false} />

					<Box sx={{ flexGrow: 1 }} />

					<Stack direction="row" spacing={2} sx={{ pt: 2, mt: 4, borderTop: '1px dashed', borderColor: 'divider' }}>
						<Button fullWidth variant="outlined" color="inherit" onClick={handleClear}>
							Clear
						</Button>
						<Button fullWidth type="submit" variant="contained" color="primary">
							Apply Filters
						</Button>
					</Stack>
				</Stack>
			</form>
		</CustomDrawer>
	);
}
