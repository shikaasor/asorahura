# Testing Patterns

**Analysis Date:** 2026-05-13

## Test Framework

**Status:** Not detected

**Current State:**
- No test files found in codebase (searched for `*.test.*` and `*.spec.*`)
- No test runner configured in `package.json` (no Jest, Vitest, or Playwright dependencies)
- No testing configuration files present (`jest.config.js`, `vitest.config.ts`, etc.)

**Observation:** This is a portfolio/professional website (Next.js 13+ app) with no automated testing setup. Testing infrastructure would need to be added if testing is desired.

## Test Framework Recommendations

**If Testing to Be Added:**

### Option 1: Jest + React Testing Library (Recommended for React Components)
```json
{
  "devDependencies": {
    "jest": "latest",
    "@testing-library/react": "latest",
    "@testing-library/jest-dom": "latest",
    "@types/jest": "latest"
  },
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Option 2: Vitest (Faster, ESM-first)
```json
{
  "devDependencies": {
    "vitest": "latest",
    "@testing-library/react": "latest",
    "@vitest/ui": "latest"
  }
}
```

### Option 3: Playwright (E2E Testing)
For Next.js applications, Playwright can test full user flows:
```json
{
  "devDependencies": {
    "@playwright/test": "latest"
  }
}
```

## Test File Organization

**Recommended Structure:**
```
src/
├── components/
│   ├── Navigation.tsx
│   ├── Navigation.test.tsx         # Co-located unit test
│   ├── LinkedInFeed.tsx
│   └── LinkedInFeed.test.tsx
├── app/
│   ├── page.tsx
│   ├── page.test.tsx
│   └── engage/
│       ├── page.tsx
│       ├── actions.ts
│       └── actions.test.ts
└── lib/
    ├── articles.ts
    └── articles.test.ts
```

**Naming Pattern:** `[ComponentName].test.tsx` or `[FileName].test.ts`

## Test Structure Template

**For React Components (e.g., `LinkedInFeed.test.tsx`):**
```typescript
import { render, screen } from "@testing-library/react";
import LinkedInFeed from "./LinkedInFeed";

describe("LinkedInFeed", () => {
  it("renders the feed header", () => {
    render(<LinkedInFeed />);
    const header = screen.getByText(/Recent Insights/i);
    expect(header).toBeInTheDocument();
  });

  it("renders three LinkedIn posts", () => {
    render(<LinkedInFeed />);
    const posts = screen.getAllByRole("link");
    // Should include 3 posts + 1 "View all on LinkedIn" link = 4 links total
    expect(posts.length).toBeGreaterThan(0);
  });

  it("renders external links with proper target attributes", () => {
    render(<LinkedInFeed />);
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      if (link.href.includes("linkedin.com")) {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    });
  });
});
```

**For Server Actions (e.g., `actions.test.ts`):**
```typescript
import { submitInquiry } from "./actions";

describe("submitInquiry", () => {
  beforeEach(() => {
    process.env.GOOGLE_SCRIPT_URL = "https://example.com/submit";
  });

  it("returns success when form data is valid", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "john@example.com");
    // ... add other required fields

    const result = await submitInquiry(formData);

    expect(result.success).toBe(true);
    expect(result.message).toBe("Inquiry submitted successfully. We will be in touch.");
  });

  it("returns error when GOOGLE_SCRIPT_URL is missing", async () => {
    delete process.env.GOOGLE_SCRIPT_URL;
    
    const formData = new FormData();
    const result = await submitInquiry(formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Form submission is not configured.");
  });

  it("returns error on fetch failure", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));
    
    const formData = new FormData();
    formData.append("name", "John");
    // ... other fields

    const result = await submitInquiry(formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Something went wrong. Please try again later.");
  });
});
```

**For Utility Functions (e.g., `articles.test.ts`):**
```typescript
import { getArticleBySlug } from "./articles";

