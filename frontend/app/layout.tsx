import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../contexts/auth-context";

export const metadata: Metadata = {
  title: "BeeHive",
  description: "Manage your life",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
};

export const viewport = {
  themeColor: "#F9F7F7",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <meta name="apple-mobile-web-app-title" content="BeeHive" />
      <body className="antialiased" style={{ fontFamily: "var(--font-sf-text)" }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
