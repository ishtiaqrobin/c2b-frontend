"use client";

import { useState, useEffect } from "react";
import { newsService } from "@/services/news.service";
import type { INews } from "@/types/news.type";
import Link from "next/link";

export default function LatestNews() {
  const [news, setNews] = useState<INews[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await newsService.getLatest();
      if (data) setNews(data);
      setIsLoading(false);
    };
    fetch();
  }, []);

  if (isLoading) return null;
  if (news.length === 0) return null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}/${m}/${day}`;
  };

  return (
    <div className="bg-white rounded-lg border border-zinc-200 p-4 mb-8">
      <h3 className="text-lg font-semibold text-[#2c7cba] border-b mb-4">
        Latest News
      </h3>
      <ul className="space-y-3">
        {news.slice(0, 3).map((item) => (
          <li
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm"
          >
            <span className="text-text-primary font-semibold font-mono whitespace-nowrap">
              {formatDate(item.createdAt)}
            </span>

            <Link
              href={`/news/${item.id}`}
              className="text-[#2c7cba] hover:underline underline-offset-2"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
