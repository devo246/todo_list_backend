import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string("Please enter the task title",)
    .min(1, "Title is required")
    .max(100, "The title must be less than 100 characters."),

  isCompleted: z.boolean().default(false),
});