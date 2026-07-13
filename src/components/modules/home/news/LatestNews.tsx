"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { newsService } from "@/services/news.service";
import type { INews } from "@/types/news.type";

export default function LatestNews() {
  const [news, setNews] = useState<INews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsService.getLatest().then(({ data, error }) => {
      if (data) setNews(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto py-12 px-4 font-sans">
      {/* Main Heading */}
      <h2 className="text-2xl md:text-[28px] font-medium text-center text-gray-600 mb-8">
        We will bring you the latest information.
      </h2>

      {/* News Box Container */}
      <div className="border border-gray-300 bg-white rounded-sm">
        {/* Header Area */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-[#2b6ba3] text-lg font-bold">Latest News</h3>
        </div>

        {/* Scrollable Content Area */}
        <ScrollArea className="h-[260px] w-full">
          <div className="p-6">
            {loading ? (
              <p className="text-slate-400 text-sm">Loading news...</p>
            ) : news.length === 0 ? (
              <p className="text-slate-400 text-sm">No news available.</p>
            ) : (
              <ul className="space-y-5">
                {news.map((item) => {
                  const publishedDate = new Date(
                    item.publishedAt,
                  ).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  });
                  return (
                    <li key={item.id} className="flex flex-col space-y-1">
                      {/* Date */}
                      <span className="font-bold text-black text-sm md:text-base">
                        {publishedDate}
                      </span>

                      {/* Title / Link */}
                      <Link
                        href={`/news/${item.id}`}
                        className="text-[#2b6ba3] hover:underline underline-offset-2 text-sm md:text-base leading-snug"
                      >
                        {item.title ?? "Untitled"}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
}
