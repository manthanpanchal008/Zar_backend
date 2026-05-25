# Events API Endpoints

## Overview
Two new public GET API endpoints have been added to retrieve event information following the current API flow pattern.

## Endpoints

### 1. List All Events
**Endpoint:** `GET /api/events`

**Description:** Retrieves all active (non-deleted) events

**Response:**
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
      "description": "Unveiling of our new summer collection",
      "event_url": "https://example.com/event",
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

**Error Response:**
```json
{
  "error": "Failed to fetch events."
}
```

---

### 2. Get Event by ID
**Endpoint:** `GET /api/events/:id`

**Description:** Retrieves a specific event by its ID

**Parameters:**
- `id` (URL parameter, required) - The event ID

**Response (Success):**
```json
{
  "success": true,
  "event": {
    "id": 1,
    "title": "Summer Collection Launch",
    "location": "New York",
    "start_date": "2026-06-15",
    "end_date": "2026-06-17",
    "description": "Unveiling of our new summer collection",
    "event_url": "https://example.com/event",
    "status": "upcoming",
    "event_images": [
      "/uploads/events/summer-launch-1.jpg",
      "/uploads/events/summer-launch-2.jpg"
    ],
    "created_at": "2026-05-01T10:00:00.000Z",
    "updated_at": "2026-05-10T15:30:00.000Z"
  }
}
```

**Response (Not Found):**
```json
{
  "error": "Event not found."
}
```

**Error Response:**
```json
{
  "error": "Failed to fetch event."
}
```

---

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Unique event identifier |
| title | string | Event name/title |
| location | string\|null | Event location |
| start_date | string\|null | Event start date (YYYY-MM-DD format) |
| end_date | string\|null | Event end date (YYYY-MM-DD format) |
| description | string\|null | Event description |
| event_url | string\|null | External event URL/link |
| status | string | Event status ('upcoming' or 'past') |
| event_images | array | Array of image URLs for the event |
| created_at | string | Creation timestamp |
| updated_at | string | Last update timestamp |

---

## Example Usage

### cURL Examples

**Get all events:**
```bash
curl -X GET http://localhost:5000/api/events
```

**Get specific event:**
```bash
curl -X GET http://localhost:5000/api/events/1
```

### JavaScript/Fetch Examples

**Get all events:**
```javascript
fetch('http://localhost:5000/api/events')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

**Get specific event:**
```javascript
fetch('http://localhost:5000/api/events/1')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

## Implementation Details

- **Location:** `routes/apiRoutes.js`
- **Model Functions Used:** `listEvents()`, `findEventById(id)`
- **Authentication:** Public endpoints (no authentication required)
- **Error Handling:** Standard JSON error responses with HTTP status codes
- **Response Format:** Consistent with existing product API endpoints

## Flow Pattern

The implementation follows the current API flow:
1. Import required model functions
2. Create serialization function to format response data
3. Create route handlers with try-catch error handling
4. Return JSON responses with `success` flag and data/error messages
