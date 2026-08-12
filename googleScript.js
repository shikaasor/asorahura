const NOTIFY_EMAIL = "asorahura@gmail.com";

const SHEET_CONFIG = {
  inquiry: {
    name: "Inquiries",
    headers: ["Timestamp", "Name", "Email", "Company", "Role", "Company Size", "Service Interest", "Operational Volume", "Challenge", "Timeline", "Budget", "Context", "Score"],
    row: function(d) {
      return [new Date(), d.name, d.email, d.company, d.role, d.companySize, d.serviceInterest || "", d.operationalVolume, d.challenge, d.timeline, d.budget, d.context || "", d.score || ""];
    }
  },
  newsletter: {
    name: "Newsletter",
    headers: ["Timestamp", "Email"],
    row: function(d) { return [new Date(), d.email]; }
  },
  assessment_quick: {
    name: "Quick Assessments",
    headers: ["Timestamp", "First Name", "Email", "Score", "Tier"],
    row: function(d) { return [new Date(), d.firstName, d.email, d.score, d.tier]; }
  },
  assessment_deep: {
    name: "Deep Assessments",
    headers: ["Timestamp", "First Name", "Email", "Total (/60)", "A — Process Intelligence (/15)", "B — Data & Infrastructure (/15)", "C — Compliance & Governance (/12)", "D — Team & Change Readiness (/9)", "E — Strategic Alignment (/9)"],
    row: function(d) { return [new Date(), d.firstName, d.email, d.total, d.dimA, d.dimB, d.dimC, d.dimD, d.dimE]; }
  },
  waitlist: {
    name: "Waitlist",
    headers: ["Timestamp", "Email", "Offer"],
    row: function(d) { return [new Date(), d.email, d.offer || ""]; }
  },
  "build-map": {
    name: "Build Map",
    headers: ["Timestamp", "Email"],
    row: function(d) { return [new Date(), d.email]; }
  }
};

function getOrCreateSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
  return sheet;
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var formType = data.formType || "inquiry";
  var config = SHEET_CONFIG[formType];

  if (!config) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: "Unknown formType: " + formType }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, config.name, config.headers);
  sheet.appendRow(config.row(data));

  if (formType === "inquiry") {
    GmailApp.sendEmail(
      NOTIFY_EMAIL,
      "New Inquiry: " + data.name + " from " + data.company,
      "Name: " + data.name +
      "\nEmail: " + data.email +
      "\nRole: " + data.role +
      "\nCompany: " + data.company + " (" + data.companySize + ")" +
      "\nService Interest: " + (data.serviceInterest || "N/A") +
      "\nVolume: " + data.operationalVolume +
      "\n\nChallenge:\n" + data.challenge +
      "\n\nTimeline: " + data.timeline +
      "\nBudget: " + data.budget +
      "\nScore: " + (data.score || "N/A") +
      "\n\nContext:\n" + (data.context || "N/A")
    );
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
