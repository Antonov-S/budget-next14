import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Nav from "@/components/navigation/nav";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budget",
  description:
    "Your all-in-one solution for mastering personal finances and smart budgeting."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("px-6 md:px-12 max-w-7xl mx-auto", `${inter.className}`)}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