describe("getArticleBySlug", () => {
  it("returns article when slug matches", () => {
    const article = getArticleBySlug("cervical-cancer-screening-tool");

    expect(article).toBeDefined();
    expect(article?.title).toBe("I Built an AI That Screens for Cervical Cancer in Rural Nigeria — Without the Internet");
    expect(article?.slug).toBe("cervical-cancer-screening-tool");
  });

  it("returns undefined when slug does not match", () => {
    const article = getArticleBySlug("non-existent-slug");

    expect(article).toBeUndefined();
  });

  it("article has required properties", () => {
    const article = getArticleBySlug("cervical-cancer-screening-tool");

    expect(article).toHaveProperty("slug");
    expect(article).toHaveProperty("title");
    expect(article).toHaveProperty("subtitle");
    expect(article).toHaveProperty("description");
    expect(article).toHaveProperty("tags");
    expect(article).toHaveProperty("metrics");
    expect(article).toHaveProperty("sections");
  });
});
```

## Mocking

**Framework Recommendation:** Jest's built-in mocking for component tests

**Patterns:**

### Mocking fetch (in server actions):
```typescript
global.fetch = jest.fn().mockResolvedValueOnce({
  ok: true,
  json: jest.fn().mockResolvedValueOnce({ status: "success" }),
});
```

### Mocking Next.js modules:
```typescript
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/current-page"),
}));
```

### Mocking framer-motion (to avoid animation complexity in tests):
```typescript
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
}));
```

**What to Mock:**
- External API calls (fetch, Google Script URL)
- Animation libraries (Framer Motion) to speed up tests
- Next.js navigation/router functions
- Environment variables

**What NOT to Mock:**
- Component rendering logic
- CSS module imports
- Data transformation utilities
- TypeScript interfaces

## Fixtures and Factories

**Test Data Location:** `src/__tests__/fixtures/`

**Example fixture file (`src/__tests__/fixtures/articles.ts`):**
```typescript
import { Article } from "@/lib/articles";

export const mockArticle: Article = {
  slug: "test-article",
  title: "Test Article Title",
  subtitle: "Test Subtitle",
  description: "Test description",
  tags: ["#test", "#article"],
  metrics: "100 | 50 | 25",
  sections: [
    {
      heading: "Introduction",
      body: ["This is a test paragraph."],
    },
  ],
};

export const mockArticles: Article[] = [mockArticle];
```

**Usage in tests:**
```typescript
import { mockArticle } from "@/__tests__/fixtures/articles";

describe("Article rendering", () => {
  it("displays article data", () => {
    expect(mockArticle.title).toBe("Test Article Title");
  });
});
```

## Coverage

**Requirements:** Not currently enforced

**Recommendation if testing added:**
```json
{
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts",
      "!src/**/*.stories.tsx",
      "!src/app/layout.tsx"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 70,
        "lines": 70,
        "statements": 70
      }
    }
  }
}
```

**View Coverage:**
```bash
npm run test:coverage
# or with vitest
vitest --coverage
```

## Test Types

**Unit Tests:**
- Scope: Individual functions and utility functions (e.g., `getArticleBySlug`)
- Approach: Pure function testing with isolated inputs/outputs
- Files: `src/lib/*.test.ts`

**Component Tests:**
- Scope: React component rendering and user interaction
- Approach: Render component, query DOM, verify output
- Files: `src/components/*.test.tsx`

**Integration Tests:**
- Scope: Multiple components working together, form submissions
- Approach: Render page, simulate user actions, verify state changes
- Files: `src/app/**/*.test.tsx`

**E2E Tests (Recommended for Future):**
- Framework: Playwright or Cypress
- Scope: Full user workflows (visit home page, navigate to article, submit form)
- Example:
```typescript
import { test, expect } from "@playwright/test";

test("user can navigate to article from home page", async ({ page }) => {
  await page.goto("/");
  await page.click('a:has-text("Work")');
  await expect(page).toHaveURL("/work");
});
```

## Common Patterns

**Async Testing:**
```typescript
it("fetches and displays data", async () => {
  render(<ComponentWithAsync />);
  
  const element = await screen.findByText(/loaded content/i);
  expect(element).toBeInTheDocument();
});
```

**Error Testing:**
```typescript
it("handles form submission errors", async () => {
  global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));
  
  render(<EngagePage />);
  
  const submitBtn = screen.getByRole("button", { name: /submit/i });
  await userEvent.click(submitBtn);
  
  const errorMsg = await screen.findByText(/something went wrong/i);
  expect(errorMsg).toBeInTheDocument();
});
```

**DOM Queries (React Testing Library):**
```typescript
// Recommended (accessible queries)
screen.getByRole("button", { name: /submit/i });
screen.getByLabelText(/email/i);
screen.getByPlaceholderText(/enter email/i);

// Acceptable but less preferred
screen.getByText(/some text/i);

// Avoid
screen.getByTestId("submit-btn"); // Implementation detail
screen.querySelector(".submit-btn"); // Tightly coupled to CSS
```

---

*Testing analysis: 2026-05-13*
