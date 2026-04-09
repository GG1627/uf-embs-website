import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EMBSLogoInner from "../../assets/logos/EMBS_logo_inner_layer.svg";
import EMBSLogoOuter from "../../assets/logos/EMBS_logo_outer_layer.svg";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../pages/auth/AuthContext";
import { supabase } from "../../lib/supabase";

const NAV_LINKS = [
  { label: "Home",       to: "/" },
  { label: "About",      to: "/about" },
  { label: "Events",     to: "/events" },
  { label: "Resources",  to: "/resources" },
  { label: "Blog",       to: "/blog" },
  { label: "Team",       to: "/team" },
  { label: "Contact",    to: "/contact" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userInitials, setUserInitials]         = useState("");
  const [role, setRole]                         = useState("member");
  const [scrolled, setScrolled]                 = useState(false);
  const location = useLocation();
  const navigate  = useNavigate();
  const { user }  = useAuth();

  // Collapse mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Add a subtle bottom-border when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Resolve user initials
  useEffect(() => {
    if (user?.user_metadata) {
      const first = user.user_metadata.first_name || "";
      const last  = user.user_metadata.last_name  || "";
      setUserInitials(
        first && last
          ? first.charAt(0).toUpperCase() + last.charAt(0).toUpperCase()
          : "NA"
      );
    } else {
      setUserInitials("");
    }
  }, [user]);

  // Resolve user role
  useEffect(() => {
    if (!user) { setRole("member"); return; }
    supabase
      .from("members")
      .select("role")
      .eq("user_id", user.id)
      .single()
      .then(({ data, error }) => {
        if (!error) setRole(data?.role || "member");
      });
  }, [user]);

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      <nav
        style={{ fontFamily: "'Inter', sans-serif" }}
        className={`fixed top-0 left-0 right-0 z-[10000] bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-[0_1px_0_0_#E8E4DD]" : "shadow-[0_1px_0_0_transparent]"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-[64px]">

            {/* ── Brand ─────────────────────────────────────────────── */}
            <Link to="/" className="flex items-center gap-3.5 shrink-0 group">
              <div className="relative w-9 h-9">
                <img
                  src={EMBSLogoOuter}
                  alt=""
                  aria-hidden="true"
                  className="absolute w-full h-full animate-spin-slow"
                />
                <img
                  src={EMBSLogoInner}
                  alt="UF EMBS"
                  className="absolute w-full h-full"
                />
              </div>
              <span
                style={{ fontFamily: "'Lora', Georgia, serif" }}
                className="hidden md:block text-[1.0625rem] font-medium text-[#1A1A1A] tracking-[-0.01em] leading-none"
              >
                UF EMBS
              </span>
            </Link>

            {/* ── Desktop links ──────────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className={`text-[0.8125rem] font-medium tracking-wide transition-colors duration-200 relative pb-0.5 ${
                    isActive(to)
                  ? "text-[#772583]"
                  : "text-[#4A4A4A] hover:text-[#1A1A1A]"
                  }`}
                >
                  {label}
                  {/* Active underline */}
                  {isActive(to) && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-[#772583]" />
                  )}
                </Link>
              ))}

              {/* User avatar / login icon */}
              {user ? (
                <button
                  onClick={() => navigate(role === "admin" ? "/admin-dashboard" : "/dashboard")}
                  title={`Go to ${role === "admin" ? "Admin" : "Member"} Dashboard`}
                  className="w-7 h-7 rounded-full bg-[#1A1A1A] hover:bg-[#00629B] flex items-center justify-center transition-colors duration-200 shrink-0"
                >
                  <span className="text-white text-[0.6875rem] font-semibold tracking-wide">
                    {userInitials}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/auth/login")}
                  aria-label="Login"
                  className="text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors duration-200"
                >
                  <FaUserCircle className="w-[1.125rem] h-[1.125rem]" />
                </button>
              )}
            </div>

            {/* ── Mobile hamburger ───────────────────────────────────── */}
            <button
              className="md:hidden text-[#1A1A1A] p-1 -mr-1"
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile menu ─────────────────────────────────────────────── */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8E4DD] bg-white">
            <div className="px-6 py-5 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-2.5 text-[0.9375rem] font-medium transition-colors duration-200 ${
                    isActive(to) ? "text-[#772583]" : "text-[#1A1A1A]"
                  }`}
                >
                  {label}
                </Link>
              ))}

              <div className="border-t border-[#E8E4DD] mt-3 pt-4">
                {user ? (
                  <button
                    className="flex items-center gap-3 w-full text-left"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate(role === "admin" ? "/admin-dashboard" : "/dashboard");
                    }}
                  >
                    <div className="w-8 h-8 bg-[#1A1A1A] rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-semibold">{userInitials}</span>
                    </div>
                    <span className="text-[0.9375rem] font-medium text-[#1A1A1A]">
                      {role === "admin" ? "Admin Dashboard" : "Member Dashboard"}
                    </span>
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-3"
                    onClick={() => { setIsMobileMenuOpen(false); navigate("/auth/login"); }}
                  >
                    <FaUserCircle className="w-5 h-5 text-[#4A4A4A]" />
                    <span className="text-[0.9375rem] font-medium text-[#1A1A1A]">Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
