import { Route } from "@/types";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  MapPin,
  ShieldCheck,
  Bell,
  CreditCard,
} from "lucide-react";

export const userRoutes: Route[] = [
  {
    title: "Dashboard",
    items: [
      { title: "Overview", url: "/user-dashboard", icon: LayoutDashboard },
      { title: "Profile", url: "/user-dashboard/profile", icon: User },
    ],
  },
  {
    title: "Orders",
    items: [
      { title: "My Orders", url: "/user-dashboard/orders", icon: ShoppingBag },
      { title: "Addresses", url: "/user-dashboard/addresses", icon: MapPin },
    ],
  },
  {
    title: "Verification",
    items: [{ title: "eKYC", url: "/user-dashboard/ekyc", icon: ShieldCheck }],
  },
  {
    title: "More",
    items: [
      {
        title: "Notifications",
        url: "/user-dashboard/notifications",
        icon: Bell,
      },
      { title: "Payments", url: "/user-dashboard/payments", icon: CreditCard },
    ],
  },
];
