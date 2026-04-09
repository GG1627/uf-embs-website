import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../pages/auth/AuthContext";
import { useSnackbar } from "../../components/ui/Snackbar";
import Footer from "../../components/layout/Footer";

const POSTS_PER_PAGE = 5;

const EVENT_TYPES = [
  { value: "gbm",               label: "GBM" },
  { value: "industry_speaker",  label: "Industry Speaker" },
  { value: "academia_speaker",  label: "Academia Speaker" },
  { value: "workshop",          label: "Workshop" },
  { value: "competition",       label: "Competition" },
  { value: "fundraiser",        label: "Fundraiser" },
  { value: "social",            label: "Social" },
];

// Neutral, single-color tag system aligned with the design system
const EVENT_TYPE_STYLES = {
  gbm:               "bg-[#00629B]/8 text-[#00629B] border-[#00629B]/20",
  industry_speaker:  "bg-[#F05A28]/8 text-[#c44a1f] border-[#F05A28]/20",
  academia_speaker:  "bg-[#772583]/8 text-[#772583] border-[#772583]/20",
  workshop:          "bg-[#7A9A01]/8 text-[#5c7401] border-[#7A9A01]/20",
  competition:       "bg-[#c0392b]/8 text-[#c0392b] border-[#c0392b]/20",
  fundraiser:        "bg-[#FFB81C]/8 text-[#8a6300] border-[#FFB81C]/30",
  social:            "bg-[#772583]/8 text-[#772583] border-[#772583]/20",
};

// Shared input / textarea classes for forms
const inputCls =
  "w-full px-4 py-3 border border-[#D0CCC4] bg-white text-[#1A1A1A] text-[0.875rem] placeholder-[#AAAAAA] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-200";

