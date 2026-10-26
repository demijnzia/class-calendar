# Updating `taipei-runs.json` (daily task)

`data/taipei-runs.json` feeds the **Taipei Runs** semester in the calendar. The site reads it at load time, so a push to `main` is all it takes. Nothing here touches Supabase or the class calendar.

## Scope

- Running events only (marathons, half marathons, 10K/5K/3K fun runs, themed runs, relays, vertical runs).
- Skip cycling, hiking, swimming, talks, training camps, volunteer sign-ups.
- Venue in **Taipei City** (`臺北市`) or **New Taipei City** (`新北市`). Use the venue, not the label on the source: sportsnet lists only a venue, irunner sometimes tags a Taipei venue as 新北 or the reverse. Always write the city as `臺北市` / `新北市`.
- Keep events whose race date is today or later. Delete events whose race date is more than 14 days past.

## Sources

1. https://www.sportsnet.org.tw/schedule.php lists race date, name, venue and a link. It has **no registration dates**. Open the linked race page (often `sportsnet.org.tw/<yyyymmdd>_web/`) and read the 報名日期 / 報名時間 line. If the link goes to an organizer site that WebFetch refuses, try WebSearch for a news article, and otherwise leave `regStart` / `regEnd` as `null` with a `note`.
2. https://irunner.biji.co/list lists race date, city, name, and a close date without a year. Open each Taipei/New Taipei event page and read the block **報名時間** (`起 …` / `迄 …`). Those are the authoritative start and end.

The sportsnet page may also link to a newer annual calendar (e.g. 116 年度行事曆). Check it for next-year races.

## Record format

```json
{
  "id": "irunner-2027Global",      // source + slug, only [A-Za-z0-9_-], never changes once created
  "name": "…",
  "date": "2027-03-27",            // race day
  "city": "臺北市",
  "venue": "…",
  "url": "https://…",              // race page or registration page
  "source": "irunner",             // or "sportsnet"
  "regStart": "2026-10-19T12:00",  // YYYY-MM-DD or YYYY-MM-DDTHH:MM, null if unknown
  "regEnd": "2026-12-31T23:59",    // same format, null if unknown
  "note": "optional, e.g. 已額滿"
}
```

- Keep existing `id`s so nothing duplicates. Same race on both sites: one record (prefer the one with registration dates).
- Race cancelled or postponed (`停辦`, `停賽`, `延期`): set `"cancelled": true`. The calendar hides it.
- If a field cannot be confirmed, use `null` and say why in `note`. Do not guess dates.
- Update `"updated"` to today's date (YYYY-MM-DD).

## Steps

1. Attach and clone `demijnzia/class-calendar` (push access).
2. Fetch both sources, add new runs, update changed dates, remove stale ones. Only fetch detail pages for new events or events with `null` registration dates or a registration end within the last 30 days (dates sometimes get extended).
3. `node scripts/validate-runs.js` must print `OK`.
4. If `data/taipei-runs.json` changed, commit only that file (`Update Taipei runs YYYY-MM-DD`) and push to `main`. If nothing changed, do not commit.
5. Report: new runs, runs whose registration opens or closes within 7 days, and anything that could not be read.
