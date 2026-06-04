"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "./actions";

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(resetPasswordAction, { error: "" });

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}
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
          className="input-field"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label
          htmlFor="code"
          className="mb-1.5 block text-sm font-medium text-[#4B5563]"
        >
          Reset Code
        </label>
        <input
          id="code"
          name="code"
          type="text"
          required
          className="input-field font-mono tracking-widest text-center text-lg"
          placeholder="000000"
          maxLength={6}
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-[#4B5563]"
        >
          New Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="input-field"
          placeholder="At least 6 characters"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full disabled:opacity-50"
      >
        {pending ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}
