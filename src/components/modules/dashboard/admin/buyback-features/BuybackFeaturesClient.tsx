"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, RefreshCw } from "lucide-react";
import type { IBuybackFeature } from "@/types/buybackFeature.type";
import BuybackFeaturesTable from "./BuybackFeaturesTable";
import BuybackFeaturesDialog from "./BuybackFeaturesDialog";

const PAGE_SIZE = 10;

interface BuybackFeaturesClientProps {
  features: IBuybackFeature[];
}

export default function BuybackFeaturesClient({
  features,
}: BuybackFeaturesClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedFeature, setSelectedFeature] =
    useState<IBuybackFeature | null>(null);

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
    setSelectedFeature(null);
    setDialogOpen(true);
  };

  const handleEdit = (feature: IBuybackFeature) => {
    setDialogMode("edit");
    setSelectedFeature(feature);
    setDialogOpen(true);
  };

  const filteredFeatures = useMemo(() => {
    if (!query.trim()) return features;
    const q = query.toLowerCase();
    return features.filter(
      (f) =>
        f.title?.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q),
    );
  }, [features, query]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFeatures.length / PAGE_SIZE),
  );
  const safePage = useMemo(
    () => Math.min(page, totalPages),
    [page, totalPages],
  );
  const paginatedFeatures = filteredFeatures.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-3xl font-bold">Buyback Features</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search features..."
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
              <Plus size={16} className="mr-2" /> Add Feature
            </Button>
          </div>
        </div>
      </div>

      <BuybackFeaturesTable
        features={paginatedFeatures}
        searchQuery={query}
        onEdit={handleEdit}
        onDeleteSuccess={handleSuccess}
        page={safePage}
        totalPages={totalPages}
        total={filteredFeatures.length}
        limit={PAGE_SIZE}
        onPageChange={setPage}
      />

      <BuybackFeaturesDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        feature={selectedFeature}
        mode={dialogMode}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
