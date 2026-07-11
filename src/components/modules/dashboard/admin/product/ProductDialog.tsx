"use client";

import { useEffect } from "react";
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
import {
  productFormSchema,
  type ProductFormValues,
  generateSlug,
} from "@/validations/product.validation";
import type { IProduct } from "@/types/product.type";
import type { ICategory } from "@/types/category.type";
import {
  createProductAction,
  updateProductAction,
} from "@/actions/product.action";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: IProduct | null;
  mode: "add" | "edit";
  categories: ICategory[];
  onSuccess?: () => void;
}

export default function ProductDialog({
  open,
  onOpenChange,
  product,
  mode,
  categories,
  onSuccess,
}: ProductDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      nameEn: "",
      nameBn: "",
      slug: "",
      categoryId: "",
      imageUrl: "",
      isActive: true,
    },
  });

  const nameEn = watch("nameEn");
  const isActive = watch("isActive");

  // Auto-generate slug from English name in add mode
  useEffect(() => {
    if (mode === "add" && !dirtyFields.slug) {
      setValue("slug", generateSlug(nameEn || ""), { shouldValidate: false });
    }
  }, [nameEn, mode, dirtyFields.slug, setValue]);

  // Populate form in edit mode
  useEffect(() => {
    if (open && mode === "edit" && product) {
      const enT = product.translations?.find((t) => t.locale === "EN");
      const bnT = product.translations?.find((t) => t.locale === "BN");
      reset({
        nameEn: enT?.name || "",
        nameBn: bnT?.name || "",
        slug: product.slug,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl ?? "",
        isActive: Boolean(product.isActive),
      });
    } else if (open && mode === "add") {
      reset({
        nameEn: "",
        nameBn: "",
        slug: "",
        categoryId: "",
        imageUrl: "",
        isActive: true,
      });
    }
  }, [open, mode, product, reset]);

  const onSubmit = async (values: ProductFormValues) => {
    const toastId = toast.loading(
      mode === "add" ? "Creating product..." : "Updating product...",
    );

    const translations: { locale: "EN" | "BN"; name: string }[] = [
      { locale: "EN", name: values.nameEn.trim() },
      ...(values.nameBn?.trim()
        ? [{ locale: "BN" as const, name: values.nameBn.trim() }]
        : []),
    ];

    try {
      if (mode === "add") {
        const res = await createProductAction({
          slug: values.slug,
          categoryId: values.categoryId,
          imageUrl: values.imageUrl || undefined,
          isActive: values.isActive,
          translations,
        });
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("Product created successfully", { id: toastId });
      } else if (mode === "edit" && product?.id) {
        const res = await updateProductAction(product.id, {
          slug: values.slug,
          categoryId: values.categoryId,
          imageUrl: values.imageUrl || undefined,
          isActive: values.isActive,
          translations,
        });
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("Product updated successfully", { id: toastId });
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Fill in the product details below."
              : "Update product information."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name EN */}
          <div className="space-y-1.5">
            <label
              htmlFor="nameEn"
              className="text-sm font-medium text-gray-800"
            >
              Name (English) <span className="text-red-500">*</span>
            </label>
            <Input
              id="nameEn"
              {...register("nameEn")}
              className="bg-white"
              placeholder="Product name in English"
            />
            {errors.nameEn && (
              <p className="text-xs text-destructive">
                {errors.nameEn.message}
              </p>
            )}
          </div>

          {/* Name BN */}
          <div className="space-y-1.5">
            <label
              htmlFor="nameBn"
              className="text-sm font-medium text-gray-800"
            >
              Name (Bangla)
            </label>
            <Input
              id="nameBn"
              {...register("nameBn")}
              className="bg-white"
              placeholder="Product name in Bangla"
            />
            {errors.nameBn && (
              <p className="text-xs text-destructive">
                {errors.nameBn.message}
              </p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label htmlFor="slug" className="text-sm font-medium text-gray-800">
              Slug <span className="text-red-500">*</span>
            </label>
            <Input
              id="slug"
              {...register("slug")}
              className="bg-white font-mono text-sm"
              placeholder="product-slug"
            />
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">
              Category <span className="text-red-500">*</span>
            </label>
            <Select
              value={watch("categoryId")}
              onValueChange={(v) =>
                setValue("categoryId", v, { shouldValidate: true })
              }
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent position="popper">
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.translations?.[0]?.name ?? c.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-xs text-destructive">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label
              htmlFor="imageUrl"
              className="text-sm font-medium text-gray-800"
            >
              Image URL{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <Input
              id="imageUrl"
              {...register("imageUrl")}
              className="bg-white"
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && (
              <p className="text-xs text-destructive">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2">
            <Switch
              id="isActive"
              checked={isActive ?? true}
              onCheckedChange={(checked) => setValue("isActive", checked)}
              className="hover:cursor-pointer"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-800"
            >
              Active
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
              {mode === "add" ? "Create Product" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
