"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { Pencil, Trash2, Loader2 } from "lucide-react";
import type { IVariantDeduction } from "@/types/product.type";
import {
  createDeductionAction,
  updateDeductionAction,
  deleteDeductionAction,
} from "@/actions/deduction.action";
import DeleteDialog from "@/components/modules/shared/DeleteDialog";

interface DeductionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variantId: string;
  deduction?: IVariantDeduction | null;
  mode: "add" | "edit";
  initialDeductions?: IVariantDeduction[];
  onSuccess?: () => void;
}

interface DeductionFormValues {
  condition: "NEW" | "USED";
  amount: number;
  label: string;
  sortOrder: number;
  isActive: boolean;
}

const fmt = (val: number | null | undefined) =>
  val != null ? val.toLocaleString() : "—";

export default function DeductionDialog({
  open,
  onOpenChange,
  variantId,
  deduction,
  mode,
  initialDeductions = [],
  onSuccess,
}: DeductionDialogProps) {
  const [deductions, setDeductions] =
    useState<IVariantDeduction[]>(initialDeductions);
  const [editingDeduction, setEditingDeduction] =
    useState<IVariantDeduction | null>(deduction ?? null);
  const [showForm, setShowForm] = useState(mode === "edit");

  // Delete state
  const [deleting, setDeleting] = useState<{
    open: boolean;
    deductionId: string | null;
    label: string;
  }>({ open: false, deductionId: null, label: "" });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DeductionFormValues>({
    defaultValues: {
      condition: "NEW",
      amount: 0,
      label: "",
      sortOrder: 0,
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  useEffect(() => {
    setDeductions(initialDeductions);
  }, [initialDeductions]);

  useEffect(() => {
    if (editingDeduction) {
      reset({
        condition: editingDeduction.condition,
        amount: editingDeduction.amount,
        label: editingDeduction.label,
        sortOrder: editingDeduction.sortOrder,
        isActive: Boolean(editingDeduction.isActive),
      });
      setShowForm(true);
    }
  }, [editingDeduction, reset]);

  const startAdd = () => {
    setEditingDeduction(null);
    reset({
      condition: "NEW",
      amount: 0,
      label: "",
      sortOrder: 0,
      isActive: true,
    });
    setShowForm(true);
  };

  const startEdit = (d: IVariantDeduction) => {
    setEditingDeduction(d);
  };

  const cancelForm = () => {
    setEditingDeduction(null);
    setShowForm(false);
    reset({
      condition: "NEW",
      amount: 0,
      label: "",
      sortOrder: 0,
      isActive: true,
    });
  };

  const confirmDelete = (deductionId: string, label: string) => {
    setDeleting({ open: true, deductionId, label });
  };

  const cancelDelete = () =>
    setDeleting({ open: false, deductionId: null, label: "" });

  const doDelete = async () => {
    if (!deleting.deductionId) return;
    try {
      const res = await deleteDeductionAction(deleting.deductionId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Deduction deleted");
      setDeductions((prev) =>
        prev.filter((d) => d.id !== deleting.deductionId),
      );
      cancelDelete();
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const onSubmit = async (values: DeductionFormValues) => {
    const toastId = toast.loading(
      editingDeduction ? "Updating deduction..." : "Creating deduction...",
    );

    try {
      if (editingDeduction) {
        const res = await updateDeductionAction(editingDeduction.id, {
          condition: values.condition,
          amount: values.amount,
          label: values.label,
          sortOrder: values.sortOrder,
          isActive: values.isActive,
        });
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("Deduction updated", { id: toastId });
        setDeductions((prev) =>
          prev.map((d) =>
            d.id === editingDeduction.id
              ? { ...d, ...res.data }
              : d,
          ),
        );
      } else {
        const res = await createDeductionAction(variantId, {
          condition: values.condition,
          amount: values.amount,
          label: values.label,
          sortOrder: values.sortOrder,
          isActive: values.isActive,
        });
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("Deduction created", { id: toastId });
        if (res.data) {
          setDeductions((prev) => [...prev, res.data!]);
        }
      }

      cancelForm();
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed", {
        id: toastId,
      });
    }
  };

  const handleClose = () => {
    cancelForm();
    setEditingDeduction(null);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Deductions</DialogTitle>
            <DialogDescription>
              Add, edit, or remove deduction rules for this variant.
            </DialogDescription>
          </DialogHeader>

          {/* Existing deductions list */}
          {deductions.length > 0 && !showForm && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Existing deductions ({deductions.length})
              </p>
              {deductions.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {d.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {d.condition === "NEW" ? "New" : "Second-hand"} &middot;{" "}
                      {fmt(d.amount)} &middot; Sort: {d.sortOrder}
                      {!d.isActive && (
                        <span className="ml-2 text-destructive">Inactive</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 cursor-pointer"
                      onClick={() => startEdit(d)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => confirmDelete(d.id, d.label)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {deductions.length === 0 && !showForm && (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                No deductions added yet.
              </p>
              <Button
                size="sm"
                onClick={startAdd}
                className="cursor-pointer"
              >
                Add First Deduction
              </Button>
            </div>
          )}

          {/* Add / Edit form */}
          {showForm && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2 border-t">
              <p className="text-sm font-semibold text-foreground">
                {editingDeduction ? "Edit deduction" : "New deduction"}
              </p>

              {/* Condition */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-800">
                  Condition <span className="text-red-500">*</span>
                </label>
                <Select
                  value={watch("condition")}
                  onValueChange={(v) =>
                    setValue("condition", v as "NEW" | "USED", {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="USED">Second-hand</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Label */}
              <div className="space-y-1.5">
                <label
                  htmlFor="deductionLabel"
                  className="text-sm font-medium text-gray-800"
                >
                  Label <span className="text-red-500">*</span>
                </label>
                <Input
                  id="deductionLabel"
                  {...register("label", { required: "Label is required" })}
                  className="bg-white"
                  placeholder="e.g. Screen scratch"
                />
                {errors.label && (
                  <p className="text-xs text-destructive">
                    {errors.label.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label
                  htmlFor="deductionAmount"
                  className="text-sm font-medium text-gray-800"
                >
                  Amount <span className="text-red-500">*</span>
                </label>
                <Input
                  id="deductionAmount"
                  type="number"
                  step="0.01"
                  min={0}
                  {...register("amount", {
                    required: "Amount is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Amount must be non-negative" },
                  })}
                  className="bg-white"
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="text-xs text-destructive">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Sort Order */}
              <div className="space-y-1.5">
                <label
                  htmlFor="deductionSortOrder"
                  className="text-sm font-medium text-gray-800"
                >
                  Sort Order
                </label>
                <Input
                  id="deductionSortOrder"
                  type="number"
                  min={0}
                  step={1}
                  {...register("sortOrder", { valueAsNumber: true })}
                  className="bg-white"
                  placeholder="0"
                />
              </div>

              {/* Is Active */}
              <div className="flex items-center gap-2 pt-1">
                <Switch
                  id="deductionIsActive"
                  checked={isActive ?? true}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                  className="hover:cursor-pointer"
                />
                <label
                  htmlFor="deductionIsActive"
                  className="text-sm font-medium text-gray-800"
                >
                  Active
                </label>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelForm}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  )}
                  {editingDeduction ? "Save Changes" : "Add Deduction"}
                </Button>
              </DialogFooter>
            </form>
          )}

          {/* Show add button when not in form */}
          {!showForm && deductions.length > 0 && (
            <div className="pt-2">
              <Button
                size="sm"
                onClick={startAdd}
                className="cursor-pointer w-full"
              >
                Add Deduction
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <DeleteDialog
        isOpen={deleting.open}
        onClose={cancelDelete}
        onConfirm={doDelete}
        title="Delete Deduction?"
        description={
          <>
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-primary">
              &quot;{deleting.label}&quot;
            </span>
            ?
          </>
        }
      />
    </>
  );
}
