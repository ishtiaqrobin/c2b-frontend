"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, RefreshCw } from "lucide-react";
import type { IAddress, IDivision } from "@/types/address.type";
import AddressTable from "./AddressTable";
import AddressDialog from "./AddressDialog";

const PAGE_SIZE = 10;

interface AddressesClientProps {
  addresses: IAddress[];
  divisions: IDivision[];
}

export default function AddressesClient({
  addresses,
  divisions,
}: AddressesClientProps) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);

  const handleSuccess = () => router.refresh();

  const handleAdd = () => {
    setDialogMode("add");
    setSelectedAddress(null);
    setDialogOpen(true);
  };

  const handleEdit = (address: IAddress) => {
    setDialogMode("edit");
    setSelectedAddress(address);
    setDialogOpen(true);
  };

  const filteredAddresses = useMemo(() => {
    if (!query.trim()) return addresses;
    const q = query.toLowerCase();
    return addresses.filter(
      (a) =>
        a.streetAddress?.toLowerCase().includes(q) ||
        a.cityTownVillage?.toLowerCase().includes(q) ||
        a.recipientName?.toLowerCase().includes(q) ||
        a.label?.toLowerCase().includes(q) ||
        a.district?.nameEn?.toLowerCase().includes(q) ||
        a.type?.toLowerCase().includes(q),
    );
  }, [addresses, query]);

  const totalPages = Math.max(1, Math.ceil(filteredAddresses.length / PAGE_SIZE));
  const safePage = useMemo(
    () => Math.min(page, totalPages),
    [page, totalPages],
  );
  const paginatedAddresses = filteredAddresses.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-3xl font-bold">My Addresses</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search addresses..."
            className="bg-white w-full md:w-[300px]"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hover:cursor-pointer"
              onClick={() => {
                setQuery("");
                setPage(1);
              }}
            >
              <RefreshCw size={16} className="mr-2" /> Reset
            </Button>
            <Button className="hover:cursor-pointer" onClick={handleAdd}>
              <Plus size={16} className="mr-2" /> Add Address
            </Button>
          </div>
        </div>
      </div>

      <AddressTable
        addresses={paginatedAddresses}
        searchQuery={query}
        onEdit={handleEdit}
        onMutationSuccess={handleSuccess}
        page={safePage}
        totalPages={totalPages}
        total={filteredAddresses.length}
        limit={PAGE_SIZE}
        onPageChange={setPage}
      />

      <AddressDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        address={selectedAddress}
        mode={dialogMode}
        divisions={divisions}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
