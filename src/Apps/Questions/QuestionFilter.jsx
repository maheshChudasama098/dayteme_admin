import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CustomDrawer from "src/components/common/CustomDrawer";
import { AutoCompleteSelectMenu } from "src/components/common/inputs";
import { useFormik } from "formik";

const BOOLEAN_OPTIONS = [
	{ id: 1, name: "Active" },
	{ id: 0, name: "Inactive" },
];

export default function QuestionFilter({ open, onClose, filters, setFilters, onApply }) {
	const formik = useFormik({
		initialValues: {
			is_active: filters.is_active !== "" ? Number(filters.is_active) : "",
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
			is_active: "",
		};
		formik.resetForm({ values: emptyFilters });
		setFilters(emptyFilters);
		if (onApply) onApply(emptyFilters);
		onClose();
	};

	return (
		<CustomDrawer open={open} onClose={onClose} title="Filter Questions" width={460}>
			<form onSubmit={formik.handleSubmit} noValidate>
				<Stack spacing={3}>
					<AutoCompleteSelectMenu formik={formik} label="Status" field="is_active" placeholder="Select Status" menuList={BOOLEAN_OPTIONS} valueKey="id" labelKey="name" required={false} />

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
