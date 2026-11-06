# uriel.dev

Personal landing page. A single `index.html` with no build step: the page builds itself in the hero while AI agents work in parallel, and the GitHub contribution graph replays the last 12 months.

## Run locally

```bash
npx serve .
```

Open http://localhost:3000. Opening `index.html` directly also works, but then the page uses the embedded snapshot instead of `contributions.json`.

## Deploy to GitHub Pages

1. Push this folder to a repository (for a user site, name it `urtaav.github.io`).
2. In the repository: **Settings → Pages → Build and deployment → Deploy from a branch**, branch `main`, folder `/ (root)`.
3. In **Settings → Actions → General → Workflow permissions**, choose **Read and write permissions** so the daily workflow can commit `contributions.json`.
4. Run the **Update contributions** workflow once from the **Actions** tab to check it works.

## Contribution data

`scripts/update-contributions.mjs` downloads the public contribution calendar from `github.com/users/urtaav/contributions` and writes `contributions.json`. The workflow in `.github/workflows/update-contributions.yml` runs it every day at 06:00 UTC and commits only when the data changed.

The graph always ends on the visitor's current date and never shows future days. Days after the last sync are drawn striped as "not synced yet".

Tip: enable **Include private contributions on my profile** in your GitHub profile settings so work in private repositories is counted.
