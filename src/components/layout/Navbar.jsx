import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EMBSLogoInner from "../../assets/logos/EMBS_logo_inner_layer.svg";
import EMBSLogoOuter from "../../assets/logos/EMBS_logo_outer_layer.svg";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../pages/auth/AuthContext";
import { supabase } from "../../lib/supabase";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("");
  const [role, setRole] = useState("member");
  const [isMenuTransitioning, setIsMenuTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Always use light navbar (white background)
  const isDarkNavbar = false;

  // helper function to check active path for link styling
  const linkClass = (path) => {
    const isActive = path === "/" 
      ? location.pathname === "/"
      : location.pathname.startsWith(path);
    
    const baseClasses = "text-xl underline-offset-4 decoration-2 font-[700] transition-all duration-300 italic";
    
    if (isDarkNavbar) {
      // Dark navbar state: white links, active link is #5d9cc3
      return isActive
        ? `text-[#5d9cc3] ${baseClasses} underline`
        : `text-white ${baseClasses} hover:text-white/80 hover:underline`;
    } else {
      // Light navbar state: black links, active link is #772583
      return isActive
        ? `text-[#772583] ${baseClasses} underline`
        : `text-black ${baseClasses} hover:text-[#772583] hover:underline`;
    }
  };

  // mobile detection effect
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile(); // Check on mount
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  // get the users initials
  useEffect(() => {
    if (user?.user_metadata) {
      const firstName = user.user_metadata.first_name || "";
      const lastName = user.user_metadata.last_name || "";

      if (firstName && lastName) {
        setUserInitials(
          firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()
        );
      } else {
        setUserInitials("NA");
      }
    } else {
      setUserInitials("");
    }
  }, [user]);

  // Always use white background
  const navbarBgClass = "bg-white shadow-[0_2px_10px_rgba(0,0,0,0.4)] backdrop-blur-sm";

  // determine transition class - no transition during menu toggle, smooth for scroll
  const transitionClass = isMenuTransitioning
    ? "transition-none"
    : "transition-all duration-300";

  // Always use black text
  const titleTextColor = "text-black";

  // check if the user is a "member" or "admin" from supabase members table
  const fetchRole = async () => {
    if (user) {
      try {
        console.log("👤 Navbar fetching user role for:", user.email);
        const { data, error } = await supabase
          .from("members")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("❌ Navbar error fetching user role:", error);
          setRole("member"); // Default to member on error
        } else {
          console.log("✅ Navbar user role fetched:", data?.role || "member");
          setRole(data?.role || "member");
        }
      } catch (error) {
        console.error("❌ Navbar exception fetching user role:", error);
        setRole("member"); // Default to member on error
      }
    } else {
      setRole("member"); // Reset to default when no user
    }
  };

  // Fetch user role when user changes
  useEffect(() => {
    fetchRole();
  }, [user]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-10000 ${transitionClass} ${navbarBgClass}`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Desktop always visible, Mobile only when menu open */}
            <div className="flex-shrink-0 items-center flex-row flex">
              <Link to="/" className="flex items-center">
                <div
                  className={`relative w-10 h-10 md:w-12 md:h-12 ${
                    isMobileMenuOpen ? "block md:block" : "hidden md:block"
                  }`}
                >
                  <img
                    src={EMBSLogoOuter}
                    alt="EMBS Logo Outer"
                    className="absolute w-full h-full animate-spin-slow"
                  />
                  <img
                    src={EMBSLogoInner}
                    alt="EMBS Logo Inner"
                    className="absolute w-full h-full"
                  />
                </div>
                {/* <img
                  src={EMBSLogo}
                  alt="UF Logo"
                  className={`w-10 h-10 md:w-12 md:h-12 ${
                    isMobileMenuOpen ? "block md:block" : "hidden md:block"
                  }`}
                /> */}
              </Link>
              <h1
                className={`text-2xl font-bold ml-6 italic transition-all duration-300 ${titleTextColor} hidden md:block`}
              >
                EMBS - University of Florida
              </h1>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className={linkClass("/")}>
                Home
              </Link>
              <Link to="/about" className={linkClass("/about")}>
                About
              </Link>
              <Link to="/events" className={linkClass("/events")}>
                Events
              </Link>
              <Link to="/resources" className={linkClass("/resources")}>
                Resources
              </Link>
              <Link to="/blog" className={linkClass("/blog")}>
                Blog
              </Link>
              <Link to="/team" className={linkClass("/team")}>
                Team
              </Link>
              <Link to="/contact" className={linkClass("/contact")}>
                Contact Us
              </Link>
              {user ? (
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 ${
                    isDarkNavbar
                      ? "bg-[#5d9cc3] hover:bg-[#4a8ba8]"
                      : "bg-[#772583] hover:bg-[#5a1c62]"
                  }`}
                  onClick={() =>
                    navigate(
                      role === "admin" ? "/admin-dashboard" : "/dashboard"
                    )
                  }
                  title={`Go to ${
                    role === "admin" ? "Admin" : "Member"
                  } Dashboard`}
                >
                  <span className="text-white text-xs font-semibold">
                    {userInitials}
                  </span>
                </div>
              ) : (
                <FaUserCircle
                  onClick={() => navigate("/auth/login")}
                  className={`w-5 h-5 cursor-pointer transition-colors duration-300 ${
                    isDarkNavbar
                      ? "text-white hover:text-white/80"
                      : "text-black hover:text-[#772583]"
                  }`}
                />
              )}
            </div>

            {/* Mobile Menu Button - Centered on mobile */}
            <div className="md:hidden flex-1 flex justify-end">
              <button
                onClick={() => {
                  setIsMenuTransitioning(true);
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  // Reset transition state after a brief moment
                  setTimeout(() => setIsMenuTransitioning(false), 50);
                }}
                className={`transition-colors duration-300 p-2 ${
                  isDarkNavbar
                    ? "text-white hover:text-white/80"
                    : "text-black hover:text-[#772583]"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-black hover:text-[#772583] block px-3 py-2 font-medium transition-colors duration-300"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-black hover:text-[#772583] block px-3 py-2 font-medium transition-colors duration-300"
              >
                About
              </Link>
              <Link
                to="/events"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-black hover:text-[#772583] block px-3 py-2 font-medium transition-colors duration-300"
              >
                Events
              </Link>
              <Link
                to="/resources"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-black hover:text-[#772583] block px-3 py-2 font-medium transition-colors duration-300"
              >
                Resources
              </Link>
              <Link
                to="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-black hover:text-[#772583] block px-3 py-2 font-medium transition-colors duration-300"
              >
                Blog
              </Link>
              <Link
                to="/team"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-black hover:text-[#772583] block px-3 py-2 font-medium transition-colors duration-300"
              >
                Team
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-black hover:text-[#772583] block px-3 py-2 font-medium transition-colors duration-300"
              >
                Contact Us
              </Link>

              {/* Mobile User Profile Section */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                {user ? (
                  <div
                    className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-300"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate(
                        role === "admin" ? "/admin-dashboard" : "/dashboard"
                      );
                    }}
                  >
                    <div className="w-8 h-8 bg-[#772583] rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-semibold">
                        {userInitials}
                      </span>
                    </div>
                    <span className="text-black font-medium">
                      {role === "admin"
                        ? "Admin Dashboard"
                        : "Member Dashboard"}
                    </span>
                  </div>
                ) : (
                  <div
                    className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-300"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/auth/login");
                    }}
                  >
                    <FaUserCircle className="w-6 h-6 mr-3 text-gray-600" />
                    <span className="text-black font-medium">Login</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
