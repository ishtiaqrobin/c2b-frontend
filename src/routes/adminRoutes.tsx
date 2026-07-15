import { Route } from "@/types";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  FolderKanban,
  Store,
  CreditCard,
  ShoppingCart,
  MapPin,
  Image,
  Newspaper,
  Bell,
  ShieldCheck,
  TrendingUp,
  FileText,
  Package,
  UserCog,
  Star,
  ClipboardList,
  FileQuestion,
} from "lucide-react";

export const adminRoutes: Route[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/admin-dashboard", icon: LayoutDashboard },
      {
        title: "Analytics",
        url: "/admin-dashboard/analytics",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "Commerce",
    items: [
      {
        title: "Categories",
        url: "/admin-dashboard/categories",
        icon: FolderKanban,
      },
      { title: "Products", url: "/admin-dashboard/products", icon: Package },
      { title: "Stores", url: "/admin-dashboard/stores", icon: Store },
      { title: "Orders", url: "/admin-dashboard/orders", icon: ShoppingBag },
      { title: "Payments", url: "/admin-dashboard/payments", icon: CreditCard },
      { title: "Cart", url: "/admin-dashboard/cart", icon: ShoppingCart },
    ],
  },
  {
    title: "Content",
    items: [
      { title: "Banners", url: "/admin-dashboard/banners", icon: Image },
      {
        title: "Buyback Features",
        url: "/admin-dashboard/buyback-features",
        icon: Star,
      },
      {
        title: "Check Items",
        url: "/admin-dashboard/check-items",
        icon: ClipboardList,
      },
      { title: "News", url: "/admin-dashboard/news", icon: Newspaper },
      { title: "FAQ", url: "/admin-dashboard/faq", icon: FileQuestion },
    ],
  },
  {
    title: "Verification",
    items: [{ title: "eKYC", url: "/admin-dashboard/ekyc", icon: ShieldCheck }],
  },
  {
    title: "Communication",
    items: [
      {
        title: "Notifications",
        url: "/admin-dashboard/notifications",
        icon: Bell,
      },
      { title: "Reports", url: "/admin-dashboard/reports", icon: FileText },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Users", url: "/admin-dashboard/users", icon: Users },
      { title: "Addresses", url: "/admin-dashboard/addresses", icon: MapPin },
      { title: "Profile", url: "/admin-dashboard/profile", icon: UserCog },
    ],
  },
];
