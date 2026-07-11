import AddressesClient from "@/components/modules/dashboard/admin/address/AddressesClient";
import { addressService } from "@/services/address.service";

export default async function AdminAddressesPage() {
  const [{ data: addresses }, { data: divisions }] = await Promise.all([
    addressService.getMyAddresses(),
    addressService.getDivisions(),
  ]);

  return (
    <div className="space-y-6 min-h-screen">
      <AddressesClient
        addresses={addresses ?? []}
        divisions={divisions ?? []}
      />
    </div>
  );
}
