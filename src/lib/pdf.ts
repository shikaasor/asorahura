import PDFDocument from "pdfkit";
import { SUPPORT_EMAIL } from "@/lib/constants";
import { formatUsd, formatInvoiceDate, type Invoice } from "@/lib/invoice";

export async function generateAssessmentPDF(params: {
  firstName: string;
  score: number;
  tier: string;
  tierDescription: string;
  segment: "cold" | "warm" | "hot";
  previewBullets: string[];
  answers: Record<number, string>;
  personalizedNextStep?: string;
}): Promise<Buffer> {
  const { firstName, score, tier, tierDescription, segment, previewBullets, personalizedNextStep } = params;

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
      .text("AI OPPORTUNITY DISCOVERY REPORT", 50, 25, { continued: false });

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

    // Explicitly position tier below the 72pt score, doc.y after a
    // continued chain reflects the smaller trailing font, not the tallest.
    doc
      .fillColor(white)
      .fontSize(16)
      .font("Helvetica-Bold")
      .text(tier, 50, scoreY + 84);

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
      .text("Opportunity Score Ranges", 50);

    doc.moveDown(0.5);

    const tiers = [
      { range: "0–29", label: "Early Stage: Systems Needed" },
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
    if (personalizedNextStep) {
      nextStep = personalizedNextStep;
    } else if (segment === "cold") {
      nextStep =
        "Step 1: Complete the free discovery (done). Step 2: Watch how similar businesses automated their top 3 manual tasks. Reply to your report email and I'll send you a short video.";
    } else if (segment === "warm") {
      nextStep =
        "See your purchase options. See how others at your readiness level achieved 40–60% reduction in manual effort. Visit asorahura.com/checkout to get started.";
    } else {
      nextStep =
        "You're ready to build. See your purchase options and get started today: asorahura.com/checkout";
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
        `Prepared by Asor Ahura | asorahura.com | ${SUPPORT_EMAIL}`,
        50,
        doc.page.height - 50,
        { align: "center", width: doc.page.width - 100 }
      );

    doc.end();
  });
}

/**
 * Invoice PDF — deliberately plain, light, and unbranded compared to the
 * assessment report above. This document gets forwarded to somebody's
 * bookkeeper and printed; the dark gold-on-black treatment that suits a lead
 * magnet reads as a marketing flyer on an accounts-payable desk, and burns a
 * page of toner.
 */
