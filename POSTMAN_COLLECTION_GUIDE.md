# Zar Jewels Backend API - Postman Collection Guide

## Overview
This guide explains how to import and use the Postman collection for testing and integrating with the Zar Jewels Backend API.

## Quick Start

### 1. Import the Collection

**Option A: Using Postman Desktop/Web**
1. Open Postman
2. Click **Import** (top-left corner)
3. Choose **File** tab
4. Select `Zar-Backend-API.postman_collection.json` from your project
5. Click **Import**

**Option B: Using Postman Web Link**
1. Open Postman (web or desktop)
2. Paste the collection file content or import from a GitHub raw link

### 2. Set the Base URL

Before making requests, configure the base URL:

1. In Postman, locate the **Variables** tab in the collection
2. Find the `BASE_URL` variable
3. Set its value to your server address:
   - **Local Development:** `http://localhost:5000`
   - **Production:** `https://api.example.com`
4. Click **Save**

Alternatively, set it per environment by creating an environment with these variables.

## API Endpoints Summary

### Health & Authentication
| Endpoint | Method | Auth Required | Description |
|----------|--------|---|-------------|
| `/api/health` | GET | No | Check server status |
| `/api/me` | GET | Yes | Get current user info |

### Collections Jewellery
| Endpoint | Method | Auth Required | Parameters | Description |
|----------|--------|---|---|-------------|
| `/api/jewels` | GET | No | `collection_type` (18k, 22k) | Get jewels by collection |
| `/api/product-categories` | GET | No | `collection_type` (optional) | List all categories |
| `/api/subcategories` | GET | No | `collection_type` (required), `category_id` (required) | Get subcategories |

### Products
| Endpoint | Method | Auth Required | Parameters | Description |
|----------|--------|---|---|-------------|
| `/api/products` | GET | No | Optional: `category`, `category_id`, `subcategory_id` | List products |
| `/api/products/:id` | GET | No | `id` (URL param) | Get single product |
| `/api/product-subcategories` | GET | No | `category_id` (required) | Get product subcategories |

### Events
| Endpoint | Method | Auth Required | Parameters | Description |
|----------|--------|---|---|-------------|
| `/api/events` | GET | No | None | List all events |
| `/api/events/:id` | GET | No | `id` (URL param) | Get single event |

### Contacts
| Endpoint | Method | Auth Required | Body | Description |
|----------|--------|---|---|-------------|
| `/api/contact` | POST | No | name, email, phone, subject, message | Submit contact form |
| `/api/contacts` | GET | Yes (Admin) | None | List all contacts |

### Admin
| Endpoint | Method | Auth Required | Description |
|----------|--------|---|-------------|
| `/api/users` | GET | Yes (Admin) | List all users |

---

## Common Workflows

### Workflow 1: Fetch All Products for Homepage
```
1. GET /api/products
   - Returns all products with images and specifications
```

### Workflow 2: Filter Products by Category
```
1. GET /api/product-categories
   - Get list of available categories
   
2. GET /api/products?category_id=1
   - Get products in that category
```

### Workflow 3: Browse Jewelry Collections
```
1. GET /api/jewels?collection_type=18k
   - Get all 18K gold jewelry
   
2. GET /api/product-categories?collection_type=18k
   - Get categories for 18K gold
   
3. GET /api/subcategories?collection_type=18k&category_id=1
   - Get subcategories
   
4. GET /api/products?category_id=1&subcategory_id=1
   - Get products in that subcategory
```

### Workflow 4: Get Event Details
```
1. GET /api/events
   - Get all upcoming/past events
   
2. GET /api/events/1
   - Get specific event details with images
```

---

## Response Examples

### Success Response Format
```json
{
  "success": true,
  "items": [...],
  "category": "Rings",
  "category_id": 1
}
```

### Error Response Format
```json
{
  "error": "Invalid or missing collection_type parameter. Use 18k or 22k."
}
```

### Product Response Example
```json
{
  "success": true,
  "items": [
    {
      "id": 1,
      "category_id": 1,
      "category_name": "Rings",
      "subcategory_id": 5,
      "subcategory_name": "Diamond Rings",
      "title": "Classic Diamond Ring",
      "collection_name": "Spring Collection 2026",
      "short_description": "Elegant diamond ring",
      "number_of_pcs": 1,
      "display_finish": "Polished",
      "weight_specifications": [
        {
          "label": "Gross Weight",
          "value": "5.5 grams"
        }
      ],
      "technical_specifications": [
        {
          "feature": "Metal Purity",
          "details": "18K"
        }
      ],
      "manufacturing_support": "In-house",
      "product_url": "https://example.com/product/1",
      "product_images": [
        "/uploads/products/diamond-ring-1.jpg",
        "/uploads/products/diamond-ring-2.jpg"
      ],
      "created_at": "2026-05-01T10:00:00.000Z",
      "updated_at": "2026-05-15T14:30:00.000Z"
    }
  ]
}
```

