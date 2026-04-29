"use client";

import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { usePathname } from "next/navigation";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatPage = pathname?.startsWith("/chat");
  const isHomePage = pathname === "/";

  return (
    <div className={`relative flex flex-col ${isHomePage ? "bg-zinc-950" : "bg-white"} ${isChatPage ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      <header className={`flex-shrink-0 sticky top-0 z-50 w-full border-b transition-all duration-500 ${
        isHomePage 
          ? "border-white/5 bg-zinc-950/50 backdrop-blur-xl" 
          : "border-zinc-100 bg-white/80 backdrop-blur-md"
      }`}>
        <div className="container mx-auto flex h-16 items-center px-4 justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className={`text-xl font-bold tracking-tight ${isHomePage ? "text-white" : "text-zinc-900"}`}>Doc Chat</span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6 text-[13px] sm:text-sm font-medium">
            <Link href="/" className={isHomePage ? "text-white font-bold" : (pathname === "/" ? "text-primary font-bold" : "text-zinc-500 hover:text-zinc-900 transition-colors")}>Home</Link>
            <Link href="/upload" className={isHomePage ? "text-zinc-400 hover:text-white transition-colors" : (pathname === "/upload" ? "text-primary font-bold" : "text-zinc-500 hover:text-zinc-900 transition-colors")}>Upload</Link>
            <Link href="/chat" className={isHomePage ? "text-zinc-400 hover:text-white transition-colors" : (isChatPage ? "text-primary font-bold" : "text-zinc-500 hover:text-zinc-900 transition-colors")}>Chat</Link>
          </nav>
        </div>
      </header>
      <main className={`flex-1 flex flex-col min-h-0 ${isChatPage ? "overflow-hidden" : ""}`}>
        {children}
      </main>
      {!isChatPage && (
        <footer className={`flex-shrink-0 border-t py-8 ${isHomePage ? "border-white/5 bg-zinc-950" : "border-zinc-100 bg-zinc-50/50"}`}>
          <div className={`container mx-auto text-center text-xs font-medium uppercase tracking-widest ${isHomePage ? "text-zinc-600" : "text-zinc-400"}`}>
            © {new Date().getFullYear()} Doc Chat.
          </div>
        </footer>
      )}
    </div>
  );
}
