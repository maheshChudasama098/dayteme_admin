import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Grid,
  Typography,
  FormHelperText,
} from "@mui/material";
import { ErrorMessage } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { styled } from "@mui/material/styles";

const UploadBox = styled(Box)(({ theme }) => ({
  border: `1px dashed ${theme.palette.info.main}`,
  borderRadius: theme.shape.borderRadius,
  height: 140,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "0.3s",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

export function MultiImagePicker({
  formik,
  field,
  label = "Upload Images",
  imageReturn,
  maxImages = 5,
  removeAction,
}) {
  const fileInputRef = useRef(null);
  const [previewImages, setPreviewImages] = useState([]);
  const previousImagesRef = useRef([]);

  const processFiles = (files) => {
    const imageFiles = files.filter(
      (file) => file && file.type && file.type.startsWith("image/"),
    );
    if (imageFiles.length === 0) return;

    const newImages = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isFile: true,
    }));

    const updatedImages = [...previewImages, ...newImages].slice(0, maxImages);
    setPreviewImages(updatedImages);

    // Return array with both files and URLs
    const updatedValues = updatedImages.map((img) =>
      img.isFile ? img.file : img.preview,
    );
    if (imageReturn) imageReturn(updatedValues);
    formik.setFieldValue(field, updatedValues);
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files || []);
    processFiles(files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer?.files || []);
    processFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleRemoveImage = (index) => {
    // Clean up object URL if it's a file
    const imageToRemove = previewImages[index];
    if (imageToRemove?.isFile && imageToRemove?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    if (removeAction) {
      removeAction(imageToRemove?.preview);
    }

    const updatedImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedImages);

    // Return array with both files and URLs
    const updatedValues = updatedImages.map((img) =>
      img.isFile ? img.file : img.preview,
    );

    // ✅ call external custom remove handler if passed

    formik.setFieldValue(
      field,
      updatedValues.length > 0 ? updatedValues : null,
    );
    if (imageReturn)
      imageReturn(updatedValues.length > 0 ? updatedValues : null);
  };

  useEffect(() => {
    // Cleanup previous object URLs
    previousImagesRef.current.forEach((img) => {
      if (img?.isFile && img?.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(img.preview);
      }
    });

    if (formik.values[field] && formik.values[field].length > 0) {
      const formatted = formik.values[field]
        .map((item) => {
          if (typeof item === "string") {
            return { file: null, preview: item, isFile: false };
          }
          if (item instanceof File) {
            return {
              file: item,
              preview: URL.createObjectURL(item),
              isFile: true,
            };
          }
          return null;
        })
        .filter(Boolean);
      previousImagesRef.current = formatted;
      setPreviewImages(formatted);
    } else {
      previousImagesRef.current = [];
      setPreviewImages([]);
    }
  }, [formik.values[field]]);

  return (
    <Box sx={{ textAlign: "center" }}>
      <input
        type="file"
        ref={fileInputRef}
        id={field}
        name={field}
        accept="image/png, image/jpeg, image/jpg"
        multiple
        style={{ display: "none" }}
        onChange={handleImageSelect}
      />

      {/* Upload Button */}
      {previewImages.length < maxImages && (
        <UploadBox
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              {label}
            </Typography>

            <AddPhotoAlternateIcon fontSize="large" color="action" />
            <Typography variant="body2" color="text.secondary">
              Click or drag & drop to upload ({previewImages.length}/{maxImages}
              )
            </Typography>
          </Box>
        </UploadBox>
      )}

      {/* Preview Section */}
      <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
        {previewImages.map((image, index) => (
          <Grid key={index}>
            <Box
              sx={{
                position: "relative",
                width: 120,
                height: 120,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #e0e0e0",
              }}
            >
              <img
                src={image.preview}
                alt={`preview-${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemoveImage(index)}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.7)",
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Formik Error Message */}
      <ErrorMessage name={field}>
        {(msg) => (
          <FormHelperText style={{ textAlign: "center" }} error>
            {msg}
          </FormHelperText>
        )}
      </ErrorMessage>
    </Box>
  );
}

MultiImagePicker.propTypes = {
  formik: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  label: PropTypes.string,
  imageReturn: PropTypes.func,
  maxImages: PropTypes.number,
  removeAction: PropTypes.func,
};
