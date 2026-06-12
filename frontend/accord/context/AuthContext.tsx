"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, setToken, clearToken, getToken, UserProfile } from "@/lib/api";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;                              // true while verifying JWT on mount
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  setUser: (u: UserProfile | null) => void;     // called after onboarding completes
}

const AuthContext = createContext<AuthContextType>({
  user: null, token: null, loading: true,
  signIn: async () => {}, signUp: async () => {},
  signOut: () => {}, setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    const stored = getToken();
    if (!stored) { setLoading(false); return; }
    authApi.verify()
      .then(profile => { setUserState(profile); setTokenState(stored); })
      .catch(() => { clearToken(); })
      .finally(() => setLoading(false));
  }, []);

  // ── signIn ────────────────────────────────────────────────────────────────
  const signIn = async (email: string, password: string) => {
    const { token: jwt, user: profile } = await authApi.login(email, password);
    setToken(jwt);
    setTokenState(jwt);
    setUserState(profile);
  };

  // ── signUp ────────────────────────────────────────────────────────────────
  const signUp = async (name: string, email: string, password: string) => {
    const { token: jwt, user: profile } = await authApi.register(name, email, password);
    setToken(jwt);
    setTokenState(jwt);
    setUserState(profile);
    // Caller navigates to /onboarding
  };

  // ── signOut ───────────────────────────────────────────────────────────────
  const signOut = () => {
    clearToken();
    setTokenState(null);
    setUserState(null);
  };

  const setUser = (u: UserProfile | null) => setUserState(u);

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
