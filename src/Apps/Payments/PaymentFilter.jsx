import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CustomDrawer from "src/components/common/CustomDrawer";
import { AutoCompleteSelectMenu, TextFieldForm } from "src/components/common/inputs";
import { useFormik } from "formik";

const STATUS_OPTIONS = [
	{ id: "succeeded", name: "Succeeded" },
	{ id: "failed", name: "Failed" },
];

const PROVIDER_OPTIONS = [
	{ id: "stripe", name: "Stripe" },
];

export default function PaymentFilter({ open, onClose, filters, setFilters, onApply }) {
	const formik = useFormik({
		initialValues: {
			user_id: filters.user_id ?? "",
			status: filters.status ?? "",
			provider: filters.provider ?? "",
			payment_intent_id: filters.payment_intent_id ?? "",
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
			status: "",
			provider: "",
			payment_intent_id: "",
		};
		formik.resetForm({ values: emptyFilters });
		setFilters(emptyFilters);
		if (onApply) onApply(emptyFilters);
		onClose();
	};

	return (
		<CustomDrawer open={open} onClose={onClose} title="Filter Payments" width={460}>
			<form onSubmit={formik.handleSubmit} noValidate>
				<Stack spacing={3}>
					<TextFieldForm formik={formik} label="User ID" field="user_id" placeholder="Enter User ID" type="number" required={false} />

					<AutoCompleteSelectMenu formik={formik} label="Status" field="status" placeholder="Select Status" menuList={STATUS_OPTIONS} valueKey="id" labelKey="name" required={false} />

					<AutoCompleteSelectMenu formik={formik} label="Provider" field="provider" placeholder="Select Provider" menuList={PROVIDER_OPTIONS} valueKey="id" labelKey="name" required={false} />

					<TextFieldForm formik={formik} label="Payment Intent ID" field="payment_intent_id" placeholder="Enter Payment Intent ID" required={false} />

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
