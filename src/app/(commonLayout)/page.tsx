"use client";

import BannerCarousel from "@/components/modules/home/banner/BannerCarousel";
import LatestNews from "@/components/modules/home/news/LatestNews";

export default function Home() {
  return (
    <div className="min-h-screen">
      <BannerCarousel />
      <LatestNews />
    </div>
  );
}
