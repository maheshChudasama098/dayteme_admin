// import React from 'react';
// import PropTypes from 'prop-types';
// import { Box, Grid, Typography } from '@mui/material';
// import { fTruncateWords } from 'src/utils/format-text';

// export const ImageSelectMultiple = ({
//   formik,
//   field,
//   menuList,
//   valueKey = 'value',
//   labelKey = 'label',
//   imageKey = 'image',
//   maxSelect = null,
//   onChange,
// }) => {
//   const selectedValues = formik.values[field] || [];

//   const handleSelect = (value) => {
//     let updated;
//     if (selectedValues.includes(value)) {
//       updated = selectedValues.filter((v) => v !== value);
//     } else {
//       if (maxSelect && selectedValues.length >= maxSelect) return;
//       updated = [...selectedValues, value];
//     }

//     formik.setFieldValue(field, updated);
//     if (onChange) onChange(updated);
//   };

//   return (
//     <Grid container spacing={2}>
//       {menuList?.map((item) => {
//         const isSelected = selectedValues.includes(item[valueKey]);
//         return (
//           <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item[valueKey]}>
//             <Box
//               onClick={() => handleSelect(item[valueKey])}
//               sx={{
//                 cursor: 'pointer',
//                 borderRadius: 1,
//                 px: 2,
//                 py: 1,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 textAlign: 'center',
//                 border: isSelected ? '2px solid #7b001c' : '1px solid #ddd',
//                 backgroundColor: isSelected ? '#7b001c' : '#fff',
//                 color: isSelected ? '#fff' : 'text.primary',
//                 transition: 'all 0.3s ease',
//                 boxShadow: isSelected ? '0 4px 8px rgba(123, 0, 28, 0.3)' : 'none',
//                 '&:hover': {
//                   borderColor: '#7b001c',
//                   backgroundColor: isSelected ? '#7b001c' : '#fafafa',
//                 },
//               }}
//             >
//               <Box
//                 sx={{
//                   width: 36,
//                 }}
//               />
//               <Typography variant="body2" fontSize={12} fontWeight={600}>
//                 {fTruncateWords(item[labelKey], 20)}
//               </Typography>
//             </Box>
//           </Grid>
//         );
//       })}
//     </Grid>
//   );
// };

// ImageSelectMultiple.propTypes = {
//   formik: PropTypes.object.isRequired,
//   field: PropTypes.string.isRequired,
//   menuList: PropTypes.array.isRequired,
//   valueKey: PropTypes.string,
//   labelKey: PropTypes.string,
//   imageKey: PropTypes.string,
//   maxSelect: PropTypes.number,
//   onChange: PropTypes.func,
// };

import React from "react";
import PropTypes from "prop-types";
import { Box, FormHelperText, Grid, Typography } from "@mui/material";
import { ErrorMessage } from "formik";

export const ImageSelectMultiple = ({
  formik,
  field,
  menuList,
  valueKey = "value",
  labelKey = "label",
  imageKey = "image",
  maxSelect = null,
  onChange,
  readOnly = false,
}) => {
  const selectedValues = formik.values[field] || [];

  const handleSelect = (value) => {
    if (readOnly) return;
    let updated;
    if (selectedValues.includes(value)) {
      updated = selectedValues.filter((v) => v !== value);
    } else {
      if (maxSelect && selectedValues.length >= maxSelect) return;
      updated = [...selectedValues, value];
    }

    formik.setFieldValue(field, updated);
    if (onChange) onChange(updated);
  };

  return (
    <>
      <Grid container spacing={2}>
        {menuList?.map((item) => {
          const isSelected = selectedValues.includes(item[valueKey]);
          return (
            <Box
              key={item[valueKey]}
              onClick={() => handleSelect(item[valueKey])}
              sx={{
                cursor: "pointer",
                borderRadius: 1,
                px: 2,
                py: 1,
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                border: isSelected ? "2px solid #7b001c" : "1px solid #ddd",
                backgroundColor: isSelected ? "#7b001c" : "#fff",
                color: isSelected ? "#fff" : "text.primary",
                transition: "all 0.3s ease",
                boxShadow: isSelected
                  ? "0 4px 8px rgba(123, 0, 28, 0.3)"
                  : "none",
                "&:hover": {
                  borderColor: "#7b001c",
                  backgroundColor: isSelected ? "#7b001c" : "#fafafa",
                },
              }}
            >
              <Typography variant="body2" fontSize={12} fontWeight={600}>
                {item[labelKey]}
              </Typography>
            </Box>
          );
        })}
      </Grid>
      <ErrorMessage name={field}>
        {(msg) => <FormHelperText error>{msg}</FormHelperText>}
      </ErrorMessage>
    </>
  );
};

ImageSelectMultiple.propTypes = {
  formik: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  menuList: PropTypes.array.isRequired,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  imageKey: PropTypes.string,
  maxSelect: PropTypes.number,
  onChange: PropTypes.func,
};
