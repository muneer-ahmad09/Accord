"use client";
import { useState } from "react";
import { Eye, EyeOff, Gauge, ArrowRight, Check } from "lucide-react";

const GithubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = (p: string) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = passwordStrength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "var(--red)", "var(--yellow)", "var(--accent)", "var(--green)"][strength];

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    router.push("/onboarding?provider=email&new=true");
  }

  function handleOAuth(provider: string) {
    router.push(`/onboarding?provider=${provider}&new=true`);
  }

  const field = (key: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        className="form-input"
        placeholder={placeholder}
        value={form[key]}
        onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(x => ({ ...x, [key]: "" })); }}
      />
      {errors[key] && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>{errors[key]}</p>}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36, justifyContent: "center" }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "linear-gradient(135deg, #4f7eff 0%, #38d9a9 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 24px rgba(79,126,255,0.35)",
          }}>
            <Gauge size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20, color: "var(--text-1)", letterSpacing: "-0.5px" }}>Accord</div>
            <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Business Hub</div>
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 32px", boxShadow: "var(--shadow)" }}>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, color: "var(--text-1)", marginBottom: 6 }}>Create account</h1>
          <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 28 }}>Start managing your business with Accord</p>

          {/* OAuth */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            {[
              { id: "google", label: "Google", icon: (
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )},
              { id: "github", label: "GitHub", icon: <GithubIcon /> },
            ].map(({ id, label, icon }) => (
              <button key={id} onClick={() => handleOAuth(id)} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "11px", background: "var(--bg-card2)", border: "1px solid var(--border)",
                borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 500, color: "var(--text-1)",
                fontFamily: "inherit", transition: "border-color 0.15s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}>
                {icon} {label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border-dim)" }} />
            <span style={{ fontSize: 12, color: "var(--text-3)" }}>or with email</span>
            <div style={{ flex: 1, height: 1, background: "var(--border-dim)" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {field("name", "Full Name", "text", "Jane Smith")}
            {field("email", "Email", "email", "you@company.com")}

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  className="form-input"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(x => ({ ...x, password: "" })); }}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(o => !o)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 2 }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div style={{ marginTop: 8, display: "flex", gap: 4, alignItems: "center" }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColor : "var(--border)" }} />
                  ))}
                  <span style={{ fontSize: 11, color: strengthColor, marginLeft: 6, fontWeight: 600, minWidth: 36 }}>{strengthLabel}</span>
                </div>
              )}
              {errors.password && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>{errors.password}</p>}
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 6 }}>Confirm Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.confirm}
                onChange={e => { setForm(f => ({ ...f, confirm: e.target.value })); setErrors(x => ({ ...x, confirm: "" })); }}
              />
              {form.confirm && form.password === form.confirm && (
                <p style={{ fontSize: 11, color: "var(--green)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><Check size={11} /> Passwords match</p>
              )}
              {errors.confirm && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "13px", borderRadius: 10, border: "none",
              background: loading ? "var(--border)" : "var(--accent)", color: "#fff",
              fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "Syne, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "background 0.15s", marginTop: 4,
            }}>
              {loading ? "Creating account…" : <>Create Account <ArrowRight size={15} /></>}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-2)", marginTop: 24 }}>
            Already have an account?{" "}
            <Link href="/signin" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
