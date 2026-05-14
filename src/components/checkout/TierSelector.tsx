"use client";

import { tiers, type TierId } from "@/lib/checkout";

interface Props {
  selected: TierId;
  onChange: (id: TierId) => void;
}

export function TierSelector({ selected, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-700">Select your tier</p>
      <div className="grid gap-3">
        {tiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => onChange(tier.id)}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
              selected === tier.id
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 hover:border-gray-400 text-gray-800"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{tier.name}</span>
              <span className={`text-sm ${selected === tier.id ? "text-gray-300" : "text-gray-500"}`}>
                {tier.price}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
