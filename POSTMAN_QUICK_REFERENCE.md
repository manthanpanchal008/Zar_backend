# Zar Backend API - Quick Reference

## 🚀 Getting Started with Postman

### Step 1: Import Collection
```
Postman → Import → Select "Zar-Backend-API.postman_collection.json"
```

### Step 2: Import Environment
```
Postman → Manage Environments → Import → Select "Zar-Backend-Dev-Environment.postman_environment.json"
```

### Step 3: Select Environment
```
Environment Dropdown (top-right) → Select "Zar Backend - Development"
```

---

## 📋 API Endpoints Quick List

### PUBLIC ENDPOINTS (No Auth Required)

#### Health Check
```
GET /api/health
```

#### Jewelry Collections
```
GET /api/jewels?collection_type=18k
GET /api/jewels?collection_type=22k
```

#### Product Categories
```
GET /api/product-categories
GET /api/product-categories?collection_type=18k
```

#### Products
```
GET /api/products
GET /api/products?category_id=1
GET /api/products?category_id=1&subcategory_id=5
GET /api/products/:id
```

#### Subcategories
```
GET /api/subcategories?collection_type=18k&category_id=1
GET /api/product-subcategories?category_id=1
```

#### Events
```
GET /api/events
GET /api/events/:id
```

#### Contact Form
```
POST /api/contact
```

---

### PROTECTED ENDPOINTS (Authentication Required)

#### Current User
```
GET /api/me
```

#### Users (Admin Only)
```
GET /api/users
```

#### Contacts (Admin Only)
```
GET /api/contacts
```

---

## 🔗 Variable Quick Reference

| Variable | Value | Used In |
|----------|-------|---------|
| `BASE_URL` | http://localhost:5000 | All endpoints |
| `PRODUCT_ID` | 1 | Product detail requests |
| `EVENT_ID` | 1 | Event detail requests |
| `CATEGORY_ID` | 1 | Filter requests |
| `SUBCATEGORY_ID` | 1 | Filter requests |
| `COLLECTION_TYPE` | 18k | Jewelry requests |

**Usage in Postman:**
```
{{BASE_URL}}/api/products/{{PRODUCT_ID}}
{{BASE_URL}}/api/products?category_id={{CATEGORY_ID}}
```

---

## 📤 Sample Request Bodies

### Contact Form
```json
{
  "name": "John Doe",
  "company": "ABC Corp",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "subject": "Product Inquiry",
  "message": "I am interested in your jewelry collection."
}
```

---

## 📥 Sample Responses

### All Products
```json
{
  "success": true,
  "category": null,
  "category_id": null,
  "subcategory_id": null,
  "items": [
    {
      "id": 1,
      "category_id": 1,
      "category_name": "Rings",
      "subcategory_id": 5,
      "subcategory_name": "Diamond Rings",
      "title": "Classic Diamond Ring",
      "collection_name": "Spring 2026",
      "product_images": ["/uploads/products/ring.jpg"],
      "created_at": "2026-05-01T10:00:00.000Z"
    }
  ]
}
```

### Single Product
```json
{
  "success": true,
  "product": {
    "id": 1,
    "title": "Classic Diamond Ring",
    "category_id": 1,
    "category_name": "Rings",
    "product_images": ["/uploads/products/ring.jpg"],
    "weight_specifications": [{"label": "Gross Weight", "value": "5.5 grams"}],
    "technical_specifications": [{"feature": "Metal Purity", "details": "18K"}]
  }
}
```

### All Events
```json
{
  "success": true,
  "items": [
    {
      "id": 1,
      "title": "Summer Launch",
      "location": "New York",
      "start_date": "2026-06-15",
      "status": "upcoming",
      "event_images": ["/uploads/events/summer.jpg"]
    }
  ]
}
```

### Single Event
```json
{
  "success": true,
  "event": {
    "id": 1,
    "title": "Summer Launch",
    "location": "New York",
    "start_date": "2026-06-15",
    "end_date": "2026-06-17",
    "description": "Unveiling our new collection",
    "status": "upcoming",
    "event_images": ["/uploads/events/summer.jpg"]
  }
}
```

---

## ⚙️ Filter Combinations

