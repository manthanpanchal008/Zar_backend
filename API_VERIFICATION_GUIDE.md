# 🧪 API Fix Verification Guide

## Quick Test (2 minutes)

### Step 1: Restart Your Server
```
Kill the current server process
Re-run: npm start  or  node server.js
```

### Step 2: Test Events Endpoint

**Option A: Using Browser**
```
1. Open browser
2. Go to: http://localhost:4000/api/events
3. Should see JSON response with events data
```

**Option B: Using cURL**
```bash
curl http://localhost:4000/api/events
# Should return: {"success": true, "items": [...]}
```

**Option C: Using Postman**
```
1. Open Postman
2. GET http://localhost:4000/api/events
3. Click Send
4. Check response
```

---

## Complete Test Suite

### ✅ Test 1: Health Check (Always Works)
```
GET http://localhost:4000/api/health

Expected Response:
{
  "success": true,
  "message": "Zar jewels backend is running."
}
```

### ✅ Test 2: Get All Events (Main Fix)
```
GET http://localhost:4000/api/events

Expected Response:
{
  "success": true,
  "items": [
    {
      "id": 1,
      "title": "Event Title",
      "location": "Location",
      "start_date": "2026-06-15",
      "end_date": "2026-06-17",
      "description": "Description",
      "event_url": "url",
      "status": "upcoming",
      "event_images": ["/uploads/events/image.jpg"],
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}

Status Code: ✅ 200 OK
```

### ✅ Test 3: Get Single Event
```
GET http://localhost:4000/api/events/1

Expected Response:
{
  "success": true,
  "event": {
    "id": 1,
    "title": "Event Title",
    ...
  }
}

Status Code: ✅ 200 OK
```

### ✅ Test 4: Get All Products (Verify Other APIs Still Work)
```
GET http://localhost:4000/api/products

Expected: 200 OK with products array
```

### ✅ Test 5: Get Jewels by Collection
```
GET http://localhost:4000/api/jewels?collection_type=18k

Expected: 200 OK with jewelry array
```

### ✅ Test 6: Submit Contact Form (Public POST)
```
POST http://localhost:4000/api/contact

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "subject": "Test",
  "message": "Test message"
}

Expected Response:
{
  "success": true,
  "message": "Your message has been received..."
}

Status Code: ✅ 200 OK
```

---

## What to Check

### ✅ Response Status Codes
| Endpoint | Expected | Before | After |
|----------|----------|--------|-------|
| /api/events | 200 | 404 ❌ | 200 ✅ |
| /api/events/1 | 200 | 404 ❌ | 200 ✅ |
| /api/products | 200 | 200 ✅ | 200 ✅ |
| /api/health | 200 | 200 ✅ | 200 ✅ |

### ✅ Response Format
All responses should have:
```
{
  "success": true,
  "items": [...] or "event": {...}
}
```

### ✅ No Errors
Should NOT see:
```
{"error": "Not found"}  ❌
```

---

## Common Issues & Solutions

### Issue: Still Getting 404
**Solution:**
1. Make sure server is restarted
2. Check server output: Should say "Server running on port 4000"
3. Verify you're using correct URL: http://localhost:4000/api/events
4. Don't forget `/api/` prefix

### Issue: No Events in Response
**Solution:**
1. Check if database has event records
2. Try: SELECT COUNT(*) FROM events WHERE deleted_at IS NULL;
3. Verify database connection working
4. Check server logs for errors

### Issue: Connection Refused
**Solution:**
1. Server might not be running
2. Run: npm start
3. Wait for "Server running on port 4000" message

### Issue: Wrong Port
**Solution:**
1. Our app runs on port 4000 (not 5000)
2. Check config/env.js
3. Update any Postman collections to use :4000

---

## JavaScript Fetch Test

Copy and paste in browser console:

