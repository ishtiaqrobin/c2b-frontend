"use client";

import BannerCarousel from "@/components/modules/home/banner/BannerCarousel";
import CategorySection from "@/components/modules/home/CategorySection";
import PopularCategoriesSection from "@/components/modules/home/product/PopularCategoriesSection";
import LatestNews from "@/components/modules/home/news/LatestNews";
import BuybackFeatures from "../../components/modules/home/buyback_features/BuybackFeatures";
import SearchBar from "@/components/modules/shared/searchbar/SearchBar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <BannerCarousel />
      <SearchBar />
      <CategorySection />
      <PopularCategoriesSection />
      <LatestNews />
      <BuybackFeatures />
    </div>
  );
}
