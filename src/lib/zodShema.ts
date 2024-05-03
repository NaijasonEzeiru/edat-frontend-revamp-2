import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const RegisterSchema = z
  .object({
    user_name: z
      .string()
      .min(8, { message: "Can not be less than 8 characters" })
      .max(20, { message: "Can not be more than 20 characters" }),
    password: z
      .string()
      .min(8, { message: "Can not be less than 8 characters" })
      .max(20, { message: "Can not be more than 20 characters" })
      .regex(new RegExp(/^(?=.*[a-zA-Z0-9])(?=.*[^a-zA-Z0-9]).{8,}$/), {
        message: "Must include alphanumeric and non-alphanumeric characters",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Can not be less than 8 characters" })
      .max(20, { message: "Can not be more than 20 characters" })
      .regex(new RegExp(/^(?=.*[a-zA-Z0-9])(?=.*[^a-zA-Z0-9]).{8,}$/), {
        message: "Must include alphanumeric and non-alphanumeric characters",
      }),
    first_name: z
      .string()
      .min(2, { message: "Can not be less than 2 characters" })
      .max(20, { message: "Can not be more than 20 characters" }),
    last_name: z
      .string()
      .min(2, { message: "Can not be less than 2 characters" })
      .max(20, { message: "Can not be more than 20 characters" }),
    email: z
      .string()
      .email({ message: "Please input a valid email address" })
      .max(30, { message: "Must contain at most 30 characters" }),
    gender: z
      .string()
      .min(2, { message: "Select the gender" })
      .max(30, { message: "Too long!" }),
    // dob: z.coerce
    //   .date()
    //   .refine((data) => data < new Date(), {
    //     message: "Date of birth must be in the past",
    //   })
    //   .transform((str) => String(str)),
    dob: z.string(),
    reg_code: z
      .string()
      .min(2, { message: "Can not be less than 2 characters" })
      .max(20, { message: "Can not be more than 20 characters" }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const AddTask = z.object({
  recommendation: z.string(),
  set_code: z.string(),
  description: z.string(),
  category: z.string(),
  topic: z.string(),
  activity_name: z.string(),
  // URL: z.string(),
  // file: z.string(),
});

export const AutogenTaskSchema = z.object({
  topic_list: z.string().min(1, { message: "Can not be empty" }),
  learning_outcomes: z.string().min(1, { message: "Can not be empty" }).array(),
  estimated_time: z.coerce
    .number()
    .min(1, { message: "Can not be less than 1" }),
  total_score: z.coerce.number().min(1, { message: "Can not be less than 1" }),
  total_questions: z.coerce
    .number()
    .min(1, { message: "Can not be less than 1" }),
  question_type: z.string().min(1, { message: "Can not be empty" }),
  exam_board: z.string().min(1, { message: "Can not be empty" }),
  user_country: z.string().min(1, { message: "Can not be empty" }),
  points_per_question: z.coerce
    .number()
    .min(1, { message: "Can not be less than 1" }),
  category: z.string().min(1, { message: "Can not be empty" }),
});

export const EditParentDataSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  dob: z.string(),
  gender: z.string().min(1, { message: "Gender is required" }),
  about_me: z.string().optional(),
  qualification: z.string().optional(),
  occupation: z.string().optional(),
  contact_no: z.string().optional(),
  contact_address: z.string().optional(),
  spouse_name: z.string().optional(),
  spouse_qualification: z.string().optional(),
  spouse_occupation: z.string().optional(),
  spouse_contact_no: z.string().optional(),
  no_of_children: z.coerce.number().positive(),
});
