"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Package } from "lucide-react";
import type { ICategory } from "@/types/category.type";
import type { IProductVariant } from "@/types/product.type";

interface SidebarFilterProps {
  tree: ICategory[];
  activeSubcategoryId: string | null;
  activeProductId: string | null;
  onSubcategoryChange: (categoryId: string | null) => void;
  onProductChange: (productId: string | null) => void;
  variants?: IProductVariant[];
  filterByResults?: boolean;
}

const chevronStyle = (isOpen: boolean) =>
  ({
    display: "inline-block",
    transition: "transform 350ms cubic-bezier(0.25, 1, 0.5, 1)",
    transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
  }) as React.CSSProperties;

const accordionTransition = {
  duration: 0.35,
  ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
};

export default function SidebarFilter({
  tree,
  activeSubcategoryId,
  activeProductId,
  onSubcategoryChange,
  onProductChange,
  variants = [],
  filterByResults = false,
}: SidebarFilterProps) {
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);

  const toggleSub = (id: string) => {
    setExpandedSubId((prev) => (prev === id ? null : id));
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

  const filteredTree = useMemo(() => {
    if (!filterByResults) return tree;
    return tree
      .map((main) => ({
        ...main,
        children: (main.children as ICategory[] | undefined)?.filter(
          (sub) => (productMap.get(sub.id)?.size ?? 0) > 0,
        ),
      }))
      .filter(
        (main) => (main.children as ICategory[] | undefined)?.length ?? 0 > 0,
      );
  }, [tree, filterByResults, productMap]);

  return (
    <div className="sticky top-0 flex flex-col gap-1 rounded-lg overflow-hidden border border-gray-200 bg-white">
      {filteredTree.map((main) => {
        const subs = (main.children as ICategory[]) || [];
        return (
          <div key={main.id}>
            <div className="px-4 py-3 text-sm font-bold text-gray-800 border-b border-gray-100 bg-gray-50">
              <span className="truncate">{main.name}</span>
              {subs.length > 0 && (
                <span className="text-[10px] text-gray-400 font-normal ml-auto float-right">
                  {subs.length}
                </span>
              )}
            </div>

            <div className="bg-gray-50/50">
              {subs.map((sub) => {
                const isSubExpanded = expandedSubId === sub.id;
                const isSubActive = activeSubcategoryId === sub.id;
                const prodInfo = productInfoMap.get(sub.id);
                const productCount = productMap.get(sub.id)?.size ?? 0;
                return (
                  <div key={sub.id}>
                    <button
                      onClick={() => toggleSub(sub.id)}
                      className={`w-full flex items-center gap-2 pl-8 pr-4 py-2.5 text-sm border-b border-gray-100 transition-colors ${
                        isSubActive
                          ? "bg-primary-100 text-primary"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <ChevronDown
                        size={14}
                        className="shrink-0 text-gray-400"
                        style={chevronStyle(isSubExpanded)}
                      />
                      <span className="truncate">{sub.name}</span>
                      {productCount > 0 && (
                        <span className="text-[10px] text-gray-400 font-normal ml-auto">
                          {productCount}
                        </span>
                      )}
                    </button>

                    <motion.div
                      initial={false}
                      animate={
                        isSubExpanded
                          ? { height: "auto", opacity: 1 }
                          : { height: 0, opacity: 0 }
                      }
                      transition={accordionTransition}
                      style={{ overflow: "hidden" }}
                    >
                      {prodInfo && prodInfo.size > 0 && (
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
                                      ? "bg-primary-50 text-primary"
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
                      {(!prodInfo || prodInfo.size === 0) && (
                        <div className="pl-12 pr-4 py-2 text-xs text-gray-400 bg-white border-b border-gray-100">
                          No products
                        </div>
                      )}
                    </motion.div>
                  </div>
                );
              })}
              {subs.length === 0 && (
                <div className="pl-8 pr-4 py-2 text-xs text-gray-400 border-b border-gray-100">
                  No subcategories
                </div>
              )}
            </div>
          </div>
        );
      })}
      {tree.length === 0 && (
        <div className="px-4 py-3 text-sm text-gray-500">No categories</div>
      )}
    </div>
  );
}
