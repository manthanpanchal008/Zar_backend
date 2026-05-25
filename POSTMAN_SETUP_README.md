# Postman API Collection - Complete Setup Guide

## 📦 What's Included

This package contains everything you need to test and integrate with the Zar Jewels Backend API using Postman.

### Files

1. **Zar-Backend-API.postman_collection.json** (12KB)
   - Complete API collection with all endpoints
   - Organized by feature (Health, Collections, Products, Events, Contacts, Admin)
   - Pre-configured with variable placeholders
   - Ready to import into Postman

2. **Zar-Backend-Dev-Environment.postman_environment.json** (1.3KB)
   - Development environment configuration
   - Pre-set variables for common use cases
   - Customizable for your setup

3. **POSTMAN_QUICK_REFERENCE.md**
   - Single-page quick reference guide
   - Common endpoints and usage patterns
   - Response examples and quick tips

4. **POSTMAN_COLLECTION_GUIDE.md**
   - Comprehensive documentation (11KB)
   - Detailed workflow examples
   - Frontend integration examples
   - Troubleshooting guide

---

## ⚡ Quick Start (3 Minutes)

### Step 1: Download the Collection Files
```
All files are located in the project root directory
```

### Step 2: Open Postman
Download from https://www.postman.com/downloads/ if you don't have it

### Step 3: Import Collection
```
Postman → File → Import 
→ Select "Zar-Backend-API.postman_collection.json"
→ Click "Import"
```

### Step 4: Import Environment
```
Postman → File → Import 
→ Select "Zar-Backend-Dev-Environment.postman_environment.json"
→ Click "Import"
```

### Step 5: Select Environment
```
Top-right dropdown → Select "Zar Backend - Development"
```

### Step 6: Test Health Check
```
Collections → Health & Auth → Health Check → Send
Should see: {"success": true, "message": "Zar jewels backend is running."}
```

✅ **Done!** You're ready to use the API

---

## 📖 Documentation Files

### For Quick Lookup
👉 **Use:** `POSTMAN_QUICK_REFERENCE.md`
- Single page
- All endpoints listed
- Common examples
- Fast access

### For Detailed Learning
👉 **Use:** `POSTMAN_COLLECTION_GUIDE.md`
- Complete documentation
- Workflows explained
- Integration examples
- Error handling
- Troubleshooting

---

## 🗂️ Collection Structure

```
Zar Jewels Backend API
├── Health & Auth
│   ├── Health Check (GET)
│   └── Get Current User (GET)
├── Collections Jewellery
│   ├── Get All Jewels by Collection Type (GET)
│   ├── Get Product Categories (GET)
│   └── Get Subcategories by Category (GET)
├── Products
│   ├── Get All Products (GET)
│   ├── Get Products by Category Name (GET)
│   ├── Get Products by Category ID (GET)
│   ├── Get Products by Category & Subcategory (GET)
│   ├── Get Product Subcategories (GET)
│   └── Get Product by ID (GET)
├── Events
│   ├── Get All Events (GET)
│   └── Get Event by ID (GET)
├── Contacts
│   ├── Get All Contacts - Admin Only (GET)
│   └── Submit Contact Form (POST)
└── Admin
    └── Get All Users - Admin Only (GET)
```

---

## 🎯 Common Workflows

### Workflow 1: Fetch Homepage Data
```
1. GET /api/products              (All products)
2. GET /api/events                (All events)
3. GET /api/jewels?collection_type=18k
```

### Workflow 2: Browse 18K Collections
```
1. GET /api/jewels?collection_type=18k
2. GET /api/product-categories?collection_type=18k
3. GET /api/subcategories?collection_type=18k&category_id=1
4. GET /api/products?category_id=1&subcategory_id=1
```

### Workflow 3: Get Single Product Details
```
1. GET /api/products/1            (Replace 1 with product ID)
```

### Workflow 4: View Events
```
1. GET /api/events                (All events)
2. GET /api/events/1              (Single event, replace 1 with event ID)
```

### Workflow 5: Submit Contact Form
```
1. POST /api/contact
   Body: {
     "name": "John",
     "email": "john@example.com",
     "phone": "+1-555-0123",
     "subject": "Inquiry",
     "message": "Your message"
   }
```

---

## 🔧 Configuration

### Verify Base URL
```
In Postman:
Collections → Select any request → Params tab
Should show: {{BASE_URL}} = http://localhost:5000
```

### Update for Production
```
If using production server:
1. Environment dropdown (top-right) → Manage Environments
2. Edit "Zar Backend - Development"
3. Change BASE_URL to your production URL
4. Click Save
```

### Update Port (if needed)
```
If your server runs on different port (e.g., 3000):
1. Environment dropdown → Edit current environment
2. Change BASE_URL to http://localhost:3000
3. Save
```

---

## 📊 API Statistics

| Category | Count |
|----------|-------|
| Public Endpoints | 12 |
| Protected Endpoints | 3 |
| Total Endpoints | 15 |
| Collection Groups | 6 |

### Endpoint Breakdown
- GET requests: 14
- POST requests: 1
- DELETE requests: 0
- PUT/PATCH requests: 0

---

## 🚀 Testing Checklist

