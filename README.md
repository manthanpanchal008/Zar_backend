# Zar Jewels - B2B Jewel Store Ecosystem

A production-ready, full-stack application ecosystem developed for Zar Jewels, featuring a static storefront, a Next.js Admin Dashboard, and a Node.js/Express backend API server with MySQL database synchronization.

---

## Project Overview

The Zar Jewels ecosystem is split into three main architectural parts to optimize performance, B2B lead capture, catalog management, and administrative control.

1. **Zar Public Website (Storefront)**: A fast, responsive storefront presenting jewelry catalogs, brand milestones (The Zar Journey), upcoming and past exhibition events, testimonials, clientele, and active career openings.
2. **Admin Dashboard**: A secure, standalone Next.js application for administrators and staff members to manage inventory (gold types, categories, collection types, products), review B2B partner inquiries, read contact submissions, manage career applications, update company milestones, and manage users.
3. **Backend APIs**: A robust Node.js/Express server exposing public API endpoints for form submissions and catalog fetching, alongside secure JWT-authorized admin endpoints for management.
4. **Database**: A relational MySQL database storing structured records for users, catalog entities, forms, milestones, and events.

---

## Tech Stack

### Frontend (Admin Dashboard)
* **Framework**: Next.js 15 (App Router, React 19)
* **Styling**: Tailwind CSS & Vanilla CSS (with custom modular layouts)
* **Animations**: Framer Motion (for collapsible navigation and transitions)
* **API Client**: Axios (configured with token interceptors)

### Backend (API Server)
* **Runtime & Framework**: Node.js & Express.js
* **Template Engine**: EJS (retained for legacy views rendering)
* **Logger**: Morgan (configured for request auditing)
* **Security**: Helmet (CSP and Cross-Origin policies) & CORS

### Database & Storage
* **Database**: MySQL (utilizing `mysql2` driver with promise pooling)
* **File Uploads**: Multer (configured with safe filename sanitization)

### Services & Middleware
* **Mail Client**: Nodemailer (sending transactional HTML emails via SMTP)
* **Security & Auth**: JSON Web Tokens (JWT) for APIs, Express Session for legacy web views
* **Rate Limiting**: `express-rate-limit` for form spam prevention

---

## Project Structure

```
/
├── backend/                       # Express.js backend application
│   ├── config/                    # DB connection pool, bootstrap table checks, and environment setup
│   ├── controllers/               # Request handlers (admin CRUD, public forms, auth)
│   │   ├── admin/                 # Admin-specific CRUD controllers
│   │   └── web/                   # EJS-based web controllers (legacy)
│   ├── middleware/                # Express middlewares (JWT auth, role authorization, upload handlers)
│   ├── models/                    # Database queries/CRUD (MySQL)
│   ├── public/                    # Static resources & uploaded file directories (under /uploads)
│   ├── routes/                    # Route mappings (adminApiRoutes, apiRoutes, EJS routes)
│   ├── services/                  # NodeMailer mail services
│   ├── templates/                 # EJS & HTML templates for emails
│   └── views/                     # EJS views for backend legacy rendering
├── frontend/                      # Frontend applications
│   └── admin-dashboard/           # Next.js admin dashboard panel
│       ├── public/                # Static assets (images, icons)
│       └── src/                   # React source code
│           ├── app/               # App Router pages and layouts
│           ├── components/        # Shared components and UI primitives (DataTable, Forms)
│           ├── context/           # AuthContext state providers
│           ├── hooks/             # Custom React hooks (useAuthGuard)
│           ├── lib/               # Axios API client setup and storage hooks
│           └── types/             # Unified TypeScript typings
├── docs/                          # Detailed project and database documentation
├── deploy.sh                      # Production shell deployment automation script
├── ecosystem.config.js            # PM2 process manager configuration file
├── make_zip.bat                   # Windows batch file for packaging deployment zip
├── prepare_zip.ps1                # PowerShell script for deployment zipping
└── .htaccess                      # Apache rewrite & proxy rules configuration
```

---

## Application Flow

### Public User/Visitor Flow
```
Visitor
   ↓ (Requests storefront pages)
Public Website (Static Export)
   ↓ (Fetches products/subcategories, submits forms)
API Request (/api/*)
   ↓ (Apache Proxy forwards request to port 5001)
Backend (Express Server)
   ↓ (Processes logic, triggers email notifications)
Database (MySQL) / Mail Services (Nodemailer)
```

