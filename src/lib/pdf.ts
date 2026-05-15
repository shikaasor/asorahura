import PDFDocument from "pdfkit";

export async function generateAssessmentPDF(params: {
  firstName: string;
  score: number;
  tier: string;
  tierDescription: string;
  segment: "cold" | "warm" | "hot";
  previewBullets: string[];
  answers: Record<number, string>;
}): Promise<Buffer> {
  const { firstName, score, tier, tierDescription, segment, previewBullets } = params;

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Colors
    const dark = "#0a0a0a";
    const gold = "#C9A84C";
    const white = "#ffffff";
    const lightGray = "#cccccc";

    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(dark);

    // ── Header bar ────────────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 70).fill("#111111");

    doc
      .fillColor(gold)
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("AI READINESS REPORT", 50, 25, { continued: false });

    doc
      .fillColor(lightGray)
      .fontSize(10)
      .font("Helvetica")
      .text("asorahura.com", 0, 30, { align: "right" });

    doc.moveDown(2);

    // ── Greeting ──────────────────────────────────────────────────────
    doc
      .fillColor(white)
      .fontSize(14)
      .font("Helvetica")
      .text(`Prepared for: ${firstName}`, 50, 90);

    doc.moveDown(1.5);

    // ── Score block ───────────────────────────────────────────────────
    const scoreY = doc.y;
    doc
      .fillColor(gold)
      .fontSize(72)
      .font("Helvetica-Bold")
      .text(`${score}`, 50, scoreY, { continued: true });

    doc
      .fillColor(lightGray)
      .fontSize(32)
      .font("Helvetica")
      .text("/100", { continued: false });

    doc.moveDown(0.3);

    doc
      .fillColor(white)
      .fontSize(16)
      .font("Helvetica-Bold")
      .text(tier, 50);

    doc.moveDown(1.5);

    // ── Tier description ──────────────────────────────────────────────
    doc
      .fillColor(lightGray)
      .fontSize(11)
      .font("Helvetica")
      .text(tierDescription, 50, doc.y, { width: doc.page.width - 100 });

    doc.moveDown(2);

    // ── Top Opportunities ─────────────────────────────────────────────
    doc
      .fillColor(gold)
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Your Top Opportunities", 50);

    doc.moveDown(0.5);

    previewBullets.forEach((bullet) => {
      doc
        .fillColor(white)
        .fontSize(11)
        .font("Helvetica")
        .text(`• ${bullet}`, 60, doc.y, { width: doc.page.width - 110 });
      doc.moveDown(0.4);
    });

    doc.moveDown(1.5);

    // ── Score interpretation table ────────────────────────────────────
    doc
      .fillColor(gold)
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("AI Readiness Score Ranges", 50);

    doc.moveDown(0.5);

    const tiers = [
      { range: "0–29", label: "Early Stage — Systems Needed" },
      { range: "30–59", label: "Pre-Deployment Ready" },
      { range: "60–79", label: "Deployment Ready" },
      { range: "80–100", label: "Advanced Optimization Ready" },
    ];

    tiers.forEach(({ range, label }) => {
      doc
        .fillColor(gold)
        .fontSize(10)
        .font("Helvetica-Bold")
        .text(`${range}  `, 60, doc.y, { continued: true });
      doc
        .fillColor(lightGray)
        .fontSize(10)
        .font("Helvetica")
        .text(label);
      doc.moveDown(0.4);
    });

    doc.moveDown(1.5);

    // ── Personalized next step ────────────────────────────────────────
    doc
      .fillColor(gold)
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Your Personalized Next Step", 50);

    doc.moveDown(0.5);

    let nextStep: string;
    if (segment === "cold") {
      nextStep =
        "Step 1: Take the free assessment (done). Step 2: Watch how similar businesses automated their top 3 manual tasks — reply to your report email and I'll send you a short video.";
    } else if (segment === "warm") {
      nextStep =
        "Book a Discovery Call — see how others at your readiness level achieved 40–60% reduction in manual effort. Visit asorahura.com to schedule.";
    } else {
      nextStep =
        "You're ready to build. Book a Strategy Session to define your exact build scope: asorahura.com/checkout?tier=strategy";
    }

    doc
      .fillColor(white)
      .fontSize(11)
      .font("Helvetica")
      .text(nextStep, 60, doc.y, { width: doc.page.width - 110 });

    doc.moveDown(3);

    // ── Footer ────────────────────────────────────────────────────────
    doc
      .fillColor(lightGray)
      .fontSize(9)
      .font("Helvetica")
      .text(
        "Prepared by Asor Ahura | asorahura.com | hello@asorahura.com",
        50,
        doc.page.height - 50,
        { align: "center", width: doc.page.width - 100 }
      );

    doc.end();
  });
}
