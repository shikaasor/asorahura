import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Row,
  Column,
  Hr,
} from "@react-email/components";
import { formatUsd, formatInvoiceDate, type Invoice } from "@/lib/invoice";

/**
 * The invoice arrives as an attached PDF, but the payment details are repeated
 * in the email body on purpose: a buyer paying from their phone should not have
 * to open an attachment to find an account number.
 *
 * Nothing in here may read as a receipt. No money has moved yet.
 */
export function InvoiceEmail({ invoice }: { invoice: Invoice }) {
  const greeting = invoice.billTo.name ? `Hi ${invoice.billTo.name},` : "Hi,";

  return (
    <Html>
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9fafb", padding: "20px" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "32px",
            maxWidth: "600px",
          }}
        >
          <Heading style={{ fontSize: "22px", color: "#111", margin: "0 0 4px" }}>
            Invoice {invoice.number}
          </Heading>
          <Text style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 24px" }}>
            {greeting} here&apos;s your invoice for {invoice.item.label}. It&apos;s attached as a
            PDF, and the payment details are below.
          </Text>

          <Section
            style={{
              backgroundColor: "#f9fafb",
              borderRadius: "6px",
              padding: "16px",
              margin: "0 0 24px",
            }}
          >
            <Row>
              <Column>
                <Text style={{ fontSize: "14px", color: "#374151", margin: "0" }}>
                  {invoice.item.label}
                </Text>
              </Column>
              <Column align="right">
                <Text style={{ fontSize: "14px", color: "#374151", margin: "0" }}>
                  {formatUsd(invoice.item.amountUsd)}
                </Text>
              </Column>
            </Row>
            <Hr style={{ borderColor: "#e5e7eb", margin: "12px 0" }} />
            <Row>
              <Column>
                <Text style={{ fontSize: "16px", fontWeight: "bold", color: "#111", margin: "0" }}>
                  Total due
                </Text>
              </Column>
              <Column align="right">
                <Text style={{ fontSize: "16px", fontWeight: "bold", color: "#111", margin: "0" }}>
                  {formatUsd(invoice.totalUsd)} USD
                </Text>
              </Column>
            </Row>
            <Text style={{ fontSize: "13px", color: "#6b7280", margin: "8px 0 0" }}>
              Due {formatInvoiceDate(invoice.dueAt)}
            </Text>
          </Section>

          <Heading as="h2" style={{ fontSize: "16px", color: "#111", margin: "0 0 12px" }}>
            How to pay
          </Heading>

          {invoice.rails.length === 0 ? (
            <Text style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}>
              Reply to this email and we&apos;ll send payment details straight back.
            </Text>
          ) : (
            invoice.rails.map((rail) => (
              <Section key={rail.name} style={{ margin: "0 0 16px" }}>
                <Text
                  style={{ fontSize: "14px", fontWeight: "bold", color: "#111", margin: "0 0 4px" }}
                >
                  {rail.name}
                </Text>
                {rail.fields.map(([label, value]) => (
                  <Text
                    key={label}
                    style={{ fontSize: "13px", color: "#374151", margin: "0 0 2px" }}
                  >
                    {label}: <strong>{value}</strong>
                  </Text>
                ))}
              </Section>
            ))
          )}

          <Text style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.6" }}>
            Please quote <strong>{invoice.number}</strong> as the payment reference so we can match
            it to your order. Would a card be easier? You can pay by card on the site instead, and
            it clears immediately. Prefer a Payoneer request? Reply and we&apos;ll send one.
          </Text>

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          <Text style={{ fontSize: "13px", color: "#374151", lineHeight: "1.6" }}>
            We&apos;ll confirm by email as soon as the payment lands, and work starts from there.
          </Text>

          <Text style={{ fontSize: "12px", color: "#9ca3af", margin: "16px 0 0" }}>
            {invoice.business.name} · {invoice.business.email}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default InvoiceEmail;
