import DesktopBackgroundFiller from "../../assets/images/desktop_background_filler2.avif";
import DesktopBackgroundDNA from "../../assets/images/desktop_background_dna2.avif";
import MobileBackgroundFiller from "../../assets/images/mobile_background_filler2.avif";
import MobileBackgroundDNA from "../../assets/images/mobile_background_dna2.avif";
import UF_Skyline from "../../assets/images/uf_skyline.avif";

import Image0 from "../../assets/grid/img0.avif";
import Image1 from "../../assets/grid/img1.avif";
import Image2 from "../../assets/grid/img2.avif";
import Image3 from "../../assets/grid/img3.avif";
import Image4 from "../../assets/grid/img4.avif";
import Image5 from "../../assets/grid/img5.avif";
import Image6 from "../../assets/grid/img6.avif";
import Image7 from "../../assets/grid/img7.avif";
import Image8 from "../../assets/grid/img8.avif";
import Image9 from "../../assets/grid/img9.avif";
import Image10 from "../../assets/grid/img10.avif";
import Image11 from "../../assets/grid/img11.avif";
import Image12 from "../../assets/grid/img12.avif";


import { IoIosArrowDown } from "react-icons/io";
import { useEffect, memo, useMemo, useCallback, useRef } from "react";
import Footer from "../../components/layout/Footer";
import ImageStack from "../../components/ui/ImageStack";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../pages/auth/AuthContext";
import { useSnackbar } from "../../components/ui/Snackbar";
import { supabase } from "../../lib/supabase";
import { useState } from "react";
import { slidingText } from "../../data/slidingText";
import ParticlesBg from "../../components/ui/ParticlesBG";
import { LuDna } from "react-icons/lu";
import { bannerGrid } from "../../data/bannerGrid";
import GradientMesh from "../../components/ui/GradientMesh";

import useGoogleCalendar from "../../lib/useGoogleCalendar";
import { getKeyframeManager } from "../../lib/keyframeManager";
import { useAnimationControl } from "../../lib/useAnimationControl";
import { getImagePreloader } from "../../lib/imagePreloader";
import { getPerformanceMonitor } from "../../lib/performanceMonitor";
import { useLazyRender } from "../../lib/useLazyRender";


