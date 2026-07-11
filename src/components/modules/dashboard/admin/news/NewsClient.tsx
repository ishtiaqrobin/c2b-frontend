"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, RefreshCw } from "lucide-react";
import type { INews } from "@/types/news.type";
import NewsTable from "./NewsTable";
import NewsDialog from "./NewsDialog";

const PAGE_SIZE = 10;

interface NewsClientProps {
  news: INews[];
  showInactiveDefault: boolean;
}

export default function NewsClient({ news, showInactiveDefault }: NewsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedNews, setSelectedNews] = useState<INews | null>(null);

  const handleToggleInactive = (checked: boolean) => {
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.set("isActive", "false");
    } else {
      params.delete("isActive");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setQuery("");
    setPage(1);
    router.push(pathname);
  };

  const handleSuccess = () => {
    router.refresh();
  };

  const handleAdd = () => {
    setDialogMode("add");
    setSelectedNews(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: INews) => {
    setDialogMode("edit");
    setSelectedNews(item);
    setDialogOpen(true);
  };

  const filteredNews = useMemo(() => {
    if (!query.trim()) return news;
    const q = query.toLowerCase();
    return news.filter((item) =>
      item.translations?.some((t) => t.title?.toLowerCase().includes(q)),
    );
  }, [news, query]);

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / PAGE_SIZE));
  const safePage = useMemo(() => Math.min(page, totalPages), [page, totalPages]);
  const paginatedNews = filteredNews.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-3xl font-bold">News Management</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news..."
            className="bg-white w-full md:w-[300px]"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hover:cursor-pointer"
              onClick={handleReset}
            >
              <RefreshCw size={16} className="mr-2" /> Reset
            </Button>
            <Button className="hover:cursor-pointer" onClick={handleAdd}>
              <Plus size={16} className="mr-2" /> Add News
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="show-inactive"
          checked={showInactiveDefault}
          onCheckedChange={handleToggleInactive}
          className="hover:cursor-pointer"
        />
        <label
          htmlFor="show-inactive"
          className="text-sm font-medium hover:cursor-pointer"
        >
          Show inactive news
        </label>
      </div>

      <NewsTable
        news={paginatedNews}
        searchQuery={query}
        onEdit={handleEdit}
        onDeleteSuccess={handleSuccess}
        page={safePage}
        totalPages={totalPages}
        total={filteredNews.length}
        limit={PAGE_SIZE}
        onPageChange={setPage}
      />

      <NewsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        news={selectedNews}
        mode={dialogMode}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
