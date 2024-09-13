import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // If no token exists and the user is trying to access a protected route, redirect to the home page.
  if (!token && pathname !== "/") {
    console.log("No token, redirecting to home");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Proceed with the request if authenticated or accessing home page.
  return NextResponse.next();
}

// Configuring the matcher to protect specific routes
// be sure to update if adding new pages
export const config = {
  matcher: ["/challenge/:path*", "/profile"],
};
