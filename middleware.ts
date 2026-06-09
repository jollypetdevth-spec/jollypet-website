import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Admin routes — ต้อง login + user_type = admin
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/admin", req.url));
    }
    if ((session.user as any)?.userType !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Order history — ต้อง login
  if (pathname.startsWith("/orders")) {
    if (!session) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/orders/:path*", "/profile/:path*"],
};
