import PDFDocument from "pdfkit";

export async function generateAssessmentPDF(
  firstName: string,
  score: number,
  tier: string,
  tierDescription: string,
  previewBullets: string[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Header
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("AI Readiness Report", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(14)
      .font("Helvetica")
      .text(`Prepared for: ${firstName}`, { align: "center" });
    doc.moveDown(2);

    // Score
    doc
      .fontSize(48)
      .font("Helvetica-Bold")
      .text(`${score}/100`, { align: "center" });
    doc
      .fontSize(18)
      .font("Helvetica")
      .text(tier, { align: "center" });
    doc.moveDown(2);

    // Description
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(tierDescription, { align: "left" });
    doc.moveDown(2);

    // Top opportunities
    doc.fontSize(16).font("Helvetica-Bold").text("Your Top Opportunities");
    doc.moveDown();
    previewBullets.forEach((bullet) => {
      doc.fontSize(12).font("Helvetica").text(`• ${bullet}`);
      doc.moveDown(0.5);
    });

    doc.moveDown(2);
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("gray")
      .text(
        "asorahura.com | Scale Your Business Without Scaling Your Payroll",
        { align: "center" }
      );

    doc.end();
  });
}
