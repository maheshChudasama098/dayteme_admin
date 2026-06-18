import React from "react";
import PropTypes from "prop-types";

import TextField from "@mui/material/TextField";
// import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { InputAdornment } from "@mui/material";

import { getIn } from "formik"; // ✅ import this

export function TextFieldForm({
  formik,
  field,
  label,
  type = "text",
  isAmount = false, // show ₹ icon
  isRight = false,
  ...props
}) {
  const value = getIn(formik?.values, field);
  const error = getIn(formik?.errors, field);
  const touched = getIn(formik?.touched, field);

  return (
    <TextField
      required
      fullWidth
      id={label}
      label={label}
      InputLabelProps={{
        shrink: true,
      }}
      name={field}
      value={value || ""}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={Boolean(touched && error)}
      helperText={Boolean(error) && touched ? error : ""}
      type={type}
      onFocus={(e) => {
        if (type === "date" || type === "datetime-local") {
          e.target.showPicker?.();
        }
      }}
      sx={{
        "& .MuiInputLabel-asterisk": {
          color: "red",
          fontSize: 14,
        },
        "& input": {
          textAlign: isAmount || isRight ? "right" : "left",
        },
        "& .MuiInputBase-multiline": {
          p: 0,
          m: 0,
        },
      }}
      // InputProps={{
      // 	startAdornment: isAmount && (
      // 		<InputAdornment position="start">
      // 			<CurrencyRupeeIcon fontSize="small" />
      // 		</InputAdornment>
      // 	),
      // }}
      {...props}
    />
  );
}

TextFieldForm.propTypes = {
  formik: PropTypes.object,
  field: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  isAmount: PropTypes.bool,
};
