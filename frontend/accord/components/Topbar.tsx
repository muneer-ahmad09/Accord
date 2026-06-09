"use client";
import { useState, useRef, useEffect } from "react";
import { Search, Bell, Sun, Moon, Menu, Settings, LogOut, CreditCard, ChevronDown, Check, AlertCircle, Info, User } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

const notifications = [
  { id: 1, icon: CreditCard,  color: "#4f7eff", title: "Payment received",   desc: "ABC Corp paid INV-004 · $1,000",          time: "2m ago",  unread: true },
  { id: 2, icon: AlertCircle, color: "#f59e0b", title: "Invoice overdue",    desc: "INV-003 from InnoTech is 3 days overdue", time: "1h ago",  unread: true },
  { id: 3, icon: Check,       color: "#22c55e", title: "Contract signed",    desc: "XYZ Ltd signed Contract 2 INV-002",       time: "3h ago",  unread: true },
  { id: 4, icon: Info,        color: "#a78bfa", title: "New client request", desc: "Priya M. requested onboarding",           time: "5h ago",  unread: false },
  { id: 5, icon: CreditCard,  color: "#38d9a9", title: "Wallet credited",    desc: "+₹78,000 from XYZ Ltd settled",           time: "1d ago",  unread: false },
];

interface TopbarProps {
  onMenuClick?: () => void;
  placeholder?: string;
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, cb]);
}

