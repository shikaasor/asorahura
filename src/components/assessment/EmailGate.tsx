"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailGateSchema, type EmailGateInput } from "@/lib/validation";

interface Props {
  onSubmit: (data: EmailGateInput) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export function EmailGate({ onSubmit, isLoading, error }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailGateInput>({
    resolver: zodResolver(emailGateSchema),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          You&apos;re done — see your results
        </h2>
        <p className="text-gray-600 mt-2">
          Enter your details below to unlock your personalized score. We&apos;ll
          also send your full report to your inbox.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("firstName")}
            placeholder="First name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition-opacity"
        >
          {isLoading ? "Sending your report..." : "Access My Results"}
        </button>
      </form>
      <p className="text-xs text-gray-400">No spam. Unsubscribe any time.</p>
    </div>
  );
}
