/// <reference types="vite/client" />

/** Raw text imports (e.g. markdown as string). */
declare module '*.md?raw' {
  const content: string
  export default content
}

/** CSS imports (side-effect or default export). */
declare module '*.css' {
  const url: string
  export default url
}

/** App-specific env vars; extend when adding VITE_* in .env. */
interface ImportMetaEnv {
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
