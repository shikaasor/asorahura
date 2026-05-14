const badges = [
  { label: "Oracle Certified", icon: "🏆" },
  { label: "Secure Payment via Paddle", icon: "🔒" },
  { label: "100% IP Ownership", icon: "✅" },
];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {badges.map((b) => (
        <div
          key={b.label}
          className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600"
        >
          <span>{b.icon}</span>
          <span>{b.label}</span>
        </div>
      ))}
    </div>
  );
}
