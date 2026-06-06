# Frontend Integration Issues Report
**Generated:** June 1, 2026  
**Scope:** `frontend/src` folder - 40 JSX component files

---

## 📋 EXECUTIVE SUMMARY

**Critical Issues Found: 15+**

### Issue Categories:
1. ❌ **Direct Axios Usage Instead of API Utility** (6 components)
2. ❌ **Hardcoded Mock Data** (2 components)
3. ❌ **Hardcoded Placeholder Values** (3 components)
4. ❌ **Unsplash API URLs for Dummy Content** (1 component)
5. ⚠️ **Inefficient useEffect Patterns** (1 component)
6. ✅ **Properly Integrated Components** (26 components)

---

## 🔴 CRITICAL ISSUES

### Category 1: Direct Axios Calls (Should Use API Utility)

These components import `axios` directly instead of using the centralized `utils/api.js` helper functions.

#### [1] **CreatePost.jsx** - Direct axios.post
- **File:** [components/posts/CreatePost.jsx](components/posts/CreatePost.jsx)
- **Line:** 5 (import), 36 (usage)
- **Issue:** 
  ```jsx
  import axios from "axios";  // Line 5
  const response = await axios.post("/api/posts/create", {...});  // Line 36
  ```
- **Should Be:** `import { apiPost } from "../../utils/api"`
- **Error Type:** Not using centralized API error handling and configuration

---

#### [2] **PostFeed.jsx** - Direct axios.get
- **File:** [components/posts/PostFeed.jsx](components/posts/PostFeed.jsx)
- **Line:** 2 (import), 14 (usage)
- **Issue:**
  ```jsx
  import axios from "axios";  // Line 2
  const response = await axios.get("/api/posts/feed");  // Line 14
  ```
- **Should Be:** Uses `useGetPosts` hook instead (PARTIALLY CORRECT)
- **Why It's Still An Issue:** Component directly uses axios inside useEffect instead of relying on the hook consistently

---

#### [3] **Post.jsx** - Multiple Direct Axios Calls
- **File:** [components/posts/Post.jsx](components/posts/Post.jsx)
- **Lines:** 7 (import), 20, 33, 47 (usages)
- **Issues:**
  ```jsx
  import axios from "axios";  // Line 7
  await axios.post(`/api/posts/${post._id}/like`);  // Line 20
  await axios.post(`/api/posts/${post._id}/comment`, {...});  // Line 33
  await axios.delete(`/api/posts/${post._id}`);  // Line 47
  ```
- **Should Be:** Use `usePostInteractions` hook properly or use api utility functions
- **Status:** Hook exists but component uses axios directly

---

#### [4] **CreateStory.jsx** - Direct axios.post
- **File:** [components/stories/CreateStory.jsx](components/stories/CreateStory.jsx)
- **Lines:** 5 (import), 21 (usage)
- **Issue:**
  ```jsx
  import axios from "axios";  // Line 5
  const response = await axios.post("/api/stories/create", {...});  // Line 21
  ```
- **Should Be:** `import { apiPost } from "../../utils/api"`

---

#### [5] **Story.jsx** - Multiple Direct Axios Calls
- **File:** [components/stories/Story.jsx](components/stories/Story.jsx)
- **Lines:** 6 (import), 16, 28 (usages)
- **Issues:**
  ```jsx
  import axios from "axios";  // Line 6
  await axios.post(`/api/stories/${story._id}/view`);  // Line 16
  await axios.delete(`/api/stories/${story._id}`);  // Line 28
  ```
- **Should Be:** Use api utility functions from `utils/api.js`

---

#### [6] **StoryFeed.jsx** - Direct axios.get
- **File:** [components/stories/StoryFeed.jsx](components/stories/StoryFeed.jsx)
- **Lines:** 2 (import), 16 (usage)
- **Issue:**
  ```jsx
  import axios from "axios";  // Line 2
  const response = await axios.get("/api/stories/feed");  // Line 16
  ```
- **Should Be:** `import { apiGet } from "../../utils/api"` (or create a hook)

---

### Category 2: Hardcoded Mock Data

#### [7] **Stories.jsx** - Hardcoded Mock Stories
- **File:** [components/ui/Stories.jsx](components/ui/Stories.jsx)
- **Lines:** 10-17 (mockStories definition)
- **Issue:**
  ```jsx
  const mockStories = [
    { id: 1, username: "Your Story", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user", isOwn: true },
    { id: 2, username: "sarah_dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah", viewed: false },
    { id: 3, username: "alex_code", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex", viewed: true },
    // ... 3 more
  ];
  const displayStories = stories.length > 0 ? stories : mockStories;  // Line 19
  ```
