const NOTIFY_EMAIL = "asor@asorahura.com";

const SHEET_CONFIG = {
  inquiry: {
    name: "Inquiries",
    headers: ["Timestamp", "Name", "Email", "Company", "Role", "Company Size", "Service Interest", "Operational Volume", "Challenge", "Timeline", "Budget", "Context", "Score"],
    row: function(d) {
      return [new Date(), d.name, d.email, d.company, d.role, d.companySize, d.serviceInterest || "", d.operationalVolume, d.challenge, d.timeline, d.budget, d.context || "", d.score || ""];
    },
    notify: function(d) {
      return {
        subject: "New Inquiry: " + d.name + " from " + d.company,
        body: "Name: " + d.name +
          "\nEmail: " + d.email +
          "\nRole: " + d.role +
          "\nCompany: " + d.company + " (" + d.companySize + ")" +
          "\nService Interest: " + (d.serviceInterest || "N/A") +
          "\nVolume: " + d.operationalVolume +
          "\n\nChallenge:\n" + d.challenge +
          "\n\nTimeline: " + d.timeline +
          "\nBudget: " + d.budget +
          "\nScore: " + (d.score || "N/A") +
          "\n\nContext:\n" + (d.context || "N/A")
      };
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
    row: function(d) { return [new Date(), d.firstName, d.email, d.total, d.dimA, d.dimB, d.dimC, d.dimD, d.dimE]; },
    notify: function(d) {
      return {
        subject: "Deep Assessment: " + d.firstName + " scored " + d.total + "/60",
        body: "Name: " + d.firstName +
          "\nEmail: " + d.email +
          "\nTotal: " + d.total + "/60" +
          "\n\nA — Process Intelligence: " + d.dimA + "/15" +
          "\nB — Data & Infrastructure: " + d.dimB + "/15" +
          "\nC — Compliance & Governance: " + d.dimC + "/12" +
          "\nD — Team & Change Readiness: " + d.dimD + "/9" +
          "\nE — Strategic Alignment: " + d.dimE + "/9"
      };
    }
  },
  waitlist: {
    name: "Waitlist",
    headers: ["Timestamp", "Email", "Offer"],
    row: function(d) { return [new Date(), d.email, d.offer || ""]; },
    notify: function(d) {
      return {
        subject: "Waitlist signup: " + (d.offer || "unspecified offer"),
        body: "Email: " + d.email + "\nOffer: " + (d.offer || "not specified")
      };
    }
  },
  "build-map": {
    name: "Build Map",
    headers: ["Timestamp", "Email"],
    row: function(d) { return [new Date(), d.email]; }
  },
  "purchase-interest": {
    name: "Purchase Interest",
    headers: ["Timestamp", "Email", "Offer"],
    row: function(d) { return [new Date(), d.email, d.offer || ""]; },
    notify: function(d) {
      return {
        subject: "PURCHASE INTENT: " + (d.offer || "unspecified offer"),
        body: "Someone tried to buy and found no checkout available.\n\n" +
          "Email: " + d.email +
          "\nOffer: " + (d.offer || "not specified") +
          "\n\nHighest-intent signal on the site. Follow up directly, and check " +
          "whether the price ID for this offer is configured."
      };
    }
  },
  purchase: {
    name: "Purchases",
    headers: ["Timestamp", "Email", "Product", "Transaction ID", "Amount"],
    row: function(d) { return [new Date(), d.email, d.productType, d.transactionId, d.amount]; },
    // Paddle retries deliveries, so the same transaction can arrive more than
    // once. The transaction id column is the durable dedupe key.
    dedupeOn: "transactionId",
    dedupeColumn: 4
  }
};

// Returns true when a row with this key already exists, so retries do not
// append a second copy of the same purchase.
function alreadyRecorded(sheet, column, value) {
  if (!value) return false;
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  var existing = sheet.getRange(2, column, lastRow - 1, 1).getValues();
  for (var i = 0; i < existing.length; i++) {
    if (String(existing[i][0]) === String(value)) return true;
  }
  return false;
}

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

  if (config.dedupeOn && alreadyRecorded(sheet, config.dedupeColumn, data[config.dedupeOn])) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", duplicate: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  sheet.appendRow(config.row(data));

  if (config.notify) {
    try {
      var message = config.notify(data);
      GmailApp.sendEmail(NOTIFY_EMAIL, message.subject, message.body);
    } catch (err) {
      // The row is already saved. A failed notification must not fail the
      // request, or the caller will retry a write that already succeeded.
      console.error("Notification failed for " + formType + ": " + err);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
