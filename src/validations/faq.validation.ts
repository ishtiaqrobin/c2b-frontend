import { z } from "zod";

export const faqFormSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  sortOrder: z.coerce.number().int().min(0).optional().default(0),
  isActive: z
    .string()
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : true,
    ),
});

export type FaqFormValues = z.infer<typeof faqFormSchema>;
