# Postman Testing Guide for Grambix Backend APIs

## Base URL
```
http://localhost:3000
```

## Authentication
For protected routes, add this header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. User Progress APIs (`/api/user-progress`)

### 1.1 Update Progress
**PUT** `/api/user-progress/:contentType/:contentId/progress`

**URL Example:**
```
PUT http://localhost:3000/api/user-progress/ebook/64f8a1b2c3d4e5f6a7b8c9d0/progress
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "progress": 25,
  "currentPage": 15,
  "totalPages": 60,
  "currentTime": 1800,
  "totalDuration": 7200,
  "isCompleted": false,
  "bookmarked": true
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Progress updated successfully",
  "data": {
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "contentId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "contentType": "ebook",
    "progress": 25,
    "currentPage": 15,
    "totalPages": 60,
    "lastReadAt": "2024-01-15T10:30:00Z",
    "bookmarked": true
  }
}
```

### 1.2 Get Continue Items
**GET** `/api/user-progress/continue?limit=10`

**URL Example:**
```
GET http://localhost:3000/api/user-progress/continue?limit=5
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Continue items retrieved successfully",
  "data": {
    "continueReading": [
      {
        "contentId": {
          "title": "Book Title",
          "subtitle": "Book Subtitle",
          "coverImage": "image_url",
          "author": "Author Name"
        },
        "progress": 25,
        "currentPage": 15,
        "totalPages": 60,
        "lastReadAt": "2024-01-15T10:30:00Z"
      }
    ],
    "continueListening": [
      {
        "contentId": {
          "title": "Audiobook Title",
          "subtitle": "Audiobook Subtitle",
          "coverImage": "image_url",
          "author": "Author Name"
        },
        "progress": 40,
        "currentTime": 1800,
        "totalDuration": 7200,
        "lastListenAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### 1.3 Get Activity Statistics
**GET** `/api/user-progress/activity?period=week`

**URL Examples:**
```
GET http://localhost:3000/api/user-progress/activity?period=week
GET http://localhost:3000/api/user-progress/activity?period=month
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Activity stats retrieved successfully",
  "data": {
    "period": "week",
    "totals": {
      "readingMinutes": 120,
      "listeningMinutes": 90,
      "pagesRead": 45,
      "timeListened": 5400,
      "ebooksRead": 3,
      "audiobooksListened": 2
    },
    "dailyBreakdown": [
      {
        "date": "2024-01-15T00:00:00Z",
        "reading": 20,
        "listening": 15,
        "ebooks": 1,
        "audiobooks": 1
      }
    ]
  }
}
```

### 1.4 Get Dashboard Data
**GET** `/api/user-progress/dashboard?period=week`

**URL Example:**
```
GET http://localhost:3000/api/user-progress/dashboard?period=week
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "continueItems": {
      "continueReading": [...],
      "continueListening": [...]
    },
    "activityStats": {
      "period": "week",
      "totals": {...},
      "dailyBreakdown": [...]
    },
    "summary": {
      "totalReadingTime": 120,
      "totalListeningTime": 90,
      "totalPagesRead": 45,
      "totalTimeListened": 5400,
      "activeBooks": 5,
      "weeklyGoal": {
        "current": {...},
        "goals": {...},
        "progress": {...},
        "isOnTrack": true
      }
    }
  }
}
```

### 1.5 Get History
**GET** `/api/user-progress/history/:contentType?page=1&limit=20`

**URL Examples:**
```
GET http://localhost:3000/api/user-progress/history/ebook?page=1&limit=10
GET http://localhost:3000/api/user-progress/history/audiobook?page=1&limit=10
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "History retrieved successfully",
  "data": {
    "history": [
      {
        "contentId": {
          "title": "Book Title",
          "subtitle": "Book Subtitle",
          "coverImage": "image_url",
          "author": "Author Name"
        },
        "progress": 100,
        "currentPage": 60,
        "totalPages": 60,
        "lastReadAt": "2024-01-15T10:30:00Z",
        "isCompleted": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### 1.6 Get Bookmarks
**GET** `/api/user-progress/bookmarks/:contentType?page=1&limit=20`

**URL Examples:**
```
GET http://localhost:3000/api/user-progress/bookmarks/ebook?page=1&limit=10
GET http://localhost:3000/api/user-progress/bookmarks/audiobook?page=1&limit=10
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Bookmarks retrieved successfully",
  "data": {
    "bookmarks": [
      {
        "contentId": {
          "title": "Book Title",
          "subtitle": "Book Subtitle",
          "coverImage": "image_url",
          "author": "Author Name"
        },
        "progress": 50,
        "currentPage": 30,
        "totalPages": 60,
        "bookmarked": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "pages": 2
    }
  }
}
```

### 1.7 Get Content Progress
**GET** `/api/user-progress/:contentType/:contentId/progress`

**URL Example:**
```
GET http://localhost:3000/api/user-progress/ebook/64f8a1b2c3d4e5f6a7b8c9d0/progress
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Progress retrieved successfully",
  "data": {
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "contentId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "contentType": "ebook",
    "progress": 25,
    "currentPage": 15,
    "totalPages": 60,
    "lastReadAt": "2024-01-15T10:30:00Z"
  }
}
```

### 1.8 Toggle Bookmark
**PATCH** `/api/user-progress/:contentType/:contentId/bookmark`

**URL Example:**
```
PATCH http://localhost:3000/api/user-progress/ebook/64f8a1b2c3d4e5f6a7b8c9d0/bookmark
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Bookmark status updated successfully",
  "data": {
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "contentId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "contentType": "ebook",
    "bookmarked": true
  }
}
```

---

## 2. User Personalized APIs (`/api/user-personalized`)

### 2.1 Get Personalized Content
**GET** `/api/user-personalized/content`

**URL Example:**
```
GET http://localhost:3000/api/user-personalized/content
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Personalized content retrieved successfully",
  "data": {
    "continueItems": {
      "continueReading": [...],
      "continueListening": [...]
    },
    "activityStats": {
      "period": "week",
      "totals": {...},
      "dailyBreakdown": [...]
    },
    "trendingContent": {
      "trendingEbooks": [
        {
          "title": "Trending Book",
          "userProgress": {
            "progress": 25,
            "isReading": true,
            "lastReadAt": "2024-01-15T10:30:00Z"
          }
        }
      ],
      "trendingAudiobooks": [...],
      "trendingBooks": [...]
    },
    "recommendations": {
      "recommendedEbooks": [...],
      "recommendedAudiobooks": [...],
      "recommendedBooks": [...],
      "reason": "Based on your reading history"
    },
    "summary": {
      "totalReadingTime": 120,
      "totalListeningTime": 90,
      "activeBooks": 5,
      "weeklyGoal": {...}
    }
  }
}
```

### 2.2 Get Personalized Dashboard
**GET** `/api/user-personalized/dashboard`

**URL Example:**
```
GET http://localhost:3000/api/user-personalized/dashboard
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Personalized dashboard retrieved successfully",
  "data": {
    "continueItems": {...},
    "activityStats": {...},
    "summary": {
      "totalReadingTime": 120,
      "totalListeningTime": 90,
      "totalPagesRead": 45,
      "totalTimeListened": 5400,
      "activeBooks": 5,
      "weeklyGoal": {...}
    }
  }
}
```

### 2.3 Get Continue Items (Personalized)
**GET** `/api/user-personalized/continue?limit=10`

**URL Example:**
```
GET http://localhost:3000/api/user-personalized/continue?limit=5
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Expected Response:** (Same as 1.2)

### 2.4 Get Activity Statistics (Personalized)
**GET** `/api/user-personalized/activity?period=week`

**URL Example:**
```
GET http://localhost:3000/api/user-personalized/activity?period=week
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Expected Response:** (Same as 1.3)

### 2.5 Get History (Personalized)
**GET** `/api/user-personalized/history/:contentType?page=1&limit=20`

**URL Example:**
```
GET http://localhost:3000/api/user-personalized/history/ebook?page=1&limit=10
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Expected Response:** (Same as 1.5)

### 2.6 Get Bookmarks (Personalized)
**GET** `/api/user-personalized/bookmarks/:contentType?page=1&limit=20`

**URL Example:**
```
GET http://localhost:3000/api/user-personalized/bookmarks/ebook?page=1&limit=10
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Expected Response:** (Same as 1.6)

---

## 3. Home Page APIs (`/api/home`)

### 3.1 Get Home Page Data
**GET** `/api/home`

**URL Example:**
```
GET http://localhost:3000/api/home
```

**Headers:** (No authentication required)
```
Content-Type: application/json
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "recommended": [
      {
        "bookCover": "image_url",
        "bookName": "Book Title",
        "categoryName": "Fiction",
        "synopsis": "Book description...",
        "isAudioBook": true,
        "isEbook": false,
        "isBook": false
      }
    ],
    "newReleases": [
      {
        "bookCover": "image_url",
        "bookName": "New Book",
        "categoryName": "Non-Fiction",
        "synopsis": "New book description...",
        "isAudioBook": false,
        "isEbook": true,
        "isBook": false
      }
    ],
    "trending": [
      {
        "bookCover": "image_url",
        "bookName": "Trending Book",
        "categoryName": "Mystery",
        "synopsis": "Trending book description...",
        "isAudioBook": false,
        "isEbook": false,
        "isBook": true
      }
    ]
  }
}
```

### 3.2 Get Book by ID
**GET** `/api/home/book?id=64f8a1b2c3d4e5f6a7b8c9d0`

**URL Example:**
```
GET http://localhost:3000/api/home/book?id=64f8a1b2c3d4e5f6a7b8c9d0
```

**Headers:** (No authentication required)
```
Content-Type: application/json
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "bookCover": "image_url",
    "bookName": "Book Title",
    "categoryName": "Fiction",
    "synopsis": "Book description...",
    "author": "Author Name",
    "pages": 300,
    "duration": 7200
  }
}
```

---

## 4. Testing Scenarios

### 4.1 Complete User Flow Test

1. **Get Home Page** (Public)
   ```
   GET http://localhost:3000/api/home
   ```

2. **Get Personalized Content** (Authenticated)
   ```
   GET http://localhost:3000/api/user-personalized/content
   ```

3. **Update Reading Progress**
   ```
   PUT http://localhost:3000/api/user-progress/ebook/64f8a1b2c3d4e5f6a7b8c9d0/progress
   Body: {
     "progress": 25,
     "currentPage": 15,
     "totalPages": 60
   }
   ```

4. **Get Continue Items**
   ```
   GET http://localhost:3000/api/user-progress/continue
   ```

5. **Get Activity Stats**
   ```
   GET http://localhost:3000/api/user-progress/activity?period=week
   ```

### 4.2 Error Testing

1. **Unauthorized Access**
   - Remove Authorization header
   - Use invalid token
   - Expected: 401 Unauthorized

2. **Invalid Content Type**
   ```
   PUT http://localhost:3000/api/user-progress/invalid/64f8a1b2c3d4e5f6a7b8c9d0/progress
   ```
   Expected: 400 Bad Request

3. **Invalid Content ID**
   ```
   GET http://localhost:3000/api/user-progress/ebook/invalid-id/progress
   ```
   Expected: 404 Not Found

### 4.3 Pagination Testing

1. **Test Different Page Sizes**
   ```
   GET http://localhost:3000/api/user-progress/history/ebook?page=1&limit=5
   GET http://localhost:3000/api/user-progress/history/ebook?page=1&limit=20
   GET http://localhost:3000/api/user-progress/history/ebook?page=2&limit=10
   ```

2. **Test Different Periods**
   ```
   GET http://localhost:3000/api/user-progress/activity?period=week
   GET http://localhost:3000/api/user-progress/activity?period=month
   ```

---

## 5. Postman Collection Setup

### 5.1 Environment Variables
Create an environment with these variables:
```
base_url: http://localhost:3000
jwt_token: <your_jwt_token>
```

### 5.2 Collection Structure
```
Grambix Backend APIs
├── User Progress
│   ├── Update Progress
│   ├── Get Continue Items
│   ├── Get Activity Stats
│   ├── Get Dashboard
│   ├── Get History
│   ├── Get Bookmarks
│   ├── Get Content Progress
│   └── Toggle Bookmark
├── User Personalized
│   ├── Get Personalized Content
│   ├── Get Personalized Dashboard
│   ├── Get Continue Items
│   ├── Get Activity Stats
│   ├── Get History
│   └── Get Bookmarks
└── Home Page
    ├── Get Home Page Data
    └── Get Book by ID
```

### 5.3 Pre-request Scripts
For authenticated requests, add this pre-request script:
```javascript
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('jwt_token')
});
```

### 5.4 Tests Scripts
Add basic tests to verify responses:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success property", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData.success).to.eql(true);
});
```

---

## 6. Common Issues & Solutions

### 6.1 CORS Issues
If you get CORS errors, ensure your server is running and CORS is properly configured.

### 6.2 Authentication Issues
- Verify JWT token is valid and not expired
- Check token format: `Bearer <token>`
- Ensure user exists in database

### 6.3 Database Issues
- Ensure MongoDB is running
- Check database connection
- Verify collections exist

### 6.4 Validation Errors
- Check request body format
- Verify required fields are present
- Ensure data types are correct

---

## 7. Performance Testing

### 7.1 Load Testing
Use Postman's Runner to test multiple requests:
- Set iterations: 100
- Set delay: 100ms
- Monitor response times

### 7.2 Concurrent Testing
Test multiple users accessing the same endpoints simultaneously.

### 7.3 Data Volume Testing
Test with large datasets to ensure pagination works correctly.

---

This testing guide covers all the APIs in your system. Make sure to:
1. Start your server first
2. Get a valid JWT token for authentication
3. Test both success and error scenarios
4. Verify all response formats match expectations 