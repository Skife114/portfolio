# Mathieu Skif — Portfolio Site

This folder contains your full portfolio website:

- `index.html` — the site itself
- `resume.pdf` — your résumé, linked from the "Resume" button
- `images/` — dashboard screenshots shown on each project card (keep this folder alongside `index.html`, same structure)

## How to publish it (GitHub + Netlify)

1. Go to your GitHub account → click the "+" (top right) → **New repository**.
   Give it a name (e.g. `portfolio`) → **Create repository**.
2. On the new repo's page, click **Add file → Upload files**, drag in
   `index.html`, `resume.pdf`, AND the whole `images` folder (drag the folder
   itself — GitHub keeps the folder structure), then click **Commit changes**.
3. Go to [netlify.com](https://netlify.com) → sign up/log in with your GitHub
   account → **Add new site → Import an existing project** → choose GitHub →
   select this repository.
4. Netlify will detect it's a static site and publish it automatically —
   you'll get a live link within a minute or two.

## Making updates later

Whenever you want to change something (new project, updated bio, etc.):
1. Edit `index.html` (or ask Claude to make the edit and hand you the updated file)
2. In your GitHub repo, click **Add file → Upload files** again, upload the
   new version, and commit
3. Netlify automatically republishes — no extra steps needed

## Notes on the YouTube section

The "latest video" and "recent uploads" panels try to load automatically from
your channel (**@FlaviusEnavius**) using a public relay service, since browsers
can't fetch YouTube's feed directly. If that relay is ever down or rate-limited,
visitors will just see a "Visit Channel" button instead — nothing breaks, it just
falls back gracefully. For guaranteed reliability long-term, this can be upgraded
later to a small serverless function using the official YouTube Data API.

The **gaming events & releases** section is currently a placeholder — it's ready
for a future feed (e.g. upcoming game releases or gaming conferences) whenever
you want to wire that in.
