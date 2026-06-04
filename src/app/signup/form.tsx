"use client";

import { useActionState } from "react";
import { signupAction } from "./actions";

export function SignupForm() {
  const [state, action, pending] = useActionState(
    signupAction,
    { error: "" }
  );

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-[#4B5563]"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="input-field"
          placeholder="Your name"
        />
      </div>
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
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-[#4B5563]"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="input-field"
          placeholder="At least 6 characters"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full disabled:opacity-50"
      >
        {pending ? "Creating..." : "Begin 21 Days"}
      </button>
    </form>
  );
}
