import { useFormik, FormikHelpers } from "formik";
import * as yup from "yup";
import * as React from "react";
import getConfig from "next/config";
import { useRouter } from "next/router";

import {
  Box,
  Grid,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import MuiAlert, { AlertProps, AlertColor } from "@mui/material/Alert";

const { publicRuntimeConfig } = getConfig();

interface Values {
  org_code: string;
  order_number: string;
  pool_name: string;
  level: number;
  total_licence: string;
  role_type: string;
}

const validationSchema = yup.object({
  org_code: yup.number(),
  order_number: yup.number().required("Order number is required"),
  pool_name: yup.string().required("Pool name is required"),
  level: yup.number().required("Level is required"),
  total_licence: yup.number().required("Enter total no of licenses"),
  role_type: yup.string().required("Role type is required"),
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AddLicenseForm() {
  const router = useRouter();
  const { orgid } = router.query || {};

  const [orderNumbers, setOrderNumbers] = React.useState([]);

  const handleChange = (event: SelectChangeEvent) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const [country, setCountry] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState("success");

  const [levels, setLevels] = React.useState([
    { label: "Basic", value: 0 },
    { label: "Level 1", value: 1 },
    { label: "Level 2", value: 2 },
    { label: "Level 3", value: 3 },
    { label: "Level 4", value: 4 },
    { label: "Level 5", value: 5 },
    { label: "Level 6", value: 6 },
    { label: "Level 7", value: 7 },
    { label: "Level 8", value: 8 },
    { label: "Level 9", value: 9 },
    { label: "Level 10", value: 10 },
    { label: "Level 11", value: 11 },
    { label: "Level 12", value: 12 },
    { label: "Level 13", value: 13 },
    { label: "Level 14", value: 14 },
    { label: "Level 15", value: 15 },
    { label: "Level 16", value: 16 },
    { label: "Level 17", value: 17 },
    { label: "Level 18", value: 18 },
    { label: "Level 19", value: 19 },
    { label: "Level 20", value: 20 },
  ]);

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

  React.useEffect(() => {
    if (orgid !== undefined) {
      // fetch license details

      fetch(publicRuntimeConfig.backendApi + "/licence/orders/list/" + orgid, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("edat_token"),
        },
      })
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
          const responseData = await res.json();
          console.log(responseData);
          setOrderNumbers(responseData.results.items);
        });
    }
  }, [orgid]);

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
      order_number: "",
      pool_name: "",
      level: 0,
      total_licence: "",
      role_type: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
      setTimeout(() => {
        fetch(
          publicRuntimeConfig.backendApi +
            "/licence/create-pool?org_code=" +
            orgid,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("edat_token"),
            },
            body: JSON.stringify({
              org_code: Number(orgid),
              order_number: Number(values["order_number"]),
              pool_name: values["pool_name"],
              level: Number(values["level"]),
              total_licence: Number(values["total_licence"]),
              role_type: values["role_type"],
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
              setMessage("Licenses added successfully");
              setSeverity("success");
              setTimeout(function () {
                router.push("/admin/org/" + orgid + "/licenses");
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
      <Grid container padding={5} spacing={3} xs={12} flexDirection="row">
        <Grid item xs={8}>
          <FormControl fullWidth>
            <InputLabel id="order_number_label">Order Name</InputLabel>
            <Select
              labelId="order_number_label"
              id="order_number"
              name="order_number"
              onChange={handleChange}
              value={formik.values.order_number}
              error={
                formik.touched.order_number &&
                Boolean(formik.errors.order_number)
              }
              label="Order Name"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>

              {orderNumbers.map(function (order: any) {
                return (
                  <MenuItem key={order.order_number} value={order.order_number}>
                    {order.order_name}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>
              {formik.touched.order_number && formik.errors.order_number}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={8}>
          <TextField
            size="medium"
            margin="normal"
            fullWidth
            id="pool_name"
            label="Pool Name"
            name="pool_name"
            autoComplete="Pool Name"
            autoFocus
            value={formik.values.pool_name}
            onChange={formik.handleChange}
            error={formik.touched.pool_name && Boolean(formik.errors.pool_name)}
            helperText={formik.touched.pool_name && formik.errors.pool_name}
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
        {/* <Grid item xs={8}>
          <FormControl fullWidth>
            <InputLabel id="role_type_label">Level</InputLabel>
            <Select
              labelId="role_type_label"
              id="level"
              name="level"
              onChange={handleChange}
              value={formik.values.level}
              error={formik.touched.level && Boolean(formik.errors.level)}
              label="Level"
              >
              {levels.map((level) => (
                <MenuItem sx={{ overflow: 'scroll'}} value={level.value}>{level.label}</MenuItem>

              ))}
            </Select>
            <FormHelperText>{formik.touched.role_type && formik.errors.role_type}</FormHelperText>
          </FormControl>
        </Grid> */}

        <Grid item xs={8}>
          <FormControl fullWidth>
            <InputLabel id="role_type_label">Role Type</InputLabel>
            <Select
              labelId="role_type_label"
              id="role_type"
              name="role_type"
              onChange={handleChange}
              value={formik.values.role_type}
              error={
                formik.touched.role_type && Boolean(formik.errors.role_type)
              }
              label="Role Type"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="account admin">Account Admin</MenuItem>
              <MenuItem value="guest">Guest</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="student">Student</MenuItem>
              {/* <MenuItem value="parent">Parent</MenuItem> */}
            </Select>
            <FormHelperText>
              {formik.touched.role_type && formik.errors.role_type}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid container xs={8} justifyContent="flex-end">
          <Button
            type="submit"
            style={{ backgroundColor: "#1976d2" }}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Add License
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
