"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  checkItemFormSchema,
  type CheckItemFormValues,
} from "@/validations/checkItem.validation";
import type { ICategoryCheckItem } from "@/types/checkItem.type";
import type { ICategory } from "@/types/category.type";
import {
  createCheckItemAction,
  updateCheckItemAction,
} from "@/actions/checkItem.action";

interface CheckItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: ICategoryCheckItem | null;
  categories: ICategory[];
  mode: "add" | "edit";
  onSuccess?: () => void;
}

export default function CheckItemsDialog({
  open,
  onOpenChange,
  item,
  categories,
  mode,
  onSuccess,
}: CheckItemsDialogProps) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckItemFormValues>({
    resolver: zodResolver(checkItemFormSchema) as Resolver<CheckItemFormValues>,
    defaultValues: {
      categoryId: "",
      content: "",
      sortOrder: 0,
    },
  });

  const sortOrder = watch("sortOrder");
  const selectedCategoryId = watch("categoryId");

  useEffect(() => {
    if (open) {
      if (mode === "edit" && item) {
        reset({
          categoryId: item.categoryId || "",
          content: item.content || "",
          sortOrder: item.sortOrder ?? 0,
        });
      } else if (mode === "add") {
        reset({
          categoryId: "",
          content: "",
          sortOrder: 0,
        });
      }
    }
  }, [open, mode, item, reset]);

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: CheckItemFormValues) => {
    setSaving(true);
    const toastId = toast.loading(
      mode === "add" ? "Creating check item..." : "Updating check item...",
    );

    try {
      if (mode === "add") {
        const res = await createCheckItemAction({
          categoryId: values.categoryId,
          content: values.content.trim(),
          sortOrder: values.sortOrder ?? 0,
        });
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("Check item created successfully", { id: toastId });
      } else if (mode === "edit" && item?.id) {
        const res = await updateCheckItemAction(item.id, {
          content: values.content.trim(),
          sortOrder: values.sortOrder ?? 0,
        });
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("Check item updated successfully", { id: toastId });
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Operation failed", {
        id: toastId,
      });
    } finally {
      setSaving(false);
    }
  };

  const isEdit = mode === "edit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Check Item" : "Add New Check Item"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the check item details."
              : "Add a new check item for a category."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Category */}
          <div className="space-y-1.5">
            <Label
              htmlFor="categoryId"
              className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
            >
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedCategoryId}
              onValueChange={(val) => setValue("categoryId", val)}
              disabled={isEdit}
            >
              <SelectTrigger className="bg-white w-full h-10 rounded-xl">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent position="popper">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
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

          {/* Content */}
          <div className="space-y-1.5">
            <Label
              htmlFor="content"
              className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
            >
              Content <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              {...register("content")}
              className="rounded-xl min-h-24 bg-white"
              placeholder="Enter check item content"
            />
            {errors.content && (
              <p className="text-xs text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Sort Order */}
          <div className="space-y-1.5">
            <Label
              htmlFor="sortOrder"
              className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
            >
              Sort Order
            </Label>
            <Input
              id="sortOrder"
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) =>
                setValue("sortOrder", parseInt(e.target.value) || 0)
              }
              placeholder="0"
              className="rounded-xl h-10"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
