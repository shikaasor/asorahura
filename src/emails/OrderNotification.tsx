import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
} from "@react-email/components";
import { productLabel, productSummary, productNeedsOnboarding } from "@/lib/products";

interface Props {
  /** Every line on the transaction, first the tier the buyer clicked, then any
   *  add-ons. A DFY sold with the Care Plan is ["dfy", "care-plan"]. */
  products: string[];
  transactionId: string;
  amount: string;
  buyerEmail: string;
}

export function OrderNotification({
  products,
  transactionId,
  amount,
  buyerEmail,
}: Props) {
  // An add-on-only line (the Care Plan) needs no build step, but a tier bought
  // alongside it still does.
  const needsOnboarding = products.some(productNeedsOnboarding);

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
            New Order: {productSummary(products)} from {buyerEmail}
          </Heading>
          <Section style={{ padding: "16px 0" }}>
            <Text style={{ fontSize: "14px", color: "#374151", margin: "0" }}>
              Buyer: {buyerEmail}
            </Text>
            {products.map((product, i) => (
              <Text
                key={`${product}-${i}`}
                style={{ fontSize: "14px", color: "#374151", margin: "0" }}
              >
                {i === 0 ? "Product" : "Add-on"}: {productLabel(product)}
              </Text>
            ))}
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
                Awaiting onboarding form submission, check /automate/instagram/success activity.
              </Text>
            </>
          )}
        </Container>
      </Body>
    </Html>
  );
}

export default OrderNotification;
