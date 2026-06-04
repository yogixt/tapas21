"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "./actions";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, { error: "", success: "", resetCode: "" });

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}
      {state.success && !state.error && (
        <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 space-y-2">
          <p className="text-sm text-green-700">{state.success}</p>
          <div className="rounded-lg bg-white border border-green-200 px-4 py-3 text-center">
            <p className="text-xs text-[#6B7280] mb-1">Your reset code</p>
            <p className="font-mono text-2xl font-bold tracking-widest text-[#FF6B35]">
              {state.resetCode}
            </p>
          </div>
          <p className="text-xs text-green-600">
            Use this code at{" "}
            <Link href="/reset-password" className="font-semibold underline">
              Reset Password
            </Link>
          </p>
        </div>
      )}
      {!state.success && (
        <>
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-[#4B5563]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="input-field"
              placeholder="your@email.com"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="btn-primary w-full disabled:opacity-50"
          >
            {pending ? "Sending..." : "Send Reset Code"}
          </button>
        </>
      )}
    </form>
  );
}
