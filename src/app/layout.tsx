import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lamure — Premium Egyptian Marketplace for Clothing, Electronics & Shoes",
  description:
    "Lamure is Egypt's premium multi-category marketplace connecting customers, suppliers, and admins. Shop clothing, electronics, and shoes with a modern, animated experience. أفضل تجربة تسوق في مصر.",
  keywords: ["ecommerce", "clothing", "electronics", "shoes", "marketplace", "Lamure", "Egypt", "مصر", "تسوق"],
  authors: [{ name: "Lamure Egypt" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Lamure — Premium Egyptian Marketplace",
    description: "Egypt's finest multi-category e-commerce platform with role-based experiences.",
    siteName: "Lamure",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
          <Sonner />
        </ThemeProvider>
      </body>
    </html>
  );
}
