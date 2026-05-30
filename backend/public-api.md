# Zar Jewels - Public API Documentation

This document lists and details all public-facing API endpoints exposed by the Zar Jewels backend server. These endpoints are accessible by the public Zar Jewels storefront and do not require administrative JWT authentication headers.

---

## Base URL
* **Development**: `http://localhost:5001`
* **Production**: `https://testintelliworkz.tech/Zar_backend` (or your domain endpoint path)

---

## Authentication Requirements
No authorization headers are needed for these public routes. However, select form post routes are subject to strict rate-limiting per client IP.

---

## Public APIs

### 1. Health Check
* **Method**: `GET`
* **Endpoint**: `/api/health`
* **Description**: Verifies if the backend API service is running.
* **Request Body**: None
* **Query Parameters**: None
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Zar jewels backend is running."
  }
  ```
* **Error Response (500)**: Server-side failure message.

---

### 2. Submit Contact Us Message (Legacy)
* **Method**: `POST`
* **Endpoint**: `/api/contact`
* **Description**: Submits a contact inquiry to be logged into the database.
* **Request Body**: `application/json`
  * `name` (string, required): Full name.
  * `company` (string, optional): Company name.
  * `email` (string, required): Contact email.
  * `phone` (string, required): Contact phone number.
  * `subject` (string, required): Inquiry subject.
  * `message` (string, required): Message text.
* **Query Parameters**: None
* **Validation Rules**:
  * Fields `name`, `email`, `phone`, `subject`, `message` are required.
  * `email` must match regex `/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/`.
  * `phone` must match regex `/^[0-9+\-()\s]{7,30}$/`.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Your message has been received."
  }
  ```
* **Error Response (400 Bad Request)**:
  ```json
  {
    "error": "Please provide a valid email address."
  }
  ```

---

### 3. Get Jewels Collections
* **Method**: `GET`
* **Endpoint**: `/api/jewels`
* **Description**: Returns collections filtered by karat standard (internally checks the `gold_types` table).
* **Request Body**: None
* **Query Parameters**:
  * `collection_type` or `karat` (string, required): Must be either `18k` or `22k`.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "collection_type": "22k",
    "items": [
      {
        "id": 1,
        "collection_type": "22k",
        "category": "Bangles",
        "collection_url": "",
        "image": "/uploads/jewellery/1779738015295-18k_menu.png",
        "created_at": "2026-05-25T19:40:15.000Z",
        "updated_at": "2026-05-25T19:40:15.000Z"
      }
    ]
  }
  ```
* **Error Response (400 Bad Request)**:
  ```json
  {
    "error": "Invalid or missing collection_type parameter. Use 18k or 22k."
  }
  ```

---

### 4. Get Product Categories Selector
* **Method**: `GET`
* **Endpoint**: `/api/product-categories`
* **Description**: Gets all category records formatted for collection filter views.
* **Request Body**: None
* **Query Parameters**:
  * `collection_type` (string, optional): Filter by `18k` or `22k` to narrow results.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "categories": [
      {
        "id": 1,
        "category": "22K",
        "collection_type": "22k"
      }
    ]
  }
  ```

---

### 5. Get Subcategories List
* **Method**: `GET`
* **Endpoint**: `/api/subcategories`
* **Description**: Returns subcategories associated with a given karat type and parent category ID.
* **Request Body**: None
* **Query Parameters**:
  * `collection_type` or `karat` (string, required): Must be `18k` or `22k`.
  * `category_id` (number, required): Parent category ID.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "collection_type": "18k",
    "category_id": 1,
    "items": [
      {
        "id": 2,
        "category_id": 1,
        "category_name": "",
        "collection_type": "18k",
        "category": "Plain",
        "subcategory_url": "plain",
        "image": "/uploads/jewellery/1779731386220-Screenshot.png",
        "created_at": "2026-05-18T09:55:23.000Z",
        "updated_at": "2026-05-25T17:49:46.000Z"
      }
    ]
  }
  ```

---

### 6. Get Product Subcategories Selector
* **Method**: `GET`
* **Endpoint**: `/api/product-subcategories`
* **Description**: Lists categories to display as sub-filters in product menus.
* **Request Body**: None
* **Query Parameters**:
  * `category_id` (number, required): Parent category ID.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "category_id": 1,
    "subcategories": [
      {
        "id": 1,
        "category": "Bangles & Bracelet"
      }
    ]
  }
  ```

---

