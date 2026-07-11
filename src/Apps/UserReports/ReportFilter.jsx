import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CustomDrawer from "src/components/common/CustomDrawer";
import { AutoCompleteSelectMenu } from "src/components/common/inputs";
import { GetAdminUsersListServices } from "src/services/Users.Services";
import { GetAdminReportTypesServices } from "src/services/Reports.Services";
import { useFormik } from "formik";

export default function ReportFilter({
  open,
  onClose,
  filters,
  setFilters,
  onApply,
}) {
  const dispatch = useDispatch();
  const [usersList, setUsersList] = useState([]);
  const [reportTypesList, setReportTypesList] = useState([]);

  useEffect(() => {
    if (open) {
      dispatch(
        GetAdminUsersListServices({ per_page: 500, page: 1 }, (res) => {
          if (res?.success) {
            const rawUsers = res?.data?.users || [];
            const formattedUsers = rawUsers.map((user) => ({
              ...user,
              id: user?.id,
              name: user?.name || user?.email || `User #${user?.id}`,
            }));
            setUsersList(formattedUsers);
          }
        }),
      );
      dispatch(
        GetAdminReportTypesServices((res) => {
          if (res?.success) {
            const rawTypes =
              res?.data?.report_types ||
              res?.data?.reportTypes ||
              res?.data ||
              [];
            const formattedTypes = rawTypes.map((item) => {
              if (typeof item === "string") {
                return { id: item, name: item };
              }
              return {
                ...item,
                id: item?.id ?? item?.value,
                name: item?.name ?? item?.title ?? item?.label ?? "",
              };
            });
            setReportTypesList(formattedTypes);
          }
        }),
      );
    }
  }, [open, dispatch]);

  const formik = useFormik({
    initialValues: {
      reporter_user_id:
        filters.reporter_user_id !== "" ? Number(filters.reporter_user_id) : "",
      reported_user_id:
        filters.reported_user_id !== "" ? Number(filters.reported_user_id) : "",
      report_type_id:
        filters.report_type_id !== "" ? Number(filters.report_type_id) : "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      setFilters(values);
      if (onApply) onApply(values);
      onClose();
    },
  });

  const handleClear = () => {
    const emptyFilters = {
      reporter_user_id: "",
      reported_user_id: "",
      report_type_id: "",
    };
    formik.resetForm({ values: emptyFilters });
    setFilters(emptyFilters);
    if (onApply) onApply(emptyFilters);
    onClose();
  };

  return (
    <CustomDrawer
      open={open}
      onClose={onClose}
      title="Filter Reports"
      width={460}
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <Stack spacing={3}>
          <AutoCompleteSelectMenu
            formik={formik}
            label="Reporter User"
            field="reporter_user_id"
            placeholder="Select Reporter User"
            menuList={usersList}
            valueKey="id"
            labelKey="name"
            required={false}
          />

          <AutoCompleteSelectMenu
            formik={formik}
            label="Reported User"
            field="reported_user_id"
            placeholder="Select Reported User"
            menuList={usersList}
            valueKey="id"
            labelKey="name"
            required={false}
          />

          <AutoCompleteSelectMenu
            formik={formik}
            label="Report Type"
            field="report_type_id"
            placeholder="Select Report Type"
            menuList={reportTypesList}
            valueKey="id"
            labelKey="name"
            required={false}
          />

          <Box sx={{ flexGrow: 1 }} />

          <Stack
            direction="row"
            spacing={2}
            sx={{
              pt: 2,
              mt: 4,
              borderTop: "1px dashed",
              borderColor: "divider",
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Apply Filters
            </Button>
          </Stack>
        </Stack>
      </form>
    </CustomDrawer>
  );
}
