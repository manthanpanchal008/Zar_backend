# Zar Jewels Admin Panel - Backend Project Documentation

This documentation provides an overview of the Express.js backend codebase.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (using `mysql2` driver with promise support)
- **Authentication**: JWT (`jsonwebtoken`) and custom session options
- **File Upload**: Multer

## Folder Structure
```
/
├── config/                 # DB connection (db.js), bootstrap schemas (bootstrap.js) and env setup (env.js)
├── controllers/            # Request handlers (auth, goldType, category, makingType, event, clientele, product, user)
├── middleware/             # Express middlewares (auth.js for roles, upload.js for Multer uploads)
├── models/                 # Database layers (goldTypeModel, categoryModel, makingTypeModel, productModel, eventModel, userModel)
├── public/
│   └── uploads/            # Multer file storage (products, events, clientele, goldtypes, categories, makingtypes)
├── routes/                 # Express API router (adminApiRoutes.js, apiRoutes.js)
├── tests/                  # Integration tests (Jest, Supertest)
├── server.js               # Entrypoint & bootstrap triggers
└── package.json            # Scripts and dependencies definitions
```

## Middleware List
1. **JWT Authenticator** (`middleware/auth.js`):
   - `requireJwtAuth`: Validates JWT token from the authorization header (`Bearer <token>`).
   - `requireJwtRole(role)`: Validates role-based write access restrictions (Staff read-only, Admin full-access).
2. **Multer File Uploader** (`middleware/upload.js`):
   - `imageUpload(folderName, options)`: Dynamic configuration defining image directories, file limits (up to 10), and strict type checks.
   - `handleMulterError`: Captures Multer upload exceptions and returns standard JSON payloads.

## Database Connection & Schema Setup
- **Bootstrap**: Triggers database and table verification on startup (`config/bootstrap.js`).
- **MySQL Queries**: Performed via a query connection pool (`config/db.js`).
- **Tables Details**:
  - `users`: ID, name, email, hashed password, role (`admin`, `staff`).
  - `gold_types`: ID, name (e.g. 22K), purity (decimal 5,2, e.g. 91.6), image path, is_active (tinyint).
  - `categories`: ID, name (e.g. Bangles), slug (unique, e.g. bangles), image path, is_active (tinyint).
  - `making_types`: ID, name (e.g. Handmade), image path, is_active (tinyint).
  - `products`: ID, category_id (references `categories.id`), gold_type_id (references `gold_types.id`), making_type_id (references `making_types.id`), sku (varchar, unique), title, collection_name, short_description, number_of_pcs, display_finish, weight_specifications (JSON array of label/value), technical_specifications (JSON array of feature/details), manufacturing_support, product_url, product_images (JSON array of filenames).
  - `events`: ID, title, location, start_date, end_date, description (Rich Text HTML), event_image (JSON array of filenames), event_url.
  - `clientele`: ID, clientele_title, clientele_image path.

## SKU Generation Logic
The backend enforces secure SKU generation and validates uniqueness before writing to the database:
- **Format**: `[CATEGORY_CODE]-[GOLD_TYPE_CODE]-[MAKING_TYPE_CODE]-[SEQUENCE]` (e.g., `BNG-22K-HM-001`).
- **Shortcode Rules**:
  - **Category**: Bangles → `BNG`, Ring → `RNG`, Mangalsutra → `MGL`, Kada → `KDA`, Chain → `CHN`. Other inputs fallback to removing vowels (A, E, I, O, U) and selecting the first 3 consonants.
  - **GoldType**: Upper-case brand tag with spaces stripped (e.g., `22K`, `18K`).
  - **MakingType**: Handmade → `HM`, Plain → `PL`, Fancy → `FN`, Machine Made → `MM`. Others fallback to taking initials of multi-word types, or removing vowels and selecting the first 2 consonants.
  - **Sequence**: Auto-incrementing product sequence suffix padded to 3 digits (e.g., `001`, `002`), matching the product ID (own ID for edits, or `MAX(id) + 1` for new adds).

## File Upload Flow & Storage Directories
Upload targets reside under `public/uploads/<folder_name>`:
- Products: `public/uploads/products/`
- Events: `public/uploads/events/`
- Clientele: `public/uploads/clientele/`
- Gold Types: `public/uploads/goldtypes/`
- Categories: `public/uploads/categories/`
- Making Types: `public/uploads/makingtypes/`

Filenames are sanitized via `createSafeFilename` using a safe alphanumeric regex to prevent duplicate file collision or directory traversal risks.

## Environment Variables
- `PORT`: Backend server listener (default `5001`).
- `DB_HOST`: Database host address.
- `DB_PORT`: MySQL database port (default `3306`).
- `DB_USER`: Database username.
- `DB_PASSWORD`: Database password.
- `DB_NAME`: Target database name.
- `CORS_ORIGIN`: Allowed origin for frontend client (default `http://localhost:3000`).
- `JWT_SECRET`: Secret hash for token validations.

## API Response Format
All JSON responses follow a consistent format:
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "items": []
}
```
In case of errors, the response includes the error message and returns corresponding HTTP statuses:
```json
{
  "success": false,
  "error": "Error details here."
}
```

## How to Run Backend
From the root of the project:
```bash
npm install
npm run dev
```

## Common Bugs & Solutions
- **`ADD COLUMN IF NOT EXISTS` Crashes**: On older MySQL installations, adding columns conditionally triggers syntax errors. Resolved in `bootstrap.js` by checking `INFORMATION_SCHEMA.COLUMNS` before performing structural modifications.
- **Multipart Form Payload Parsing**: Express parser limits file uploads. Fixed by placing the Multer middleware directly in front of controller handlers to parse both files and text parameters correctly.
