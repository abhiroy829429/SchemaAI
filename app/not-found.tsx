import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center hero-gradient px-4 text-center">
      <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/">
        <Button variant="gradient">Go Home</Button>
      </Link>
    </div>
  );
}
