"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api";

export function useWalletSummary() {
  return useQuery({
    queryKey: ["wallet-summary"],
    queryFn: analyticsApi.getWalletSummary,
  });
}