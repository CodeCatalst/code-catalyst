# Copilot Instructions for AI Coding Agents

## Project Overview
- **Framework:** React (with Vite, Tailwind CSS, PostCSS)
- **Structure:**
  - `src/components/` – Reusable UI components, organized by feature/domain (e.g., `Admin/`, `Auth/`, `Common/`, `Layout/`)
  - `src/pages/` – Route-level pages, grouped by feature (e.g., `Home/`, `Blog/`, `Admin/`)
  - `src/context/` – React context providers for global state (e.g., `AuthContext.jsx`, `NoticesContext.jsx`)
  - `src/services/` – API abstraction modules (e.g., `api.js`, `blogs.js`, `gallery.js`)
  - `src/utils/` – Utility functions (e.g., `adminAccess.js`)

## Key Patterns & Conventions
- **Component Organization:**
  - Feature-based folders under `components/` and `pages/`.
  - Admin-only features are in `components/Admin/` and `pages/Admin/`.
- **API Calls:**
  - Use `src/services/` modules for all backend/API interactions. Do not call APIs directly in components.
  - Example: `import { getBlogs } from '../services/blogs'`
- **State Management:**
  - Use React Context for global state (see `src/context/`).
  - Local state is managed with React hooks.
- **Styling:**
  - Tailwind CSS is the primary styling method. Use utility classes in JSX.
  - Global styles in `index.css` and `App.css`.
- **Routing:**
  - Page components in `src/pages/` correspond to routes.
  - Use React Router (see `main.jsx`).
- **Auth & Access Control:**
  - Use `AuthContext` for authentication state.
  - Use `AdminRoute` and `ProtectedRoute` for route protection.
  - Admin access logic in `utils/adminAccess.js` and `components/Admin/AdminAccessWrapper.jsx`.
- **Modals & Toasts:**
  - Use `components/Common/Modal.jsx` and `components/Common/Toast.jsx`.
  - Toast logic via `use-toast.js` hook.

## Developer Workflows
- **Development:**
  - Start: `npm run dev`
  - Build: `npm run build`
  - Preview: `npm run preview`
- **Testing:**
  - No formal test suite detected. If adding tests, follow the feature-based structure.
- **Linting/Formatting:**
  - Lint: `npx eslint .`
  - Tailwind/PostCSS config in root.

## Integration Points
- **External APIs:** All backend communication is abstracted in `src/services/`.
- **3D/Graphics:** `components/Common/ThreeScene.jsx` for 3D scenes.
- **Rich Text:** `components/Admin/RichTextEditor.jsx` for blog/content editing.

## Examples
- To add a new admin feature:
  1. Create a component in `components/Admin/`
  2. Add a page in `pages/Admin/`
  3. Protect with `AdminRoute` and use `AdminAccessWrapper`
- To add a new API call:
  1. Add function in `src/services/`
  2. Import and use in relevant component/page

## References
- See `vite.config.js`, `tailwind.config.js`, and `postcss.config.js` for build and styling setup.
- For global state, see `src/context/`.
- For authentication, see `src/context/AuthContext.jsx` and `components/Auth/`.

---

_If any conventions or workflows are unclear, please request clarification or examples from maintainers._
