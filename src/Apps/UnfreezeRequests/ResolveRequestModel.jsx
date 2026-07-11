import React from "react";
import { Stack, Box, Button } from "@mui/material";
import { TextFieldForm } from "src/components/common/inputs/TextFieldForm";
import { AutoCompleteSelectMenu } from "src/components/common/inputs/AutoCompleteSelectMenu";
import { useDispatch } from "react-redux";
import { PostAdminResolveUnfreezeRequestServices } from "src/services/Users.Services";
import { sweetAlerts, sweetAlertSuccess } from "src/utils/sweet-alerts";
import { CustomDialogModel } from "src/components/common/CustomDialogModel";

import * as Yup from "yup";
import { Form, Formik } from "formik";
import { getErrorMessage } from "src/utils/utils";

const STATUS_OPTIONS = [
  { id: "approved", label: "Approve" },
  { id: "rejected", label: "Reject" },
];

export default function ResolveRequestModel({
  open,
  onClose,
  request,
  cdSuccess,
}) {
  const dispatch = useDispatch();

  const handleSubmit = (values, formik) => {
    dispatch(
      PostAdminResolveUnfreezeRequestServices(
        request?.id,
        {
          status: values.status,
          admin_comment: values.admin_comment,
        },
        (res) => {
          formik?.setSubmitting(false);
          if (res?.success) {
            sweetAlertSuccess("Request Resolved Successfully");
            formik?.resetForm();
            if (cdSuccess) cdSuccess();
            onClose();
          } else {
            const error = getErrorMessage(res);
            sweetAlerts("error", error || "Failed to resolve request");
          }
        },
      ),
    );
  };

  return (
    <CustomDialogModel
      maxWidth={500}
      minWidth={500}
      open={open}
      handleClose={onClose}
      title={`Resolve Unfreeze Request - ${request?.name || request?.user?.name || "User"}`}
      child={
        <Box>
          <Formik
            enableReinitialize
            initialValues={{
              status: "approved",
              admin_comment: "",
            }}
            validationSchema={Yup.object().shape({
              status: Yup.string()
                .oneOf(["approved", "rejected"])
                .required("Status is required"),
              admin_comment: Yup.string().nullable(),
            })}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form autoComplete="off" noValidate>
                <Stack spacing={3} sx={{ mt: 2 }}>
                  <AutoCompleteSelectMenu
                    formik={props}
                    label="Resolution"
                    field="status"
                    menuList={STATUS_OPTIONS}
                    valueKey="id"
                    labelKey="label"
                  />
                  <TextFieldForm
                    formik={props}
                    field="admin_comment"
                    label="Admin Comment (Optional)"
                    multiline
                    rows={3}
                    placeholder="Add notes or specify reason for approval / rejection..."
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}
                  >
                    <Button onClick={onClose} color="inherit" sx={{ mr: 2 }}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={props.isSubmitting}
                    >
                      {props.isSubmitting ? "Submitting..." : "Submit Decision"}
                    </Button>
                  </Box>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      }
    />
  );
}
