import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CustomDrawer from "src/components/common/CustomDrawer";
import { AutoCompleteSelectMenu, TextFieldForm } from "src/components/common/inputs";
import { GetAdminUsersListServices } from "src/services/Users.Services";
import { useFormik } from "formik";

const REVIEW_TYPE_OPTIONS = [
	{ id: 1, name: "Private" },
	{ id: 2, name: "Public" },
];

export default function DateRatingFilter({ open, onClose, filters, setFilters, onApply }) {
	const dispatch = useDispatch();
	const [usersList, setUsersList] = useState([]);

	useEffect(() => {
		if (open) {
			dispatch(
				GetAdminUsersListServices({ per_page: 500, page: 1 }, (res) => {
					if (res?.success) setUsersList(res?.data?.users || []);
				})
			);
		}
	}, [open, dispatch]);

	const formik = useFormik({
		initialValues: {
			date_plan_id: filters.date_plan_id ?? "",
			user_id: filters.user_id ? Number(filters.user_id) : "",
			review_type: filters.review_type !== "" ? Number(filters.review_type) : "",
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
			date_plan_id: "",
			user_id: "",
			review_type: "",
		};
		formik.resetForm({ values: emptyFilters });
		setFilters(emptyFilters);
		if (onApply) onApply(emptyFilters);
		onClose();
	};

	return (
		<CustomDrawer open={open} onClose={onClose} title="Filter Ratings" width={460}>
			<form onSubmit={formik.handleSubmit} noValidate>
				<Stack spacing={3}>
					{/* <TextFieldForm formik={formik} label="Date Plan ID" field="date_plan_id" placeholder="Enter Date Plan ID" type="number" required={false} /> */}

					<AutoCompleteSelectMenu formik={formik} label="Reviewer User" field="user_id" placeholder="Select User" menuList={usersList} valueKey="id" labelKey="name" required={false} />

					<AutoCompleteSelectMenu formik={formik} label="Review Type" field="review_type" placeholder="Select Review Type" menuList={REVIEW_TYPE_OPTIONS} valueKey="id" labelKey="name" required={false} />

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
