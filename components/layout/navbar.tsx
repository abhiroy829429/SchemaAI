"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const isLanding = pathname === "/";

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="gradient-text">GovAssist AI</span>
        </Link>

        {isLanding && (
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="gradient" size="sm">Get Started</Button>
              </SignUpButton>
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && isLanding && (
        <div className="md:hidden border-t border-border p-4 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block py-2 text-sm" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const links = [
    { href: "/dashboard", label: "Overview", icon: "📊" },
    { href: "/dashboard/profile", label: "Profile", icon: "👤" },
    { href: "/dashboard/eligibility", label: "Eligibility", icon: "✅" },
    { href: "/dashboard/documents", label: "Documents", icon: "📄" },
    { href: "/dashboard/checklist", label: "Checklist", icon: "📋" },
    { href: "/dashboard/roadmap", label: "Roadmap", icon: "🗺️" },
    { href: "/dashboard/tracker", label: "Tracker", icon: "📍" },
    { href: "/dashboard/chat", label: "AI Chat", icon: "💬" },
    { href: "/dashboard/notifications", label: "Notifications", icon: "🔔" },
    { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
    { href: "/dashboard/admin", label: "Admin", icon: "🛡️" },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/50 p-4 gap-1">
      <Link href="/" className="flex items-center gap-2 px-3 py-3 mb-4 font-bold">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white text-xs">
          GA
        </div>
        GovAssist AI
      </Link>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
            pathname === link.href
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <span>{link.icon}</span>
          {link.label}
        </Link>
      ))}
    </aside>
  );
}
