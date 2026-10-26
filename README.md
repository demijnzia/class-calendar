# Semester Calendar

A single-page calendar for planning a school semester. Month, week and list views, tagged classes and categories, due-date colors, and CSV export for Google Calendar.

Data is stored in the browser (localStorage). No build step, no dependencies.

## Run locally

Open `index.html` in a browser.

## Deploy

Import this repo at https://vercel.com/new. Framework preset: Other. Leave build and output settings empty.

## Taipei Runs semester

A read-only "Taipei Runs" entry in the semester selector lists running events in Taipei City and New Taipei City, collected from https://www.sportsnet.org.tw/schedule.php and https://irunner.biji.co/list. Each run appears up to three times: registration opens, registration closes, and race day. The class chip shows the city, so the class filter works as a city filter. Due-date colors apply to registration close and race day.

The data lives in `data/taipei-runs.json` and is loaded when the page opens, so it does not use Supabase and the admin passcode is not needed. It needs to be served over http(s) (Vercel, or `npx serve`); opening `index.html` as a file leaves the Taipei Runs entry out.

A daily scheduled task refreshes the file by following `data/UPDATE.md`. Run `node scripts/validate-runs.js` to check the file after editing it by hand.

## Shared calendar (Supabase)

One calendar for every visitor, stored in Supabase. Everyone can view and export it. Only the admin can add or change anything: the Add event, Edit, New and Tags buttons appear after unlocking with the admin passcode. There are no user accounts.

1. Create a free project at https://supabase.com.
2. SQL Editor: open `supabase.sql`, replace `CHANGE-THIS-PASSCODE` in the last line with your own passcode, then run it.
3. Project settings > API: copy the Project URL and the anon public key into `SUPABASE_URL` and `SUPABASE_ANON_KEY` near the top of the script in `index.html`.
4. Commit and push. Open the site, click "Admin" at the bottom, and enter your passcode. The first unlock publishes this browser's calendar if the shared one is empty.

The anon key is designed to be public. Row-level security makes the table read-only for visitors, and writes only succeed through a function that checks the passcode hash.

To change the passcode later, run the last two statements of `supabase.sql` again with a new value.
