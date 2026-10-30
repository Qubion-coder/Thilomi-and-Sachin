// Google Apps Script for Thilomi & Sachin's invitation: saves RSVPs and wishes
// into separate sheets, creating each sheet with headers the first time it is used.
//
// Setup:
// 1. Open the spreadsheet > Extensions > Apps Script, replace Code.gs with this file.
// 2. Run `setup` once from the editor and approve the permissions.
// 3. Deploy > New deployment > Web app
//      Execute as: Me
//      Who has access: Anyone
// 4. Copy the /exec URL into CONFIG.sheetEndpoint in src/App.tsx.
// After editing this script, use Deploy > Manage deployments > Edit > New version
// so the same /exec URL picks up the change.

const SPREADSHEET_ID = "1fLxe-MtdiJaWHBp1BcSbgzQbSC-Dc5G4ZR8jI5gpnRQ";
const TIMEZONE = "Asia/Colombo";

const SHEETS = {
  rsvp: {
    name: "RSVP",
    headers: ["Submitted At", "Name", "Attendance", "Guest Count", "Phone", "Note"],
    color: "#7E9970",
  },
  wishes: {
    name: "Wishes",
    headers: ["Submitted At", "Name", "Message", "Show on Site"],
    color: "#A8BE9A",
  },
};

// How many recent wishes the invitation page shows
const MAX_PUBLIC_WISHES = 50;

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const payload = readPayload(e);

    if (payload.type === "wish") {
      saveWish(payload);
    } else if (payload.type === "rsvp" || payload.attendance !== undefined) {
      saveRsvp(payload);
    } else {
      throw new Error("Unknown submission type");
    }

    return json({ status: "success" });
  } catch (error) {
    return json({ status: "error", message: String(error && error.message ? error.message : error) });
  } finally {
    lock.releaseLock();
  }
}

// GET ?type=wishes returns recent wishes for display on the invitation page
function doGet(e) {
  try {
    const type = (e && e.parameter && e.parameter.type) || "";
    if (type === "wishes") {
      return json({ status: "success", wishes: getPublicWishes() });
    }
    return json({ status: "success", message: "Thilomi & Sachin invitation API is running" });
  } catch (error) {
    return json({ status: "error", message: String(error && error.message ? error.message : error) });
  }
}

// Run once from the editor to create both sheets up front (optional, doPost also creates them)
function setup() {
  getSheet(SHEETS.rsvp);
  getSheet(SHEETS.wishes);
}

function readPayload(e) {
  let raw = e && e.parameter && e.parameter.payload;
  if (!raw && e && e.postData && e.postData.contents) {
    raw = e.postData.contents;
  }
  if (!raw) throw new Error("No payload found");
  return JSON.parse(raw);
}

function saveRsvp(p) {
  const sheet = getSheet(SHEETS.rsvp);
  const attending = p.attendance === "yes" || p.attendance === "Joyfully accept";
  sheet.appendRow([
    timestamp(p.submittedAt),
    clean(p.name, 120),
    attending ? "Joyfully accept" : "Regretfully decline",
    attending ? Number(p.guests) || 1 : 0,
    clean(p.phone, 40),
    clean(p.note, 500),
  ]);
}

function saveWish(p) {
  const message = clean(p.message, 1000);
  if (!message) throw new Error("Message is empty");
  const sheet = getSheet(SHEETS.wishes);
  sheet.appendRow([timestamp(p.submittedAt), clean(p.name, 120) || "A friend", message, true]);
  // Tick box in "Show on Site" so the couple can hide a wish by unticking it
  sheet.getRange(sheet.getLastRow(), 4).insertCheckboxes().check();
}

function getPublicWishes() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEETS.wishes.name);
  if (!sheet || sheet.getLastRow() < 2) return [];

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, SHEETS.wishes.headers.length).getValues();
  return rows
    .filter((r) => r[2] && r[3] !== false)
    .reverse()
    .slice(0, MAX_PUBLIC_WISHES)
    .map((r) => ({ name: String(r[1]), message: String(r[2]) }));
}

// Returns the sheet, creating it with a styled, frozen header row if it doesn't exist yet.
// Also repairs the header row if someone cleared it.
function getSheet(def) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(def.name);
  if (!sheet) sheet = ss.insertSheet(def.name);

  const headerRange = sheet.getRange(1, 1, 1, def.headers.length);
  const current = headerRange.getValues()[0];
  if (current.join("|") !== def.headers.join("|")) {
    headerRange
      .setValues([def.headers])
      .setFontWeight("bold")
      .setFontColor("#FFFFFF")
      .setBackground(def.color)
      .setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    def.headers.forEach((h, i) => sheet.setColumnWidth(i + 1, h === "Message" || h === "Note" ? 360 : 170));
  }
  return sheet;
}

function timestamp(iso) {
  const d = iso ? new Date(iso) : new Date();
  return Utilities.formatDate(isNaN(d.getTime()) ? new Date() : d, TIMEZONE, "yyyy-MM-dd HH:mm:ss");
}

// Trims input and stops values starting with = + - @ being run as spreadsheet formulas
function clean(value, max) {
  let s = String(value == null ? "" : value).trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
