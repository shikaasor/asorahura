# Architecture

**Analysis Date:** 2026-05-13

## Pattern Overview

**Overall:** Next.js 14+ App Router with Server/Client Hybrid Pattern, Content-Driven Architecture

**Key Characteristics:**
- Multi-page marketing portfolio with dynamic content-driven sections
- Hybrid rendering: Server-side static/dynamic pages with client-side interactive components
- Modular component architecture with frame-motion animations
- Content sourced from static TypeScript data structures (`@/lib/articles`)
- Server Actions (form submissions) for backend integration
- Canvas-based background animation for visual depth

## Layers

**Presentation Layer (Client Components):**
- Purpose: Interactive UI elements with animations, form handling, and real-time state management
- Location: `src/components/` and individual page files marked with `"use client"`
- Contains: React components, Framer Motion animations, form state (useState)
- Depends on: Next.js primitives (Link, Image), Framer Motion, Lucide icons, module CSS
- Used by: All pages for interactive elements, navigation, dynamic content display

**Page/Route Layer:**
- Purpose: Individual page entry points, routing structure, layout composition
- Location: `src/app/`
- Contains: Layout wrappers (`layout.tsx`), page components, dynamic routes (`[slug]`), Server Actions
- Depends on: Components, libraries, CSS modules
- Used by: Next.js router to render actual URLs

**Data/Business Logic Layer:**
- Purpose: Static content source of truth, utilities, external API communication
- Location: `src/lib/` (data) and `src/app/engage/actions.ts` (server actions)
- Contains: Article metadata and content (`articles.ts`), form submission handlers
- Depends on: External services (Google Apps Script, Email providers)
- Used by: Page and component layers for rendering content

**Layout/Navigation Layer:**
- Purpose: Global structure, navigation state, conditional rendering
- Location: `src/app/layout.tsx` (root), `src/components/Navigation.tsx`
- Contains: Root HTML structure, global animations, navigation logic with path detection
- Depends on: Fonts, components, particle animation
- Used by: All pages via Next.js layout composition

**Animation/Visual Layer:**
- Purpose: Background effects, smooth transitions, visual feedback
- Location: `src/components/ParticleWave.tsx` (canvas-based), Framer Motion in components
- Contains: Canvas animation with particle wave effects, spatial grid optimization
- Depends on: Canvas API, React hooks (useEffect, useRef)
- Used by: Root layout for persistent background, individual components for element animation

## Data Flow

**Content Display Flow:**

1. **User navigates to route** → Next.js router matches URL
2. **Layout wraps page** → `src/app/layout.tsx` loads (ParticleWave, Navigation)
3. **Page renders static content** → Articles loaded from `src/lib/articles.ts`
4. **Components hydrate on client** → "use client" boundary, Framer Motion animations trigger
5. **User interacts** → State updates trigger re-renders within component boundary

**Form Submission Flow:**

1. User fills form in `src/app/engage/page.tsx`
2. `handleSubmit` collects FormData (client-side)
3. Server Action `submitInquiry()` called from `src/app/engage/actions.ts`
4. FormData sent to Google Apps Script endpoint (via `GOOGLE_SCRIPT_URL` env var)
5. Response determines success/error state
6. UI updates with success message or error message

**Navigation Flow:**

1. `Navigation` component detects `pathname` via `usePathname()`
2. Links conditionally styled based on active route match
3. Navigation hidden entirely on `/flowmorph` route (intentional design)
4. Links use `<Link>` component with path aliases (`@/components`, `@/lib`)

**State Management:**

- **Local component state:** Handled via React `useState` (form status in engage page)
- **Server state:** Articles and configuration stored in TypeScript constants (`src/lib/articles.ts`)
- **Route state:** Navigation active state derived from `pathname` (no external store needed)
- **Global animations:** Particle wave animated via `requestAnimationFrame` (performance-optimized)

## Key Abstractions

**Article Data Model:**
- Purpose: Structured representation of case study and thought leadership content
- Examples: `src/lib/articles.ts` exports `Article` interface and `articles` array
- Pattern: Strongly typed TypeScript interfaces with nested `ArticleSection` objects
- Properties: slug (routing), title, subtitle, description, metrics, tags, sections array
- Consumed by: Articles listing page (`src/app/articles/page.tsx`) and detail page (`src/app/articles/[slug]/page.tsx`)

**Component Module Pattern:**
- Purpose: Co-locate component logic with CSS module styling
- Examples: `src/components/Navigation.tsx` + `Navigation.module.css`
- Pattern: Each component paired with its own CSS module, imported as `styles` object
- Benefits: Scoped styling prevents global namespace pollution, component self-contained

