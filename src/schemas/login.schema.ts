import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be atleast 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
