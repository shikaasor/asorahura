import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
} from "@react-email/components";
import { productLabel, productNextSteps } from "@/lib/products";

interface Props {
  firstName?: string;
  /** Every line on the transaction — a tier bought with the Care Plan add-on
   *  arrives as ["dfy", "care-plan"] and both are listed. */
  products: string[];
  transactionId: string;
  amount: string;
  email: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://asorahura.vercel.app";

export function PurchaseConfirmation({
  firstName,
  products,
  transactionId,
  amount,
  email,
}: Props) {
  const unsubscribeUrl = `${BASE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`;
  const greeting = firstName ? `Thanks, ${firstName}` : "Thanks for your order";
  // Two lines can share next steps (they don't today); dedupe so the buyer is
  // never told the same thing twice.
  const nextSteps = products
    .map(productNextSteps)
    .filter((step, i, all) => all.indexOf(step) === i);

  return (
    <Html>
      <Body
        style={{
          fontFamily: "sans-serif",
          backgroundColor: "#f9fafb",
          padding: "20px",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "32px",
            maxWidth: "600px",
          }}
        >
          <Heading style={{ fontSize: "24px", color: "#111" }}>
            {greeting}, your order is confirmed
          </Heading>
          <Section style={{ padding: "16px 0" }}>
            {products.map((product, i) => (
              <Text
                key={`${product}-${i}`}
                style={{ fontSize: "16px", color: "#111", margin: "0 0 4px" }}
              >
                {productLabel(product)}
              </Text>
            ))}
            <Text style={{ fontSize: "14px", color: "#6b7280", margin: "0" }}>
              Amount: {amount}
            </Text>
            <Text style={{ fontSize: "14px", color: "#6b7280", margin: "0" }}>
              Transaction ID: {transactionId}
            </Text>
          </Section>
          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />
          <Heading as="h2" style={{ fontSize: "18px", color: "#111" }}>
            What happens next
          </Heading>
          {nextSteps.map((step) => (
            <Text
              key={step}
              style={{ fontSize: "15px", color: "#374151", lineHeight: "1.6" }}
            >
              {step}
            </Text>
          ))}
          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />
          <Text style={{ fontSize: "12px", color: "#9ca3af", textAlign: "center" }}>
            You received this because you made a purchase at asorahura.com.{" "}
            <a href={unsubscribeUrl} style={{ color: "#9ca3af" }}>Unsubscribe</a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default PurchaseConfirmation;
