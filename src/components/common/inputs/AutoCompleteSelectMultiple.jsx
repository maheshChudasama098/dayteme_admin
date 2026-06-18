import React, {useMemo} from "react";
import PropTypes from "prop-types";

import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";

import {Empty} from "antd";
import {Checkbox} from "@mui/material";
import {shadows} from "../../../theme/shadows";

export const AutoCompleteSelectMultiple = ({formik, label, field, menuList, valueKey, labelKey, required = true, unitType, callBackAction, showSelectAll, getSelectObject, placeholder, ...props}) => {
	const selectedValues = formik.values[field] || [];

	const options = useMemo(() => {
		if (showSelectAll && menuList.length > 0) {
			return [{[valueKey]: "__all__", [labelKey]: "Select All"}, ...menuList];
		}
		return menuList;
	}, [menuList, showSelectAll, valueKey, labelKey]);

	//   const handleChange = (e, value) => {
	//     const selectedValues = value.map((item) => item[valueKey]); // Store selected values as an array
	//     formik.setFieldValue(field, selectedValues);

	//     if (typeof callBackAction === 'function') {
	//       callBackAction(selectedValues);
	//     }
	//   };

	const handleChange = (e, value) => {
		// Check if Select All clicked
		const lastSelected = value[value.length - 1];
		if (lastSelected?.[valueKey] === "__all__") {
			if (selectedValues.length === menuList.length) {
				// Unselect all
				formik.setFieldValue(field, []);

				if (getSelectObject) {
					getSelectObject([]);
				}
				if (typeof callBackAction === "function") callBackAction([]);
			} else {
				// Select all
				const allValues = menuList.map((item) => item[valueKey]);
				if (getSelectObject) {
					getSelectObject(menuList);
				}
				formik.setFieldValue(field, allValues);
				if (typeof callBackAction === "function") callBackAction(allValues);
			}
			return;
		}

		// Normal selection
		const selected = value.map((item) => item[valueKey]);

		if (getSelectObject) {
			getSelectObject(value);
		}

		formik.setFieldValue(field, selected);
		if (typeof callBackAction === "function") callBackAction(selected);
	};

	return (
		<Autocomplete
			disableCloseOnSelect
			multiple
			fullWidth
			id={field}
			name={field}
			options={options}
			getOptionLabel={(option) => option?.[labelKey] || " "}
			value={menuList.filter((option) => formik.values[field]?.includes(option[valueKey])) || []}
			onChange={handleChange}
			renderTags={(selected, getTagProps) =>
				selected.map((option, index) => (
					<Chip
						color="primary"
						key={option[valueKey]}
						label={option[labelKey]}
						{...getTagProps({index})}
						size="small"
						sx={{
							borderRadius: 1.8,
							padding: "0px 4px",
							fontWeight: 600,
						}}
					/>
				))
			}
			renderInput={(params) => (
				<TextField
					{...params}
					placeholder={placeholder}
					label={label}
					required={required}
					onBlur={formik.handleBlur}
					error={formik.touched[field] && Boolean(formik.errors[field])}
					helperText={formik.touched[field] && formik.errors[field] ? formik.errors[field] : ""}
					InputProps={{
						...params.InputProps,
						endAdornment: (
							<>
								{params.InputProps.endAdornment}
								{unitType && <InputAdornment position="end">{unitType}</InputAdornment>}
							</>
						),
					}}
				/>
			)}
			renderOption={(e, option, {selected}) => {
				const isSelectAll = option[valueKey] === "__all__";
				const allSelected = selectedValues.length === menuList.length;
				return (
					<li {...e}>
						<Checkbox
							size="small"
							color="info"
							checked={isSelectAll ? allSelected : selected}
							indeterminate={isSelectAll && selectedValues.length > 0 && selectedValues.length < menuList.length}
							sx={{
								mr: 1,
								"&.Mui-checked": {
									color: "info.main",
									padding: "0px",
								},
								"&.MuiCheckbox-indeterminate": {
									color: "info.main",
									padding: "0px",
								},
								"&.MuiCheckbox-root": {
									color: "info.main",
									padding: "0px",
								},
							}}
						/>
						{option[labelKey]}
					</li>
				);
			}}
			sx={{
				"& .MuiInputLabel-asterisk": {
					color: "red",
					fontSize: 14,
				},
			}}
			componentsProps={{
				popper: {
					sx: {
						"& .MuiAutocomplete-paper": {
							boxShadow: shadows()[10],
						},
					},
				},
			}}
			noOptionsText={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Not Data Found!" />}
			disableClearable={false} // Allow clearing selection
			{...props}
		/>
	);
};

AutoCompleteSelectMultiple.propTypes = {
	formik: PropTypes.object,
	label: PropTypes.string,
	field: PropTypes.string,
	menuList: PropTypes.array,
	valueKey: PropTypes.string,
	labelKey: PropTypes.string,
	required: PropTypes.bool,
	unitType: PropTypes.string,
	callBackAction: PropTypes.func,
};
