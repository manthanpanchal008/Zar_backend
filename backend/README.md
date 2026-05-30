# Zar Jewels Backend - API Server Documentation

This directory contains the Node.js/Express.js backend application for the Zar Jewels platform. The server acts as a centralized REST API engine for the Next.js Admin Dashboard, handles public B2B lead capture form submissions, delivers transactional emails, processes file uploads, and renders legacy EJS views.

---

## Folder Structure

```
backend/
├── config/                 # DB connections pool, schema builders, and env loaders
├── controllers/            # Request handlers
│   ├── admin/              # JWT-authorized controllers for admin CRUD
│   └── web/                # EJS session-authorized controllers (legacy)
├── middleware/             # Express middleware (auth, uploads, error handling)
├── models/                 # Database layer performing raw SQL queries
├── public/                 # Static assets directory
│   └── uploads/            # Target folders for uploaded images and CV PDFs
│       ├── products/
│       ├── events/
│       ├── clientele/
│       ├── goldtypes/
│       ├── categories/
│       ├── makingtypes/     # Used for collection types
│       ├── zar_journey/
│       └── cvs/            # CV applications storage
├── routes/                 # Express routing mounts
├── services/               # Transactional email dispatcher (Nodemailer)
├── templates/              # HTML templates for B2B and application emails
├── views/                  # EJS template views (legacy layout files)
├── tests/                  # Backend unit and integration test files
├── server.js               # Main server listener bootstrapper
└── package.json            # NPM dependencies and scripts
```

---

## Controllers

Request processing is divided into two areas:

### 1. Admin Controllers (`controllers/admin/`)
Handle secure inventory management and data review.
* `productController.js`: Catalog CRUD, product upload bindings.
* `categoryController.js`: Category CRUD, automatic slug formatting.
* `goldTypeController.js`: Pure gold metadata CRUD.
* `collectionTypeController.js`: Collection design classifications (handmade, machine-made).
* `userController.js`: Management of admin dashboard user roles.
* `eventController.js`: Exhibition show listing CRUD.
* `clienteleController.js`: Partner brand logo manager.
* `testimonialController.js`: B2B customer reviews manager.
* `careerController.js`: Job postings manager.
* `zarJourneyController.js`: Company milestones history manager.
* `buildConnectionController.js`: View partner submissions.
* `contactInquiryController.js`: View contact inquiries.
* `careerApplicationController.js`: View applicant listings and CV downloads.

### 2. Web Controllers (`controllers/web/`)
Render EJS-based administrative templates for legacy pages:
* `authController.js`, `dashboardController.js`, `productController.js`, `eventController.js`, `clienteleController.js`, `userController.js`.

---

## Middleware

1. **`requireJwtAuth`**: Extracts Bearer token from the standard `Authorization` header, verifies its integrity using JWT, retrieves the user from the database, and appends the user object to `req.user`.
2. **`requireJwtRole(role)`**: Validates if the authenticated JWT user has permission (e.g. restricts write operations like `POST`/`PUT`/`DELETE` to `admin` role, allowing `staff` read-only access).
3. **`requireLogin` / `requireApiLogin`**: Session-based auth checks for legacy EJS views.
4. **`imageUpload(folder, options)` / `cvUpload(folder, options)`**: Utilizes **Multer** to parse multipart form payloads, validate formats (JPG/PNG for images; PDF/DOC/DOCX for CVs), limit file sizes (< 5MB), and generate safe filenames to prevent path traversals.
5. **`handleMulterError`**: Gracefully captures upload exceptions and returns standardized JSON error responses.

---

## Authentication Architecture

* **Token Issuance**: During login, the server signs a payload containing user metadata (id, name, email, role) using the `JWT_SECRET` key, expiring in `1d` (configurable via `JWT_EXPIRES_IN`).
* **Hashed Credentials**: Passwords are securely hashed using `bcrypt` (10 salt rounds) before database storage.
* **OTP Verification**: A secure, verified 6-digit OTP code is generated and emailed during password reset flows. Codes expire after 15 minutes, with attempts limited to 5 to prevent brute-forcing.

---

## Upload Handling

Uploaded files are processed by Multer and stored inside the `/public/uploads/` subdirectories:
* Unique filenames are generated using a timestamp prefix and a sanitized, safe alphanumeric format (e.g., `1779738015295-image.png`).
* Deleting product, event, or career application records triggers an automated file system cleanup using Node's `fs.unlink()` to remove associated files.

---

## Mail Services

Powered by **Nodemailer** using SMTP configuration:
* **Password Reset**: Dispatches 6-digit OTP codes in a branded HTML template.
* **Become a Partner**: Triggers dual emails upon submission — a detail report to the admin (`SMTP_USER`) and a confirmation thank-you email to the applicant.
* **Contact Inquiry**: Sends submission notifications to the admin and thank-you emails to the user.
* **Career Application**: Sends the applicant's details to the admin with the uploaded CV document (PDF/Word) attached directly to the email.

---

## Rate Limiting

The backend uses `express-rate-limit` to protect public endpoints from brute-force and spam:
* **Global API Limit**: All `/api/` endpoints are limited to 1,000 requests per 15 minutes per IP.
* **Public Form Limits**: Public-facing forms are restricted to **5 submissions per 10 minutes** per IP:
  * `POST /api/build-connection`
  * `POST /api/contact-inquiry`
  * `POST /api/career-application`

---

## API Response Structure

The backend returns standardized JSON formats:

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "items": []
}
```

### Error Response (4xx / 5xx)
```json
{
  "success": false,
  "error": "Error details go here."
}
```

---

## Environment Variables (`.env`)

* `PORT`: Server port (default `5001`).
* `DB_HOST`: Host location of the MySQL server.
* `DB_PORT`: MySQL port (default `3306`).
* `DB_USER`: Database username.
* `DB_PASSWORD`: Database password.
* `DB_NAME`: Database name.
* `CORS_ORIGIN`: Whitelisted CORS origin URLs (e.g., `http://localhost:3000`).
* `JWT_SECRET`: Secret key for JWT signing.
* `JWT_EXPIRES_IN`: JWT expiration time (default `1d`).
* `SESSION_SECRET`: Session signature key.
* `SMTP_HOST`: Mail SMTP hostname (e.g., `smtp.gmail.com`).
* `SMTP_PORT`: Mail SMTP port (e.g., `465`).
* `SMTP_USER`: SMTP username / Admin recipient email.
* `SMTP_PASS`: SMTP app password.

---

## Build and Run

### Run Local Dev Server
```bash
npm install
npm run dev
```

### Start Production Server
```bash
npm start
```
Before launching, the server automatically boots `ensureSchema()` from `config/bootstrap.js` to create missing database tables and apply required schema migrations.
