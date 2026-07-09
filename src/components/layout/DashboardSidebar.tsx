"use client";

import { adminRoutes } from "@/routes/adminRoutes";
import { userRoutes } from "@/routes/userRoutes";
import { useAuth } from "@/hooks/useAuth";
import { ChartColumn, Home, Settings, TrendingUp } from "lucide-react";
import { AppSidebar } from "./AppSidebar";

export function DashboardSidebar() {
  const { user } = useAuth();
  const isStaffOrSuperOwner =
    user?.userType === "STAFF" || user?.isSuperOwner === true;

  const routes = isStaffOrSuperOwner ? adminRoutes : userRoutes;

  const quickActions = isStaffOrSuperOwner
    ? {
        title: "Quick Actions",
        items: [
          {
            title: "Settings",
            url: "/admin-dashboard/settings",
            icon: Settings,
          },
          {
            title: "Stats",
            url: "/admin-dashboard/stats",
            icon: ChartColumn,
          },
          {
            title: "Analytics",
            url: "/admin-dashboard/analytics",
            icon: TrendingUp,
          },
        ],
      }
    : {
        title: "Quick Actions",
        items: [
          {
            title: "Visit Home",
            url: "/",
            icon: Home,
          },
          // {
          //   title: "My Rewards",
          //   url: "/rewards",
          //   icon: Gift,
          // },
        ],
      };

  return (
    <AppSidebar
      variant="inset"
      className="border-r"
      routes={routes}
      quickActions={quickActions}
    />
  );
}
