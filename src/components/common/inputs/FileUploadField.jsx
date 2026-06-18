import PropTypes from "prop-types";
import React, { useRef, useState, useEffect } from "react";

import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";

import { ErrorMessage } from "formik";

const UploadBox = styled("label")(({ theme }) => ({
  border: "1px dashed #ccc",
  borderRadius: "4px",
  padding: "4px 10px",
  cursor: "pointer",
  backgroundColor: "#FFFF",
  fontSize: "12px",
  "&:hover": {
    backgroundColor: "#f1f3f5",
  },
}));

export function FileUploadField({ formik, field, label, required, isCamera }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [hasCameraAccess, setHasCameraAccess] = useState(true);

  const handleChange = (event) => {
    const file = event.currentTarget.files[0];
    setCapturedImage(null);

    formik.setFieldValue(field, file);
  };

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setHasCameraAccess(false);
      console.error("Camera access error:", err);
    }
  };

  const handleClosePreview = () => {
    setCapturedImage(null);
  };
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 300, 225);
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "captured-photo.jpg", {
          type: "image/jpeg",
        });
        formik.setFieldValue(field, file);
        stopCamera();
        setCameraOpen(false);
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
      }
    }, "image/jpeg");
  };

  useEffect(() => {
    if (cameraOpen) {
      initCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [cameraOpen]);

  return (
    <Box>
      <Typography
        sx={{
          fontSize: 13,
          padding: "0px",
          marginBottom: "0px",
          color:
            formik.touched[field] && Boolean(formik.errors[field])
              ? (theme) => theme.palette.error.main
              : (theme) => theme.palette.grey[1000],
        }}
      >
        {label}
        {required && <span style={{ color: "red" }}> *</span>}
      </Typography>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.grey[200],
          borderRadius: "5px",
          padding: "8px",
          // display: 'flex',
          alignItems: "center",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <UploadBox htmlFor={field}>
            <input
              id={field}
              name={field}
              type="file"
              onChange={handleChange}
              onBlur={formik.handleBlur}
              style={{ display: "none" }}
            />
            + Click To Upload
          </UploadBox>

          {isCamera && (
            <>
              <Typography variant="body2" fontSize={12} mt={1}>
                {" "}
                Or{" "}
              </Typography>
              <UploadBox onClick={() => setCameraOpen(!cameraOpen)}>
                {" "}
                <i className="fa-solid fa-camera" /> Take Picture
              </UploadBox>
            </>
          )}
        </Stack>
        {formik.values[field] && (
          <Typography
            variant="body2"
            fontSize={12}
            mt={1}
            sx={{
              maxWidth: "200px", // or any suitable width
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {formik.values[field].name}
          </Typography>
        )}
        {/* {formik.values[field] instanceof File && (
          <Box
            mt={1}
            sx={{
              maxWidth: 100,
              maxHeight: 100,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            {URL.createObjectURL(formik.values[field]) && (
              <img
                src={URL.createObjectURL(formik.values[field])}
                alt="Uploaded Preview"
                style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }}
              />
            )}
          </Box>
        )} */}
      </Box>

      <ErrorMessage name={field}>
        {(msg) => (
          <FormHelperText style={{ textAlign: "left", paddingLeft: 15 }} error>
            {msg}
          </FormHelperText>
        )}
      </ErrorMessage>

      {cameraOpen && (
        <Dialog
          open
          sx={{ "& .MuiPaper-root": { borderRadius: 3 } }}
          onClose={() => setCameraOpen(false)}
        >
          {" "}
          <Card
            sx={{
              width: 450,
              display: "flex",
              flexDirection: "column",
              borderRadius: 0,
              p: 3,
              boxShadow: (theme) => theme.customShadows.z20,
              backgroundColor: (theme) => theme.palette.background.default,
              border: (theme) => `4px solid ${theme.palette.primary?.main}`,
            }}
          >
            <Typography variant="h6" mb={1}>
              Capture Image
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: 280,
                backgroundColor: "#000",
                borderRadius: 2,
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
              }}
            >
              {hasCameraAccess ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: "100%" }}
                />
              ) : (
                <Typography color="error">Camera access denied</Typography>
              )}
            </Box>
            <canvas
              ref={canvasRef}
              width={300}
              height={225}
              style={{ display: "none" }}
            />
            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setCameraOpen(false)}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={capturePhoto}
                disabled={!hasCameraAccess}
              >
                Take picture
              </Button>
            </Stack>
          </Card>
        </Dialog>
      )}
      <Dialog open={Boolean(capturedImage)} onClose={handleClosePreview}>
        <Card
          sx={{
            width: 450,
            display: "flex",
            flexDirection: "column",
            borderRadius: 0,
            p: 3,
            boxShadow: (theme) => theme.customShadows.z20,
            backgroundColor: (theme) => theme.palette.background.default,
            border: (theme) => `4px solid ${theme.palette.primary?.main}`,
          }}
        >
          <Typography variant="h6" mb={1}>
            Review picture
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: 280,
              backgroundColor: "#000",
              borderRadius: 2,
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <img
              src={capturedImage}
              alt="Captured"
              style={{ width: "100%", borderRadius: 8 }}
            />
          </Box>

          <Stack direction="row" spacing={2} mt={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setCapturedImage(null);
                setCameraOpen(true);
              }}
            >
              Retake
            </Button>
            <Button fullWidth variant="contained" onClick={handleClosePreview}>
              Done
            </Button>
          </Stack>
        </Card>
      </Dialog>
    </Box>
  );
}

FileUploadField.propTypes = {
  formik: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
