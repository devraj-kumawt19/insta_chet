# Frontend Backend Integration - Execution Plan

## 📊 Status Overview

**Scan Date:** June 1, 2026  
**Components Scanned:** 40 JSX files  
**Issues Found:** 15 critical/medium issues  
**Pass Rate:** 65% (26/40 components properly integrated)

---

## 🎯 Integration Issues By Severity

### 🔴 CRITICAL (Must Fix Immediately)
**Count:** 6 issues  
**Impact:** Breaking backend integration

| Issue | File | Fix Type | Effort |
|-------|------|----------|--------|
| Direct axios in posts | `CreatePost.jsx` | Replace with apiPost | 5 min |
| Direct axios in posts | `Post.jsx` | Replace with apiPost/apiDelete | 10 min |
| Direct axios in posts | `PostFeed.jsx` | Replace with apiGet | 5 min |
| Direct axios in stories | `CreateStory.jsx` | Replace with apiPost | 5 min |
| Direct axios in stories | `Story.jsx` | Replace with apiPost/apiDelete | 10 min |
| Direct axios in stories | `StoryFeed.jsx` | Replace with apiGet | 5 min |

**Subtotal Time:** 40 minutes  
**Files Affected:** 6  
**API Utility Available:** Yes (`utils/api.js` ready)

---

### 🟡 MEDIUM (High Priority)
**Count:** 4 issues  
**Impact:** Shows fake data instead of real content

| Issue | File | Problem | Fix Type |
|-------|------|---------|----------|
| Mock stories array | `ui/Stories.jsx` | Lines 10-19 | Remove mockStories, add loading state |
| Hardcoded profile | `ui/ProfileCard.jsx` | Lines 15-23 | Remove defaults or add error state |
| Unsplash dummy images | `ui/ModernInstagramUI.jsx` | Lines 84-97 | Fetch from `/api/explore` |
| Hardcoded notifications | `ui/Navbar.jsx`, `ui/Sidebar.jsx`, `ui/BottomNav.jsx` | Multiple | Create useNotifications hook |

**Subtotal Time:** 45 minutes  
**Files Affected:** 5  
**New Hook Required:** Yes (useNotifications)

---

### 🟠 LOW (Nice to Have)
**Count:** 5 issues  
**Impact:** Performance, UX, or potential bugs

| Issue | File | Priority | Effort |
|-------|------|----------|--------|
| Inefficient useEffect | `ui/PostCard.jsx` | Medium | Convert to useMemo (10 min) |
| Local search only | `sidebar/SearchInput.jsx` | Low | Add backend search API (20 min) |
| Endpoint mismatch | `profile/EditProfile.jsx` | Low | Verify paths (5 min) |

---

## 🛠️ Step-by-Step Fix Plan

### Phase 1: Critical API Integration (40 min)

#### Step 1.1: Fix CreatePost.jsx (5 min)
```
[ ] Remove: import axios from "axios"
[ ] Add: import { apiPost } from "../../utils/api"
[ ] Replace: axios.post → apiPost
[ ] Test: Create a post and verify API call
```

#### Step 1.2: Fix Post.jsx (10 min)
```
[ ] Remove: import axios from "axios"
[ ] Add: import { apiPost, apiDelete } from "../../utils/api"
[ ] Replace: axios.post → apiPost (2 locations)
[ ] Replace: axios.delete → apiDelete
[ ] Test: Like, comment, and delete posts
```

#### Step 1.3: Fix PostFeed.jsx (5 min)
```
[ ] Remove: import axios from "axios"
[ ] Add: import { apiGet } from "../../utils/api"
[ ] Replace: axios.get → apiGet
[ ] Test: Feed loads posts correctly
```

#### Step 1.4: Fix CreateStory.jsx (5 min)
```
[ ] Remove: import axios from "axios"
[ ] Add: import { apiPost } from "../../utils/api"
[ ] Replace: axios.post → apiPost
[ ] Test: Create a story and verify upload
```

#### Step 1.5: Fix Story.jsx (10 min)
```
[ ] Remove: import axios from "axios"
[ ] Add: import { apiPost, apiDelete } from "../../utils/api"
[ ] Replace: axios.post → apiPost (view endpoint)
[ ] Replace: axios.delete → apiDelete
[ ] Test: View and delete story functionality
```

#### Step 1.6: Fix StoryFeed.jsx (5 min)
```
[ ] Remove: import axios from "axios"
[ ] Add: import { apiGet } from "../../utils/api"
[ ] Replace: axios.get → apiGet
[ ] Test: Stories load in feed
```

---

### Phase 2: Remove Mock Data (30 min)

#### Step 2.1: Fix Stories.jsx (10 min)
```
[ ] Remove: mockStories array (lines 10-17)
[ ] Remove: fallback logic (line 19)
[ ] Add: Empty state when stories.length === 0
[ ] Test: With real stories and with empty
```

#### Step 2.2: Fix ModernInstagramUI.jsx (15 min)
```
[ ] Remove: Hardcoded Unsplash URLs (lines 84-97)
[ ] Add: useState for explore content
[ ] Add: useEffect to fetch /api/explore
[ ] Add: Loading and error states
[ ] Test: Explore tab loads real data
```

#### Step 2.3: Fix ProfileCard.jsx (5 min)
```
[ ] Review: Default profile values
[ ] Decision: Keep as demo OR fetch from API
[ ] Add: Data validation
[ ] Test: With real and missing data
```

