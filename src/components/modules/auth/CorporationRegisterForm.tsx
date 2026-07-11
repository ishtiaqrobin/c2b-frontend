"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import {
  registerCorporationSchema,
  type RegisterCorporationFormValues,
} from "@/lib/validation";
import { registerCorporationAction } from "@/actions/user.action";

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

  return (
    <Card className="p-0 bg-slate-50/60 animate-in fade-in slide-in-from-bottom-4 duration-500 border-none">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-slate-800">
          Corporation Registration
        </h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* ─── Account Information ─── */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-600">
                Account Information
              </h4>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Holder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Account display name" {...field} />
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
                        placeholder="contact@company.com"
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
            </div>

            {/* ─── Company Information ─── */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-600">
                Company Information
              </h4>

              <FormField
                control={form.control}
                name="company.companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corporation Ltd." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company.companyTelephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Telephone</FormLabel>
                    <FormControl>
                      <Input placeholder="0212345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company.companyPostCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Post Code</FormLabel>
                    <FormControl>
                      <Input placeholder="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Division (standalone — not a form field) */}
              <div className="space-y-2">
                <FormLabel>Company Division</FormLabel>
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
                name="company.companyDistrictId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company District</FormLabel>
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
                name="company.companyCityTownVillage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company City / Town / Village</FormLabel>
                    <FormControl>
                      <Input placeholder="Chiyoda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company.companyStreetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="1-2-3 Marunouchi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company.companyApartment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Apartment (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Tower A, 10F" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ─── Contact Person ─── */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-600">
                Person In Charge Information
              </h4>

              <FormField
                control={form.control}
                name="contact.contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Taro Yamada" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact.contactTelephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Telephone</FormLabel>
                    <FormControl>
                      <Input placeholder="09012345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact.contactDateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact.contactSex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Sex</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                name="contact.contactOccupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Occupation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select occupation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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

              <FormField
                control={form.control}
                name="contact.contactPostCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Post Code</FormLabel>
                    <FormControl>
                      <Input placeholder="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Division (standalone — not a form field) */}
              <div className="space-y-2">
                <FormLabel>Contact Division</FormLabel>
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
                name="contact.contactDistrictId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact District</FormLabel>
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
                name="contact.contactCityTownVillage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact City / Town / Village</FormLabel>
                    <FormControl>
                      <Input placeholder="Chiyoda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact.contactStreetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="1-2-3 Marunouchi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact.contactApartment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Apartment (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Tower A, 10F" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ─── Bank Account ─── */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-600 ">
                Bank Account Information
              </h4>

              <FormField
                control={form.control}
                name="contact.bankAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dutch Bangla Bank" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact.bankAccountBranch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <FormControl>
                      <Input placeholder="Shinjuku Branch" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact.bankAccountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BANK_ACCOUNT_TYPE_OPTIONS.map((opt) => (
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
                name="contact.bankAccountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact.bankAccountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Holder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corporation Ltd." {...field} />
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
                {isLoading ? "Registering..." : "Create Corporation Account"}
              </HoverButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
