# Dark Mode / Light Mode Feature

A clean, accessible dual-theme system (Light & Dark Mode) for the ColdEasy application featuring an organic, eye-friendly dark palette, a floating bottom-corner quick switch button with smooth Sun/Moon icon transitions, and automatic device preference detection.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions have been confirmed through user clarification:

- **Confirmed Decision 1 (Placement)**: Implemented as a floating bottom-corner quick switch button (`fixed bottom-6 left-5 sm:bottom-8 sm:left-8 z-40`), positioned symmetrically opposite the bottom-right WhatsApp action button and cleanly clearing the bottom disclaimer banner.
- **Confirmed Decision 2 (Visual Style)**: Sun and Moon icon button with smooth 300ms rotation and scale transition between light and dark states, with an accessible tooltip and tactile hover feedback.
- **Confirmed Decision 3 (Default Behavior)**: Auto-detects the visitor's device operating system preference (`prefers-color-scheme: dark`) on first arrival, while honoring manual user toggles persisted in `localStorage`.

---

## 1. Overview & Core Concept

- **What It Does**: Allows farmers, retailers, B2B partners, and site visitors to toggle between ColdEasy's warm organic daytime aesthetic and a deep, low-glare dark mode tailored for evening use and high-contrast browsing in bright field environments.
- **Target Audience / Persona**: Agritech buyers, mandi vendors, enterprise partners, and team members browsing across day and night conditions.
- **Key Value**: Enhances readability, reduces battery drain on OLED screens, respects system preferences, and ensures complete WCAG AA legibility across every page (Home, Products, Science, Impact, About, Contact, Policies, and Checkout).

---

## 2. User Experience & Visual Design

### Key User Flows
1. **First-Time Visit (Auto Detection)**:
   - The app checks `localStorage.getItem('coldeasy_theme')`.
   - If unset, it queries `window.matchMedia('(prefers-color-scheme: dark)')`.
   - If the device is in dark mode, the `dark` class is applied to `<html>`, loading the dark palette instantly without layout shift or flash.
2. **Interactive Toggle**:
   - The user clicks the floating toggle button in the bottom-left corner.
   - The icon smoothly morphs (Sun rotates and scales into Moon or vice versa) over 300ms.
   - The theme switches immediately, updating `localStorage` and syncing all application surfaces, brand logos, and contrast tokens.

### Visual Identity & Theme Tokens
- **Light Theme**:
  - Canvas: Cream (`#FCFBF1`)
  - Elevated Cards: Studio (`#FAF7F0` / `#FFFFFF`)
  - Text: Deep Charcoal Ink (`#251A10`)
  - Accents: Leaf Green (`#487537`), Marigold (`#F0A023`), Sky Blue (`#4FB8CC`)
- **Dark Theme (Warm Earth Charcoal)**:
  - Canvas: Deep Midnight Soil (`#14120E`)
  - Elevated Cards & Sections: Warm Obsidian Charcoal (`#1E1A14`, `#1A1712`)
  - Borders: Luminous Hairline (`rgba(247, 245, 238, 0.12)`)
  - Text: Off-white Pearl (`#F7F5EE`), Muted Sand (`#ACA498`, `#787065`)
  - Accents: Bioluminescent Leaf (`#5EA348`), Warm Marigold (`#F5AD38`), Luminous Sky (`#62CBE0`)
  - Logo: Automatic swap to `coldeasy-logo-horizontal-reversed-for-dark-bg_ad32f466.png` on dark surfaces

### Floating Switch Design
- **Dimensions**: 48px $\times$ 48px circle (`w-12 h-12`), elevated shadow (`shadow-xl hover:shadow-2xl`), accessible touch target.
- **Resting Surface**: Light mode uses soft frosted glass (`bg-white/90 border border-ink/10 text-ink`); dark mode uses glowing dark glass (`bg-[#1E1A14]/90 border border-white/15 text-amber-300`).
- **Micro-Interaction**: Icon smoothly rotates $90^\circ$ and cross-fades between `Sun` and `Moon` on click.

---

## 3. Key Product Decisions & Trade-Offs

- **Floating Switch Placement vs Header Bar**:
  - *Chosen Approach*: Floating bottom-left corner.
  - *Why*: Leaves the header navigation focused strictly on core pages (`Home | Products | Science | Impact | About Us | Contact Us`) as defined in the client requirements, while keeping theme control universally accessible on every screen.
  - *Alternatives Considered*: Placing inside the header nav links (would add visual noise to the strict 1-line top bar contract) or footer only (hard to reach on long pages).
- **CSS Variable Inversion vs Custom Variant Pairing**:
  - *Chosen Approach*: Hybrid architecture combining Tailwind v4 `@custom-variant dark (&:where(.dark, .dark *));` with established semantic CSS custom properties (`--color-ink`, `--color-cream`, `--color-sand`) and targeted surface rules in `src/index.css`.
  - *Why*: Eliminates contrast regressions across 15+ complex pages without fragile single-line hacks, ensuring buttons, badges, and modals retain proper foreground contrast.

---

## 4. Technical Architecture & System Flow

```
┌────────────────────────────────────────────────────────┐
│                      Window / OS                       │
│        (prefers-color-scheme: dark / light)            │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   ThemeContext.tsx                     │
│  - Reads 'coldeasy_theme' from localStorage            │
│  - Fallback to window.matchMedia if unset              │
│  - Writes 'dark' class to document.documentElement     │
│  - Exports { theme, toggleTheme, setTheme }            │
└─────────────┬────────────────────────────┬─────────────┘
              │                            │
              ▼                            ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│  ThemeToggleFloating.tsx  │ │       App & Pages        │
│  - Bottom-left corner     │ │  - Logo automatic swap   │
│  - Sun/Moon rotation      │ │  - CSS variable updates  │
│  - Click -> toggleTheme() │ │  - WCAG AA contrast audit│
└───────────────────────────┘ └──────────────────────────┘
```

### Implementation Steps
1. **Tailwind v4 Configuration (`src/index.css`)**:
   - Add `@custom-variant dark (&:where(.dark, .dark *));` directly beneath `@import "tailwindcss";` so all `dark:*` utilities compile correctly.
   - Ensure hardcoded light section backgrounds (such as `.bg-[#FAF7F0]`, `.bg-[#F4EFE6]`, `.bg-[#EFE9DD]`) map to warm dark charcoal in `.dark`.
   - Verify footer and disclaimer text colors maintain high contrast in dark mode.
2. **Floating Toggle Component (`src/components/ThemeToggleFloatingButton.tsx`)**:
   - Create responsive circular button with `Sun` and `Moon` icons from `lucide-react`.
   - Include tooltip for screen readers and desktop hover.
   - Position at `fixed bottom-6 left-5 sm:bottom-8 sm:left-8 z-40`.
3. **Mount in Root Layout (`src/App.tsx`)**:
   - Render `<ThemeToggleFloatingButton />` globally next to `<WhatsAppFloatingButton />` and `<DisclaimerBanner />`.
4. **App-Wide Contrast Audit**:
   - Verify all routes: Home, Products list, Product details (ColdEasy Box, AutoBox, Breezy), Science, Impact, About Us, Contact, Policies, Cart, and Checkout.
5. **Compilation & Lint Verification**:
   - Run `compile_applet` and `lint_applet` to ensure error-free builds.
