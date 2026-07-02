import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  
  // Rediriger les anciennes URLs Vercel vers l'URL principale
  if (host.includes("nawa-mariage-git-main") || 
      host.includes("nawa-mariage-7qf75y0vq") ||
      host.includes("nawa-mariage-cm5bw82gd")) {
    return NextResponse.redirect(
      new URL(request.nextUrl.pathname, "https://nawa-mariage.vercel.app")
    );
  }
  
  // Ajouter headers anti-cache pour forcer le refresh
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
