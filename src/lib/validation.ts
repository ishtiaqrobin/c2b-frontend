import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be at most 64 characters");

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: passwordSchema,
});

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Full Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

export const feedbackSchema = z.object({
  position: z
    .string()
    .min(1, { message: "Position must be at least 1 characters." }),
  company: z
    .string()
    .min(1, { message: "Company must be at least 1 characters." }),
  feedback: z
    .string()
    .min(10, { message: "Feedback must be at least 10 characters." }),
});

export const updateFeedbackSchema = z.object({
  position: z.string().optional(),
  company: z.string().optional(),
  feedback: z.string().optional(),
});

// ─── Address / shared field helpers ───

const addressFields = {
  postCode: z.string().min(1, "Post code is required"),
  districtId: z.number().int().positive("District is required"),
  cityTownVillage: z.string().min(1, "City/Town/Village is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  apartment: z.string().optional(),
};

const companyAddressFields = {
  companyPostCode: z.string().min(1, "Post code is required"),
  companyDistrictId: z.number().int().positive("District is required"),
  companyCityTownVillage: z.string().min(1, "City/Town/Village is required"),
  companyStreetAddress: z.string().min(1, "Street address is required"),
  companyApartment: z.string().optional(),
};

const qualifiedInvoice = z
  .enum(["NOT_APPLICABLE", "TARGET_AUDIENCE"])
  .optional();

const occupationSchema = z.enum([
  "COMPANY_EMPLOYEE",
  "SELF_EMPLOYED",
  "PART_TIME_JOB",
  "STUDENT",
  "UNEMPLOYED",
  "HOUSEWIFE",
  "OTHERS",
]);

const bankAccountTypeSchema = z.enum(["SAVINGS", "CURRENT"]);

// ─── Individual Registration ───

export const registerIndividualSchema = z.object({
  accountType: z.literal("INDIVIDUAL"),
  email: z.string().email("Invalid email"),
  password: passwordSchema,
  name: z.string().min(1, "Name is required"),
  qualifiedInvoiceStatus: qualifiedInvoice,
  profile: z.object({
    fullName: z.string().min(1, "Full name is required"),
    telephone: z.string().min(8, "Telephone is required"),
    dateOfBirth: z
      .string()
      .refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
    sex: z.enum(["MALE", "FEMALE", "OTHER"]),
    occupation: occupationSchema.optional(),
    ...addressFields,
  }),
});

// ─── Corporation Registration ───

export const registerCorporationSchema = z.object({
  accountType: z.literal("CORPORATION"),
  email: z.string().email("Invalid email"),
  password: passwordSchema,
  name: z.string().min(1, "Name is required"),
  qualifiedInvoiceStatus: z.string().optional(),
  company: z.object({
    companyName: z.string().min(1, "Company name is required"),
    companyTelephone: z.string().min(8, "Company telephone is required"),
    ...companyAddressFields,
  }),
  contact: z.object({
    contactName: z.string().min(1, "Contact name is required"),
    contactTelephone: z.string().min(8, "Contact telephone is required"),
    contactDateOfBirth: z
      .string()
      .refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
    contactSex: z.enum(["MALE", "FEMALE", "OTHER"]),
    contactOccupation: occupationSchema.optional(),
    contactPostCode: z.string().min(1, "Post code is required"),
    contactDistrictId: z.number().int().positive("District is required"),
    contactCityTownVillage: z.string().min(1, "City/Town/Village is required"),
    contactStreetAddress: z.string().min(1, "Street address is required"),
    contactApartment: z.string().optional(),
    bankAccount: z.string().min(1, "Bank account is required"),
    bankAccountBranch: z.string().min(1, "Bank branch is required"),
    bankAccountType: bankAccountTypeSchema,
    bankAccountNumber: z.string().min(1, "Bank account number is required"),
    bankAccountName: z.string().min(1, "Bank account name is required"),
  }),
});

// Discriminated union so the correct schema is picked by accountType.
export const registerZodSchema = z.discriminatedUnion("accountType", [
  registerIndividualSchema,
  registerCorporationSchema,
]);

// ─── Inferred types ───

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RegisterIndividualFormValues = z.infer<
  typeof registerIndividualSchema
>;
export type RegisterCorporationFormValues = z.infer<
  typeof registerCorporationSchema
>;
export type RegisterFormValuesUnion = z.infer<typeof registerZodSchema>;

export type ContactFormValues = z.infer<typeof contactSchema>;
export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
export type UpdateFeedbackFormValues = z.infer<typeof updateFeedbackSchema>;
