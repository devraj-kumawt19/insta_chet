# Modern Instagram-Inspired UI Components

A complete production-ready component library for building modern Instagram-like social media applications using React.js, Tailwind CSS, and Framer Motion.

## 📦 Components Included

### 1. **Navbar.jsx**
Top navigation bar with:
- Logo and branding
- Search functionality
- Notification badge
- Dark/Light mode toggle
- Sticky positioning with blur effect

```jsx
import Navbar from "./components/ui/Navbar";

<Navbar notificationCount={3} />
```

### 2. **Stories.jsx**
Animated story carousel with:
- Circular avatar rings (colorful for unwatched, grayscale for watched)
- "Your Story" button with add icon
- Smooth scroll with navigation buttons
- Responsive design
- User-specific viewing status

```jsx
import Stories from "./components/ui/Stories";

const stories = [
  { id: 1, username: "user1", avatar: "url", viewed: false },
  { id: 2, username: "user2", avatar: "url", viewed: true },
];

<Stories stories={stories} />
```

### 3. **PostCard.jsx**
Complete social media post component with:
- User header with avatar and timestamp
- Image carousel with navigation
- Like, comment, share, save buttons with animations
- Like count display
- Caption with user mention
- Comment count and share count
- Comment input field
- Smooth animations and hover effects

```jsx
import PostCard from "./components/ui/PostCard";

const post = {
  id: 1,
  author: "username",
  avatar: "url",
  timestamp: "2 hours ago",
  caption: "Post caption here",
  likes: 1234,
  comments: 89,
  shares: 45,
  images: ["url1", "url2", "url3"],
};

<PostCard post={post} />
```

### 4. **Sidebar.jsx**
Desktop sidebar navigation with:
- Expandable/collapsible functionality
- Menu items: Home, Explore, Search, Notifications, Messages, Saved, Profile
- Active state indicator
- Notification badges
- Create Post button
- Logout button
- Smooth animations

```jsx
import Sidebar from "./components/ui/Sidebar";

<Sidebar 
  activeTab="home" 
  onTabChange={(tab) => setActiveTab(tab)}
  onLogout={() => logout()}
/>
```

### 5. **BottomNav.jsx**
Mobile bottom navigation bar with:
- Bottom tabs: Home, Search, Create, Notifications, Profile
- Active state styling
- Notification badges
- Smooth animations

```jsx
import BottomNav from "./components/ui/BottomNav";

<BottomNav 
  activeTab="home" 
  onTabChange={(tab) => setActiveTab(tab)}
/>
```

### 6. **ProfileCard.jsx**
User profile component with:
- Avatar with verification badge
- User info (name, username, bio)
- Follow/Unfollow button
- Edit Profile button (for own profile)
- Stats: Posts, Followers, Following
- Highlights section
- Share button
- Professional glassmorphism design

```jsx
import ProfileCard from "./components/ui/ProfileCard";

<ProfileCard 
  profile={{
    username: "user123",
    fullName: "User Name",
    bio: "Bio text",
    avatar: "url",
    posts: 142,
    followers: 5420,
    following: 386,
    verified: true,
    isOwnProfile: true,
  }}
  onEdit={() => openEditModal()}
  onFollow={() => followUser()}
/>
```

### 7. **ThemeToggle.jsx**
Dark/Light mode toggle button:
- Automatic detection of user preference
- LocalStorage persistence
- Smooth animations
- Updates document classList

```jsx
import ThemeToggle from "./components/ui/ThemeToggle";

<ThemeToggle />
```

### 8. **LoadingSkeletons.jsx**
Loading placeholder components:
- `PostSkeleton` - Post card skeleton
- `StorySkeleton` - Story skeleton
- `StoriesSkeletonLoader` - Complete stories carousel skeleton
- `ProfileCardSkeleton` - Profile card skeleton
- Pulsing animations

```jsx
import { PostSkeleton, StoriesSkeletonLoader, ProfileCardSkeleton } from "./components/ui/LoadingSkeletons";

{loading ? <PostSkeleton /> : <PostCard />}
```

### 9. **ModernInstagramUI.jsx**
Complete demo application showing:
- All components integrated
- Tab navigation system
- Feed with multiple posts
- Explore grid
- Notifications
- Messages
- Trending hashtags
- Saved posts

## 🎨 Design Features

### Glassmorphism
- Frosted glass effects with backdrop blur
- Semi-transparent backgrounds
- Perfect for modern UI

