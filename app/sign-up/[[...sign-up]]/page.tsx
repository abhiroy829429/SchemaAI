import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center hero-gradient">
      <SignUp appearance={{
        elements: {
          footer: {
            display: "none",
          },
        },
      }} />
    </div>
  );
}
