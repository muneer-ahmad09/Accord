"use client";
import { useState } from "react";
import { User, Mail, Phone, Building2, Briefcase, Camera, Save, Shield, LogOut } from "lucide-react";

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: "John Doe", email: "john@accord.io", phone: "+91 98765 43210",
    company: "Accord Inc.", role: "Founder / CEO", bio: "Building better business tools."
  });
  const [saved, setSaved] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px", marginBottom: 20 }}>
      <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text-1)", marginBottom: 20 }}>{title}</h3>
      {children}
    </div>
  );

  const Field = ({ label, icon: Icon, name, type = "text", placeholder = "" }: { label: string; icon: React.ElementType; name: keyof typeof form; type?: string; placeholder?: string }) => (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
        <Icon size={11} />{label}
      </label>
      <input
        type={type}
        className="form-input"
        placeholder={placeholder}
        value={form[name]}
        onChange={e => set(name, e.target.value)}
      />
    </div>
  );

  return (
    <div className="page-content" style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-1)", fontFamily: "Syne, sans-serif" }}>Profile</h1>
        <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>Manage your personal information</p>
      </div>

      <Section title="Avatar">
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg, #4f7eff, #38d9a9)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <User size={30} color="#fff" />
            </div>
            <button style={{
              position: "absolute", bottom: 0, right: 0,
              width: 26, height: 26, borderRadius: "50%",
              background: "var(--accent)", border: "2px solid var(--bg-card)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
              <Camera size={12} color="#fff" />
            </button>
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)", fontFamily: "Syne, sans-serif" }}>{form.name}</p>
            <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 2 }}>{form.email}</p>
            <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>JPG, PNG up to 5MB</p>
          </div>
        </div>
      </Section>

      <Section title="Personal Information">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Full Name" icon={User} name="name" placeholder="Jane Smith" />
          <Field label="Email" icon={Mail} name="email" type="email" placeholder="you@company.com" />
          <Field label="Phone" icon={Phone} name="phone" placeholder="+91 98765 43210" />
          <Field label="Role" icon={Briefcase} name="role" placeholder="Founder / CEO" />
        </div>
        <div style={{ marginTop: 16 }}>
          <Field label="Company" icon={Building2} name="company" placeholder="Acme Corp" />
        </div>
        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 6 }}>Bio</label>
          <textarea
            className="form-input"
            rows={3}
            placeholder="Tell us a bit about yourself…"
            value={form.bio}
            onChange={e => set("bio", e.target.value)}
            style={{ resize: "vertical" }}
          />
        </div>
      </Section>

      <Section title="Security">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Change Password", desc: "Update your login password", icon: Shield, color: "var(--accent)" },
            { label: "Two-Factor Authentication", desc: "Add an extra layer of security", icon: Shield, color: "var(--green)" },
          ].map(({ label, desc, icon: Icon, color }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 16px", background: "var(--bg-card2)", borderRadius: 12,
              border: "1px solid var(--border-dim)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color={color} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{label}</p>
                  <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>{desc}</p>
                </div>
              </div>
              <button style={{
                padding: "7px 14px", borderRadius: 8, border: `1px solid ${color}`,
                background: "transparent", color: color, fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>Manage</button>
            </div>
          ))}
        </div>
      </Section>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button style={{
          display: "flex", alignItems: "center", gap: 7, padding: "10px 18px",
          background: "rgba(239,68,68,0.08)", border: "1px solid var(--red)",
          borderRadius: 10, color: "var(--red)", fontSize: 13, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit",
        }}>
          <LogOut size={14} /> Sign Out
        </button>
        <button onClick={save} style={{
          display: "flex", alignItems: "center", gap: 7, padding: "11px 24px",
          background: saved ? "var(--green)" : "var(--accent)", border: "none",
          borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: "Syne, sans-serif", transition: "background 0.2s",
        }}>
          <Save size={14} /> {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
