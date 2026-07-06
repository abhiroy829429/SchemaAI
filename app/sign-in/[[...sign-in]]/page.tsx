import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center hero-gradient">
      <style>{`
        .cl-internal-b3l6o5 {
          display: none !important;
        }
      `}</style>
      <SignIn />
    </div>
  );
}
