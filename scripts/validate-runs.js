// Validates data/taipei-runs.json. Usage: node scripts/validate-runs.js
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'data', 'taipei-runs.json');
const CITIES = ['臺北市', '新北市'];
const SOURCES = ['sportsnet', 'irunner'];
const errors = [];
const err = (id, msg) => errors.push(`${id}: ${msg}`);

let feed;
try { feed = JSON.parse(fs.readFileSync(file, 'utf8')); }
catch (e) { console.error('Cannot read/parse ' + file + ': ' + e.message); process.exit(1); }

if (!/^\d{4}-\d{2}-\d{2}$/.test(feed.updated || '')) err('feed', 'updated must be YYYY-MM-DD');
if (!Array.isArray(feed.events)) { console.error('events must be an array'); process.exit(1); }

const dateOk = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return d.getFullYear() === +m[1] && d.getMonth() === +m[2] - 1 && d.getDate() === +m[3];
};
const stampOk = (s) => /^\d{4}-\d{2}-\d{2}(T([01]\d|2[0-3]):[0-5]\d)?$/.test(s) && dateOk(s.slice(0, 10));

const seen = new Set();
for (const e of feed.events) {
  const id = e.id || '(no id)';
  if (!/^[A-Za-z0-9_-]+$/.test(e.id || '')) err(id, 'id must match [A-Za-z0-9_-]+');
  if (seen.has(e.id)) err(id, 'duplicate id');
  seen.add(e.id);
  if (!e.name) err(id, 'name missing');
  if (!dateOk(e.date)) err(id, 'date must be a real YYYY-MM-DD');
  if (!CITIES.includes(e.city)) err(id, 'city must be one of ' + CITIES.join(' / '));
  if (!SOURCES.includes(e.source)) err(id, 'source must be one of ' + SOURCES.join(' / '));
  if (e.url && !/^https?:\/\/\S+$/i.test(e.url)) err(id, 'url must start with http:// or https://');
  for (const k of ['regStart', 'regEnd']) {
    if (e[k] != null && !stampOk(e[k])) err(id, k + ' must be null, YYYY-MM-DD or YYYY-MM-DDTHH:MM');
  }
  if (e.regStart && e.regEnd && e.regStart > e.regEnd) err(id, 'regStart is after regEnd');
  if (e.regEnd && dateOk(e.date) && e.regEnd.slice(0, 10) > e.date) err(id, 'regEnd is after the race date');
}

if (errors.length) {
  console.error(errors.length + ' problem(s):\n' + errors.map((x) => ' - ' + x).join('\n'));
  process.exit(1);
}
console.log('OK: ' + feed.events.length + ' events, updated ' + feed.updated);
