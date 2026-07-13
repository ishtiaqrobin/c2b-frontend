import { categoryService } from "@/services/category.service";
import CategoryTrashClient from "@/components/modules/dashboard/admin/category/CategoryTrashClient";

export const metadata = {
  title: "Category Trash | Admin Dashboard",
};

export default async function CategoryTrashPage() {
  const { data: deletedCategories } = await categoryService.getTrash();

  return (
    <div className="space-y-6 min-h-screen">
      <CategoryTrashClient categories={deletedCategories || []} />
    </div>
  );
}
