**Project Overview**

- **Name:** Create Prototype from Requirements (Prototype)
- **Purpose:** A React + Vite frontend prototype implementing a mobile-first UI for browsing and comparing phones, tracking prices, and managing wishlists. The design originates from a Figma spec.

**Tech Stack**

- **Framework:** React + TypeScript
- **Bundler:** Vite
- **Package manager:** pnpm / npm compatible
- **Styling:** Tailwind / PostCSS + custom CSS in `src/styles`
- **UI primitives:** Local shadcn-style components under `src/app/ui`

**Quick Start**

- Install dependencies:

```bash
npm install
```
- Start dev server:

```bash
npm run dev
```
- Build for production:

```bash
npm run build
```

**Repository Structure**

- [src/main.tsx](src/main.tsx#L1): App bootstrap and root render.
- [src/app/App.tsx](src/app/App.tsx#L1): Top-level app layout, providers and global UI.
- [src/app/routes.ts](src/app/routes.ts#L1): Route definitions used by the app router.
- [src/app/components](src/app/components): Reusable page components (Navbar, BottomNav, PhoneCard, Root).
- [src/app/context/AppContext.tsx](src/app/context/AppContext.tsx#L1): Global React context for app state (user, filters, wishlist, etc.).
- [src/app/data/mockData.ts](src/app/data/mockData.ts#L1): Mock data used for development and UI demos.
- [src/app/pages](src/app/pages): Page-level components mapped to routes (HomePage, SearchPage, PhoneDetailPage, etc.).
- [src/app/ui](src/app/ui): Collection of UI primitives and component wrappers (buttons, inputs, dialogs) derived from shadcn/ui.
- [src/imports/styles](src/imports/styles): Global CSS, Tailwind and theme files.

**How the Code Works (High-level)**

- App bootstrap: `src/main.tsx` mounts the app and applies global styles and providers.
- Routing: `src/app/routes.ts` defines route -> page mappings. The router loads page components from `src/app/pages`.
- Layout & navigation: `src/app/App.tsx` composes the main layout with `Navbar` and `BottomNav` and wraps pages with `AppContext` for shared state.
- State: `AppContext.tsx` centralizes shared state (current user, wishlist, filters). Pages and components consume this via hooks to read/update state.
- UI primitives: Components in `src/app/ui` provide consistent design tokens and behavior (forms, dialogs, cards). Page components compose these primitives for complete screens.
- Data: `mockData.ts` supplies example phone objects and sample content used by `HomePage`, `SearchPage`, and `PhoneDetailPage`. Replace with a real API by swapping the data import with fetch calls.

**Development Notes & Conventions**

- Keep components in `src/app/components` small and presentational; page logic belongs to files in `src/app/pages`.
- Reuse primitives in `src/app/ui` rather than creating ad-hoc UI elements.
- Add types to props and context to keep the app strongly typed.

**Extending / Integrating an API**

- Replace `mockData.ts` with an API client. Example flow:
  - Create `src/app/api/phones.ts` with fetch wrappers.
  - Update pages to call the API (use React Query or simple `useEffect` + `useState`).
  - Keep `AppContext` for global caches like wishlist or user profile.

**Scripts**

- `dev` — Starts Vite dev server
- `build` — Produces production build
- `preview` — Serves the production build locally

**Contributing**

- Create feature branches, follow small commits, and open PRs with clear descriptions. Add unit or integration tests when adding behavior.

**Credits & License**

- Design based on the Figma file referenced in the original project. Adjust attribution as needed.
- Include your preferred license file at the repository root.

If you'd like, I can also:
- add a `CONTRIBUTING.md` with a detailed workflow; or
- scaffold an API adapter and demo integration with `mockData` switched to fetches.

  