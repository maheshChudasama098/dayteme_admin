import React, { useRef } from "react";
import JoditEditor from "jodit-react";
import PropTypes from "prop-types";

import { getIn } from "formik";
import { Box, FormHelperText, Typography } from "@mui/material";

export function EditorForm({ formik, field, label, config, ...props }) {
  const editor = useRef(null);

  const value = getIn(formik?.values, field);
  const error = getIn(formik?.errors, field);
  const touched = getIn(formik?.touched, field);

  // const defaultConfig = useMemo(
  //   () => ({
  //     readonly: false, // all options from https://xdsoft.net/jodit/docs/,
  //     placeholder: props.placeholder || 'Start typing...',
  //     height: 300,
  //     toolbarButtonSize: 'middle',
  //     // buttons: [
  //     //   'source',
  //     //   '|',
  //     //   'bold',
  //     //   'italic',
  //     //   'underline',
  //     //   'strikethrough',
  //     //   '|',
  //     //   'ul',
  //     //   'ol',
  //     //   '|',
  //     //   'font',
  //     //   'fontsize',
  //     //   'brush',
  //     //   'paragraph',
  //     //   '|',
  //     //   'image',
  //     //   'table',
  //     //   'link',
  //     //   '|',
  //     //   'align',
  //     //   'undo',
  //     //   'redo',
  //     //   '|',
  //     //   'hr',
  //     //   'eraser',
  //     //   'fullsize',
  //     // ],
  //     ...config,
  //   }),
  //   [config, props.placeholder]
  // );

  return (
    <Box>
      {label && (
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1,
            color: touched && error ? "error.main" : "text.secondary",
            fontWeight: 600,
          }}
        >
          {label} {props.required && <span style={{ color: "red" }}>*</span>}
        </Typography>
      )}
      <Box
        sx={{
          "& .jodit-container": {
            borderRadius: "8px !important",
            border:
              touched && error
                ? "1px solid #d32f2f !important"
                : "1px solid #ccc !important",
          },
          "& .jodit-status-bar": {
            display: "none !important",
          },
        }}
      >
        <JoditEditor
          ref={editor}
          value={value || ""}
          // config={defaultConfig}
          // tabIndex={1} // tabIndex of textarea
          onBlur={(newContent) => formik.setFieldValue(field, newContent)} // preferred for performance
          // onChange={(newContent) => {}}
        />
      </Box>
      {Boolean(touched && error) && (
        <FormHelperText error sx={{ ml: 1 }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
}

EditorForm.propTypes = {
  formik: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  label: PropTypes.string,
  config: PropTypes.object,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};
