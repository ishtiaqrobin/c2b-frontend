import z from "zod";

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export { generateSlug };

// ---------- Product form ----------

export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(300, "Name must be less than 300 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(150, "Slug must be less than 150 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  categoryId: z.string().min(1, "Category is required"),
  image: z.instanceof(File, { message: "Image must be a file" }).optional(),
  isActive: z.boolean().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

// ---------- Variant form ----------

// react-hook-form with valueAsNumber:true passes NaN for empty inputs.
// z.coerce.number() sets input type to `unknown` which breaks the RHF resolver.
// Instead, accept number | NaN and transform NaN → undefined.
const nanToUndefined = (v: number | undefined) =>
  v == null || (typeof v === "number" && isNaN(v)) ? undefined : v;

const optionalPrice = z
  .union([z.number().nonnegative("Price must be non-negative"), z.nan()])
  .optional()
  .transform(nanToUndefined);

const optionalPositiveInt = z
  .union([z.number().int().positive(), z.nan()])
  .optional()
  .transform(nanToUndefined);

export const variantFormSchema = z.object({
  sku: z.string().max(50).optional(),
  storage: z.string().max(50).optional(),
  color: z.string().max(50).optional(),
  newPrice: optionalPrice,
  usedPrice: optionalPrice,
  currency: z.string().max(10).optional(),
  maxQuantityPerOrder: optionalPositiveInt,
  dailyPurchaseLimit: optionalPositiveInt,
  isActive: z.boolean().optional(),
});

export type VariantFormValues = z.infer<typeof variantFormSchema>;
