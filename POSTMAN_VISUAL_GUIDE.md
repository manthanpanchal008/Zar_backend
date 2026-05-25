# 🎨 Postman Collection - Visual Guide

## File Organization

```
ROOT DIRECTORY (/zar)
│
├── 📦 POSTMAN COLLECTION FILES
│   ├── Zar-Backend-API.postman_collection.json
│   └── Zar-Backend-Dev-Environment.postman_environment.json
│
├── 📚 DOCUMENTATION FILES
│   ├── README_POSTMAN_PACKAGE.md ← START HERE
│   ├── POSTMAN_SETUP_README.md
│   ├── POSTMAN_QUICK_REFERENCE.md
│   ├── POSTMAN_COLLECTION_GUIDE.md
│   └── EVENTS_API_DOCUMENTATION.md
│
└── [Other project files...]
```

---

## 📥 Import Process (Visual)

```
Postman App
    ↓
File Menu
    ↓
Import
    ↓
Select File
    ↓
Choose: Zar-Backend-API.postman_collection.json
    ↓
✅ Collection Imported
    ↓
Repeat for: Zar-Backend-Dev-Environment.postman_environment.json
    ↓
✅ Environment Imported
```

---

## 🗺️ Collection Structure (Tree View)

```
📦 Zar Jewels Backend API
│
├── 🔧 Health & Auth
│   ├── GET /api/health
│   └── GET /api/me
│
├── 💎 Collections Jewellery
│   ├── GET /api/jewels
│   ├── GET /api/product-categories
│   └── GET /api/subcategories
│
├── 🛍️ Products
│   ├── GET /api/products
│   ├── GET /api/products (by category)
│   ├── GET /api/products (by category ID)
│   ├── GET /api/products (by category & subcategory)
│   ├── GET /api/product-subcategories
│   └── GET /api/products/:id
│
├── 📅 Events
│   ├── GET /api/events
│   └── GET /api/events/:id
│
├── 📬 Contacts
│   ├── GET /api/contacts (Admin)
│   └── POST /api/contact
│
└── 👥 Admin
    └── GET /api/users (Admin)
```

---

## 🔄 Typical Frontend Flow

```
┌─────────────────────────────────┐
│ Frontend Development            │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ 1. Import Postman Collection    │
│    (5 minutes)                  │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ 2. Read Setup Guide             │
│    (5 minutes)                  │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ 3. Test Endpoints               │
│    (10 minutes)                 │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ 4. Review Response Format       │
│    (10 minutes)                 │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ 5. Implement in Frontend        │
│    (varies)                     │
└────────┬────────────────────────┘
         │
         ↓
✅ Done!
```

---

## 📊 Endpoint Reference Chart

```
┌────────────────────────────────────────────────────────────┐
│                    API ENDPOINTS                           │
├────────────────────────────────────────────────────────────┤
│ Category     │ Count │ Auth │ Examples                     │
├──────────────┼───────┼──────┼──────────────────────────────┤
│ Health       │   2   │  ❌  │ /health, /me                 │
│ Jewelry      │   3   │  ❌  │ /jewels, /categories         │
│ Products     │   6   │  ❌  │ /products, /products/:id     │
│ Events       │   2   │  ❌  │ /events, /events/:id         │
│ Contacts     │   2   │  ⚠️  │ /contact (POST), /contacts   │
│ Admin        │   1   │  ✅  │ /users                       │
├──────────────┼───────┼──────┼──────────────────────────────┤
│ TOTAL        │  16   │      │                              │
└────────────────────────────────────────────────────────────┘

Legend: ❌ No Auth  ⚠️  Public POST  ✅ Admin Only
```

---

## 🎯 Using Postman - Step by Step

