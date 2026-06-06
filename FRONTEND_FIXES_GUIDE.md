# Frontend Integration Fixes - Code Snippets

## Quick Fix Reference

---

## 🔧 FIX 1: CreatePost.jsx - Replace Axios

### ❌ CURRENT (Lines 5, 36)
```jsx
import axios from "axios";
import toast from "react-hot-toast";

const CreatePost = ({ onPostCreated }) => {
  // ...
  
  const handlePost = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/posts/create", {
        caption,
        image: preview,
      });
      onPostCreated && onPostCreated(response.data);
      // ...
    } catch (error) {
      toast.error("Failed to create post");
    }
  };
```

### ✅ FIXED
```jsx
import { apiPost } from "../../utils/api";
import toast from "react-hot-toast";

const CreatePost = ({ onPostCreated }) => {
  // ...
  
  const handlePost = async () => {
    try {
      setLoading(true);
      const response = await apiPost("/api/posts/create", {
        caption,
        image: preview,
      });
      onPostCreated && onPostCreated(response);
      setCaption("");
      setImage(null);
      setPreview(null);
      toast.success("Post created!");
    } catch (error) {
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };
```

---

## 🔧 FIX 2: PostFeed.jsx - Replace Axios

### ❌ CURRENT (Lines 2, 14)
```jsx
import axios from "axios";

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/posts/feed");
      setPosts(response.data);
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };
```

### ✅ FIXED
```jsx
import { apiGet } from "../../utils/api";

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await apiGet("/api/posts/feed");
      setPosts(response || []);
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };
```

---

## 🔧 FIX 3: Post.jsx - Replace All Axios Calls

### ❌ CURRENT (Lines 20, 33, 47)
```jsx
import axios from "axios";

const handleLike = async () => {
  try {
    const response = await axios.post(`/api/posts/${post._id}/like`);
    setIsLiked(!isLiked);
    setLikesCount(response.data.likes.length);
  } catch (error) {
    toast.error("Failed to like post");
  }
};

const handleAddComment = async () => {
  try {
    const response = await axios.post(`/api/posts/${post._id}/comment`, {
      text: newComment,
    });
    setComments(response.data.comments);
    setNewComment("");
  } catch (error) {
    toast.error("Failed to add comment");
  }
};

const handleDelete = async () => {
  try {
    await axios.delete(`/api/posts/${post._id}`);
    onDelete && onDelete(post._id);
  } catch (error) {
    toast.error("Failed to delete post");
  }
};
```

### ✅ FIXED
```jsx
import { apiPost, apiDelete } from "../../utils/api";

const handleLike = async () => {
  try {
    const response = await apiPost(`/api/posts/${post._id}/like`, {});
    setIsLiked(!isLiked);
    setLikesCount(response.likes?.length || 0);
    onLikeChange && onLikeChange();
  } catch (error) {
    toast.error("Failed to like post");
  }
};

const handleAddComment = async () => {
  if (!newComment.trim()) return;
  
  try {
    const response = await apiPost(`/api/posts/${post._id}/comment`, {
      text: newComment,
    });
    setComments(response.comments || []);
    setNewComment("");
  } catch (error) {
    toast.error("Failed to add comment");
  }
};

const handleDelete = async () => {
  if (!window.confirm("Delete this post?")) return;
  
  try {
    await apiDelete(`/api/posts/${post._id}`);
    onDelete && onDelete(post._id);
    toast.success("Post deleted");
  } catch (error) {
    toast.error("Failed to delete post");
  }
};
```

---

## 🔧 FIX 4: CreateStory.jsx - Replace Axios

### ❌ CURRENT (Lines 5, 21)
```jsx
import axios from "axios";

const handleImageSelect = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/stories/create", {
          image: reader.result,
        });
        onStoryCreated && onStoryCreated(response.data);
        toast.success("Story posted!");
      } catch (error) {
        toast.error("Failed to create story");
      } finally {
        setLoading(false);
        setPreview(null);
      }
    };
    reader.readAsDataURL(file);
  }
};
```

### ✅ FIXED
```jsx
import { apiPost } from "../../utils/api";

const handleImageSelect = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setLoading(true);
        const response = await apiPost("/api/stories/create", {
          image: reader.result,
        });
        onStoryCreated && onStoryCreated(response);
        toast.success("Story posted!");
      } catch (error) {
        toast.error("Failed to create story");
      } finally {
        setLoading(false);
        setPreview(null);
      }
    };
    reader.readAsDataURL(file);
  }
};
```

---

## 🔧 FIX 5: Story.jsx - Replace Axios

### ❌ CURRENT (Lines 16, 28)
```jsx
import axios from "axios";

const handleView = async () => {
  try {
    await axios.post(`/api/stories/${story._id}/view`);
    onView && onView();
    setShowFull(true);
  } catch (error) {
    console.error("Failed to mark story as viewed");
  }
};

const handleDelete = async () => {
  if (!window.confirm("Delete this story?")) return;

  try {
    await axios.delete(`/api/stories/${story._id}`);
    onDelete && onDelete(story._id);
    toast.success("Story deleted");
  } catch (error) {
    toast.error("Failed to delete story");
  }
};
```

### ✅ FIXED
```jsx
import { apiPost, apiDelete } from "../../utils/api";

const handleView = async () => {
  try {
    await apiPost(`/api/stories/${story._id}/view`, {});
    onView && onView();
    setShowFull(true);
  } catch (error) {
    console.error("Failed to mark story as viewed:", error);
  }
};

const handleDelete = async () => {
  if (!window.confirm("Delete this story?")) return;

  try {
    await apiDelete(`/api/stories/${story._id}`);
    onDelete && onDelete(story._id);
    toast.success("Story deleted");
  } catch (error) {
    toast.error("Failed to delete story");
  }
};
```

