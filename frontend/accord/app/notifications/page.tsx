"use client";
import { useState } from "react";
import { CreditCard, AlertCircle, Check, Info, Bell, Trash2, CheckCheck, Filter } from "lucide-react";

const allNotifications = [
  { id: 1,  icon: CreditCard,  color: "#4f7eff", category: "Payment",   title: "Payment received",         desc: "ABC Corp paid INV-004 for $1,000 USD. Transaction settled.",                 time: "2 min ago",    date: "Today",      unread: true },
  { id: 2,  icon: AlertCircle, color: "#f59e0b", category: "Invoice",   title: "Invoice overdue",           desc: "INV-003 from InnoTech ($3,400) is now 3 days past due date.",              time: "1 hour ago",   date: "Today",      unread: true },
  { id: 3,  icon: Check,       color: "#22c55e", category: "Contract",  title: "Contract signed",           desc: "XYZ Ltd has signed Contract 2 INV-002. Ready for execution.",              time: "3 hours ago",  date: "Today",      unread: true },
  { id: 4,  icon: Info,        color: "#a78bfa", category: "Client",    title: "New client request",        desc: "Priya M. from InnoTech has submitted an onboarding request.",              time: "5 hours ago",  date: "Today",      unread: false },
  { id: 5,  icon: CreditCard,  color: "#38d9a9", category: "Payment",   title: "Wallet credited",           desc: "+₹78,000 from XYZ Ltd Invoice Payment has been settled.",                  time: "1 day ago",    date: "Yesterday",  unread: false },
  { id: 6,  icon: AlertCircle, color: "#ef4444", category: "System",    title: "Bank transfer failed",      desc: "Payout to ICICI Bank ₹50,000 failed. Please check your bank details.",     time: "1 day ago",    date: "Yesterday",  unread: false },
  { id: 7,  icon: Check,       color: "#22c55e", category: "Contract",  title: "NDA approved",              desc: "InnoTech NDA 2026 has been reviewed and approved by both parties.",         time: "2 days ago",   date: "Jun 7",      unread: false },
  { id: 8,  icon: Info,        color: "#4f7eff", category: "System",    title: "Platform update",           desc: "Accord v2.4 is live. New features: bulk invoice export, smart reminders.", time: "3 days ago",   date: "Jun 6",      unread: false },
  { id: 9,  icon: CreditCard,  color: "#f59e0b", category: "Invoice",   title: "Invoice viewed",            desc: "David K. from XYZ Ltd opened Invoice INV-002 ($850).",                    time: "4 days ago",   date: "Jun 5",      unread: false },
  { id: 10, icon: Check,       color: "#38d9a9", category: "Payment",   title: "Recurring payment set",     desc: "Monthly retainer with Craft Co ($2,100) has been activated.",              time: "5 days ago",   date: "Jun 4",      unread: false },
];

const categories = ["All", "Payment", "Invoice", "Contract", "Client", "System"];

const statusColor: Record<string, string> = {
  Payment: "#4f7eff", Invoice: "#f59e0b", Contract: "#22c55e",
  Client: "#a78bfa", System: "#8b95b8",
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [items, setItems] = useState(allNotifications);

  const filtered = filter === "All" ? items : items.filter(n => n.category === filter);
  const unreadCount = items.filter(n => n.unread).length;

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, unread: false })));
  const dismiss = (id: number) => setItems(prev => prev.filter(n => n.id !== id));
  const markRead = (id: number) => setItems(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));

  // Group by date
  const groups: Record<string, typeof items> = {};
  for (const n of filtered) {
    if (!groups[n.date]) groups[n.date] = [];
    groups[n.date].push(n);
  }

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text-1)" }}>Notifications</h1>
            {unreadCount > 0 && (
              <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "var(--accent)", padding: "2px 10px", borderRadius: 20 }}>
                {unreadCount}
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: "var(--text-2)" }}>Stay on top of your business activity</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 9, padding: "9px 16px", fontSize: 13, fontWeight: 500,
              color: "var(--text-2)", cursor: "pointer",
            }}>
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <Filter size={14} color="var(--text-3)" style={{ marginTop: 6 }} />
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
            background: filter === cat ? "var(--accent)" : "var(--bg-card)",
            color: filter === cat ? "#fff" : "var(--text-2)",
            border: filter === cat ? "1px solid var(--accent)" : "1px solid var(--border)",
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Notification groups */}
      {Object.keys(groups).length === 0 ? (
        <div style={{
          background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)",
          padding: "60px 32px", textAlign: "center",
        }}>
          <Bell size={40} color="var(--text-3)" style={{ margin: "0 auto 16px" }} />
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-2)" }}>No notifications</p>
          <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 6 }}>You're all caught up!</p>
        </div>
      ) : (
        Object.entries(groups).map(([date, notifs]) => (
          <div key={date} style={{ marginBottom: 24 }}>
            {/* Date label */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{date}</span>
              <div style={{ flex: 1, height: 1, background: "var(--border-dim)" }} />
            </div>

            {/* Cards */}
            <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden" }}>
              {notifs.map((n, i) => {
                const Icon = n.icon;
                return (
                  <div key={n.id} style={{
                    display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px",
                    borderBottom: i < notifs.length - 1 ? "1px solid var(--border-dim)" : "none",
                    background: n.unread ? "rgba(79,126,255,0.04)" : "transparent",
                    transition: "background 0.12s", position: "relative",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                    onMouseLeave={e => (e.currentTarget.style.background = n.unread ? "rgba(79,126,255,0.04)" : "transparent")}>

                    {/* Icon */}
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                      background: `${n.color}18`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={17} color={n.color} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <p style={{ fontSize: 14, fontWeight: n.unread ? 700 : 500, color: "var(--text-1)" }}>{n.title}</p>
                          <span style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                            padding: "2px 8px", borderRadius: 20,
                            color: statusColor[n.category],
                            background: `${statusColor[n.category]}15`,
                            border: `1px solid ${statusColor[n.category]}30`,
                          }}>
                            {n.category}
                          </span>
                        </div>
                        <span style={{ fontSize: 11, color: "var(--text-3)", flexShrink: 0 }}>{n.time}</span>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4, lineHeight: 1.5 }}>{n.desc}</p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 8 }}>
                      {n.unread && (
                        <button onClick={() => markRead(n.id)} title="Mark as read" style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: "var(--text-3)", padding: 6, borderRadius: 6, display: "flex",
                          transition: "color 0.12s, background 0.12s",
                        }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(79,126,255,0.1)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-3)"; (e.currentTarget as HTMLButtonElement).style.background = "none"; }}>
                          <Check size={14} />
                        </button>
                      )}
                      <button onClick={() => dismiss(n.id)} title="Dismiss" style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "var(--text-3)", padding: 6, borderRadius: 6, display: "flex",
                        transition: "color 0.12s, background 0.12s",
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--red)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-3)"; (e.currentTarget as HTMLButtonElement).style.background = "none"; }}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Unread dot */}
                    {n.unread && (
                      <div style={{
                        position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                        width: 6, height: 6, borderRadius: "50%", background: "var(--accent)",
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
