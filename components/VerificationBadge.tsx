"use client";
import { ShieldCheck, Clock, ShieldAlert } from "lucide-react";

interface Props {
  status: "none" | "pending" | "verified" | "rejected";
  size?: "sm" | "md" | "lg";
}

export function VerificationBadge({ status, size = "sm" }: Props) {
  if (status === "none") return null;
  const sizes = { sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-6 h-6" };
  if (status === "verified") return <ShieldCheck className={`${sizes[size]} text-green-500`} />;
  if (status === "pending") return <Clock className={`${sizes[size]} text-amber-500`} />;
  return <ShieldAlert className={`${sizes[size]} text-red-500`} />;
}
