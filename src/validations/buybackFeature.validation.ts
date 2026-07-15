import { z } from "zod";

export const buybackFeatureFormSchema = z.object({
  image: z.instanceof(File, { message: "Image must be a file" }).optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export type BuybackFeatureFormValues = z.infer<
  typeof buybackFeatureFormSchema
>;
