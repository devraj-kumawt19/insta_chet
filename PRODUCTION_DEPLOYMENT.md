# MERN Chat App - Production Deployment Guide (Render)

## Overview
This guide covers the production-ready configuration for deploying the MERN Chat App to Render. All hardcoded localhost URLs have been replaced with environment-based configuration.

## Key Changes Made

### 1. Frontend Environment Configuration

#### Created Files:
- **`.env.production`** - Production environment variables
  ```
  VITE_API_URL=https://insta-chet.onrender.com
  ```

- **`.env.development`** - Development environment variables
  ```
  VITE_API_URL=http://localhost:8080
  ```

#### Updated Components:

**File: `frontend/src/utils/api.js`** (NEW)
- Centralized API configuration
- Handles proper error handling
- Supports both JSON and FormData uploads
- Includes credentials for authentication cookies
- Safe JSON parsing with empty response handling
- Prevention of "Unexpected end of JSON input" error

**Functions available:**
- `apiCall()` - Generic fetch wrapper
- `apiGet()` - GET requests
- `apiPost()` - POST requests  
- `apiPut()` - PUT requests
- `apiDelete()` - DELETE requests
- `getAPIUrl()` - Get API base URL

### 2. Frontend Hooks Updated

All hooks now use the centralized `api.js` utility:

| Hook | Changes |
|------|---------|
| `useLogin.js` | Uses `apiPost()` instead of raw fetch |
| `useSignup.js` | Uses `apiPost()` instead of raw fetch |
| `useLogout.js` | Uses `apiPost()` instead of raw fetch |
| `useGetMessages.js` | Uses `apiGet()` with error handling |
| `useSendMessage.js` | Uses `apiPost()` with error handling |
| `useGetConversations.js` | Uses `apiGet()` with error handling |
| `useGetUserProfile.js` | Uses `apiGet()` with error handling |
| `useFollowUser.js` | Uses `apiPost()` with error handling |

### 3. Socket.IO Configuration

**File: `frontend/src/context/SocketContext.jsx`** (UPDATED)
- Now uses `import.meta.env.VITE_API_URL` instead of hardcoded `http://localhost:8080`
- Added connection options for reliability:
  - `reconnection: true`
  - `reconnectionDelay: 1000`
  - `reconnectionDelayMax: 5000`
  - `reconnectionAttempts: 5`
- Added connection event logging for debugging

**File: `backend/socket/socket.js`** (UPDATED)
- Dynamic CORS origin configuration
- Supports multiple environments
- Default origins include:
  - `http://localhost:5173` (Vite dev)
  - `http://localhost:8080` (Backend dev)
  - `http://localhost:3000` (Alt frontend port)
  - `https://insta-chet.onrender.com` (Production)
- Can be extended via `ALLOWED_ORIGINS` env variable
- Added support for both WebSocket and polling transports

### 4. Backend Configuration

**File: `backend/server.js`** (UPDATED)
- Added Express CORS middleware
- Configured for both development and production
- Reads from environment variable `ALLOWED_ORIGINS` or uses defaults
- Properly configured methods and headers

**File: `package.json`** (UPDATED)
- Added `"cors": "^2.8.5"` dependency

### 5. Vite Configuration

**File: `frontend/vite.config.js`** (UPDATED)
- Added `changeOrigin: true` for better proxy handling
- Added `/uploads` endpoint proxy
- Maintains `/api` endpoint proxy for development

## Deployment Instructions for Render

### 1. Set Environment Variables

**Frontend (.env.production)**
```
VITE_API_URL=https://insta-chet.onrender.com
```

**Backend (.env)**
```
PORT=8080
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080,https://insta-chet.onrender.com,https://yourdomain.com
```

### 2. Build Script (for Render)
The root `package.json` includes:
```json
"build": "npm install && npm install --prefix frontend && npm run build --prefix frontend"
```

### 3. Start Script
```json
"start": "node backend/server.js"
```

### 4. Render Configuration

