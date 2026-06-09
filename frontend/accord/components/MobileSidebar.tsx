"use client";
import { Gauge, Users, FileText, FileSignature, Wallet, Bell, Settings, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Gauge,         label: "Dashboard",     href: "/" },
  { icon: Users,         label: "Clients",       href: "/clients" },
  { icon: FileText,      label: "Invoices",      href: "/invoices" },
  { icon: FileSignature, label: "Contracts",     href: "/contracts" },
  { icon: Wallet,        label: "Wallet",        href: "/wallet" },
  { icon: Bell,          label: "Notifications", href: "/notifications" },
];

const bottomItems = [
  { icon: User,     label: "Profile",  href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

interface Props { onClose: () => void; }

export default function MobileSidebar({ onClose }: Props) {
  const pathname = usePathname();

  const NavItem = ({ icon: Icon, label, href }: { icon: React.ElementType; label: string; href: string }) => {
    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
    return (
      <Link href={href} style={{ textDecoration: "none" }} onClick={onClose}>
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "11px 14px", borderRadius: 10, cursor: "pointer",
          background: isActive ? "rgba(79,126,255,0.12)" : "transparent",
          color: isActive ? "var(--accent)" : "var(--text-2)",
          fontWeight: isActive ? 600 : 400,
          fontSize: 14, transition: "all 0.15s",
          borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: isActive ? "rgba(79,126,255,0.15)" : "rgba(128,128,128,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
          </div>
          {label}
        </div>
      </Link>
    );
  };

  return (
    <aside style={{
      width: 240, height: "100%",
      background: "var(--sidebar-bg)",
      display: "flex", flexDirection: "column",
      padding: "28px 0",
    }}>
      {/* Logo + close button (mobile only) */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #4f7eff 0%, #38d9a9 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(79,126,255,0.35)", flexShrink: 0,
          }}>
            <Gauge size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 16, color: "var(--text-1)", lineHeight: 1.1, letterSpacing: "-0.3px" }}>Accord</div>
            <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>Business Hub</div>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--text-3)", padding: 4, borderRadius: 6,
          display: "flex", alignItems: "center",
        }}>
          <X size={18} />
        </button>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 12px", flex: 1 }}>
        {navItems.map((item) => <NavItem key={item.label} {...item} />)}
      </nav>

      <div style={{ padding: "16px 12px 0", borderTop: "1px solid var(--border-dim)", marginTop: 16, display: "flex", flexDirection: "column", gap: 2 }}>
        {bottomItems.map((item) => <NavItem key={item.label} {...item} />)}
        <div style={{ padding: "8px 14px 0 14px" }}>
          <p style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.04em" }}>© 2026 Accord Inc.</p>
        </div>
      </div>
    </aside>
  );
}
