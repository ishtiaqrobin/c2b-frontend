"use client";

import { useState, useEffect } from "react";
import { env } from "@/env";
import WarningBanner from "./WarningBanner";
import type { ICategoryCheckItem } from "@/types/checkItem.type";

interface WarningBannerByCategoryProps {
  categoryId: string;
}

export default function WarningBannerByCategory({
  categoryId,
}: WarningBannerByCategoryProps) {
  const [items, setItems] = useState<ICategoryCheckItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    fetch(`${env.NEXT_PUBLIC_API_URL}/check-items/category/${categoryId}`)
      .then((res) => res.json())
      .then((json) => {
        setItems(json?.data ?? []);
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryId]);

  if (!categoryId) return null;

  return <WarningBanner items={items} loading={loading} />;
}
