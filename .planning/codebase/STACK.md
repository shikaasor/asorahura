# Technology Stack

**Analysis Date:** 2026-05-13

## Languages

**Primary:**
- TypeScript - Used throughout the application for type safety
- JavaScript (JSX/TSX) - React components and Next.js pages

**Secondary:**
- CSS/CSS Modules - Styling (`.module.css` files throughout the codebase)

## Runtime

**Environment:**
- Node.js (version via `.npmrc` or `package.json` engines, if specified)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present (version 3)

## Frameworks

**Core:**
- Next.js (latest) - React-based full-stack framework for web applications
- React (latest) - UI library
- React DOM (latest) - DOM rendering

**Content & Markdown:**
- @next/mdx (latest) - MDX support for Next.js
- @mdx-js/react (latest) - MDX React components
- @mdx-js/loader (latest) - MDX loader for webpack

**Animation:**
- framer-motion (latest) - Animation library for React components

**UI Components:**
- lucide-react (^5.6.0) - Icon library
- react-icons (^5.6.0) - Alternative icon library
- react-fast-marquee (^1.6.5) - Marquee scrolling component

## Key Dependencies

**Critical:**
- next - Next.js framework (powers routing, SSR, API routes, image optimization)
- react - React library for component-based UI
- framer-motion - Used for motion animations in `LinkedInFeed`, `YouTubeFeed`, `SaasShowcase` components
- @next/mdx - Enables MDX pages for articles system (`src/app/articles/`)

**Type Definitions:**
- TypeScript (latest dev) - Language and type system
- @types/node (latest dev) - Node.js type definitions
- @types/react (latest dev) - React type definitions
- @types/react-dom (latest dev) - React DOM type definitions
- @types/mdx (latest dev) - MDX type definitions

## Configuration

**Environment:**
- `.env.local` file present - Contains runtime environment variables
- `GOOGLE_SCRIPT_URL` - URL for Google Apps Script webhook (form submission endpoint)

**Build:**
- `tsconfig.json` - TypeScript configuration with:
  - `target: es5` - ES5 compatibility
  - `strict: true` - Strict type checking enabled
  - `jsx: react-jsx` - JSX transformation
  - Path alias: `@/*` → `./src/*`
- `next.config.mjs` - Next.js configuration with:
  - MDX page extension support (`.md`, `.mdx`)
  - Remote image patterns for `img.youtube.com` thumbnails
  - Custom page extensions: `['js', 'jsx', 'md', 'mdx', 'ts', 'tsx']`

**Development:**
- `.eslintrc.json` - ESLint configuration extending `next/core-web-vitals`
- ESLint (latest dev) - Code linting
- eslint-config-next (latest dev) - Next.js ESLint configuration

## Platform Requirements

**Development:**
- Node.js (version not specified in package.json, using `.npmrc` or system default)
- npm package manager

**Production:**
- Vercel (inferred from `metadataBase: new URL("https://asorahura.vercel.app")` in `src/app/layout.tsx`)
- Next.js compatible hosting environment

## Build & Deploy

**Build Commands:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

**Output:**
- Production build directory: `.next/` (Next.js standard)
- Optimized assets with Next.js bundler

---

*Stack analysis: 2026-05-13*
