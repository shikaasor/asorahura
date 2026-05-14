import { getTierDescription, getPreviewBullets } from "@/lib/assessment";

// LOCKED DECISION: "results page offers downloadable full 20-question scorecard PDF"
// The full scorecard PDF is a PRE-BUILT static file at public/ai-readiness-scorecard.pdf
// (separate from the personalized 8-question results PDF emailed server-side).
// It is served by Next.js as /ai-readiness-scorecard.pdf — no API route needed.

interface Props {
  score: number;
  tier: string;
  firstName: string;
}

export function ResultsScreen({ score, tier, firstName }: Props) {
  const description = getTierDescription(score);
  const bullets = getPreviewBullets(score);

  return (
    <div className="space-y-8">
      {/* Score display */}
      <div className="text-center space-y-2">
        <p className="text-gray-500">Your AI Readiness Score</p>
        <div className="text-7xl font-bold text-gray-900">{score}/100</div>
        <div className="text-xl font-semibold text-gray-700">{tier}</div>
      </div>

      {/* Tier description */}
      <div className="bg-gray-50 rounded-xl p-6">
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>

      {/* Preview bullets */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">
          Your Top Opportunities
        </h3>
        <ul className="space-y-2">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2 text-gray-700">
              <span className="text-gray-400 shrink-0">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t pt-6 space-y-4">
        {/* Email delivery confirmation */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="font-semibold text-green-800">
            Your Full Report Is On Its Way
          </p>
          <p className="text-green-700 text-sm mt-1">
            Check your inbox — your personalized PDF report with full breakdown
            and next steps has been sent to {firstName}.
          </p>
        </div>

        {/* Full 20-question scorecard download */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="font-semibold text-gray-900">
              Want the complete 20-question breakdown?
            </p>
            <p className="text-gray-600 text-sm mt-0.5">
              Download the full AI Readiness Scorecard — all 20 questions with
              scoring guidance.
            </p>
          </div>
          <a
            href="/ai-readiness-scorecard.pdf"
            download="AI_Readiness_Scorecard.pdf"
            className="shrink-0 inline-block bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors text-center"
          >
            Download Full PDF
          </a>
        </div>

        {/* Discovery Call CTA */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">
            Want to talk through your results?
          </p>
          <a
            href="https://calendly.com/asorahura"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors"
          >
            Book a Discovery Call
          </a>
        </div>
      </div>
    </div>
  );
}
