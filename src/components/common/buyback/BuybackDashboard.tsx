"use client";

import { useMemo } from "react";
import PopularCategories from "./PopularCategories";
import LatestNews from "./LatestNews";
import SidebarFilter from "./SidebarFilter";
import ProductList from "./ProductList";
import type { IProductVariant } from "@/types/product.type";
import type { ICategory } from "@/types/category.type";

interface BuybackDashboardProps {
  category: ICategory | null;
  categoryTree: ICategory[];
  subcategories: ICategory[];
  sidebarVariants: IProductVariant[];
  variants: IProductVariant[];
  activeSubcategoryId: string | null;
  activeSubcategoryName: string | null;
  activeProductId: string | null;
  onSubcategoryChange: (categoryId: string | null) => void;
  onProductChange: (productId: string | null) => void;
  isLoading: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

export default function BuybackDashboard({
  category,
  categoryTree = [],
  subcategories = [],
  sidebarVariants = [],
  variants = [],
  activeSubcategoryId,
  activeSubcategoryName,
  activeProductId,
  onSubcategoryChange,
  onProductChange,
  isLoading,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: BuybackDashboardProps) {
  const sidebarTree = useMemo(() => {
    if (!category) return categoryTree;
    return categoryTree.filter((main) => main.slug === category.slug);
  }, [categoryTree, category]);

  return (
    <div className="min-h-screen bg-[#F4F7F6] py-10">
      <div className="container-custom mx-auto px-4 md:px-8">
        <PopularCategories />
        <div className="mt-8">
          <LatestNews />
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <aside className="w-full lg:w-1/4 lg:sticky lg:top-28 shrink-0">
              {(category || categoryTree.length > 0) && (
                <SidebarFilter
                  tree={sidebarTree}
                  activeSubcategoryId={activeSubcategoryId}
                  activeProductId={activeProductId}
                  onSubcategoryChange={onSubcategoryChange}
                  onProductChange={onProductChange}
                  variants={sidebarVariants}
                />
              )}
            </aside>
            <main className="w-full lg:w-3/4">
              <ProductList
                variants={variants}
                category={category}
                subcategories={subcategories}
                activeSubcategoryName={activeSubcategoryName}
                activeProductId={activeProductId}
                isLoading={isLoading}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={onLoadMore}
                checkItems={category?.checkItems}
              />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