// Optimized ImageGrid component - memoized and lazy-loaded
const ImageGrid = memo(({ 
  Image0, Image1, Image2, Image3, Image4, Image5, 
  Image6, Image7, Image8, Image9, Image10, Image11, Image12,
  gapSize = "gap-1", // Default for desktop
  paddingSize = "p-2" // Default for desktop
}) => {
  return (
    <div 
      className={`h-full w-full grid grid-cols-[41fr_39fr_103fr] ${gapSize} ${paddingSize}`}
      style={{ contain: "layout style paint" }}
    >
      {/* Column 1 */}
      <div className={`flex flex-col ${gapSize} h-[56%] mt-[65%] items-end`}>
        <div className="bg-[#b0b0b0] rounded-lg h-[20%] w-[70%]">
          <img
            src={Image0}
            alt="Image Grid"
            className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        </div>
        <div className="bg-[#b0b0b0] rounded-lg h-[35%] w-full">
          <img
            src={Image1}
            alt="Image Grid"
            className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
            loading="lazy"
            fetchPriority="low"
            decoding="async"
          />
        </div>
        <div className="bg-[#b0b0b0] rounded-lg h-[30%] w-[85%]">
          <img
            src={Image3}
            alt="Image Grid"
            className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
            loading="lazy"
            fetchPriority="low"
            decoding="async"
          />
        </div>
      </div>
      {/* Column 2 */}
      <div className={`flex flex-col ${gapSize} h-[78%] mt-[20%] items-end`}>
        <div className="bg-[#b0b0b0] rounded-lg h-[25%] w-full">
          <img
            src={Image2}
            alt="Image Grid"
            className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
            loading="lazy"
            fetchPriority="low"
            decoding="async"
          />
        </div>
        <div className="bg-[#b0b0b0] rounded-lg h-[40%] w-full">
          <img
            src={Image4}
            alt="Image Grid"
            className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
            loading="lazy"
            fetchPriority="low"
            decoding="async"
          />
        </div>
        <div className="bg-[#b0b0b0] rounded-lg h-[30%] w-full">
          <img
            src={Image5}
            alt="Image Grid"
            className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
            loading="lazy"
            fetchPriority="low"
            decoding="async"
          />
        </div>
      </div>
      {/* Column 3 */}
      <div className={`flex flex-col ${gapSize} h-full items-start`}>
        {/* Row 1 */}
        <div className={`flex flex-row ${gapSize} h-[35%] w-[85%]`}>
          <div className="bg-[#b0b0b0] rounded-lg h-full w-[40%]">
            <img
              src={Image6}
              alt="Image Grid"
              className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
              fetchPriority="low"
              decoding="async"
            />
          </div>
          <div className="bg-[#b0b0b0] rounded-lg h-[80%] w-[60%] self-end">
            <img
              src={Image7}
              alt="Image Grid"
              className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
              fetchPriority="low"
              decoding="async"
            />
          </div>
        </div>
        {/* Row 2 */}
        <div className={`flex flex-row h-[70%] ${gapSize} w-full`}>
          <div className={`flex flex-col ${gapSize} h-full w-[53%]`}>
            <div className="bg-[#b0b0b0] rounded-lg h-[50%] w-full">
              <img
                src={Image8}
                alt="Image Grid"
                className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
                fetchPriority="low"
                decoding="async"
              />
            </div>
            <div className={`flex flex-row ${gapSize} h-[30%] w-full`}>
              <div className="bg-[#b0b0b0] rounded-lg h-full w-[47%]">
                <img
                  src={Image10}
                  alt="Image Grid"
                  className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                  fetchPriority="low"
                  decoding="async"
                />
              </div>
              <div className="bg-[#b0b0b0] rounded-lg h-[85%] w-[53%]">
                <img
                  src={Image12}
                  alt="Image Grid"
                  className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                  fetchPriority="low"
                  decoding="async"
                />
              </div>
            </div>
          </div>
          <div className={`flex flex-col ${gapSize} h-[70%] w-[47%]`}>
            <div className="bg-[#b0b0b0] rounded-lg h-[60%] w-full">
              <img
                src={Image9}
                alt="Image Grid"
                className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
                fetchPriority="low"
                decoding="async"
              />
            </div>
            <div className="bg-[#b0b0b0] rounded-lg h-[35%] w-[80%]">
              <img
                src={Image11}
                alt="Image Grid"
                className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
                fetchPriority="low"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ImageGrid.displayName = "ImageGrid";

// Helper function to generate consistent random values based on index
const getRandomTransform = (index) => {
  // Use index as seed for consistent randomness
  const seed = index * 123.456;
  const rotation = (Math.sin(seed) * 8) - 4; // Random rotation between -4 and 4 degrees
  const offsetX = (Math.cos(seed * 2) * 15) - 7.5; // Random X offset between -7.5 and 7.5px
  const offsetY = (Math.sin(seed * 3) * 15) - 7.5; // Random Y offset between -7.5 and 7.5px
  
  return { rotation, offsetX, offsetY };
};

// Animated Image Stack Component - handles z-index change for each image
const AnimatedImageStack = memo(({ image, description, index, totalImages, width, height }) => {
  const containerRef = useRef(null);
  const delay = index * 2500; // 3 seconds delay per image

  // Get consistent random transform values for this image
  const { rotation, offsetX, offsetY } = useMemo(() => getRandomTransform(index), [index]);
  
  // Register keyframe animation in centralized stylesheet
  const animationName = useMemo(() => {
    const keyframeManager = getKeyframeManager();
    return keyframeManager.createSlideAnimation(index, offsetX, offsetY, rotation, 28);
  }, [index, offsetX, offsetY, rotation]);
  
  // Control animation based on visibility
  const animationControlRef = useAnimationControl({
    enabled: true,
    rootMargin: '100px', // Start checking 100px before visible
  });
  
  // Combine refs
  const combinedRef = useCallback((node) => {
    containerRef.current = node;
    if (animationControlRef) {
      animationControlRef(node);
    }
  }, [animationControlRef]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        // Higher z-index for later images (so they appear on top when moving)
        containerRef.current.style.zIndex = `${10 + index * 10}`;
      }
    }, delay); // Change z-index when animation starts

    return () => clearTimeout(timer);
  }, [delay, index]);

  // Initial z-index: later images (higher index) should be behind initially
  // So image 0 is on top, image 12 is at the bottom
  const initialZIndex = totalImages - index;
  
  // Use transform3d for better GPU acceleration, especially in Firefox
  const transformValue = `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), 0) rotate(${rotation}deg)`;

  return (
    <div 
      ref={combinedRef}
      className="absolute top-1/2 left-[45%] w-fit"
      style={{ 
        zIndex: initialZIndex,
        transform: transformValue,
        willChange: index <= 3 ? 'transform' : 'auto', // Only hint for first few images
        animationName: animationName,
        animationDuration: '3s',
        animationTimingFunction: 'ease-in-out',
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards',
        animationIterationCount: '1'
      }}
    >
      <ImageStack 
        image={image} 
        description={description}
        width={width}
        height={height}
        priority={index < 6 ? "high" : "auto"}
        loading={index < 6 ? "eager" : "lazy"}
      />
    </div>
  );
});

AnimatedImageStack.displayName = "AnimatedImageStack";

