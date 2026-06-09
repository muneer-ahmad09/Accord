"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Gauge, ArrowRight, Building2, Phone, User, Briefcase, Check } from "lucide-react";

const ROLES = ["Founder / CEO", "Finance Manager", "Operations", "Freelancer", "Accountant", "Other"];
const COMPANY_SIZES = ["Just me", "2–10", "11–50", "51–200", "200+"];

function OnboardingForm() {
  const router = useRouter();
  const params = useSearchParams();
  const provider = params.get("provider") || "email";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    displayName: "",
    company: "",
    phone: "",
    role: "",
    companySize: "",
    currency: "USD",
  });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function finish() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    router.push("/");
  }

  const stepInfo = [
    { num: 1, label: "About you" },
    { num: 2, label: "Your business" },
    { num: 3, label: "Preferences" },
  ];

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--bg-card2)", border: "1px solid var(--border)",
    borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "var(--text-1)",
    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, justifyContent: "center" }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg, #4f7eff 0%, #38d9a9 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(79,126,255,0.3)",
          }}>
            <Gauge size={17} color="#fff" />
          </div>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: "var(--text-1)" }}>Accord</span>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, alignItems: "center" }}>
          {stepInfo.map((s, i) => (
            <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i < stepInfo.length - 1 ? "auto" : undefined }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: step > s.num ? "var(--green)" : step === s.num ? "var(--accent)" : "var(--bg-card2)",
                  border: `2px solid ${step >= s.num ? (step > s.num ? "var(--green)" : "var(--accent)") : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s", flexShrink: 0,
                }}>
                  {step > s.num ? <Check size={13} color="#fff" /> : <span style={{ fontSize: 11, fontWeight: 700, color: step === s.num ? "#fff" : "var(--text-3)" }}>{s.num}</span>}
                </div>
                <span style={{ fontSize: 12, color: step === s.num ? "var(--text-1)" : "var(--text-3)", fontWeight: step === s.num ? 600 : 400, whiteSpace: "nowrap" }}>{s.label}</span>
              </div>
              {i < stepInfo.length - 1 && <div style={{ flex: 1, height: 1, background: step > s.num ? "var(--green)" : "var(--border)", margin: "0 10px", minWidth: 20, transition: "background 0.2s" }} />}
            </div>
          ))}
        </div>

        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: 20, padding: "32px 28px", boxShadow: "var(--shadow)",
          animation: "slideUp 0.3s ease",
        }}>
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-1)", marginBottom: 6 }}>
                {provider === "email" ? "Tell us about yourself" : `Welcome! Let's set up your profile`}
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 24 }}>
                {provider !== "email" ? `Signed in with ${provider} · ` : ""}We just need a few details to personalise your experience.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 6 }}>
                    <User size={11} style={{ marginRight: 5, verticalAlign: "middle" }} />Display Name
                  </label>
                  <input className="form-input" placeholder="How should we call you?" value={form.displayName} onChange={e => set("displayName", e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 6 }}>
                    <Phone size={11} style={{ marginRight: 5, verticalAlign: "middle" }} />Phone Number <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => set("phone", e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 8 }}>
                    <Briefcase size={11} style={{ marginRight: 5, verticalAlign: "middle" }} />Your Role
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {ROLES.map(r => (
                      <button key={r} type="button" onClick={() => set("role", r)} style={{
                        padding: "7px 14px", borderRadius: 8,
                        background: form.role === r ? "rgba(79,126,255,0.15)" : "var(--bg-card2)",
                        border: `1px solid ${form.role === r ? "var(--accent)" : "var(--border)"}`,
                        color: form.role === r ? "var(--accent)" : "var(--text-2)",
                        fontSize: 12, fontWeight: form.role === r ? 600 : 400,
                        cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                      }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!form.displayName}
                style={{
                  width: "100%", marginTop: 28, padding: "13px", borderRadius: 10, border: "none",
                  background: form.displayName ? "var(--accent)" : "var(--border)", color: "#fff",
                  fontSize: 14, fontWeight: 700, cursor: form.displayName ? "pointer" : "not-allowed",
                  fontFamily: "Syne, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "background 0.15s",
                }}
              >
                Continue <ArrowRight size={15} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-1)", marginBottom: 6 }}>About your business</h2>
              <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 24 }}>This helps us tailor invoicing and contract templates.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 6 }}>
                    <Building2 size={11} style={{ marginRight: 5, verticalAlign: "middle" }} />Company / Business Name <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input className="form-input" placeholder="Acme Corp" value={form.company} onChange={e => set("company", e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 8 }}>Team Size</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {COMPANY_SIZES.map(s => (
                      <button key={s} type="button" onClick={() => set("companySize", s)} style={{
                        padding: "8px 16px", borderRadius: 8,
                        background: form.companySize === s ? "rgba(79,126,255,0.15)" : "var(--bg-card2)",
                        border: `1px solid ${form.companySize === s ? "var(--accent)" : "var(--border)"}`,
                        color: form.companySize === s ? "var(--accent)" : "var(--text-2)",
                        fontSize: 13, fontWeight: form.companySize === s ? 600 : 400,
                        cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                      }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
                <button onClick={() => setStep(1)} style={{
                  padding: "13px 24px", borderRadius: 10, border: "1px solid var(--border)",
                  background: "transparent", color: "var(--text-2)", fontSize: 14,
                  cursor: "pointer", fontFamily: "inherit", transition: "border-color 0.15s",
                }}>
                  Back
                </button>
                <button onClick={() => setStep(3)} style={{
                  flex: 1, padding: "13px", borderRadius: 10, border: "none",
                  background: "var(--accent)", color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "Syne, sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  Continue <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-1)", marginBottom: 6 }}>Almost done!</h2>
              <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 24 }}>Set your default preferences for the dashboard.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 6 }}>Default Currency</label>
                  <select
                    value={form.currency}
                    onChange={e => set("currency", e.target.value)}
                    style={{ ...inputStyle as React.CSSProperties, appearance: "none", cursor: "pointer" }}
                  >
                    {[["USD","US Dollar (USD)"],["INR","Indian Rupee (INR)"],["EUR","Euro (EUR)"],["GBP","British Pound (GBP)"],["AED","UAE Dirham (AED)"]].map(([v,l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* Summary */}
                <div style={{ background: "var(--bg-card2)", border: "1px solid var(--border-dim)", borderRadius: 12, padding: "16px" }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Your Profile</p>
                  {[
                    ["Name", form.displayName],
                    ["Company", form.company || "—"],
                    ["Role", form.role || "—"],
                    ["Team", form.companySize || "—"],
                    ["Currency", form.currency],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--border-dim)" }}>
                      <span style={{ fontSize: 12, color: "var(--text-3)" }}>{k}</span>
                      <span style={{ fontSize: 12, color: "var(--text-1)", fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
                <button onClick={() => setStep(2)} style={{
                  padding: "13px 24px", borderRadius: 10, border: "1px solid var(--border)",
                  background: "transparent", color: "var(--text-2)", fontSize: 14,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  Back
                </button>
                <button onClick={finish} disabled={loading} style={{
                  flex: 1, padding: "13px", borderRadius: 10, border: "none",
                  background: loading ? "var(--border)" : "var(--green)", color: "#fff",
                  fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "Syne, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  {loading ? "Setting up your workspace…" : <><Check size={15} /> Enter Accord</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <OnboardingForm />
    </Suspense>
  );
}
