"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { buybackFeatureService } from "@/services/buybackFeature.service";
import type { IBuybackFeature } from "@/types/buybackFeature.type";

export default function BuybackFeatures() {
  const [features, setFeatures] = useState<IBuybackFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      const { data } = await buybackFeatureService.getAll();
      if (data && data.length > 0) {
        setFeatures(data);
      }
      setIsLoading(false);
    };
    fetchFeatures();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-96 bg-gray-200 rounded animate-pulse mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-start text-left">
                <div className="mb-6 w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (features.length === 0) return null;

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12">
          Here&apos;s what makes our buyback shop different.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-start text-left"
            >
              <div className="mb-6 relative w-24 h-24 shrink-0">
                <Image
                  src={feature.imageUrl}
                  alt={feature.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-4 leading-snug">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
