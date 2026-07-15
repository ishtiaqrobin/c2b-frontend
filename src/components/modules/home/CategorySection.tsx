"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { categoryService } from "@/services/category.service";
import type { ICategory } from "@/types/category.type";

export default function CategorySection() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await categoryService.getTree();
      if (data) setCategories(data);
      setIsLoading(false);
    };
    fetch();
  }, []);

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">
            Popular Categories
          </h2>
          <div className="flex flex-wrap gap-8 md:gap-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                {/* Skeleton for circular image */}
                <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-gray-200 animate-pulse" />
                {/* Skeleton for text */}
                <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-12 bg-white w-full overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Header */}
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">
          Popular Categories
        </h2>

        {/* Category List */}
        <div className="flex overflow-x-auto pb-4 md:flex-wrap md:overflow-visible gap-6 md:gap-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              // initial={{ opacity: 0, y: 15 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="shrink-0"
            >
              <Link href={`/categories/${category.slug}`}>
                <div className="flex flex-col items-center group cursor-pointer w-24 md:w-32">
                  {/* Circular Image Container */}
                  <div className="relative w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden mb-4 border-2 transition-all shadow-sm group-hover:shadow-md duration-300  group-hover:scale-103">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 96px, 128px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100" /> // Fallback
                    )}
                  </div>

                  {/* Category Title */}
                  <h3 className="text-sm md:text-base font-medium text-gray-900 text-center leading-snug">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
