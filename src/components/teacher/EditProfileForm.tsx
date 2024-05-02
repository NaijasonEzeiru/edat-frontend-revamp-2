import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Stack,
  Grid,
  Autocomplete,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  user_name: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  dob: Yup.date().required("Date of Birth is required"),
  gender: Yup.string().required("Gender is required"),
  about_me: Yup.string().optional(),
  previous_school: Yup.string().optional(),
  tutor_group: Yup.string().optional(),
  qualification: Yup.string().optional(),
  // subjects: Yup.string().optional()
  // Add validation for other fields
});

const genderOptions = ["Male", "Female"];

const EditProfileForm = ({ teacherData, onSave, onClose }: any) => {
  const [previewImage, setPreviewImage] = useState(null);

  const handleSubmit = (values, { setSubmitting }: any) => {
    console.log(values);
    onSave(values, setSubmitting);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div>
      <br />
      <Formik
        initialValues={teacherData}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, touched, errors }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Typography variant="h5">Edit Profile</Typography>
                <br />
              </Grid>

              <Grid item xs={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      name="first_name"
                      label="First Name"
                      as={TextField}
                      fullWidth
                      error={touched.first_name && !!errors.first_name}
                      helperText={touched.first_name && errors.first_name}
                    />
                    <ErrorMessage name="first_name" component="div" />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="last_name"
                      label="Last Name"
                      as={TextField}
                      fullWidth
                      error={touched.last_name && !!errors.last_name}
                      helperText={touched.last_name && errors.last_name}
                    />
                    <ErrorMessage name="last_name" component="div" />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="dob"
                      label="Date of Birth"
                      type="date"
                      as={TextField}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={touched.dob && !!errors.dob}
                      helperText={touched.dob && errors.dob}
                    />
                    <ErrorMessage name="dob" component="div" />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      // name="gender"
                      options={genderOptions}
                      getOptionLabel={(option) => option}
                      value={genderOptions.find(
                        (option) => option === values.gender
                      )}
                      onChange={(event, newValue) => {
                        // const selectedId = newValue ? newValue : null; // Get selected ID or null
                        setFieldValue("gender", newValue); // Update field value with selected ID
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Gender"
                          fullWidth
                          error={touched.gender && !!errors.gender}
                          helperText={touched.gender && <p>errors.gender</p>}
                        />
                      )}
                    />
                    <ErrorMessage name="gender" component="div" />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="about_me"
                      label="About Me"
                      multiline
                      as={TextField}
                      rows={4}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={touched.about_me && !!errors.about_me}
                      helperText={touched.about_me && errors.about_me}
                    />
                    <ErrorMessage name="about_me" component="div" />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      name="previous_school"
                      label="Previous School"
                      as={TextField}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={
                        touched.previous_school && !!errors.previous_school
                      }
                      helperText={
                        touched.previous_school && errors.previous_school
                      }
                    />
                    <ErrorMessage name="previous_school" component="div" />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      name="tutor_group"
                      label="Tutor Group"
                      as={TextField}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={touched.tutor_group && !!errors.tutor_group}
                      helperText={touched.tutor_group && errors.tutor_group}
                    />
                    <ErrorMessage name="tutor_group" component="div" />
                  </Grid>
                  {/* <Grid item xs={6}>
                    <Field name="subjects"
                      label="Subjects"
                      as={TextField}
                      fullWidth InputLabelProps={{ shrink: true }}
                      error={touched.subjects && !!errors.subjects}
                      helperText={touched.subjects && errors.subjects}
                    />
                    <ErrorMessage name="subjects" component="div" />
                  </Grid> */}
                  <Grid item xs={12}>
                    <Field
                      name="qualification"
                      label="Qualification"
                      as={TextField}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={touched.qualification && !!errors.qualification}
                      helperText={touched.qualification && errors.qualification}
                    />
                    <ErrorMessage name="qualification" component="div" />
                  </Grid>
                </Grid>
                <br />
                <Stack spacing={2} direction="row">
                  <Button type="submit" variant="contained">
                    Save Profile
                  </Button>
                  <Button onClick={handleCancel} variant="text">
                    Cancel
                  </Button>
                </Stack>
              </Grid>
              {/* Add other fields in a similar manner */}
            </Grid>
            <br />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditProfileForm;
