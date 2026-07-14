import { buybackFeatureService } from "@/services/buybackFeature.service";
import BuybackFeaturesClient from "@/components/modules/dashboard/admin/buyback-features/BuybackFeaturesClient";

export default async function AdminBuybackFeaturesPage() {
  const { data: features } = await buybackFeatureService.getAll();

  return (
    <div className="space-y-6 min-h-screen">
      <BuybackFeaturesClient features={features || []} />
    </div>
  );
}
