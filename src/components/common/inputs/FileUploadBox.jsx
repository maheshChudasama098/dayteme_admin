import { useRef, useState, useEffect } from "react";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { Button as AntdButton } from "antd";

const PlusIcon = () => (
  <svg
    width="11"
    height="12"
    viewBox="0 0 11 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.5769 5.57692H5.9232V0.923077C5.9232 0.81087 5.87863 0.703259 5.79929 0.623916C5.71995 0.544574 5.61234 0.5 5.50014 0.5C5.38793 0.5 5.28033 0.544574 5.20099 0.623916C5.12164 0.703259 5.07707 0.81087 5.07707 0.923077V5.57692H0.423343C0.311139 5.57692 0.203531 5.6215 0.124191 5.70084C0.0448502 5.78018 0.000277228 5.88779 0.000277228 6C-0.00181045 6.05499 0.00791222 6.10978 0.0287899 6.16069C0.0496675 6.2116 0.081215 6.25744 0.121307 6.29513C0.161398 6.33282 0.209102 6.36147 0.261204 6.37916C0.313305 6.39686 0.368594 6.40317 0.423343 6.39769H5.07707V11.0769C5.07707 11.1891 5.12164 11.2967 5.20099 11.3761C5.28033 11.4554 5.38793 11.5 5.50014 11.5C5.61234 11.5 5.71995 11.4554 5.79929 11.3761C5.87863 11.2967 5.9232 11.1891 5.9232 11.0769V6.42308H10.5769C10.6891 6.42308 10.7967 6.3785 10.8761 6.29916C10.9554 6.21982 11 6.11221 11 6C11 5.88779 10.9554 5.78018 10.8761 5.70084C10.7967 5.6215 10.6891 5.57692 10.5769 5.57692Z"
      fill="black"
    />
  </svg>
);

const FileUploadBox = ({
  title,
  defaultImg,
  disable,
  bcAction,
  field,
  formik,
}) => {
  const [fileUrl, setFileUrl] = useState(defaultImg || null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      const preview = URL.createObjectURL(file);

      setFileUrl(preview);

      // ✅ Formik integration (IMPORTANT)
      if (formik && field) {
        formik.setFieldValue(field, file);
      }

      // optional external callback
      if (bcAction) bcAction(file);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleView = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = "uploaded-file";
      a.click();
    }
  };

  useEffect(() => {
    setFileUrl(defaultImg || null);
  }, [defaultImg]);

  return (
    <Grid item xs={12}>
      <Typography variant="body2">{title}</Typography>

      <Stack
        sx={{
          border: (theme) => `1px dashed ${theme.palette.grey[500]}`,
          borderRadius: 1,
          p: 1,
        }}
        direction="row"
        alignItems="center"
        spacing={0.5}
      >
        {fileUrl ? (
          <>
            <img
              src={fileUrl}
              width="100px"
              height="80px"
              alt="uploaded"
              style={{
                border: "3px solid #fff",
                borderRadius: 5,
                objectFit: "contain",
              }}
            />

            {!disable && (
              <AntdButton
                icon={<i className="fa-solid fa-pen fa-xs" />}
                size="small"
                onClick={handleEditClick}
              />
            )}

            <AntdButton
              icon={<i className="fa-regular fa-eye fa-xs" />}
              size="small"
              onClick={handleView}
            />

            <AntdButton
              icon={<i className="fa-solid fa-download fa-xs" />}
              size="small"
              onClick={handleDownload}
            />
          </>
        ) : (
          <>
            {!disable && (
              <Button startIcon={<PlusIcon />} onClick={handleEditClick}>
                Click to Upload File
              </Button>
            )}

            {disable && <Typography variant="body2">No document</Typography>}
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Stack>
      {formik?.touched?.[field] && formik?.errors?.[field] && (
        <Typography color="error" variant="caption">
          {formik.errors[field]}
        </Typography>
      )}
    </Grid>
  );
};

export default FileUploadBox;
