import { AssessmentShell } from "@/components/assessment/AssessmentShell";

export const metadata = {
  title: "AI Readiness Assessment | Asor Ahura",
  description:
    "Answer 8 questions and get a personalized AI readiness score — free, takes 4 minutes.",
};

export default function AssessmentPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Entry hero — ASSESS-01, ASSESS-02, ASSESS-03 */}
      <section className="bg-gray-950 text-white py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Find Out Exactly Where AI Can Save Your Business 10+ Hours a Week
          </h1>
          <p className="text-gray-300 text-lg">
            Answer 8 questions. Get a personalized AI readiness score and a
            report showing your highest-impact opportunities.
          </p>
          {/* ASSESS-03: micro-trust signals */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 pt-2">
            {["Free", "Takes 4 Minutes", "Instant Results", "No Sales Call"].map(
              (t) => (
                <span
                  key={t}
                  className="border border-gray-700 rounded-full px-3 py-1"
                >
                  {t}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Assessment shell — handles all question/gate/results state */}
      <section className="container mx-auto max-w-2xl px-4 py-16">
        <AssessmentShell />
      </section>
    </main>
  );
}
