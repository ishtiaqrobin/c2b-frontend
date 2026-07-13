import { z } from "zod";

/**
 * Zod schema for the banner create/edit form.
 * - `image` is required when creating, optional when editing.
 * - `sortOrder` is auto-coerced from string (form) to number.
 * - `isActive` is string "true"/"false" from Switch/checkbox.
 */
export const bannerFormSchema = z.object({
  image: z.instanceof(File, { message: "Image must be a file" }).optional(),
  categoryId: z.string().optional(),
  linkUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).optional().default(0),
  isActive: z
    .string()
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : true,
    ),
});

export type BannerFormValues = z.infer<typeof bannerFormSchema>;
