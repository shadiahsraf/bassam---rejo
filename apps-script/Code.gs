/**
 * Bassam & Rejoyce — Google Apps Script endpoint.
 * Bound to a Google Sheet with three tabs named exactly: RSVP, Songs, Messages.
 * Header rows:  RSVP: Timestamp|Name|Attendance|Guests   Songs: Timestamp|Name|Song|Platform|Link
 *               Messages: Timestamp|Name|Message|Approved
 */
const SHEETS = {
  rsvp:    { tab: "RSVP",     row: d => [d.timestamp, d.name, d.attendance, d.guests] },
  song:    { tab: "Songs",    row: d => [d.timestamp, d.name, d.song, d.platform, d.link] },
  message: { tab: "Messages", row: d => [d.timestamp, d.name, d.message, "yes"] }
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

// Powers the live guestbook. Shows all messages automatically (type "no" in column D to hide any message).
function doGet() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Messages");
    if (!sheet) return json_([]);
    const range = sheet.getDataRange();
    if (!range) return json_([]);
    const values = range.getValues();
    if (values.length <= 1) return json_([]);
    const rows = values.slice(1)
      .filter(r => {
        const name = String(r[1] || "").trim();
        const msg = String(r[2] || "").trim();
        const approved = String(r[3] || "").toLowerCase().trim();
        return name.length > 0 && msg.length > 0 && approved !== "no";
      })
      .map(r => ({ name: String(r[1]).trim(), message: String(r[2]).trim() }));
    return json_(rows);
  } catch (err) {
    return json_([]);
  }
}
