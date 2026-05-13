# Coding Conventions

**Analysis Date:** 2026-05-13

## Naming Patterns

**Files:**
- Component files: PascalCase with `.tsx` extension (e.g., `Navigation.tsx`, `LinkedInFeed.tsx`)
- Page files: lowercase with `.tsx` extension in app directory (e.g., `page.tsx`)
- CSS modules: PascalCase matching component name with `.module.css` (e.g., `Navigation.module.css`, `engage.module.css`)
- Server action files: lowercase with `.ts` extension (e.g., `actions.ts`)
- Utility/library files: lowercase with `.ts` extension (e.g., `articles.ts`)

**Functions:**
- React components: PascalCase and exported as default (e.g., `export default function Navigation()`)
- Event handlers: camelCase with `handle` prefix (e.g., `handleSubmit`)
- Utility functions: camelCase (e.g., `getYouTubeId`, `getArticleBySlug`)
- Constants: camelCase for data objects (e.g., `linkedInPosts`, `youtubeVideos`, `testimonials`)

**Variables:**
- camelCase for all variable declarations
- State variables: camelCase (e.g., `status`, `message`)
- Refs: camelCase with Ref suffix (e.g., `canvasRef`)

**Types/Interfaces:**
- PascalCase for type names (e.g., `Article`, `ArticleSection`, `Particle`)
- Props interfaces: Named as `ComponentNameProps` or component-scoped inline types

## Code Style

**Formatting:**
- 4-space indentation (observed in source files)
- Semicolons used throughout
- Double quotes for JSX attributes and strings
- Single quotes avoided in favor of double quotes

**Linting:**
- ESLint enabled with `next/core-web-vitals` configuration (`.eslintrc.json`)
- No dedicated Prettier config — defaults apply
- Follows Next.js 13+ standards with app directory structure

**Imports Order:**
1. React and built-in imports (e.g., `import { useEffect, useRef } from "react"`)
2. Next.js specific imports (e.g., `import Link from "next/link"`, `import Image from "next/image"`)
3. Third-party library imports (e.g., `import { motion } from "framer-motion"`)
4. Local component imports (e.g., `import Navigation from "@/components/Navigation"`)
5. Style/CSS imports (e.g., `import styles from "./page.module.css"`)

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- Used consistently for all imports from src directory (e.g., `@/components/Navigation`, `@/lib/articles`)

## Error Handling

**Patterns:**
- Server actions return structured objects with `success` boolean and `message` string (see `src/app/engage/actions.ts`)
- No explicit error throwing in client components; status states manage loading/error/success
- Try-catch blocks wrap async operations in server actions
- Client-side form handling catches and displays user-friendly error messages

Example from `src/app/engage/actions.ts`:
```typescript
try {
    await fetch(scriptUrl, { ... });
    return { success: true, message: "Inquiry submitted successfully." };
} catch {
    return { success: false, message: "Something went wrong." };
}
```

## Logging

**Framework:** `console` for all logging (no external logging library detected)

**Patterns:**
- Not heavily used in current codebase
- Could be added for debugging canvas animations and async operations

## Comments

**When to Comment:**
- Single-line comments used sparingly for data structure purposes (e.g., `// Placeholder data structure - easily updatable`)
- Section dividers in long files (e.g., `{/* Hero Section */}`)
- Comments explain why, not what (minimal inline comments observed)

**JSDoc/TSDoc:**
- Not heavily used in the codebase
- Function signatures are explicit via TypeScript types

## Function Design

**Size:** 
- Small, focused functions
- Component functions typically 50-200 lines
- Utility functions 1-20 lines

**Parameters:** 
- Accept props object for React components
- Use destructuring in function signatures (e.g., `{ params }`)
- No spread operators on props observed; explicit destructuring preferred

**Return Values:** 
- Components return JSX
- Server actions return `{ success: boolean, message: string }` objects
- Utility functions return specific types (e.g., `string` for `getYouTubeId`, `Article | undefined` for `getArticleBySlug`)

## Module Design

**Exports:**
- React components exported as `export default`
- Utility functions and types exported as named exports (e.g., `export interface Article`, `export function getArticleBySlug`)
- Constants exported as named exports (e.g., `export const articles: Article[]`)

**Barrel Files:**
- Not used; imports are direct from specific files
- `@/components/...` and `@/lib/...` for organized imports

## Styling Conventions

**CSS Modules:**
- CSS modules used exclusively for component-specific styling (e.g., `styles.main`, `styles.hero`)
- Inline styles used sparingly for dynamic values (e.g., `style={{ color: "#64748b" }}`)
- CSS class usage: camelCase class names in module files, referenced via `styles.className`

**Framer Motion:**
- Animation props follow pattern: `initial`, `animate`, `whileInView`, `transition`
- Consistent animation values: `duration: 0.5-0.8`, `delay: index * 0.1`
- Opacity and position (x/y) most common animation properties

## "use client" Directive

**Usage:**
- All interactive components marked with `"use client"` at top of file
- Server components (like article page) handle static generation and params
- Server actions defined with `"use server"` in separate files (e.g., `actions.ts`)

## TypeScript Configuration

**Strict Mode:** Enabled (observed in `tsconfig.json`)
- `"strict": true` enforces strict type checking
- `"noEmit": true` for type checking without emission
- `"jsx": "react-jsx"` for modern React 18+ JSX

---

*Convention analysis: 2026-05-13*