### Administrator/Staff Flow
```
Admin / Staff
   ↓ (Navigates to /Zar_backend)
Admin Dashboard (Next.js App)
   ↓ (Checks JWT token; redirects to /login if missing)
Backend APIs (/api/admin/*)
   ↓ (Apache Proxy forwards request to port 5002 / 5001)
JWT Auth Middleware
   ↓ (Validates token and roles: admin vs. staff)
Database (MySQL)
```

---

## Features

### 1. Dashboard
Displays real-time count metrics for categories, products, events, testimonials, and careers.

### 2. Catalog Management
* **Gold Types**: Manage gold purities (e.g., 18K, 22K) and their decimals.
* **Categories**: Organize jewelry types with image uploads and custom slugs.
* **Collection Types**: Categorize collections (e.g. Handmade, Machine-made).
* **Products**: Standard CRUD operations including specifications (weight, details) and multi-image uploads.
* **SKU Generator**: Automates read-only unique B2B SKUs.

### 3. Exhibition Events
Publish upcoming and past shows, including location detail layouts, description rich-text, and image carousels.

### 4. Clientele & Testimonials
Display active partner logos and testimonials from B2B customers.

### 5. Careers & Applications
* **Careers**: Add job descriptions and location/experience requirements.
* **Career Applications**: Secure PDF/Word CV file upload, parsed, saved, and emailed directly to administrators.

### 6. B2B Inquiries
* **Become a Partner**: Comprehensive form collecting country, region, category details, and shop specifications.
* **Contact Inquiries**: General B2B inquiries capturing user details, email validation, and text message payloads.

### 7. The Zar Journey
Manage historical company milestones (year, description, image) served in chronological order.

### 8. Authentication & Password Reset
* Role-based token access (Admin vs Staff).
* Password recovery using a secure, verified 6-digit OTP mailer.

---

## Environment Variables

### Backend Variables (`backend/.env`)
* `PORT`: Server port (e.g., `5001`).
* `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: MySQL database credentials.
* `CORS_ORIGIN`: Allowed frontend client URLs (comma-separated).
* `JWT_SECRET`: Hashing secret for JWT signature verification.
* `SESSION_SECRET`: Session signature secret for legacy views.
* `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: Mail server credentials.

### Frontend Variables (`frontend/admin-dashboard/.env.production`)
* `NEXT_PUBLIC_API_BASE_URL`: Root path of the API backend (e.g., `/Zar_backend`).

---

## Local Development

### Prerequisites
* **Node.js**: v18.x or v20.x
* **MySQL Database**: v8.0+

### Step-by-Step Launch

1. **Database Setup**:
   Create a database named `zar_backend_new` and import `backend/production_database.sql` into it.

2. **Backend Config**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your local MySQL credentials and SMTP details
   npm install
   npm run dev # Starts on port 5001
   ```

3. **Frontend Config**:
   ```bash
   cd frontend/admin-dashboard
   cp .env.example .env.local
   # Edit .env.local to point to http://localhost:5001
   npm install
   npm run dev # Starts on port 3000
   ```

---

## Production Build & Deployment

### Build Command
Compile Next.js dashboard into standalone bundles:
```bash
cd frontend/admin-dashboard
npm run build
```

### Production Execution
* **Backend**: `npm start`
* **Frontend**: `npm run start` (or using PM2)

### Deployment (cPanel / VPS)
The deployment structure uses **PM2** processes managed under **Apache** reverse proxy.
1. Upload code ZIP file.
2. Run `./deploy.sh` to install dependencies and compile the Next.js bundle.
3. Configure `.htaccess` to map routes cleanly to ports 5001 (Backend) and 5002 (Dashboard).
4. Restart PM2 processes via `pm2 startOrReload ecosystem.config.js --env production`.

---

## Troubleshooting

### 1. Infinite Redirect Loops on Login
**Cause**: The Apache `.htaccess` contains a redirect rule `RewriteRule ^$ /Zar_backend/login [R=302,L]` which intercepts root requests and fights with client-side React routers.
**Fix**: Remove the redirect rule from `.htaccess` and let the frontend's `useAuthGuard` handle redirects dynamically.

### 2. 404 Page Not Found on Root `/Zar_backend/`
**Cause**: Apache's `mod_dir` module attempts to search for directory files (`index.html`), modifying paths internally to `/Zar_backend/index.html` which Next.js doesn't recognize.
**Fix**: Add an Apache rewrite rule: `RewriteRule ^$ /Zar_backend/dashboard [R=302,L]` (directing root requests straight to the `/dashboard` route, which isn't a physical directory).

### 3. Missing Authorization Headers on Backend
**Cause**: WHM/cPanel Apache servers strip `Authorization` headers by default.
**Fix**: Ensure `CGIPassAuth On` is added to `.htaccess`.
