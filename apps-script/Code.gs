/**
 * Bassam & Rejoyce — Google Apps Script endpoint.
 * Bound to a Google Sheet with three tabs named exactly: RSVP, Songs, Messages.
 * Header rows:  RSVP: Timestamp|Name|Attendance|Guests   Songs: Timestamp|Name|Song|Platform|Link
 *               Messages: Timestamp|Name|Message|Approved
 */
const SHEETS = {
  rsvp:    { tab: "RSVP",     row: d => [d.timestamp, d.name, d.attendance, d.guests] },
  song:    { tab: "Songs",    row: d => [d.timestamp, d.name, d.song, d.platform, d.link] },
  message: { tab: "Messages", row: d => [d.timestamp, d.name, d.message] }
};

// Stops a guest's text from running as a spreadsheet formula.
function clean_(v) {
  v = String(v == null ? "" : v).slice(0, 2000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const d = JSON.parse(e.postData.contents);
    const cfg = SHEETS[d.type];
    if (!cfg) throw new Error("Unknown type: " + d.type);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(cfg.tab);
    if (!sheet) throw new Error("Missing tab: " + cfg.tab);
    sheet.appendRow(cfg.row(d).map(clean_));
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Optional: powers the guestbook. Only rows with "yes" in column D (Approved) are returned.
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Messages");
  const rows = sheet.getDataRange().getValues().slice(1)
    .filter(r => String(r[3]).toLowerCase() === "yes")
    .map(r => ({ name: r[1], message: r[2] }));
  return json_(rows);
}
