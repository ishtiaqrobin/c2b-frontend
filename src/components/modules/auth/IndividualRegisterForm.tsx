"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin, Building2, Calendar, Loader2 } from "lucide-react";

import {
  registerIndividualSchema,
  type RegisterIndividualFormValues,
} from "@/lib/validation";
import { registerIndividualAction } from "@/actions/user.action";
import { useLocations } from "@/hooks/useLocations";

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

const INVOICE_OPTIONS = [
  { value: "NOT_APPLICABLE", label: "Not Applicable" },
  { value: "TARGET_AUDIENCE", label: "Target Audience" },
] as const;

export default function IndividualRegisterForm() {
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

  const form = useForm<RegisterIndividualFormValues>({
    resolver: zodResolver(registerIndividualSchema),
    defaultValues: {
      accountType: "INDIVIDUAL",
      email: "",
      password: "",
      name: "",
      qualifiedInvoiceStatus: undefined,
      profile: {
        fullName: "",
        telephone: "",
        dateOfBirth: "",
        sex: undefined,
        occupation: undefined,
        postCode: "",
        districtId: undefined,
        cityTownVillage: "",
        streetAddress: "",
        apartment: "",
      },
    },
  });

  const onSubmit = async (values: RegisterIndividualFormValues) => {
    setIsLoading(true);
    try {
      const result = await registerIndividualAction(values);
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

  return (
    <div className="w-full bg-white dark:bg-[#111116] border border-zinc-100 dark:border-zinc-800/40 rounded-xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-xl font-clash font-medium tracking-tight text-primary leading-tight mb-6">
        Individual Registration
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* ─── Account Information ─── */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">
              Account Information
            </h4>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-sm leading-4 font-medium text-primary mb-1.5 block">
                    Display Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="Your display name"
                        className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 text-base tracking-wide pl-9 pr-3 py-2 transition-all focus-visible:ring-2"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-sm leading-4 font-medium text-primary mb-1.5 block">
                    Email
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 text-base tracking-wide pl-9 pr-3 py-2 transition-all focus-visible:ring-2"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-sm leading-4 font-medium text-primary mb-1.5 block">
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
                  <FormMessage className="text-xs text-red-500 font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="qualifiedInvoiceStatus"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-sm leading-4 font-medium text-primary mb-1.5 block">
                    Qualified Invoice Status
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80">
                        <SelectValue placeholder="Select invoice status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      {INVOICE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-500 font-medium" />
                </FormItem>
              )}
            />
          </div>

          {/* ─── Profile Information ─── */}
          <div className="space-y-4 pt-5 border-t border-zinc-200/80 dark:border-zinc-800/80">
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">
              Profile Information
            </h4>

            <FormField
              control={form.control}
              name="profile.fullName"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-sm leading-4 font-medium text-primary mb-1.5 block">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="John Doe"
                        className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 text-base tracking-wide pl-9 pr-3 py-2 transition-all focus-visible:ring-2"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profile.telephone"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-sm leading-4 font-medium text-primary mb-1.5 block">
                    Telephone
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="01712345678"
                        className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 text-base tracking-wide pl-9 pr-3 py-2 transition-all focus-visible:ring-2"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profile.dateOfBirth"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-sm leading-4 font-medium text-primary mb-1.5 block">
                    Date of Birth
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        type="date"
                        className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 text-base tracking-wide pl-9 pr-3 py-2 transition-all focus-visible:ring-2"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profile.sex"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-sm leading-4 font-medium text-primary mb-1.5 block">
                    Sex
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80">
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
                  <FormMessage className="text-xs text-red-500 font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profile.occupation"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-sm leading-4 font-medium text-primary mb-1.5 block">
                    Occupation
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80">
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
                  <FormMessage className="text-xs text-red-500 font-medium" />
                </FormItem>
              )}
            />
          </div>

          {/* ─── Address ─── */}
          <div className="space-y-4 pt-5 border-t border-zinc-200/80 dark:border-zinc-800/80">
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">
              Address
            </h4>

            <FormField
              control={form.control}
              name="profile.postCode"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-sm leading-4 font-medium text-primary mb-1.5 block">
                    Post Code
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="1207"
                        className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 text-base tracking-wide pl-9 pr-3 py-2 transition-all focus-visible:ring-2"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 font-medium" />
                </FormItem>
              )}
            />

            {/* Division (standalone — not a form field) */}
            <div className="space-y-0">
              <FormLabel className="text-sm leading-4 font-medium text-primary mb-1.5 block">
                Division
              </FormLabel>
              <Select
                onValueChange={(val) => {
                  fetchDistrictsByDivision(Number(val));
                }}
                value={selectedDivisionId?.toString() ?? ""}
              >
                <SelectTrigger className="bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80">
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
              name="profile.districtId"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-sm leading-4 font-medium text-primary mb-1.5 block">
                    District
                  </FormLabel>
                  <Select
                    onValueChange={(val) =>
                      field.onChange(val ? Number(val) : undefined)
                    }
                    value={field.value?.toString() ?? ""}
                    disabled={!selectedDivisionId || isLoadingDistricts}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80">
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
                  <FormMessage className="text-xs text-red-500 font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profile.cityTownVillage"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-sm leading-4 font-medium text-primary mb-1.5 block">
                    City / Town / Village
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="Dhaka Kotwali"
                        className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 text-base tracking-wide pl-9 pr-3 py-2 transition-all focus-visible:ring-2"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profile.streetAddress"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-sm leading-4 font-medium text-primary mb-1.5 block">
                    Street Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="12/A Dhanmondi R/A"
                        className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 text-base tracking-wide pl-9 pr-3 py-2 transition-all focus-visible:ring-2"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profile.apartment"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-sm leading-4 font-medium text-primary mb-1.5 block">
                    Apartment (optional)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                      <Input
                        placeholder="Flat 4B"
                        className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 text-base tracking-wide pl-9 pr-3 py-2 transition-all focus-visible:ring-2"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 font-medium" />
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
                <>Create Individual Account</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
