import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./form";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#FAFAFA] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-[#E5E7EB]">
            <div className="h-3 w-3 rounded-full bg-[#FF6B35]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">
            Welcome back
          </h1>
          <p className="mt-1.5 text-[#6B7280]">
            Sign in to continue your challenge
          </p>
        </div>

        <div className="card">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-8 text-sm text-[#6B7280]">
                loading...
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-sm text-[#6B7280]">
          No account yet?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#FF6B35] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
