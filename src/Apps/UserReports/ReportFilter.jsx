import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CustomDrawer from "src/components/common/CustomDrawer";
import { TextFieldForm } from "src/components/common/inputs";
import { useFormik } from "formik";

export default function ReportFilter({ open, onClose, filters, setFilters, onApply }) {
	const formik = useFormik({
		initialValues: {
			reporter_user_id: filters.reporter_user_id ?? "",
			reported_user_id: filters.reported_user_id ?? "",
			report_type_id: filters.report_type_id ?? "",
		},
		enableReinitialize: true,
		onSubmit: (values) => {
			setFilters(values);
			if (onApply) onApply(values);
			onClose();
		},
	});

	const handleClear = () => {
		const emptyFilters = {
			reporter_user_id: "",
			reported_user_id: "",
			report_type_id: "",
		};
		formik.resetForm({ values: emptyFilters });
		setFilters(emptyFilters);
		if (onApply) onApply(emptyFilters);
		onClose();
	};

	return (
		<CustomDrawer open={open} onClose={onClose} title="Filter Reports" width={460}>
			<form onSubmit={formik.handleSubmit} noValidate>
				<Stack spacing={3}>
					<TextFieldForm formik={formik} label="Reporter User ID" field="reporter_user_id" placeholder="Enter Reporter User ID" type="number" required={false} />

					<TextFieldForm formik={formik} label="Reported User ID" field="reported_user_id" placeholder="Enter Reported User ID" type="number" required={false} />

					<TextFieldForm formik={formik} label="Report Type ID" field="report_type_id" placeholder="Enter Report Type ID" type="number" required={false} />

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
