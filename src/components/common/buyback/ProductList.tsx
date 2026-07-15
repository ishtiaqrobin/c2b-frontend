"use client";

import { useState, useMemo } from "react";
import { LayoutGrid, List, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductVariantCard from "@/components/modules/home/product/ProductVariantCard";
import ProductVariantListItem from "../../modules/home/product/ProductVariantListItem";
import type { IProductVariant } from "@/types/product.type";
import type { ICategory } from "@/types/category.type";
import type { ICategoryCheckItemRef } from "@/types/category.type";
import WarningBanner from "../warning_banner/WarningBanner";

interface ProductListProps {
  variants: IProductVariant[];
  category: ICategory | null;
  subcategories: ICategory[];
  activeSubcategoryName: string | null;
  isLoading: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  checkItems?: ICategoryCheckItemRef[];
}

const storageFilters = ["All", "256GB", "512GB", "1TB", "2TB", "128GB"];

export default function ProductList({
  variants = [],
  category,
  subcategories = [],
  activeSubcategoryName,
  isLoading,
  hasMore,
  isLoadingMore,
  onLoadMore,
  checkItems = [],
}: ProductListProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activeStorage, setActiveStorage] = useState("All");

  const storageOptions = useMemo(() => {
    const unique = Array.from(
      new Set(
        variants.map((v) => v.storage).filter((s): s is string => Boolean(s)),
      ),
    ).sort();
    return unique;
  }, [variants]);

  if (activeStorage !== "All" && !storageOptions.includes(activeStorage)) {
    setActiveStorage("All");
  }

  const filteredVariants = useMemo(() => {
    if (activeStorage === "All") return variants;
    return variants.filter((v) => v.storage === activeStorage);
  }, [variants, activeStorage]);

  const displayStorageFilters = useMemo(() => {
    if (storageOptions.length > 0) {
      return ["All", ...storageOptions];
    }
    return storageFilters;
  }, [storageOptions]);

  const formatDate = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}/${m}/${d}`;
  };

  const breadcrumbParts: string[] = [];
  if (category) {
    breadcrumbParts.push(category.name);
    if (activeSubcategoryName) {
      breadcrumbParts.push(activeSubcategoryName);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="mt-1 text-sm font-semibold text-text-primary">
            List of items we buy: {""}{" "}
            {breadcrumbParts.join(" > ") || "All items"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary font-medium tabular-nums">
            Update date {formatDate()}
          </span>
          <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-background shadow-sm text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-background shadow-sm text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Warning Banner ── */}
      <WarningBanner items={checkItems} />

      {/* ── Storage Filters ── */}
      <div className="flex flex-wrap gap-2">
        {displayStorageFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveStorage(filter)}
            className={`px-2.5 md:px-3 h-9 rounded-md text-sm font-medium transition-all duration-300 ${
              activeStorage === filter
                ? "bg-primary text-primary-foreground border"
                : "bg-gray-200 text-text-primary border"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ── Loading State ── */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-card p-4 rounded-2xl border border-border flex items-center gap-6 animate-pulse"
            >
              <div className="w-20 h-20 bg-muted rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-muted rounded" />
                <div className="h-3 w-32 bg-muted rounded" />
              </div>
              <div className="space-y-1">
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-4 w-20 bg-muted rounded" />
              </div>
              <div className="h-10 w-28 bg-muted rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredVariants.length === 0 ? (
        /* ── Empty State ── */
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <p className="text-text-primary text-lg font-medium">
            No items found
          </p>
          <p className="text-text-secondary text-sm mt-2">
            {activeStorage !== "All"
              ? `No ${activeStorage} items available. Try a different storage size.`
              : "There are no buyback items listed under this category yet."}
          </p>
        </div>
      ) : viewMode === "list" ? (
        /* ── List View ── */
        <div className="flex flex-col gap-4">
          {filteredVariants.map((variant) => (
            <ProductVariantListItem key={variant.id} variant={variant} />
          ))}
        </div>
      ) : (
        /* ── Grid View ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVariants.map((variant, index) => (
            <div key={variant.id} className="w-full">
              <ProductVariantCard variant={variant} index={index} />
            </div>
          ))}
        </div>
      )}

      {/* ── Load More ── */}
      {hasMore && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="rounded-xl border-border text-text-primary hover:bg-accent"
          >
            {isLoadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
