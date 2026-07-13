import { storeService } from "@/services/store.service";
import StoresClient from "@/components/modules/dashboard/admin/store/StoresClient";

export default async function AdminStoresPage({
  searchParams,
}: {
  searchParams: Promise<{ isActive?: string }>;
}) {
  const params = await searchParams;

  const showInactive = params.isActive === "false";
  const fetchParams = showInactive ? {} : { isActive: "true" };

  const { data: stores } = await storeService.getAll(fetchParams);

  return (
    <div className="space-y-6 min-h-screen">
      <StoresClient
        stores={stores || []}
        showInactiveDefault={showInactive}
      />
    </div>
  );
}
