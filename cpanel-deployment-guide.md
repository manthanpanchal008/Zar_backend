# Zar Jewels — Production Deployment Guide for WHM/cPanel VPS

This guide provides step-by-step instructions for deploying the Zar Jewels applications (Storefront, Admin Dashboard, and Express Backend) on a WHM/cPanel VPS environment.

---

## 1. Architecture Overview in Production

In a production environment, we partition the applications to match cPanel's directory layout:
1. **Storefront (`frontend/zar`)**: Statically exported (`out/` directory). Uploaded directly to the main domain's directory (typically `public_html`). Served efficiently by Apache.
2. **Express Backend (`backend`)**: Runs as a Node.js process using PM2 or cPanel Node.js Selector (runs on port `5001`). Proxy rules in `.htaccess` forward `/api` and `/uploads` requests here.
3. **Admin Dashboard (`frontend/admin-dashboard`)**: Runs as a Next.js standalone Node.js process using PM2 or cPanel Node.js selector (runs on port `3001`).

---

## 2. Prerequisites

Ensure your WHM/cPanel VPS has the following services installed:
- **Node.js** (v18.x or v20.x/v22.x)
- **PM2** (Process Manager, installed globally via `npm install -g pm2`)
- **MySQL Database Server** (v8.0+ or MariaDB equivalent)
- **Apache Web Server** (with `mod_proxy` and `mod_rewrite` modules enabled)

---

## 3. Deployment Steps

### Step 1: Database Setup
1. Log in to cPanel and search for **MySQL Databases**.
2. Create a new database, e.g., `youruser_zar_jewels`.
3. Create a new database user and assign a strong password.
4. Add the user to the database with **All Privileges**.
5. Open **phpMyAdmin**, select the database, click the **Import** tab, and select the `production_database.sql` file located in the `backend/` folder to populate the database tables. This file is clean and free of hardcoded database creation statements, preventing cPanel privilege errors.

### Step 2: Upload Files
1. Compress your project workspace (excluding `node_modules`, `.next` folders) into a ZIP file.
2. Log in to cPanel **File Manager** and upload the ZIP to the home directory (or outside of `public_html` for security).
3. Extract the ZIP archive. Let's assume it is extracted at `/home/username/zar_project/`.

### Step 3: Configure Environment Variables
Copy and rename the `.env.production` files and fill in your secure credentials:

1. **Backend**:
   - Locate `/home/username/zar_project/backend/.env.production`
   - Copy to `.env` in the same directory: `cp .env.production .env`
   - Edit `.env` to input your MySQL username, password, database name, and define a secure random string for `JWT_SECRET` and `SESSION_SECRET`.

2. **Admin Dashboard**:
   - Locate `/home/username/zar_project/frontend/admin-dashboard/.env.production`
   - Copy to `.env.production`: `cp .env.production .env` (or configure via the environment config list).
   - Set `NEXT_PUBLIC_API_BASE_URL` to your api subdomain, or leave it relative if proxied.

### Step 4: Build and Compile
From the terminal (via SSH) inside the project directory `/home/username/zar_project/`, run the deployment script:
```bash
chmod +x deploy.sh
./deploy.sh
```
This script will install all dependencies, build the storefront static export, and build the Next.js admin dashboard server.

### Step 5: Configure Apache and Frontend
1. Move the storefront static files (`frontend/zar/out/*`) into the target website folder (e.g. `public_html`).
2. Copy the `.htaccess` file from `/home/username/zar_project/.htaccess` into the `public_html` directory.
3. This `.htaccess` file handles:
   - Serving static files.
   - Forwards all `/api/*` and `/uploads/*` requests to the Node.js backend port `5001`.
   - Maps Next.js clean slugs (trailingSlash layout) seamlessly.

### Step 6: Process Management (PM2)
To start and keep the backend and admin-dashboard processes running persistently:
```bash
# Start the processes defined in ecosystem.config.js
pm2 start ecosystem.config.js --env production

# Save the PM2 list so they restart automatically on server reboot
pm2 save

# Optional: Generate startup script if running on root/VPS level
pm2 startup
```

---

## 4. Verification and Testing

1. **Storefront**: Open `https://yourdomain.com` in your browser. Verify pages load instantly.
2. **Admin Login**: Visit `https://yourdomain.com/login` or your custom admin URL. Enter admin credentials to verify authentication.
3. **CRUD Operations**: Navigate to the Products, Events, or Categories pages. Modify or delete an item to confirm the operations execute immediately without needing manual refresh.
4. **Log Review**: To view logs or troubleshoot issues:
   - Backend errors: `pm2 logs zar-backend`
   - Admin Dashboard errors: `pm2 logs zar-admin-dashboard`
