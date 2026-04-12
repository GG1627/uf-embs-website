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

import useGoogleCalendar from "../../lib/useGoogleCalendar";
import { getKeyframeManager } from "../../lib/keyframeManager";
import { useAnimationControl } from "../../lib/useAnimationControl";
import { getImagePreloader } from "../../lib/imagePreloader";
import { getPerformanceMonitor } from "../../lib/performanceMonitor";
import { useLazyRender } from "../../lib/useLazyRender";


// Optimized ImageGrid component - memoized and lazy-loaded
// Hidden SVG grain filter — rendered once, referenced by id across the grid
const GrainFilter = () => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <defs>
      <filter id="img-grain" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.76" numOctaves="4" stitchTiles="stitch" result="noise" />
        <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
        <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" result="blended" />
        <feComponentTransfer in="blended">
          <feFuncR type="linear" slope="0.88" intercept="0.04" />
          <feFuncG type="linear" slope="0.88" intercept="0.04" />
          <feFuncB type="linear" slope="0.82" intercept="0.06" />
        </feComponentTransfer>
      </filter>
    </defs>
  </svg>
);

const ImageGrid = memo(({ 
  Image0, Image1, Image2, Image3, Image4, Image5, 
  Image6, Image7, Image8, Image9, Image10, Image11, Image12,
  gapSize = "gap-1",
  paddingSize = "p-2"
}) => {
  return (
    <div className="relative h-full w-full">
      <GrainFilter />
      <div 
        className={`h-full w-full grid grid-cols-[41fr_39fr_103fr] ${gapSize} ${paddingSize}`}
        style={{ contain: "layout style paint" }}
      >
        {/* Column 1 */}
        <div className={`flex flex-col ${gapSize} h-[56%] mt-[65%] items-end`}>
          <div className="bg-[#b0b0b0] rounded-[3px] h-[20%] w-[70%] overflow-hidden">
            <img src={Image0} alt="Image Grid" className="h-full w-full object-cover opacity-55 hover:opacity-80 transition-opacity duration-300" style={{ filter: "url(#img-grain) contrast(1.08) sepia(0.12)" }} loading="lazy" decoding="async" fetchPriority="low" />
          </div>
          <div className="bg-[#b0b0b0] rounded-[3px] h-[35%] w-full overflow-hidden">
            <img src={Image1} alt="Image Grid" className="h-full w-full object-cover opacity-55 hover:opacity-80 transition-opacity duration-300" style={{ filter: "url(#img-grain) contrast(1.08) sepia(0.12)" }} loading="lazy" fetchPriority="low" decoding="async" />
          </div>
          <div className="bg-[#b0b0b0] rounded-[3px] h-[30%] w-[85%] overflow-hidden">
            <img src={Image3} alt="Image Grid" className="h-full w-full object-cover opacity-55 hover:opacity-80 transition-opacity duration-300" style={{ filter: "url(#img-grain) contrast(1.08) sepia(0.12)" }} loading="lazy" fetchPriority="low" decoding="async" />
          </div>
        </div>
        {/* Column 2 */}
        <div className={`flex flex-col ${gapSize} h-[78%] mt-[20%] items-end`}>
          <div className="bg-[#b0b0b0] rounded-[3px] h-[25%] w-full overflow-hidden">
            <img src={Image2} alt="Image Grid" className="h-full w-full object-cover opacity-55 hover:opacity-80 transition-opacity duration-300" style={{ filter: "url(#img-grain) contrast(1.08) sepia(0.12)" }} loading="lazy" fetchPriority="low" decoding="async" />
          </div>
          <div className="bg-[#b0b0b0] rounded-[3px] h-[40%] w-full overflow-hidden">
            <img src={Image4} alt="Image Grid" className="h-full w-full object-cover opacity-55 hover:opacity-80 transition-opacity duration-300" style={{ filter: "url(#img-grain) contrast(1.08) sepia(0.12)" }} loading="lazy" fetchPriority="low" decoding="async" />
          </div>
          <div className="bg-[#b0b0b0] rounded-[3px] h-[30%] w-full overflow-hidden">
            <img src={Image5} alt="Image Grid" className="h-full w-full object-cover opacity-55 hover:opacity-80 transition-opacity duration-300" style={{ filter: "url(#img-grain) contrast(1.08) sepia(0.12)" }} loading="lazy" fetchPriority="low" decoding="async" />
          </div>
        </div>
        {/* Column 3 */}
        <div className={`flex flex-col ${gapSize} h-full items-start`}>
          {/* Row 1 */}
          <div className={`flex flex-row ${gapSize} h-[35%] w-[85%]`}>
            <div className="bg-[#b0b0b0] rounded-[3px] h-full w-[40%] overflow-hidden">
              <img src={Image6} alt="Image Grid" className="h-full w-full object-cover opacity-55 hover:opacity-80 transition-opacity duration-300" style={{ filter: "url(#img-grain) contrast(1.08) sepia(0.12)" }} loading="lazy" fetchPriority="low" decoding="async" />
            </div>
            <div className="bg-[#b0b0b0] rounded-[3px] h-[80%] w-[60%] self-end overflow-hidden">
              <img src={Image7} alt="Image Grid" className="h-full w-full object-cover opacity-55 hover:opacity-80 transition-opacity duration-300" style={{ filter: "url(#img-grain) contrast(1.08) sepia(0.12)" }} loading="lazy" fetchPriority="low" decoding="async" />
            </div>
          </div>
          {/* Row 2 */}
          <div className={`flex flex-row h-[70%] ${gapSize} w-full`}>
            <div className={`flex flex-col ${gapSize} h-full w-[53%]`}>
              <div className="bg-[#b0b0b0] rounded-[3px] h-[50%] w-full overflow-hidden">
                <img src={Image8} alt="Image Grid" className="h-full w-full object-cover opacity-55 hover:opacity-80 transition-opacity duration-300" style={{ filter: "url(#img-grain) contrast(1.08) sepia(0.12)" }} loading="lazy" fetchPriority="low" decoding="async" />
              </div>
              <div className={`flex flex-row ${gapSize} h-[30%] w-full`}>
                <div className="bg-[#b0b0b0] rounded-[3px] h-full w-[47%] overflow-hidden">
                  <img src={Image10} alt="Image Grid" className="h-full w-full object-cover opacity-55 hover:opacity-80 transition-opacity duration-300" style={{ filter: "url(#img-grain) contrast(1.08) sepia(0.12)" }} loading="lazy" fetchPriority="low" decoding="async" />
                </div>
                <div className="bg-[#b0b0b0] rounded-[3px] h-[85%] w-[53%] overflow-hidden">
                  <img src={Image12} alt="Image Grid" className="h-full w-full object-cover opacity-55 hover:opacity-80 transition-opacity duration-300" style={{ filter: "url(#img-grain) contrast(1.08) sepia(0.12)" }} loading="lazy" fetchPriority="low" decoding="async" />
                </div>
              </div>
            </div>
            <div className={`flex flex-col ${gapSize} h-[70%] w-[47%]`}>
              <div className="bg-[#b0b0b0] rounded-[3px] h-[60%] w-full overflow-hidden">
                <img src={Image9} alt="Image Grid" className="h-full w-full object-cover opacity-55 hover:opacity-80 transition-opacity duration-300" style={{ filter: "url(#img-grain) contrast(1.08) sepia(0.12)" }} loading="lazy" fetchPriority="low" decoding="async" />
              </div>
              <div className="bg-[#b0b0b0] rounded-[3px] h-[35%] w-[80%] overflow-hidden">
                <img src={Image11} alt="Image Grid" className="h-full w-full object-cover opacity-55 hover:opacity-80 transition-opacity duration-300" style={{ filter: "url(#img-grain) contrast(1.08) sepia(0.12)" }} loading="lazy" fetchPriority="low" decoding="async" />
              </div>
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
    return (
      <div 
        ref={galleryRef}
        className="w-full border-t border-[#E8E4DD] mt-0 py-6 md:py-20 h-auto md:min-h-[540px] relative"
        style={{
          backgroundImage: `url(${UF_Skyline})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/90 z-0" />
        <div className="relative z-10 max-w-7xl mx-auto h-full md:min-h-[540px]">
          <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-4 md:left-8 lg:left-16 z-30 max-w-[260px]">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00629B] mb-4"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              In the Field
            </p>
            <h2 className="text-3xl md:text-4xl font-medium text-[#1A1A1A] leading-snug mb-3"
              style={{ fontFamily: "'Lora', Georgia, serif" }}>
              The EMBS Gallery
            </h2>
            <p className="text-[#6B7280] text-sm leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              A few shots from our events and activities
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
      className="w-full border-t border-[#E8E4DD] mt-0 py-6 md:py-20 h-auto md:min-h-[540px] relative"
      style={{
        backgroundImage: `url(${UF_Skyline})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* White overlay — lets skyline peek through softly */}
      <div className="absolute inset-0 bg-white/90 z-0" />

      {/* Gallery Title - Left Side */}
      <div className="relative z-10 max-w-7xl mx-auto h-full md:min-h-[540px]">
        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-4 md:left-8 lg:left-16 z-30 max-w-[260px]">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00629B] mb-4"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            In the Field
          </p>
          <h2 className="text-3xl md:text-4xl font-medium text-[#1A1A1A] leading-snug mb-3"
            style={{ fontFamily: "'Lora', Georgia, serif" }}>
            The EMBS Gallery
          </h2>
          <p className="text-[#6B7280] text-sm leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            A few shots from our events and activities
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
        <div className="absolute inset-0 h-[100dvh] bg-[#efefef]" />
        <div className="fixed z-[-10] inset-0 h-[100dvh] w-full">
          <div className="absolute inset-0 h-[100dvh] w-full bg-gradient-to-b from-[#772583]/30 to-[#00629b]/30" />
          <img src={UF_Skyline} alt="UF Skyline" className="h-full w-full object-cover opacity-20" />
        </div>
        <div
          className="absolute top-0 bottom-0 right-0 bg-[#efefef] h-[100dvh]"
          style={{ left: "60%" }}
        />

        {/* Centered content container */}
        <div className="relative min-h-[100dvh] max-w-[1600px] mx-auto overflow-hidden bg-[#efefef]">
          {/* Right half overlay - positioned relative to container */}
          <div className="absolute inset-y-0 right-0 w-[44.5%] bg-[#efefef] z-0" />

          {/* Layer 1: Filler background */}
          <div className="absolute inset-0 z-10 pointer-events-none mt-4 ml-12">
            {/* <img
              src={DesktopBackgroundFiller}
              alt="Background Filler"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="absolute left-1/2 top-1/2 -translate-x-[30%] -translate-y-1/2 h-screen w-auto"
            /> */}
          </div>

          {/* Layer 2: Particles — above filler, below DNA */}
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-y-1/2 z-20">
            <div className="w-[100vh] h-[100vh] rounded-full bg-transparent relative overflow-hidden">
              <ParticlesBg id="particles-desktop" />
            </div>
          </div>

          {/* Layer 3: DNA image — softened with blur + contrast filter */}
          <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center mt-4 ml-12">
            <img
              src={DesktopBackgroundDNA}
              alt="DNA"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="h-screen w-auto"
              style={{ filter: "blur(0.8px) contrast(0.70) brightness(1.26) saturate(0.85)" }}
            />
          </div>

          {/* Desktop Text Content */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40 w-[48%] lg:w-[44%] xl:w-[40%] 2xl:w-[38%] h-[70vh] p-2 overflow-x-hidden overflow-y-auto">
            <div className="flex flex-col h-full justify-center gap-4 lg:gap-5">
              <h2 className="text-left mb-3 leading-tight text-[clamp(0.875rem,1.3vw,1.125rem)] font-light tracking-wide"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                <span className="font-semibold text-[#00629B] tracking-wider uppercase">EST 2025</span>
                <span className="text-[#1A1A1A]/25 mx-2.5">//</span>
                <span className="text-[#1A1A1A]/60 font-light">University of Florida Student Chapter</span>
              </h2>
              <h1 className="font-medium text-left text-[#1A1A1A] mb-3 leading-[1.1] tracking-[-0.01em] text-[clamp(2rem,3.8vw,4rem)]"
                style={{ fontFamily: "'Lora', Georgia, serif" }}>
                Engineering in Medicine &amp; Biology Society
              </h1>
              <p className="text-left border-l-2 border-[#1A1A1A]/20 pl-4 text-[clamp(0.9rem,1.2vw,1.15rem)] text-[#1A1A1A]/55 max-w-[55ch] font-light leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                Bridging innovation, AI, and human health, we empower students
                to explore the frontiers of biomedical technology through
                collaboration, research, and real-world impact.
              </p>
              <div className="flex flex-row flex-wrap items-center justify-start gap-4 mt-6 pl-0">
                {user ? (
                  <button className="bg-[#1A1A1A] hover:bg-[#00629B] text-white uppercase px-6 py-2.5 text-[clamp(0.8rem,1vw,1rem)] tracking-wider hover:cursor-pointer focus:outline-none transition-colors duration-200 min-w-[190px] text-center"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Link className="no-underline" to={userRole === "admin" ? "/admin-dashboard" : "/dashboard"}>
                      Dashboard
                    </Link>
                  </button>
                ) : (
                  <button className="bg-[#1A1A1A] hover:bg-[#00629B] text-white uppercase px-6 py-2.5 text-[clamp(0.8rem,1vw,1rem)] tracking-wider hover:cursor-pointer focus:outline-none transition-colors duration-200 min-w-[190px] text-center"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Link className="no-underline" to="/auth/register">
                      Join Society
                    </Link>
                  </button>
                )}
                <button className="border border-[#1A1A1A]/30 hover:border-[#1A1A1A] text-[#1A1A1A]/70 hover:text-[#1A1A1A] px-6 py-2.5 uppercase text-[clamp(0.8rem,1vw,1rem)] tracking-wider hover:cursor-pointer focus:outline-none transition-colors duration-200 min-w-[140px] text-center"
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  <Link className="no-underline" to="/events">
                    Explore Events →
                  </Link>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Image Grid - Optimized with lazy loading */}
          <div 
            className="absolute -right-0 top-20 bottom-0 my-auto z-40 w-[50%] h-[80vh]"
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
          <div className="absolute bottom-0 right-[30%] w-full flex mt-0 flex-col items-center mb-6 z-40">
            <IoIosArrowDown className="text-[#1A1A1A]/40 text-3xl" />
          </div>
        </div>
      </div>

      {/* Mobile Hero Section */}
      <div className="md:hidden relative min-h-[100dvh] bg-[#D9D9D9] overflow-hidden">
        {/* UF Skyline Background */}
        <div className="fixed z-[-10] inset-0 h-[100dvh] w-full">
          <div className="absolute inset-0 h-[100dvh] w-full bg-gradient-to-b from-[#772583]/20 to-[#00629b]/20" />
          <img src={UF_Skyline} alt="UF Skyline" className="h-full w-full object-cover opacity-15" />
        </div>
        <div
          className="absolute left-0 right-0 bg-[#D9D9D9]"
          style={{
            top: "-5%",
            height: "clamp(25dvh, 35vh, 40dvh)",
            left: "0%",
          }}
        />

        {/* Layer 1: Filler */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none w-screen"
          style={{ top: "clamp(15%, 25vh, 35%)" }}
        >
          <img
            src={MobileBackgroundFiller}
            alt="Background Filler"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="absolute left-1/2 -translate-x-[50%] -translate-y-[31%] scale-102 h-auto w-screen"
          />
        </div>

        {/* Layer 2: Particles — above filler, below DNA - Mobile only */}
        <div className="md:hidden absolute -top-[5%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div
            className="rounded-full bg-transparent relative overflow-hidden"
            style={{ width: "min(120vh, 180vw)", height: "min(120vh, 180vw)" }}
          >
            <div className="absolute inset-0 w-full h-full">
              <ParticlesBg id="particles-mobile" particleCount={80} />
            </div>
          </div>
        </div>

        {/* Layer 3: DNA — softened filter, above particles */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none w-screen"
          style={{ top: "clamp(15%, 25vh, 35%)" }}
        >
          <img
            src={MobileBackgroundDNA}
            alt="DNA"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="absolute left-1/2 -translate-x-[50%] -translate-y-[12%] scale-102 h-auto w-screen"
            style={{ filter: "blur(0.6px) contrast(0.88) brightness(1.06) saturate(0.85)" }}
          />
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
            <h2 className="text-left mb-3 leading-tight text-[clamp(0.875rem,3.5vw,1rem)] font-light tracking-wide"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                <span className="font-semibold text-[#00629B] tracking-wider uppercase">EST 2025</span>
                <span className="text-[#1A1A1A]/25 mx-2.5">//</span>
                <span className="text-[#1A1A1A]/55 font-light">University of Florida Student Chapter</span>
              </h2>
            <h1 className="font-medium text-[#1A1A1A] mb-4 text-[clamp(1.2rem,6.5vw,2.25rem)] leading-[1.15] tracking-[-0.01em]"
              style={{ fontFamily: "'Lora', Georgia, serif" }}>
              Engineering in Medicine & Biology Society
            </h1>
            <p className="text-[#1A1A1A]/55 mb-6 text-[clamp(0.8rem,3.8vw,1rem)] leading-relaxed font-light"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              Bridging innovation, AI, and human health, we empower students to
              explore the frontiers of biomedical technology through
              collaboration, research, and real-world impact.
            </p>
            <div className="flex flex-row gap-3 items-center justify-center">
              {user ? (
                <button className="bg-[#1A1A1A] hover:bg-[#00629B] text-white uppercase px-6 py-2.5 text-sm tracking-wider hover:cursor-pointer transition-colors duration-200 focus:outline-none min-w-[140px] text-center"
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  <Link className="no-underline" to={userRole === "admin" ? "/admin-dashboard" : "/dashboard"}>
                    Dashboard
                  </Link>
                </button>
              ) : (
                <button className="bg-[#1A1A1A] hover:bg-[#00629B] text-white uppercase px-6 py-2.5 text-sm tracking-wider hover:cursor-pointer transition-colors duration-200 focus:outline-none min-w-[140px] text-center"
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  <Link className="no-underline" to="/auth/register">
                    Join Society
                  </Link>
                </button>
              )}
              <button className="border border-[#1A1A1A]/30 hover:border-[#1A1A1A] text-[#1A1A1A]/60 hover:text-[#1A1A1A] px-6 py-2.5 uppercase text-sm tracking-wider hover:cursor-pointer transition-colors duration-200 focus:outline-none min-w-[140px] text-center"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                <Link className="no-underline" to="/events">
                  Explore Events →
                </Link>
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full justify-center flex mt-0 flex-col items-center mb-4">
          <IoIosArrowDown className="text-[#1A1A1A]/40 text-3xl" />
        </div>
      </div>

      {/* Marquee strip */}
      <div className="w-full bg-[#111110] border-t border-white/[0.06] py-4 overflow-hidden relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-[#111110] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-[#111110] to-transparent" />
        <div
          className="inline-flex items-center gap-6 whitespace-nowrap animate-[move-left_28s_linear_infinite] motion-reduce:animate-none"
        >
          {itemsTwice.map((text, i) => (
            <span key={i} className="inline-flex items-center">
              <span
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="text-white/20 uppercase font-semibold tracking-[0.12em] text-sm md:text-base leading-tight"
              >
                {text}
              </span>
              <LuDna className="text-white/15 text-sm md:text-base ml-6" />
            </span>
          ))}
        </div>
      </div>

      {/* Rest of page content */}
      <div className="bg-[#111110]" style={{ contain: "layout style" }}>
        {/* Upcoming Events — Ribbon Style */}
        <div 
          className="max-w-5xl mx-auto px-6 md:px-10 pt-20 pb-26"
          style={{ contentVisibility: 'auto', contain: "layout style paint" }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#6B9FC4] mb-4"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                What's Coming Up
              </p>
              <h2
                style={{ fontFamily: "'Lora', Georgia, serif" }}
                className="text-3xl md:text-[2.5rem] font-medium leading-[1.15] tracking-[-0.01em] text-white"
              >
                Upcoming Events
              </h2>
            </div>
            <Link
              to="/events"
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="no-underline self-start md:self-auto text-[0.8125rem] font-medium text-white/40 hover:text-white transition-colors duration-200 tracking-wide pb-1 border-b border-white/20 hover:border-white/60 group"
            >
              Full calendar
              <span className="inline-block group-hover:translate-x-0.5 transition-transform duration-200 ml-1">→</span>
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-20 animate-pulse border-t border-white/[0.08]" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col">
              {[0, 1, 2].map((idx) => {
                const event = events[idx];
                const isExpanded = expandedRibbon === idx;
                const isPlaceholder = !event;

                const placeholderMessages = [
                  "More events coming, check back soon",
                  "Something is brewing, stay tuned",
                  "Hold tight, more is on the way",
                ];

                return (
                  <div
                    key={idx}
                    className={`border-t border-white/[0.18] ${
                      idx === 2 ? "border-b border-white/[0.18]" : ""
                    } transition-all duration-500 ease-in-out overflow-hidden ${
                      isPlaceholder ? "" : "cursor-pointer group"
                    }`}
                    onClick={() => {
                      if (isPlaceholder) return;
                      setExpandedRibbon(isExpanded ? null : idx);
                    }}
                  >
                    {/* Collapsed Ribbon */}
                    <div className={`flex items-center justify-between gap-6 py-6 md:py-8 transition-colors duration-300 ${
                      isPlaceholder ? "opacity-45" : ""
                    }`} style={{ fontFamily: "'Inter', sans-serif" }}>
                      {/* Left: number + event name */}
                      <div className="flex items-center gap-5 md:gap-8 min-w-0">
                        <span
                          className="text-white text-2xl md:text-3xl font-light leading-none flex-shrink-0 select-none tabular-nums"
                          style={{ fontFamily: "'Lora', Georgia, serif" }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        {isPlaceholder ? (
                          <p className="text-white text-base md:text-lg font-light italic">
                            {placeholderMessages[idx]}
                          </p>
                        ) : (
                          <div className="flex flex-col gap-1.5 min-w-0">
                            <h2
                              className="text-white text-xl md:text-2xl lg:text-[2.60rem] font-medium leading-tight tracking-[-0.01em] group-hover:text-white/70 transition-colors duration-300"
                              style={{ fontFamily: "'Lora', Georgia, serif" }}
                            >
                              {event.summary}
                            </h2>
                            {/* Mobile-only meta */}
                            <div className="flex md:hidden flex-col gap-0.5 text-white/35 text-xs">
                              <span>{formatDate(event.start?.dateTime || event.start?.date)}</span>
                              <span>{event.location || "TBD"}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right side: meta + chevron */}
                      {!isPlaceholder && (
                        <div className="flex items-center gap-8 flex-shrink-0">
                          <div className="hidden md:flex flex-col items-end gap-1 text-white/35 text-xs font-light">
                            <span>{formatDate(event.start?.dateTime || event.start?.date)}</span>
                            <span>{formatTime(event.start?.dateTime)}</span>
                            <span>{event.location || "TBD"}</span>
                          </div>
                          <div className={`text-white/20 group-hover:text-white/50 transition-all duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
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
                        <div className="pb-8">
                          <p
                            className="text-white/45 text-sm md:text-base leading-relaxed max-w-2xl font-light whitespace-pre-line"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {event.description || "More details coming soon."}
                          </p>
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
      <div
        className="w-full bg-white border-t border-[#E8E4DD] py-20 px-6 md:px-10"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="max-w-5xl mx-auto">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-4">
                Latest from the Gazette
              </p>
              <h2
                style={{ fontFamily: "'Lora', Georgia, serif" }}
                className="text-3xl md:text-[2.5rem] font-medium leading-[1.15] tracking-[-0.01em] text-[#1A1A1A]"
              >
                Our Most Recent Post
              </h2>
            </div>
            <Link
              to="/blog"
              className="no-underline self-start md:self-auto text-[0.8125rem] font-medium text-[#6B7280] hover:text-[#1A1A1A] transition-colors duration-200 tracking-wide pb-1 border-b border-[#D0CCC4] hover:border-[#1A1A1A] group"
            >
              All posts
              <span className="inline-block group-hover:translate-x-0.5 transition-transform duration-200 ml-1">→</span>
            </Link>
          </div>

          {/* Blog Card */}
          {loadingLatestPost ? (
            <div className="bg-[#F8F6F1] border border-[#E8E4DD] h-72 md:h-64 animate-pulse" />
          ) : latestPost ? (
            <div className="flex flex-col md:flex-row border border-[#E8E4DD] bg-[#F8F6F1] group hover:bg-white transition-colors duration-300">
              {/* Image Panel */}
              {latestPost.image_urls && latestPost.image_urls.length > 0 && (
                <div className="md:w-[35%] h-56 md:h-auto md:min-h-[340px] relative overflow-hidden flex-shrink-0">
                  <img
                    src={latestPost.image_urls[0]}
                    alt={latestPost.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}

              {/* Content Panel */}
              <div className="flex-1 p-8 md:p-10 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-[#E8E4DD]">
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-[#9A9A9A] uppercase tracking-wider">
                  <span>
                    {latestPost.event_date
                      ? new Date(latestPost.event_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                      : new Date(latestPost.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="text-[#D0CCC4]">·</span>
                  <span>{Math.ceil(latestPost.content.length / 450)} min read</span>
                  <span className="text-[#D0CCC4]">·</span>
                  <span>{latestPostCommentCount} {latestPostCommentCount === 1 ? "comment" : "comments"}</span>
                  {latestPost.post_type === "video" && (
                    <>
                      <span className="text-[#D0CCC4]">·</span>
                      <span className="text-[#00629B]">Video</span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h3
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                  className="text-2xl md:text-3xl font-medium text-[#1A1A1A] leading-snug tracking-[-0.01em]"
                >
                  {latestPost.title}
                </h3>

                {/* Content preview */}
                <p className="text-[#6B7280] text-sm md:text-base leading-relaxed line-clamp-[8] md:line-clamp-[10] font-light">
                  {latestPost.content}
                </p>

                {/* CTA */}
                <div className="mt-2">
                  <Link
                    to="/blog"
                    className="no-underline inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#772583] text-white text-[0.8125rem] font-medium transition-colors duration-200"
                  >
                    Read More
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-[#E8E4DD] bg-[#F8F6F1] px-10 py-16 flex flex-col items-center gap-4 text-center">
              <LuDna className="text-[#772583] text-3xl opacity-50" />
              <p className="text-[#9A9A9A] text-base font-light">No posts yet. Something exciting is on its way.</p>
              <Link to="/blog" className="no-underline text-[0.8125rem] text-[#00629B] hover:text-[#772583] font-medium transition-colors duration-200">
                Check the Blog →
              </Link>
            </div>
          )}
        </div>
      </div>

        {/* Footer */}
        <Footer />
      </div>

    </>
  );
}