export async function generateInvoicePDF(invoice: Invoice): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const ink = "#111111";
    const muted = "#666666";
    const rule = "#dddddd";
    const left = 50;
    const right = doc.page.width - 50;
    const contentWidth = right - left;

    function horizontalRule(y: number) {
      doc.moveTo(left, y).lineTo(right, y).strokeColor(rule).lineWidth(1).stroke();
    }

    // ── Header: who is billing, and the word INVOICE ──────────────────
    doc.fillColor(ink).fontSize(20).font("Helvetica-Bold").text(invoice.business.name, left, 50);

    const issuerLines = [
      invoice.business.address,
      invoice.business.email,
      invoice.business.taxId ? `Tax ID: ${invoice.business.taxId}` : undefined,
    ].filter(Boolean) as string[];

    doc.fillColor(muted).fontSize(9).font("Helvetica");
    issuerLines.forEach((line) => doc.text(line, left, doc.y, { width: contentWidth * 0.5 }));

    doc
      .fillColor(ink)
      .fontSize(26)
      .font("Helvetica-Bold")
      .text("INVOICE", left, 50, { align: "right", width: contentWidth });

    doc.fillColor(muted).fontSize(10).font("Helvetica");
    doc.text(`No. ${invoice.number}`, left, 82, { align: "right", width: contentWidth });
    doc.text(`Issued ${formatInvoiceDate(invoice.issuedAt)}`, left, 96, {
      align: "right",
      width: contentWidth,
    });
    doc
      .fillColor(ink)
      .font("Helvetica-Bold")
      .text(`Due ${formatInvoiceDate(invoice.dueAt)}`, left, 110, {
        align: "right",
        width: contentWidth,
      });

    horizontalRule(140);

    // ── Bill To ───────────────────────────────────────────────────────
    doc.fillColor(muted).fontSize(9).font("Helvetica-Bold").text("BILL TO", left, 155);

    // Below the billing-details threshold the buyer gave us an email and
    // nothing else, so the email is the whole block rather than a subtitle.
    const billToLines = [
      invoice.billTo.company,
      invoice.billTo.name,
      invoice.billTo.email,
    ].filter(Boolean) as string[];

    doc.fillColor(ink).fontSize(11).font("Helvetica");
    let billToY = 170;
    billToLines.forEach((line) => {
      doc.text(line, left, billToY, { width: contentWidth * 0.6 });
      billToY += 15;
    });

    // ── Line items ────────────────────────────────────────────────────
    const tableTop = Math.max(billToY + 25, 230);

    doc.fillColor(muted).fontSize(9).font("Helvetica-Bold");
    doc.text("DESCRIPTION", left, tableTop);
    doc.text("AMOUNT", left, tableTop, { align: "right", width: contentWidth });

    horizontalRule(tableTop + 15);

    doc.fillColor(ink).fontSize(11).font("Helvetica");
    doc.text(invoice.item.label, left, tableTop + 27, { width: contentWidth * 0.7 });
    doc.text(formatUsd(invoice.item.amountUsd), left, tableTop + 27, {
      align: "right",
      width: contentWidth,
    });

    const totalY = tableTop + 60;
    horizontalRule(totalY);

    doc.fillColor(ink).fontSize(13).font("Helvetica-Bold");
    doc.text("Total due", left, totalY + 12);
    doc.text(`${formatUsd(invoice.totalUsd)} USD`, left, totalY + 12, {
      align: "right",
      width: contentWidth,
    });

    // ── Payment rails ─────────────────────────────────────────────────
    let y = totalY + 55;

    doc.fillColor(muted).fontSize(9).font("Helvetica-Bold").text("HOW TO PAY", left, y);
    y += 18;

    if (invoice.rails.length === 0) {
      // Env vars unset. Say so plainly rather than printing an empty section
      // the buyer would read as "no way to pay this".
      doc
        .fillColor(ink)
        .fontSize(10)
        .font("Helvetica")
        .text(
          `Reply to ${invoice.business.email} and we'll send payment details for this invoice.`,
          left,
          y,
          { width: contentWidth }
        );
      y += 30;
    } else {
      invoice.rails.forEach((rail) => {
        doc.fillColor(ink).fontSize(11).font("Helvetica-Bold").text(rail.name, left, y);
        y += 16;
        rail.fields.forEach(([label, value]) => {
          doc.fillColor(muted).fontSize(10).font("Helvetica").text(`${label}:`, left + 10, y, {
            width: 150,
            continued: false,
          });
          doc.fillColor(ink).fontSize(10).font("Helvetica").text(value, left + 165, y, {
            width: contentWidth - 165,
          });
          y = Math.max(y + 14, doc.y + 2);
        });
        y += 10;
      });
    }

    doc
      .fillColor(muted)
      .fontSize(9)
      .font("Helvetica")
      .text(
        `Please quote invoice number ${invoice.number} as the payment reference. ` +
          `Work begins once payment clears. Questions: ${invoice.business.email}`,
        left,
        y + 5,
        { width: contentWidth }
      );

    // ── Footer ────────────────────────────────────────────────────────
    doc
      .fillColor(muted)
      .fontSize(8)
      .font("Helvetica")
      .text(
        `${invoice.business.name} | asorahura.com | ${invoice.business.email}`,
        left,
        doc.page.height - 50,
        { align: "center", width: contentWidth }
      );

    doc.end();
  });
}
