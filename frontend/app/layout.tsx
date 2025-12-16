import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";

/**
 * Application Metadata
 */
export const metadata: Metadata = {
  title: { default: "BeeHive - Financial Management", template: "%s | BeeHive" },
  description: "Smart financial management and expense tracking for individuals and families",
  keywords: ["finance", "budget", "expense tracker", "money management", "beehive"],
  authors: [{ name: "Bruno Gama" }],
  creator: "Bruno Gama",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "BeeHive", },
  applicationName: "BeeHive",
  formatDetection: { telephone: false, },
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png", },
}

/**
 * Viewport Configuration
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F9F7F7",
  viewportFit: "cover",
}

/**
 * Root Layout Component
 * Wraps entire application with theme and auth providers
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BeeHive" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Prevent scaling on iOS */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className="antialiased h-full overflow-y-auto font-body">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}