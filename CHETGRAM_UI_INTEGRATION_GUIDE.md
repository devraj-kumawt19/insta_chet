# ChetGram Modern Instagram UI - Integration Guide

## Quick Integration Steps

### Option 1: Use Complete ModernInstagramUI (Recommended)

Replace your current Home.jsx with the ModernInstagramUI component:

```jsx
// frontend/src/pages/home/Home.jsx
import ModernInstagramUI from "../../components/ui/ModernInstagramUI";

const Home = () => {
	return <ModernInstagramUI />;
};

export default Home;
```

### Option 2: Build Your Own Using Individual Components

```jsx
// frontend/src/pages/home/Home.jsx
import { useState, useEffect } from "react";
import {
	Navbar,
	Sidebar,
	BottomNav,
	Stories,
	PostCard,
	PostSkeleton,
	StoriesSkeletonLoader,
} from "../../components/ui";
import axios from "axios";

const Home = () => {
	const [activeTab, setActiveTab] = useState("home");
	const [posts, setPosts] = useState([]);
	const [stories, setStories] = useState([]);
	const [loading, setLoading] = useState(true);

	// Fetch posts from your backend
	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await axios.get("/api/posts/feed");
				setPosts(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching posts:", error);
				setLoading(false);
			}
		};

		fetchPosts();
	}, []);

	// Fetch stories from your backend
	useEffect(() => {
		const fetchStories = async () => {
			try {
				const response = await axios.get("/api/stories/feed");
				setStories(response.data);
			} catch (error) {
				console.error("Error fetching stories:", error);
			}
		};

		fetchStories();
	}, []);

	const handleLogout = () => {
		// Call your logout function
		// logout();
	};

	return (
		<div className="min-h-screen bg-white dark:bg-neutral-950">
			{/* Navbar */}
			<Navbar notificationCount={3} />

			{/* Main Layout */}
			<div className="flex">
				{/* Sidebar for Desktop */}
				<Sidebar
					activeTab={activeTab}
					onTabChange={setActiveTab}
					onLogout={handleLogout}
				/>

				{/* Main Content */}
				<main className="flex-1 md:ml-80 pb-24 md:pb-0">
					<div className="max-w-2xl mx-auto p-4">
						{activeTab === "home" && (
							<>
								{loading ? (
									<>
										<StoriesSkeletonLoader />
										<PostSkeleton />
										<PostSkeleton />
									</>
								) : (
									<>
										<Stories stories={stories} />
										<div className="space-y-6">
											{posts.map((post) => (
												<PostCard key={post._id} post={post} />
											))}
										</div>
									</>
								)}
							</>
						)}

						{/* Add other tab content here */}
					</div>
				</main>
			</div>

			{/* Bottom Navigation for Mobile */}
			<BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
		</div>
	);
};

export default Home;
```

## Component API Reference

### Navbar Props
```jsx
<Navbar 
  notificationCount={number}  // Optional: number of notifications (default: 0)
/>
```

### Stories Props
```jsx
<Stories 
  stories={[
    {
      id: number,
      username: string,
      avatar: string (URL),
      viewed: boolean,    // Optional: default false
      isOwn: boolean      // Optional: true for "Your Story"
    }
  ]}  // Optional: defaults to mock data if not provided
/>
```

### PostCard Props
```jsx
<PostCard 
  post={{
    id: number,
    author: string,
    avatar: string (URL),
    timestamp: string,      // e.g., "2 hours ago"
    caption: string,
    likes: number,
    comments: number,
    shares: number,
    images: string[]        // Array of image URLs (min 1, supports carousel)
  }}
/>
```

### Sidebar Props
```jsx
<Sidebar 
  activeTab={string}                              // Current active tab
  onTabChange={(tabId: string) => void}          // Callback when tab changes
  onLogout={() => void}                           // Callback for logout button
/>
```

### BottomNav Props
```jsx
<BottomNav 
  activeTab={string}                              // Current active tab
  onTabChange={(tabId: string) => void}          // Callback when tab changes
/>
```

### ProfileCard Props
```jsx
<ProfileCard 
  profile={{
    username: string,
    fullName: string,
    bio: string,
    avatar: string (URL),
    posts: number,
    followers: number,
    following: number,
    verified: boolean,      // Optional: default false
    isOwnProfile: boolean   // Optional: default true
  }}
  onEdit={() => void}                             // Callback for edit button
  onFollow={() => void}                           // Callback for follow button
/>
```

### ThemeToggle Props
```jsx
<ThemeToggle />  // No props needed - handles its own state
```

### Loading Skeletons
```jsx
import { 
  PostSkeleton, 
  StorySkeleton,
  StoriesSkeletonLoader,
  ProfileCardSkeleton 
} from "./components/ui";

// Usage
{loading ? <PostSkeleton /> : <PostCard post={post} />}
{loading ? <StoriesSkeletonLoader /> : <Stories />}
{loading ? <ProfileCardSkeleton /> : <ProfileCard />}
```

## Data Format Examples