**Environment Variables in Render Dashboard:**
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
PORT=8080
NODE_ENV=production
ALLOWED_ORIGINS=https://insta-chet.onrender.com
```

## Authentication Routes (Verified)

| Method | Endpoint | Protected | Purpose |
|--------|----------|-----------|---------|
| POST | `/api/auth/signup` | No | User registration |
| POST | `/api/auth/login` | No | User login |
| POST | `/api/auth/logout` | Yes | User logout |

## Message Routes (Verified)

| Method | Endpoint | Protected | Purpose |
|--------|----------|-----------|---------|
| GET | `/api/messages/:id` | Yes | Get messages from conversation |
| POST | `/api/messages/send/:id` | Yes | Send new message |
| POST | `/api/messages/read/:conversationId` | Yes | Mark messages as read |

## User Routes (Verified)

| Method | Endpoint | Protected | Purpose |
|--------|----------|-----------|---------|
| GET | `/api/users` | Yes | Get all users for sidebar |
| GET | `/api/users/profile/:userId` | Yes | Get user profile |
| PUT | `/api/users/profile/update` | Yes | Update user profile |
| POST | `/api/users/follow/:userId` | Yes | Follow a user |
| POST | `/api/users/unfollow/:userId` | Yes | Unfollow a user |
| POST | `/api/users/upload-profile-pic` | Yes | Upload profile picture |

## Error Handling

### JSON Parsing Improvements
The new `api.js` utility provides:
1. **Response status checking** - Validates HTTP status before parsing
2. **Empty response handling** - Checks content-length header
3. **Content-type validation** - Ensures response is JSON
4. **Proper error messages** - Clear error communication

### Error Flow:
```
API Call → Check HTTP Status
    ↓
Check Content-Type
    ↓
Parse JSON safely
    ↓
Throw descriptive error if any step fails
```

## Production Checklist

- [x] Frontend environment variables configured
- [x] Backend CORS enabled
- [x] Socket.IO CORS configured for production URL
- [x] All fetch calls use centralized API utility
- [x] Error handling for empty/invalid responses
- [x] JSON parsing wrapped in try-catch
- [x] FormData upload support for profile pictures
- [x] Authentication routes protected
- [x] Message routes protected
- [x] Database connection configured

## Testing Production Build Locally

```bash
# Build frontend
npm run build --prefix frontend

# Start backend with production build
NODE_ENV=production node backend/server.js
```

## Debugging Production Issues

### Check Socket.IO Connection
Open browser console and check:
```javascript
// The socket should show these messages:
// "Socket connected: [socket-id]"
```

### Check API Calls
All API calls will log to console:
```javascript
// On error:
// "API Error [/api/auth/login]: [error message]"
```

### Check CORS Issues
If you see CORS errors in browser:
1. Verify `ALLOWED_ORIGINS` environment variable on Render
2. Check backend logs for connection details
3. Ensure production URL matches exactly

## File Structure Summary

### Frontend Files Updated:
```
frontend/
├── .env.development (NEW)
├── .env.production (NEW)
├── vite.config.js (UPDATED)
├── src/
│   ├── utils/
│   │   └── api.js (NEW)
│   ├── context/
│   │   └── SocketContext.jsx (UPDATED)
│   ├── hooks/
│   │   ├── useLogin.js (UPDATED)
│   │   ├── useSignup.js (UPDATED)
│   │   ├── useLogout.js (UPDATED)
│   │   ├── useGetMessages.js (UPDATED)
│   │   ├── useSendMessage.js (UPDATED)
│   │   ├── useGetConversations.js (UPDATED)
│   │   ├── useGetUserProfile.js (UPDATED)
│   │   └── useFollowUser.js (UPDATED)
│   └── components/
│       └── profile/
│           └── EditProfile.jsx (UPDATED)
```

### Backend Files Updated:
```
backend/
├── server.js (UPDATED - Added CORS)
├── socket/
│   └── socket.js (UPDATED - Dynamic CORS origins)
└── routes/ (No changes needed)
    ├── auth.routes.js
    ├── message.routes.js
    └── user.routes.js
```

### Root Files Updated:
```
package.json (UPDATED - Added cors dependency)
```

## Future Enhancements

1. Add request/response logging middleware
2. Implement rate limiting
3. Add API timeout configuration
4. Implement retry logic for failed requests
5. Add request cancellation support
6. Implement request caching

## Support & Troubleshooting

### Common Issues:
1. **"Unexpected end of JSON input"** → Fixed by proper response validation in api.js
2. **Messages not appearing after refresh** → Socket.IO now properly reconnects
3. **Socket.IO not connecting** → CORS properly configured for production URL
4. **Profile photo not uploading** → FormData now properly handled in api.js

### Verify Deployment:
1. Test signup/login flow
2. Send and receive messages
3. Check real-time updates with Socket.IO
4. Verify profile photo upload
5. Test on/offline user status

