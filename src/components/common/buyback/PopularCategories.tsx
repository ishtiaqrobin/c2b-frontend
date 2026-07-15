"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { categoryService } from "@/services/category.service";
import type { ICategory } from "@/types/category.type";

export default function PopularCategories() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await categoryService.getAll({
        isPopular: "true",
        parentId: "null",
        isActive: "true",
        limit: "10",
      });
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        const { data: tree } = await categoryService.getTree();
        if (tree) {
          setCategories(tree.slice(0, 10));
        }
      }
      setIsLoading(false);
    };
    fetch();
  }, []);

  if (isLoading) {
    return (
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Popular Categories
        </h2>
        <div className="flex gap-6 pb-4 overflow-x-auto">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 min-w-25 animate-pulse"
            >
              <div className="w-24 h-24 rounded-full bg-gray-200" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Popular Categories
      </h2>
      <div className="flex overflow-x-auto gap-6 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="flex flex-col items-center gap-3 cursor-pointer group min-w-25"
          >
            <div className="relative w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-103">
              {cat.imageUrl ? (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {cat.name.charAt(0)}
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
