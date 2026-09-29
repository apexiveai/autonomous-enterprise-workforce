import type { Metadata } from "next";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";
import "./globals.css";

export const metadata: Metadata = {

  title: {

    default: "AEWE — Autonomous Enterprise Workforce",

    template: "%s | AEWE",

  },

  description:

    "Autonomous Enterprise Workforce — enterprise agent execution and orchestration platform.",

  applicationName: "AEWE",

  robots: {

    index: false,

    follow: false,

  },

};

export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {

  return (

    <html lang="en">

      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <AuthProvider>
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
      </body>

    </html>

  );

}