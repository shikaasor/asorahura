# Asor Ahura Homepage
## Production Implementation Brief: Workflow Machine + ASCII Intelligence Field

**Document purpose:** This specification is for a coding/implementation agent. It defines the creative direction, UX narrative, visual system, WebGL architecture, interaction model, responsive behavior, performance requirements, and acceptance criteria for the Asor Ahura automation-business homepage.

---

# 1. Executive Creative Direction

Build a premium, cinematic homepage for an automation consultancy centered on one idea:

> **Your business doesn't need more software. It needs less work.**

The experience combines two concepts:

1. **The Workflow Machine** — an abstract 3D computational system representing the hidden processes inside a business.
2. **The ASCII Intelligence Field** — the 3D system is rendered through a custom ASCII/glyph post-processing layer, making the machine appear to be constructed from characters, signals, particles, and data.

The WebGL is not decoration. It is the visual metaphor for the business proposition:

```text
REPETITIVE WORK
      ↓
WORKFLOW UNDERSTANDING
      ↓
SYSTEM CONNECTION
      ↓
AUTOMATION
      ↓
TIME RECOVERED
```

The visual narrative is:

```text
CHAOS
  ↓
DISCOVERY
  ↓
CONNECTION
  ↓
AUTOMATION
  ↓
SIMPLIFICATION
  ↓
SILENCE / LEVERAGE
```

The page should feel like a technology studio or experimental systems laboratory rather than a generic AI agency.

Do **not** make the site look like:
- an AI SaaS landing page
- a template-based automation agency
- a dashboard
- a stock-photo consultancy
- a generic "AI transformation" website
- a page overloaded with gradients, cards, badges, logos, and marketing clichés

---

# 2. Core Business Positioning

The homepage should communicate:

> We find the repetitive work hiding inside your operations and build systems that take it off your team's hands.

The business sells:
- recovered time
- reduced operational friction
- workflow automation
- better use of existing tools
- document/data intelligence
- system integration
- practical process improvement

The business does **not** lead with:
- AI models
- AI agents
- futuristic buzzwords
- "digital transformation"
- replacing employees
- technology for technology's sake

The visitor should leave understanding:

> **The service is about removing unnecessary work from business operations.**

---

# 3. Hero Experience

## 3.1 Initial viewport

The first viewport should be visually sparse.

Background:
- near-black
- subtle texture/noise
- no obvious gradient blob
- no stock image

The WebGL machine occupies most of the visual field.

The machine should initially be difficult to understand.

It appears as:
- faint ASCII characters
- sparse particles
- thin connections
- barely visible geometry
- small moving data signals

The visual should reward observation.

## 3.2 Hero copy

Eyebrow:

> WORKFLOW INTELLIGENCE

Headline:

> **Your business doesn't need more software.**

Second line:

> **It needs less work.**

Supporting text:

> We find the repetitive work hiding inside your operations and build systems that take it off your team's hands.

Primary CTA:

> **Find the work worth automating →**

Secondary CTA:

> **See how it works**

Do not place the copy directly inside the WebGL canvas. Render it as DOM/HTML above the canvas.

---

# 4. WebGL Composition

The WebGL canvas should be positioned as a full-bleed or near-full-bleed visual layer behind the hero content.

Recommended layering:

```text
PAGE
 ├── Navigation DOM
 ├── WebGL canvas
 │    ├── Workflow Machine
 │    ├── Data Packets
 │    ├── Particles
 │    ├── Connection Paths
 │    ├── Depth/Normal information
 │    └── ASCII post-processing
 │
 ├── Hero DOM typography
 └── CTA DOM
```

The canvas must not own the site's semantic content.

---

# 5. Workflow Machine

Do not depend on a single giant GLTF model.

The machine should be generated from reusable procedural components.

## 5.1 Components

### Nodes

Represent workflow operations.

Examples conceptually:
- intake
- extraction
- validation
- transformation
- decision
- storage
- notification
- reporting

