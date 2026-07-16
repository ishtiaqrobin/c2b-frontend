import ProductsClient from "@/components/modules/dashboard/admin/product/ProductsClient";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ isActive?: string }>;
}) {
  const params = await searchParams;
  const showInactive = params.isActive === "false";
  const fetchParams = showInactive ? {} : { isActive: "true" };

  const [{ data: products }, { data: categories }] = await Promise.all([
    productService.getAll({ ...fetchParams, limit: "100" }),
    categoryService.getAll({ isActive: "true" }),
  ]);

  const subCategories = (categories ?? []).filter((c) => c.parentId);

  return (
    <div className="space-y-6 min-h-screen">
      <ProductsClient
        products={products ?? []}
        categories={subCategories}
        showInactiveDefault={showInactive}
      />
    </div>
  );
}
