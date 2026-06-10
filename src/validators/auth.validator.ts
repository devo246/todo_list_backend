import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string("Please enter your name")
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),

  email: z.email("Please enter a valid email"),
  
  password: z.string("Password must be at least 6 characters").min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.email("Please enter your email"),
  password: z.string("Please enter your Password").min(6, "Password must be at least 6 characters"),
});