- **Problem:** Fallback to mock data hides missing API integration
- **Should Be:** Show "No stories yet" message or loading state instead

---

#### [8] **ProfileCard.jsx** - Hardcoded Default Profile
- **File:** [components/ui/ProfileCard.jsx](components/ui/ProfileCard.jsx)
- **Lines:** 15-23 (default profile object)
- **Issue:**
  ```jsx
  profile = {
    username: "sarah_dev",
    fullName: "Sarah Developer",
    bio: "🚀 Full Stack Developer | 📸 Photography lover | ☕ Coffee addict",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    posts: 142,
    followers: 5420,
    following: 386,
    verified: true,
    isOwnProfile: true,
  }
  ```
- **Problem:** If profile prop is not passed, shows fake data instead of error or loading
- **Should Be:** Validate profile data and show appropriate UI state

---

### Category 3: Dummy/Hardcoded Data Without Fetching

#### [9] **ModernInstagramUI.jsx** - Hardcoded Unsplash URLs
- **File:** [components/ui/ModernInstagramUI.jsx](components/ui/ModernInstagramUI.jsx)
- **Lines:** 84-97
- **Issue:**
  ```jsx
  {activeTab === "explore" && (
    <div className="grid grid-cols-3 gap-4">
      {[...Array(12)].map((_, idx) => (
        <img
          src={`https://images.unsplash.com/photo-${1500000000000 + idx}?w=300&h=300&fit=crop`}
          alt={`Explore ${idx}`}
        />
      ))}
    </div>
  )}
  ```
- **Problem:** No API call for explore tab; uses fake Unsplash URLs
- **Should Be:** Fetch explore data from backend API

---

#### [10] **Navbar.jsx** - Hardcoded Notification Count
- **File:** [components/ui/Navbar.jsx](components/ui/Navbar.jsx)
- **Line:** 6
- **Issue:**
  ```jsx
  const Navbar = ({ notificationCount = 0 }) => {
  ```
- **Problem:** Default hardcoded to 0; never fetches actual notification count
- **Should Be:** Either pass real count or fetch from API

---

#### [11] **Sidebar.jsx** (UI Component) - Hardcoded Notification Count
- **File:** [components/ui/Sidebar.jsx](components/ui/Sidebar.jsx)
- **Line:** 18
- **Issue:**
  ```jsx
  const [notificationCount] = useState(3);  // Hardcoded to 3
  ```
- **Problem:** Always shows 3 notifications regardless of actual data
- **Should Be:** Fetch actual notification count from backend

---

#### [12] **BottomNav.jsx** - Hardcoded Notification Count
- **File:** [components/ui/BottomNav.jsx](components/ui/BottomNav.jsx)
- **Line:** 11
- **Issue:**
  ```jsx
  const [notificationCount] = useState(3);  // Hardcoded to 3
  ```
- **Problem:** Always shows 3 notifications 
- **Should Be:** Real notification data from API

---

### Category 4: Inefficient Patterns

#### [13] **PostCard.jsx** - Unnecessary useEffect for State Calculation
- **File:** [components/ui/PostCard.jsx](components/ui/PostCard.jsx)
- **Lines:** 25-34
- **Issue:**
  ```jsx
  useEffect(() => {
    if (post && post.likes) {
      setLikeCount(post.likes.length);
      setLiked(post.likes.includes(authUser?._id));
    }
    if (post && post.comments) {
      setCommentCount(post.comments.length);
    }
  }, [post, authUser?._id]);
  ```
- **Problem:** Computing state from props in useEffect causes render lag; should compute directly
- **Should Be:** 
  ```jsx
  const likeCount = post?.likes?.length || 0;
  const liked = post?.likes?.includes(authUser?._id) || false;
  ```

---

#### [14] **SearchInput.jsx** - Local Search Instead of API
- **File:** [components/sidebar/SearchInput.jsx](components/sidebar/SearchInput.jsx)
- **Lines:** 12-24
- **Issue:**
  ```jsx
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search term must be at least 3 characters long");
    }
    
    const conversation = conversations.find((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase())
    );  // Line 19-20: Searches in already-loaded data, not backend
  ```
- **Problem:** Only searches within conversations already loaded in memory; doesn't search backend for new users
- **Should Be:** Call backend search API instead

---

### Category 5: Missing API Endpoints or Mismatches

#### [15] **EditProfile.jsx** - Potential API Endpoint Mismatch
- **File:** [components/profile/EditProfile.jsx](components/profile/EditProfile.jsx)
- **Lines:** 49, 67
- **Issue:**
  ```jsx
  const data = await apiPost("/api/users/upload-profile-pic", formData);  // Line 49
  const data = await apiPut("/api/users/profile/update", {...});  // Line 67
  ```
- **Problem:** Endpoints use `/users/` prefix without `/api/` - may not match backend routes
- **Check:** Verify backend routes at `backend/routes/user.routes.js`
- **Likely Issue:** Should be `/api/users/upload-profile-pic` and `/api/users/profile/update`

---

## ✅ PROPERLY INTEGRATED COMPONENTS

These components correctly use hooks or API utilities:

- [x] **Messages.jsx** - Uses `useGetMessages` hook ✅
- [x] **MessageInput.jsx** - Uses `useSendMessage` hook ✅
- [x] **MessageContainer.jsx** - Proper context usage ✅
- [x] **Conversations.jsx** - Uses `useGetConversations` hook ✅
- [x] **Conversation.jsx** - Proper data handling ✅
- [x] **Login.jsx** - Uses `useLogin` hook ✅
- [x] **SignUp.jsx** - Uses `useSignup` hook ✅
- [x] **UserProfile.jsx** - Uses `useGetUserProfile` and `useFollowUser` hooks ✅
- [x] **ProfileEditor.jsx** - Uses `apiPost`/`apiPut` utilities ✅
- [x] **MyProfile.jsx** - Uses `useAuthContext` properly ✅
- [x] **Sidebar.jsx** (messaging sidebar) - Uses proper hooks ✅
- [x] **VideoCall.jsx** - Uses socket and context properly ✅
- [x] **ModernInstagramUI.jsx** - Uses `useGetPosts` hook (mostly correct) ✅

---

## 📊 SUMMARY TABLE

| Component | File | Issue | Severity | Type |
|-----------|------|-------|----------|------|
| CreatePost | `posts/CreatePost.jsx` | Direct axios import | 🔴 High | API Integration |
| Post | `posts/Post.jsx` | 3× axios calls | 🔴 High | API Integration |
| PostFeed | `posts/PostFeed.jsx` | axios.get | 🔴 High | API Integration |
| CreateStory | `stories/CreateStory.jsx` | Direct axios import | 🔴 High | API Integration |
| Story | `stories/Story.jsx` | 2× axios calls | 🔴 High | API Integration |
| StoryFeed | `stories/StoryFeed.jsx` | axios.get | 🔴 High | API Integration |
| Stories | `ui/Stories.jsx` | Mock data array | 🟡 Medium | Mock Data |
| ProfileCard | `ui/ProfileCard.jsx` | Default hardcoded profile | 🟡 Medium | Mock Data |
| ModernInstagramUI | `ui/ModernInstagramUI.jsx` | Unsplash dummy URLs | 🟡 Medium | Mock Data |
| Navbar | `ui/Navbar.jsx` | Hardcoded notifications | 🟡 Medium | Dummy Data |
| Sidebar (UI) | `ui/Sidebar.jsx` | Hardcoded notifications | 🟡 Medium | Dummy Data |
| BottomNav | `ui/BottomNav.jsx` | Hardcoded notifications | 🟡 Medium | Dummy Data |
| PostCard | `ui/PostCard.jsx` | Inefficient useEffect | 🟠 Low | Pattern Issue |
| SearchInput | `sidebar/SearchInput.jsx` | Local search only | 🟠 Low | Feature Gap |
| EditProfile | `profile/EditProfile.jsx` | Endpoint mismatch | 🟠 Low | Potential Issue |

---

## 🔧 RECOMMENDED FIXES (Priority Order)

### Priority 1: Replace All Axios Calls (CRITICAL)
1. Replace 9 axios imports with api utility
2. Ensure consistent error handling
3. Test all API endpoints

### Priority 2: Remove Mock Data (HIGH)
1. Replace mock Stories with "No data" state
2. Remove hardcoded ProfileCard defaults
3. Fetch explore images from backend

### Priority 3: Fix Notifications (MEDIUM)
1. Create notification fetching hook
2. Update Navbar, Sidebar, BottomNav to use real data
3. Connect to backend notification system

### Priority 4: Optimize Components (LOW)
1. Fix PostCard useEffect pattern
2. Implement backend search API
3. Verify EditProfile endpoints

---

## 📝 NOTES

- **Hooks Directory:** 11 custom hooks in `frontend/src/hooks/` - most are properly integrated
- **API Utility:** `frontend/src/utils/api.js` has proper setup with `apiGet`, `apiPost`, `apiPut`, `apiDelete`
- **Context System:** 3 context providers (Auth, Socket, Theme) working correctly
- **Components Without Issues:** 26 components are properly integrated (65% pass rate)

