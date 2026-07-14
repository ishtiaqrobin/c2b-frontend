"use client";

import { useState, useEffect } from "react";
import { categoryService } from "@/services/category.service";
import PopularCategoryRow from "@/components/modules/home/product/PopularCategoryRow";
import type { ICategory } from "@/types/category.type";

interface PopularCategoriesSectionProps {
  parentId?: string;
}

export default function PopularCategoriesSection({
  parentId,
}: PopularCategoriesSectionProps) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await categoryService.getAll({
        isPopular: "true",
        parentId: parentId ?? "null",
        isActive: "true",
        limit: "10",
      });
      if (data) setCategories(data);
      setIsLoading(false);
    };
    fetch();
  }, [parentId]);

  if (isLoading) return null;

  if (categories.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 space-y-12">
        {categories.map((cat, i) => (
          <PopularCategoryRow key={cat.id} category={cat} index={i} />
        ))}
      </div>
    </section>
  );
}
