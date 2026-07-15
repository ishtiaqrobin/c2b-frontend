"use client";

import { useState, useMemo } from "react";
import { LayoutGrid, List, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductVariantCard from "@/components/modules/home/product/ProductVariantCard";
import type { IProductVariant } from "@/types/product.type";
import type { ICategory } from "@/types/category.type";
import Image from "next/image";

interface ProductListProps {
  variants: IProductVariant[];
  category: ICategory | null;
  subcategories: ICategory[];
  activeSubcategoryName: string | null;
  isLoading: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

const storageFilters = ["all", "256GB", "512GB", "1TB", "2TB", "128GB"];

export default function ProductList({
  variants = [],
  category,
  subcategories = [],
  activeSubcategoryName,
  isLoading,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: ProductListProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activeStorage, setActiveStorage] = useState("all");

  const filteredVariants = useMemo(() => {
    if (activeStorage === "all") return variants;
    return variants.filter((v) => v.storage === activeStorage);
  }, [variants, activeStorage]);

  const storageOptions = useMemo(() => {
    const unique = Array.from(
      new Set(
        variants.map((v) => v.storage).filter((s): s is string => Boolean(s)),
      ),
    ).sort();
    return unique;
  }, [variants]);

  const displayStorageFilters =
    storageOptions.length > 0 ? storageOptions : storageFilters;

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-gray-500">
          List of items we buy:{" "}
          <span className="text-gray-900 font-medium">
            {breadcrumbParts.join(" > ") || "All items"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#E85D22] font-medium">
            Update date {formatDate()}
          </span>
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-red-100 rounded-lg p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 text-red-600 font-bold">
          <AlertTriangle size={20} />
          <span>Things to check before selling</span>
        </div>
        <span className="text-xs text-gray-500">*Please read carefully.</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {displayStorageFilters.map((filter, idx) => (
          <button
            key={filter}
            onClick={() => setActiveStorage(filter)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeStorage === filter
                ? "bg-gray-500 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6 animate-pulse"
            >
              <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-gray-200 rounded" />
                <div className="h-3 w-32 bg-gray-200 rounded" />
              </div>
              <div className="space-y-1">
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
              <div className="h-10 w-28 bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredVariants.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500 text-lg font-medium">No items found</p>
          <p className="text-gray-400 text-sm mt-2">
            {activeStorage !== "all"
              ? `No ${activeStorage} items available. Try a different storage size.`
              : "There are no buyback items listed under this category yet."}
          </p>
        </div>
      ) : viewMode === "list" ? (
        <div className="flex flex-col gap-4">
          {filteredVariants.map((variant) => {
            const title = [
              variant.product?.name,
              variant.storage,
              variant.color,
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div
                key={variant.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center gap-6 transition-all hover:shadow-md"
              >
                <div className="relative w-20 h-20 shrink-0 bg-gray-50 rounded-lg p-2">
                  {variant.imageUrl || variant.product?.imageUrl ? (
                    <Image
                      src={variant.imageUrl || variant.product?.imageUrl || ""}
                      alt={title}
                      fill
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                      No img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">{title}</h4>
                  {variant.sku && (
                    <p className="text-xs text-gray-500">JAN: {variant.sku}</p>
                  )}
                  <div className="mt-2 inline-block bg-orange-100 text-[#E85D22] text-xs px-2 py-1 rounded">
                    We are strengthening our purchasing efforts.
                  </div>
                </div>
                <div className="flex flex-row lg:flex-col gap-4 lg:gap-1 text-center lg:text-left w-full lg:w-auto justify-between lg:justify-start mt-4 lg:mt-0 border-t lg:border-t-0 pt-4 lg:pt-0">
                  {variant.newPrice != null && (
                    <div>
                      <p className="text-xs text-gray-500">New Item</p>
                      <p className="font-bold text-red-600">
                        {new Intl.NumberFormat("en-US").format(
                          Number(variant.newPrice),
                        )}{" "}
                        {variant.currency}
                      </p>
                    </div>
                  )}
                  {variant.usedPrice != null && (
                    <div>
                      <p className="text-xs text-gray-500">Used Item</p>
                      <p className="font-bold text-red-600">
                        {new Intl.NumberFormat("en-US").format(
                          Number(variant.usedPrice),
                        )}{" "}
                        {variant.currency}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVariants.map((variant, index) => (
            <div key={variant.id} className="w-full">
              <ProductVariantCard variant={variant} index={index} />
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
