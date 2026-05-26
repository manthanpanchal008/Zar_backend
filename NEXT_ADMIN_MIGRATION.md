# Zar Jewels EJS to Next.js Admin Migration

## Folder Structure

```txt
Zar-Backend/
  app.js                         # Express app export for API tests
  server.js                      # Server bootstrap and schema initialization
  controllers/
    authController.js
    admin/
      productController.js
      categoryController.js
      userController.js
  middleware/
    auth.js                      # EJS session guards + JWT API guards
    upload.js                    # Multer image upload middleware
  routes/
    adminApiRoutes.js            # Next.js admin REST API
    *Routes.js                   # Existing EJS/web routes kept during migration
  tests/backend/
    auth.test.js
    products.test.js
  frontend/admin-dashboard/
    src/app/                     # Next.js App Router pages
    src/components/layout/       # Sidebar/navbar/layout matching EJS panel
    src/components/products/     # React Hook Form product form
    src/lib/api.ts               # Axios instance
    src/lib/auth.ts              # Session-storage token helpers
    src/__tests__/               # RTL/Jest frontend tests
```

## Migration Plan

1. Keep existing EJS routes active for `/login`, `/dashboard`, `/products`, `/users`, and related pages.
2. Move admin data access into JSON-only routes under `/api/admin/*`.
3. Use `/api/auth/login` for JWT login from Next.js. The old EJS `/login` route continues to use sessions.
4. Convert one EJS page at a time into React components, reusing the same layout hierarchy: sidebar, top navbar, card, table, form.
5. Point users to the Next dashboard once page parity is confirmed, then retire the matching EJS route.
6. Remove `ejs` and `express-session` only after all admin pages are migrated and no web-rendered admin routes remain.

## API Route Structure

```txt
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout

GET    /api/admin/dashboard
GET    /api/admin/products
POST   /api/admin/products
GET    /api/admin/products/:id
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id

GET    /api/admin/categories
POST   /api/admin/categories
PUT    /api/admin/categories/:id
DELETE /api/admin/categories/:id

GET    /api/admin/subcategories
POST   /api/admin/subcategories
PUT    /api/admin/subcategories/:id
DELETE /api/admin/subcategories/:id

GET    /api/admin/users
POST   /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id

GET    /api/admin/orders
```

## Auth Flow

1. Next.js login form posts email/password to `/api/auth/login`.
2. Express validates bcrypt password, sets an HttpOnly `admin_token` cookie, and returns `{ token, user }`.
3. Axios sends credentials and also attaches `Authorization: Bearer <token>` while the tab session is active.
4. `requireJwtAuth` validates the JWT from the bearer header or HttpOnly cookie and loads the fresh user from MySQL.
5. `requireJwtRole('admin')` protects product/category/user mutations.
6. Logout clears the frontend token. JWT expiry is controlled by `JWT_EXPIRES_IN`.

## Image Upload Flow

1. React Hook Form reads files from `<input type="file" multiple />`.
2. The form sends `FormData` through Axios with multipart headers.
3. Express `multer` stores product images in `public/uploads/products`.
4. Backend validates file type, count, payload fields, category, and subcategory.
5. API stores only safe filenames in MySQL and returns public `/uploads/products/...` URLs.

## Test Commands

```bash
npm test
npm run test:backend
npm --prefix frontend/admin-dashboard test
```

Install new dependencies first:

```bash
npm install
npm --prefix frontend/admin-dashboard install
```

## Minimum Deployment Checklist

- Backend auth: valid login, bad login, expired token, no token.
- Role access: admin can mutate, staff can only read permitted pages.
- Product CRUD: create, list, edit, delete, missing required fields.
- Category CRUD: collection type validation, required image validation.
- Upload validation: non-image, oversized image, too many images.
- Frontend protected routes redirect unauthenticated users to `/login`.
- Axios shows API errors and clears auth on `401`.
- EJS pages still render and existing session login still works during migration.
- MySQL edge cases: missing category, deleted product, duplicate email, empty result sets.

## Manual Edge Cases

- Refresh a protected Next.js route with a valid token.
- Use the browser back button after logout.
- Upload product images from filenames with spaces or special characters.
- Check mobile sidebar/table overflow.
- Verify old EJS `/products` and new Next `/products` show the same product data.
- Confirm CORS `CORS_ORIGIN` matches the Next.js URL in production.
