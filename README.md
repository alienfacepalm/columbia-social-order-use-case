# Echodyne Presentation

Technical presentation: **High-Reliability Real-Time System Design** — use case **Columbia Sportswear** (Social-Order Adapter — commerce integration).

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