```javascript
// Test all public endpoints
async function testAPIs() {
  console.log('Testing Zar Backend APIs...\n');

  // Test 1: Health
  try {
    const health = await fetch('/api/health').then(r => r.json());
    console.log('✅ Health:', health);
  } catch(e) { console.log('❌ Health:', e.message); }

  // Test 2: Events
  try {
    const events = await fetch('/api/events').then(r => r.json());
    console.log('✅ Events:', events);
  } catch(e) { console.log('❌ Events:', e.message); }

  // Test 3: Products
  try {
    const products = await fetch('/api/products').then(r => r.json());
    console.log('✅ Products:', products);
  } catch(e) { console.log('❌ Products:', e.message); }

  // Test 4: Jewels
  try {
    const jewels = await fetch('/api/jewels?collection_type=18k').then(r => r.json());
    console.log('✅ Jewels:', jewels);
  } catch(e) { console.log('❌ Jewels:', e.message); }
}

testAPIs();
```

**Expected Output:**
```
✅ Health: {success: true, message: "..."}
✅ Events: {success: true, items: [...]}
✅ Products: {success: true, items: [...]}
✅ Jewels: {success: true, items: [...]}
```

---

## Node.js Script Test

Create a file `test-api.js`:

```javascript
const http = require('http');

function testEndpoint(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`✅ ${path}: ${res.statusCode} ${json.success ? 'SUCCESS' : 'FAILED'}`);
        } catch(e) {
          console.log(`❌ ${path}: ${res.statusCode} PARSE_ERROR`);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${path}: ERROR -`, error.message);
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Zar Backend APIs\n');
  await testEndpoint('/api/health');
  await testEndpoint('/api/events');
  await testEndpoint('/api/products');
  await testEndpoint('/api/jewels?collection_type=18k');
  console.log('\n✅ Tests completed');
}

runTests();
```

**Run:**
```bash
node test-api.js
```

---

## Postman Collection Test

1. Open Postman
2. Import: Zar-Backend-API.postman_collection.json
3. Select: Zar Backend - Development environment
4. Test these requests:
   - Events → Get All Events
   - Events → Get Event by ID
   - Products → Get All Products
   - Health & Auth → Health Check

All should return **Status 200**

---

## Database Verification

If events endpoint still not working, verify database:

```sql
-- Check if events table has data
SELECT COUNT(*) FROM events WHERE deleted_at IS NULL;

-- Should return: 1 or more

-- If 0 rows, data exists but is soft-deleted
SELECT COUNT(*) FROM events;

-- Check event details
SELECT id, title, location, status FROM events LIMIT 1;
```

---

## Server Logs to Check

When server starts, look for:
```
✅ Server running on port 4000
```

When you call endpoints, should see:
```
[API REQUEST] {
  method: 'GET',
  path: '/api/events',
  ...
}
[API RESPONSE] {
  method: 'GET',
  path: '/api/events',
  statusCode: 200,
  ...
}
```

---

## What Changed

Only **ONE FILE** was modified:
- `server.js` - Moved 404 handler to end

Everything else stays the same:
- Database: ✅ No changes
- Models: ✅ No changes
- Routes: ✅ No changes
- API endpoints: ✅ No changes

---

## Success Checklist

- [x] Server restarted
- [ ] Health endpoint works (200)
- [ ] Events endpoint works (200)
- [ ] Events returns data (success: true)
- [ ] Single event works (200)
- [ ] Other APIs still work
- [ ] No 404 errors on public endpoints

---

## Performance Check

Add this to browser console:

```javascript
async function checkPerformance() {
  console.time('API Response Time');
  await fetch('/api/events').then(r => r.json());
  console.timeEnd('API Response Time');
}

checkPerformance();
// Should show: < 200ms for healthy response
```

---

## Next Steps After Testing

✅ If all tests pass:
1. Frontend integration ready
2. Update Postman collection base URL if needed
3. Share working API with frontend team
4. Proceed with frontend development

❌ If tests fail:
1. Check server console for error messages
2. Verify database connection
3. Check /zar/config/env.js settings
4. Review EVENTS_API_FIX.md again

---

**Testing Time:** ~5 minutes  
**Difficulty:** Easy ⭐  
**Result:** Should see working APIs with 200 status codes  

**Good luck! 🎉**
