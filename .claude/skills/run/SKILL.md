---
description: Serve and browser-drive the Excellent Driving app (Next.js, local or live) with Playwright and its own Chromium. Use whenever asked to run, screenshot, or verify a change in this project.
---

# Running this project

Machine: the user's local Ubuntu VM (since 2026-10-26). Repo at
`/home/demo/crispy-garbanzo`, app in `excellent-driving/` (Next.js 16,
Prisma 6, NextAuth v4). Node 22 and PostgreSQL 16 are installed system-wide.

## Local database

PostgreSQL runs as a system service. `excellent-driving/.env.local` points
`DATABASE_URL` at `localhost:5432/excellent_driving`, already migrated and
seeded. Check it with `pg_isready`. After pulling new migrations:

```bash
cd /home/demo/crispy-garbanzo/excellent-driving
npx prisma migrate dev     # or: npx prisma db seed
```

The seeded admin is `admin@excellentdriving.sr`, but its local password is
no longer the default from `prisma/seed.ts`. For a check, create a temporary
user directly in the local database (bcryptjs hash, cost 10; role ADMIN or
STUDENT) and delete it afterwards; that's fine locally without asking.

## Serve the app

```bash
cd /home/demo/crispy-garbanzo/excellent-driving
ss -ltnp | grep ':3000 '   # already running? then just use it
nohup npm run dev > /tmp/nextdev.log 2>&1 &
timeout 60 bash -c 'until curl -sf http://localhost:3000 >/dev/null; do sleep 1; done'
```

If a server is already on :3000, `npm run dev` starts nothing and says
"Another next dev server is already running" with its PID; stop it with
`kill <PID>` only when you need a fresh one (`lsof` can't see it here, use
`ss`). Server errors (Prisma, NextAuth) land in `/tmp/nextdev.log`, or
`.next/dev/logs/next-development.log` for a server started earlier. For a check
closer to the live site, use `npm run build && npx next start` instead of
`npm run dev`.

## Drive it with a browser

Playwright is a project dependency, not a global install. Its Chromium
lives in `~/.cache/ms-playwright` (system libraries and fonts, incl. emoji,
are installed). There is **no** `/usr/bin/chromium` and nothing in
`npm root -g`, so don't set `NODE_PATH` or `executablePath`.

Require it by full path, so a script works from the scratchpad:

```js
const { chromium } = require('/home/demo/crispy-garbanzo/excellent-driving/node_modules/playwright-core');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } }); // phone: 400 wide

  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto('http://localhost:3000/login');
  await page.fill('input[type=email]', '<temporary account email>');
  await page.fill('input[type=password]', '<its password>');
  await Promise.all([page.waitForURL(u => !u.pathname.includes('/login')), page.click('button[type=submit]')]);
  await page.goto('http://localhost:3000/admin/dashboard', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '<scratchpad>/out.png', fullPage: true });
  console.log('errors:', errors);
  await browser.close();
})();
```

Run it with plain `node script.js`. Admin pages are in English; student
pages follow the student's language (NL by default for new accounts).

## Tests

From `excellent-driving/`: `npx tsc --noEmit` (a fresh clone needs
`npx next typegen` first), `npx eslint .`, `npx jest`, and
`npm run test:e2e` (Playwright, needs the dev server on :3000).

## Live site

https://crispy-garbanzo-one.vercel.app (Vercel + Supabase). The same
browser script works with that base URL. Logged-in pages need an account:
create a temporary one in the live database (session-pooler connection
string from the user, port 5432) only with the user's explicit OK, and
delete it afterwards. Never change data through the live admin pages
during a check.

## Old design mockups

`/home/demo/crispy-garbanzo/maquettes/*.html` are the static design
reference from before the app existed. To view one:
`python3 -m http.server 8765` in that folder, then open
`http://localhost:8765/06-admin-dashboard.html`.
