import NewsClient from "@/components/modules/dashboard/admin/news/NewsClient";
import { newsService } from "@/services/news.service";

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ isActive?: string }>;
}) {
  const params = await searchParams;
  const showInactive = params.isActive === "false";
  const fetchParams = showInactive ? {} : { isActive: "true" };

  const { data: news } = await newsService.getAll(fetchParams);

  return (
    <div className="space-y-6 min-h-screen">
      <NewsClient news={news || []} showInactiveDefault={showInactive} />
    </div>
  );
}
