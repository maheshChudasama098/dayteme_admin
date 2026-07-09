import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CustomDrawer from "src/components/common/CustomDrawer";
import { TextFieldForm, AutoCompleteSelectMenu } from "src/components/common/inputs";
import { useFormik } from "formik";

const BOOLEAN_OPTIONS = [
	{ id: 1, name: "Yes" },
	{ id: 0, name: "No" },
];

export default function VenueFilter({ open, onClose, filters, setFilters, onApply }) {
	const formik = useFormik({
		initialValues: {
			category: filters.category ?? "",
			parking: filters.parking !== "" ? Number(filters.parking) : "",
			security: filters.security !== "" ? Number(filters.security) : "",
			is_paid: filters.is_paid !== "" ? Number(filters.is_paid) : "",
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
			category: "",
			parking: "",
			security: "",
			is_paid: "",
		};
		formik.resetForm({ values: emptyFilters });
		setFilters(emptyFilters);
		if (onApply) onApply(emptyFilters);
		onClose();
	};

	return (
		<CustomDrawer open={open} onClose={onClose} title="Filter Venues" width={460}>
			<form onSubmit={formik.handleSubmit} noValidate>
				<Stack spacing={3}>
					<TextFieldForm formik={formik} label="Category" field="category" placeholder="Enter Category Name" required={false} />

					<AutoCompleteSelectMenu formik={formik} label="Has Parking" field="parking" placeholder="Select" menuList={BOOLEAN_OPTIONS} valueKey="id" labelKey="name" required={false} />
					<AutoCompleteSelectMenu formik={formik} label="Has Security" field="security" placeholder="Select" menuList={BOOLEAN_OPTIONS} valueKey="id" labelKey="name" required={false} />
					<AutoCompleteSelectMenu formik={formik} label="Is Paid" field="is_paid" placeholder="Select" menuList={BOOLEAN_OPTIONS} valueKey="id" labelKey="name" required={false} />

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