// First Image Component - separate to allow hooks
const FirstAnimatedImage = memo(({ image, description, width, height, offsetX, offsetY, rotation, totalImages }) => {
  // Register keyframe in centralized stylesheet
  const animationName = useMemo(() => {
    const keyframeManager = getKeyframeManager();
    return keyframeManager.createSlideAnimation(0, offsetX, offsetY, rotation, 28);
  }, [offsetX, offsetY, rotation]);
  
  // Control animation based on visibility
  const animationRef = useAnimationControl({
    enabled: true,
    rootMargin: '100px',
  });
  
  return (
    <div 
      ref={animationRef}
      className="absolute top-1/2 left-[45%] w-fit"
      style={{ 
        zIndex: totalImages,
        transform: `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), 0) rotate(${rotation}deg)`,
        willChange: 'transform', // Only on actively animating element
        animationName: animationName,
        animationDuration: '3s',
        animationTimingFunction: 'ease-in-out',
        animationFillMode: 'forwards',
        animationPlayState: 'running', // Explicitly start as running
      }}
    >
      <ImageStack 
        image={image} 
        description={description}
        width={width}
        height={height}
        priority="high"
        loading="eager"
      />
    </div>
  );
});

FirstAnimatedImage.displayName = "FirstAnimatedImage";

// Gallery Section Component - Lazy rendered and optimized
const GallerySection = memo(() => {
  // Lazy render the entire gallery section - only render when near viewport
  const [shouldRender, galleryRef] = useLazyRender({
    rootMargin: '600px', // Start rendering 600px before visible
    triggerOnce: true,
  });

  // Pre-calculate transform for first image
  const firstImageTransform = useMemo(() => {
    return getRandomTransform(0);
  }, []);

  if (!shouldRender) {
    // Return placeholder to maintain layout
    return (
      <div 
        ref={galleryRef}
        className="w-full bg-[#ffffff]/60 backdrop-blur-[10px] mt-16 py-6 md:py-16 h-auto md:min-h-[500px] overflow-hidden relative"
        style={{ contain: "layout style paint" }}
      >
        <div className="max-w-7xl mx-auto relative h-full md:min-h-[500px]">
          <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-4 md:left-6 lg:left-12 z-30 max-w-xs">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-3" style={{ fontFamily: "'Georgia', serif" }}>
              The EMBS Gallery
            </h2>
            <p className="text-black/80 text-base md:text-lg leading-relaxed">
              A few shots taken at our events
            </p>
          </div>
        </div>
      </div>
    );
  }

  const firstItem = bannerGrid[0];

  return (
    <div 
      ref={galleryRef}
      className="w-full bg-[#ffffff]/60 backdrop-blur-[2px] mt-16 py-6 md:py-16 h-auto md:min-h-[500px] overflow-hidden relative"
      style={{ contain: "layout style paint" }}
    >
      {/* Gallery Title - Left Side */}
      <div className="max-w-7xl mx-auto relative h-full md:min-h-[500px]">
        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-4 md:left-6 lg:left-12 z-30 max-w-xs">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-3" style={{ fontFamily: "'Georgia', serif" }}>
            The EMBS Gallery
          </h2>
          <p className="text-black/80 text-base md:text-lg leading-relaxed">
            A few shots taken at our events
          </p>
        </div>
      </div>
      
      {/* Mobile-only: single static polaroid */}
      <div className="md:hidden flex items-center justify-center py-6">
        <div style={{ transform: "rotate(-3deg)" }}>
          <ImageStack
            image={bannerGrid[1].image}
            description={bannerGrid[1].description}
            width="260px"
            height="auto"
            priority="high"
            loading="eager"
          />
        </div>
      </div>

      {/* All animated images - desktop only */}
      <div className="hidden md:block">
        <FirstAnimatedImage
          key={0}
          image={firstItem.image}
          description={firstItem.description}
          width={firstItem.width}
          height={firstItem.height}
          offsetX={firstImageTransform.offsetX}
          offsetY={firstImageTransform.offsetY}
          rotation={firstImageTransform.rotation}
          totalImages={bannerGrid.length}
        />
        
        {/* Other images using AnimatedImageStack - lazy rendered individually */}
        {bannerGrid.slice(1).map((item, index) => {
          const actualIndex = index + 1;
          return (
            <LazyAnimatedImageStack
              key={actualIndex}
              image={item.image}
              description={item.description}
              index={actualIndex}
              totalImages={bannerGrid.length}
              width={item.width}
              height={item.height}
            />
          );
        })}
      </div>
    </div>
  );
});

GallerySection.displayName = "GallerySection";

// Lazy rendered AnimatedImageStack - only renders when near viewport
const LazyAnimatedImageStack = memo(({ image, description, index, totalImages, width, height }) => {
  const [shouldRender, ref] = useLazyRender({
    rootMargin: '400px', // Start rendering 400px before visible
    triggerOnce: true,
  });

  if (!shouldRender) {
    return <div ref={ref} style={{ position: 'absolute', visibility: 'hidden' }} />;
  }

  return (
    <div ref={ref}>
      <AnimatedImageStack
        image={image}
        description={description}
        index={index}
        totalImages={totalImages}
        width={width}
        height={height}
      />
    </div>
  );
});

