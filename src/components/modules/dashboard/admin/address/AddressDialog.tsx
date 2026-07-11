"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  addressFormSchema,
  type AddressFormValues,
  ADDRESS_TYPES,
} from "@/validations/address.validation";
import type { IAddress, IDistrict, IDivision } from "@/types/address.type";
import {
  createAddressAction,
  updateAddressAction,
} from "@/actions/address.action";
import { env } from "@/env";

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: IAddress | null;
  mode: "add" | "edit";
  divisions: IDivision[];
  onSuccess?: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  HOME: "Home",
  SHIPPING: "Shipping",
  RETURN: "Return",
  COMPANY: "Company",
};

export default function AddressDialog({
  open,
  onOpenChange,
  address,
  mode,
  divisions,
  onSuccess,
}: AddressDialogProps) {
  const [allDistricts, setAllDistricts] = useState<IDistrict[]>([]);
  const [districtsLoading, setDistrictsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      type: "HOME",
      label: "",
      recipientName: "",
      telephone: "",
      postCode: "",
      divisionId: 0,
      districtId: 0,
      cityTownVillage: "",
      streetAddress: "",
      apartment: "",
      isDefault: false,
    },
  });

  const watchedDivisionId = watch("divisionId");
  const watchedDistrictId = watch("districtId");
  const isDefault = watch("isDefault");

  // Fetch all districts once when dialog opens
  const loadDistricts = useCallback(async () => {
    setDistrictsLoading(true);
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/addresses/districts?limit=100`,
      );
      if (!res.ok) throw new Error("Failed to load districts");
      const data = await res.json();
      setAllDistricts(data.data ?? []);
    } catch {
      toast.error("Could not load districts");
    } finally {
      setDistrictsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) loadDistricts();
  }, [open, loadDistricts]);

  // When division changes, reset district selection
  const handleDivisionChange = (value: string) => {
    setValue("divisionId", Number(value), { shouldValidate: true });
    setValue("districtId", 0, { shouldValidate: false });
  };

  // When district is selected
  const handleDistrictChange = (value: string) => {
    setValue("districtId", Number(value), { shouldValidate: true });
  };

  // Populate form when editing
  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && address && allDistricts.length > 0) {
      // Find the division that owns this district
      const district = allDistricts.find((d) => d.id === address.districtId);
      reset({
        type: address.type ?? "HOME",
        label: address.label ?? "",
        recipientName: address.recipientName ?? "",
        telephone: address.telephone ?? "",
        postCode: address.postCode,
        divisionId: district?.divisionId ?? 0,
        districtId: address.districtId,
        cityTownVillage: address.cityTownVillage,
        streetAddress: address.streetAddress,
        apartment: address.apartment ?? "",
        isDefault: address.isDefault,
      });
    } else if (mode === "add") {
      reset({
        type: "HOME",
        label: "",
        recipientName: "",
        telephone: "",
        postCode: "",
        divisionId: 0,
        districtId: 0,
        cityTownVillage: "",
        streetAddress: "",
        apartment: "",
        isDefault: false,
      });
    }
  }, [open, mode, address, allDistricts, reset]);

  // Districts filtered by selected division
  const filteredDistricts =
    watchedDivisionId > 0
      ? allDistricts.filter((d) => d.divisionId === watchedDivisionId)
      : allDistricts;

  const onSubmit = async (values: AddressFormValues) => {
    const toastId = toast.loading(
      mode === "add" ? "Creating address..." : "Updating address...",
    );

    // Strip divisionId — backend doesn't need it
    const { divisionId: _div, ...payload } = values;
    void _div;

    try {
      if (mode === "add") {
        const res = await createAddressAction({
          ...payload,
          label: payload.label || undefined,
          recipientName: payload.recipientName || undefined,
          telephone: payload.telephone || undefined,
          apartment: payload.apartment || undefined,
        });
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("Address created successfully", { id: toastId });
      } else if (mode === "edit" && address?.id) {
        const res = await updateAddressAction(address.id, {
          ...payload,
          label: payload.label || undefined,
          recipientName: payload.recipientName || undefined,
          telephone: payload.telephone || undefined,
          apartment: payload.apartment || undefined,
        });
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("Address updated successfully", { id: toastId });
      }

      onSuccess?.();
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed", {
        id: toastId,
      });
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Address" : "Edit Address"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Fill in the details below to add a new address."
              : "Update your address information."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type + Label */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Address Type
              </label>
              <Select
                value={watch("type") ?? "HOME"}
                onValueChange={(v) =>
                  setValue("type", v as AddressFormValues["type"])
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {ADDRESS_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-xs text-destructive">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="label"
                className="text-sm font-medium text-gray-800"
              >
                Label{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <Input
                id="label"
                {...register("label")}
                className="bg-white"
                placeholder='e.g. "Office", "Parent\&s home"'
              />
              {errors.label && (
                <p className="text-xs text-destructive">
                  {errors.label.message}
                </p>
              )}
            </div>
          </div>

          {/* Recipient + Telephone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="recipientName"
                className="text-sm font-medium text-gray-800"
              >
                Recipient Name{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <Input
                id="recipientName"
                {...register("recipientName")}
                className="bg-white"
                placeholder="Full name"
              />
              {errors.recipientName && (
                <p className="text-xs text-destructive">
                  {errors.recipientName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="telephone"
                className="text-sm font-medium text-gray-800"
              >
                Telephone{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <Input
                id="telephone"
                type="tel"
                {...register("telephone")}
                className="bg-white"
                placeholder="+880 1XXX XXXXXX"
              />
              {errors.telephone && (
                <p className="text-xs text-destructive">
                  {errors.telephone.message}
                </p>
              )}
            </div>
          </div>

          {/* Division + District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Division <span className="text-red-500">*</span>
              </label>
              <Select
                value={watchedDivisionId > 0 ? String(watchedDivisionId) : ""}
                onValueChange={handleDivisionChange}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {divisions.map((div) => (
                    <SelectItem key={div.id} value={String(div.id)}>
                      {div.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.divisionId && (
                <p className="text-xs text-destructive">
                  {errors.divisionId.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                District <span className="text-red-500">*</span>
              </label>
              <Select
                value={watchedDistrictId > 0 ? String(watchedDistrictId) : ""}
                onValueChange={handleDistrictChange}
                disabled={districtsLoading || watchedDivisionId === 0}
              >
                <SelectTrigger className="bg-white">
                  {districtsLoading ? (
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    <SelectValue
                      placeholder={
                        watchedDivisionId === 0
                          ? "Select division first"
                          : "Select district"
                      }
                    />
                  )}
                </SelectTrigger>
                <SelectContent position="popper">
                  {filteredDistricts.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.districtId && (
                <p className="text-xs text-destructive">
                  {errors.districtId.message}
                </p>
              )}
            </div>
          </div>

          {/* Post Code + City/Town/Village */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="postCode"
                className="text-sm font-medium text-gray-800"
              >
                Post Code <span className="text-red-500">*</span>
              </label>
              <Input
                id="postCode"
                {...register("postCode")}
                className="bg-white"
                placeholder="1207"
              />
              {errors.postCode && (
                <p className="text-xs text-destructive">
                  {errors.postCode.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="cityTownVillage"
                className="text-sm font-medium text-gray-800"
              >
                City / Town / Village <span className="text-red-500">*</span>
              </label>
              <Input
                id="cityTownVillage"
                {...register("cityTownVillage")}
                className="bg-white"
                placeholder="Dhaka"
              />
              {errors.cityTownVillage && (
                <p className="text-xs text-destructive">
                  {errors.cityTownVillage.message}
                </p>
              )}
            </div>
          </div>

          {/* Street Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="streetAddress"
              className="text-sm font-medium text-gray-800"
            >
              Street Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="streetAddress"
              {...register("streetAddress")}
              className="bg-white"
              placeholder="House 12, Road 4, Block B"
            />
            {errors.streetAddress && (
              <p className="text-xs text-destructive">
                {errors.streetAddress.message}
              </p>
            )}
          </div>

          {/* Apartment */}
          <div className="space-y-1.5">
            <label
              htmlFor="apartment"
              className="text-sm font-medium text-gray-800"
            >
              Apartment / Suite / Floor{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <Input
              id="apartment"
              {...register("apartment")}
              className="bg-white"
              placeholder="Apt 3A"
            />
            {errors.apartment && (
              <p className="text-xs text-destructive">
                {errors.apartment.message}
              </p>
            )}
          </div>

          {/* Is Default */}
          <div className="flex items-center gap-2 pt-1">
            <Switch
              id="isDefault"
              checked={isDefault ?? false}
              onCheckedChange={(checked) => setValue("isDefault", checked)}
              className="hover:cursor-pointer"
            />
            <label
              htmlFor="isDefault"
              className="text-sm font-medium text-gray-800 hover:cursor-pointer"
            >
              Set as default address
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="hover:cursor-pointer"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="hover:cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "add" ? "Creating..." : "Saving..."}
                </>
              ) : mode === "add" ? (
                "Create Address"
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
