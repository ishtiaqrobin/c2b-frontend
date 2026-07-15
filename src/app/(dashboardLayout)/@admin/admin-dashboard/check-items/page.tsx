import { checkItemService } from "@/services/checkItem.service";
import { categoryService } from "@/services/category.service";
import CheckItemsClient from "@/components/modules/dashboard/admin/check-items/CheckItemsClient";

export default async function AdminCheckItemsPage() {
  const [{ data: items }, { data: categories }] = await Promise.all([
    checkItemService.getAll(),
    categoryService.getAll({ limit: "100" }),
  ]);

  return (
    <div className="space-y-6 min-h-screen">
      <CheckItemsClient items={items || []} categories={categories || []} />
    </div>
  );
}
