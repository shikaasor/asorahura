"use client";

import { useState } from "react";
import { TierSelector } from "@/components/checkout/TierSelector";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PaddleCheckout } from "@/components/checkout/PaddleCheckout";
import { TrustBadges } from "@/components/checkout/TrustBadges";
import { getTierById, type TierId } from "@/lib/checkout";

export default function CheckoutPage() {
  const [selectedTier, setSelectedTier] = useState<TierId>("starter");
  const tier = getTierById(selectedTier);

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Get Started</h1>
          <p className="text-gray-600 mt-2">Choose the engagement that fits your goals.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left: tier selection + order summary + trust badges */}
          <div className="space-y-6">
            <TierSelector selected={selectedTier} onChange={setSelectedTier} />
            <OrderSummary tierId={selectedTier} />
            <TrustBadges />
          </div>

          {/* Right: Paddle inline checkout */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-sm font-semibold text-gray-700 mb-4">Payment</p>
            <PaddleCheckout priceId={tier.paddlePriceId} />
          </div>
        </div>
      </div>
    </main>
  );
}
