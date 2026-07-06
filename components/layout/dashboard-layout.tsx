"use client";

import { DashboardSidebar } from "@/components/layout/navbar";
import { ChatWidget } from "@/components/shared/chat-widget";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen pt-16">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
      <ChatWidget floating />
    </div>
  );
}
