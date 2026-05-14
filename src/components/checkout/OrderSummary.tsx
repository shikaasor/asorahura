import { getTierById, type TierId } from "@/lib/checkout";

export function OrderSummary({ tierId }: { tierId: TierId }) {
  const tier = getTierById(tierId);
  return (
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <div>
        <p className="text-sm text-gray-500 uppercase tracking-wide">You&apos;re getting</p>
        <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{tier.price}</p>
        <p className="text-sm text-gray-500">{tier.priceDetail}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">What&apos;s included:</p>
        <ul className="space-y-1">
          {tier.deliverables.map((d, i) => (
            <li key={i} className="text-sm text-gray-600 flex gap-2">
              <span className="text-green-500 shrink-0">✓</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t pt-4 space-y-1">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Timeline:</span> {tier.timeline}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Support:</span> {tier.support}
        </p>
      </div>
    </div>
  );
}
