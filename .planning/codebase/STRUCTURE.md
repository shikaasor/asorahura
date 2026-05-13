# Codebase Structure

**Analysis Date:** 2026-05-13

## Directory Layout

```
asorahura/
├── src/                           # Source code (TypeScript/JSX)
│   ├── app/                       # Next.js App Router routes
│   │   ├── layout.tsx             # Root layout wrapping all pages
│   │   ├── globals.css            # Global styles and theme variables
│   │   ├── page.tsx               # Home page (/)
│   │   ├── page.module.css        # Home page styles
│   │   ├── articles/              # Articles section
│   │   │   ├── page.tsx           # Articles listing (/articles)
│   │   │   ├── articles.module.css
│   │   │   └── [slug]/            # Dynamic article routes
│   │   │       ├── page.tsx       # Single article detail (/articles/:slug)
│   │   │       └── article.module.css
│   │   ├── engage/                # Contact/engagement form
│   │   │   ├── page.tsx           # Engage page (/engage)
│   │   │   ├── engage.module.css
│   │   │   └── actions.ts         # Server Actions for form submission
│   │   ├── work/                  # Portfolio/case studies
│   │   │   ├── page.tsx           # Work page (/work)
│   │   │   └── work.module.css
│   │   └── flowmorph/             # Product page
│   │       ├── page.tsx           # Flowmorph product page (/flowmorph)
│   │       └── flowmorph.module.css
│   ├── components/                # Reusable React components
│   │   ├── Navigation.tsx         # Top navigation header
│   │   ├── Navigation.module.css
│   │   ├── ParticleWave.tsx       # Canvas-based background animation
│   │   ├── LinkedInFeed.tsx       # LinkedIn posts feed widget
│   │   ├── LinkedInFeed.module.css
│   │   ├── YouTubeFeed.tsx        # YouTube videos feed widget
│   │   ├── YouTubeFeed.module.css
│   │   ├── SaasShowcase.tsx       # Live systems/demos showcase
│   │   ├── SaasShowcase.module.css
│   │   ├── Testimonials.tsx       # Client testimonials
│   │   └── Testimonials.module.css
│   └── lib/                       # Utilities and data
│       └── articles.ts            # Article data structure and content
├── public/                        # Static assets
│   ├── logos/                     # Tech/company logos
│   ├── site-images/               # Hero images, banners
│   ├── thumbnails/                # Video thumbnails
│   ├── *.png                      # Branding assets (logo, headshot, etc.)
├── scripts/                       # Utility scripts
│   ├── ralph/                     # Custom scripts directory
├── skills/                        # Skill/capability tracking (internal use)
│   ├── prd/                       # Product requirements docs
│   └── ralph/                     # Ralph-related configs
├── .planning/                     # Planning and analysis output
│   └── codebase/                  # This analysis directory
├── tsconfig.json                  # TypeScript configuration with path aliases
├── next.config.mjs                # Next.js configuration
├── package.json                   # Dependencies and scripts
├── mdx-components.tsx             # MDX component overrides
├── next-env.d.ts                  # Next.js type definitions
├── .eslintrc.json                 # ESLint configuration
├── .gitignore                     # Git ignore rules
└── .env.local                     # Local environment variables (git-ignored)
```

## Directory Purposes

**src/app/:**
- Purpose: Next.js App Router route definitions and page entry points
- Contains: Page components (tsx), CSS modules, Server Actions, nested route segments
- Key files: `layout.tsx` (global), `page.tsx` (route handler), `actions.ts` (server logic)

**src/app/articles/:**
- Purpose: Articles and case study content routes
- Contains: Listing page, dynamic detail pages, article-specific styling
- Key files: `page.tsx` (list), `[slug]/page.tsx` (detail with static generation)

**src/app/engage/:**
- Purpose: Contact and engagement inquiry handling
- Contains: Form page, form submission Server Action, styling
- Key files: `page.tsx` (form UI), `actions.ts` (form processing)

**src/app/flowmorph/:**
- Purpose: Standalone product branding page for Flowmorph automation service
- Contains: Marketing content, service descriptions, engagement model
- Key files: `page.tsx` (full page content)

**src/components/:**
- Purpose: Reusable React components across pages
- Contains: Navigation, animations, content feeds, testimonials
- Pattern: Each component file pairs with `.module.css` for scoped styling
- Key files: `ParticleWave.tsx` (animations), `Navigation.tsx` (routing logic)

**src/lib/:**
- Purpose: Data structures, utilities, and business logic
- Contains: Article content and metadata, helper functions
- Key files: `articles.ts` (complete article data as TypeScript constants)

**public/:**
- Purpose: Static assets served directly by Next.js
- Contains: Images, logos, branding assets
- Subdirs: `logos/` (tech logos), `site-images/` (page images), `thumbnails/` (video previews)

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout, metadata, global components
- `src/app/page.tsx`: Home page, portfolio hero
- `src/app/articles/page.tsx`: Articles listing
- `src/app/articles/[slug]/page.tsx`: Individual article reader

**Configuration:**
- `tsconfig.json`: TypeScript and path alias setup (`@/*` → `./src/*`)
- `next.config.mjs`: Next.js build configuration, MDX support, image optimization
- `.eslintrc.json`: Linting rules
- `package.json`: Dependencies, scripts

