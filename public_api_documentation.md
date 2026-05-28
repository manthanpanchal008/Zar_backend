# Zar Jewels Public API Documentation

This document describes all the public, unauthenticated API endpoints exposed by the Zar Jewels Express backend. You can share this document with frontend developers to assist them in integrating external frontends (such as a storefront on Vercel or a local testing environment).

---

## 🛠️ General Settings

* **Production API Base URL:** `https://testintelliworkz.tech/Zar_backend`
* **Localhost Access:** The production API has been configured to automatically bypass CORS blocks for requests originating from any port on `localhost` or `127.0.0.1`.

> [!NOTE]
> All paths below must be appended to the Base URL. For example, the product categories URL is `https://testintelliworkz.tech/Zar_backend/api/product-categories`.

---

## 🔑 Authentication

### User Login
Authenticate a user and retrieve a JSON Web Token (JWT) along with user profile details.
* **Method:** `POST`
* **Path:** `/api/auth/login`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Staff User",
    "email": "user@example.com",
    "role": "staff"
  }
}
```

---

## 💎 Catalogue & Products

### Get All Products
Fetch all jewellery products, with optional filters for category and subcategory.
* **Method:** `GET`
* **Path:** `/api/products`
* **Query Parameters (All Optional):**
  * `category` (String) – Filter by category name (e.g. `Rings`)
  * `category_id` (Number) – Filter by category ID (e.g. `2`)
  * `subcategory_id` (Number) – Filter by subcategory ID (e.g. `4`)
* **Success Response (200 OK):**
```json
{
  "success": true,
  "category": "Rings",
  "category_id": null,
  "subcategory_id": null,
  "items": [
    {
      "id": 1,
      "category_id": 2,
      "category_name": "Rings",
      "subcategory_id": 4,
      "subcategory_name": "Engagement Rings",
      "title": "Zar Diamond Ring",
      "collection_name": "Bespoke Collection",
      "short_description": "A beautiful diamond ring handcrafted in 18k gold.",
      "number_of_pcs": 1,
      "display_finish": "High Polish",
      "weight_specifications": [],
      "technical_specifications": [],
      "manufacturing_support": "Available",
      "product_url": "zar-diamond-ring",
      "product_images": [
        "/uploads/products/image-1716584000.jpg"
      ],
      "created_at": "2026-05-24T12:00:00.000Z",
      "updated_at": "2026-05-24T12:00:00.000Z"
    }
  ]
}
```

---

### Get Single Product Details
Fetch complete specifications of a single product using its ID.
* **Method:** `GET`
* **Path:** `/api/products/:id` (Replace `:id` with product number)
* **Success Response (200 OK):**
```json
{
  "success": true,
  "product": {
    "id": 1,
    "category_id": 2,
    "category_name": "Rings",
    "subcategory_id": 4,
    "subcategory_name": "Engagement Rings",
    "title": "Zar Diamond Ring",
    "collection_name": "Bespoke Collection",
    "short_description": "A beautiful diamond ring handcrafted in 18k gold.",
    "number_of_pcs": 1,
    "display_finish": "High Polish",
    "weight_specifications": [],
    "technical_specifications": [],
    "manufacturing_support": "Available",
    "product_url": "zar-diamond-ring",
    "product_images": [
      "/uploads/products/image-1716584000.jpg"
    ],
    "created_at": "2026-05-24T12:00:00.000Z",
    "updated_at": "2026-05-24T12:00:00.000Z"
  }
}
```

---

### Get Product Categories
Retrieves the list of jewellery categories.
* **Method:** `GET`
* **Path:** `/api/product-categories`
* **Query Parameters (Optional):**
  * `collection_type` (String) – Filter categories by gold type/karat (`18k` or `22k`).
* **Success Response (200 OK):**
```json
{
  "success": true,
  "categories": [
    {
      "id": 2,
      "collection_type": "18k",
      "category": "Rings",
      "category_url": "rings",
      "image": "category-1716583000.jpg",
      "created_at": "2026-05-24T12:00:00.000Z",
      "updated_at": "2026-05-24T12:00:00.000Z"
    }
  ]
}
```

---

### Get Subcategories
Retrieves subcategories under a specific gold collection type and category.
* **Method:** `GET`
* **Path:** `/api/subcategories`
* **Query Parameters (Required):**
  * `collection_type` (String) – `18k` or `22k`
  * `category_id` (Number) – Category ID
* **Success Response (200 OK):**
```json
{
  "success": true,
  "collection_type": "18k",
  "category_id": 2,
  "items": [
    {
      "id": 4,
      "category_id": 2,
      "category_name": "Rings",
      "collection_type": "18k",
      "category": "Rings",
      "subcategory_url": "engagement-rings",
      "image": "/uploads/jewellery/sub-1716583200.jpg",
      "created_at": "2026-05-24T12:00:00.000Z",
      "updated_at": "2026-05-24T12:00:00.000Z"
    }
  ]
}
```

---

### Get Product Subcategories by Category ID
Retrieves all subcategories mapped to a category ID.
* **Method:** `GET`
* **Path:** `/api/product-subcategories`
* **Query Parameters (Required):**
  * `category_id` (Number)
* **Success Response (200 OK):**
```json
{
  "success": true,
  "category_id": 2,
  "subcategories": [
    {
      "id": 4,
      "category_id": 2,
      "subcategory_name": "Engagement Rings",
      "created_at": "2026-05-24T12:00:00.000Z"
    }
  ]
}
```

---

### Get Jewels Showcase
Get curated showcase jewellery items grouped under collection types (`18k` or `22k`).
* **Method:** `GET`
* **Path:** `/api/jewels`
* **Query Parameters (Required):**
  * `collection_type` (String) – `18k` or `22k`
* **Success Response (200 OK):**
```json
{
  "success": true,
  "collection_type": "22k",
  "items": [
    {
      "id": 5,
      "collection_type": "22k",
      "category": "Necklace",
      "collection_url": "necklaces",
      "image": "/uploads/jewellery/neck-1716583500.jpg",
      "created_at": "2026-05-24T12:00:00.000Z",
      "updated_at": "2026-05-24T12:00:00.000Z"
    }
  ]
}
```

---

## 📅 Events & Exhibitions

### Get All Events
Get a list of upcoming or past jewellery exhibitions and showcase events.
* **Method:** `GET`
* **Path:** `/api/events`
* **Success Response (200 OK):**
```json
{
  "success": true,
  "items": [
    {
      "id": 1,
      "title": "Zar Jewels Summer Expo 2026",
      "location": "Mumbai Exhibition Centre",
      "start_date": "2026-06-10",
      "end_date": "2026-06-15",
      "description": "Showcase of bespoke premium gold jewellery.",
      "event_url": "zar-expo-2026",
      "status": "upcoming",
      "event_images": [
        "/uploads/events/banner-1716584900.jpg"
      ],
      "created_at": "2026-05-24T12:00:00.000Z",
      "updated_at": "2026-05-24T12:00:00.000Z"
    }
  ]
}
```

---

### Get Single Event Details
* **Method:** `GET`
* **Path:** `/api/events/:id` (Replace `:id` with event number)

---

## ✉️ Contact & Inquiries

### Submit Contact Inquiry
Submit a customer inquiry message directly to the admin dashboard database.
* **Method:** `POST`
* **Path:** `/api/contact`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "name": "Alice Smith",
  "company": "Design House LLC (Optional)",
  "email": "alice@designhouse.com",
  "phone": "+919988776655",
  "subject": "Custom Bangle Making",
  "message": "Hello, I am interested in placing an order for bespoke 22k gold bangles."
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Your message has been received."
}
```

---

## 🖼️ Media & Static Assets

All image routes returned in the API responses are relative paths. To construct the fully qualified image URL in the storefront code, append the relative path to the base domain:

* **Product Images:** `https://testintelliworkz.tech/Zar_backend/uploads/products/<image_name>`
* **Event Images:** `https://testintelliworkz.tech/Zar_backend/uploads/events/<image_name>`
* **Jewellery Showcase Images:** `https://testintelliworkz.tech/Zar_backend/uploads/jewellery/<image_name>`

---

## 💻 System Health Check

Verify whether the API server is healthy and responding.
* **Method:** `GET`
* **Path:** `/api/health`
* **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Zar jewels backend is running."
}
```
