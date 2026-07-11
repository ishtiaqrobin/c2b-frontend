"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// --- ডামি স্লাইড ডেটা ---
const slides = [
  {
    id: 1,
    title: "店頭買取",
    subtitle: "即現金化・無料査定・大量買取",
    description:
      "直接売りたいなら、近くの買取商店のお店で商品の査定から支払いまてその場で完結。",
    locations: "新大久保店、秋葉原店、池袋店、赤羽店",
    bgColor: "bg-[#ebd1b0]",
    image: "/illustration-1.png",
  },
  {
    id: 2,
    title: "郵送買取",
    subtitle: "全国対応・送料無料・スピード査定",
    description:
      "ご自宅から商品を送るだけで簡単に買取完了。忙しい方におすすめです。",
    locations: "全国どこからでも利用可能",
    bgColor: "bg-[#d1e8b0]",
    image: "/illustration-2.png",
  },
  {
    id: 3,
    title: "法人買取",
    subtitle: "大口対応・在庫処分・高額買取",
    description:
      "余剰在庫や不要になった端末をまとめて買取いたします。お気軽にご相談ください。",
    locations: "専任スタッフが対応いたします",
    bgColor: "bg-[#b0d1e8]",
    image: "/illustration-3.png",
  },
];

export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // স্লাইড চেঞ্জ করার ফাংশন
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  // অটো-প্লে লজিক (৫ সেকেন্ড পরপর চেঞ্জ হবে)
  useEffect(() => {
    if (isHovered) return;

    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide, isHovered]);

  return (
    <div
      className="relative w-full h-[350px] md:h-[400px] overflow-hidden group font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fade Effect Container */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-center px-10 md:px-48 transition-opacity duration-700 ease-in-out ${slide.bgColor} ${
            index === currentIndex
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* Left Side: Text Content */}
          <div
            className={`w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-4 text-[#8a3311] transition-all duration-700 delay-100 ${
              index === currentIndex
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-wider">
              {slide.title}
            </h2>
            <h3 className="text-lg md:text-xl font-medium">{slide.subtitle}</h3>
            <p className="text-sm md:text-base max-w-md text-gray-800 leading-relaxed">
              {slide.description}
            </p>
            <p className="text-sm md:text-base font-semibold pt-2">
              {slide.locations}
            </p>
          </div>

          {/* Right Side: Image/Illustration */}
          <div
            className={`w-full md:w-1/2 flex justify-center mt-6 md:mt-0 transition-all duration-700 delay-200 ${
              index === currentIndex
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            {/* ডামি div এর বদলে আপনার <img /> ট্যাগ ব্যবহার করুন */}
            <div className="w-64 h-48 md:w-96 md:h-64 bg-white/30 rounded-lg flex items-center justify-center shadow-sm border border-white/40">
              <span className="text-[#8a3311] font-medium">
                Illustration Image Here
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 z-20"
      >
        <ChevronLeft className="w-10 h-10 md:w-12 md:h-12" strokeWidth={3} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 z-20"
      >
        <ChevronRight className="w-10 h-10 md:w-12 md:h-12" strokeWidth={3} />
      </button>

      {/* Bottom Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full transition-all duration-300 border-2 border-white ${
              currentIndex === slideIndex
                ? "bg-white scale-110"
                : "bg-transparent hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${slideIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