export default function Blog() {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreSentinelRef = useRef(null);
  const isLoadingMoreRef = useRef(false);
  const [role, setRole] = useState("member");
  const [canManageBlog, setCanManageBlog] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);

  // Admin form states
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImages, setPostImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [eventDate, setEventDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postType, setPostType] = useState("image");
  const [postEventType, setPostEventType] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [videoThumbnailPreview, setVideoThumbnailPreview] = useState("");

  // Edit states
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImages, setEditImages] = useState([]);
  const [editImagePreviews, setEditImagePreviews] = useState([]);
  const [editEventDate, setEditEventDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editPostType, setEditPostType] = useState("image");
  const [editEventType, setEditEventType] = useState("");
  const [editVideoLink, setEditVideoLink] = useState("");
  const [editVideoThumbnail, setEditVideoThumbnail] = useState(null);
  const [editVideoThumbnailPreview, setEditVideoThumbnailPreview] = useState("");

  // Search & filter
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);

  // Post expansion states
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  // Modal states
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Image carousel states
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [carouselIntervals, setCarouselIntervals] = useState({});

  // Comments states
  const [commentCounts, setCommentCounts] = useState({});
  const [commentsPanelPost, setCommentsPanelPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Fetch user role
  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("members")
            .select("role, can_manage_blog")
            .eq("user_id", user.id)
            .single();

          if (error) {
            console.error("Error fetching user permissions:", error);
            setRole("member");
            setCanManageBlog(false);
          } else {
            setRole(data?.role || "member");
            setCanManageBlog(data?.can_manage_blog || false);
          }
        } catch (error) {
          console.error("Exception fetching user permissions:", error);
          setRole("member");
          setCanManageBlog(false);
        }
      } else {
        setRole("member");
        setCanManageBlog(false);
      }
    };

    fetchRole();
  }, [user]);

  // Fetch blog posts (paginated - initial load or refresh)
  const fetchPosts = useCallback(async (pageNum = 0, append = false) => {
    const from = pageNum * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("event_date", { ascending: false })
        .range(from, to);

      if (error) throw error;

      const newPosts = data || [];
      if (append) {
        setPosts((prev) => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      setHasMore(newPosts.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      if (!append) {
        showSnackbar("Error loading blog posts", { customColor: "#dc2626" });
        setPosts([
          {
            id: "default",
            title: "Welcome to the Blog",
            content:
              "Here you'll find short summaries after every UF EMBS event and meeting, highlighting what we covered, explored, or accomplished. Whether you missed a GBM or just want a recap, check back here for all our latest updates!",
            created_at: "2025-08-06T00:00:00Z",
            image_urls: [],
          },
        ]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [showSnackbar]);

  // Initial load
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchPosts(0, false);
  }, [fetchPosts]);

  // Load more when sentinel is visible
  const loadMorePosts = useCallback(() => {
    if (loadingMore || !hasMore || isLoadingMoreRef.current) return;
    isLoadingMoreRef.current = true;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true).finally(() => {
      isLoadingMoreRef.current = false;
    });
  }, [page, loadingMore, hasMore, fetchPosts]);

  // Fetch comment counts when posts change
  useEffect(() => {
    const fetchCounts = async () => {
      if (posts.length === 0) { setCommentCounts({}); return; }
      try {
        const postIds = posts.map((p) => p.id);
        const { data, error } = await supabase
          .from("blog_comments")
          .select("post_id")
          .in("post_id", postIds);

        if (error) throw error;
        const counts = {};
        postIds.forEach((id) => (counts[id] = 0));
        (data || []).forEach((c) => { counts[c.post_id] = (counts[c.post_id] || 0) + 1; });
        setCommentCounts(counts);
      } catch (e) {
        console.error("Error fetching comment counts:", e);
        setCommentCounts({});
      }
    };
    fetchCounts();
  }, [posts]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = loadMoreSentinelRef.current;
    if (!sentinel || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && hasMore && !loadingMore) loadMorePosts();
      },
      { rootMargin: "200px", threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, loadMorePosts]);

  // Auto-start carousels for posts with multiple images
  useEffect(() => {
    posts.forEach((post) => {
      if (post.image_urls && post.image_urls.length > 1) startCarousel(post.id, post.image_urls.length);
    });
    return () => { Object.values(carouselIntervals).forEach((interval) => clearInterval(interval)); };
  }, [posts]);

  // Handle multiple image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const validFiles = [];
    const invalidFiles = [];
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) invalidFiles.push(file.name);
      else validFiles.push(file);
    });
    if (invalidFiles.length > 0) showSnackbar(`Images too large (max 5MB): ${invalidFiles.join(", ")}`, { customColor: "#dc2626" });
    if (validFiles.length > 0) {
      setPostImages((prev) => [...prev, ...validFiles]);
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreviews((prev) => [...prev, e.target.result]);
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle edit image upload
  const handleEditImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const validFiles = [];
    const invalidFiles = [];
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) invalidFiles.push(file.name);
      else validFiles.push(file);
    });
    if (invalidFiles.length > 0) showSnackbar(`Images too large (max 5MB): ${invalidFiles.join(", ")}`, { customColor: "#dc2626" });
    if (validFiles.length > 0) {
      setEditImages((prev) => [...prev, ...validFiles]);
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => setEditImagePreviews((prev) => [...prev, e.target.result]);
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle video thumbnail upload
  const handleVideoThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showSnackbar("Thumbnail too large (max 5MB)", { customColor: "#dc2626" }); return; }
    setVideoThumbnail(file);
    const reader = new FileReader();
    reader.onload = (e) => setVideoThumbnailPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // Handle edit video thumbnail upload
  const handleEditVideoThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showSnackbar("Thumbnail too large (max 5MB)", { customColor: "#dc2626" }); return; }
    setEditVideoThumbnail(file);
    const reader = new FileReader();
    reader.onload = (e) => setEditVideoThumbnailPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // Upload multiple images to Supabase storage
  const uploadImages = async (files) => {
    const uploadPromises = files.map(async (file) => {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `blog-images/${fileName}`;
        const { error: uploadError } = await supabase.storage.from("blog-images").upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);
        return data.publicUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
    });
    return Promise.all(uploadPromises);
  };

  // Upload video thumbnail to Supabase storage
  const uploadVideoThumbnail = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `blog-images/thumbnails/${fileName}`;
      const { error: uploadError } = await supabase.storage.from("blog-images").upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading video thumbnail:", error);
      throw error;
    }
  };

  // Handle blog post submission
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim() || !eventDate) {
      showSnackbar("Please fill in all required fields including event date", { customColor: "#dc2626" });
      return;
    }
    if (postType === "video" && !videoLink.trim()) {
      showSnackbar("Please provide a video link for video posts", { customColor: "#dc2626" });
      return;
    }
    setIsSubmitting(true);
    try {
      let imageUrls = [];
      let thumbnailUrl = "";
      if (postType === "image") {
        if (postImages.length > 0) imageUrls = await uploadImages(postImages);
      } else if (postType === "video") {
        if (videoThumbnail) thumbnailUrl = await uploadVideoThumbnail(videoThumbnail);
      }
      const { error } = await supabase.from("blog_posts").insert([{
        title: postTitle.trim(),
        content: postContent.trim(),
        image_urls: imageUrls,
        event_date: new Date(`${eventDate}T12:00:00.000Z`).toISOString(),
        author_id: user.id,
        created_at: new Date().toISOString(),
        post_type: postType,
        event_type: postEventType || null,
        video_link: postType === "video" ? videoLink.trim() : null,
        video_thumbnail: postType === "video" ? thumbnailUrl : null,
      }]).select().single();
      if (error) throw error;
      showSnackbar("Blog post published successfully!", { customColor: "#007377" });
      setPostTitle(""); setPostContent(""); setPostImages([]); setImagePreviews([]);
      setEventDate(""); setPostType("image"); setPostEventType(""); setVideoLink("");
      setVideoThumbnail(null); setVideoThumbnailPreview(""); setShowAdminForm(false);
      setPage(0); setHasMore(true); fetchPosts(0, false);
    } catch (error) {
      console.error("Error creating blog post:", error);
      showSnackbar("Error publishing blog post", { customColor: "#dc2626" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start editing a post
  const startEditingPost = (post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditImages([]);
    setEditImagePreviews(post.image_urls || []);
    setEditEventDate(post.event_date ? new Date(post.event_date).toISOString().split("T")[0] : "");
    setEditPostType(post.post_type || "image");
    setEditEventType(post.event_type || "");
    setEditVideoLink(post.video_link || "");
    setEditVideoThumbnail(null);
    setEditVideoThumbnailPreview(post.video_thumbnail || "");
    setShowAdminForm(false);
    setShowEditModal(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingPost(null); setEditTitle(""); setEditContent(""); setEditImages([]);
    setEditImagePreviews([]); setEditEventDate(""); setEditPostType("image");
    setEditEventType(""); setEditVideoLink(""); setEditVideoThumbnail(null);
    setEditVideoThumbnailPreview(""); setShowEditModal(false);
  };

  // Handle edit post submission
  const handleEditPost = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim() || !editEventDate) {
      showSnackbar("Please fill in all required fields including event date", { customColor: "#dc2626" });
      return;
    }
    if (editPostType === "video" && !editVideoLink.trim()) {
      showSnackbar("Please provide a video link for video posts", { customColor: "#dc2626" });
      return;
    }
    setIsEditing(true);
    try {
      let imageUrls = [...editImagePreviews];
      let thumbnailUrl = editVideoThumbnailPreview;
      if (editPostType === "image") {
        if (editImages.length > 0) {
          const newImageUrls = await uploadImages(editImages);
          imageUrls = [...editImagePreviews.filter((url) => url.startsWith("http")), ...newImageUrls];
        }
      } else if (editPostType === "video") {
        if (editVideoThumbnail) thumbnailUrl = await uploadVideoThumbnail(editVideoThumbnail);
      }
      const { error } = await supabase.from("blog_posts").update({
        title: editTitle.trim(),
        content: editContent.trim(),
        image_urls: imageUrls,
        event_date: new Date(`${editEventDate}T12:00:00.000Z`).toISOString(),
        updated_at: new Date().toISOString(),
        post_type: editPostType,
        event_type: editEventType || null,
        video_link: editPostType === "video" ? editVideoLink.trim() : null,
        video_thumbnail: editPostType === "video" ? thumbnailUrl : null,
      }).eq("id", editingPost.id).select().single();
      if (error) throw error;
      showSnackbar("Blog post updated successfully!", { customColor: "#007377" });
      cancelEditing();
      setPage(0); setHasMore(true); fetchPosts(0, false);
    } catch (error) {
      console.error("Error updating blog post:", error);
      showSnackbar("Error updating blog post", { customColor: "#dc2626" });
    } finally {
      setIsEditing(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  // Toggle post expansion
  const togglePostExpansion = (postId) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) newExpanded.delete(postId);
    else newExpanded.add(postId);
    setExpandedPosts(newExpanded);
  };

  // Check if content should be truncated
  const shouldTruncate = (content) => content.length > 100;

  // Carousel navigation
  const nextImage = (postId, totalImages) => {
    setCurrentImageIndex((prev) => ({ ...prev, [postId]: ((prev[postId] || 0) + 1) % totalImages }));
  };
  const prevImage = (postId, totalImages) => {
    setCurrentImageIndex((prev) => ({ ...prev, [postId]: prev[postId] === 0 ? totalImages - 1 : (prev[postId] || 0) - 1 }));
  };
  const startCarousel = (postId, totalImages) => {
    if (carouselIntervals[postId]) clearInterval(carouselIntervals[postId]);
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => ({ ...prev, [postId]: ((prev[postId] || 0) + 1) % totalImages }));
    }, 8000);
    setCarouselIntervals((prev) => ({ ...prev, [postId]: interval }));
  };
  const stopCarousel = (postId) => {
    if (carouselIntervals[postId]) {
      clearInterval(carouselIntervals[postId]);
      setCarouselIntervals((prev) => { const n = { ...prev }; delete n[postId]; return n; });
    }
  };
  const nextImageWithCarousel = (postId, totalImages) => { nextImage(postId, totalImages); startCarousel(postId, totalImages); };
  const prevImageWithCarousel = (postId, totalImages) => { prevImage(postId, totalImages); startCarousel(postId, totalImages); };

  // Modal functions
  const openModal = (post) => { setSelectedPost(post); setShowModal(true); document.body.style.overflow = "hidden"; };
  const closeModal = () => { setSelectedPost(null); setShowModal(false); document.body.style.overflow = "unset"; };

  // Comments panel
  const openCommentsPanel = async (post) => {
    setCommentsPanelPost(post); setComments([]); setCommentInput(""); setLoadingComments(true);
    document.body.style.overflow = "hidden";
    try {
      const { data, error } = await supabase
        .from("blog_comments")
        .select("id, user_id, author_name, content, created_at")
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setComments(data || []);
    } catch (e) {
      console.error("Error fetching comments:", e);
      showSnackbar("Error loading comments", { customColor: "#dc2626" });
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };
  const closeCommentsPanel = () => {
    setCommentsPanelPost(null); setComments([]); setCommentInput("");
    document.body.style.overflow = "unset";
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) { showSnackbar("Please sign in to comment", { customColor: "#dc2626" }); return; }
    if (!commentInput.trim()) return;
    setSubmittingComment(true);
    try {
      const firstName = user.user_metadata?.first_name || "";
      const lastName = user.user_metadata?.last_name || "";
      const authorName = firstName && lastName ? `${firstName} ${lastName}` : user.email || "Anonymous";
      const { data, error } = await supabase.from("blog_comments").insert([{
        post_id: commentsPanelPost.id,
        user_id: user.id,
        author_name: authorName,
        content: commentInput.trim(),
        created_at: new Date().toISOString(),
      }]).select().single();
      if (error) throw error;
      setComments((prev) => [...prev, data]);
      setCommentCounts((prev) => ({ ...prev, [commentsPanelPost.id]: (prev[commentsPanelPost.id] || 0) + 1 }));
      setCommentInput("");
    } catch (e) {
      console.error("Error submitting comment:", e);
      showSnackbar("Error posting comment", { customColor: "#dc2626" });
    } finally {
      setSubmittingComment(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen flex flex-col bg-[#F8F6F1]">

      {/* ── Admin new-post button ────────────────────────────────────────── */}
      {canManageBlog && (
        <button
          onClick={() => setShowAdminForm(!showAdminForm)}
          title={showAdminForm ? "Close form" : "New post"}
          className="fixed top-20 right-4 z-20 w-10 h-10 bg-[#1A1A1A] hover:bg-[#772583] text-white flex items-center justify-center transition-colors duration-200 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
              d={showAdminForm ? "M6 18L18 6M6 6l12 12" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
          </svg>
        </button>
      )}

      {/* ── Hero / Masthead ──────────────────────────────────────────────── */}
      <section className="pt-36 pb-10 px-6 border-b border-[#E8E4DD]">
        <div className="max-w-5xl mx-auto">
          {/* Top rule */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-[#D0CCC4]" />
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#9A9A9A]">
              University of Florida · IEEE EMBS
            </p>
            <div className="h-px flex-1 bg-[#D0CCC4]" />
          </div>

          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h1
                style={{ fontFamily: "'Lora', Georgia, serif" }}
                className="text-5xl md:text-[4.5rem] font-medium leading-[1.08] tracking-[-0.02em] text-[#1A1A1A]"
              >
                The EMBS Gazette
              </h1>
              <p className="text-[0.8125rem] text-[#8A8A8A] mt-2 font-light tracking-wide">
                Your source for all things biomedical engineering at UF
              </p>
            </div>
            <div className="hidden md:block text-right pb-1">
              <p className="text-[0.75rem] font-medium text-[#6B7280] tracking-wide">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
              <p className="text-[0.6875rem] text-[#9A9A9A] font-light mt-0.5 tracking-wide">
                Volume I · UF Biomedical Engineering Society
              </p>
            </div>
          </div>

          {/* Filter pills + search */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveFilter(null)}
                className={`text-[10px] font-semibold uppercase tracking-[0.14em] px-3 py-1 border transition-colors duration-150 cursor-pointer ${
                  activeFilter === null
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                    : "text-[#6B7280] border-[#D0CCC4] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                }`}
              >
                All
              </button>
              {EVENT_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setActiveFilter(activeFilter === value ? null : value)}
                  className={`text-[10px] font-semibold uppercase tracking-[0.14em] px-3 py-1 border transition-colors duration-150 cursor-pointer ${
                    activeFilter === value
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                      : "text-[#6B7280] border-[#D0CCC4] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64 shrink-0">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A9A9A] pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts"
                className="w-full pl-8 pr-8 py-2 text-[0.8125rem] border border-[#D0CCC4] bg-white text-[#1A1A1A] placeholder-[#AAAAAA] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] hover:text-[#1A1A1A] transition-colors text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="flex-1 py-14 px-6">
        <div className="max-w-5xl mx-auto">

          {/* ── Admin create form ─────────────────────────────────────── */}
          {canManageBlog && showAdminForm && (
            <div className="mb-12 border border-[#E8E4DD] bg-white p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ fontFamily: "'Lora', Georgia, serif" }}
                  className="text-xl font-medium text-[#1A1A1A]">
                  Create New Post
                </h2>
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#772583]">Admin</p>
              </div>

              <form onSubmit={handleSubmitPost} className="space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="post-title" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">
                        Title *
                      </label>
                      <input id="post-title" type="text" required value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        className={inputCls} placeholder="Enter post title" />
                    </div>
                    <div>
                      <label htmlFor="post-content" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">
                        Content *
                      </label>
                      <textarea id="post-content" required rows={7} value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        className={`${inputCls} resize-vertical`} placeholder="Write your post content" />
                    </div>
                  </div>

                  {/* Right */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">Post Type *</label>
                      <div className="flex gap-5">
                        {["image", "video"].map((t) => (
                          <label key={t} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="postType" value={t} checked={postType === t}
                              onChange={(e) => setPostType(e.target.value)} className="accent-[#1A1A1A]" />
                            <span className="text-[0.875rem] text-[#4A4A4A] capitalize">{t} Post</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="event-date" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">
                        Event Date *
                      </label>
                      <input id="event-date" type="date" required value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)} className={inputCls} />
                    </div>

                    <div>
                      <label htmlFor="event-type" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">
                        Event Type
                      </label>
                      <select id="event-type" value={postEventType}
                        onChange={(e) => setPostEventType(e.target.value)}
                        className={`${inputCls} bg-white`}>
                        <option value="">None</option>
                        {EVENT_TYPES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </div>

                    {postType === "image" && (
                      <div>
                        <label htmlFor="post-image" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">
                          Images (Optional)
                        </label>
                        <input id="post-image" type="file" accept="image/*" multiple
                          onChange={handleImageUpload}
                          className="w-full text-[0.8125rem] text-[#4A4A4A] border border-[#D0CCC4] file:mr-3 file:py-2 file:px-3 file:border-0 file:text-[0.75rem] file:font-medium file:bg-[#F8F6F1] file:text-[#1A1A1A] hover:file:bg-[#E8E4DD] file:cursor-pointer" />
                        {imagePreviews.length > 0 && (
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            {imagePreviews.map((preview, index) => (
                              <div key={index} className="relative">
                                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover border border-[#E8E4DD]" />
                                <button type="button"
                                  onClick={() => { setImagePreviews((p) => p.filter((_, i) => i !== index)); setPostImages((p) => p.filter((_, i) => i !== index)); }}
                                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#c0392b] text-white flex items-center justify-center text-xs hover:bg-red-700 transition-colors">
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-[11px] text-[#9A9A9A] mt-1.5">Max 5MB per image.</p>
                      </div>
                    )}

                    {postType === "video" && (
                      <>
                        <div>
                          <label htmlFor="video-link" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">
                            Video Link *
                          </label>
                          <input id="video-link" type="url" required value={videoLink}
                            onChange={(e) => setVideoLink(e.target.value)}
                            className={inputCls} placeholder="https://drive.google.com/file/d/..." />
                        </div>
                        <div>
                          <label htmlFor="video-thumbnail" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">
                            Thumbnail (Optional)
                          </label>
                          <input id="video-thumbnail" type="file" accept="image/*"
                            onChange={handleVideoThumbnailUpload}
                            className="w-full text-[0.8125rem] text-[#4A4A4A] border border-[#D0CCC4] file:mr-3 file:py-2 file:px-3 file:border-0 file:text-[0.75rem] file:font-medium file:bg-[#F8F6F1] file:text-[#1A1A1A] hover:file:bg-[#E8E4DD] file:cursor-pointer" />
                          {videoThumbnailPreview && (
                            <img src={videoThumbnailPreview} alt="Thumbnail preview" className="mt-2 w-full h-28 object-cover border border-[#E8E4DD]" />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2 border-t border-[#E8E4DD]">
                  <button type="submit" disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#772583] text-white text-[0.875rem] font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {isSubmitting ? (<><div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />Publishing...</>) : "Publish Post"}
                  </button>
                  <button type="button"
                    onClick={() => { setShowAdminForm(false); setPostTitle(""); setPostContent(""); setPostImages([]); setImagePreviews([]); setEventDate(""); setPostType("image"); setVideoLink(""); setVideoThumbnail(null); setVideoThumbnailPreview(""); }}
                    className="px-6 py-2.5 border border-[#D0CCC4] text-[#4A4A4A] text-[0.875rem] font-medium hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors duration-200">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Posts list ────────────────────────────────────────────── */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3 text-[#6B7280]">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#D0CCC4] border-t-[#1A1A1A]" />
                <span className="text-[0.875rem] font-light">Loading posts</span>
              </div>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-[#E8E4DD]">
              {(() => {
                const filtered = posts.filter((p) => {
                  const matchesSearch = searchQuery.trim()
                    ? p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.content?.toLowerCase().includes(searchQuery.toLowerCase())
                    : true;
                  const matchesFilter = activeFilter ? p.event_type === activeFilter : true;
                  return matchesSearch && matchesFilter;
                });

                if (filtered.length === 0) return (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <svg className="w-8 h-8 text-[#D0CCC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <p className="text-[#6B7280] text-[0.875rem]">
                      {searchQuery.trim() ? <>No posts matched <span className="font-medium text-[#1A1A1A]">"{searchQuery}"</span></> : "No posts in this category yet."}
                    </p>
                    <button onClick={() => { setSearchQuery(""); setActiveFilter(null); }}
                      className="text-[0.8125rem] text-[#00629B] hover:underline underline-offset-2">
                      Clear filters
                    </button>
                  </div>
                );

                return filtered.map((post) => {
                  const needsTruncation = shouldTruncate(post.content);
                  const truncatedContent = needsTruncation ? post.content.substring(0, 420) + "..." : post.content;

                  return (
                    <article key={post.id} className="bg-white hover:bg-[#FDFCFA] transition-colors duration-300 group">
                      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[380px]">

                        {/* Media side */}
                        <div className="relative p-5">
                          {post.post_type === "video" && post.video_thumbnail ? (
                            <div
                              className="relative h-72 lg:h-full min-h-[300px] overflow-hidden cursor-pointer bg-[#1A1A1A]"
                              onClick={() => window.open(post.video_link, "_blank")}
                            >
                              <img src={post.video_thumbnail} alt={`${post.title} - Video Thumbnail`}
                                className="w-full h-full object-contain"
                                onError={(e) => { e.target.style.display = "none"; }} />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/35 transition-colors">
                                <div className="w-14 h-14 bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                                  <svg className="w-6 h-6 text-[#1A1A1A] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                              <div className="absolute top-3 left-3 bg-[#772583] text-white px-2.5 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase">
                                Video
                              </div>
                            </div>

                          ) : post.image_urls && post.image_urls.length > 0 && post.image_urls.some((url) => url && url.trim() !== "") ? (
                            <div
                              className="relative h-72 lg:h-full min-h-[300px] overflow-hidden bg-[#F8F6F1]"
                              onMouseEnter={() => stopCarousel(post.id)}
                              onMouseLeave={() => { if (post.image_urls.length > 1) startCarousel(post.id, post.image_urls.length); }}
                            >
                              {post.image_urls.map((imageUrl, index) => {
                                const currentIndex = currentImageIndex[post.id] || 0;
                                return (
                                  <div key={index}
                                    className={`absolute inset-0 transition-opacity duration-700 ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
                                    <img src={imageUrl} alt={`${post.title} - Image ${index + 1}`}
                                      className="w-full h-full object-contain"
                                      onError={(e) => { e.target.style.display = "none"; }} />
                                  </div>
                                );
                              })}

                              {post.image_urls.length > 1 && (
                                <>
                                  <button onClick={() => prevImageWithCarousel(post.id, post.image_urls.length)}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-sm">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                  </button>
                                  <button onClick={() => nextImageWithCarousel(post.id, post.image_urls.length)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-sm">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                                    {post.image_urls.map((_, index) => (
                                      <button key={index}
                                        onClick={() => { setCurrentImageIndex((p) => ({ ...p, [post.id]: index })); startCarousel(post.id, post.image_urls.length); }}
                                        className={`w-1.5 h-1.5 transition-all duration-200 ${index === (currentImageIndex[post.id] || 0) ? "bg-[#1A1A1A] scale-125" : "bg-[#1A1A1A]/30 hover:bg-[#1A1A1A]/60"}`} />
                                    ))}
                                  </div>
                                  <div className="absolute top-3 right-3 z-20 bg-white/80 px-2 py-0.5 text-[10px] font-medium text-[#6B7280]">
                                    {(currentImageIndex[post.id] || 0) + 1} / {post.image_urls.length}
                                  </div>
                                </>
                              )}
                            </div>

                          ) : (
                            <div className="h-72 lg:h-full min-h-[300px] bg-[#F8F6F1] border border-[#E8E4DD] flex items-center justify-center">
                              <div className="text-center text-[#D0CCC4]">
                                <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-[0.75rem]">No image</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content side */}
                        <div className="p-8 flex flex-col justify-between border-l border-[#E8E4DD]">
                          <div className="space-y-3">
                            {/* Meta row */}
                            <div className="flex items-center gap-2.5 flex-wrap">
                              {post.event_type && (
                                <span className={`text-[10px] font-semibold uppercase tracking-[0.14em] px-2.5 py-0.5 border ${EVENT_TYPE_STYLES[post.event_type] ?? "bg-[#F8F6F1] text-[#6B7280] border-[#D0CCC4]"}`}>
                                  {EVENT_TYPES.find((t) => t.value === post.event_type)?.label ?? post.event_type}
                                </span>
                              )}
                              <span className="text-[0.8125rem] font-medium text-[#4A4A4A]">
                                {formatDate(post.event_date)}
                              </span>
                              <span className="text-[#D0CCC4]">·</span>
                              <span className="text-[0.8125rem] text-[#8A8A8A] font-light">
                                {Math.ceil(post.content.length / 450)} min read
                              </span>
                              <span className="text-[#D0CCC4]">·</span>
                              <button onClick={() => openCommentsPanel(post)}
                                className="inline-flex items-center gap-1 text-[0.8125rem] text-[#8A8A8A] hover:text-[#00629B] transition-colors duration-200 cursor-pointer">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                {commentCounts[post.id] ?? 0}
                              </button>
                            </div>

                            {/* Title + edit */}
                            <div className="flex items-start justify-between gap-3">
                              <h2 style={{ fontFamily: "'Lora', Georgia, serif" }}
                                className="text-[1.875rem] md:text-[2.25rem] font-medium leading-[1.2] tracking-[-0.01em] text-[#1A1A1A] flex-1">
                                {post.title}
                              </h2>
                              {canManageBlog && (
                                <button onClick={() => startEditingPost(post)}
                                  title="Edit post"
                                  className="shrink-0 w-7 h-7 border border-[#D0CCC4] hover:border-[#1A1A1A] flex items-center justify-center transition-colors duration-200 mt-1">
                                  <svg className="w-3.5 h-3.5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                              )}
                            </div>

                            {/* Body */}
                            <p className="text-[#4A4A4A] text-[0.9375rem] leading-[1.8] font-light whitespace-pre-wrap">
                              {truncatedContent}
                            </p>

                            {needsTruncation && (
                              <button onClick={() => openModal(post)}
                                className="inline-flex items-center gap-1 text-[0.8125rem] text-[#00629B] hover:text-[#772583] font-medium transition-colors duration-200 cursor-pointer group/btn">
                                Read more
                                <span className="inline-block group-hover/btn:translate-x-0.5 transition-transform duration-200">→</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                });
              })()}

              {/* Infinite scroll sentinel */}
              {!loading && hasMore && (
                <div ref={loadMoreSentinelRef} className="h-4 flex items-center justify-center py-10" aria-hidden="true">
                  {loadingMore && (
                    <div className="flex items-center gap-2 text-[#8A8A8A]">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#D0CCC4] border-t-[#6B7280]" />
                      <span className="text-[0.8125rem] font-light">Loading more</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Read More Modal ──────────────────────────────────────────────── */}
      {showModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/60 backdrop-blur-sm">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col" style={{ boxShadow: "0 8px 40px rgba(26,26,26,0.2)" }}>
            <div className="flex items-start justify-between p-6 border-b border-[#E8E4DD]">
              <div className="flex-1 pr-4">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#8A8A8A] mb-2">
                  {formatDate(selectedPost.event_date)}
                </p>
                <h2 style={{ fontFamily: "'Lora', Georgia, serif" }}
                  className="text-2xl md:text-3xl font-medium leading-[1.2] text-[#1A1A1A]">
                  {selectedPost.title}
                </h2>
              </div>
              <button onClick={closeModal}
                className="shrink-0 w-8 h-8 border border-[#E8E4DD] hover:border-[#1A1A1A] flex items-center justify-center transition-colors duration-200 mt-1">
                <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 scrollbar-sleek space-y-6">
              <p className="text-[#4A4A4A] text-[1rem] leading-[1.85] font-light whitespace-pre-wrap">
                {selectedPost.content}
              </p>

              {selectedPost.post_type === "video" && selectedPost.video_thumbnail ? (
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#8A8A8A] mb-3">Video</p>
                  <div className="relative cursor-pointer group/vid" onClick={() => window.open(selectedPost.video_link, "_blank")}>
                    <img src={selectedPost.video_thumbnail} alt={`${selectedPost.title} - Video Thumbnail`}
                      className="w-full h-auto object-contain bg-[#F8F6F1] border border-[#E8E4DD]"
                      onError={(e) => { e.target.style.display = "none"; }} />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/vid:bg-black/30 transition-colors">
                      <div className="w-12 h-12 bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                        <svg className="w-5 h-5 text-[#1A1A1A] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 bg-[#772583] text-white px-2 py-0.5 text-[10px] font-semibold tracking-[0.1em] uppercase">Video</div>
                  </div>
                </div>
              ) : selectedPost.image_urls && selectedPost.image_urls.length > 0 && selectedPost.image_urls.some((url) => url && url.trim() !== "") && (
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#8A8A8A] mb-3">Images</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedPost.image_urls.map((imageUrl, index) => (
                      <img key={index} src={imageUrl} alt={`${selectedPost.title} - Image ${index + 1}`}
                        className="w-full h-auto object-contain bg-[#F8F6F1] border border-[#E8E4DD]"
                        onError={(e) => { e.target.style.display = "none"; }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Comments Panel ──────────────────────────────────────────────── */}
      {commentsPanelPost && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-[#1A1A1A]/50 backdrop-blur-sm" onClick={closeCommentsPanel} />
          <div className="relative bg-white w-full sm:max-w-md max-h-[85vh] flex flex-col" style={{ boxShadow: "0 8px 40px rgba(26,26,26,0.2)" }}>
            <div className="flex items-center justify-between p-5 border-b border-[#E8E4DD]">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#8A8A8A] mb-0.5">Comments</p>
                <h3 className="text-[0.9375rem] font-medium text-[#1A1A1A] leading-snug line-clamp-1">
                  {commentsPanelPost.title}
                </h3>
                <p className="text-[11px] text-[#8A8A8A] font-light mt-0.5">
                  {(commentCounts[commentsPanelPost.id] ?? comments.length) || 0} comment
                  {(commentCounts[commentsPanelPost.id] ?? comments.length) !== 1 ? "s" : ""}
                </p>
              </div>
              <button onClick={closeCommentsPanel}
                className="w-7 h-7 border border-[#E8E4DD] hover:border-[#1A1A1A] flex items-center justify-center transition-colors duration-200">
                <svg className="w-3.5 h-3.5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0 scrollbar-sleek">
              {loadingComments ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#D0CCC4] border-t-[#1A1A1A]" />
                </div>
              ) : comments.length === 0 ? (
                <p className="text-[#8A8A8A] text-[0.875rem] text-center py-8 font-light">
                  No comments yet. Be the first to share your thoughts.
                </p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="border-b border-[#E8E4DD] pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[0.8125rem] font-medium text-[#1A1A1A]">{c.author_name}</span>
                      <span className="text-[#D0CCC4] text-xs">·</span>
                      <span className="text-[0.75rem] text-[#9A9A9A] font-light">{formatDate(c.created_at)}</span>
                    </div>
                    <p className="text-[#4A4A4A] text-[0.875rem] leading-[1.7] whitespace-pre-wrap font-light">{c.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-[#E8E4DD]">
              {user ? (
                <form onSubmit={handleSubmitComment} className="flex gap-2">
                  <input type="text" value={commentInput} onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Write a comment" maxLength={1000} disabled={submittingComment}
                    className="flex-1 px-3 py-2.5 border border-[#D0CCC4] text-[0.875rem] text-[#1A1A1A] placeholder-[#AAAAAA] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-200 disabled:opacity-60" />
                  <button type="submit" disabled={submittingComment || !commentInput.trim()}
                    className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#772583] text-white text-[0.8125rem] font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed">
                    {submittingComment ? <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" /> : "Post"}
                  </button>
                </form>
              ) : (
                <p className="text-[#8A8A8A] text-[0.8125rem] text-center font-light py-1">
                  Sign in to add a comment.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ──────────────────────────────────────────────────── */}
      {showEditModal && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/60 backdrop-blur-sm">
          <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" style={{ boxShadow: "0 8px 40px rgba(26,26,26,0.2)" }}>
            <div className="flex items-center justify-between p-6 border-b border-[#E8E4DD]">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#772583] mb-1">Admin</p>
                <h2 style={{ fontFamily: "'Lora', Georgia, serif" }}
                  className="text-xl font-medium text-[#1A1A1A]">
                  Edit Post
                </h2>
              </div>
              <button onClick={cancelEditing}
                className="w-7 h-7 border border-[#E8E4DD] hover:border-[#1A1A1A] flex items-center justify-center transition-colors duration-200">
                <svg className="w-3.5 h-3.5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 scrollbar-sleek">
              <form onSubmit={handleEditPost} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="edit-title" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">Title *</label>
                      <input id="edit-title" type="text" required value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="edit-content" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">Content *</label>
                      <textarea id="edit-content" required rows={8} value={editContent}
                        onChange={(e) => setEditContent(e.target.value)} className={`${inputCls} resize-vertical`} />
                    </div>
                    <div>
                      <label htmlFor="edit-event-date" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">Event Date *</label>
                      <input id="edit-event-date" type="date" required value={editEventDate}
                        onChange={(e) => setEditEventDate(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="edit-event-type" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">Event Type</label>
                      <select id="edit-event-type" value={editEventType}
                        onChange={(e) => setEditEventType(e.target.value)}
                        className={`${inputCls} bg-white`}>
                        <option value="">None</option>
                        {EVENT_TYPES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">Post Type</label>
                      <div className="flex gap-5">
                        {["image", "video"].map((t) => (
                          <label key={t} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="editPostType" value={t} checked={editPostType === t}
                              onChange={(e) => setEditPostType(e.target.value)} className="accent-[#1A1A1A]" />
                            <span className="text-[0.875rem] text-[#4A4A4A] capitalize">{t} Post</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {editPostType === "image" && (
                      <div>
                        <label htmlFor="edit-image" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">Images (Optional)</label>
                        <input id="edit-image" type="file" accept="image/*" multiple onChange={handleEditImageUpload}
                          className="w-full text-[0.8125rem] text-[#4A4A4A] border border-[#D0CCC4] file:mr-3 file:py-2 file:px-3 file:border-0 file:text-[0.75rem] file:font-medium file:bg-[#F8F6F1] file:text-[#1A1A1A] hover:file:bg-[#E8E4DD] file:cursor-pointer" />
                        {editImagePreviews.length > 0 && (
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            {editImagePreviews.map((preview, index) => (
                              <div key={index} className="relative">
                                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover border border-[#E8E4DD]" />
                                <button type="button"
                                  onClick={() => { setEditImagePreviews((p) => p.filter((_, i) => i !== index)); if (!preview.startsWith("http")) setEditImages((p) => p.filter((_, i) => i !== index)); }}
                                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#c0392b] text-white flex items-center justify-center text-xs hover:bg-red-700 transition-colors">
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-[11px] text-[#9A9A9A] mt-1.5">Max 5MB per image.</p>
                      </div>
                    )}

                    {editPostType === "video" && (
                      <>
                        <div>
                          <label htmlFor="edit-video-link" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">Video Link *</label>
                          <input id="edit-video-link" type="url" required value={editVideoLink}
                            onChange={(e) => setEditVideoLink(e.target.value)}
                            className={inputCls} placeholder="https://drive.google.com/file/d/..." />
                        </div>
                        <div>
                          <label htmlFor="edit-video-thumbnail" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">Thumbnail (Optional)</label>
                          <input id="edit-video-thumbnail" type="file" accept="image/*" onChange={handleEditVideoThumbnailUpload}
                            className="w-full text-[0.8125rem] text-[#4A4A4A] border border-[#D0CCC4] file:mr-3 file:py-2 file:px-3 file:border-0 file:text-[0.75rem] file:font-medium file:bg-[#F8F6F1] file:text-[#1A1A1A] hover:file:bg-[#E8E4DD] file:cursor-pointer" />
                          {editVideoThumbnailPreview && (
                            <img src={editVideoThumbnailPreview} alt="Thumbnail preview" className="mt-2 w-full h-28 object-cover border border-[#E8E4DD]" />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#E8E4DD]">
                  <button type="submit" disabled={isEditing}
                    className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#772583] text-white text-[0.875rem] font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {isEditing ? (<><div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />Updating...</>) : "Update Post"}
                  </button>
                  <button type="button" onClick={cancelEditing}
                    className="px-6 py-2.5 border border-[#D0CCC4] text-[#4A4A4A] text-[0.875rem] font-medium hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors duration-200">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
