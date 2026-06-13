import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import ConditionalShell from "@/components/ConditionalShell";

export const metadata: Metadata = {
  title: "Accord",
  description: "Business Hub",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <Providers>
          <ConditionalShell>{children}</ConditionalShell>
        </Providers>
      </body>
    </html>
  );
}
