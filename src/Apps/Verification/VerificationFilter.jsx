import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CustomDrawer from "src/components/common/CustomDrawer";
import {AutoCompleteSelectMenu} from "src/components/common/inputs";
import {useFormik} from "formik";

const STATUS_OPTIONS = [
	{id: 0, name: "Rejected / Unverified"},
	{id: 1, name: "Verified"},
	{id: 2, name: "Uploaded / Pending"},
	{id: 3, name: "Reset / Cleared"},
];

export default function VerificationFilter({open, onClose, filters, setFilters, onApply}) {
	const formik = useFormik({
		initialValues: {
			status: filters.status !== "" && filters.status !== undefined && filters.status !== null ? Number(filters.status) : "",
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
			status: "",
		};
		formik.resetForm({values: emptyFilters});
		setFilters(emptyFilters);
		if (onApply) onApply(emptyFilters);
		onClose();
	};

	return (
		<CustomDrawer open={open} onClose={onClose} title="Filter Verifications" width={460}>
			<form onSubmit={formik.handleSubmit} noValidate>
				<Stack spacing={3}>
					<Box sx={{mt: 1}}>
						<AutoCompleteSelectMenu placeholder="Select Verification Status" label="Status" field="status" menuList={STATUS_OPTIONS} valueKey="id" labelKey="name" formik={formik} required={false} />
					</Box>

					{/* Actions */}
					<Stack direction="row" spacing={2} sx={{mt: 3}}>
						<Button fullWidth variant="outlined" color="inherit" onClick={handleClear}>
							Clear All
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
