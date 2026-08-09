"use client";

import { tiers, type TierId } from "@/lib/checkout";

interface Props {
  selected: TierId;
  onChange: (id: TierId) => void;
}

export function TierSelector({ selected, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-[var(--ink-1)]">Select your tier</p>
      <div className="grid gap-3">
        {tiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => onChange(tier.id)}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
              selected === tier.id
                ? "border-[var(--ink-1)] bg-[var(--ink-1)] text-[var(--surface-1)]"
                : "border-[var(--border-1)] hover:border-[var(--border-2)] text-[var(--ink-1)]"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{tier.name}</span>
              <span className={`text-sm ${selected === tier.id ? "text-[var(--surface-3)]" : "text-[var(--ink-2)]"}`}>
                {tier.price}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
