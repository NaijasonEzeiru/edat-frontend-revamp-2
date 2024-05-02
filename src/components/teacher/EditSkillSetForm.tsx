import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Autocomplete, TextField, Button, Grid } from "@mui/material";

import {
  useAddSkillMutation,
  useUpdateSkillMutation,
} from "../../services/teacherApi";

import EventBus from "../../utils/eventBus";

const EditSkillSetForm = ({ subject, levels, initialData, op, closeForm }) => {
  const [hideField, setHideField] = useState(false);

  const user = useSelector((state: AppState) => state.auth);
  // const [subjectetList, subjecetResponse] = useLazyGetSubjectsQuery();
  const dispatch = useDispatch();

  const [addSkill, addSkillResponse] = useAddSkillMutation();
  const [updateSkill, updateSkillResponse] = useUpdateSkillMutation();

  const validationSchema = Yup.object().shape({
    level: Yup.number().required("Level is required"),
    subject: Yup.number().required("Grade is required"),
    experience: Yup.number().required("Experience is required"),
  });

  const initialValues = {
    level: initialData.level_id,
    subject: initialData.subject_id,
    experience: initialData.experince,
  };

  const experience = [
    { id: 1, name: "Years 1" },
    { id: 2, name: "Years 2" },
    { id: 3, name: "Years 3" },
    { id: 4, name: "Years 4" },
    { id: 5, name: "Years 5" },
    { id: 6, name: "Years 6" },
    { id: 7, name: "Years 7" },
    { id: 8, name: "Years 8" },
    { id: 9, name: "Years 9" },
    { id: 10, name: "Years 10" },
    { id: 11, name: "Years 11" },
    { id: 12, name: "Years 12" },
    { id: 13, name: "Years 13" },
    { id: 14, name: "Years 14" },
    { id: 15, name: "Years 15" },
    { id: 16, name: "Years 16" },
    { id: 17, name: "Years 17" },
    { id: 18, name: "Years 18" },
    { id: 19, name: "Years 19" },
    { id: 20, name: "Years 20" },
  ];

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      if (op === "add") {
        let body = {
          teacher_id: user.user_id,
          org_code: user.org_code,
          skills: [
            {
              subject_id: values.subject,
              experience: values.experience,
              level_id: values.level,
            },
          ],
        };
        const response = await addSkill(body).unwrap();
        EventBus.emit("SKILLSET", "fetchSkillSet");

        EventBus.emit("ALERT", {
          message: "New Skill Added successful",
          alertType: "success",
          openStatus: true,
        });

        setTimeout(() => {
          closeForm();
        }, 1000);
      }

      if (op === "edit") {
        let body = {
          subject_id: values.subject,
          experience: values.experience,
          level_id: values.level,
          org_code: user.org_code,
          teacher_id: user.user_id,
        };

        const response = await updateSkill(body).unwrap();
        EventBus.emit("SKILLSET", "fetchSkillSet");
        EventBus.emit("ALERT", {
          message: "Skill updated successful",
          alertType: "success",
          openStatus: true,
        });

        setTimeout(() => {
          closeForm();
        }, 1000);
      }
    } catch (error: any) {
      const status = error.status;
      if (status) {
        if (status >= 200 && status < 300) {
          if (op === "add") {
            console.log("Skill added successfully");
          } else {
            console.log("Skill updated successfully");
          }
        } else {
          EventBus.emit("ALERT", {
            message: "Skill addition failed with status",
            alertType: "error",
            openStatus: true,
          });
        }
      } else {
        console.error("Error adding skill:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user.isLoggedIn) {
      if (op == "edit") {
        setHideField(true);
      }
    }
  }, [op, user]);

  return (
    <div>
      <br />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors, setFieldValue, values }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Autocomplete
                  id="students-autocomplete"
                  disabled={hideField}
                  options={subject}
                  onChange={(event, newValue) => {
                    const selectedId = newValue ? newValue.id : null; // Get selected ID or null
                    setFieldValue("subject", selectedId); // Update field value with selected ID
                  }}
                  getOptionLabel={(option) => option.name}
                  value={
                    subject.find((option) => option.id === values.subject) ||
                    null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Subject"
                      fullWidth
                      error={touched.subject && !!errors.subject}
                      helperText={touched.subject && errors.subject}
                    />
                  )}
                  disableCloseOnSelect
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  id="level-autocomplete"
                  disabled={hideField}
                  options={levels}
                  onChange={(event, newValue) => {
                    const selectedId = newValue ? newValue.id : null; // Get selected ID or null
                    setFieldValue("level", selectedId); // Update field value with selected ID
                  }}
                  getOptionLabel={(option) => option.name}
                  value={
                    levels.find((option) => option.id === values.level) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Level"
                      fullWidth
                      error={touched.level && !!errors.level}
                      helperText={touched.level && errors.level}
                    />
                  )}
                  disableCloseOnSelect
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  id="expr-autocomplete"
                  options={experience}
                  onChange={(event, newValue) => {
                    const selectedId = newValue ? newValue.id : null; // Get selected ID or null
                    setFieldValue("experience", selectedId); // Update field value with selected ID
                  }}
                  getOptionLabel={(option) => option.name}
                  value={
                    experience.find(
                      (option) => option.id === values.experience
                    ) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Experince"
                      fullWidth
                      error={touched.experience && !!errors.experience}
                      helperText={touched.experience && errors.experience}
                    />
                  )}
                  disableCloseOnSelect
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: "#1976d2" }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditSkillSetForm;
