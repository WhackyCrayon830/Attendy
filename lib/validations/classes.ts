import { z } from "zod";

export const createClassSchema = z.object({
  name: z.string().trim().min(2, "Enter a class name.").max(100, "Class names can be at most 100 characters."),
  code: z.string().trim().min(2, "Enter a class code.").max(24, "Class codes can be at most 24 characters.").transform((value) => value.toUpperCase()),
  room: z.string().trim().max(80, "Room names can be at most 80 characters.").optional(),
});

export type CreateClassState = { error?: string };
