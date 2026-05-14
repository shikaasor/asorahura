import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Section,
  Hr,
} from "@react-email/components";

interface Props {
  firstName: string;
  score: number;
  tier: string;
  tierDescription: string;
  previewBullets: string[];
}

export function AssessmentReport({
  firstName,
  score,
  tier,
  tierDescription,
  previewBullets,
}: Props) {
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
            Your AI Readiness Report is here, {firstName}
          </Heading>
          <Section style={{ textAlign: "center", padding: "24px 0" }}>
            <Text
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#111",
                margin: "0",
              }}
            >
              {score}/100
            </Text>
            <Text style={{ fontSize: "18px", color: "#6b7280", margin: "0" }}>
              {tier}
            </Text>
          </Section>
          <Text
            style={{ fontSize: "15px", color: "#374151", lineHeight: "1.6" }}
          >
            {tierDescription}
          </Text>
          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />
          <Heading as="h2" style={{ fontSize: "18px", color: "#111" }}>
            Your Top Opportunities
          </Heading>
          {previewBullets.map((bullet, i) => (
            <Text key={i} style={{ fontSize: "14px", color: "#374151" }}>
              • {bullet}
            </Text>
          ))}
          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />
          <Text style={{ fontSize: "14px", color: "#6b7280" }}>
            Your full PDF report is attached. It includes a detailed breakdown
            of your score and a personalized roadmap.
          </Text>
          <Button
            href="https://calendly.com/asorahura"
            style={{
              backgroundColor: "#111",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "6px",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            Book a Discovery Call
          </Button>
        </Container>
      </Body>
    </Html>
  );
}

export default AssessmentReport;
