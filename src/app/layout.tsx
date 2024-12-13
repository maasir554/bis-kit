import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";
import { Toaster } from "@/components/ui/sonner"
import { SessionProvider } from "next-auth/react";

import "./globals.css";

export const metadata: Metadata = {
  title: "BisKit - the gaming portal of BIS",
  description: "Learn and stay aware of Indian Standards by playing fun and engaging games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased flex flex-col items-center justify-start w-screen bg-neutral-950 text-neutral-100`}
      >
        <SessionProvider>
          <NavBar/>
        </SessionProvider>
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
