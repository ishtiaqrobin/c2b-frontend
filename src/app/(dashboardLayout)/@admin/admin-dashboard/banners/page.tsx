import { bannerService } from "@/services/banner.service";
import BannersClient from "@/components/modules/dashboard/admin/banners/BannersClient";

export default async function AdminBannersPage({
  searchParams,
}: {
  searchParams: Promise<{ isActive?: string }>;
}) {
  const params = await searchParams;

  const showInactive = params.isActive === "false";
  const fetchParams = showInactive ? {} : { isActive: "true" };

  const { data: banners } = await bannerService.getAll(fetchParams);

  return (
    <div className="space-y-6 min-h-screen">
      <BannersClient
        banners={banners || []}
        showInactiveDefault={showInactive}
      />
    </div>
  );
}