Visually:
- small geometric clusters
- rings
- cores
- rectangular process modules
- abstract mechanical structures

Do not literally label every node.

### Pipes

Curved paths connecting nodes.

Use:
- Catmull-Rom curves
- Bézier curves
- tube geometry where appropriate
- thin line/particle representations for lower-cost paths

### Ports

Small circular or geometric connection points.

### Data packets

Small particles travelling through paths.

Each packet should have:
- position along path
- velocity
- intensity
- type/state
- lifetime where appropriate

### Process blocks

Groups of geometry representing a larger workflow stage.

### Core

A central computational structure.

It should become more prominent as the system transitions from chaos to automation.

---

# 6. ASCII Intelligence Field

The machine should not be displayed as a conventional 3D scene.

Render the scene to an off-screen render target and run a custom fullscreen post-processing pass.

Recommended pipeline:

```text
Three.js Scene
      ↓
WebGL Render Target
      ↓
Color / Depth / Normal Information
      ↓
Luminance Processing
      ↓
Edge Detection
      ↓
Depth Influence
      ↓
Mouse Influence
      ↓
ASCII Character Selection
      ↓
Accent/Composite
      ↓
Screen
```

The reference architecture that inspired this direction uses a 3D scene rendered to an off-screen target and then converts the resulting texture into an ASCII/pixelated representation. Use this as conceptual precedent, not as a literal implementation to copy.

---

# 7. ASCII Character System

Do not simply map brightness directly to characters.

Character selection should be influenced by multiple signals:

```text
luminance
+ edge strength
+ depth
+ particle velocity
+ mouse proximity
+ workflow state
+ scroll progress
        ↓
character selection
```

Suggested base character family:

```text
 .·:+*#%@
```

Structural/technical characters may include:

```text
<>/\|=+_-
```

Use binary-looking characters sparingly:

```text
01
10
```

The overall glyph field should remain legible as a 3D object.

The viewer should first perceive:
> "There is a machine here."

Then:
> "It is made from characters."

---

# 8. ASCII Atlas

Generate or preload a glyph atlas.

Recommended approach:
- HTML canvas or offscreen canvas
- monochrome glyphs
- consistent font metrics
- texture atlas containing all characters
- GPU-based lookup

Do not create thousands of DOM text elements.

The entire ASCII field must remain GPU-rendered.

---

# 9. Edge Detection

The ASCII post-process should detect structural edges from the rendered scene.

Use neighboring samples around each pixel:

```text
left
right
up
down
```

Compute approximate edge magnitude.

Use edge strength to:
- sharpen machine boundaries
- increase character density
- select structural characters
- improve 3D readability

Avoid making the effect look like a simple Sobel filter. It should feel integrated with the glyph rendering.

---

# 10. Mouse Interaction

The cursor is a scanner.

Create a radial influence field around the cursor.

Recommended desktop radius:
- approximately 150–250 CSS pixels
- scale based on viewport

Inside the field:
- glyph intensity increases
- glyph density increases
- edges become clearer
- nearby particles react
- hidden connections become visible
- accent color becomes slightly stronger

Outside the field:
- return smoothly to the subdued base state

Use easing rather than snapping.

Maintain a short history of cursor positions to create a subtle trail.

The trail should feel like:
- electromagnetic scanning
- information tracing
- signal propagation

Not like a generic neon mouse glow.

---

# 11. Camera Behavior

The camera should move slowly and cinematically.

Mouse movement:
- subtle yaw
- subtle pitch
- slight target offset

Do not allow the cursor to produce large camera swings.

The machine should feel massive.

Recommended:
- low-frequency camera drift
- slight parallax
- gentle breathing motion
- scroll-controlled camera travel

The camera should not move continuously at high speed.

---

# 12. Hero State Machine

Treat scroll as a state controller, not merely a vertical camera movement.

Use normalized scroll progress:

