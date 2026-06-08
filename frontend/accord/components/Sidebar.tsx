"use client";
import { Gauge, Users, FileText, FileSignature, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Gauge,         label: "Dashboard",  href: "/" },
  { icon: Users,         label: "Clients",    href: "/clients" },
  { icon: FileText,      label: "Invoices",   href: "/invoices" },
  { icon: FileSignature, label: "Contracts",  href: "/contracts" },
  { icon: Wallet,        label: "Wallet",     href: "/wallet" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside style={{
      width: 240, minWidth: 240,
      background: "var(--sidebar-bg)",
      borderRight: "1px solid var(--border-dim)",
      display: "flex", flexDirection: "column",
      padding: "28px 0",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 24px 32px" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg, #4f7eff 0%, #38d9a9 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 16px rgba(79,126,255,0.4)"
        }}>
          <Gauge size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text-1)", lineHeight: 1.2 }}>FreelanceOS</div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>Business Hub</div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" }}>
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link key={label} href={href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px",
                borderRadius: 10, cursor: "pointer",
                background: isActive ? "rgba(79,126,255,0.12)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--text-2)",
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                transition: "all 0.15s",
                borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: isActive ? "rgba(79,126,255,0.15)" : "rgba(255,255,255,0.04)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                </div>
                {label}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
