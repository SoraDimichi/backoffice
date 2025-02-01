import { z } from "zod";

export const loginUserSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .max(50, { message: "Email must be less than 50 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(30, { message: "Password must be less than 30 characters." }),
});

const userSchema = loginUserSchema.extend({
  first_name: z
    .string()
    .min(1, { message: "First name is required." })
    .max(20, { message: "First name must be less than 20 characters." }),
  last_name: z
    .string()
    .min(1, { message: "Last name is required." })
    .max(20, { message: "Last name must be less than 20 characters." }),
});

export const createUserSchema = userSchema.extend({
  role: z.enum(["user", "admin"], { required_error: "Please select a role." }),
});
export const registerUserSchema = userSchema.extend({
  terms: z.boolean().refine((val) => val, {
    message: "You must accept the terms and conditions.",
  }),
});