```text
0.00 → DORMANT
0.10 → DISCOVERY
0.25 → CHAOS
0.40 → CONNECTION
0.55 → AUTOMATION
0.70 → OPTIMIZATION
0.85 → SIMPLIFICATION
1.00 → LEVERAGE
```

Each state changes:
- particle count/visibility
- machine organization
- glyph density
- brightness
- path activity
- camera position
- camera target
- packet velocity
- typography
- visual noise
- machine scale

Use a continuous interpolation between states.

Avoid hard state jumps.

---

# 13. Scroll Narrative

## 13.1 State 0 — Dormant

The machine is barely visible.

Very low activity.

The visitor sees:

```text
. . · . .     . : . . 
     .  < . . . . >
. .       . .      .
```

Cursor interaction begins revealing structure.

Hero copy is fully visible.

---

## 13.2 State 1 — Discovery

The visitor starts scrolling.

The machine becomes slightly more visible.

Characters brighten.

Connections begin appearing.

Copy transition:

> **Most operational work is invisible.**

Then:

> Someone moves the data.  
> Someone checks it.  
> Someone copies it.  
> Someone reconciles it.  
> Someone reports it.

These should appear as separate DOM lines with controlled staggered animation.

The WebGL system should visually reinforce these movements.

---

# 14. State 2 — Chaos

At roughly 25% progress, show the machine in its busiest state.

Many:
- packets
- particles
- paths
- nodes
- interactions

The machine should feel inefficient.

Visual metaphor:

```text
INPUT
  ↓
PERSON
  ↓
SPREADSHEET
  ↓
EMAIL
  ↓
PERSON
  ↓
DATABASE
  ↓
REPORT
```

Do not render this exact diagram.

Represent it visually through unnecessarily long paths and repeated transfers.

Copy:

> **The problem isn't always the amount of work.**

Then:

> **It's how many times the work has to move.**

---

# 15. State 3 — Connection

At approximately 40% progress:

The system starts reorganizing.

Paths become cleaner.

Nodes cluster into coherent groups.

Redundant connections fade.

Packets start taking shorter routes.

Copy:

> **We map the work before we automate it.**

Supporting line:

> Because automating a broken process only makes the broken process faster.

This is a key positioning statement.

---

# 16. State 4 — Automation

At approximately 55%:

The transformation becomes obvious.

Long manual pathways collapse.

New direct paths appear.

Data packets accelerate.

Human-like repeated movement disappears.

Machine activity becomes more intentional.

Copy:

> **Then we remove the unnecessary steps.**

Supporting points can appear sequentially:

- Connect the tools you already use.
- Remove repetitive handoffs.
- Automate predictable decisions.
- Keep people in control of the work that requires judgment.

Do not use generic feature cards here.

Use typography and the WebGL machine as the primary storytelling device.

---

# 17. State 5 — Optimization

At approximately 70%:

The machine is now highly efficient.

Very little unnecessary movement remains.

The visual should become cleaner and more elegant.

Copy:

> **The best automation doesn't add more technology.**

Then:

> **It removes friction.**

The machine should begin losing visual complexity.

This is intentional.

---

# 18. State 6 — Simplification

At approximately 85%:

The machine is almost quiet.

Most particles disappear.

Only a few important data streams remain.

The ASCII field becomes sparse.

The camera begins pulling away.

Copy:

> **The work gets quieter.**

Then:

> **Your team gets time back.**

---

# 19. State 7 — Leverage

At the final stage:

The enormous machine contracts toward a small central point.

The ASCII representation compresses.

Most of the visual disappears.

The page becomes visually calm.

Final headline:

> **Give your team their time back.**

Supporting text:

> We'll identify where repetitive work is consuming your team's time, then show you what can realistically be removed.

Primary CTA:

> **Find 5+ hours worth recovering →**

Secondary:

> **Talk through a workflow →**

---

# 20. Business Conversion Mechanism

The primary conversion should be a workflow audit / discovery interaction.

Do not use a generic:

> Book a Demo

Instead use language aligned with the business proposition:

> **Find the work worth automating**

or:

> **Find 5+ hours worth recovering**

