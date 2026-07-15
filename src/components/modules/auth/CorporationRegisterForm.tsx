"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin, Building2, Calendar, CreditCard, Landmark, Loader2 } from "lucide-react";

import {
  registerCorporationSchema,
  type RegisterCorporationFormValues,
} from "@/lib/validation";
import { registerCorporationAction } from "@/actions/user.action";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLocations } from "@/hooks/useLocations";

const SEX_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
] as const;

const OCCUPATION_OPTIONS = [
  { value: "COMPANY_EMPLOYEE", label: "Company Employee" },
  { value: "SELF_EMPLOYED", label: "Self Employed" },
  { value: "PART_TIME_JOB", label: "Part Time Job" },
  { value: "STUDENT", label: "Student" },
  { value: "UNEMPLOYED", label: "Unemployed" },
  { value: "HOUSEWIFE", label: "Housewife" },
  { value: "OTHERS", label: "Others" },
] as const;

const BANK_ACCOUNT_TYPE_OPTIONS = [
  { value: "SAVINGS", label: "Savings" },
  { value: "CURRENT", label: "Current" },
] as const;

export default function CorporationRegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    divisions,
    districts,
    selectedDivisionId,
    isLoadingDivisions,
    isLoadingDistricts,
    fetchDistrictsByDivision,
  } = useLocations();

  const form = useForm<RegisterCorporationFormValues>({
    resolver: zodResolver(registerCorporationSchema),
    defaultValues: {
      accountType: "CORPORATION",
      email: "",
      password: "",
      name: "",
      qualifiedInvoiceStatus: "",
      company: {
        companyName: "",
        companyTelephone: "",
        companyPostCode: "",
        companyDistrictId: undefined,
        companyCityTownVillage: "",
        companyStreetAddress: "",
        companyApartment: "",
      },
      contact: {
        contactName: "",
        contactTelephone: "",
        contactDateOfBirth: "",
        contactSex: undefined,
        contactOccupation: undefined,
        contactPostCode: "",
        contactDistrictId: undefined,
        contactCityTownVillage: "",
        contactStreetAddress: "",
        contactApartment: "",
        bankAccount: "",
        bankAccountBranch: "",
        bankAccountType: undefined,
        bankAccountNumber: "",
        bankAccountName: "",
      },
    },
  });

  const onSubmit = async (values: RegisterCorporationFormValues) => {
    setIsLoading(true);
    try {
      const result = await registerCorporationAction(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 text-base tracking-wide pl-9 pr-3 py-2 transition-all focus-visible:ring-2";
  const selectTriggerClass = "bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80";
  const labelClass = "text-sm leading-4 font-medium text-primary mb-1.5 block";
  const sectionHeadingClass = "text-sm font-semibold text-primary uppercase tracking-wider";
  const formMessageClass = "text-xs text-red-500 font-medium";
  const separatorClass = "border-zinc-200/80 dark:border-zinc-800/80";

  return (
    <div className="w-full bg-white dark:bg-[#111116] border border-zinc-100 dark:border-zinc-800/40 rounded-xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-xl font-clash font-medium tracking-tight text-primary leading-tight mb-6">
        Corporation Registration
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* ─── Account Information ─── */}
          <div className="space-y-4">
            <h4 className={sectionHeadingClass}>
              Account Information
            </h4>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Account Holder Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="Account display name"
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Email
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        type="email"
                        placeholder="contact@company.com"
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 8 characters"
                        className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 text-base tracking-wide pl-9 pr-10 py-2 transition-all focus-visible:ring-2"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-text-primary/50 hover:text-text-primary transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />
          </div>

          {/* ─── Company Information ─── */}
          <div className="space-y-4 pt-5 border-t border-zinc-200/80 dark:border-zinc-800/80">
            <h4 className={sectionHeadingClass}>
              Company Information
            </h4>

            <FormField
              control={form.control}
              name="company.companyName"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Company Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="Acme Corporation Ltd."
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company.companyTelephone"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Company Telephone
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="0212345678"
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company.companyPostCode"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Company Post Code
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="1000"
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            {/* Division (standalone — not a form field) */}
            <div className="space-y-0">
              <FormLabel className={labelClass}>
                Company Division
              </FormLabel>
              <Select
                onValueChange={(val) => {
                  fetchDistrictsByDivision(Number(val));
                }}
                value={selectedDivisionId?.toString() ?? ""}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {isLoadingDivisions ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    divisions.map((div) => (
                      <SelectItem key={div.id} value={div.id.toString()}>
                        {div.nameEn}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* District */}
            <FormField
              control={form.control}
              name="company.companyDistrictId"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Company District
                  </FormLabel>
                  <Select
                    onValueChange={(val) =>
                      field.onChange(val ? Number(val) : undefined)
                    }
                    value={field.value?.toString() ?? ""}
                    disabled={!selectedDivisionId || isLoadingDistricts}
                  >
                    <FormControl>
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue
                          placeholder={
                            isLoadingDistricts
                              ? "Loading districts..."
                              : "Select district"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      {districts.map((d) => (
                        <SelectItem key={d.id} value={d.id.toString()}>
                          {d.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company.companyCityTownVillage"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Company City / Town / Village
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="Chiyoda"
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company.companyStreetAddress"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Company Street Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="1-2-3 Marunouchi"
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company.companyApartment"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Company Apartment (optional)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="Tower A, 10F"
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />
          </div>

          {/* ─── Contact Person ─── */}
          <div className="space-y-4 pt-5 border-t border-zinc-200/80 dark:border-zinc-800/80">
            <h4 className={sectionHeadingClass}>
              Person In Charge Information
            </h4>

            <FormField
              control={form.control}
              name="contact.contactName"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Contact Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="Taro Yamada"
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact.contactTelephone"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Contact Telephone
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="09012345678"
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact.contactDateOfBirth"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Contact Date of Birth
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        type="date"
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact.contactSex"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Contact Sex
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      {SEX_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact.contactOccupation"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Contact Occupation
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder="Select occupation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      {OCCUPATION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact.contactPostCode"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Contact Post Code
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="1000"
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            {/* Division (standalone — not a form field) */}
            <div className="space-y-0">
              <FormLabel className={labelClass}>
                Contact Division
              </FormLabel>
              <Select
                onValueChange={(val) => {
                  fetchDistrictsByDivision(Number(val));
                }}
                value={selectedDivisionId?.toString() ?? ""}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {isLoadingDivisions ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    divisions.map((div) => (
                      <SelectItem key={div.id} value={div.id.toString()}>
                        {div.nameEn}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* District */}
            <FormField
              control={form.control}
              name="contact.contactDistrictId"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Contact District
                  </FormLabel>
                  <Select
                    onValueChange={(val) =>
                      field.onChange(val ? Number(val) : undefined)
                    }
                    value={field.value?.toString() ?? ""}
                    disabled={!selectedDivisionId || isLoadingDistricts}
                  >
                    <FormControl>
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue
                          placeholder={
                            isLoadingDistricts
                              ? "Loading districts..."
                              : "Select district"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      {districts.map((d) => (
                        <SelectItem key={d.id} value={d.id.toString()}>
                          {d.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact.contactCityTownVillage"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Contact City / Town / Village
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="Chiyoda"
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact.contactStreetAddress"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Contact Street Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="1-2-3 Marunouchi"
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact.contactApartment"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Contact Apartment (optional)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="Tower A, 10F"
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />
          </div>

          {/* ─── Bank Account ─── */}
          <div className="space-y-4 pt-5 border-t border-zinc-200/80 dark:border-zinc-800/80">
            <h4 className={sectionHeadingClass}>
              Bank Account Information
            </h4>

            <FormField
              control={form.control}
              name="contact.bankAccount"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Bank Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Landmark className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="Dutch Bangla Bank"
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact.bankAccountBranch"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Branch
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="Shinjuku Branch"
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact.bankAccountType"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Account Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      {BANK_ACCOUNT_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact.bankAccountNumber"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Account Number
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="1234567"
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact.bankAccountName"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelClass}>
                    Account Holder Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="Acme Corporation Ltd."
                        className={inputClass}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={formMessageClass} />
                </FormItem>
              )}
            />
          </div>

          {/* ─── Submit ─── */}
          <div className="pt-3">
            <Button
              type="submit"
              className="w-full justify-center"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span>Registering...</span>
                </div>
              ) : (
                <>Create Corporation Account</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
