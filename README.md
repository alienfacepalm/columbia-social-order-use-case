# Columbia Social Order — Presentation

Technical presentation: **High-Reliability Real-Time System Design** — use case **Columbia Sportswear** (Social-Order Adapter — commerce integration). The Social-Order Adapter itself was deployed via **Azure DevOps pipelines** (CI config is in `.ignore/social-order/ci`).

## Slides (React SPA)

The slide deck is a React SPA that reads `presentation/advanced.md` (and `presentation/simple.md` for simplified slide content) and renders slides with Mermaid diagrams.

- **Run:** `pnpm dev` then open the URL (e.g. http://localhost:5173)
- **Build:** `pnpm build` → output in `dist/`
- **Preview build:** `pnpm preview`
- **Test:** `pnpm test` (unit tests; CI runs this before deploy)

### Controls

- **Next:** Right arrow, Space, Page Down
- **Previous:** Left arrow, Page Up
- **First / Last:** Home / End
- **Nav bar:** Use the ‹ › buttons at the bottom

### Editing

Edit `presentation/advanced.md` or `presentation/simple.md` and save; the dev server will hot-reload. Slide boundaries are `---`. Use `## Slide N — Title` for slide titles and ` ```mermaid ` code blocks for diagrams.

### Static assets

Put logos, favicons, and other static files in **`public/`**. They are served at the site root (e.g. `public/columbia-logo.svg` → `/columbia-logo.svg`). The header uses `public/columbia.png` and the title slide uses `public/title.png`; replace with official assets if desired.

### Publishing to GitHub Pages

The site is built and deployed as a **GitHub Pages static site** via the workflow in **`.github/workflows/deploy-pages.yml`**. On push to `main` or `master`, it installs dependencies, runs unit tests (`pnpm test`), then builds (`pnpm build`); deploy is skipped if tests fail. The `dist/` output is deployed to GitHub Pages.

**One-time setup:** In the repo on GitHub go to **Settings → Pages**, set **Source** to **GitHub Actions**, then push to `main`. The site will be at **`https://<owner>.github.io/<repo>/`** (e.g. `https://<owner>.github.io/columbia-social-order-use-case/`).
