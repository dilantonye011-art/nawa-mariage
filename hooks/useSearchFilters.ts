"use client";
import { useState, useCallback } from "react";

export interface SearchFilters {
  ageMin: number;
  ageMax: number;
  country: string;
  city: string;
  religion: string;
  maritalStatus: string;
  verifiedOnly: boolean;
  nearby: boolean;
}

export const defaultFilters: SearchFilters = {
  ageMin: 18,
  ageMax: 50,
  country: "",
  city: "",
  religion: "",
  maritalStatus: "",
  verifiedOnly: false,
  nearby: false,
};

export function useSearchFilters() {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = useCallback(<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const togglePanel = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return { filters, updateFilter, resetFilters, isOpen, togglePanel };
}