### Event Response Example
```json
{
  "success": true,
  "items": [
    {
      "id": 1,
      "title": "Summer Collection Launch",
      "location": "New York",
      "start_date": "2026-06-15",
      "end_date": "2026-06-17",
      "description": "Unveiling our latest summer jewelry collection",
      "event_url": "https://example.com/events/summer-launch",
      "status": "upcoming",
      "event_images": [
        "/uploads/events/summer-launch-1.jpg",
        "/uploads/events/summer-launch-2.jpg"
      ],
      "created_at": "2026-05-01T10:00:00.000Z",
      "updated_at": "2026-05-10T15:30:00.000Z"
    }
  ]
}
```

---

## Parameter Guide

### Collection Type
- **Values:** `18k` or `22k`
- **Usage:** Some endpoints require this to filter jewelry by gold purity

### Category ID
- **Type:** Integer
- **Usage:** Use to filter products, subcategories by specific category

### Subcategory ID
- **Type:** Integer
- **Usage:** Use to filter products within a category

### Contact Form Fields (POST /api/contact)
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| name | string | Yes | Non-empty |
| company | string | No | Any text |
| email | string | Yes | Valid email format |
| phone | string | Yes | 7-30 characters, numeric with symbols |
| subject | string | Yes | Non-empty |
| message | string | Yes | Non-empty |

---

## Environment Setup

### Create Development Environment
1. In Postman, click **Environments** → **Create**
2. Name it: `Zar Development`
3. Add variables:
   ```
   BASE_URL: http://localhost:5000
   ```
4. Select this environment from the dropdown

### Create Production Environment
1. Create a new environment named `Zar Production`
2. Add variables:
   ```
   BASE_URL: https://api.example.com
   ```

---

## Authentication

### Session-Based Authentication
Some endpoints require you to be logged in:
- `/api/me` - Get current user
- `/api/users` - Admin only
- `/api/contacts` - Admin only

**To authenticate:**
1. Log in through the web application first
2. The session cookie is automatically sent with requests
3. In Postman, ensure cookies are enabled in settings

### For API Token Auth (if implemented)
If token-based auth is added:
1. Get token from login endpoint
2. Add to request header: `Authorization: Bearer {{token}}`

---

## Error Handling

### Common Errors

**400 Bad Request**
- Invalid parameters
- Missing required fields
- Invalid format (e.g., invalid email)

**401 Unauthorized**
- Missing authentication
- Expired session

**403 Forbidden**
- Insufficient permissions (e.g., not admin)

**404 Not Found**
- Resource doesn't exist
- Invalid ID

**500 Internal Server Error**
- Server error
- Database issue

### Example Error Response
```json
{
  "error": "Invalid or missing collection_type parameter. Use 18k or 22k."
}
```

---

## Testing Tips

### 1. Test Collection Type Filter
```
GET /api/jewels?collection_type=18k
GET /api/jewels?collection_type=22k
```

### 2. Test Product Filters (all should work)
```
GET /api/products
GET /api/products?category_id=1
GET /api/products?category_id=1&subcategory_id=1
```

### 3. Test Contact Form
```
POST /api/contact
Body: {
  "name": "Test",
  "email": "test@example.com",
  "phone": "+1-555-0100",
  "subject": "Test",
  "message": "Test message"
}
```

### 4. Validate Image URLs
- All product images start with `/uploads/products/`
- All event images start with `/uploads/events/`
- All jewelry images start with `/uploads/jewellery/`

---

## Frontend Integration Example

### JavaScript/Fetch
```javascript
// Get all products
fetch('http://localhost:5000/api/products')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log(data.items);
    }
  });

// Get product by ID
fetch('http://localhost:5000/api/products/1')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log(data.product);
    }
  });
```

### React Example
```javascript
const [products, setProducts] = useState([]);

useEffect(() => {
  fetch('/api/products')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setProducts(data.items);
      }
    });
}, []);
```

### Vue Example
```javascript
export default {
  data() {
    return {
      products: []
    }
  },
  mounted() {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.products = data.items;
        }
      });
  }
}
```

---

## Troubleshooting

### Issue: "Invalid or missing collection_type parameter"
**Solution:** Ensure you're using `18k` or `22k` (lowercase)

### Issue: "Category ID must be provided"
**Solution:** When getting subcategories, always provide both `collection_type` and `category_id`

### Issue: 404 on product/event
**Solution:** Verify the ID exists by listing all items first

### Issue: CORS errors
**Solution:** This shouldn't happen in Postman, but ensure the backend has CORS enabled

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-05-21 | Initial collection with all endpoints |

---

## Support & Documentation

- **API Documentation:** See `EVENTS_API_DOCUMENTATION.md` for detailed event endpoint docs
- **Backend Repo:** [GitHub Link]
- **Issues:** Report bugs on GitHub Issues

---

## Tips for Success

✅ Always test endpoints in Postman before coding
✅ Use Collections to organize related requests
✅ Save reusable request templates
✅ Use environments to switch between dev/prod
✅ Document custom requests for team members
✅ Export and share collections with your team
✅ Check response times in Postman for performance issues
✅ Use test scripts to validate responses automatically

---

*Last Updated: 2026-05-21*
*API Version: 1.0.0*
