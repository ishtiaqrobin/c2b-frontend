"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Loader2, MoreHorizontal, Pencil, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IAddress } from "@/types/address.type";
import {
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/actions/address.action";
import DeleteDialog from "@/components/modules/shared/DeleteDialog";
import TablePagination from "@/components/modules/shared/TablePagination";

interface AddressTableProps {
  addresses: IAddress[];
  loading?: boolean;
  searchQuery?: string;
  onEdit: (address: IAddress) => void;
  onMutationSuccess?: () => void;
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const TYPE_STYLES: Record<string, string> = {
  HOME: "bg-blue-100 text-blue-700 border-blue-200",
  SHIPPING: "bg-green-100 text-green-700 border-green-200",
  RETURN: "bg-orange-100 text-orange-700 border-orange-200",
  COMPANY: "bg-purple-100 text-purple-700 border-purple-200",
};

export default function AddressTable({
  addresses,
  loading = false,
  searchQuery = "",
  onEdit,
  onMutationSuccess,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: AddressTableProps) {
  const [deleting, setDeleting] = useState<{
    open: boolean;
    addressId: string | null;
    label: string;
  }>({ open: false, addressId: null, label: "" });

  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const handleSetDefault = async (address: IAddress) => {
    if (address.isDefault) return;
    setSettingDefaultId(address.id);
    try {
      const res = await setDefaultAddressAction(address.id);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Default address updated");
      onMutationSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to set default");
    } finally {
      setSettingDefaultId(null);
    }
  };

  const confirmDelete = (address: IAddress) => {
    const label =
      address.label ||
      address.recipientName ||
      address.streetAddress ||
      "this address";
    setDeleting({ open: true, addressId: address.id, label });
  };

  const cancelDelete = () =>
    setDeleting({ open: false, addressId: null, label: "" });

  const doDelete = async () => {
    if (!deleting.addressId) return;
    try {
      const res = await deleteAddressAction(deleting.addressId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Address deleted successfully");
      cancelDelete();
      onMutationSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <>
      <div className="bg-gray-100 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Recipient / Label</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Street Address</TableHead>
              <TableHead>Default</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(4)].map((_, idx) => (
                <TableRow key={`sk-${idx}`} className="align-middle">
                  {[...Array(6)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : addresses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-600"
                >
                  {searchQuery
                    ? "No addresses found matching your search"
                    : "No addresses found. Add your first address!"}
                </TableCell>
              </TableRow>
            ) : (
              addresses.map((address) => (
                <TableRow key={address.id} className="align-middle">
                  {/* Type */}
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        TYPE_STYLES[address.type] ??
                        "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {address.type}
                    </span>
                  </TableCell>

                  {/* Recipient / Label */}
                  <TableCell>
                    <div className="space-y-0.5">
                      {address.recipientName && (
                        <p className="font-medium text-sm">
                          {address.recipientName}
                        </p>
                      )}
                      {address.label && (
                        <p className="text-xs text-muted-foreground">
                          {address.label}
                        </p>
                      )}
                      {address.telephone && (
                        <p className="text-xs text-muted-foreground">
                          {address.telephone}
                        </p>
                      )}
                      {!address.recipientName && !address.label && (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Location */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">
                        {address.cityTownVillage}
                      </p>
                      {address.district && (
                        <p className="text-xs text-muted-foreground">
                          {address.district.nameEn}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {address.postCode}
                      </p>
                    </div>
                  </TableCell>

                  {/* Street Address */}
                  <TableCell>
                    <p className="text-sm line-clamp-2 max-w-[200px]">
                      {address.streetAddress}
                      {address.apartment && `, ${address.apartment}`}
                    </p>
                  </TableCell>

                  {/* Default */}
                  <TableCell>
                    {address.isDefault ? (
                      <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-200 hover:bg-yellow-100">
                        <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
                        Default
                      </Badge>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!address.isDefault && (
                          <DropdownMenuItem
                            onClick={() => handleSetDefault(address)}
                            disabled={settingDefaultId === address.id}
                          >
                            {settingDefaultId === address.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Star className="mr-2 h-4 w-4" />
                            )}
                            Set as Default
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onEdit(address)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => confirmDelete(address)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          pageCount={addresses.length}
          label="addresses"
          onPageChange={onPageChange}
        />
      </div>

      <DeleteDialog
        isOpen={deleting.open}
        onClose={cancelDelete}
        onConfirm={doDelete}
        title="Delete Address?"
        description={
          <>
            This action cannot be undone. Are you sure you want to permanently
            delete{" "}
            <span className="font-semibold text-primary">
              &quot;{deleting.label}&quot;
            </span>
            ?
          </>
        }
      />
    </>
  );
}
