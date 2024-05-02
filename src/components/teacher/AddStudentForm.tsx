import React from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { AppState } from "../../store/store";

import { Button, Autocomplete, TextField, Checkbox } from "@mui/material";

const AddStudentSchema = Yup.object().shape({
  students: Yup.array().min(1, "Select at least one student"),
});

const AddStudentForm = ({
  classStudents,
  handleAddSubmit,
  selectedClassroom,
  selectedStudents,
  handleAddStudentDialogClose,
}: any) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state: AppState) => state.auth);

  return (
    <Formik
      initialValues={{
        students: classStudents,
        classId: selectedClassroom ? selectedClassroom.class_id : "",
      }}
      validationSchema={AddStudentSchema}
      onSubmit={handleAddSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Field
            name="selectedStudents"
            component={({ form }) => (
              <Autocomplete
                id="student"
                options={selectedStudents}
                getOptionLabel={(student) => student.user_name}
                onChange={(e, value) => {
                  form.setFieldValue(
                    "students",
                    value.map((student) => student.user_id)
                  ); // Store only the IDs
                  form.setFieldTouched("students", true);
                }}
                onBlur={form.handleBlur}
                value={selectedStudents.filter((student) =>
                  form.values.students.includes(student.user_id)
                )}
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
                    error={
                      form.touched.students && Boolean(form.errors.students)
                    }
                    helperText={
                      form.touched.students && form.errors.students
                        ? form.errors.students
                        : ""
                    }
                  />
                )}
              />
            )}
          />
          {touched.selectedStudents && errors.selectedStudents && (
            <div>{errors.selectedStudents}</div>
          )}
          <br />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ backgroundColor: "#1976d2" }}
          >
            Add Students
          </Button>
          <Button onClick={handleAddStudentDialogClose}>Cancel</Button>
        </Form>
      )}
    </Formik>
  );
};

export default AddStudentForm;
