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
import TextareaAutosize from "@mui/base/TextareaAutosize";

import MuiAlert, { AlertProps } from "@mui/material/Alert";

const { publicRuntimeConfig } = getConfig();

interface Values {
  org_name: string;
  org_email: string;
  org_mobile_number: string;
  billing_address: string;
  postal_code: string;
  contact_person: string;
}

const validationSchema = yup.object({
  org_name: yup.string().required("Username is required"),
  org_email: yup
    .string()
    .email("Enter a valid email")
    .required("Organisation email is required"),
  org_mobile_number: yup.string().required("Enter Organisation mobile number"),
  billing_address: yup.string().required("Billing Address is required"),
  postal_code: yup.string().required("Postal code is required"),
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AddOrgForm() {
  const router = useRouter();
  const { orgid } = router.query || {};

  const [severity, setSeverity] = React.useState("success");

  const handleChange = (event: SelectChangeEvent) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const [open, setOpen] = React.useState(false);
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
      org_name: "",
      org_email: "",
      org_mobile_number: "",
      billing_address: "",
      postal_code: "",
      contact_person: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
      setTimeout(() => {
        fetch(publicRuntimeConfig.backendApi + "/account/update/" + orgid, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("edat_token"),
          },
          body: JSON.stringify({
            name: values["org_name"],
            contact_number: values["org_mobile_number"],
            //billing_address: values["billing_address"],
            pincode: values["postal_code"],
            email: values["org_email"],
          }),
        })
          .catch((err) => {
            console.log("Error message");
            console.log(err);
          })
          .then(async (res: any) => {
            console.log("response");
            if (res.status == 401) {
              // redirect to login
              router.push("/login");
            }
            let responseData: any = await res.json();

            if (res.status == 200 || res.status == 201) {
              setMessage("Organisation added successfully");
              setSeverity("success");
              setTimeout(function () {
                router.push("/admin/org");
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

  React.useEffect(() => {
    fetch(publicRuntimeConfig.backendApi + "/account/get?org_code=" + orgid, {
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
        if (res.status == 401) {
          router.push("/");
        }
        const responseData: any = await res.json();

        if (res.status == 200 || res.status == 201) {
          const orgInfo = responseData.results.items;
          // populate the field values
          formik.setFieldValue("org_name", orgInfo["name"]);
          formik.setFieldValue("org_email", orgInfo["email"]);
          formik.setFieldValue("org_mobile_number", orgInfo["contact_number"]);
          formik.setFieldValue("billing_address", orgInfo["billing_address"]);
          formik.setFieldValue("postal_code", orgInfo["pincode"]);
          formik.setFieldValue("contact_person", orgInfo["contact_person"]);
        }
      });
  }, [orgid]);

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Grid container padding={5} spacing={3} xs={12} flexDirection="row">
        <Grid item xs={8}>
          <TextField
            size="medium"
            margin="normal"
            fullWidth
            id="org_name"
            label="Organisation Name*"
            name="org_name"
            autoComplete="Organisation Name"
            autoFocus
            value={formik.values.org_name}
            onChange={formik.handleChange}
            error={formik.touched.org_name && Boolean(formik.errors.org_name)}
            helperText={formik.touched.org_name && formik.errors.org_name}
          />
        </Grid>

        <Grid item xs={8}>
          <TextField
            size="medium"
            margin="normal"
            fullWidth
            id="org_email"
            label="Organisation Email"
            name="org_email"
            autoComplete="Organisation Email"
            autoFocus
            value={formik.values.org_email}
            onChange={formik.handleChange}
            error={formik.touched.org_email && Boolean(formik.errors.org_email)}
            helperText={formik.touched.org_email && formik.errors.org_email}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            size="medium"
            margin="normal"
            fullWidth
            multiline
            id="billing_address"
            label="Billing Address"
            name="billing_address"
            autoComplete="Billing Address"
            rows={2}
            maxRows={4}
            autoFocus
            value={formik.values.billing_address}
            onChange={formik.handleChange}
            error={
              formik.touched.billing_address &&
              Boolean(formik.errors.billing_address)
            }
            helperText={
              formik.touched.billing_address && formik.errors.billing_address
            }
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            size="medium"
            margin="normal"
            fullWidth
            id="Organisation Mobile number"
            label="Organisation Mobile number"
            name="org_mobile_number"
            autoComplete="Organisation Mobile number"
            autoFocus
            value={formik.values.org_mobile_number}
            onChange={formik.handleChange}
            error={
              formik.touched.org_mobile_number &&
              Boolean(formik.errors.org_mobile_number)
            }
            helperText={
              formik.touched.org_mobile_number &&
              formik.errors.org_mobile_number
            }
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            size="medium"
            margin="normal"
            fullWidth
            id="postal_code"
            label="Postal Code"
            name="postal_code"
            autoComplete="Postal Code"
            autoFocus
            value={formik.values.postal_code}
            onChange={formik.handleChange}
            error={
              formik.touched.postal_code && Boolean(formik.errors.postal_code)
            }
            helperText={formik.touched.postal_code && formik.errors.postal_code}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            size="medium"
            margin="normal"
            fullWidth
            id="contact_person"
            label="Contact Person"
            name="contact_person"
            autoComplete="Contact Person"
            autoFocus
            value={formik.values.contact_person}
            onChange={formik.handleChange}
            error={
              formik.touched.contact_person &&
              Boolean(formik.errors.contact_person)
            }
            helperText={
              formik.touched.contact_person && formik.errors.contact_person
            }
          />
        </Grid>
        <Grid container xs={8} justifyContent="flex-end">
          <Button
            type="submit"
            style={{ backgroundColor: "#1976d2" }}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update Organisation
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
