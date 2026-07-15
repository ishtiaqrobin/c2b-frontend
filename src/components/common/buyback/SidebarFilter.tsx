"use client";

import { useMemo } from "react";
import { ChevronDown, Package } from "lucide-react";
import type { ICategory } from "@/types/category.type";
import type { IProductVariant } from "@/types/product.type";

interface SidebarFilterProps {
  mainCategory: ICategory | null;
  subcategories: ICategory[];
  activeSubcategoryId: string | null;
  activeProductId: string | null;
  onSubcategoryChange: (categoryId: string | null) => void;
  onProductChange: (productId: string | null) => void;
  variants?: IProductVariant[];
}

const COLORS = [
  "bg-[#E85D22]",
  "bg-[#0066CC]",
  "bg-[#993399]",
  "bg-[#008080]",
  "bg-[#CC6600]",
  "bg-[#336633]",
];

export default function SidebarFilter({
  mainCategory,
  subcategories,
  activeSubcategoryId,
  activeProductId,
  onSubcategoryChange,
  onProductChange,
  variants = [],
}: SidebarFilterProps) {
  // Group variants by (subcategory ID → product ID → variants)
  const productsBySubcategory = useMemo(() => {
    const map = new Map<string, Map<string, IProductVariant[]>>();
    for (const v of variants) {
      const catId = v.product?.category?.id;
      const prodId = v.productId;
      if (!catId || !prodId || !v.product) continue;
      if (!map.has(catId)) map.set(catId, new Map());
      const prodMap = map.get(catId)!;
      if (!prodMap.has(prodId)) prodMap.set(prodId, []);
      prodMap.get(prodId)!.push(v);
    }
    return map;
  }, [variants]);

  if (!mainCategory) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg overflow-hidden border border-orange-200">
        <div className="bg-[#E85D22] text-white font-bold px-4 py-3">
          {mainCategory.name}
        </div>
        <div className="bg-white flex flex-col">
          {subcategories.length > 0 ? (
            subcategories.map((sub) => {
              const isSubActive = activeSubcategoryId === sub.id;
              const prodMap = productsBySubcategory.get(sub.id);
              const productEntries = prodMap ? Array.from(prodMap.entries()) : [];
              return (
                <div key={sub.id}>
                  <button
                    onClick={() =>
                      onSubcategoryChange(isSubActive ? null : sub.id)
                    }
                    className={`w-full px-4 py-3 border-b flex justify-between items-center text-sm cursor-pointer hover:bg-gray-50 transition-colors ${
                      isSubActive
                        ? "bg-orange-50 text-[#E85D22] font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    <span className="truncate">{sub.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {productEntries.length > 0 && (
                        <span className="text-[10px] text-gray-400 font-normal">
                          {productEntries.length}
                        </span>
                      )}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          isSubActive ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>
                  {isSubActive && productEntries.length > 0 && (
                    <div className="bg-gray-50 border-b border-gray-100">
                      {productEntries.map(([prodId, prodVariants]) => {
                        const name =
                          prodVariants[0]?.product?.name ?? "Unknown";
                        const isProdActive = activeProductId === prodId;
                        return (
                          <button
                            key={prodId}
                            onClick={() =>
                              onProductChange(isProdActive ? null : prodId)
                            }
                            className={`w-full flex items-center gap-2 px-4 py-2 pl-8 text-xs transition-colors ${
                              isProdActive
                                ? "bg-orange-100 text-[#E85D22] font-semibold"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            <Package size={12} className="shrink-0 text-gray-400" />
                            <span className="truncate">{name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {isSubActive && productEntries.length === 0 && (
                    <div className="px-4 py-2 pl-8 text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
                      No products
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              No subcategories
            </div>
          )}
        </div>
      </div>

      {subcategories.slice(0, 3).map((sub, idx) => (
        <button
          key={sub.id}
          onClick={() =>
            onSubcategoryChange(
              activeSubcategoryId === sub.id ? null : sub.id,
            )
          }
          className={`${COLORS[idx % COLORS.length]} text-white font-bold px-4 py-3 rounded-lg cursor-pointer hover:brightness-110 transition-all ${
            activeSubcategoryId === sub.id
              ? "ring-2 ring-white ring-offset-2"
              : ""
          }`}
        >
          {sub.name}
        </button>
      ))}
    </div>
  );
}