```
Step 1: Open Postman
┌─────────────────────────────┐
│  Postman App                │
│  ┌───────────────────────┐  │
│  │  [Collections]        │  │
│  │  [Environments] ✓     │  │
│  │  [History]            │  │
│  │  [Variables]          │  │
│  └───────────────────────┘  │
└─────────────────────────────┘

Step 2: Select Endpoint
┌─────────────────────────────┐
│  Collections                │
│  ├─ Health & Auth           │
│  ├─ Products ✓              │
│  │  ├─ Get All Products ✓   │
│  │  ├─ Get By ID            │
│  │  └─ ...                  │
│  └─ ...                     │
└─────────────────────────────┘

Step 3: Check Method & URL
┌─────────────────────────────┐
│  [GET] ↓  ✓ {{BASE_URL}}   │
│  /api/products              │
│                             │
│  Params: [...]              │
│  Headers: [...]             │
│  Body: (none)               │
└─────────────────────────────┘

Step 4: Add Params (if needed)
┌─────────────────────────────┐
│  Key: category_id           │
│  Value: 1                   │
│  ✓ Enabled                  │
└─────────────────────────────┘

Step 5: Send Request
┌─────────────────────────────┐
│         [Send] ►            │
└─────────────────────────────┘

Step 6: Review Response
┌─────────────────────────────┐
│  Status: 200 OK             │
│  Time: 45ms                 │
│                             │
│  {                          │
│    "success": true,         │
│    "items": [...]           │
│  }                          │
└─────────────────────────────┘
```

---

## 🔗 Request URL Patterns

```
Basic Pattern:
[METHOD] [BASE_URL]/api/[ENDPOINT]

With Parameters:
[METHOD] [BASE_URL]/api/[ENDPOINT]?param1=value1&param2=value2

With Path Parameters:
[METHOD] [BASE_URL]/api/[ENDPOINT]/[ID]

Examples:

Simple:
GET http://localhost:5000/api/products
GET http://localhost:5000/api/events

With Query Params:
GET http://localhost:5000/api/products?category_id=1
GET http://localhost:5000/api/jewels?collection_type=18k

With Path Params:
GET http://localhost:5000/api/products/5
GET http://localhost:5000/api/events/2

With Multiple Params:
GET http://localhost:5000/api/products?category_id=1&subcategory_id=5
```

---

## 📱 Response Format Diagram

```
API Response Structure:

Success Response:
┌──────────────────────────┐
│ {                        │
│   "success": true,       │ ← Always check this
│   "items": [...],        │ ← Data array
│   "category_id": 1,      │ ← Metadata
│   "error": null          │ ← Error message (if any)
│ }                        │
└──────────────────────────┘

Error Response:
┌──────────────────────────┐
│ {                        │
│   "success": false,      │
│   "error": "Not found"   │ ← Error description
│ }                        │
└──────────────────────────┘

Single Item Response:
┌──────────────────────────┐
│ {                        │
│   "success": true,       │
│   "product": {           │
│     "id": 1,             │
│     "title": "...",      │
│     "images": [...]      │
│   }                      │
│ }                        │
└──────────────────────────┘
```

---

## 📈 Performance Guide

```
Expected Response Times:

GET /api/products          : 100-200ms
GET /api/products/:id      : 50-100ms
GET /api/events            : 50-100ms
GET /api/categories        : 50-100ms
GET /api/subcategories     : 100-150ms
POST /api/contact          : 200-500ms

Slow Response?
┌─────────────────────────────┐
│ 1. Check database query time│
│ 2. Check network latency    │
│ 3. Check server load        │
│ 4. Review filters/params    │
│ 5. Check image loading      │
└─────────────────────────────┘
```

---

## 🎬 Frontend Integration Sequence

```
┌────────┐
│ Page   │
│ Loads  │
└───┬────┘
    │
    ├─► GET /api/products ───────┐
    │                             │
    ├─► GET /api/events ─────┐    │
    │                         │    │
    └─► GET /api/jewels ─┐   │    │
                         │    │    │
                         ↓    ↓    ↓
                    Responses Ready
                         │
                         ↓
                    Parse JSON
                         │
                         ↓
                    Store in State
                         │
                         ↓
                    Render UI
                         │
                         ↓
                    ✅ Page Complete
```

