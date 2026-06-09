"use client";
import { usePathname } from "next/navigation";
import AppShell from "./AppShell";

const AUTH_ROUTES = ["/signin", "/signup", "/onboarding"];

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_ROUTES.some(r => pathname.startsWith(r));

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