**Core Logic:**
- `src/lib/articles.ts`: Article content and metadata (single source of truth)
- `src/app/engage/actions.ts`: Form submission handler, external API calls
- `src/components/ParticleWave.tsx`: Canvas animation engine

**Styling:**
- `src/app/globals.css`: Root CSS variables, global reset, typography
- `src/app/*/\*.module.css`: Page-level styles (scoped)
- `src/components/\*.module.css`: Component styles (scoped)

**Testing:**
- Not detected. No test files in codebase.

## Naming Conventions

**Files:**
- Page components: `page.tsx` (Next.js convention)
- Styling modules: `ComponentName.module.css` or `page.module.css` (CSS Modules)
- Server Actions: `actions.ts` (convention for "use server" directive)
- Dynamic routes: `[slug].tsx` (Next.js bracket syntax)
- Root files: `layout.tsx`, `globals.css` (Next.js convention)

**Directories:**
- Routes: lowercase with dashes: `articles/`, `engage/`, `flowmorph/`
- Feature dirs: lowercase plural: `components/`, `app/`, `public/`, `scripts/`
- Nested routes: match segment structure: `articles/[slug]/`

**Components:**
- PascalCase filenames: `Navigation.tsx`, `ParticleWave.tsx`, `LinkedInFeed.tsx`
- CSS module pairs: `Navigation.module.css`

**CSS Classes:**
- Camel case: `.main`, `.hero`, `.container`, `.cardGrid`
- Block/element pattern in module files: `.card`, `.cardTitle`, `.cardBody`

**Variables/Functions:**
- camelCase: `getYouTubeId()`, `getArticleBySlug()`, `submitInquiry()`
- Constants: `linkedInPosts`, `youtubeVideos`, `articles`, `saasLinks`

## Where to Add New Code

**New Feature (e.g., new portfolio section):**
- Primary code: `src/app/[feature]/page.tsx`
- Component support: `src/components/[FeatureName].tsx` (if reusable)
- Styling: `src/app/[feature]/[feature].module.css` and `src/components/[FeatureName].module.css`
- Data (if needed): `src/lib/[feature].ts` (if complex) or inline in `page.tsx` (if simple)

**New Component/Module:**
- Implementation: `src/components/[ComponentName].tsx`
- Styling: `src/components/[ComponentName].module.css`
- Export: No barrel file; import directly where needed
- Pattern: Use `"use client"` directive if needs interactivity, otherwise export as default

**Utilities:**
- Shared helpers: `src/lib/[utility].ts` (e.g., `articles.ts`, potential future `helpers.ts`)
- Server Actions: `src/app/[route]/actions.ts` (e.g., `src/app/engage/actions.ts`)

**New Page Route:**
- Create directory under `src/app/`: `src/app/[route]/`
- Add `page.tsx` for the route handler
- Add `[route].module.css` for styling
- For dynamic routes, use `[param].tsx` and implement `generateStaticParams()` if pre-rendering is needed

**New Data Model:**
- If simple: Define interface and data directly in component or page
- If complex: Create file in `src/lib/` (e.g., `src/lib/articles.ts`)
- Export as TypeScript interface + const data array

**Server-only Code:**
- Create `actions.ts` file in relevant route directory
- Add `"use server"` directive at top of file
- Use for form handling, secrets, external API calls
- Example: `src/app/engage/actions.ts`

## Special Directories

**public/:**
- Purpose: Static asset serving
- Generated: No
- Committed: Yes
- Notes: Images must be added manually; referenced via `/path` (root-relative)

**.planning/:**
- Purpose: Project planning and codebase analysis output
- Generated: Yes (by GSD mapper tools)
- Committed: Yes
- Notes: Stores ARCHITECTURE.md, STRUCTURE.md, CONCERNS.md, etc. for future phase planning

**scripts/:**
- Purpose: Utility and build scripts
- Generated: No (manually added)
- Committed: Yes
- Notes: Currently contains `ralph/` subdirectory (purpose unclear from codebase structure)

**skills/:**
- Purpose: Internal capability tracking and knowledge docs
- Generated: No
- Committed: Yes
- Notes: Contains `prd/` (product requirement docs) and `ralph/` configs

**node_modules/:**
- Purpose: Installed dependencies
- Generated: Yes (by npm/package manager)
- Committed: No (in .gitignore)

**.next/:**
- Purpose: Next.js build output
- Generated: Yes (by `npm run build`)
- Committed: No (in .gitignore)

## Path Aliases

TypeScript configured in `tsconfig.json` with path alias:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

**Usage:** Import as `import Component from "@/components/Component"` instead of relative paths `../../../components/Component`. Used throughout codebase for absolute imports.

## Dependencies Structure

**Core Framework:**
- `next` (latest) - React framework with App Router
- `react`, `react-dom` (latest) - React library

**Styling & Animation:**
- `framer-motion` (latest) - Motion library for animations
- CSS Modules (built-in) - Component-scoped styling

**UI Components & Icons:**
- `lucide-react` (5.6.0) - SVG icon library
- `react-fast-marquee` (1.6.5) - Carousel/marquee component
- `react-icons` (5.6.0) - Icon set (appears in codebase but limited use)

**Content & Documentation:**
- `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react` (latest) - Markdown rendering support

**Development:**
- TypeScript (latest)
- ESLint + next/eslint-config (latest)

---

*Structure analysis: 2026-05-13*