**Server Action Pattern:**
- Purpose: Encapsulate backend-only operations without exposing endpoints
- Example: `src/app/engage/actions.ts` with `"use server"` directive
- Pattern: FormData passed from client, processed server-side, returns typed response object
- Used for: Form submissions, external API calls, secrets handling

**Icon System:**
- Purpose: Consistent iconography across UI
- Examples: Lucide React for inline SVG icons (`<Cpu />`, `<Layers />`, `<Award />`)
- Pattern: Imported by name, sized and colored via props
- Used in: Cards, testimonials, navigation, footer

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every page request
- Responsibilities: 
  - Sets global metadata (title, OpenGraph, Twitter, favicon)
  - Loads Google fonts (Inter, Playfair Display)
  - Renders ParticleWave component (fixed background)
  - Renders Navigation component
  - Applies root-level styles via CSS classes

**Home Page:**
- Location: `src/app/page.tsx`
- Triggers: GET / request
- Responsibilities:
  - Hero section with headline and call-to-action buttons
  - "Trusted By" rotating logo carousel (via react-fast-marquee)
  - "What I Do" three-card grid (AI Agents, System Integration, Operations Scaling)
  - "Certifications & Expertise" showcase
  - Connect & Learn section (LinkedInFeed, YouTubeFeed, SaasShowcase components)
  - About section with narrative
  - Social links footer

**Articles Listing Page:**
- Location: `src/app/articles/page.tsx`
- Triggers: GET /articles request
- Responsibilities:
  - Renders article grid with cards
  - Each card displays metrics, title, description, tags
  - Links to individual articles via dynamic routes

**Article Detail Page:**
- Location: `src/app/articles/[slug]/page.tsx`
- Triggers: GET /articles/:slug request
- Responsibilities:
  - Static generation of all article routes via `generateStaticParams()`
  - Retrieves article from `src/lib/articles.ts` by slug
  - Returns 404 if slug not found
  - Renders full article with sections, headings, arrow-formatted lists
  - Includes CTA to engage page

**Engage Page:**
- Location: `src/app/engage/page.tsx`
- Triggers: GET /engage request
- Responsibilities:
  - Renders contact form with 9 input fields
  - Form state managed locally (idle/loading/success/error)
  - Calls `submitInquiry()` server action on form submit
  - Displays success message or error message based on response
  - Testimonials section embedded

**Work/Portfolio Page:**
- Location: `src/app/work/page.tsx`
- Triggers: GET /work request
- Responsibilities:
  - Displays 4 major case studies with context, bottleneck, approach, outcome
  - Maps each case study to its full article via slug link
  - Shows toolchain/stack for each project
  - Includes architecture diagrams (images)

**Flowmorph Product Page:**
- Location: `src/app/flowmorph/page.tsx`
- Triggers: GET /flowmorph request
- Responsibilities:
  - Custom layout (Navigation hidden, custom nav header)
  - Product branding and philosophy statements
  - 4-step engagement model (Diagnosis → Design → Deployment → Optimization)
  - Core services description (Document Processing, AI Agents, Automation, Orchestration)
  - Target audience filters

## Error Handling

**Strategy:** Minimal explicit error handling with graceful degradation

**Patterns:**

- **Form submission errors:** Caught in try-catch within Server Action, returned as `{ success: false, message }` object, displayed in UI via conditional rendering
- **Route not found:** Uses Next.js `notFound()` function in dynamic route handler (`src/app/articles/[slug]/page.tsx`) to trigger 404 page
- **Missing configuration:** Form submission checks for `process.env.GOOGLE_SCRIPT_URL` and returns user-friendly error if not set
- **Client-side state errors:** None explicitly shown; animations gracefully degrade if animation frame unavailable

## Cross-Cutting Concerns

**Logging:** No centralized logging library detected. Errors handled silently with user-facing messages in forms.

**Validation:** Form validation delegated to browser HTML5 attributes (`required`, `type="email"`). Server-side validation occurs in form submission when collecting FormData fields.

**Authentication:** Not applicable to public portfolio. No user authentication or authorization system.

**Performance Optimization:**
- Image optimization via Next.js `<Image>` component with responsive sizing
- Spatial grid optimization in ParticleWave to avoid O(n²) particle connection checking
- CSS modules for scoped styling and minimal CSS sent to client
- Server Actions reduce JavaScript sent to client vs. API routes
- Static generation of article pages via `generateStaticParams()` for fast serving

**Accessibility:** Uses semantic HTML, Lucide icons with size properties, alt text on images. No explicit ARIA labels detected beyond standard HTML semantics.

**SEO:** Root layout sets comprehensive metadata via Next.js Metadata API. Articles have proper heading hierarchy. OpenGraph and Twitter cards configured for social sharing.

---

*Architecture analysis: 2026-05-13*