The CTA should lead to a lightweight qualification form or scheduling flow.

Suggested fields:
- name
- work email
- company
- role
- what repetitive process consumes the most time?
- optional estimated hours/week

Do not make the first interaction feel like a sales application.

---

# 21. Homepage Sections After the WebGL Story

The WebGL hero/story is the primary visual experience, but the homepage should continue into conventional content for visitors who want evidence.

Recommended structure:

```text
01 — Navigation
02 — WebGL Hero
03 — Workflow Transformation Story
04 — What We Actually Automate
05 — Proof / Case Studies
06 — How Engagement Works
07 — Why This Approach
08 — Final CTA
09 — Footer
```

---

# 22. What We Actually Automate

Keep this section practical.

Potential categories:

### Data movement
Move information between systems without manual copying.

### Document workflows
Extract, validate, classify, transform, and route information from documents.

### Reporting
Automate repetitive collection, consolidation, and reporting processes.

### Reconciliation
Compare multiple sources and surface inconsistencies or exceptions.

### Notifications and follow-up
Trigger appropriate actions without people manually monitoring systems.

### Internal operations
Remove repetitive administrative steps from recurring workflows.

Do not frame these as "AI features."

Frame them as **work removed**.

---

# 23. Proof Section

Use real evidence where available.

Potential proof themes from the business:
- large-scale digitization
- offline AI deployment
- workflow automation
- document intelligence
- healthcare systems
- thousands of records processed
- support hours automated

Do not invent statistics.

Every metric displayed on the homepage must be traceable to a real project or source.

The visual treatment should be restrained:
- large number
- short explanation
- subtle WebGL interaction
- no giant collection of dashboard cards

---

# 24. How Engagement Works

Three steps.

### 01 — Find the friction

We identify repetitive, manual, duplicated, or unnecessarily complex work.

### 02 — Design the system

We determine what should be automated, integrated, simplified, or left with people.

### 03 — Build and measure

We implement the workflow and measure the time or operational burden removed.

Visual metaphor:
Three small states of the machine.

```text
OBSERVE
   ↓
DESIGN
   ↓
REMOVE
```

---

# 25. Typography

Typography should be modern and technical but not excessively futuristic.

Recommended characteristics:
- strong grotesk sans
- high x-height
- clean numerals
- excellent variable font support
- restrained tracking

Use:
- large headline
- small uppercase labels
- short paragraphs
- generous whitespace

Avoid:
- excessive monospace typography
- cyberpunk fonts
- sci-fi display fonts
- overly rounded SaaS typography

Monospace can be used selectively for:
- system labels
- small metadata
- technical readouts
- ASCII-related microcopy

---

# 26. Color

Primary background:
- near-black

Primary text:
- warm white

Secondary text:
- muted gray

Accent:
- orange

Use orange sparingly.

Orange should indicate:
- active scanner region
- selected state
- important signal
- CTA interaction
- key data packet

Do not turn the whole page orange.

---

# 27. Navigation

Keep navigation minimal.

Suggested:

```text
ASOR AHURA

Work
Approach
About

[Find the work worth automating →]
```

The navigation should remain lightweight over the WebGL hero.

On scroll:
- background may gain a very subtle translucent surface
- typography remains crisp
- CTA stays accessible

---

# 28. Loading Experience

The WebGL scene should not block the entire page indefinitely.

Initial page:

```text
ASOR AHURA

INITIALIZING WORKFLOW...
```

But this should disappear quickly.

Avoid a fake long loading animation.

Use real loading progress if assets require meaningful loading.

If WebGL assets are lightweight enough, render the page immediately and progressively increase scene fidelity.

---

# 29. WebGL Initialization Strategy

Initialize in stages:

### Stage 1
Create canvas and renderer.

### Stage 2
Create minimal scene.

### Stage 3
Load glyph atlas.

### Stage 4
Initialize workflow geometry.

### Stage 5
Initialize post-processing.

### Stage 6
Enable mouse interaction.

