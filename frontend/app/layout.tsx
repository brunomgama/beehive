import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../contexts/auth-context";
import { ThemeProvider } from "../contexts/theme-context";

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
    <html lang="en" className="h-full">
      <meta name="apple-mobile-web-app-title" content="BeeHive" />
      <body className="antialiased h-full overflow-y-auto" style={{ fontFamily: "var(--font-sf-text)" }}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
