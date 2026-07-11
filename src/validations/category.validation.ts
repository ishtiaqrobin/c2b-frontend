import z from "zod";

export const categoryFormSchema = z.object({
  nameEn: z
    .string()
    .min(1, "English name is required")
    .max(200, "Name must be less than 200 characters"),
  nameBn: z
    .string()
    .max(200, "Name must be less than 200 characters")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  isActive: z.boolean().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
