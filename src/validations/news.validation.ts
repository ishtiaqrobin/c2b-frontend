import z from "zod";

export const newsFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(300, "Title must be less than 300 characters"),
  body: z.string().max(50000).optional(),
  publishedAt: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type NewsFormValues = z.infer<typeof newsFormSchema>;