LazyAnimatedImageStack.displayName = "LazyAnimatedImageStack";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [userRole, setUserRole] = useState("member");
  const [expandedRibbon, setExpandedRibbon] = useState(null);
  const [latestPost, setLatestPost] = useState(null);
  const [loadingLatestPost, setLoadingLatestPost] = useState(true);
  const [latestPostCommentCount, setLatestPostCommentCount] = useState(0);

  // Initialize performance monitoring
  useEffect(() => {
    const monitor = getPerformanceMonitor();
    // Monitor is auto-initialized, but we can trigger a report if needed
    return () => {
      // Cleanup if component unmounts
    };
  }, []);

  // Memoize duplicated sliding text array - only recreate if slidingText changes
  const itemsTwice = useMemo(() => [...slidingText, ...slidingText], []);

  // Fetch calendar events
  const { events, loading, error } = useGoogleCalendar();

  // Memoize calendar helper functions - stable references prevent re-renders
  const formatDate = useCallback((date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const formatTime = useCallback((dateTime) => {
    return new Date(dateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Advanced image preloading with priority queue
  useEffect(() => {
    const preloader = getImagePreloader();
    
    // Preload critical gallery images first (high priority)
    const criticalImages = bannerGrid.slice(0, 6).map(item => ({
      url: item.image,
      priority: 'high'
    }));
    
    // Preload remaining gallery images (auto priority)
    const remainingImages = bannerGrid.slice(6).map(item => ({
      url: item.image,
      priority: 'auto'
    }));
    
    // Preload background images (low priority - decorative)
    const backgroundImages = [
      { url: DesktopBackgroundFiller, priority: 'low' },
      { url: DesktopBackgroundDNA, priority: 'low' }
    ];
    
    // Load in priority order: critical -> remaining -> background
    preloader.preloadBatch(criticalImages).then(() => {
      // After critical images load, start remaining
      preloader.preloadBatch(remainingImages);
    });
    
    // Background images can load whenever
    preloader.preloadBatch(backgroundImages);
  }, []);

  // Simplified authentication result handling
  useEffect(() => {
    // Check for authentication errors in the URL hash
    const urlHash = window.location.hash.substring(1);
    const hashParams = new URLSearchParams(urlHash);
    const errorCode = hashParams.get("error_code");
    const errorDescription = hashParams.get("error_description");

    if (errorCode) {
      console.error("🚨 Authentication error:", errorCode, errorDescription);
      let errorMessage = "Authentication failed. ";
      if (errorCode === "otp_expired") {
        errorMessage += "The login link has expired. Please request a new one.";
      } else if (errorCode === "access_denied") {
        errorMessage += "Access was denied. Please try again.";
      } else {
        errorMessage += errorDescription || "Please try again.";
      }
      showSnackbar(errorMessage, "error", 10000);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (user) {
      // Show welcome message for new login
      const hasShownWelcome = sessionStorage.getItem("welcome_shown");
      if (!hasShownWelcome) {
        showSnackbar(`Welcome ${user.user_metadata?.first_name || "User"}!`, {
          customColor: "#772583",
        });
        sessionStorage.setItem("welcome_shown", "true");
      }

      // Clean up URL parameters
      if (window.location.search || window.location.hash) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    }
  }, [user, showSnackbar]);

  // Fetch user role from database
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          console.log("👤 Fetching user role for:", user.email);
      const { data, error } = await supabase
        .from("members")
        .select("role, national_member, major")
        .eq("user_id", user.id)
        .single();

          if (error) {
            console.error("❌ Error fetching user role:", error);
            setUserRole("member"); // Default to member on error
          } else {
            console.log("✅ User role fetched:", data?.role || "member");
            console.log(
              "✅ User national member status fetched:",
              data?.national_member
            );
            console.log("✅ User major fetched:", data?.major);
            setUserRole(data?.role || "member");

            // Check for missing profile information and show appropriate message
            // Only show snackbar if user is a member (not admin)
            if (data?.role === "member" || !data?.role) {
              const isNationalMemberNull = data?.national_member === null;
              const isMajorNull = data?.major === null;
              
              if (isNationalMemberNull && isMajorNull) {
                showSnackbar(
                  "Please update your National Member status and Major in the Dashboard",
                  {
                    customColor: "#ff9800",
                  }
                );
              } else if (isNationalMemberNull) {
                showSnackbar(
                  "Please update your National Member status in the Dashboard",
                  {
                    customColor: "#ff9800",
                  }
                );
              } else if (isMajorNull) {
                showSnackbar(
                  "Please update your Major in the Dashboard",
                  {
                    customColor: "#ff9800",
                  }
                );
              }
            }
          }
        } catch (error) {
          console.error("❌ Exception fetching user role:", error);
          setUserRole("member"); // Default to member on error
        }
      } else {
        setUserRole("member"); // Reset to default when no user
      }
    };

    fetchUserRole();
  }, [user, showSnackbar]);

  // Fetch latest blog post
  useEffect(() => {
    const fetchLatestPost = async () => {
      try {
        setLoadingLatestPost(true);
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .order("event_date", { ascending: false })
          .limit(1)
          .single();
        if (!error && data) {
          setLatestPost(data);
          // Fetch comment count for this post
          const { data: commentData } = await supabase
            .from("blog_comments")
            .select("id")
            .eq("post_id", data.id);
          setLatestPostCommentCount(commentData?.length ?? 0);
        }
      } catch (_) {
        // silently fail
      } finally {
        setLoadingLatestPost(false);
      }
    };
    fetchLatestPost();
  }, []);

  return (
    <>
      {/* Desktop Hero Section */}
      <div className="hidden md:block relative">
        {/* Full-width background extensions - desktop only */}
        <div className="absolute inset-0 h-[100dvh] bg-[#1A1A1A]" />
        <div className="fixed z-[-10] inset-0 h-[100dvh] w-full">
          <div className="absolute inset-0 h-[100dvh] w-full bg-gradient-to-b from-[#772583]/80 to-[#00629b]/80" />
          <img src={UF_Skyline} alt="UF Skyline" className="h-full w-full object-cover opacity-35" />
        </div>
        <div
          className="absolute top-0 bottom-0 right-0 bg-[#D9D9D9] h-[100dvh]"
          style={{ left: "60%" }}
        />

        {/* Centered content container */}
        <div className="relative min-h-[100dvh] max-w-[1600px] mx-auto overflow-hidden bg-[#1A1A1A]">
          {/* Right half overlay - positioned relative to container */}
          <div className="absolute inset-y-0 right-0 w-[44.5%] bg-[#D9D9D9] z-0" />

          {/* Large Circle with Particles - Desktop only */}
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-y-1/2 z-20">
            <div className="w-[100vh] h-[100vh] rounded-full bg-transparent relative overflow-hidden">
              <ParticlesBg id="particles-desktop" />
            </div>
          </div>

          {/* Centered DNA with filler behind */}
          <div className="absolute inset-0 z-10 pointer-events-none mt-4 ml-12">
            <img
              src={DesktopBackgroundFiller}
              alt="Background Filler"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="absolute left-1/2 top-1/2 -translate-x-[30%] -translate-y-1/2 h-screen w-auto z-10 opacity-100"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <img
                src={DesktopBackgroundDNA}
                alt="DNA"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                className="h-screen w-auto"
              />
            </div>
          </div>

          {/* Desktop Text Content */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-[48%] lg:w-[44%] xl:w-[40%] 2xl:w-[38%] h-[70vh] p-2 rounded-xl overflow-x-hidden overflow-y-auto">
            <div className="flex flex-col h-full justify-center gap-4 lg:gap-5">
              <h2 className="text-left mb-3 leading-tight text-[clamp(0.875rem,1.3vw,1.125rem)] text-white/80 font-light tracking-wide">
                <span className="text-white/40 mr-2">—</span>
                <span className="font-medium text-[#87dbe6] tracking-wider uppercase">EST 2025</span>
                <span className="text-white/30 mx-2.5">//</span>
                <span className="text-white/90 font-normal">University of Florida Student Chapter</span>
              </h2>
              <h1 className="font-bold text-left text-[#64aeb7] mb-3 leading-[1.08] tracking-tight text-[clamp(2rem,3.8vw,4rem)]">
                Engineering in Medicine &amp; Biology Society
              </h1>
              <p className="text-left border-l-2 border-white/50 pl-4 text-[clamp(1rem,1.4vw,1.5rem)] text-white/95 max-w-[65ch]">
                Bridging innovation, AI, and human health, we empower students
                to explore the frontiers of biomedical technology through
                collaboration, research, and real-world impact.
              </p>
              <div className="flex flex-row flex-wrap items-center justify-start gap-4 mt-6 pl-0">
                {user ? (
                  <button className="hero-btn-hover bg-gradient-to-t from-[#1c1c1c] to-[#404040] text-white border-2 border-[#595959] uppercase px-6 py-2.5 rounded text-[clamp(1rem,1.2vw,1.25rem)] hover:cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 min-w-[190px] text-center">
                    <Link
                      className="no-underline"
                      to={
                        userRole === "admin" ? "/admin-dashboard" : "/dashboard"
                      }
                    >
                      Dashboard
                    </Link>
                  </button>
                ) : (
                  <button className="hero-btn-hover bg-gradient-to-t from-[#1c1c1c] to-[#404040] text-white border-2 border-[#595959] uppercase px-6 py-2.5 rounded text-[clamp(1rem,1.2vw,1.25rem)] hover:cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 min-w-[190px] text-center">
                    <Link className="no-underline" to="/auth/register">
                      Join Society
                    </Link>
                  </button>
                )}
                <button className="hero-btn-ghost-hover text-white px-6 py-2.5 uppercase rounded text-[clamp(1rem,1.2vw,1.25rem)] hover:cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 min-w-[140px] text-center">
                  <Link className="no-underline" to="/events">
                    Explore Events →
                  </Link>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Image Grid - Optimized with lazy loading */}
          <div 
            className="absolute -right-0 top-20 bottom-0 my-auto z-30 w-[50%] h-[80vh]"
            style={{ contain: "layout style paint" }}
          >
            <ImageGrid
              Image0={Image0}
              Image1={Image1}
              Image2={Image2}
              Image3={Image3}
              Image4={Image4}
              Image5={Image5}
              Image6={Image6}
              Image7={Image7}
              Image8={Image8}
              Image9={Image9}
              Image10={Image10}
              Image11={Image11}
              Image12={Image12}
              gapSize="gap-[0.25rem]"
              paddingSize="p-2"
            />
          </div>
          {/* Scroll Down Icon */}
          <div className="absolute bottom-0 right-[30%] w-full flex mt-0 flex-col items-center mb-6">
            <IoIosArrowDown className="text-white text-4xl" />
          </div>
        </div>
      </div>

      {/* Mobile Hero Section */}
      <div className="md:hidden relative min-h-[100dvh] bg-[#1A1A1A] overflow-hidden">
        {/* UF Skyline Background */}
        <div className="fixed z-[-10] inset-0 h-[100dvh] w-full">
          <div className="absolute inset-0 h-[100dvh] w-full bg-gradient-to-b from-[#772583]/80 to-[#00629b]/80" />
          <img src={UF_Skyline} alt="UF Skyline" className="h-full w-full object-cover opacity-35" />
        </div>
        <div
          className="absolute left-0 right-0 bg-[#D9D9D9]"
          style={{
            top: "-5%",
            height: "clamp(25dvh, 35vh, 40dvh)",
            left: "0%",
          }}
        />

        <div
          className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none w-screen"
          style={{ top: "clamp(15%, 25vh, 35%)" }}
        >
          {/* Filler positioned relative to this container */}
          <img
            src={MobileBackgroundFiller}
            alt="Background Filler"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="absolute left-1/2 -translate-x-[50%] -translate-y-[31%] scale-102 h-auto w-screen z-10 opacity-100"
          />
          {/* DNA positioned relative to this container */}
          <img
            src={MobileBackgroundDNA}
            alt="DNA"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="absolute left-1/2 -translate-x-[50%] -translate-y-[12%] scale-102 h-auto w-screen z-20"
          />
        </div>

        {/* Particle Circle - Above background images - Mobile only */}
        <div className="md:hidden absolute -top-[5%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <div
            className="rounded-full bg-transparent relative overflow-hidden"
            style={{ width: "min(120vh, 180vw)", height: "min(120vh, 180vw)" }}
          >
            <div className="absolute inset-0 w-full h-full">
              <ParticlesBg id="particles-mobile" particleCount={250} />
            </div>
          </div>
        </div>

        {/* Mobile Image Grid - Optimized with lazy loading */}
        <div 
          className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[35] w-[90vw] h-[90vw] max-w-[500px] max-h-[500px]"
          style={{ contain: "layout style paint" }}
        >
          <ImageGrid
            Image0={Image0}
            Image1={Image1}
            Image2={Image2}
            Image3={Image3}
            Image4={Image4}
            Image5={Image5}
            Image6={Image6}
            Image7={Image7}
            Image8={Image8}
            Image9={Image9}
            Image10={Image10}
            Image11={Image11}
            Image12={Image12}
            gapSize="gap-[0.15rem]"
            paddingSize="p-1"
          />
        </div>

        {/* Mobile Text Content - Positioned below DNA */}
        <div
          className="absolute left-0 right-0 z-30 px-6"
          style={{ top: "clamp(45%, 52vh, 65%)" }}
        >
          <div className="text-center">
            <h2 className="text-left mb-3 leading-tight text-[clamp(0.875rem,1.3vw,1.125rem)] text-white/80 font-light tracking-wide">
                <span className="text-white/40 mr-2">—</span>
                <span className="font-medium text-[#87dbe6] tracking-wider uppercase">EST 2025</span>
                <span className="text-white/30 mx-2.5">//</span>
                <span className="text-white/90 font-normal">University of Florida Student Chapter</span>
              </h2>
            <h1 className="font-bold text-[#64aeb7] mb-4 text-[clamp(1.2rem,6.5vw,2.25rem)] leading-tight">
              Engineering in Medicine & Biology Society
            </h1>
            <p className="text-white/95 mb-6 text-[clamp(0.8rem,3.8vw,1.05rem)] leading-relaxed">
              Bridging innovation, AI, and human health, we empower students to
              explore the frontiers of biomedical technology through
              collaboration, research, and real-world impact.
            </p>
            <div className="flex flex-row gap-3 items-center justify-center">
              {user ? (
                <button className="bg-[#ffffff] text-black uppercase px-6 py-2.5 rounded text-[clamp(1rem,1.2vw,1.25rem)] shadow-[0_0_4px_rgba(255,255,255,0.85)] hover:shadow-[0_0_8px_rgba(255,255,255,0.85)] hover:cursor-pointer transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 min-w-[140px] text-center">
                  <Link
                    className="no-underline"
                    to={
                      userRole === "admin" ? "/admin-dashboard" : "/dashboard"
                    }
                  >
                    Dashboard
                  </Link>
                </button>
              ) : (
                <button className="bg-[#ffffff] text-black uppercase px-6 py-2.5 rounded text-[clamp(1rem,1.2vw,1.25rem)] shadow-[0_0_4px_rgba(255,255,255,0.85)] hover:shadow-[0_0_8px_rgba(255,255,255,0.85)] hover:cursor-pointer transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 min-w-[140px] text-center">
                  <Link className="no-underline" to="/auth/register">
                    Join Society
                  </Link>
                </button>
              )}
              <button className=" text-white px-6 py-2.5 uppercase rounded text-[clamp(1rem,1.2vw,1.25rem)] shadow-[0_0_4px_rgba(255,255,255,0.85)] hover:shadow-[0_0_8px_rgba(255,255,255,0.85)] hover:cursor-pointer transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 min-w-[140px] text-center">
                <Link className="no-underline" to="/events">
                  Explore Events →
                </Link>
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full justify-center flex mt-0 flex-col items-center mb-4">
          <IoIosArrowDown className="text-white text-4xl" />
        </div>
      </div>

      {/* Cool Sliding Content Banner */}
      <div className="w-full bg-[#1A1A1A] py-4 overflow-hidden relative">
        {/* Left gradient overlay */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />
        {/* Right gradient overlay */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />
        <div
          className="
          inline-flex items-center gap-6 whitespace-nowrap
          animate-[move-left_28s_linear_infinite]
          motion-reduce:animate-none
        "
        >
          {itemsTwice.map((text, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="text-[#5a5a5a] italic uppercase font-semibold text-xl md:text-4xl leading-tight">
                {text}
              </span>
              <LuDna className="text-[#5a5a5a] text-xl md:text-4xl ml-6" />
            </span>
          ))}
        </div>
      </div>

      {/* Rest of page content */}
      <div className="bg-none" style={{ contain: "layout style" }}>
        {/* Upcoming Events — Ribbon Style */}
        <div 
          className="max-w-6xl mx-auto px-4 md:px-10 mt-16"
          style={{ contentVisibility: 'auto', contain: "layout style paint" }}
        >
          <h1 className="text-4xl text-white font-bold text-center mb-10 italic" style={{ fontFamily: "'Georgia', serif" }}>
            Upcoming Events
          </h1>

          {loading ? (
            <div className="flex flex-col gap-0">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse border-t border-white/10"
                  style={{ backdropFilter: "blur(20px)" }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col">
              {[0, 1, 2].map((idx) => {
                const event = events[idx];
                const isExpanded = expandedRibbon === idx;
                const isPlaceholder = !event;

                const placeholderMessages = [
                  "More events loading, check back soon",
                  "Something big is brewing... trust",
                  "Hold tight, more is on the way",
                ];

                return (
                  <div
                    key={idx}
                    className={`border-t border-white/40 ${
                      idx === 2 ? "border-b border-white/40" : ""
                    } transition-all duration-500 ease-in-out overflow-hidden ${
                      isPlaceholder ? "" : "cursor-pointer group"
                    }`}
                    style={{
                      backdropFilter: "blur(40px)",
                      WebkitBackdropFilter: "blur(40px)",
                    }}
                    onClick={() => {
                      if (isPlaceholder) return;
                      setExpandedRibbon(isExpanded ? null : idx);
                    }}
                  >
                    {/* Collapsed Ribbon */}
                    <div className={`relative z-10 flex items-center justify-between gap-6 py-7 md:py-9 px-4 md:px-8 transition-colors duration-300 ${
                      isPlaceholder ? "opacity-35" : ""
                    }`}>
                      {/* Left: number + event name + mobile meta */}
                      <div className="flex items-center gap-5 md:gap-8 min-w-0">
                        <span
                          className="text-white text-4xl md:text-6xl font-black leading-none flex-shrink-0 select-none"
                          style={{ fontFamily: "'Georgia', serif" }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        {isPlaceholder ? (
                          <p className="text-white text-xl md:text-2xl font-semibold italic">
                            {placeholderMessages[idx]}
                          </p>
                        ) : (
                          <div className="flex flex-col gap-2 min-w-0">
                            <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight group-hover:text-white/80 transition-colors duration-300" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
                              {event.summary}
                            </h2>
                            {/* Mobile-only meta */}
                            <div className="flex md:hidden flex-col gap-1 text-white text-xs font-medium">
                              <span className="inline-flex items-center gap-1.5">
                                <svg className="w-3 h-3 opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {formatDate(event.start?.dateTime || event.start?.date)}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <svg className="w-3 h-3 opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {formatTime(event.start?.dateTime)}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <svg className="w-3 h-3 opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {event.location || "TBD"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right side: meta + chevron */}
                      {!isPlaceholder && (
                        <div className="flex items-center gap-6 flex-shrink-0">
                          <div className="hidden md:flex flex-col items-end gap-1.5 text-white text-sm font-medium">
                            <span className="inline-flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              {formatDate(event.start?.dateTime || event.start?.date)}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              {formatTime(event.start?.dateTime)}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              {event.location || "TBD"}
                            </span>
                          </div>
                          <div className={`text-white/25 group-hover:text-white/50 transition-all duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expanded content */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isExpanded ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      {event && (
                        <div className="relative z-10 px-4 md:px-8 pb-8">
                          <div className="border-t border-white/10 pt-5">
                            <p className="text-white text-sm md:text-base leading-relaxed max-w-3xl whitespace-pre-line text-center mx-auto">
                              {event.description || "More details coming soon!"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>


      {/* Image Stack - Polaroid Style - All Images */}
      <GallerySection />

      {/* Latest Blog Post Section */}
      <div className="w-full mt-16 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white italic leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
                Check Out Our Latest Post!
              </h1>
              <p className="text-white text-sm mt-2">Stay in the loop — see what we've been up to ✨</p>
            </div>
            <Link
              to="/blog"
              className="no-underline self-start md:self-auto inline-flex items-center gap-2 text-white/60 hover:text-white font-semibold text-sm uppercase tracking-wider transition-colors duration-200 group"
            >
              All Posts
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
          </div>

          {/* Blog Card */}
          {loadingLatestPost ? (
            <div className="rounded-3xl bg-white/75 border border-white/10 h-72 md:h-80 animate-pulse" />
          ) : latestPost ? (
            <div
              className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/55 backdrop-blur-[10px] flex flex-col md:flex-row group hover:border-[#772583]/50 transition-all duration-500"
              style={{
                boxShadow: "0 0 0 1px rgba(119,37,131,0.1), 0 24px 64px rgba(0,0,0,0.45)",
              }}
            >
              {/* Left gradient accent strip */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#772583] via-[#00629B] to-[#00A3AD] rounded-l-3xl" />

              {/* Image Panel */}
              {latestPost.image_urls && latestPost.image_urls.length > 0 && (
                <div className="md:w-[42%] h-56 md:h-auto relative overflow-hidden flex-shrink-0">
                  <img
                    src={latestPost.image_urls[0]}
                    alt={latestPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#1A1A1A]/70 hidden md:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 to-transparent md:hidden" />
                </div>
              )}

              {/* Content Panel */}
              <div className="flex-1 p-8 md:p-10 pl-10 md:pl-12 flex flex-col justify-between gap-5">
                {/* Date + type badge row */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="text-[#00A3AD] uppercase tracking-widest">
                    {latestPost.event_date
                      ? new Date(latestPost.event_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                      : new Date(latestPost.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="text-black/30">•</span>
                  <span className="text-black/50">{Math.ceil(latestPost.content.length / 450)} min read</span>
                  <span className="text-black/30">•</span>
                  <span className="text-black/50 inline-flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {latestPostCommentCount} {latestPostCommentCount === 1 ? "comment" : "comments"}
                  </span>
                  {latestPost.post_type === "video" && (
                    <>
                      <span className="text-black/30">•</span>
                      <span className="bg-[#00629B]/20 border border-[#00629B]/40 text-[#5BB8FF] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                        Video
                      </span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-black leading-snug">
                  {latestPost.title}
                </h2>

                {/* Content preview */}
                <p className="text-black/60 text-sm md:text-base leading-relaxed line-clamp-4">
                  {latestPost.content}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-4 pt-2">
                  <Link
                    to="/blog"
                    className="no-underline inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#772583] hover:bg-[#8f2e9c] text-white text-sm font-semibold transition-colors duration-200 shadow-[0_0_16px_rgba(119,37,131,0.35)] hover:shadow-[0_0_24px_rgba(119,37,131,0.55)]"
                  >
                    Read More
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Decorative glow blob */}
              <div
                className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20 blur-3xl"
                style={{ background: "radial-gradient(circle, #772583 0%, transparent 70%)" }}
              />
            </div>
          ) : (
            <div
              className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 px-10 py-14 flex flex-col items-center gap-4 text-center"
              style={{ boxShadow: "0 0 0 1px rgba(119,37,131,0.1), 0 20px 60px rgba(0,0,0,0.3)" }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#772583] via-[#00629B] to-[#00A3AD] rounded-l-3xl" />
              <LuDna className="text-[#772583] text-4xl" />
              <p className="text-white/50 text-base">No posts yet — something exciting is brewing!</p>
              <Link to="/blog" className="no-underline text-[#C56FD1] font-semibold hover:text-white transition-colors duration-200">Check the Blog →</Link>
            </div>
          )}
        </div>
      </div>

        <div className="mb-10 mt-[-60px]"></div>
        {/* Footer */}
        <Footer />
      </div>

    </>
  );
}
