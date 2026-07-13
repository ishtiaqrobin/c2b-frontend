import z from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be less than 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  image: z.instanceof(File, { message: "Image must be a file" }).optional(),
  isPopular: z.boolean().optional().default(false),
  sortOrder: z.coerce.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
