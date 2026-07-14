"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { bannerService } from "@/services/banner.service";
import type { IBanner } from "@/types/banner.type";
import Image from "next/image";

interface BannerCarouselProps {
  categoryId?: string;
}

export default function BannerCarousel({ categoryId }: BannerCarouselProps) {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      const query: { isActive: string; categoryId?: string } = { isActive: "true" };
      if (categoryId) query.categoryId = categoryId;
      const { data } = await bannerService.getAll(query);
      if (data && data.length > 0) {
        setBanners(data);
      }
      setIsLoading(false);
    };
    fetchBanners();
  }, [categoryId]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    if (isHovered || banners.length <= 1) return;
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide, isHovered, banners.length]);

  if (isLoading) {
    return (
      <div className="relative w-full h-87.5 md:h-100 overflow-hidden bg-muted/20 animate-pulse flex items-center justify-center">
        <span className="text-muted-foreground">Loading banners...</span>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div
      className="relative w-full h-87.5 md:h-100 overflow-hidden group font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fade Effect Container */}
      {banners.map((banner, index) => (
        <a
          key={banner.id}
          href={banner.linkUrl || undefined}
          target={banner.linkUrl ? "_blank" : undefined}
          rel={banner.linkUrl ? "noopener noreferrer" : undefined}
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
            index === currentIndex
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <Image
            src={banner.imageUrl}
            alt={`Banner ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </a>
      ))}

      {/* Navigation Arrows - only show if more than 1 banner */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              prevSlide();
            }}
            className="absolute top-1/2 left-4 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 z-20 drop-shadow-lg"
          >
            <ChevronLeft
              className="w-10 h-10 md:w-12 md:h-12"
              strokeWidth={3}
            />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              nextSlide();
            }}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 z-20 drop-shadow-lg"
          >
            <ChevronRight
              className="w-10 h-10 md:w-12 md:h-12"
              strokeWidth={3}
            />
          </button>
        </>
      )}

      {/* Bottom Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
          {banners.map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={(e) => {
                e.preventDefault();
                goToSlide(slideIndex);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 border-2 border-white ${
                currentIndex === slideIndex
                  ? "bg-white scale-110"
                  : "bg-transparent hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${slideIndex + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