---

## 🛡️ Error Handling Flow

```
Make Request
    │
    ↓
Response Received?
    ├─ NO  ─→ Network Error ─→ Retry/Fallback
    │
    └─ YES ─→ Check Status Code
         │
         ├─ 200 ─→ Parse JSON
         │         │
         │         ├─ success: true ─→ Use Data
         │         │
         │         └─ success: false ─→ Show Error
         │
         ├─ 400 ─→ Bad Request ─→ Check Parameters
         ├─ 401 ─→ Unauthorized ─→ Login Required
         ├─ 404 ─→ Not Found ─→ Show "Not Found"
         └─ 500 ─→ Server Error ─→ Retry Later
```

---

## 📚 Documentation Lookup Flow

```
I need to...
    │
    ├─ Get started quickly?
    │  └─ Read: POSTMAN_SETUP_README.md (5 min)
    │
    ├─ Find endpoint quickly?
    │  └─ Use: POSTMAN_QUICK_REFERENCE.md (1 min)
    │
    ├─ Learn the API deeply?
    │  └─ Read: POSTMAN_COLLECTION_GUIDE.md (15 min)
    │
    ├─ Understand Events API?
    │  └─ Read: EVENTS_API_DOCUMENTATION.md (10 min)
    │
    └─ Import into Postman?
       └─ Use: .postman_collection.json file
```

---

## 🔐 Authentication Status

```
Public Endpoints (✅ No Auth):
  ├─ GET /api/products
  ├─ GET /api/events
  ├─ GET /api/jewels
  ├─ GET /api/health
  └─ POST /api/contact

Protected Endpoints (🔒 Auth Required):
  ├─ GET /api/me (any user)
  ├─ GET /api/users (admin)
  └─ GET /api/contacts (admin)
```

---

## 💾 Variable Reference

```
Global Variables (In Postman):

{{BASE_URL}}           http://localhost:5000
{{PRODUCT_ID}}         1
{{EVENT_ID}}           1
{{CATEGORY_ID}}        1
{{SUBCATEGORY_ID}}     1
{{COLLECTION_TYPE}}    18k
{{TIMEOUT}}            5000

Usage:
GET {{BASE_URL}}/api/products/{{PRODUCT_ID}}
     ↑ Resolves to ↑
GET http://localhost:5000/api/products/1
```

---

## ✨ Collection Summary

```
📊 Statistics:
  • Total Endpoints: 15+
  • Public Endpoints: 12
  • Protected Endpoints: 3
  • Request Methods: 2 (GET, POST)
  • Documentation Files: 5
  • Total Lines of Doc: 5000+

🎯 Coverage:
  • Collections Jewellery: ✅
  • Products: ✅
  • Events: ✅
  • Contacts: ✅
  • Users: ✅
  • Health Check: ✅

📅 Status:
  • Created: 2026-05-21
  • Version: 1.0.0
  • Ready: ✅ Production
```

---

## 🚀 Quick Start Path

```
0 min  : Download package
         │
5 min  : Import JSON files
         │
10 min : Read POSTMAN_SETUP_README.md
         │
15 min : Test 3-4 endpoints
         │
20 min : Review response format
         │
25 min : Ready to integrate!
```

---

## 📞 Need Help?

```
Question?              Solution
───────────────────────────────────────────
"How do I start?"     → POSTMAN_SETUP_README.md
"Which endpoint...?"  → POSTMAN_QUICK_REFERENCE.md
"How does this work?" → POSTMAN_COLLECTION_GUIDE.md
"Tell me about..."    → EVENTS_API_DOCUMENTATION.md
"Got an error"        → Check Troubleshooting section
```

---

**Visual Guide Complete** ✅

Ready to use your Postman collection!
