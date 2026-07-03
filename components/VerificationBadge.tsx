"use client";
import { Shield, ShieldCheck, ShieldAlert, Clock } from "lucide-react";

interface VerificationBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const config = {
  none: {
    icon: Shield,
    color: "text-gray-400",
    bg: "bg-gray-100",
    label: "Non vérifié",
  },
  pending: {
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-100",
    label: "En attente",
  },
  verified: {
    icon: ShieldCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-100",
    label: "Vérifié",
  },
  rejected: {
    icon: ShieldAlert,
    color: "text-red-500",
    bg: "bg-red-100",
    label: "Rejeté",
  },
};

const sizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function VerificationBadge({ status, size = "md", showLabel = false }: VerificationBadgeProps) {
  const safeStatus = (status as keyof typeof config) || "none";
  const { icon: Icon, color, bg, label } = config[safeStatus];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${bg}`}>
      <Icon className={`${sizes[size]} ${color}`} />
      {showLabel && (
        <span className={`text-xs font-medium ${color}`}>{label}</span>
      )}
    </div>
  );
}
