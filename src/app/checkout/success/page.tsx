import Link from "next/link";

export const metadata = {
  title: "Payment Successful | Asor Ahura",
};

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-16">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Confirmation header */}
        <div className="text-center space-y-4">
          <div className="text-5xl">&#x2705;</div>
          <h1 className="text-3xl font-bold text-gray-900">Payment confirmed.</h1>
          <p className="text-gray-600 text-lg">
            Now book your discovery call so we can map out exactly how AI will work for your
            business.
          </p>
          <p className="text-gray-500 text-sm">
            Check your inbox for a receipt from Paddle. Questions?{" "}
            <a href="mailto:hello@asorahura.com" className="underline text-gray-700">
              hello@asorahura.com
            </a>
          </p>
        </div>

        {/* Embedded Calendly */}
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <iframe
            src="https://calendly.com/asorahura"
            width="100%"
            height="700"
            frameBorder="0"
            title="Book your discovery call"
          />
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-gray-400 underline hover:text-gray-600 transition-colors"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
