import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import PageTransition from "@/components/layout/PageTransition";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "RetailPulse AI — Retail Revenue Intelligence",
  description: "Enterprise AI-powered retail analytics and revenue optimization platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main
            className="flex-1 ml-64 min-h-screen overflow-x-hidden flex flex-col"
            style={{ background: "linear-gradient(160deg,#020817 0%,#080d1a 50%,#020817 100%)" }}
          >
            <div className="flex-1 pb-20">
              <PageTransition>{children}</PageTransition>
            </div>
            <footer className="fixed bottom-0 left-64 right-0 z-40 border-t"
              style={{ borderColor: "rgba(124,58,237,0.2)", background: "rgba(5,8,18,0.97)", backdropFilter: "blur(20px)" }}>
              <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: "linear-gradient(90deg,transparent,#7c3aed,#06b6d4,#34d399,transparent)" }} />
              <div className="flex items-center justify-center gap-2 py-2.5">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)", boxShadow: "0 0 14px rgba(124,58,237,0.6)" }}>⚡</div>
                <span className="text-sm text-slate-400 font-medium">Built by</span>
                <span className="text-sm font-black" style={{ color: "#c084fc", textShadow: "0 0 12px #c084fc" }}>Jagadeesh</span>
                <span className="text-sm font-bold" style={{ color: "#475569" }}>×</span>
                <span className="text-sm font-black" style={{ color: "#fbbf24", textShadow: "0 0 12px #fbbf24" }}>Amazon Q</span>
              </div>
            </footer>
          </main>
        </div>
      </body>
    </html>
  );
}
