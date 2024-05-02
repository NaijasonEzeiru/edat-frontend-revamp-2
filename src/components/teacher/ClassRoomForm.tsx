import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { AppState, AppDispatch } from "../../store/store";
import { useCreateClassRoomMutation } from "../../services/classRoomApi";

import {
  Button,
  Autocomplete,
  Grid,
  TextField,
  Stack,
  Box,
  Checkbox,
  LinearProgress,
  Alert,
} from "@mui/material";

const validationSchema = yup.object({
  class_name: yup.string().required("Class Name is required"),
  level_id: yup.number().required("Class Level is required"),
  subject_id: yup.number().required("Subject is required"),
  students: yup
    .array()
    .of(yup.string()) // Validate individual IDs as strings
    .min(0, "At least one student is required"),
});

const ClassroomForm = ({ studentList, subjects, levels, onSave }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state: AppState) => state.auth);
  const [createClassRoom, { isSuccess, isLoading, isError, data, error }] =
    useCreateClassRoomMutation();

  const initialValues = {
    teacher_id: user.user_id,
    org_code: user.org_code,
    class_name: "",
    students: [],
  };

  const handleSubmit = (values, { setSubmitting }: any) => {
    onSave(values, setSubmitting);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, touched, errors }) => (
        <Form>
          <Grid container spacing={2} xs={12} md={8} item>
            <Grid item xs={12} sm={12}>
              {isLoading && (
                <Stack direction="row">
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress />
                  </Box>
                </Stack>
              )}

              {error && <Alert severity="error">{error.message}</Alert>}
            </Grid>
            <Grid item xs={12}>
              <Field
                name="class_name"
                label="Class Room"
                as={TextField}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={touched.class_name && !!errors.class_name}
                helperText={touched.class_name && errors.class_name}
              />
              <ErrorMessage name="class_name" component="div" />
            </Grid>
            <Grid item xs={6} md={4}>
              <Autocomplete
                id="students-autocomplete"
                options={subjects}
                onChange={(event, newValue) => {
                  const selectedId = newValue ? newValue.id : null; // Get selected ID or null
                  setFieldValue("subject_id", selectedId); // Update field value with selected ID
                }}
                getOptionLabel={(option) => option.name}
                value={
                  subjects.find((option) => option.id === values.subject_id) ||
                  null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Subject"
                    fullWidth
                    error={touched.subject_id && !!errors.subject_id}
                    helperText={touched.subject_id && errors.subject_id}
                  />
                )}
                disableCloseOnSelect
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <Autocomplete
                id="level-autocomplete"
                options={levels}
                onChange={(event, newValue) => {
                  const selectedId = newValue ? newValue.id : null; // Get selected ID or null
                  setFieldValue("level_id", selectedId); // Update field value with selected ID
                }}
                getOptionLabel={(option) => option.name}
                value={
                  levels.find((option) => option.id === values.level_id) || null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Level"
                    fullWidth
                    error={touched.level_id && !!errors.level_id}
                    helperText={touched.level_id && errors.level_id}
                  />
                )}
                disableCloseOnSelect
              />
            </Grid>
            {/* <Grid item xs={12}>
                            <Autocomplete
                                id="student"
                                options={studentList}
                                getOptionLabel={(student) => student.user_name}
                                onChange={(e, value) => {
                                    setFieldValue('students', value.map((student) => student.user_id)); // Store only the IDs
                                    // setFieldTouched('students', true);
                                }}
                                value={studentList.filter((student) => values.students.includes(student.user_id))}
                                multiple
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox checked={selected} />
                                        {option.user_name}
                                    </li>
                                )}
                                disableCloseOnSelect
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Students"
                                        fullWidth
                                        error={touched.students && Boolean(errors.students)}
                                        helperText={
                                            touched.students && errors.students
                                                ? errors.students
                                                : ''
                                        }
                                    />
                                )}
                            />
                        </Grid> */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ backgroundColor: "#1976d2" }}
              >
                Create Classroom
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default ClassroomForm;
