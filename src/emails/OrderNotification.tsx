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
  productType: "dfy" | "dwy" | "care-plan";
  transactionId: string;
  amount: string;
  buyerEmail: string;
}

const PRODUCT_NAMES: Record<Props["productType"], string> = {
  dfy: "Done For You",
  dwy: "Done With You",
  "care-plan": "Care Plan",
};

export function OrderNotification({
  productType,
  transactionId,
  amount,
  buyerEmail,
}: Props) {
  const needsOnboarding = productType === "dfy" || productType === "dwy";

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
            New Order: {productType} from {buyerEmail}
          </Heading>
          <Section style={{ padding: "16px 0" }}>
            <Text style={{ fontSize: "14px", color: "#374151", margin: "0" }}>
              Buyer: {buyerEmail}
            </Text>
            <Text style={{ fontSize: "14px", color: "#374151", margin: "0" }}>
              Product: {PRODUCT_NAMES[productType]}
            </Text>
            <Text style={{ fontSize: "14px", color: "#374151", margin: "0" }}>
              Amount: {amount}
            </Text>
            <Text style={{ fontSize: "14px", color: "#374151", margin: "0" }}>
              Transaction ID: {transactionId}
            </Text>
          </Section>
          {needsOnboarding && (
            <>
              <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />
              <Text style={{ fontSize: "14px", color: "#6b7280" }}>
                Awaiting onboarding form submission — check /automate/instagram/success activity.
              </Text>
            </>
          )}
        </Container>
      </Body>
    </Html>
  );
}

export default OrderNotification;
