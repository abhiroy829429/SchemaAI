"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-6">{error.message}</p>
      <button onClick={reset} className="rounded-xl bg-primary px-6 py-2 text-primary-foreground">
        Try Again
      </button>
    </div>
  );
}