### Before Frontend Development
- [ ] Import collection and environment
- [ ] Select correct environment
- [ ] Test health check endpoint
- [ ] Test /api/products endpoint
- [ ] Test /api/events endpoint
- [ ] Test product filter endpoints
- [ ] Test event detail endpoint
- [ ] Test contact form submission
- [ ] Verify image URLs in responses
- [ ] Check response times

### Before Production
- [ ] All endpoints tested ✓
- [ ] Environment set to production
- [ ] Error handling verified
- [ ] Response format validated
- [ ] Images loading correctly
- [ ] Authentication working (if needed)

---

## 🔗 Example Usage in Frontend

### Vanilla JavaScript
```javascript
// Get all products
fetch('http://localhost:5000/api/products')
  .then(res => res.json())
  .then(data => console.log(data.items));

// Get specific product
fetch('http://localhost:5000/api/products/1')
  .then(res => res.json())
  .then(data => console.log(data.product));
```

### React Hook
```javascript
const [products, setProducts] = useState([]);

useEffect(() => {
  fetch('/api/products')
    .then(res => res.json())
    .then(data => {
      if (data.success) setProducts(data.items);
    });
}, []);
```

### Vue.js
```javascript
data() {
  return { products: [] }
},
mounted() {
  fetch('/api/products')
    .then(res => res.json())
    .then(data => {
      if (data.success) this.products = data.items;
    });
}
```

### Axios
```javascript
axios.get('/api/products')
  .then(res => {
    if (res.data.success) {
      console.log(res.data.items);
    }
  })
  .catch(err => console.error(err));
```

---

## 🐛 Troubleshooting

### Issue: "Could not get any response"
**Solution:**
1. Check backend server is running
2. Verify BASE_URL in environment
3. Check port number (default: 5000)

### Issue: "Invalid or missing collection_type parameter"
**Solution:**
Use lowercase values: `18k` or `22k` (not `18K` or `22K`)

### Issue: 404 on Product ID
**Solution:**
1. First get all products: `GET /api/products`
2. Note a valid product ID
3. Use that ID in the endpoint

### Issue: Empty Response
**Solution:**
Check all required parameters are provided

### Issue: CORS Error
**Solution:**
This shouldn't happen in Postman. If using browser, check backend CORS configuration.

---

## 📱 Browser vs Postman

| Feature | Postman | Browser |
|---------|---------|---------|
| No auth needed | ✅ | ✅ |
| Easy testing | ✅ | ❌ |
| No CORS issues | ✅ | ❌ |
| Save requests | ✅ | ❌ |
| Share collections | ✅ | ❌ |
| Auto format JSON | ✅ | ❌ |

**Recommendation:** Use Postman for testing, browser for production

---

## 📚 Additional Resources

- **Postman Docs:** https://learning.postman.com/
- **API Documentation:** See `EVENTS_API_DOCUMENTATION.md`
- **Detailed Guide:** See `POSTMAN_COLLECTION_GUIDE.md`
- **Quick Reference:** See `POSTMAN_QUICK_REFERENCE.md`

---

## 📝 Notes for Team

### For Designers
Focus on API response structure, field names, and data types for UI design

### For Frontend Developers
Use this collection to test before implementing API calls in your code

### For Backend Developers
Update this collection when adding new endpoints

### For Product Managers
Use this to verify features are working as expected

### For QA Testers
Use collection to create test scenarios

---

## ✨ Pro Tips

1. **Use Pre-request Scripts**
   - Add timestamps
   - Generate test data
   - Set dynamic values

2. **Create Test Scripts**
   - Validate response structure
   - Check status codes
   - Verify data format

3. **Use Collections Runner**
   - Test multiple requests
   - Create test suites
   - Generate reports

4. **Export for Sharing**
   - Share with team
   - Document API
   - Create runbooks

5. **Version Control**
   - Track changes
   - Maintain history
   - Collaborate better

---

## 🎓 Learning Path

### Beginner
1. Import collection
2. Read Quick Reference
3. Test 5 endpoints
4. Try contact form

### Intermediate
1. Read Full Guide
2. Test all endpoints
3. Try different parameters
4. Check response times

### Advanced
1. Create pre-request scripts
2. Add test scripts
3. Create test collections
4. Build CI/CD integration

---

## 🆘 Getting Help

### Check Documentation
1. `POSTMAN_QUICK_REFERENCE.md` - Quick answers
2. `POSTMAN_COLLECTION_GUIDE.md` - Detailed help
3. `EVENTS_API_DOCUMENTATION.md` - Event details

### Common Questions
- **Which endpoint for products?** → `/api/products`
- **How to filter by category?** → Add `?category_id=1` parameter
- **How to get events?** → `GET /api/events`
- **How to submit contact?** → `POST /api/contact`

---

## 📋 Version Info

- **Collection Version:** 1.0.0
- **Created:** 2026-05-21
- **Backend API Version:** 1.0.0
- **Node.js Port:** 5000
- **Last Updated:** 2026-05-21

---

## 📄 License

Use this collection for the Zar Jewels project.

---

**Happy API Testing! 🎉**

For questions or issues, refer to the documentation files or contact the backend team.