### Stage 7
Enable high-fidelity effects if device permits.

The HTML copy must be usable even if WebGL fails.

---

# 30. Performance Requirements

Target:
- 60 FPS on modern desktop hardware
- graceful degradation on lower-power machines
- no unnecessary CPU animation loops
- no thousands of DOM nodes for visual effects

Use:
- InstancedMesh
- BufferGeometry
- GPU particles
- shader calculations
- render targets
- object pooling
- low-resolution post-processing where appropriate

Avoid:
- one Three.js object per particle where instancing is sufficient
- DOM-based ASCII
- per-frame React state updates
- unnecessary allocations in render loops
- expensive readPixels operations every frame
- multiple full-resolution post-processing passes unless justified

---

# 31. Adaptive Quality

Create a performance manager.

Suggested levels:

```text
HIGH
MEDIUM
LOW
```

### HIGH
- full ASCII resolution
- full particle count
- mouse trail
- depth influence
- normal/edge effects
- subtle bloom
- full animation

### MEDIUM
- reduced ASCII resolution
- fewer particles
- simplified post-processing
- reduced mouse trail
- reduced secondary animation

### LOW
- very low render scale
- minimal particles
- simplified shader
- no expensive secondary effects
- static/slow machine movement

If WebGL is unavailable:

Show a static fallback representation and preserve all copy/CTAs.

---

# 32. Responsive Behavior

## Desktop

Full cinematic experience.

The machine can occupy a large portion of the viewport.

## Tablet

Reduce:
- particle density
- machine scale
- ASCII resolution
- camera movement

Keep the interaction.

## Mobile

Do not simply shrink the desktop scene.

Create a dedicated composition.

Mobile should use:
- fewer nodes
- fewer particles
- simpler ASCII field
- reduced animation
- touch interaction
- shorter scroll choreography

Touch should act as a scanner:
- finger movement influences the field
- tapping can briefly reveal a region

If performance is poor, use the fallback.

---

# 33. Accessibility

The WebGL experience must never contain essential information that exists nowhere else.

All important text must be DOM.

Provide:
- semantic headings
- keyboard-accessible CTAs
- visible focus states
- accessible form labels
- reduced-motion support

For:

```css
prefers-reduced-motion: reduce
```

disable:
- aggressive camera movement
- continuous particle motion
- cursor trails
- rapid transitions

Keep:
- static machine
- subtle transitions
- readable copy
- full functionality

---

# 34. SEO

The HTML must contain meaningful content independent of WebGL.

Suggested metadata:

Title:

> Workflow Automation & Operational Systems | Asor Ahura

Description:

> We find repetitive work inside your business and build systems that automate, simplify, and remove it.

Use semantic:
- H1
- H2
- section headings
- descriptive CTA labels

Do not make the H1 an image or WebGL element.

---

# 35. Suggested Technical Stack

Preferred:

- Next.js
- React
- TypeScript
- Three.js
- React Three Fiber only if it improves maintainability; raw Three.js is acceptable/preferred for the custom renderer
- GSAP + ScrollTrigger for timeline orchestration
- GLSL shaders
- Vite-compatible tooling if not using Next.js

Do not introduce unnecessary libraries.

Use CSS for normal layout and animation where WebGL is not required.

---

# 36. Suggested Project Structure

```text
src/
  app/
    page.tsx
    layout.tsx

  components/
    navigation/
      Navigation.tsx

    hero/
      Hero.tsx
      HeroCopy.tsx
      HeroCTA.tsx

    story/
      WorkflowStory.tsx
      StoryCopy.tsx

    sections/
      AutomationCapabilities.tsx
      Proof.tsx
      EngagementProcess.tsx
      FinalCTA.tsx

    webgl/
      WorkflowCanvas.tsx
      WebGLFallback.tsx

  webgl/
    Scene.ts
    Renderer.ts
    Camera.ts

    workflow/
      WorkflowMachine.ts
      WorkflowNode.ts
      WorkflowPath.ts
      DataPacketSystem.ts
      ParticleSystem.ts

    ascii/
      ASCIIComposer.ts
      GlyphAtlas.ts
      ASCIIShader.ts

    interaction/
      MouseField.ts
      ScrollController.ts

    performance/
      PerformanceManager.ts
      DeviceCapabilities.ts

  shaders/
    workflow.vert
    workflow.frag
    particles.vert
    particles.frag
    ascii.vert
    ascii.frag
    mouse-field.frag

  hooks/
    useScrollProgress.ts
    useReducedMotion.ts
    useWebGLCapability.ts

  styles/
    globals.css
```

