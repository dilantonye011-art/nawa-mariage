import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  
  // Rediriger les anciennes URLs Vercel vers l'URL principale
  if (host.includes("nawa-mariage-git-main-dilan-devweb.vercel.app") || 
      host.includes("nawa-mariage-7qf75y0vq-dilan-devweb.vercel.app")) {
    return NextResponse.redirect(
      new URL(request.nextUrl.pathname, "https://nawa-mariage.vercel.app")
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
