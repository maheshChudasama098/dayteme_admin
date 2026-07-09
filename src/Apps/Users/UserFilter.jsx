import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CustomDrawer from "src/components/common/CustomDrawer";
import { AutoCompleteSelectMenu } from "src/components/common/inputs";
import { GetLocationsListServices } from "src/services/Locations.Services";
import { GetGenderListServices } from "src/services/Users.Services";
import { useFormik } from "formik";

const BOOLEAN_OPTIONS = [
	{ id: 1, name: "Yes" },
	{ id: 0, name: "No" },
];

export default function UserFilter({ open, onClose, filters, setFilters, onApply }) {
	const dispatch = useDispatch();
	const [locations, setLocations] = useState([]);
	const [genders, setGenders] = useState([]);

	useEffect(() => {
		dispatch(
			GetLocationsListServices((res) => {
				if (res?.success) setLocations(res?.data?.location || []);
			}),
		);
		dispatch(
			GetGenderListServices((res) => {
				if (res?.success) setGenders(res?.data?.genders || []);
			}),
		);
	}, [dispatch]);

	const formik = useFormik({
		initialValues: {
			is_admin: filters.is_admin !== "" ? Number(filters.is_admin) : "",
			gender_id: filters.gender_id !== "" ? Number(filters.gender_id) : "",
			location_id: filters.location_id !== "" ? Number(filters.location_id) : "",
			is_paused: filters.is_paused !== "" ? Number(filters.is_paused) : "",
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
			is_admin: "",
			gender_id: "",
			location_id: "",
			is_paused: "",
		};
		formik.resetForm({ values: emptyFilters });
		setFilters(emptyFilters);
		if (onApply) onApply(emptyFilters);
		onClose();
	};

	return (
		<CustomDrawer open={open} onClose={onClose} title="Filter Users" width={460}>
			<form onSubmit={formik.handleSubmit} noValidate>
				<Stack spacing={3}>
					<AutoCompleteSelectMenu formik={formik} label="Is Admin?" field="is_admin" placeholder="Select Admin Status" menuList={BOOLEAN_OPTIONS} valueKey="id" labelKey="name" required={false} />

					<AutoCompleteSelectMenu formik={formik} label="Gender" field="gender_id" placeholder="Select Gender" menuList={genders} valueKey="id" labelKey="name" required={false} />

					<AutoCompleteSelectMenu formik={formik} label="Location" field="location_id" placeholder="Select Location" menuList={locations} valueKey="id" labelKey="name" required={false} />

					<AutoCompleteSelectMenu formik={formik} label="Account Paused?" field="is_paused" placeholder="Select Paused Status" menuList={BOOLEAN_OPTIONS} valueKey="id" labelKey="name" required={false} />

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
