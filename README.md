# Zar jewels Backend

A lightweight backend API for the Zar jewels frontend. It accepts contact submissions and stores them in MySQL.

## Features

- Contact submission API at `/api/contact`
- MySQL contact storage
- CORS enabled for frontend development
- Health check at `/api/health`
- Session login for dashboard routes (`/login`)
- JWT login for API routes (`/api/login`)
- Role-based access control with `admin` and `staff` roles

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create the database using the SQL script:
   ```
   mysql -u root -p < database.sql
   ```

   Insert your users directly into the `users` table. The app does not seed a default admin account.

3. Update database credentials in a `.env` file if needed:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=zar_jeweller
   DB_PORT=3306
   CORS_ORIGIN=http://localhost:3000
   JWT_SECRET=replace-with-a-strong-secret
   SESSION_SECRET=replace-with-a-strong-secret
   ALLOW_START_WITHOUT_DB=false
   PORT=4000
   ```

4. Start the backend server:
   ```
   npm start
   ```

## Running without MySQL (development fallback)

If MySQL is not installed/running yet, you can still boot the server for UI wiring by setting:

```env
ALLOW_START_WITHOUT_DB=true
```

In this degraded mode, server startup continues, but DB-backed features (login, users, contacts, jewellery CRUD) will fail until MySQL is available.

## Frontend integration

If the frontend runs on a different port, set `NEXT_PUBLIC_API_URL` in the frontend environment to the backend URL, for example:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Then the contact form can submit to:

- `POST http://localhost:4000/api/contact`

## Database schema

- `contacts`
  - `id`
  - `name`
  - `company`
  - `email`
  - `phone`
  - `subject`
  - `message`
  - `created_at`
- `users`
   - `id`
   - `name`
   - `email`
   - `password`
   - `role` (`admin` or `staff`)
   - `created_at`
   - `updated_at`

## Authentication and roles

- `POST /api/login`
   - body: `{ "email": "...", "password": "..." }`
   - response includes `token` and `user` with `role`
- `GET /api/me`
   - requires `Authorization: Bearer <token>`
- `GET /api/users`
   - admin-only endpoint
- `GET /api/contacts`
   - admin-only endpoint

Dashboard permissions:
- `admin`: full jewellery management (add, edit, delete)
- `staff`: read-only dashboard access

## Notes

This backend is intentionally minimal and matches the frontend contact flow. It does not include the previous admin panel routes or unused authentication logic.
