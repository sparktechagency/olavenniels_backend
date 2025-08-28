# User Progress Tracking API Documentation

## Overview
This API system handles user reading and listening progress, activity tracking, and personalized content recommendations for the Grambix library app.

## Base URLs
```
/api/user-progress    # Progress tracking and management
/api/user-personalized # Personalized content and recommendations
```

## Authentication
All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### 1. Update Progress
**PUT** `/api/user-progress/:contentType/:contentId/progress`

Updates or creates user progress for reading/listening.

**Parameters:**
- `contentType`: `ebook` or `audiobook`
- `contentId`: ID of the content

**Request Body:**
```json
{
  "progress": 25,           // Percentage (0-100)
  "currentPage": 15,        // Current page number (for ebooks)
  "totalPages": 60,         // Total pages (for ebooks)
  "currentTime": 1800,      // Current time in seconds (for audiobooks)
  "totalDuration": 7200,    // Total duration in seconds (for audiobooks)
  "isCompleted": false,     // Whether content is completed
  "bookmarked": true        // Bookmark status
}
```

**Response:**
```json
{
  "success": true,
  "message": "Progress updated successfully",
  "data": {
    "userId": "user_id",
    "contentId": "content_id",
    "contentType": "ebook",
    "progress": 25,
    "currentPage": 15,
    "totalPages": 60,
    "lastReadAt": "2024-01-15T10:30:00Z",
    "bookmarked": true
  }
}
```

### 2. Get Continue Items
**GET** `/api/user-progress/continue?limit=10`

Retrieves user's continue reading/listening items.

**Query Parameters:**
- `limit`: Number of items to return (default: 10)

**Response:**
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

### 3. Get Activity Statistics
**GET** `/api/user-progress/activity?period=week`

Retrieves user's reading/listening activity statistics.

**Query Parameters:**
- `period`: `week` or `month` (default: week)

**Response:**
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

### 4. Get Dashboard Data
**GET** `/api/user-progress/dashboard?period=week`

Retrieves comprehensive dashboard data including continue items and activity stats.

