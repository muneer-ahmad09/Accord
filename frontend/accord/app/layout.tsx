import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import ConditionalShell from "@/components/ConditionalShell";

export const metadata: Metadata = {
  title: "Accord",
  description: "Business Hub",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ConditionalShell>{children}</ConditionalShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
