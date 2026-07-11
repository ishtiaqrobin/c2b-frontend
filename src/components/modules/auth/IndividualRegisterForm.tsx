"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import {
  registerIndividualSchema,
  type RegisterIndividualFormValues,
} from "@/lib/validation";
import { registerIndividualAction } from "@/actions/user.action";
import { useLocations } from "@/hooks/useLocations";

import { Card, CardContent } from "@/components/ui/card";
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
import HoverButton from "@/components/modules/shared/HoverButton";

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
    <Card className="p-0 bg-slate-50/60 animate-in fade-in slide-in-from-bottom-4 duration-500 border-none">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-slate-800">
          Individual Registration
        </h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* ─── Account Information ─── */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Account Information
              </h4>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your display name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Min 8 characters"
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualifiedInvoiceStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualified Invoice Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ─── Profile Information ─── */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Profile Information
              </h4>

              <FormField
                control={form.control}
                name="profile.fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telephone</FormLabel>
                    <FormControl>
                      <Input placeholder="01712345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ─── Address ─── */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Address
              </h4>

              <FormField
                control={form.control}
                name="profile.postCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Code</FormLabel>
                    <FormControl>
                      <Input placeholder="1207" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Division (standalone — not a form field) */}
              <div className="space-y-2">
                <FormLabel>Division</FormLabel>
                <Select
                  onValueChange={(val) => {
                    fetchDistrictsByDivision(Number(val));
                  }}
                  value={selectedDivisionId?.toString() ?? ""}
                >
                  <SelectTrigger>
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
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <Select
                      onValueChange={(val) =>
                        field.onChange(val ? Number(val) : undefined)
                      }
                      value={field.value?.toString() ?? ""}
                      disabled={!selectedDivisionId || isLoadingDistricts}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.cityTownVillage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City / Town / Village</FormLabel>
                    <FormControl>
                      <Input placeholder="Dhaka Kotwali" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.streetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="12/A Dhanmondi R/A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.apartment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apartment (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Flat 4B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ─── Submit ─── */}
            <div className="pt-2">
              <HoverButton
                type="submit"
                loading={isLoading}
                className="w-full justify-center"
              >
                {isLoading ? "Registering..." : "Create Individual Account"}
              </HoverButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