**Response:**
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "continueItems": { /* continue reading/listening items */ },
    "activityStats": { /* activity statistics */ },
    "summary": {
      "totalReadingTime": 120,
      "totalListeningTime": 90,
      "totalPagesRead": 45,
      "totalTimeListened": 5400,
      "activeBooks": 5,
      "weeklyGoal": {
        "current": { /* current week stats */ },
        "goals": { /* weekly goals */ },
        "progress": { /* progress percentages */ },
        "isOnTrack": true
      }
    }
  }
}
```

### 5. Get History
**GET** `/api/user-progress/history/:contentType?page=1&limit=20`

Retrieves user's reading/listening history.

**Parameters:**
- `contentType`: `ebook` or `audiobook`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

### 6. Get Bookmarks
**GET** `/api/user-progress/bookmarks/:contentType?page=1&limit=20`

Retrieves user's bookmarked items.

**Parameters:**
- `contentType`: `ebook` or `audiobook`

### 7. Toggle Bookmark
**PATCH** `/api/user-progress/:contentType/:contentId/bookmark`

Toggles bookmark status for a content item.

### 8. Get Content Progress
**GET** `/api/user-progress/:contentType/:contentId/progress`

Retrieves progress for a specific content item.

## User Personalized API

### 1. Get Personalized Content
**GET** `/api/user-personalized/content`

Retrieves complete personalized content for authenticated users.

**Response:**
```json
{
  "success": true,
  "message": "Personalized content retrieved successfully",
  "data": {
    "continueItems": { /* continue reading/listening items */ },
    "activityStats": { /* activity statistics */ },
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
      "trendingAudiobooks": [ /* similar structure */ ],
      "trendingBooks": [ /* similar structure */ ]
    },
    "recommendations": { /* personalized recommendations */ },
    "summary": { /* summary statistics */ }
  }
}
```

### 2. Get Personalized Dashboard
**GET** `/api/user-personalized/dashboard`

Retrieves personalized dashboard data (continue items + activity stats).

### 3. Get Continue Items
**GET** `/api/user-personalized/continue?limit=10`

Retrieves user's continue reading/listening items.

### 4. Get Activity Statistics
**GET** `/api/user-personalized/activity?period=week`

Retrieves user's reading/listening activity statistics.

### 5. Get History
**GET** `/api/user-personalized/history/:contentType?page=1&limit=20`

Retrieves user's reading/listening history.

### 6. Get Bookmarks
**GET** `/api/user-personalized/bookmarks/:contentType?page=1&limit=20`

Retrieves user's bookmarked items.

## Home Page API

### Personalized Home Page
**GET** `/api/home/personalized`

Retrieves personalized home page data for authenticated users.

**Response:**
```json
{
  "success": true,
  "message": "Personalized home page retrieved successfully",
  "data": {
    "continueItems": { /* continue reading/listening items */ },
    "activityStats": { /* activity statistics */ },
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
      "trendingAudiobooks": [ /* similar structure */ ]
    },
    "recommendations": { /* personalized recommendations */ },
    "summary": { /* summary statistics */ }
  }
}
```

### Public Home Page
**GET** `/api/home/public`

Retrieves public home page data (no authentication required).

## Frontend Integration Guide

### When to Call APIs

#### 1. App Launch
- Call `/api/user-personalized/content` to get complete personalized data
- Call `/api/user-progress/dashboard` for progress dashboard
- Call `/api/home` for general home page (existing, unchanged)

#### 2. Reading/Listening Progress
- Call `/api/user-progress/:contentType/:contentId/progress` every:
  - **Ebooks**: Every page turn or every 30 seconds
  - **Audiobooks**: Every 30 seconds or when user pauses/resumes

#### 3. User Actions
- Call bookmark toggle when user bookmarks/unbookmarks
- Call continue items when user wants to resume reading/listening

#### 4. Periodic Updates
- Refresh activity stats every 5 minutes
- Update dashboard data when user returns to home page

### Efficient Data Handling

#### 1. Progress Updates
- Only send changed fields in progress updates
- Use debouncing for frequent updates (e.g., every 30 seconds)
- Batch updates when possible

#### 2. Caching Strategy
- Cache continue items locally
- Cache activity stats for 5 minutes
- Refresh data on app focus

#### 3. Offline Support
- Store progress locally when offline
- Sync when connection is restored
- Use optimistic updates for better UX

### Example Flutter Implementation

```dart
class ProgressService {
  // Update reading progress
  Future<void> updateReadingProgress({
    required String contentId,
    required int currentPage,
    required int totalPages,
    required double progress,
  }) async {
    try {
      await _api.put(
        '/api/user-progress/ebook/$contentId/progress',
        body: {
          'currentPage': currentPage,
          'totalPages': totalPages,
          'progress': progress,
        },
      );
      
      // Update local cache
      _updateLocalProgress(contentId, 'ebook', progress, currentPage);
    } catch (e) {
      // Handle error and store locally for later sync
      _storeOfflineProgress(contentId, 'ebook', progress, currentPage);
    }
  }

  // Update listening progress
  Future<void> updateListeningProgress({
    required String contentId,
    required int currentTime,
    required int totalDuration,
    required double progress,
  }) async {
    try {
      await _api.put(
        '/api/user-progress/audiobook/$contentId/progress',
        body: {
          'currentTime': currentTime,
          'totalDuration': totalDuration,
          'progress': progress,
        },
      );
      
      // Update local cache
      _updateLocalProgress(contentId, 'audiobook', progress, currentTime);
    } catch (e) {
      // Handle error and store locally for later sync
      _storeOfflineProgress(contentId, 'audiobook', progress, currentTime);
    }
  }
}
```

## Performance Considerations

### 1. Database Indexing
- Compound indexes on `userId + contentType`
- Indexes on `lastReadAt` and `lastListenAt`
- Indexes on `date` for activity tracking

### 2. Caching Strategy
- Redis for frequently accessed data
- In-memory caching for user sessions
- CDN for static content

### 3. Batch Operations
- Batch progress updates when possible
- Aggregate activity data periodically
- Use background jobs for heavy computations

## Error Handling

### 1. Network Errors
- Retry with exponential backoff
- Store progress locally when offline
- Sync when connection is restored

### 2. Validation Errors
- Validate progress data on frontend
- Provide clear error messages
- Handle edge cases gracefully

### 3. Rate Limiting
- Implement rate limiting for progress updates
- Use debouncing for frequent updates
- Respect API limits

## Security Considerations

### 1. Authentication
- JWT token validation
- User ownership verification
- Session management

### 2. Data Validation
- Input sanitization
- Progress value validation
- Content type verification

### 3. Privacy
- User data isolation
- Secure data transmission
- GDPR compliance 