### Get All 18K Products by Category
```
GET /api/jewels?collection_type=18k
→ GET /api/product-categories?collection_type=18k
→ GET /api/products?category_id={{selected_category_id}}
```

### Get Products by Jewelry Type
```
GET /api/subcategories?collection_type=18k&category_id=1
→ GET /api/products?category_id=1&subcategory_id={{selected_subcategory_id}}
```

### Get Specific Product Details
```
GET /api/products/{{PRODUCT_ID}}
```

---

## ✅ Common Test Scenarios

### Test 1: Browse Homepage Products
```
1. GET /api/products
   ✓ Should return all products with images
```

### Test 2: Browse 18K Collections
```
1. GET /api/jewels?collection_type=18k
2. GET /api/product-categories?collection_type=18k
3. GET /api/subcategories?collection_type=18k&category_id=1
4. GET /api/products?category_id=1&subcategory_id=1
   ✓ All should return relevant data
```

### Test 3: Submit Contact Form
```
1. POST /api/contact
   Body: { name, email, phone, subject, message }
   ✓ Should return success message
```

### Test 4: View Events
```
1. GET /api/events
   ✓ Should return all events
2. GET /api/events/1
   ✓ Should return single event with images
```

---

## 🔍 Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | OK | Success ✓ |
| 400 | Bad Request | Check parameters |
| 401 | Unauthorized | Login required |
| 403 | Forbidden | Admin access required |
| 404 | Not Found | ID doesn't exist |
| 500 | Server Error | Server issue |

---

## 🎯 Usage Pattern

### Frontend Developer Workflow
```
1. Open Postman
2. Select "Zar Backend - Development" environment
3. Navigate to desired endpoint folder
4. Click on request
5. Verify parameters in Params tab
6. Click "Send"
7. Review response in Response pane
8. Copy response for reference
```

### URL Construction Pattern
```
[BASE_URL]/api/[ENDPOINT]?[PARAM1]=[VALUE1]&[PARAM2]=[VALUE2]

Example:
http://localhost:5000/api/products?category_id=1&subcategory_id=5
```

---

## 📱 Frontend Integration Checklist

- [ ] Test all endpoints in Postman first
- [ ] Note image URL paths: `/uploads/{type}/{filename}`
- [ ] Handle `success: true` flag in responses
- [ ] Implement error handling for failed requests
- [ ] Cache responses where appropriate
- [ ] Test with different category/subcategory combinations
- [ ] Validate image URLs load properly
- [ ] Test contact form submission
- [ ] Verify event dates and status values
- [ ] Handle null/empty fields gracefully

---

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 404 on request | Verify endpoint path spelling |
| Missing data | Ensure required parameters are provided |
| CORS error | Should not happen in Postman (use dev server instead) |
| Timeout | Check if backend server is running |
| Invalid collection_type | Use only `18k` or `22k` (lowercase) |
| Empty response | Check query parameters |

---

## 📚 Files Included

1. **Zar-Backend-API.postman_collection.json** - Main API collection
2. **Zar-Backend-Dev-Environment.postman_environment.json** - Development environment
3. **POSTMAN_COLLECTION_GUIDE.md** - Detailed guide (this file)
4. **POSTMAN_QUICK_REFERENCE.md** - Quick reference (this file)
5. **EVENTS_API_DOCUMENTATION.md** - Events API details

---

## 🔄 Environment Setup Commands

### For Development
```
1. Import both .json files into Postman
2. Select "Zar Backend - Development" environment
3. Verify BASE_URL = http://localhost:5000
4. Start your Node.js server
5. Test /api/health endpoint
```

### For Production
```
1. Create new environment "Zar Backend - Production"
2. Set BASE_URL to your production domain
3. Update any API keys/tokens if needed
4. Switch environment before testing
```

---

## 💡 Pro Tips

✨ **Use Postman Pre-request Scripts**
```
Set dynamic values before each request
```

✨ **Use Postman Tests**
```
Validate responses automatically
```

✨ **Use Collections Folder Organization**
```
Group related requests together
```

✨ **Save Requests as Templates**
```
Reuse common request patterns
```

✨ **Document Response Times**
```
Monitor API performance
```

✨ **Export Postman Data**
```
Share with team members
```

---

**Last Updated:** 2026-05-21  
**API Version:** 1.0.0  
**Backend Port:** 5000
