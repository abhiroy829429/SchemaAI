"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ChatWidget } from "@/components/shared/chat-widget";

export default function ChatPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">AI Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Ask about schemes in English or Hindi. Compare benefits, get advice, and understand eligibility.
          </p>
        </div>
        <ChatWidget floating={false} />
      </div>
    </DashboardLayout>
  );
}
