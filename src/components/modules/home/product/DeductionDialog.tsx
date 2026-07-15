"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { IVariantDeduction } from "@/types/product.type";

const formatPrice = (value: number | null | undefined, currency: string) => {
  if (value === null || value === undefined) return null;
  return `${new Intl.NumberFormat("en-US").format(value)} ${currency}`;
};

interface DeductionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  condition: "NEW" | "USED";
  quantity: number;
  formattedBasePrice: string | null;
  applicableDeductions: IVariantDeduction[];
  selectedDeductionIds: Set<string>;
  toggleDeduction: (id: string) => void;
  finalPrice: number | null;
  formattedFinalPrice: string | null;
  handleConfirmDeductions: () => void;
  currency: string;
}

export default function DeductionDialog({
  open,
  onOpenChange,
  title,
  condition,
  quantity,
  formattedBasePrice,
  applicableDeductions,
  selectedDeductionIds,
  toggleDeduction,
  finalPrice,
  formattedFinalPrice,
  handleConfirmDeductions,
  currency,
}: DeductionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg text-text-primary">
            {title}
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            {condition === "NEW" ? "New" : "Second-hand"} &middot; Qty:{" "}
            {quantity} &middot; Base: {formattedBasePrice}
          </DialogDescription>
        </DialogHeader>

        {applicableDeductions.length > 0 && (
          <div className="space-y-3 py-2">
            <p className="text-sm font-semibold text-text-primary">
              Select applicable deductions
            </p>
            {applicableDeductions.map((d) => (
              <label
                key={d.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2.5 cursor-pointer hover:bg-accent/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    checked={selectedDeductionIds.has(d.id)}
                    onCheckedChange={() => toggleDeduction(d.id)}
                  />
                  <span className="text-sm text-text-primary">{d.label}</span>
                </div>
                <span className="text-sm font-semibold text-red-600 shrink-0">
                  -{formatPrice(d.amount, currency)}
                </span>
              </label>
            ))}
          </div>
        )}

        {finalPrice != null && (
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-semibold text-text-primary">
              Final price
            </span>
            <span className="text-md font-semibold text-red-600">
              {formattedFinalPrice}
            </span>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className=""
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmDeductions} className="">
            Confirmed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
