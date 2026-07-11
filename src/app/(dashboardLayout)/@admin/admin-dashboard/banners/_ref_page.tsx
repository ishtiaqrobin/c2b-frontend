// import BannersClient from "@/components/modules/admin/banner/BannersClient";
// import { bannerService } from "@/services";

// export const metadata = {
//     title: "Banners | Admin Dashboard",
//     description: "Manage banners for your juice bar",
// };

// export default async function BannersPage({
//     searchParams,
// }: {
//     searchParams: Promise<{ isActive?: string }>;
// }) {
//     const params = await searchParams;

//     const showAll = params.isActive === "false";
//     const fetchParams = showAll ? {} : { isActive: true };

//     const { data: bannersData } = await bannerService.getBanners(fetchParams);

//     return (
//         <div>
//             <BannersClient
//                 banners={bannersData || []}
//                 showInactiveDefault={showAll}
//             />
//         </div>
//     );
// }
