import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "./lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // เฉพาะเส้นทางที่ต้องป้องกัน
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(AUTH_COOKIE)?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};