import React, {useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";

import {Autocomplete, Box, CircularProgress, FormLabel, TextField} from "@mui/material";

import {Empty} from "antd";

import {shadows} from "../../../theme/shadows";

// ----------------------------------------------------------------------

export const AutoCompleteSearchMenu = ({
	formik,
	label,
	field,
	valueKey = "id",
	labelKey = "name",
	required = false,
	// API FUNCTION
	apiCall,
	// EXTRA PARAMS
	apiPayload = {},
	// CALLBACK
	callBackAction,
	// MIN SEARCH LENGTH
	minSearchLength = 2,
	placeholder = "",
	...props
}) => {
	const [options, setOptions] = useState([]);
	const [loading, setLoading] = useState(false);

	const [search, setSearch] = useState("");
	const [inputValue, setInputValue] = useState("");

	// ------------------------------------------------------------------

	const selectedValue = useMemo(() => {
		return options.find((item) => item?.[valueKey] === formik.values[field]) || null;
	}, [formik.values[field], options, valueKey]);

	// ------------------------------------------------------------------

	const fetchOptions = async (searchText = "") => {
		try {
			setLoading(true);

			const response = await apiCall({
				search: searchText,
				...apiPayload,
			});
			setOptions(Array.isArray(response) ? response : []);
		} catch (error) {
			console.error("Autocomplete API Error:", error);
			setOptions([]);
		} finally {
			setLoading(false);
		}
	};

	// ------------------------------------------------------------------

	useEffect(() => {
		if (search?.length >= minSearchLength) {
			fetchOptions(search);
		} else {
			setOptions([]);
		}
	}, [search]);

	// ------------------------------------------------------------------
	const handleChange = (event, value) => {
		const selectedId = value?.[valueKey] || "";

		formik.setFieldValue(field, selectedId);

		// selected label show karva mate
		setInputValue(value?.[labelKey] || "");

		if (typeof callBackAction === "function") {
			callBackAction(value);
		}
	};

	// ------------------------------------------------------------------

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 0.5,
			}}>
			{/* LABEL */}

			<FormLabel
				sx={{
					fontWeight: 500,
					color: formik.touched[field] && Boolean(formik.errors[field]) ? "error.main" : "grey.700",
				}}>
				{label}

				{required && (
					<Box
						component="span"
						sx={{
							color: "error.main",
							ml: 0.5,
						}}>
						*
					</Box>
				)}
			</FormLabel>

			{/* AUTOCOMPLETE */}

			<Autocomplete
				fullWidth
				options={options}
				loading={loading}
				value={selectedValue}
				filterOptions={(x) => x}
				getOptionLabel={(option) => option?.[labelKey] || ""}
				isOptionEqualToValue={(option, value) => option?.[valueKey] === value?.[valueKey]}
				onChange={handleChange}
				onInputChange={(event, newInputValue, reason) => {
					setInputValue(newInputValue);

					// only search when user typing
					if (reason === "input") {
						setSearch(newInputValue);
					}

					// clear selected value when typing again
					if (reason === "input" && selectedValue) {
						formik.setFieldValue(field, "");
					}
				}}
				noOptionsText={
					search?.length < minSearchLength ? (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`Type at least ${minSearchLength} characters to search...`} />
					) : (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data Found!" />
					)
				}
				renderInput={(params) => (
					<TextField
						placeholder
						{...params}
						name={field}
						onBlur={formik.handleBlur}
						error={formik.touched[field] && Boolean(formik.errors[field])}
						helperText={formik.touched[field] && formik.errors[field] ? formik.errors[field] : ""}
						inputProps={{
							...params.inputProps,
							placeholder: placeholder,
						}}
						InputProps={{
							...params.InputProps,
							endAdornment: (
								<>
									{loading ? <CircularProgress size={18} /> : null}
									{params.InputProps.endAdornment}
								</>
							),
						}}
					/>
				)}
				slotProps={{
					popper: {
						sx: {
							"& .MuiAutocomplete-paper": {
								boxShadow: shadows()[15],
							},
						},
					},
				}}
				disableClearable={required}
				{...props}
			/>
		</Box>
	);
};

// ----------------------------------------------------------------------

AutoCompleteSearchMenu.propTypes = {
	formik: PropTypes.object.isRequired,

	label: PropTypes.string,

	field: PropTypes.string.isRequired,

	valueKey: PropTypes.string,

	labelKey: PropTypes.string,

	required: PropTypes.bool,

	apiCall: PropTypes.func.isRequired,

	apiPayload: PropTypes.object,

	callBackAction: PropTypes.func,

	minSearchLength: PropTypes.number,
};
