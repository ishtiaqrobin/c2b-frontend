import { faqService } from "@/services/faq.service";
import FaqClient from "@/components/modules/dashboard/admin/faq/FaqClient";

export default async function AdminFaqPage({
  searchParams,
}: {
  searchParams: Promise<{ isActive?: string }>;
}) {
  const params = await searchParams;

  const showInactive = params.isActive === "false";
  const fetchParams = showInactive ? {} : { isActive: "true" };

  const { data: faqs } = await faqService.getAll(fetchParams);

  return (
    <div className="space-y-6 min-h-screen">
      <FaqClient
        faqs={faqs || []}
        showInactiveDefault={showInactive}
      />
    </div>
  );
}