### Animations (Framer Motion)
- Smooth page transitions
- Hover effects on interactive elements
- Staggered animations
- Spring physics for natural motion

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop layout
- Touch-friendly buttons

### Dark Mode Support
- Complete dark theme coverage
- Smooth transitions
- System preference detection
- Manual toggle option

### Modern Gradients
- Pink to Purple gradients
- Indigo accents
- Smooth color transitions
- Hover state gradients

### Typography
- Clean font hierarchy
- Readable text sizes
- Proper contrast ratios
- Professional appearance

## 🚀 Quick Start

### Installation

1. **Ensure dependencies are installed:**
```bash
cd frontend
npm install framer-motion react-icons axios
```

2. **Import and use in your app:**
```jsx
import ModernInstagramUI from "./components/ui/ModernInstagramUI";

function App() {
  return <ModernInstagramUI />;
}
```

### Individual Component Usage

```jsx
import Navbar from "./components/ui/Navbar";
import Stories from "./components/ui/Stories";
import PostCard from "./components/ui/PostCard";
import BottomNav from "./components/ui/BottomNav";
import Sidebar from "./components/ui/Sidebar";
import ProfileCard from "./components/ui/ProfileCard";
import ThemeToggle from "./components/ui/ThemeToggle";

function Home() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <Navbar notificationCount={3} />
      
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        />
        
        <main className="flex-1 md:ml-80 pb-24 md:pb-0">
          <Stories />
          <PostCard post={mockPost} />
        </main>
      </div>
      
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />
    </div>
  );
}
```

## 🎯 Integration with Existing App

To integrate into your existing ChetGram app:

1. **Update your Home.jsx:**
```jsx
import ModernInstagramUI from "./components/ui/ModernInstagramUI";

const Home = () => {
  return <ModernInstagramUI />;
};
```

2. **Or use individual components:**
```jsx
import Navbar from "./components/ui/Navbar";
import Stories from "./components/ui/Stories";
import Sidebar from "./components/ui/Sidebar";
import BottomNav from "./components/ui/BottomNav";

const Home = () => {
  // Your implementation
};
```

## 🎨 Customization

### Colors
All components use Tailwind CSS classes. Modify the color scheme by updating:
- `from-pink-500 to-purple-600` - Primary gradient
- `text-neutral-900 dark:text-neutral-50` - Text colors
- `bg-white dark:bg-neutral-900` - Background colors

### Animation Duration
Adjust animation speeds in `transition` props:
```jsx
transition={{ duration: 0.4 }} // Change duration in seconds
```

### Component Props
Each component accepts optional props for customization:
```jsx
<PostCard 
  post={customPost}
  onLike={handleLike}
  onComment={handleComment}
/>
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px - Uses BottomNav
- **Tablet**: 768px - 1024px - Sidebar partially visible
- **Desktop**: > 1024px - Full Sidebar visible

## 🔧 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "framer-motion": "^latest",
  "react-icons": "^5.6.0",
  "tailwindcss": "^3.4.1"
}
```

## 📸 Features Checklist

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Light and Dark Mode support
- ✅ Stories carousel with colorful rings
- ✅ Image carousel in posts
- ✅ Like, Comment, Share, Save buttons
- ✅ Notification badges
- ✅ Loading skeletons
- ✅ Smooth animations with Framer Motion
- ✅ Glassmorphism design
- ✅ Modern gradients and shadows
- ✅ Professional typography
- ✅ Reusable components
- ✅ Best coding practices
- ✅ Production-ready code

## 🎯 Best Practices

1. **Component Organization**: Keep components in separate files
2. **Props Validation**: Pass data through props
3. **State Management**: Use React hooks or Zustand
4. **Performance**: Use React.memo for expensive components
5. **Accessibility**: Include alt texts and ARIA labels
6. **Mobile First**: Design for mobile, enhance for desktop

## 📝 Notes

- All components are fully controlled via props
- Images use placeholder services (Unsplash, DiceBear)
- Replace with real data from your backend
- Animations use Framer Motion for smooth performance
- Tailwind CSS handles all styling

## 🤝 Contributing

To add new features:
1. Create new component files in `/components/ui/`
2. Follow the existing naming conventions
3. Include Framer Motion animations
4. Add Tailwind CSS styling
5. Export from component files

---

**Ready to use! Start with `ModernInstagramUI.jsx` or integrate individual components into your existing app.**
