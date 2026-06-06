# ChetGram Modern Instagram UI - Quick Reference & Cheat Sheet

## 🎯 Quick Start

### Import Everything
```jsx
import { 
  Navbar, 
  Sidebar, 
  BottomNav, 
  Stories, 
  PostCard, 
  ProfileCard, 
  ThemeToggle, 
  ModernInstagramUI,
  PostSkeleton,
  StoriesSkeletonLoader 
} from "./components/ui";
```

### Use Complete Demo
```jsx
import ModernInstagramUI from "./components/ui/ModernInstagramUI";

export default function Home() {
  return <ModernInstagramUI />;
}
```

## 📦 All Components at a Glance

| Component | Purpose | Required Props | Optional Props |
|-----------|---------|-----------------|-----------------|
| **Navbar** | Top navigation | None | `notificationCount` |
| **Stories** | Story carousel | None | `stories` |
| **PostCard** | Single post | `post` | None |
| **Sidebar** | Desktop nav | `activeTab`, `onTabChange`, `onLogout` | None |
| **BottomNav** | Mobile nav | `activeTab`, `onTabChange` | None |
| **ProfileCard** | User profile | `profile` | `onEdit`, `onFollow` |
| **ThemeToggle** | Dark/Light mode | None | None |
| **ModernInstagramUI** | Complete demo | None | None |

## 🎨 Component Features

### Navbar
```jsx
<Navbar notificationCount={3} />
```
- Search bar
- Notifications badge
- Theme toggle
- ChetGram logo

### Stories
```jsx
<Stories stories={storiesArray} />
```
- Story rings (colorful/grayscale)
- "Your Story" button
- Carousel navigation
- User names

### PostCard
```jsx
<PostCard post={postObject} />
```
- Image carousel
- Like/Comment/Share/Save buttons
- Like counter
- Caption display
- Comment section

### Sidebar
```jsx
<Sidebar 
  activeTab={activeTab}
  onTabChange={setActiveTab}
  onLogout={logout}
/>
```
- Menu: Home, Explore, Search, Notifications, Messages, Saved, Profile
- Collapsible
- Notification badges
- Create Post button

### BottomNav
```jsx
<BottomNav 
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```
- Tabs: Home, Search, Create, Notifications, Profile
- Active indicator
- Notification badges

### ProfileCard
```jsx
<ProfileCard 
  profile={profileObject}
  onEdit={editHandler}
  onFollow={followHandler}
/>
```
- Avatar with verification badge
- User info
- Stats (Posts, Followers, Following)
- Highlights
- Follow/Edit buttons

### ThemeToggle
```jsx
<ThemeToggle />
```
- Dark/Light mode toggle
- Auto saves preference
- System preference detection

## 📊 Data Formats

### Post Object
```javascript
{
  id: 1,
  author: "username",
  avatar: "imageUrl",
  timestamp: "2 hours ago",
  caption: "Post caption",
  likes: 1234,
  comments: 89,
  shares: 45,
  images: ["url1", "url2"]  // Array supports carousel
}
```

### Story Object
```javascript
{
  id: 1,
  username: "username",
  avatar: "imageUrl",
  viewed: false,        // Optional
  isOwn: false          // Optional - true for "Your Story"
}
```

### Profile Object
```javascript
{
  username: "username",
  fullName: "Full Name",
  bio: "Bio text",
  avatar: "imageUrl",
  posts: 142,
  followers: 5420,
  following: 386,
  verified: true,       // Optional
  isOwnProfile: true    // Optional
}
```

## 🎯 Common Use Cases

### Display Feed with Posts
```jsx
import { Stories, PostCard, Navbar, BottomNav } from "./components/ui";

export default function Feed() {
  const [activeTab, setActiveTab] = useState("home");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from API
  }, []);

  return (
    <>
      <Navbar />
      <Stories />
      <div>
        {posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}
```

### Show User Profile
```jsx
import { ProfileCard, Navbar } from "./components/ui";

export default function UserProfile() {
  return (
    <>
      <Navbar />
      <ProfileCard 
        profile={userProfile}
        onEdit={() => openEditModal()}
        onFollow={() => followUser()}
      />
    </>
  );
}
```

### Loading States
```jsx
import { PostSkeleton, StoriesSkeletonLoader } from "./components/ui";

export default function Feed() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <>
          <StoriesSkeletonLoader />
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : (
        <>
          <Stories />
          {/* Your posts */}
        </>
      )}
    </>
  );
}
```

## 🎨 Customization Snippets

### Change Primary Color
```jsx
// In any component, change:
"from-pink-500 to-purple-600"
// To:
"from-blue-500 to-cyan-600"
```

### Faster Animations
```jsx
// Change:
transition={{ duration: 0.4 }}
// To:
transition={{ duration: 0.2 }}
```

### Custom Notification Badge Color
```jsx
// Change:
className="bg-red-500"
// To:
className="bg-orange-500"
```

## 📱 Responsive Classes

- **Mobile**: `md:hidden` - Hides on tablet+
- **Desktop**: `hidden md:flex` - Shows only on tablet+
- **Mobile only**: `md:hidden`
- **Desktop only**: `hidden md:block`

## 🔄 State Management Example

```jsx
import { useState } from "react";
import { Sidebar, BottomNav } from "./components/ui";

function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === "home" && <Home />}
      {activeTab === "profile" && <Profile />}
      {activeTab === "explore" && <Explore />}
    </>
  );
}
```

## 🚨 Important Component Files

| File | Purpose |
|------|---------|
| `frontend/src/components/ui/Navbar.jsx` | Top navigation |
| `frontend/src/components/ui/Stories.jsx` | Story carousel |
| `frontend/src/components/ui/PostCard.jsx` | Post display |
| `frontend/src/components/ui/Sidebar.jsx` | Desktop nav |
| `frontend/src/components/ui/BottomNav.jsx` | Mobile nav |
| `frontend/src/components/ui/ProfileCard.jsx` | User profile |
| `frontend/src/components/ui/ThemeToggle.jsx` | Dark mode |
| `frontend/src/components/ui/ModernInstagramUI.jsx` | Complete demo |
| `frontend/src/components/ui/LoadingSkeletons.jsx` | Loading states |
| `frontend/src/components/ui/index.js` | Exports all |

## 📚 Documentation Files

- **Detailed Guide**: `INSTAGRAM_UI_COMPONENTS_GUIDE.md`
- **Integration Guide**: `CHETGRAM_UI_INTEGRATION_GUIDE.md`
- **Implementation Summary**: `MODERN_UI_IMPLEMENTATION_SUMMARY.md`

## ✅ Features Included

- ✅ Image carousel in posts
- ✅ Like/Comment/Share/Save buttons
- ✅ Like animation & counter
- ✅ Save/Bookmark toggle
- ✅ Story rings (viewed/unwatched)
- ✅ "Your Story" button
- ✅ Notification badges
- ✅ User verification badges
- ✅ Follow button
- ✅ Share button
- ✅ Dark/Light mode toggle
- ✅ Mobile/Desktop responsive
- ✅ Smooth Framer Motion animations
- ✅ Loading skeletons
- ✅ Glassmorphism design
- ✅ Modern gradients
- ✅ Professional shadows

## 🚀 Next Steps

1. **Use Components** in your app
2. **Connect API** for real data
3. **Customize** colors if needed
4. **Test** on mobile/desktop
5. **Deploy** with confidence

---

**Everything you need is ready. Happy coding! 🎉**