Adjust this structure to the actual framework if the existing repository has a strong established architecture.

Do not rewrite unrelated application infrastructure.

---

# 37. State Management

Do not use React state for per-frame WebGL values.

Use mutable refs/classes for:
- mouse position
- camera values
- particle positions
- shader uniforms
- scroll progress
- performance state

React should control:
- component visibility
- content
- layout
- application state

Three.js should control:
- frame-by-frame animation
- shader uniforms
- geometry
- camera
- particles

---

# 38. Scroll Architecture

Use one normalized scroll progress value for the story.

Example:

```ts
progress: 0 → 1
```

Map this into named state parameters:

```ts
machineVisibility
machineChaos
connectionStrength
packetSpeed
particleDensity
asciiDensity
asciiBrightness
cameraDistance
cameraTarget
machineOrganization
```

Do not create dozens of unrelated ScrollTrigger animations fighting each other.

There should be a coherent master timeline.

---

# 39. Animation Philosophy

Animation must communicate causality.

Bad:

> Random particles move because particles look cool.

Good:

> Data packets accelerate because the workflow has been automated.

Bad:

> Machine rotates constantly.

Good:

> Camera moves deeper into the system as the visitor investigates the workflow.

Every significant animation should answer:

> **What does this movement mean?**

---

# 40. Visual Restraint

The homepage should have moments of near-stillness.

Especially near the end.

The transformation is more powerful if the machine begins extremely active and ends extremely calm.

The core visual principle:

> **Complexity disappears as automation improves.**

That is the central metaphor of the entire site.

---

# 41. CTA Microinteraction

When hovering the primary CTA:

- subtle orange signal
- tiny data packet moves toward the button
- button border responds
- surrounding ASCII field may briefly sharpen
- no excessive glow

The CTA should feel like an action entering the system.

On click:
- preserve normal navigation/accessibility
- do not trap the user in an animation

---

# 42. Footer

Keep it minimal.

Suggested:

```text
ASOR AHURA

Systems that give people their time back.

Work
Approach
About
Contact

© 2026 Asor Ahura
```

No giant wall of links.

---

# 43. Anti-Patterns

The implementation agent must NOT:

- copy the dragonfly website
- use a dragonfly
- use a generic neural-network animation
- use generic AI robot imagery
- make everything neon
- make everything orange
- render the entire site in monospace
- create ASCII using thousands of HTML elements
- use a prebuilt SaaS template
- add meaningless floating cubes
- use random particle effects without narrative purpose
- make the WebGL block the page
- put core copy inside canvas
- create an animation that only looks good in a screen recording
- sacrifice mobile usability for the desktop effect

---

# 44. Reference-Inspired Technical Principles

The supplied reference material demonstrates several useful techniques:

- a Three.js-style shader pipeline
- an off-screen 3D render target
- fullscreen ASCII/pixelation post-processing
- a glyph atlas
- mouse-trail influence
- normal/depth-aware visual treatment
- scroll-driven scene animation
- separate DOM typography over the WebGL scene

These techniques should inform the implementation, but the resulting experience must be an original Asor Ahura visual system rather than a recreation.

---

# 45. Implementation Sequence

Build in this order.

## Phase 1 — Page skeleton

Implement:
- navigation
- hero DOM
- sections
- typography
- CTAs
- responsive layout

No complex WebGL yet.

