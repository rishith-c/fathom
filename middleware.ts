import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "fathom_session";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/app") && !request.cookies.get(AUTH_COOKIE_NAME)) {
    const redirectUrl = new URL("/auth", request.url);
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
