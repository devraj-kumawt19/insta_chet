# MERN Chat App - Step-by-Step Render Deployment Guide

## Prerequisites

- GitHub account with repository pushed
- Render account (render.com)
- MongoDB Atlas cluster with connection string
- Git command line tools

## Step 1: Verify Environment Variables are Set

Before deploying, ensure all files are committed to Git:

```bash
git add .
git commit -m "Production-ready MERN Chat App - Render deployment"
git push origin main
```

## Step 2: Create Render Web Service

### 2.1 Go to Render Dashboard
1. Navigate to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub account if not already connected

### 2.2 Select Repository
1. Search for your chat app repository
2. Select it and click "Connect"

### 2.3 Configure Web Service

**Service Name:**
```
insta-chet
```

**Environment:**
```
Node
```

**Region:**
```
Choose closest to your users
```

**Branch:**
```
main
```

**Build Command:**
```
npm install && npm install --prefix frontend && npm run build --prefix frontend
```

**Start Command:**
```
node backend/server.js
```

## Step 3: Set Environment Variables

In the Render dashboard for your service:

1. Click "Environment"
2. Add the following environment variables:

```
PORT=8080

NODE_ENV=production

MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/chat-app?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_key_here_change_this

ALLOWED_ORIGINS=https://insta-chet.onrender.com,https://yourdomain.com
```

**How to get MONGODB_URI:**
1. Go to [MongoDB Atlas](https://account.mongodb.com/account/login)
2. Navigate to Database Deployments
3. Click "Connect" on your cluster
4. Choose "Drivers"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `myFirstDatabase` with your database name

## Step 4: Deploy

1. Click "Create Web Service"
2. Render will automatically start building and deploying
3. Watch the build logs for any errors
4. Once "Your service is live" appears, deployment is complete!

## Step 5: Verify Deployment

### 5.1 Check Backend Health

Open browser console and test:

```javascript
// Should return user data or auth error
fetch('https://insta-chet.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'testuser', password: 'testpass' })
})
.then(r => r.json())
.then(d => console.log(d))
```

### 5.2 Test Socket.IO Connection

```javascript
// Open DevTools Console
const socket = io('https://insta-chet.onrender.com', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

socket.on('connect', () => console.log('Socket connected!'));
socket.on('connect_error', (error) => console.error('Socket error:', error));
```

### 5.3 Test Full Application Flow

1. **Signup**: Create a new account
2. **Login**: Login with created credentials
3. **Messages**: Send and receive real-time messages
4. **Profile**: Upload profile picture and update bio
5. **Online Status**: Check online/offline user status

## Step 6: Fix Common Issues

### Issue: "Unexpected end of JSON input"

**Solution**: Already fixed in code!
- Check that API responses are valid JSON
- Verify backend is returning JSON with correct Content-Type header
- Check that endpoints return data (not empty responses)

### Issue: Socket.IO not connecting

**Solution**:
1. Verify `ALLOWED_ORIGINS` includes your frontend domain
2. Check browser console for connection errors
3. Restart the Web Service from Render dashboard

**To restart:**
- Go to Service Settings → Manual Deploy → Deploy latest commit

### Issue: Messages don't appear after refresh

**Solution**: Already fixed!
- Socket.IO now has proper reconnection configuration
- Messages are fetched via API endpoint
- Real-time updates work through Socket.IO listeners

### Issue: Profile photo won't upload

**Solution**: Already fixed!
- FormData is properly handled in api.js
- Check file size is reasonable
- Verify `/uploads` directory exists

### Issue: Login/Signup shows errors

**Solution**:
1. Check MongoDB connection in logs:
   - Render Dashboard → Service → Logs
   - Look for "Connected to MongoDB" message
2. Verify JWT_SECRET is set
3. Check error message in browser DevTools

## Step 7: Monitor Deployment

### View Logs
1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. Check for errors during runtime

### Restart Service
1. Go to Service Settings
2. Click "Manual Deploy"
3. Click "Deploy latest commit"

### Update Environment Variables
1. Go to Environment
2. Edit any variable
3. Service will automatically restart

## Step 8: Update Render URL (if using custom domain)

### Using Render's default domain:
- Your app will be at: `https://insta-chet.onrender.com`

### Using custom domain:
1. Render Dashboard → Service Settings → Custom Domain
2. Follow Render's instructions for DNS setup
3. Update `ALLOWED_ORIGINS` with your custom domain
4. Update frontend `.env.production` if needed

## Step 9: Production Checklist

Before considering deployment complete:

- [ ] Backend API is responding
- [ ] Socket.IO is connecting
- [ ] Signup works without "Unexpected end of JSON input" error
- [ ] Login works
- [ ] Messages send and receive in real-time
- [ ] Messages persist after page refresh
- [ ] Profile picture uploads
- [ ] Online/offline status updates in real-time
- [ ] All CRUD operations work (Create, Read, Update, Delete)
- [ ] Navigation between chats is smooth
- [ ] No console errors in browser

## Step 10: Continuous Deployment

Render automatically deploys when you push to your main branch:

```bash
# Make changes locally
git add .
git commit -m "Fix: some issue"
git push origin main

# Render will automatically build and deploy!
```

## Troubleshooting Commands

### Test MongoDB Connection
```bash
# SSH into Render instance (if available)
# Then test connection:
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err));
"
```

### Clear Render Build Cache
1. Service Settings → Build & Deploy
2. Clear Build Cache
3. Manual Deploy → Deploy latest commit

### View Render Logs in Real-time
```bash
# Using Render CLI (if installed)
render logs <service-id>
```

## Environment Variables Reference

| Variable | Example | Purpose |
|----------|---------|---------|
| PORT | 8080 | Server port |
| NODE_ENV | production | Environment mode |
| MONGODB_URI | mongodb+srv://... | Database connection |
| JWT_SECRET | secret123 | JWT authentication |
| ALLOWED_ORIGINS | https://insta-chet.onrender.com | CORS origins |

## Performance Tips

1. **Enable caching**: Messages should cache client-side
2. **Optimize images**: Keep profile pictures under 1MB
3. **Database indexing**: Ensure MongoDB has proper indexes
4. **Connection pooling**: Socket.IO handles this automatically

## Security Considerations

1. ✅ JWT_SECRET should be strong and unique
2. ✅ Database credentials in environment variables (not in code)
3. ✅ CORS properly configured for allowed origins only
4. ✅ HTTPS enforced by Render
5. ✅ Cookies set with secure flag for auth

## Support Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Help](https://www.mongodb.com/docs/atlas/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Socket.IO Guide](https://socket.io/docs/)

## Next Steps

1. Monitor application performance
2. Set up error tracking (e.g., Sentry)
3. Add analytics
4. Implement backup strategy for MongoDB
5. Consider upgrading from free tier for production
6. Add automated tests
7. Implement logging/monitoring

## Quick Reference: Post-Deployment Commands

```bash
# View current deployment
render status <service-id>

# Restart service
render restart <service-id>

# View environment variables
render env <service-id>

# Deploy specific commit
render deploy <service-id> --commit <commit-hash>
```

Good luck! 🚀

