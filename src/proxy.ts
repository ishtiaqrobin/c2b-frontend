import { NextRequest, NextResponse } from "next/server";
import { sessionService } from "./services/session.service";
import { Roles } from "./constants/roles";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let isAuthenticated = false;
  let isStaffOrSuperOwner = false;
  let needPasswordChange = false;

  try {
    const { data } = await sessionService.getSessionFromRequest(request);

    if (data?.user) {
      isAuthenticated = true;
      // STAFF and SUPER_OWNER have admin dashboard access
      isStaffOrSuperOwner =
        data.user.userType === Roles.STAFF || data.user.isSuperOwner === true;
      needPasswordChange = data.user.needPasswordChange === true;
    }
  } catch (error) {
    console.error("Session fetch error in middleware:", error);
  }

  // Redirect to login if unauthenticated and trying to access dashboards
  if (!isAuthenticated) {
    if (
      pathname.startsWith("/admin-dashboard") ||
      pathname.startsWith("/user-dashboard")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Redirect if authenticated user tries to access /login or /register
  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.redirect(
      new URL(
        isStaffOrSuperOwner ? "/admin-dashboard" : "/user-dashboard",
        request.url,
      ),
    );
  }

  // If user needs password change, force them to profile page
  if (
    needPasswordChange &&
    !pathname.includes("/profile") &&
    !pathname.startsWith("/api/")
  ) {
    const dashboardBase = isStaffOrSuperOwner
      ? "/admin-dashboard"
      : "/user-dashboard";
    return NextResponse.redirect(
      new URL(`${dashboardBase}/profile`, request.url),
    );
  }

  // Staff/SuperOwner can not visit user dashboard
  if (isStaffOrSuperOwner && pathname.startsWith("/user-dashboard")) {
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  }

  // Regular customers can not visit admin dashboard
  if (!isStaffOrSuperOwner && pathname.startsWith("/admin-dashboard")) {
    return NextResponse.redirect(new URL("/user-dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user-dashboard",
    "/user-dashboard/:path*",
    "/admin-dashboard",
    "/admin-dashboard/:path*",
    "/login",
    "/register",
  ],
};