---

### Phase 3: Create Notifications Hook (15 min)

#### Step 3.1: Create useNotifications.js
```
[ ] Create: frontend/src/hooks/useNotifications.js
[ ] Add: apiGet call to /api/notifications
[ ] Add: useEffect with 30s refresh interval
[ ] Add: Error handling
[ ] Export: notificationCount, notifications, loading
```

#### Step 3.2: Update Navbar.jsx
```
[ ] Import: useNotifications hook
[ ] Replace: hardcoded notificationCount = 0
[ ] Use: Real notificationCount from hook
[ ] Test: Notification count updates
```

#### Step 3.3: Update Sidebar.jsx (UI Component)
```
[ ] Import: useNotifications hook
[ ] Replace: hardcoded useState(3)
[ ] Use: Real data
[ ] Test: Badge updates
```

#### Step 3.4: Update BottomNav.jsx
```
[ ] Import: useNotifications hook
[ ] Replace: hardcoded useState(3)
[ ] Use: Real data
[ ] Test: Mobile badge updates
```

---

### Phase 4: Optimization (20 min)

#### Step 4.1: Fix PostCard.jsx (10 min)
```
[ ] Remove: useEffect for like/comment counts
[ ] Add: useMemo for computed values
[ ] Verify: No performance issues
[ ] Test: Likes and comments display correctly
```

#### Step 4.2: Verify EditProfile.jsx (5 min)
```
[ ] Check: Backend routes at /backend/routes/user.routes.js
[ ] Verify: API paths match
[ ] Test: Profile update works
```

---

## 📋 Testing Checklist

### Before Deployment
- [ ] All 6 critical axios replacements done
- [ ] All mock data removed or handled
- [ ] useNotifications hook created and working
- [ ] All 40 components compile without errors
- [ ] No console errors on page load

### Functional Testing
- [ ] Create post → Shows in feed
- [ ] Like post → Count updates
- [ ] Comment on post → Shows immediately
- [ ] Delete post → Removed from feed
- [ ] Create story → Appears in stories
- [ ] View story → Marked as viewed
- [ ] Explore tab → Shows real content (not Unsplash)
- [ ] Notifications → Shows real count
- [ ] Search conversations → Local search works (may add backend later)

### Edge Cases
- [ ] Network error → Shows error message
- [ ] Empty posts → Shows "No posts" message
- [ ] Empty stories → Shows "No stories" message
- [ ] Slow network → Shows loading spinner
- [ ] Logged out → Redirects to login

---

## 🚀 Quick Reference - Files to Modify

```
CRITICAL (6 files):
  1. frontend/src/components/posts/CreatePost.jsx
  2. frontend/src/components/posts/Post.jsx
  3. frontend/src/components/posts/PostFeed.jsx
  4. frontend/src/components/stories/CreateStory.jsx
  5. frontend/src/components/stories/Story.jsx
  6. frontend/src/components/stories/StoryFeed.jsx

MEDIUM (5 files):
  7. frontend/src/components/ui/Stories.jsx
  8. frontend/src/components/ui/ModernInstagramUI.jsx
  9. frontend/src/components/ui/ProfileCard.jsx
 10. frontend/src/components/ui/Navbar.jsx
 11. frontend/src/components/ui/Sidebar.jsx (UI version)
 12. frontend/src/components/ui/BottomNav.jsx
 13. frontend/src/hooks/useNotifications.js (CREATE NEW)

LOW (2 files):
 14. frontend/src/components/ui/PostCard.jsx
 15. frontend/src/components/profile/EditProfile.jsx
```

---

## 📊 Estimated Timeline

| Phase | Tasks | Time | Status |
|-------|-------|------|--------|
| 1. Critical APIs | 6 files, 6 replacements | 40 min | 🔴 Pending |
| 2. Mock Data | 3 files, remove hardcoded | 30 min | 🔴 Pending |
| 3. Notifications | 1 hook + 3 components | 15 min | 🔴 Pending |
| 4. Optimization | 2 files, improvements | 20 min | 🔴 Pending |
| **Total** | **15 files, all fixes** | **~2 hours** | **🔴 Not Started** |

---

## ✅ Success Criteria

- ✅ All axios imports removed from components (except hooks)
- ✅ All API calls use centralized utils/api.js
- ✅ All mock data removed or properly flagged
- ✅ All components compile without errors
- ✅ All API endpoints verified to exist in backend
- ✅ Real notifications fetched from backend
- ✅ All functionality tested end-to-end
- ✅ No console errors or warnings

---

## 📞 Support Resources

**API Utility Documentation:**  
`frontend/src/utils/api.js` - Already configured with proper headers and error handling

**Hook Examples:**
- `useGetPosts` - Template for data fetching
- `useSendMessage` - Template for POST actions
- `useGetConversations` - Template for list data

**Backend Routes:**  
Check `backend/routes/` folder for available endpoints

---

## 🎯 Next Steps

1. **Review** this document and plan
2. **Start** with Phase 1 (Critical APIs)
3. **Test** each change immediately
4. **Commit** to version control frequently
5. **Deploy** only after all tests pass

---

**Document Generated:** June 1, 2026  
**Status:** READY FOR IMPLEMENTATION  
**Risk Level:** LOW (All fixes are straightforward replacements)
