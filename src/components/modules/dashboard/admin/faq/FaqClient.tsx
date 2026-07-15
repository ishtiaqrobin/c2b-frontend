"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, RefreshCw } from "lucide-react";
import type { IFaq } from "@/types/faq.type";
import FaqTable from "./FaqTable";
import FaqDialog from "./FaqDialog";

const PAGE_SIZE = 10;

interface FaqClientProps {
  faqs: IFaq[];
  showInactiveDefault: boolean;
}

export default function FaqClient({
  faqs,
  showInactiveDefault,
}: FaqClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedFaq, setSelectedFaq] = useState<IFaq | null>(null);

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
    setSelectedFaq(null);
    setDialogOpen(true);
  };

  const handleEdit = (faq: IFaq) => {
    setDialogMode("edit");
    setSelectedFaq(faq);
    setDialogOpen(true);
  };

  const filteredFaqs = useMemo(() => {
    if (!query.trim()) return faqs;
    const q = query.toLowerCase();
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        String(f.sortOrder).includes(q),
    );
  }, [faqs, query]);

  const totalPages = Math.max(1, Math.ceil(filteredFaqs.length / PAGE_SIZE));
  const safePage = useMemo(() => {
    return Math.min(page, totalPages);
  }, [page, totalPages]);

  const paginatedFaqs = filteredFaqs.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-3xl font-bold">FAQ Management</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search FAQs..."
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
              <Plus size={16} className="mr-2" /> Add FAQ
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="show-inactive-faqs"
          checked={showInactiveDefault}
          onCheckedChange={handleToggleInactive}
          className="hover:cursor-pointer"
        />
        <label
          htmlFor="show-inactive-faqs"
          className="text-sm font-medium hover:cursor-pointer"
        >
          Show inactive FAQs
        </label>
      </div>

      <FaqTable
        faqs={paginatedFaqs}
        searchQuery={query}
        onEdit={handleEdit}
        onDeleteSuccess={handleSuccess}
        page={safePage}
        totalPages={totalPages}
        total={filteredFaqs.length}
        limit={PAGE_SIZE}
        onPageChange={setPage}
      />

      <FaqDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        faq={selectedFaq}
        mode={dialogMode}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