### Post Object
```javascript
const post = {
  id: 1,
  author: "sarah_dev",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  timestamp: "2 hours ago",
  caption: "Beautiful sunset at the beach! 🌅 #photography #nature",
  likes: 1234,
  comments: 89,
  shares: 45,
  images: [
    "https://images.unsplash.com/photo-507003211169-0a1dd7228f2d?w=500&h=500",
    "https://images.unsplash.com/photo-506794778202-cad84cf45f1d?w=500&h=500",
  ]
};
```

### Story Object
```javascript
const story = {
  id: 1,
  username: "sarah_dev",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  viewed: false,
  isOwn: false  // true for "Your Story" button
};
```

### Profile Object
```javascript
const profile = {
  username: "sarah_dev",
  fullName: "Sarah Developer",
  bio: "🚀 Full Stack Developer | 📸 Photography lover | ☕ Coffee addict",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  posts: 142,
  followers: 5420,
  following: 386,
  verified: true,
  isOwnProfile: true
};
```

## Styling Customization

### Color Scheme
All components use Tailwind CSS and can be customized by modifying:

- **Primary Gradient**: `from-pink-500 to-purple-600`
- **Text Colors**: `text-neutral-900 dark:text-neutral-50`
- **Background**: `bg-white dark:bg-neutral-900`
- **Borders**: `border-neutral-200 dark:border-neutral-800`

Edit in each component file:
```jsx
// Change primary color
className="bg-gradient-to-r from-blue-500 to-cyan-600"

// Change text color
className="text-neutral-900 dark:text-neutral-50"

// Change background
className="bg-white dark:bg-gray-900"
```

### Animation Speed
Modify Framer Motion transition durations:
```jsx
// Current
transition={{ duration: 0.4 }}

// Make faster
transition={{ duration: 0.2 }}

// Make slower
transition={{ duration: 0.8 }}
```

## Connecting to Your Backend

### Example: Fetching Real Data

```jsx
import axios from "axios";

const [posts, setPosts] = useState([]);

useEffect(() => {
  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/posts/feed");
      // Transform your backend data to match PostCard format
      const formattedPosts = response.data.map(post => ({
        id: post._id,
        author: post.author.username,
        avatar: post.author.profilePic,
        timestamp: formatTime(post.createdAt),
        caption: post.caption,
        likes: post.likes.length,
        comments: post.comments.length,
        shares: post.shares || 0,
        images: [post.image]  // Or multiple images if supported
      }));
      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  fetchPosts();
}, []);

// Render
{posts.map(post => <PostCard key={post.id} post={post} />)}
```

## Mobile Responsive Behavior

- **Mobile (< 768px)**: 
  - Hides Sidebar
  - Shows BottomNav
  - Full-width content
  
- **Tablet (768px - 1024px)**:
  - Shows collapsed Sidebar
  - Shows BottomNav
  - Content adjusted

- **Desktop (> 1024px)**:
  - Shows expanded Sidebar
  - Hides BottomNav
  - Sidebar width: 280px (md:ml-80)

## Dark Mode Support

Dark mode is automatically handled by:
1. System preference detection on load
2. Manual toggle via ThemeToggle component
3. Persistence in localStorage under "theme" key
4. All components use `dark:` Tailwind prefixes

To toggle dark mode programmatically:
```jsx
// In any component
const toggleDarkMode = () => {
  const isDark = document.documentElement.classList.contains("dark");
  if (isDark) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
};
```

## Performance Tips

1. **Use React.memo for PostCard:**
```jsx
const MemoizedPostCard = React.memo(PostCard);
```

2. **Implement pagination:**
```jsx
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  const response = await axios.get(`/api/posts?page=${page + 1}`);
  setPosts([...posts, ...response.data]);
};
```

3. **Lazy load images:**
```jsx
<img 
  loading="lazy"
  src={imageUrl}
  alt="Post"
/>
```

## Accessibility

All components include:
- Proper semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- High contrast colors for readability
- Focus indicators on interactive elements

## Troubleshooting

**Q: Components not showing styles**
- A: Ensure Tailwind CSS is properly configured in tailwind.config.js
- Make sure dark mode is enabled in Tailwind config

**Q: Animations not smooth**
- A: Check if Framer Motion is installed: `npm install framer-motion`
- Ensure you're not running too many animations simultaneously

**Q: Images not loading**
- A: The demo uses placeholder services. Replace with real image URLs from your backend
- Check image URL format and accessibility

**Q: Dark mode not working**
- A: Verify Tailwind dark mode is enabled in config
- Check localStorage for "theme" key
- Ensure `dark:` classes are present in components

---

## Ready to Deploy!

Once you've integrated these components:

1. ✅ Test on mobile, tablet, and desktop
2. ✅ Connect real data from your API
3. ✅ Customize colors if needed
4. ✅ Test dark mode functionality
5. ✅ Verify all animations are smooth
6. ✅ Deploy with confidence!

---

**Need help? Check the individual component files for more detailed documentation.**
