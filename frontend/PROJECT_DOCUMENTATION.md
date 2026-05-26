# Zar Jewels Admin Panel - Frontend Project Documentation

This documentation provides a comprehensive overview of the Next.js admin dashboard frontend codebase.

## Tech Stack
- **Framework**: Next.js 15.5 (App Router, React 19)
- **Styling**: Vanilla CSS + Tailwind CSS utilities
- **State Management & Form Handling**: React Hook Form, React Hooks
- **Icons**: Lucide React
- **API Client**: Axios

## Folder Structure
```
frontend/admin-dashboard/
├── public/                 # Static brand assets (icon-1.png, favicon.ico)
├── src/
│   ├── __tests__/          # Jest unit test suites
│   ├── app/                # Next.js App Router routing layouts & pages
│   │   ├── clientele/      # Clientele listing and CRUD views
│   │   ├── category/       # Categories listing and CRUD views
│   │   ├── goldtype/       # Gold types listing and CRUD views
│   │   ├── makingtype/     # Making types listing and CRUD views
│   │   ├── dashboard/      # Admin main analytics dashboard view
│   │   ├── events/         # Exhibitions & Shows listing and CRUD views
│   │   ├── login/          # Brand-aligned Authentication screen
│   │   ├── products/       # Products listing, dynamic add/edit forms
│   │   └── users/          # Users listing and CRUD views
│   ├── components/
│   │   ├── layout/         # Sidebar, Navbar, AdminLayout structures
│   │   ├── goldtype/       # GoldTypeForm component
│   │   ├── category/       # CategoryForm component
│   │   ├── makingtype/     # MakingTypeForm component
│   │   └── ui/             # Reusable UI (Button, Card, DataTable, ImageUpload, RichTextEditor)
│   ├── hooks/              # Custom React hooks (useAuthGuard)
│   ├── lib/                # API client (Axios configuration) and Auth helpers
│   ├── types/              # Unified TypeScript definitions (index.ts)
│   └── globals.css         # Global stylesheet, custom inputs, list styles
```

## Page List & Sidebar Navigation
The admin dashboard sidebar routes:
1. **Dashboard** (`/dashboard`): General stats and active entities counters.
2. **Events** (`/events`): CRUD for Exhibitions & Shows.
3. **GoldType** (`/goldtype`): CRUD for Gold Purity Types (e.g. 18K, 22K, 24K).
4. **Category** (`/category`): CRUD for Product Categories (e.g. Bangles, Ring, Mangalsutra, Kada, Chain).
5. **MakingType** (`/makingtype`): CRUD for Making/Manufacturing types (e.g. Handmade, Plain, Fancy, Machine Made).
6. **Products** (`/products`): Upgrade products, SKU code viewer, and spec rows CRUD.
7. **Clientele** (`/clientele`): CRUD for brand clientele logos.
8. **Users** (`/users`): CRUD for User permissions and registrations (Admin only).
9. **Logout** (Triggered directly via Sidebar/Navbar user actions).

## Layout & Navbar User Dropdown
- **Layout**: Consists of `Sidebar` (navigation items left) and `Navbar` (top header content) nested under `AdminLayout`.
- **Dropdown**: Features a dropdown inside `Navbar` displaying logged-in user details (name, email, role) with an active Logout option.

## API Integration & Axios Client
- **Axios Location**: Configured in `src/lib/api.ts`.
- **JWT Handling**: Token stored in localStorage and appended to headers on request interceptors.
- **Upload Configuration**: `uploadConfig()` helper utility in `api.ts` maps header boundary formats for file attachments.

## Authentication & Protected Routes
- **Route Guard**: The `useAuthGuard` hook verifies token integrity on route transitions. Unauthorized requests redirect immediately to `/login`.

## Key Form & Interactive Component Patterns

### 1. Form Handling (React Hook Form)
Uses standard type schemas inside forms. Dynamically maps state variables for array lists (e.g. Weight rows or Spec rows).

### 2. Auto-generated read-only SKU
In the Product Form:
- Watches Category, GoldType, and MakingType dropdown values.
- Triggers a call to `/api/admin/products/generate-sku` once all three options are selected.
- Displays the returned code in a `readOnly` input field.

### 3. Auto slug generation
In the Category Form:
- Watches Category name.
- Auto-populates the slug field by converting names to lower-case kebab format (`e.g. Machine Made -> machine-made`), while leaving it editable for manual adjustments.

### 4. Table Component (`DataTable`)
A custom premium component rendering local lists:
- In-line text search
- Column filters (Status filters)
- Custom pagination (defaulting to 10 page size, configurable to 20/30/40)
- Sort controls

### 5. Custom File Upload (`ImageUpload`)
A drag-and-drop styled container replacing browser controls:
- In-line image preview
- Single/Multiple selection modes
- Client-side size check (< 5MB) and mime type validation

### 6. Rich Text Editor (`RichTextEditor`)
Self-contained HTML5 formatting wrapper replacing normal textareas:
- Text Bold, Italic, Underline
- Numbered and Unordered lists

## Environment Variables
- `NEXT_PUBLIC_API_BASE_URL`: Root endpoint of the Express backend (defaulting to `http://localhost:5001`).

## How to Run Frontend
From the root of the frontend folder:
```bash
npm install
npm run dev
```

## Common Bugs & Solutions
- **Select Pre-selection Race Condition**: When options are fetched asynchronously, the select field resets to empty. Fixed by listening to options array updates in a `useEffect` hook and explicitly calling hook-form `setValue` when available.
- **Next.js SSR builds failing on `window` usage**: Wrapped client utilities using `typeof window !== 'undefined'` check blocks.
