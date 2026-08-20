"use client";
import Link from "next/link";
import { ReactNode } from "react";
import { analytics } from "@/lib/analytics";

export function TrackedCta({
  href,
  location,
  className,
  children,
}: {
  href: string;
  location: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => analytics.ctaClicked(location)}>
      {children}
    </Link>
  );
}
