import React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { ErrorMessage } from "formik";

export function OTPFieldForm({ formik, field, length = 6, disabled }) {
  const value = (formik.values[field] || "").padEnd(length, "");

  const handleChange = (e, index) => {
    const input = e.target.value;

    if (!/^\d?$/.test(input)) return;

    const otp = value.split("");
    otp[index] = input;

    formik.setFieldValue(field, otp.join(""));

    // move next
    if (input && index < length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // ✅ Copy / Paste support
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pastedData) return;

    formik.setFieldValue(field, pastedData);

    // focus last filled input
    document.getElementById(`otp-${pastedData.length - 1}`)?.focus();
  };

  return (
    <>
      <Box display="flex" gap={1}>
        {Array.from({ length }).map((_, index) => (
          <TextField
            key={index}
            id={`otp-${index}`}
            value={value[index] || ""}
            disabled={disabled}
            error={Boolean(formik?.errors[field] && formik?.touched[field])}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: "center",
                fontSize: "1.2rem",
                fontWeight: 700,
              },
            }}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
          />
        ))}
      </Box>

      <ErrorMessage name={field}>
        {(msg) => <FormHelperText error>{msg}</FormHelperText>}
      </ErrorMessage>
    </>
  );
}

OTPFieldForm.propTypes = {
  formik: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  length: PropTypes.number,
  disabled: PropTypes.bool,
};
