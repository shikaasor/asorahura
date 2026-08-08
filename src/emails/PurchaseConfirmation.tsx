import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
} from "@react-email/components";

interface Props {
  firstName?: string;
  productType: "dfy" | "dwy" | "care-plan";
  transactionId: string;
  amount: string;
  email: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://asorahura.vercel.app";

const PRODUCT_NAMES: Record<Props["productType"], string> = {
  dfy: "Done For You",
  dwy: "Done With You",
  "care-plan": "Care Plan",
};

const NEXT_STEPS: Record<Props["productType"], string> = {
  dfy: "We'll build this in 3–5 days.",
  dwy: "Check your inbox for a scheduling link to start your build session.",
  "care-plan": "Your subscription is active — token renewals, uptime, and copy updates are now handled.",
};

export function PurchaseConfirmation({
  firstName,
  productType,
  transactionId,
  amount,
  email,
}: Props) {
  const unsubscribeUrl = `${BASE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`;
  const greeting = firstName ? `Thanks, ${firstName}` : "Thanks for your order";

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
            {greeting} — your order is confirmed
          </Heading>
          <Section style={{ padding: "16px 0" }}>
            <Text style={{ fontSize: "16px", color: "#111", margin: "0 0 4px" }}>
              {PRODUCT_NAMES[productType]}
            </Text>
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
          <Text style={{ fontSize: "15px", color: "#374151", lineHeight: "1.6" }}>
            {NEXT_STEPS[productType]}
          </Text>
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
