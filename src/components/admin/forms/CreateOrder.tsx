import { useFormik, FormikHelpers } from "formik";
import * as yup from "yup";
import * as React from "react";
import getConfig from "next/config";
import { useRouter } from "next/router";

import { Box, Grid, Button, TextField } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import MuiAlert, { AlertProps, AlertColor } from "@mui/material/Alert";

const { publicRuntimeConfig } = getConfig();

interface Values {
  org_code: string;
  valid_days: string;
  total_licence: string;
  purchased_by: string;
  order_name: string;
}

const validationSchema = yup.object({
  org_code: yup.number(),
  order_name: yup.string().required("Order Name"),
  valid_days: yup.string().required("Valid days are required"),
  total_licence: yup.number().required("Enter total no of licenses"),
  purchased_by: yup.string(),
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CreateOrderForm() {
  const router = useRouter();
  const { orgid } = router.query || {};

  const purchased_by = 1;
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState("success");
  const [message, setMessage] = React.useState("");

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const formik = useFormik({
    initialValues: {
      org_code: "",
      valid_days: "",
      order_name: "",
      total_licence: "",
      purchased_by: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
      setTimeout(() => {
        fetch(
          `${publicRuntimeConfig.backendApi}/licence/order?org_code=${orgid}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("edat_token"),
            },
            body: JSON.stringify({
              org_code: Number(orgid),
              order_name: values["order_name"],
              valid_days: Number(values["valid_days"]),
              total_licence: Number(values["total_licence"]),
              purchased_by: purchased_by,
            }),
          }
        )
          .catch((err) => {
            console.log("Error message");
            console.log(err);
          })
          .then(async (res: any) => {
            console.log("response");
            if (res.status == 401) {
              // redirect to login
              router.push("/");
            }

            let responseData: any = await res.json();
            if (res.status == 200 || res.status == 201) {
              setMessage("Order added successfully");
              setSeverity("success");
              setTimeout(function () {
                router.push("/admin/org/" + orgid + "/orders");
              }, 500);
              setOpen(true);
            } else {
              setMessage(responseData["errors"]["message"]);
              setSeverity("error");
              setOpen(true);
            }
          });
        setSubmitting(false);
      }, 500);
    },
  });
  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Grid container padding={5} spacing={3} flexDirection="row">
        <Grid item xs={8}>
          <TextField
            size="medium"
            margin="normal"
            fullWidth
            id="order_name"
            label="Order Name"
            name="order_name"
            autoFocus
            value={formik.values.order_name}
            onChange={formik.handleChange}
            error={
              formik.touched.order_name && Boolean(formik.errors.order_name)
            }
            helperText={formik.touched.order_name && formik.errors.order_name}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            size="medium"
            margin="normal"
            fullWidth
            id="valid_days"
            label="Valid Days"
            name="valid_days"
            autoComplete="Valid Days"
            autoFocus
            value={formik.values.valid_days}
            onChange={formik.handleChange}
            error={
              formik.touched.valid_days && Boolean(formik.errors.valid_days)
            }
            helperText={formik.touched.valid_days && formik.errors.valid_days}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            size="medium"
            margin="normal"
            fullWidth
            id="total_licence"
            label="Total no of licenses"
            name="total_licence"
            autoComplete="Total no of licenses"
            autoFocus
            value={formik.values.total_licence}
            onChange={formik.handleChange}
            error={
              formik.touched.total_licence &&
              Boolean(formik.errors.total_licence)
            }
            helperText={
              formik.touched.total_licence && formik.errors.total_licence
            }
          />
        </Grid>
        <Grid container justifyContent="flex-end">
          <Button
            type="submit"
            style={{ backgroundColor: "#1976d2" }}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Order
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        {severity == "success" ? (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        ) : (
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
}
