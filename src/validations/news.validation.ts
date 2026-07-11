import z from "zod";

export const newsFormSchema = z.object({
  titleEn: z
    .string()
    .min(1, "English title is required")
    .max(300, "Title must be less than 300 characters"),
  titleBn: z
    .string()
    .max(300, "Title must be less than 300 characters")
    .optional(),
  bodyEn: z.string().max(50000).optional(),
  bodyBn: z.string().max(50000).optional(),
  publishedAt: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type NewsFormValues = z.infer<typeof newsFormSchema>;
