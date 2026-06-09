"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  role?: string;
  avatar?: string;
  provider: "email" | "google" | "github";
  onboardingComplete: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
