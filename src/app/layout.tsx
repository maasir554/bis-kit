import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";
import { Toaster } from "@/components/ui/sonner"
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Footer } from "@/components/Footer";

import "./globals.css";

export const metadata: Metadata = {
  title: "BisKit - the gaming portal of BIS",
  description: "Learn and stay aware of Indian Standards by playing fun and engaging games",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;
  
  return (
    <html lang="en">
      <SessionProvider>
      <body
        className={`antialiased flex flex-col items-center justify-start w-full bg-neutral-950 text-neutral-100 overflow-x-hidden`}
      >
        
          <NavBar userFromProps={user} />
        
        {children}
        <Toaster
          toastOptions={{
            classNames:{
              error:"bg-red-600"
            }
          }}
        />
        <Footer/>
      </body>
      </SessionProvider>
    </html>
  );
}
