# Echodyne Presentation

Technical presentation: **High-Reliability Real-Time System Design** — use case **Columbia Sportswear** (Social-Order Adapter — commerce integration). The Social-Order Adapter itself was deployed via **Azure DevOps pipelines** (CI config is in `.ignore/social-order/ci`).

## Slides (React SPA)

The slide deck is a React SPA that reads `presentation.md` and renders slides with Mermaid diagrams.

- **Run:** `pnpm dev` then open the URL (e.g. http://localhost:5173)
- **Build:** `pnpm build` → output in `dist/`
- **Preview build:** `pnpm preview`

### Controls

- **Next:** Right arrow, Space, Page Down
- **Previous:** Left arrow, Page Up
- **First / Last:** Home / End
- **Nav bar:** Use the ‹ › buttons at the bottom

### Editing

Edit `presentation.md` and save; the dev server will hot-reload. Slide boundaries are `---`. Use `## Slide N — Title` for slide titles and ` ```mermaid ` code blocks for diagrams.

### Static assets

Put logos, favicons, and other static files in **`public/`**. They are served at the site root (e.g. `public/columbia-logo.svg` → `/columbia-logo.svg`). The title slide shows the Columbia Sportswear logo from `public/columbia-logo.svg`; replace that file with the official logo if desired.

### Publishing to GitHub Pages

The site is built and deployed as a **GitHub Pages static site** via the workflow in **`.github/workflows/deploy-pages.yml`**. On push to `main` or `master`, it installs dependencies, runs `pnpm build`, and deploys the `dist/` output to GitHub Pages.

**One-time setup:** In the repo on GitHub go to **Settings → Pages**, set **Source** to **GitHub Actions**, then push to `main`. The site will be at **`https://<owner>.github.io/<repo>/`** (e.g. `https://alienfacepalm.github.io/echodyne-presentation/`).
