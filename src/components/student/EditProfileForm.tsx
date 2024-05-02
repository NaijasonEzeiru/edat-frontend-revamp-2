import { TextField, Button, Autocomplete } from "@mui/material";
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
});

const genderOptions = ["Male", "Female"];

const EditProfileForm = ({ studentData, onSave, onClose }: any) => {
  const handleSubmit = async (values, { setSubmitting }: any) => {
    onSave(values, setSubmitting);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Formik
      initialValues={studentData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, touched, errors }) => (
        <Form>
          <h5 className="text-2xl font-semibold text-center mb-7">
            Edit Profile
          </h5>
          <div className="flex gap-4 flex-col">
            <div>
              <Field
                name="first_name"
                label="First Name"
                as={TextField}
                fullWidth
                error={touched.first_name && !!errors.first_name}
                helperText={touched.first_name && errors.first_name}
              />
              <ErrorMessage name="first_name" component="div" />
            </div>
            <div>
              <Field
                name="last_name"
                label="Last Name"
                as={TextField}
                fullWidth
                error={touched.last_name && !!errors.last_name}
                helperText={touched.last_name && errors.last_name}
              />
              <ErrorMessage name="last_name" component="div" />
            </div>
            <div>
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
            </div>
            <div>
              <Autocomplete
                options={genderOptions}
                getOptionLabel={(option) => option}
                value={genderOptions.find((option) => option === values.gender)}
                onChange={(event, newValue) => {
                  // const selectedId = newValue ? newValue : null; // Get selected ID or null
                  setFieldValue("gender", newValue); // Update field value with selected ID
                }}
                renderInput={(params) => (
                  <TextField
                    name="gender"
                    {...params}
                    label="Gender"
                    fullWidth
                    error={touched.gender && !!errors.gender}
                    helperText={touched.gender && errors.gender}
                  />
                )}
              />
              <ErrorMessage name="gender" component="div" />
            </div>
            <div>
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
            </div>
            <div className="flex gap-6 justify-center">
              <Button type="submit" variant="contained">
                Save Profile
              </Button>
              <Button onClick={handleCancel} variant="text">
                Cancel
              </Button>
            </div>
          </div>
          {/* Add other fields in a similar manner */}
        </Form>
      )}
    </Formik>
  );
};

export default EditProfileForm;
