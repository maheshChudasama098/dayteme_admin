import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CustomDrawer from "src/components/common/CustomDrawer";
import { AutoCompleteSelectMenu } from "src/components/common/inputs";
import { GetAdminUsersListServices, GetAdminsListServices } from "src/services/Users.Services";
import { useFormik } from "formik";

export default function NoteFilter({ open, onClose, filters, setFilters, onApply }) {
	const dispatch = useDispatch();
	const [usersList, setUsersList] = useState([]);
	const [adminsList, setAdminsList] = useState([]);

	useEffect(() => {
		if (open) {
			dispatch(
				GetAdminUsersListServices({ per_page: 500, page: 1 }, (res) => {
					if (res?.success) setUsersList(res?.data?.users || []);
				})
			);
			dispatch(
				GetAdminsListServices({ per_page: 500, page: 1 }, (res) => {
					if (res?.success) setAdminsList(res?.data?.admins || []);
				})
			);
		}
	}, [open, dispatch]);

	const formik = useFormik({
		initialValues: {
			user_id: filters.user_id ? Number(filters.user_id) : "",
			admin_id: filters.admin_id ? Number(filters.admin_id) : "",
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
			user_id: "",
			admin_id: "",
		};
		formik.resetForm({ values: emptyFilters });
		setFilters(emptyFilters);
		if (onApply) onApply(emptyFilters);
		onClose();
	};

	return (
		<CustomDrawer open={open} onClose={onClose} title="Filter Notes" width={460}>
			<form onSubmit={formik.handleSubmit} noValidate>
				<Stack spacing={3}>
					<AutoCompleteSelectMenu formik={formik} label="User" field="user_id" placeholder="Select User" menuList={usersList} valueKey="id" labelKey="name" required={false} />

					<AutoCompleteSelectMenu formik={formik} label="Administrator" field="admin_id" placeholder="Select Administrator" menuList={adminsList} valueKey="id" labelKey="name" required={false} />

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
