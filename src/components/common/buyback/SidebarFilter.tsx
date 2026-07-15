"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Package } from "lucide-react";
import type { ICategory } from "@/types/category.type";
import type { IProductVariant } from "@/types/product.type";

interface SidebarFilterProps {
  tree: ICategory[];
  activeSubcategoryId: string | null;
  activeProductId: string | null;
  onSubcategoryChange: (categoryId: string | null) => void;
  onProductChange: (productId: string | null) => void;
  variants?: IProductVariant[];
}

export default function SidebarFilter({
  tree,
  activeSubcategoryId,
  activeProductId,
  onSubcategoryChange,
  onProductChange,
  variants = [],
}: SidebarFilterProps) {
  const [collapsedMains, setCollapsedMains] = useState<Set<string>>(new Set());

  const expandedMains = useMemo(
    () => new Set(tree.map((m) => m.id).filter((id) => !collapsedMains.has(id))),
    [tree, collapsedMains],
  );

  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(new Set());

  const toggleMain = (id: string) => {
    setCollapsedMains((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSub = (id: string) => {
    setExpandedSubs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    onSubcategoryChange(activeSubcategoryId === id ? null : id);
  };

  const productMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const v of variants) {
      const catId = v.product?.category?.id;
      const prodId = v.productId;
      if (!catId || !prodId) continue;
      if (!map.has(catId)) map.set(catId, new Set());
      map.get(catId)!.add(prodId);
    }
    return map;
  }, [variants]);

  const productInfoMap = useMemo(() => {
    const map = new Map<string, Map<string, string>>();
    for (const v of variants) {
      const catId = v.product?.category?.id;
      const prodId = v.productId;
      const name = v.product?.name;
      if (!catId || !prodId || !name) continue;
      if (!map.has(catId)) map.set(catId, new Map());
      if (!map.get(catId)!.has(prodId)) {
        map.get(catId)!.set(prodId, name);
      }
    }
    return map;
  }, [variants]);

  return (
    <div className="flex flex-col gap-1 rounded-lg overflow-hidden border border-gray-200 bg-white">
      {tree.map((main) => {
        const isMainExpanded = expandedMains.has(main.id);
        const subs = (main.children as ICategory[]) || [];
        return (
          <div key={main.id}>
            <button
              onClick={() => toggleMain(main.id)}
              className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                isMainExpanded ? "bg-gray-50" : ""
              }`}
            >
              {isMainExpanded ? (
                <ChevronDown size={16} className="shrink-0 text-gray-400" />
              ) : (
                <ChevronRight size={16} className="shrink-0 text-gray-400" />
              )}
              <span className="truncate">{main.name}</span>
              {subs.length > 0 && (
                <span className="text-[10px] text-gray-400 font-normal ml-auto">
                  {subs.length}
                </span>
              )}
            </button>

            {isMainExpanded && (
              <div className="bg-gray-50/50">
                {subs.map((sub) => {
                  const isSubExpanded = expandedSubs.has(sub.id);
                  const isSubActive = activeSubcategoryId === sub.id;
                  const prodInfo = productInfoMap.get(sub.id);
                  const productCount = productMap.get(sub.id)?.size ?? 0;
                  return (
                    <div key={sub.id}>
                      <button
                        onClick={() => toggleSub(sub.id)}
                        className={`w-full flex items-center gap-2 pl-8 pr-4 py-2.5 text-sm border-b border-gray-100 transition-colors ${
                          isSubActive
                            ? "bg-orange-50 text-[#E85D22] font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {isSubExpanded ? (
                          <ChevronDown
                            size={14}
                            className="shrink-0 text-gray-400"
                          />
                        ) : (
                          <ChevronRight
                            size={14}
                            className="shrink-0 text-gray-400"
                          />
                        )}
                        <span className="truncate">{sub.name}</span>
                        {productCount > 0 && (
                          <span className="text-[10px] text-gray-400 font-normal ml-auto">
                            {productCount}
                          </span>
                        )}
                      </button>

                      {isSubExpanded && prodInfo && prodInfo.size > 0 && (
                        <div className="bg-white border-b border-gray-100">
                          {Array.from(prodInfo.entries()).map(
                            ([prodId, prodName]) => {
                              const isProdActive = activeProductId === prodId;
                              return (
                                <button
                                  key={prodId}
                                  onClick={() =>
                                    onProductChange(
                                      isProdActive ? null : prodId,
                                    )
                                  }
                                  className={`w-full flex items-center gap-2 pl-12 pr-4 py-2 text-xs transition-colors ${
                                    isProdActive
                                      ? "bg-orange-100 text-[#E85D22] font-semibold"
                                      : "text-gray-600 hover:bg-gray-50"
                                  }`}
                                >
                                  <Package
                                    size={12}
                                    className="shrink-0 text-gray-400"
                                  />
                                  <span className="truncate">{prodName}</span>
                                </button>
                              );
                            },
                          )}
                        </div>
                      )}
                      {isSubExpanded && (!prodInfo || prodInfo.size === 0) && (
                        <div className="pl-12 pr-4 py-2 text-xs text-gray-400 bg-white border-b border-gray-100">
                          No products
                        </div>
                      )}
                    </div>
                  );
                })}
                {subs.length === 0 && (
                  <div className="pl-8 pr-4 py-2 text-xs text-gray-400 border-b border-gray-100">
                    No subcategories
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      {tree.length === 0 && (
        <div className="px-4 py-3 text-sm text-gray-500">No categories</div>
      )}
    </div>
  );
}
