# Semester Calendar

A single-page calendar for planning a school semester. Month, week and list views, tagged classes and categories, due-date colors, and CSV export for Google Calendar.

Data is stored in the browser (localStorage). No build step, no dependencies.

## Run locally

Open `index.html` in a browser.

## Deploy

Import this repo at https://vercel.com/new. Framework preset: Other. Leave build and output settings empty.

## Sync across devices (Supabase)

1. Create a free project at https://supabase.com.
2. SQL Editor: run `supabase.sql`.
3. Authentication > URL Configuration: set Site URL to your Vercel URL, and add it under Redirect URLs.
4. Project settings > API: copy the Project URL and the anon public key into `SUPABASE_URL` and `SUPABASE_ANON_KEY` near the top of the script in `index.html`.
5. Commit and push. Open the site, click "Sign in to sync", and use the emailed link.

The anon key is designed to be public. Row-level security in `supabase.sql` restricts every user to their own row.