---

## 🔧 FIX 6: StoryFeed.jsx - Replace Axios

### ❌ CURRENT (Lines 2, 16)
```jsx
import axios from "axios";

const fetchStories = async () => {
  try {
    setLoading(true);
    const response = await axios.get("/api/stories/feed");
    setStories(response.data);
  } catch (error) {
    toast.error("Failed to load stories");
  } finally {
    setLoading(false);
  }
};
```

### ✅ FIXED
```jsx
import { apiGet } from "../../utils/api";

const fetchStories = async () => {
  try {
    setLoading(true);
    const response = await apiGet("/api/stories/feed");
    setStories(response || []);
  } catch (error) {
    toast.error("Failed to load stories");
  } finally {
    setLoading(false);
  }
};
```

---

## 🔧 FIX 7: Stories.jsx - Remove Mock Data

### ❌ CURRENT (Lines 10-19)
```jsx
const Stories = ({ stories = [] }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const mockStories = [
    { id: 1, username: "Your Story", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user", isOwn: true },
    { id: 2, username: "sarah_dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah", viewed: false },
    // ... more mock data
  ];

  const displayStories = stories.length > 0 ? stories : mockStories;
```

### ✅ FIXED
```jsx
const Stories = ({ stories = [] }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Remove mockStories array entirely
  
  // Handle empty state properly
  if (!stories || stories.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        <p>No stories available</p>
      </div>
    );
  }

  const displayStories = stories;
```

---

## 🔧 FIX 8: PostCard.jsx - Fix Inefficient useEffect

### ❌ CURRENT (Lines 25-34)
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

### ✅ FIXED
```jsx
// Remove the useEffect and compute directly
const likeCount = useMemo(
  () => post?.likes?.length || 0,
  [post?.likes?.length]
);

const liked = useMemo(
  () => post?.likes?.includes(authUser?._id) || false,
  [post?.likes, authUser?._id]
);

const commentCount = useMemo(
  () => post?.comments?.length || 0,
  [post?.comments?.length]
);

// Then use likeCount, liked, commentCount directly in JSX
```

---

## 🔧 FIX 9: Navbar.jsx - Add Real Notification Count

### ❌ CURRENT (Line 6)
```jsx
const Navbar = ({ notificationCount = 0 }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  // ... hardcoded default
```

### ✅ FIXED - CREATE CUSTOM HOOK
Create `frontend/src/hooks/useNotifications.js`:
```jsx
import { useState, useEffect } from "react";
import { apiGet } from "../utils/api";

const useNotifications = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await apiGet("/api/notifications");
        setNotifications(data || []);
        setNotificationCount(data?.length || 0);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return { notificationCount, notifications, loading };
};

export default useNotifications;
```

Then update Navbar:
```jsx
import useNotifications from "../../hooks/useNotifications";

const Navbar = () => {
  const { notificationCount } = useNotifications();
  const [searchFocused, setSearchFocused] = useState(false);
  // ... rest of component
```

---

## 🔧 FIX 10: ModernInstagramUI.jsx - Fix Explore Tab

### ❌ CURRENT (Lines 84-97)
```jsx
{activeTab === "explore" && (
  <div className="grid grid-cols-3 gap-4">
    {[...Array(12)].map((_, idx) => (
      <motion.div key={idx} /* ... */>
        <img
          src={`https://images.unsplash.com/photo-${1500000000000 + idx}?w=300&h=300&fit=crop`}
          alt={`Explore ${idx}`}
          className="w-full h-full object-cover group-hover:brightness-75 transition-all"
        />
      </motion.div>
    ))}
  </div>
)}
```

### ✅ FIXED
```jsx
{activeTab === "explore" && (
  exploreLoading ? (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  ) : exploreContent && exploreContent.length > 0 ? (
    <div className="grid grid-cols-3 gap-4">
      {exploreContent.map((item) => (
        <motion.div key={item._id} /* ... */>
          <img
            src={item.image}
            alt={item.title || "Explore item"}
            className="w-full h-full object-cover group-hover:brightness-75 transition-all"
          />
        </motion.div>
      ))}
    </div>
  ) : (
    <div className="text-center py-12">
      <p className="text-neutral-600 dark:text-neutral-400">
        No explore content available
      </p>
    </div>
  )
)}
```

Add data fetching:
```jsx
useEffect(() => {
  const fetchExplore = async () => {
    try {
      setExploreLoading(true);
      const data = await apiGet("/api/explore");
      setExploreContent(data || []);
    } catch (error) {
      console.error("Failed to load explore content:", error);
    } finally {
      setExploreLoading(false);
    }
  };

  if (activeTab === "explore") {
    fetchExplore();
  }
}, [activeTab]);
```

---

## 📋 DEPLOYMENT CHECKLIST

- [ ] Replace all 9 axios imports with api utility
- [ ] Remove all mock data fallbacks
- [ ] Create useNotifications hook
- [ ] Update Navbar, Sidebar, BottomNav with real data
- [ ] Fetch explore content from backend
- [ ] Fix PostCard useEffect pattern
- [ ] Verify all API endpoints exist in backend
- [ ] Test error handling for all API calls
- [ ] Add loading states where missing
- [ ] Test on production environment

---

**Total Files to Modify:** 10  
**Total Code Changes:** 15+  
**Estimated Time:** 2-3 hours
