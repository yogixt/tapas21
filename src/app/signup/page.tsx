import Link from "next/link";
import { SignupForm } from "./form";

export default function SignupPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#FAFAFA] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-[#E5E7EB]">
            <div className="h-3 w-3 rounded-full bg-[#22C55E]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">
            Start your challenge
          </h1>
          <p className="mt-1.5 text-[#6B7280]">
            21 days to transform yourself
          </p>
        </div>

        <div className="card">
          <SignupForm />
        </div>

        <p className="mt-6 text-center text-sm text-[#6B7280]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#FF6B35] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
