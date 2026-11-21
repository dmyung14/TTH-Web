// Google Apps Script web app that saves mailing-list sign-ups from tthjhu.com
// into the "TTH at JHU — Mailing List" Google Sheet.
// Deploy: Deploy > New deployment > Web app; Execute as: Me; Who has access: Anyone.

const SHEET_ID = '1rkdC7X5n_XFKubPhCz4M9lfvqTcFj6Aw9IWw0a8Ogxc';
const EMAIL_RE = /^[^\s@]+@(jhu|jh|jhmi)\.edu$/;

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.website) return json_({ ok: true }); // honeypot: bots fill hidden field
  const email = String(p.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) return json_({ ok: false, error: 'invalid_email' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    const last = sheet.getLastRow();
    if (last > 1) {
      const existing = sheet.getRange(2, 2, last - 1, 1).getValues()
        .map(function (r) { return String(r[0]).replace(/^'/, '').toLowerCase(); });
      if (existing.indexOf(email) !== -1) return json_({ ok: true, duplicate: true });
    }
    sheet.appendRow([
      new Date(),
      safe_(email),
      safe_(String(p.interests || '').slice(0, 200)),
      safe_(String(p.source || 'tthjhu.com').slice(0, 100))
    ]);
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}

function doGet() {
  return json_({ ok: true, service: 'TTH at JHU mailing list' });
}

// Prevent spreadsheet formula injection.
function safe_(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
