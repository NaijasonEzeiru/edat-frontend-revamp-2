import { useFormik, FormikHelpers } from "formik";
import * as yup from "yup";
import * as React from "react";
import getConfig from "next/config";
import { useRouter } from "next/router";

import {
  Button,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Box,
  Grid,
  FormHelperText,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { Dayjs } from "dayjs";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import MuiAlert, { AlertProps } from "@mui/material/Alert";

const { publicRuntimeConfig } = getConfig();

interface Values {
  role: string;
  password: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  dob: Date;
  mobile_number: string;
  city: string;
  country: string;
  reg_code: string;
  gender: string;
}

const validationSchema = yup.object({
  role: yup.string().required("Role is required"),
  username: yup.string().required("Username is required"),
  firstname: yup.string().required("Firstname is required"),
  lastname: yup.string().required("Firstname is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  mobile_number: yup.string().required("Mobile number is required"),
  city: yup.string().required("City is required"),
  country: yup.string().required("Country is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  reg_code: yup.string().required("Registration code is required"),
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AddUserForm() {
  const router = useRouter();
  const { orgid } = router.query || {};
  const [dob, setDob] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("success");

  const date_TO_String = (date_Object: Date): string => {
    if (date_Object) {
      let date = new Date(date_Object);

      // get the year, month, date, hours, and minutes seprately and append to the string.
      let date_String: string =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        +date.getDate();
      return date_String;
    }
    return "1987-01-01";
  };

  const handleChange = (event: SelectChangeEvent) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const handleDateChange = (dob: Date | null) => {
    if (dob) {
      formik.setFieldValue("dob", dob);
    }
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

  const formik = useFormik({
    initialValues: {
      role: "",
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      mobile_number: "",
      dob: new Date(),
      city: "",
      country: "",
      reg_code: "",
      gender: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
      setTimeout(() => {
        console.log(values);
        console.log("data");

        fetch(publicRuntimeConfig.backendApi + "/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + publicRuntimeConfig.token,
          },
          body: JSON.stringify({
            user_name: values["username"],
            email: values["email"],
            password: values["password"],
            first_name: values["firstname"],
            last_name: values["lastname"],
            dob: date_TO_String(values["dob"]),
            gender: values["gender"],
            reg_code: values["reg_code"],
            is_parent: 0,
          }),
        })
          .catch((err) => {
            console.log("Error message");
            console.log(err);
          })
          .then(async (res: any) => {
            console.log("response");
            let responseData: any = await res.json();

            if (
              "errors" in responseData &&
              responseData["errors"]["code"] != null
            ) {
              setMessage(responseData["errors"]["message"]);
              setSeverity("error");
              setOpen(true);
            } else if (res.status == 200 || res.status == 201) {
              setMessage("User added successfully");
              setSeverity("success");
              setOpen(true);
              setTimeout(function () {
                router.push("/admin/org/" + orgid + "/admins");
              }, 500);
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
            <InputLabel id="demo-simple-select-role-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-role-label"
              id="demo-simple-select-role"
              name="role"
              onChange={handleChange}
              value={formik.values.role}
              error={formik.touched.role && Boolean(formik.errors.role)}
              label="role"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="super admin">Super Admin</MenuItem>
              <MenuItem value="account admin">Org Admin</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="parent">Parent</MenuItem>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="guest">Guest</MenuItem>
            </Select>
            <FormHelperText>
              {formik.touched.role && formik.errors.role}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={8}>
          <TextField
            size="medium"
            margin="normal"
            fullWidth
            id="username"
            label="Username*"
            name="username"
            autoComplete="Username"
            autoFocus
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            size="medium"
            margin="normal"
            fullWidth
            id="firstname"
            label="Firstname*"
            name="firstname"
            autoComplete="Firstname"
            autoFocus
            value={formik.values.firstname}
            onChange={formik.handleChange}
            error={formik.touched.firstname && Boolean(formik.errors.firstname)}
            helperText={formik.touched.firstname && formik.errors.firstname}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            size="medium"
            margin="normal"
            fullWidth
            id="lastname"
            label="Lastname*"
            name="lastname"
            autoComplete="Lastname"
            autoFocus
            value={formik.values.lastname}
            onChange={formik.handleChange}
            error={formik.touched.lastname && Boolean(formik.errors.lastname)}
            helperText={formik.touched.lastname && formik.errors.lastname}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            size="medium"
            margin="normal"
            fullWidth
            id="email"
            label="Email*"
            name="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            size="medium"
            margin="normal"
            fullWidth
            id="password"
            label="Password*"
            name="password"
            autoComplete="Password"
            autoFocus
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            size="medium"
            margin="normal"
            fullWidth
            id="mobile_number"
            label="Mobile number*"
            name="mobile_number"
            autoComplete="Mobile number"
            autoFocus
            value={formik.values.mobile_number}
            onChange={formik.handleChange}
            error={
              formik.touched.mobile_number &&
              Boolean(formik.errors.mobile_number)
            }
            helperText={
              formik.touched.mobile_number && formik.errors.mobile_number
            }
          />
        </Grid>
        <Grid item xs={8}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of birth"
              value={formik.values.dob}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={8}>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Gender
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                name="gender"
                value="male"
                onChange={formik.handleChange}
                defaultChecked={formik.values.gender === "male"}
                control={<Radio />}
                label="Male"
              />
              <FormControlLabel
                name="gender"
                value="female"
                onChange={formik.handleChange}
                defaultChecked={formik.values.gender === "female"}
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={8}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-filled-label">City</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              name="city"
              onChange={handleChange}
              value={formik.values.city}
              error={formik.touched.city && Boolean(formik.errors.city)}
              label="City"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="London">London</MenuItem>
              <MenuItem value="Cambridge">Cambridge</MenuItem>
              <MenuItem value="Ascot">Ascot</MenuItem>
              <MenuItem value="Chennai">Chennai</MenuItem>
            </Select>
            <FormHelperText>
              {formik.touched.city && formik.errors.city}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={8}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-country-label">
              Country
            </InputLabel>
            <Select
              labelId="demo-simple-select-country-label"
              id="demo-simple-select-country"
              name="country"
              onChange={handleChange}
              value={formik.values.country}
              error={formik.touched.country && Boolean(formik.errors.country)}
              label="Country"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="India">India</MenuItem>
              <MenuItem value="United Kingdom">United Kingdom</MenuItem>
              <MenuItem value="Germany">Germany</MenuItem>
              <MenuItem value="France">France</MenuItem>
            </Select>
            <FormHelperText>
              {formik.touched.country && formik.errors.country}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={8}>
          <TextField size="medium" fullWidth label="Postal Code"></TextField>
        </Grid>
        <Grid item xs={8}>
          <TextField
            size="medium"
            margin="normal"
            fullWidth
            id="reg_code"
            label="Registration Code*"
            name="reg_code"
            autoComplete="Registration Code"
            autoFocus
            value={formik.values.reg_code}
            onChange={formik.handleChange}
            error={formik.touched.reg_code && Boolean(formik.errors.reg_code)}
            helperText={formik.touched.reg_code && formik.errors.reg_code}
          />
        </Grid>
        <Grid container xs={8} justifyContent="flex-end">
          <Button
            type="submit"
            style={{ backgroundColor: "#1976d2" }}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Add User
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
