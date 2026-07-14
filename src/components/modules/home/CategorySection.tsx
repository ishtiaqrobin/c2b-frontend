"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Grid3X3, Loader2 } from "lucide-react";
import { categoryService } from "@/services/category.service";
import type { ICategory } from "@/types/category.type";

const GRADIENTS = [
  "from-blue-500/80 to-blue-600/80",
  "from-emerald-500/80 to-emerald-600/80",
  "from-violet-500/80 to-violet-600/80",
  "from-amber-500/80 to-amber-600/80",
  "from-rose-500/80 to-rose-600/80",
  "from-cyan-500/80 to-cyan-600/80",
  "from-fuchsia-500/80 to-fuchsia-600/80",
  "from-teal-500/80 to-teal-600/80",
];

function getGradient(index: number) {
  return GRADIENTS[index % GRADIENTS.length];
}

function getChildCount(cat: ICategory): number {
  return cat.children?.length || 0;
}

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
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-4">
              <Grid3X3 className="h-4 w-4" />
              Categories
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Explore What We Offer
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our curated categories to find exactly what you need.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-4"
          >
            <Grid3X3 className="h-4 w-4" />
            Categories
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Explore What We Offer
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Browse our curated categories to find exactly what you need.
          </motion.p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Link href={`/categories/${category.slug}`}>
                <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer">
                  {/* Image or Gradient Background */}
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${getGradient(index)}`}
                    />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">
                      {category.name}
                    </h3>
                    {getChildCount(category) > 0 && (
                      <span className="text-white/70 text-xs">
                        {getChildCount(category)} subcategories
                      </span>
                    )}
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* See All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline decoration-2 underline-offset-4"
          >
            See All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
