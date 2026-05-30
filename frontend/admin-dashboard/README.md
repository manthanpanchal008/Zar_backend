# Zar Jewels Admin Dashboard - Frontend Documentation

This directory contains the Next.js frontend application for the Zar Jewels Admin Panel. It is designed to act as a secure, standalone B2B dashboard for managing catalogs, viewing incoming B2B partner applications, reading customer contact requests, reviewing career submissions, publishing company events, and defining inventory attributes.

---

## Folder Structure

```
frontend/admin-dashboard/
├── public/                 # Static brand assets (logo icon-1.png, favicon)
├── src/
│   ├── __tests__/          # Unit testing suites for pages and forms
│   ├── app/                # Next.js App Router routing layouts and pages
│   │   ├── dashboard/      # Main dashboard home, redirect target (rendered via root layout)
│   │   ├── goldtype/       # Gold Type management views
│   │   ├── category/       # Product Category management views
│   │   ├── collectiontype/ # Collection Type management views
│   │   ├── products/       # Products management and add/edit forms
│   │   ├── build-connection/ # Become a Partner B2B submissions viewer
│   │   ├── contact-inquiry/ # Contact Inquiries submissions viewer
│   │   ├── careers/        # Job posting CRUD views
│   │   ├── career-application/ # Career applications CV viewer
│   │   ├── events/         # Exhibition events publisher views
│   │   ├── clientele/      # Client logos manager views
│   │   ├── testimonials/   # Customer testimonials manager views
│   │   ├── zar-journey/    # Zar Journey milestone timeline manager views
│   │   ├── users/          # Administrator users CRUD manager views (Admin only)
│   │   ├── login/          # Security-hardened auth portal
│   │   ├── forgot-password/# Recovery page trigger
│   │   ├── verify-otp/     # OTP token check page
│   │   ├── reset-password/ # New password submission page
│   │   ├── layout.tsx      # Global app wrapper (loading context, Toast container)
│   │   └── page.tsx        # Client-side router targeting /dashboard
│   ├── components/
│   │   ├── layout/         # Sidebar, Navbar, and AdminLayout structures
│   │   ├── ui/             # Reusable UI primitives (Button, Card, DataTable, ImageUpload, RichTextEditor)
│   │   ├── common/         # ViewModal detail viewer
│   │   └── [module]/       # Form components matching each CRUD domain
│   ├── context/            # AuthContext state providers
│   ├── hooks/              # Custom React hooks (useAuthGuard)
│   ├── lib/                # API client (Axios configuration) and Auth localStorage handlers
│   ├── types/              # Unified TypeScript schema typings
│   └── globals.css         # Global stylesheet, custom classes, custom inputs
```

---

## Routing Structure

The dashboard uses Next.js **App Router** for layout hierarchies.
* All admin screens are protected by the `AdminLayout` wrapper component.
* If a visitor is not logged in, they are redirected automatically to the `/login` route.
* **Authentication Screens** (unprotected):
  * `/login`
  * `/forgot-password`
  * `/verify-otp`
  * `/reset-password`
* **Root Redirection**: Opening the homepage `/` automatically triggers a client-side `router.replace("/dashboard")` redirection.

---

## Authentication Flow

Authentication is managed via JSON Web Tokens (JWT):
1. **Login**: User enters credentials. On success, the token is saved via `setAuth(token, user)` which stores the string in browser `localStorage`.
2. **Context**: `AuthProvider` (in `src/context/AuthContext.tsx`) initializes session state. It immediately attempts to fetch user information by sending a `GET /api/auth/me` request using the token.
3. **Route Protection**: The `useAuthGuard` hook intercepts routes. If `getToken()` returns null or the token is invalid (returning a 401 error), the browser cleans up the credentials and performs a hard routing reload to the login page:
   ```typescript
   clearAuth();
   window.location.assign("/Zar_backend/login");
   ```
4. **Roles**: There are two roles:
   * `admin`: Has read and write permissions (including adding/editing products and managing admin users).
   * `staff`: Has read-only permissions on catalog items and cannot access the `users` management screen.

---

## Sidebar Modules

The navigation layout is structured inside `src/components/layout/Sidebar.tsx` into clean collapsible dropdown categories:

### 1. Products Dropdown
* **Gold Types** (`/goldtype`): Define standard metal purities (e.g. 18K, 22K) and associate image vectors.
* **Categories** (`/category`): Organize catalog types (Bangles, Rings, Necklace).
* **Collection Types** (`/collectiontype`): Organize collection groups (Handmade, Machine-made).
* **Products** (`/products`): Upload items, manage specification lists, and upload multiple high-resolution photos.

### 2. Inquiry Dropdown
* **Become a Partner** (`/build-connection`): Review details of wholesalers, retailers, or distributors requesting B2B partnerships.
* **Contact Inquiries** (`/contact-inquiry`): Read B2B contact submissions.

### 3. Career Dropdown
* **Careers** (`/careers`): Post job openings.
* **Career Applications** (`/career-application`): Review and download applicant CV documents (PDFs, DOC, DOCX) directly from the Express static repository.

### 4. Standalone Modules
* **Events** (`/events`): Publicize show listings.
* **The Zar Journey** (`/zar-journey`): Update chronological brand milestones.
* **Clientele** (`/clientele`): Upload partner brand logos.
* **Testimonials** (`/testimonials`): Display client reviews.
* **Users** (`/users`): Manage administrative logins (restricted to `admin` role).

---

## API Integration & Axios Interceptors

Axios is configured in `src/lib/api.ts`:
* Appends `Authorization: Bearer <token>` automatically to every outbound request header if a token is present in local storage.
* Detects write actions (`POST`, `PUT`, `DELETE`) and automatically triggers a loading notification (e.g., "Saving changes...") via the toast system.
* Handles API errors globally: if the API returns a `401 Unauthorized` response, it clears authorization values from the browser storage and redirects to the login screen.

---

## Shared UI Components

* **`DataTable.tsx`**: A premium, customizable grid component rendering tables with inline search filters, paginators (sizes 10/20/30/40), sorting arrows, and drop-down action lists.
* **`ImageUpload.tsx`**: A drag-and-drop file upload container with size validation (< 5MB), image format validation, and single/multiple preview grids.
* **`RichTextEditor.tsx`**: A self-contained WYSIWYG editor supporting list formats, bold, italic, and underline tags.

---

## Smart Form Interactions

* **Auto-generated read-only SKU**:
  In `ProductForm.tsx`, the component watches dropdown values for Category, GoldType, and CollectionType. Once all three are selected, it triggers a fetch to `/api/admin/products/generate-sku` and updates the read-only SKU field (e.g., `BNG-22K-HM-001`).
* **Auto-slug Generation**:
  In `CategoryForm.tsx`, the category name input dynamically auto-populates the slug field by converting string values to lowercase kebab-case (e.g. `Machine Made` becomes `machine-made`), while leaving the field editable for manual overrides.

---

## Toast Notification System

Powered by **React Hot Toast**:
* Triggered in layout wraps.
* The API client intercepts write requests to throw loading indicators, transforming them into green checkmark successes or red error banners on response completion.

---

## Responsive Layout

* **Tailwind CSS Media Queries**:
  The navigation system detects screen breakpoints. Sidebar is fully responsive, hiding into a collapsible mobile drawer menu triggered by a hamburger button in the top `Navbar`.

---

## Build and Run

### Run Local Dev Server
```bash
npm install
npm run dev
```

### Compile Production Build
```bash
npm run build
```
This command compiles the React assets into optimized static and server-side JS bundles stored under the `.next` directory.
