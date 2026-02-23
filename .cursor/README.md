# .cursor

Cursor AI configuration and rules for this project.

## Layout

- **`rules/`** — Cursor rules (`.mdc` files with YAML frontmatter). Rules are picked by Cursor based on `description`, `globs`, and `alwaysApply`.
- **`README.md`** — This file.

## Rules

| Rule | When it applies |
|------|-----------------|
| `pnpm.mdc` | Always — use pnpm for all package management. |
| `code-standards.mdc` | Always — kebab-case, TypeScript, React and architecture standards. |
| `speaker-notes.mdc` | When working with `presentation/advanced.md`, `presentation/simple.md`, or slide files — generating speaker notes. |
| `mermaid.mdc` | When working with Markdown — generating Mermaid diagrams. |
| `slide-deck.mdc` | When working with `presentation/advanced.md` or `presentation/simple.md` — generating slide deck from Markdown. |

## Adding a rule

1. Create a new `.mdc` file in `rules/`.
2. Add frontmatter: `description`, and either `alwaysApply: true` or `globs: "**/pattern"`.
3. Keep the rule focused and under ~50 lines when possible.

## Project structure (code-standards)

The codebase follows: `src/components/`, `src/hooks/`, `src/models/`, `src/utils/`, `src/styles/`; all kebab-case, TypeScript.