## Phase 2 — Basic WebGL

Implement:
- renderer
- camera
- scene
- procedural workflow nodes
- paths
- particles

## Phase 3 — ASCII

Implement:
- render target
- glyph atlas
- fullscreen shader
- luminance mapping
- edge detection
- depth influence

## Phase 4 — Interaction

Implement:
- mouse scanner
- cursor trail
- camera response
- particle interaction

## Phase 5 — Scroll story

Implement the complete:

```text
DORMANT
→ DISCOVERY
→ CHAOS
→ CONNECTION
→ AUTOMATION
→ OPTIMIZATION
→ SIMPLIFICATION
→ LEVERAGE
```

timeline.

## Phase 6 — Performance

Implement:
- quality levels
- reduced-motion behavior
- mobile mode
- fallback

## Phase 7 — Polish

Tune:
- typography
- spacing
- glyph density
- particle velocity
- camera movement
- shader contrast
- accent intensity
- transitions

Do not add more visual effects simply because the page feels empty.

---

# 46. Acceptance Criteria

The implementation is not complete until all of the following are true.

### Visual

- [ ] The homepage immediately feels like a premium technical system.
- [ ] The hero contains an interactive 3D workflow machine.
- [ ] The machine is rendered through a custom ASCII/glyph treatment.
- [ ] The visual is clearly original rather than a recreation of the reference.
- [ ] Orange is used as a restrained signal/accent.
- [ ] The machine feels three-dimensional.
- [ ] The ASCII field does not look like flat terminal text.

### Interaction

- [ ] Cursor movement influences the machine.
- [ ] Cursor movement creates a subtle scanner/trail effect.
- [ ] Scroll transforms the machine's state.
- [ ] The transformation is clearly visible.
- [ ] The machine becomes less chaotic as the story progresses.
- [ ] The final state is significantly calmer than the initial state.

### Narrative

- [ ] The user understands that the machine represents business workflows.
- [ ] The page communicates repetitive work → automation → recovered time.
- [ ] The copy does not lead with generic AI terminology.
- [ ] The CTA is centered on finding work worth automating.
- [ ] The visual story supports the business story.

### Technical

- [ ] WebGL rendering is GPU-based.
- [ ] ASCII rendering does not use thousands of DOM elements.
- [ ] Per-frame WebGL state does not cause React re-renders.
- [ ] Render resolution is adaptive.
- [ ] Particle systems use efficient GPU-friendly techniques.
- [ ] Mobile has a dedicated reduced-complexity mode.
- [ ] WebGL fallback exists.
- [ ] Reduced-motion support exists.

### Accessibility

- [ ] All meaningful text exists in HTML.
- [ ] H1 is semantic HTML.
- [ ] CTAs are keyboard accessible.
- [ ] Focus states exist.
- [ ] Forms are properly labeled.
- [ ] Reduced motion is respected.

### Conversion

- [ ] The primary CTA is visible above the fold.
- [ ] CTA copy communicates the business outcome.
- [ ] The page has a clear final CTA.
- [ ] The visitor understands what happens after clicking.
- [ ] There is no dependence on the WebGL effect for basic comprehension.

---

# 47. Final Creative Test

Before declaring the homepage finished, ask someone unfamiliar with the business to look at it for 10 seconds.

They should be able to answer:

1. **What kind of problem does this company solve?**
2. **Why should I care?**
3. **What should I do next?**

The ideal answer should be approximately:

> "They find repetitive work in businesses and automate it so teams get their time back."

If the person instead says:

> "It's some cool AI/WebGL website."

the implementation has failed.

The technology should create **curiosity**.

The copy and narrative should create **understanding**.

The offer should create **conversion**.

---

# 48. North Star

The entire homepage should communicate one idea:

> **The goal of automation isn't to make your business more technological. It's to make unnecessary work disappear.**

The WebGL machine starts complex.

The machine becomes intelligent.

The machine becomes efficient.

Then the machine almost disappears.

That disappearance is the product.
