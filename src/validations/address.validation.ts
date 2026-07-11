import z from "zod";

export const ADDRESS_TYPES = [
  "HOME",
  "SHIPPING",
  "RETURN",
  "COMPANY",
] as const;

export const addressFormSchema = z.object({
  type: z.enum(ADDRESS_TYPES).optional(),
  label: z.string().max(50).optional(),
  recipientName: z
    .string()
    .max(100, "Recipient name must be less than 100 characters")
    .optional(),
  telephone: z
    .string()
    .max(20, "Telephone must be less than 20 characters")
    .optional(),
  postCode: z.string().min(1, "Post code is required"),
  divisionId: z.number().int().min(1, "Please select a division"),
  districtId: z.number().int().min(1, "District is required"),
  cityTownVillage: z.string().min(1, "City / Town / Village is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  apartment: z
    .string()
    .max(100, "Apartment must be less than 100 characters")
    .optional(),
  isDefault: z.boolean().optional(),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;
