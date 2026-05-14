import Link from "next/link";

export const metadata = {
  title: "Payment Successful | Asor Ahura",
};

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md space-y-6">
        <div className="text-5xl">&#x2705;</div>
        <h1 className="text-3xl font-bold text-gray-900">You&apos;re in.</h1>
        <p className="text-gray-600 text-lg">
          Payment received. Asor will be in touch within 1 business day to confirm next steps and
          schedule your kickoff.
        </p>
        <p className="text-gray-500 text-sm">
          Check your inbox for a receipt from Paddle. If you have any questions, email{" "}
          <a href="mailto:hello@asorahura.com" className="underline text-gray-700">
            hello@asorahura.com
          </a>
          .
        </p>
        <Link
          href="/"
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    </main>
  );
}