### 7. Get Products List
* **Method**: `GET`
* **Endpoint**: `/api/products`
* **Description**: Fetches products, supporting multiple layers of filtering.
* **Request Body**: None
* **Query Parameters**:
  * `category` (string, optional): Filter by category name slug.
  * `category_id` (number, optional): Filter by category ID.
  * `subcategory_id` (number, optional): Filter by subcategory ID.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "category": null,
    "category_id": null,
    "subcategory_id": null,
    "items": [
      {
        "id": 1,
        "category_id": null,
        "category_name": null,
        "subcategory_id": 1,
        "subcategory_name": null,
        "title": "Design No. BAPL22K01",
        "collection_name": "BAPL-22K-001",
        "short_description": "earring design description",
        "number_of_pcs": 2,
        "display_finish": "Rose+White+Gold",
        "weight_specifications": [
          { "label": "Gross Weight:", "value": "5.00 grams" }
        ],
        "technical_specifications": [
          { "feature": "Metal Purity", "details": "Standard 22KT" }
        ],
        "manufacturing_support": "HTML String content...",
        "product_url": "BAPL22K01",
        "product_images": [
          "/uploads/products/prod-3.webp"
        ],
        "created_at": "2026-05-15T09:17:03.000Z",
        "updated_at": "2026-05-25T19:22:01.000Z"
      }
    ]
  }
  ```

---

### 8. Get Product Detail
* **Method**: `GET`
* **Endpoint**: `/api/products/:id`
* **Description**: Retrieves single product information by ID.
* **Request Body**: None
* **Query Parameters**: None
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "product": {
      "id": 1,
      ...
    }
  }
  ```
* **Error Response (404 Not Found)**:
  ```json
  {
    "error": "Product not found."
  }
  ```

---

### 9. Get Events List
* **Method**: `GET`
* **Endpoint**: `/api/events`
* **Description**: Returns all exhibition shows and events (upcoming and past).
* **Request Body**: None
* **Query Parameters**: None
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "items": [
      {
        "id": 1,
        "title": "Watch and Jewellery Show Sharjah",
        "location": "Sharjah, UAE.",
        "start_date": "2026-05-01",
        "end_date": "2026-05-04",
        "description": "Show details...",
        "event_url": "/event/watch-and-jewellery-show-sharjah",
        "status": "past",
        "event_images": [
          "/uploads/events/icon-1.png"
        ],
        "created_at": "2026-05-06T11:58:40.000Z",
        "updated_at": "2026-05-25T17:35:52.000Z"
      }
    ]
  }
  ```

---

### 10. Get Event Detail
* **Method**: `GET`
* **Endpoint**: `/api/events/:id`
* **Description**: Returns single event details by ID.
* **Request Body**: None
* **Query Parameters**: None
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "event": {
      "id": 1,
      ...
    }
  }
  ```

---

### 11. Get The Zar Journey Milestone Timeline
* **Method**: `GET`
* **Endpoint**: `/api/public/zar-journey`
* **Description**: Returns milestones in chronological order (sorted by year).
* **Request Body**: None
* **Query Parameters**: None
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "items": [
      {
        "id": 1,
        "year": 2020,
        "description": "Established...",
        "image": "/uploads/zar_journey/journey-1.webp",
        "created_at": "2026-05-25T17:00:00.000Z"
      }
    ]
  }
  ```

---

### 12. Submit Become a Partner Inquiry
* **Method**: `POST`
* **Endpoint**: `/api/build-connection`
* **Description**: Submits the B2B registration form. Triggers transactional emails to the client (User) and the company (Admin).
* **Rate Limit**: Max 5 submissions per 10 minutes per client IP.
* **Request Body**: `application/json` (all required except referredBy/companyWebsite/message)
  * `fullName` (string, required)
  * `companyName` (string, required)
  * `email` (string, required)
  * `country` (enum: `'India'`, `'Others'`, required)
  * `state` (string, required)
  * `city` (string, required)
  * `pincode` (string, required)
  * `contact` (string, required)
  * `category` (enum: `'Distributor'`, `'Retailers'`, `'Wholesaler'`, required)
  * `referredBy` (string, optional)
  * `companyWebsite` (string, optional)
  * `message` (string, optional)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Become a Partner inquiry submitted successfully."
  }
  ```

---

### 13. Submit Contact Inquiry
* **Method**: `POST`
* **Endpoint**: `/api/contact-inquiry`
* **Description**: Submits the general contact form, saving records in `contact_inquiries`. Triggers Nodemailer alerts to Admin and user receipt.
* **Rate Limit**: Max 5 submissions per 10 minutes per client IP.
* **Request Body**: `application/json`
  * `fullName` (string, required)
  * `companyName` (string, required)
  * `email` (string, required)
  * `contactNumber` (string, required)
  * `inquiryType` (string, required)
  * `message` (string, required)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Contact inquiry submitted successfully."
  }
  ```

---

### 14. Submit Career Application
* **Method**: `POST`
* **Endpoint**: `/api/career-application`
* **Description**: Submits career application and uploads CV file. Hashed and saved in `public/uploads/cvs/`. Triggers emails with the CV attached to the administrator.
* **Rate Limit**: Max 5 submissions per 10 minutes per client IP.
* **Request Body**: `multipart/form-data`
  * `fullName` (string, required)
  * `companyName` (string, required)
  * `role` (string, required)
  * `workExperience` (string, required)
  * `email` (string, required)
  * `contactNumber` (string, required)
  * `cvFile` (file, required): Acceptable formats are PDF, DOC, DOCX. Max file size: 5MB.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Career application submitted successfully."
  }
  ```
