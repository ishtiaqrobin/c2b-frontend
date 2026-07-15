import { z } from "zod";

export const checkItemFormSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export type CheckItemFormValues = z.infer<typeof checkItemFormSchema>;
