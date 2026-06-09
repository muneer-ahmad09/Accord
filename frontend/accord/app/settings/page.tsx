"use client";
import { useState } from "react";
import { Bell, Moon, Globe, CreditCard, Shield, Trash2, Save, Sun, Check } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const TABS = ["General", "Notifications", "Billing", "Security"];
const CURRENCIES = ["USD", "INR", "EUR", "GBP", "AED", "JPY"];
const TIMEZONES = ["Asia/Kolkata (IST)", "America/New_York (EST)", "Europe/London (GMT)", "Asia/Dubai (GST)", "America/Los_Angeles (PST)"];

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [tab, setTab] = useState("General");
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [saved, setSaved] = useState(false);

  const [notifs, setNotifs] = useState({
    paymentReceived: true,
    invoiceOverdue: true,
    contractSigned: true,
    newClient: false,
    weeklyReport: true,
    marketing: false,
  });
  const toggleNotif = (k: keyof typeof notifs) => setNotifs(n => ({ ...n, [k]: !n[k] }));

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} style={{
      width: 44, height: 24, borderRadius: 12,
      background: on ? "var(--accent)" : "var(--border)",
      border: "none", cursor: "pointer", position: "relative",
      transition: "background 0.2s", flexShrink: 0,
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3, left: on ? 23 : 3,
        transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }} />
    </button>
  );

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px", marginBottom: 16 }}>
      {children}
    </div>
  );

  const Row = ({ label, desc, right }: { label: string; desc?: string; right: React.ReactNode }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border-dim)" }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-1)" }}>{label}</p>
        {desc && <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{desc}</p>}
      </div>
      {right}
    </div>
  );

  return (
    <div className="page-content" style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-1)", fontFamily: "Syne, sans-serif" }}>Settings</h1>
        <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>Manage your account and preferences</p>
      </div>

      {/* Tab nav */}
      <div style={{ display: "flex", gap: 2, marginBottom: 24, background: "var(--bg-card2)", borderRadius: 12, padding: 4, width: "fit-content" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
            background: tab === t ? "var(--bg-card)" : "transparent",
            color: tab === t ? "var(--text-1)" : "var(--text-2)",
            fontWeight: tab === t ? 600 : 400, fontSize: 13, fontFamily: "inherit",
            boxShadow: tab === t ? "var(--shadow)" : "none", transition: "all 0.15s",
          }}>{t}</button>
        ))}
      </div>

      {tab === "General" && (
        <>
          <Card>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 4 }}>Appearance</h3>
            <Row
              label="Theme"
              desc="Choose between light and dark mode"
              right={
                <div style={{ display: "flex", gap: 8 }}>
                  {["light", "dark"].map(t => (
                    <button key={t} onClick={() => { if (theme !== t) toggle(); }} style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
                      borderRadius: 8, border: `1px solid ${theme === t ? "var(--accent)" : "var(--border)"}`,
                      background: theme === t ? "rgba(79,126,255,0.12)" : "var(--bg-card2)",
                      color: theme === t ? "var(--accent)" : "var(--text-2)",
                      fontSize: 12, fontWeight: theme === t ? 600 : 400,
                      cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                    }}>
                      {t === "light" ? <Sun size={13} /> : <Moon size={13} />}
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                      {theme === t && <Check size={11} />}
                    </button>
                  ))}
                </div>
              }
            />
          </Card>

          <Card>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 4 }}>Localisation</h3>
            <Row
              label="Default Currency"
              desc="Used across invoices and wallet"
              right={
                <select value={currency} onChange={e => setCurrency(e.target.value)} style={{
                  background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 8,
                  padding: "7px 12px", fontSize: 13, color: "var(--text-1)", fontFamily: "inherit",
                  outline: "none", cursor: "pointer",
                }}>
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              }
            />
            <Row
              label="Timezone"
              desc="For scheduling and date display"
              right={
                <select value={timezone} onChange={e => setTimezone(e.target.value)} style={{
                  background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 8,
                  padding: "7px 12px", fontSize: 12, color: "var(--text-1)", fontFamily: "inherit",
                  outline: "none", cursor: "pointer", maxWidth: 220,
                }}>
                  {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                </select>
              }
            />
          </Card>
        </>
      )}

      {tab === "Notifications" && (
        <Card>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 4 }}>
            <Bell size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />Notification Preferences
          </h3>
          {([
            ["paymentReceived", "Payment Received", "Alert when a client pays an invoice"],
            ["invoiceOverdue",  "Invoice Overdue",  "Remind when invoices are past due date"],
            ["contractSigned",  "Contract Signed",  "Notify when a contract is executed"],
            ["newClient",       "New Client Request","Alert when someone requests onboarding"],
            ["weeklyReport",    "Weekly Report",    "Receive a summary every Monday"],
            ["marketing",       "Product Updates",  "Tips, features, and announcements"],
          ] as const).map(([key, label, desc]) => (
            <Row key={key} label={label} desc={desc}
              right={<Toggle on={notifs[key]} onToggle={() => toggleNotif(key)} />}
            />
          ))}
        </Card>
      )}

      {tab === "Billing" && (
        <>
          <Card>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 16 }}>
              <CreditCard size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />Current Plan
            </h3>
            <div style={{
              background: "linear-gradient(135deg, rgba(79,126,255,0.12), rgba(56,217,169,0.08))",
              border: "1px solid var(--accent)", borderRadius: 12, padding: "20px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 800, color: "var(--text-1)" }}>Pro Plan</span>
                    <span style={{ background: "var(--accent)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, letterSpacing: "0.04em" }}>ACTIVE</span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-2)" }}>Unlimited invoices · 10 team members · Advanced analytics</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: "var(--text-1)", fontFamily: "Syne, sans-serif" }}>$29<span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-2)" }}>/mo</span></p>
                  <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>Renews Jul 9, 2026</p>
                </div>
              </div>
            </div>
            <button style={{
              marginTop: 14, padding: "9px 18px", border: "1px solid var(--border)",
              background: "transparent", borderRadius: 8, color: "var(--text-2)",
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>Manage Subscription</button>
          </Card>

          <Card>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 16 }}>Payment Methods</h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--bg-card2)", borderRadius: 10, border: "1px solid var(--border-dim)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 24, background: "var(--accent)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CreditCard size={14} color="#fff" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>Visa •••• 4242</p>
                  <p style={{ fontSize: 11, color: "var(--text-3)" }}>Expires 12/27</p>
                </div>
              </div>
              <span style={{ fontSize: 11, background: "rgba(56,217,169,0.12)", color: "var(--accent2)", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>Default</span>
            </div>
            <button style={{
              marginTop: 10, padding: "9px 18px", border: `1px dashed var(--border)`,
              background: "transparent", borderRadius: 8, color: "var(--text-2)",
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              width: "100%",
            }}>+ Add Payment Method</button>
          </Card>
        </>
      )}

      {tab === "Security" && (
        <>
          <Card>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 4 }}>
              <Shield size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />Account Security
            </h3>
            {[
              { label: "Change Password", desc: "Last changed 30 days ago", action: "Update" },
              { label: "Two-Factor Authentication", desc: "Not enabled — adds extra security", action: "Enable" },
              { label: "Active Sessions", desc: "2 devices logged in", action: "View" },
            ].map(({ label, desc, action }) => (
              <Row key={label} label={label} desc={desc}
                right={
                  <button style={{
                    padding: "7px 14px", borderRadius: 8, border: "1px solid var(--border)",
                    background: "transparent", color: "var(--text-2)", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>{action}</button>
                }
              />
            ))}
          </Card>

          <Card>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--red)", marginBottom: 16 }}>
              <Trash2 size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />Danger Zone
            </h3>
            <div style={{ padding: "16px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10 }}>
              <p style={{ fontSize: 13, color: "var(--text-1)", fontWeight: 600, marginBottom: 4 }}>Delete Account</p>
              <p style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 14 }}>This will permanently delete your account and all data. This cannot be undone.</p>
              <button style={{
                padding: "9px 18px", border: "1px solid var(--red)", background: "rgba(239,68,68,0.08)",
                borderRadius: 8, color: "var(--red)", fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>Delete my account</button>
            </div>
          </Card>
        </>
      )}

      {tab !== "Billing" && tab !== "Security" && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={save} style={{
            display: "flex", alignItems: "center", gap: 7, padding: "11px 24px",
            background: saved ? "var(--green)" : "var(--accent)", border: "none",
            borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "Syne, sans-serif", transition: "background 0.2s",
          }}>
            <Save size={14} /> {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