export default function Topbar({ onMenuClick, placeholder = "Search..." }: TopbarProps) {
  const { theme, toggle } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(profileRef, () => setProfileOpen(false));

  const unreadCount = notifications.filter(n => n.unread).length;

  const iconBtn: React.CSSProperties = {
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: 10, width: 38, height: 38, display: "flex",
    alignItems: "center", justifyContent: "center", cursor: "pointer",
    transition: "background 0.15s", flexShrink: 0, position: "relative",
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 20px", borderBottom: "1px solid var(--border-dim)",
      background: "var(--bg)", position: "sticky", top: 0, zIndex: 30,
      transition: "background 0.2s", gap: 8,
    }}>
      {/* Left: hamburger + search */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
        {/* Hamburger - mobile/tablet only */}
        <button onClick={onMenuClick} className="menu-btn" style={{ ...iconBtn }}>
          <Menu size={16} color="var(--text-2)" />
        </button>

        {/* Search - full on desktop, icon-only on mobile */}
        <div className="search-full" style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: 10, padding: "9px 14px", flex: 1, maxWidth: 320,
          transition: "background 0.2s, border-color 0.2s",
        }}>
          <Search size={14} color="var(--text-3)" style={{ flexShrink: 0 }} />
          <input
            placeholder={placeholder}
            style={{
              border: "none", outline: "none", background: "transparent",
              fontSize: 13, color: "var(--text-1)", width: "100%", fontFamily: "inherit",
            }}
          />
        </div>
        {/* Search icon only on mobile */}
        <button className="search-icon-btn" onClick={() => setSearchOpen(o => !o)} style={{ ...iconBtn }}>
          <Search size={16} color="var(--text-2)" />
        </button>
      </div>

      {/* Mobile search bar dropdown */}
      {searchOpen && (
        <div className="mobile-search-bar" style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "var(--bg-card)", borderBottom: "1px solid var(--border)",
          padding: "10px 16px", zIndex: 40, display: "flex", alignItems: "center", gap: 10,
        }}>
          <Search size={14} color="var(--text-3)" />
          <input
            autoFocus
            placeholder={placeholder}
            style={{
              border: "none", outline: "none", background: "transparent",
              fontSize: 14, color: "var(--text-1)", width: "100%", fontFamily: "inherit",
            }}
          />
        </div>
      )}

      {/* Right: theme, notif, profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {/* Theme toggle */}
        <button onClick={toggle} style={iconBtn} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
          {theme === "dark"
            ? <Sun size={15} color="#f59e0b" />
            : <Moon size={15} color="var(--accent)" />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
            style={iconBtn}
          >
            <Bell size={15} color="var(--text-2)" />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: 7, right: 7,
                width: 8, height: 8, borderRadius: "50%",
                background: "var(--accent)", border: "2px solid var(--bg)",
              }} />
            )}
          </button>

          {notifOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 10px)", right: 0,
              width: 320, background: "var(--bg-card)",
              border: "1px solid var(--border)", borderRadius: 14,
              boxShadow: "var(--shadow-lg)", zIndex: 100, overflow: "hidden",
            }}>
              <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", fontFamily: "Syne, sans-serif" }}>Notifications</span>
                {unreadCount > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", background: "rgba(79,126,255,0.1)", padding: "2px 8px", borderRadius: 20 }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              {notifications.map(n => {
                const Icon = n.icon;
                return (
                  <div key={n.id} style={{
                    display: "flex", gap: 10, padding: "11px 16px",
                    borderBottom: "1px solid var(--border-dim)",
                    background: n.unread ? "rgba(79,126,255,0.04)" : "transparent",
                    cursor: "pointer",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                    onMouseLeave={e => (e.currentTarget.style.background = n.unread ? "rgba(79,126,255,0.04)" : "transparent")}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                      background: `${n.color}18`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={14} color={n.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-1)", lineHeight: 1.3 }}>{n.title}</p>
                        <span style={{ fontSize: 10, color: "var(--text-3)", flexShrink: 0 }}>{n.time}</span>
                      </div>
                      <p style={{ fontSize: 11, color: "var(--text-2)", marginTop: 2, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.desc}</p>
                    </div>
                    {n.unread && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: 5 }} />}
                  </div>
                );
              })}
              <Link href="/notifications" onClick={() => setNotifOpen(false)} style={{ textDecoration: "none" }}>
                <div style={{ padding: "11px 16px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "var(--accent)", cursor: "pointer", transition: "background 0.12s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  View all notifications →
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "6px 10px", cursor: "pointer",
              transition: "background 0.15s", flexShrink: 0,
            }}
          >
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: "linear-gradient(135deg, #4f7eff, #38d9a9)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <User size={12} color="#fff" />
            </div>
            <span className="profile-name" style={{ fontSize: 13, fontWeight: 500, color: "var(--text-1)" }}>John</span>
            <ChevronDown size={11} color="var(--text-3)" style={{ transform: profileOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>

          {profileOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 10px)", right: 0,
              width: 220, background: "var(--bg-card)",
              border: "1px solid var(--border)", borderRadius: 14,
              boxShadow: "var(--shadow-lg)", zIndex: 100, overflow: "hidden",
            }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-dim)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg, #4f7eff, #38d9a9)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <User size={15} color="#fff" />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>John Doe</p>
                    <p style={{ fontSize: 11, color: "var(--text-3)" }}>john@accord.io</p>
                  </div>
                </div>
              </div>

              {[
                { icon: User,       label: "View Profile",     href: "/profile" },
                { icon: Settings,   label: "Account Settings", href: "/settings" },
                { icon: CreditCard, label: "Billing",          href: "/settings?tab=billing" },
              ].map(({ icon: Icon, label, href }) => (
                <Link key={label} href={href} style={{ textDecoration: "none" }} onClick={() => setProfileOpen(false)}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "10px 16px", cursor: "pointer", color: "var(--text-2)", fontSize: 13,
                    transition: "background 0.12s, color 0.12s",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLDivElement).style.color = "var(--text-1)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; (e.currentTarget as HTMLDivElement).style.color = "var(--text-2)"; }}>
                    <Icon size={14} /> {label}
                  </div>
                </Link>
              ))}

              <div style={{ borderTop: "1px solid var(--border-dim)", margin: "4px 0" }} />

              <Link href="/signin" style={{ textDecoration: "none" }} onClick={() => setProfileOpen(false)}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "10px 16px", cursor: "pointer", color: "var(--red)", fontSize: 13,
                  transition: "background 0.12s",
                }}
                  onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = "rgba(239,68,68,0.07)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = "transparent")}>
                  <LogOut size={14} /> Sign Out
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .menu-btn { display: none !important; }
        .search-icon-btn { display: none !important; }
        .mobile-search-bar { display: none; }
        @media(max-width:1024px) {
          .menu-btn { display: flex !important; }
          .desktop-sidebar { display: none !important; }
        }
        @media(max-width:600px) {
          .search-full { display: none !important; }
          .search-icon-btn { display: flex !important; }
          .profile-name { display: none; }
          .mobile-search-bar { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
