"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { PackageSearch, Share2, Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import type { IProductVariant } from "@/types/product.type";

interface ProductVariantListItemProps {
  variant: IProductVariant;
}

const formatPrice = (value: number | null | undefined, currency: string) => {
  if (value === null || value === undefined) return null;
  return `${new Intl.NumberFormat("en-US").format(value)} ${currency}`;
};

export default function ProductVariantListItem({
  variant,
}: ProductVariantListItemProps) {
  const availableConditions = useMemo(() => {
    const list: Array<"NEW" | "USED"> = [];
    if (variant.newPrice !== null && variant.newPrice !== undefined)
      list.push("NEW");
    if (variant.usedPrice !== null && variant.usedPrice !== undefined)
      list.push("USED");
    return list;
  }, [variant.newPrice, variant.usedPrice]);

  const [condition, setCondition] = useState<"NEW" | "USED">(
    availableConditions[0] ?? "NEW",
  );
  const [quantity, setQuantity] = useState(1);

  const [deductionOpen, setDeductionOpen] = useState(false);
  const [selectedDeductionIds, setSelectedDeductionIds] = useState<Set<string>>(
    new Set(),
  );
  const [confirmed, setConfirmed] = useState(false);

  const imageSrc = variant.imageUrl || variant.product?.imageUrl || null;

  const productName = variant.product?.name || "Product";
  const variantLabel = [variant.storage, variant.color]
    .filter(Boolean)
    .join(" ");
  const title = variantLabel ? `${productName} ${variantLabel}` : productName;

  const basePrice = condition === "NEW" ? variant.newPrice : variant.usedPrice;
  const formattedBasePrice = formatPrice(basePrice, variant.currency);

  const maxQty = variant.maxQuantityPerOrder ?? undefined;

  const applicableDeductions = useMemo(() => {
    if (!variant.deductions) return [];
    return variant.deductions.filter((d) => d.condition === condition);
  }, [variant.deductions, condition]);

  const totalDeduction = useMemo(() => {
    let sum = 0;
    for (const d of applicableDeductions) {
      if (selectedDeductionIds.has(d.id)) {
        sum += Number(d.amount);
      }
    }
    return sum;
  }, [applicableDeductions, selectedDeductionIds]);

  const finalPrice = basePrice != null ? basePrice - totalDeduction : null;
  const formattedFinalPrice =
    finalPrice != null ? formatPrice(finalPrice, variant.currency) : null;

  const toggleDeduction = (deductionId: string) => {
    setSelectedDeductionIds((prev) => {
      const next = new Set(prev);
      if (next.has(deductionId)) {
        next.delete(deductionId);
      } else {
        next.add(deductionId);
      }
      return next;
    });
  };

  const handlePurchaseApplication = () => {
    if (applicableDeductions.length > 0) {
      setConfirmed(false);
      setDeductionOpen(true);
      return;
    }
    toast.info(
      `${title} (${condition === "NEW" ? "New" : "Second-hand"}) x${quantity}${finalPrice != null ? ` \u2014 ${formattedFinalPrice}` : ""} \u2014 purchase flow coming soon`,
    );
  };

  const handleConfirmDeductions = () => {
    setConfirmed(true);
    setDeductionOpen(false);
    const selectedLabels = applicableDeductions
      .filter((d) => selectedDeductionIds.has(d.id))
      .map((d) => d.label);
    const deductionSummary =
      selectedLabels.length > 0
        ? ` (deductions: ${selectedLabels.join(", ")})`
        : "";
    toast.info(
      `${title} (${condition === "NEW" ? "New" : "Second-hand"}) x${quantity}${formattedFinalPrice ? ` \u2014 ${formattedFinalPrice}` : ""}${deductionSummary} \u2014 purchase flow coming soon`,
    );
  };

  const openDeductionPopup = () => {
    setSelectedDeductionIds(new Set());
    setConfirmed(false);
    setDeductionOpen(true);
  };

  return (
    <>
      <div className="group relative flex flex-col lg:flex-row items-start lg:items-center gap-4 bg-card p-4 rounded-lg border border-border transition-all duration-300 hover:shadow-md">
        {/* Share button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (navigator.share) {
              navigator
                .share({ title, url: window.location.href })
                .catch(() => {});
            } else {
              navigator.clipboard?.writeText(window.location.href);
              toast.success("Link copied");
            }
          }}
          className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 backdrop-blur-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Share"
        >
          <Share2 className="h-3.5 w-3.5" />
        </button>

        {/* Image */}
        <div className="relative w-20 h-20 shrink-0 bg-muted/40 rounded-lg p-2">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-contain mix-blend-multiply"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <PackageSearch className="h-8 w-8 text-text-secondary/30" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 w-full lg:w-auto">
          <h4 className="font-semibold text-text-primary truncate">{title}</h4>
          {variant.sku && (
            <p className="text-xs text-text-secondary">Code: {variant.sku}</p>
          )}

          {/* Condition selector */}
          {availableConditions.length > 0 && (
            <RadioGroup
              value={condition}
              onValueChange={(v) => {
                setCondition(v as "NEW" | "USED");
                setSelectedDeductionIds(new Set());
                setConfirmed(false);
              }}
              className="flex flex-row gap-4 mt-2"
            >
              {availableConditions.map((c) => {
                const price =
                  c === "NEW" ? variant.newPrice : variant.usedPrice;
                return (
                  <div key={c} className="flex items-center gap-1.5">
                    <RadioGroupItem value={c} id={`list-${variant.id}-${c}`} />
                    <Label
                      htmlFor={`list-${variant.id}-${c}`}
                      className="text-xs font-normal text-text-primary cursor-pointer"
                    >
                      {c === "NEW" ? "New" : "Second Hand"}
                    </Label>
                    <span className="text-sm font-semibold leading-snug line-clamp-2 text-red-600">
                      {formatPrice(price, variant.currency)}
                    </span>
                  </div>
                );
              })}
            </RadioGroup>
          )}

          {availableConditions.length === 0 && (
            <p className="text-xs text-text-secondary mt-2">
              Price not available
            </p>
          )}

          {/* Confirmed deduction summary */}
          {confirmed && selectedDeductionIds.size > 0 && (
            <div className="mt-2 p-2 rounded-md bg-primary/5 border border-primary/10">
              <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-0.5">
                Deductions applied
              </p>
              {applicableDeductions
                .filter((d) => selectedDeductionIds.has(d.id))
                .map((d) => (
                  <p
                    key={d.id}
                    className="text-[11px] text-text-secondary flex justify-between"
                  >
                    <span>{d.label}</span>
                    <span>-{formatPrice(d.amount, variant.currency)}</span>
                  </p>
                ))}
              {finalPrice != null && (
                <p className="text-xs font-bold text-text-primary flex justify-between border-t border-primary/10 mt-1 pt-1">
                  <span>Final price</span>
                  <span>{formattedFinalPrice}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-row lg:flex-col items-center lg:items-stretch gap-2 w-full lg:w-auto lg:min-w-[160px]">
          {formattedBasePrice && maxQty && (
            <p className="text-[10px] text-text-secondary text-center lg:text-left">
              Max {maxQty} per order
            </p>
          )}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={maxQty}
              value={quantity}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (Number.isNaN(v)) return setQuantity(1);
                setQuantity(maxQty ? Math.min(v, maxQty) : v);
              }}
              className="h-8 w-16 text-xs px-2 rounded-md"
              aria-label="Quantity"
            />
            <Button
              size="sm"
              disabled={availableConditions.length === 0}
              onClick={
                confirmed ? openDeductionPopup : handlePurchaseApplication
              }
              className="flex-1 h-8 text-xs whitespace-nowrap rounded-md"
            >
              {confirmed ? "Update" : "Purchase application"}
            </Button>
          </div>
        </div>
      </div>

      {/* Deduction selection dialog */}
      <Dialog open={deductionOpen} onOpenChange={setDeductionOpen}>
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
                    -{formatPrice(d.amount, variant.currency)}
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
              onClick={() => setDeductionOpen(false)}
              className="rounded-md"
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmDeductions} className="rounded-md">
              <Check className="mr-1.5 h-4 w-4" />
              Confirmed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
