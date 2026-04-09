import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { supabase } from "../../lib/supabase";
import { adminEmails } from "../../data/adminEmails";

const inputCls =
  "w-full px-3 py-2.5 text-[0.9375rem] border border-[#D0CCC4] bg-white text-[#1A1A1A] placeholder-[#AAAAAA] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-200";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  useEffect(() => {
    if (adminEmails.includes(email)) {
      setMessage("Admin login detected. Enter the password to continue.");
      setShowPasswordInput(true);
      setPassword("");
    } else {
      setShowPasswordInput(false);
      setPassword("");
    }
  }, [email]);

  async function handleLogin(e) {
    e.preventDefault();
    if (loading) return;

    if (!email.toLowerCase().endsWith("@ufl.edu")) {
      setMessage("Error: Please use your @ufl.edu email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (adminEmails.includes(email)) {
        if (!password || password.trim() === "") {
          setMessage("Error: Admin password is required");
          return;
        }
        const adminPassword = "embs2025!";
        if (password !== adminPassword) {
          setMessage("Error: Invalid admin password");
          return;
        }
      }

      const { data: existingMember, error: checkError } = await supabase
        .from("members")
        .select("*")
        .eq("email", email.toLowerCase())
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        setMessage("Error: " + checkError.message);
        return;
      }

      if (!existingMember) {
        setMessage("Email not found in our database. Redirecting to registration...");
        setTimeout(() => {
          navigate("/auth/register", { state: { email } });
        }, 1750);
        return;
      }

      const { error: signInError } = await signIn(email);

      if (signInError) {
        setMessage("Error: " + signInError.message);
      } else {
        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  const isError = message.startsWith("Error");

  return (
    <div
      className="min-h-screen flex bg-[#F8F6F1]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex lg:w-[44%] bg-[#1A1A1A] flex-col justify-center p-14">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#6B9FC4] mb-5">
            University of Florida · IEEE EMBS
          </p>
          <h2
            className="text-3xl md:text-[2.25rem] font-medium leading-[1.25] tracking-[-0.01em] text-white mb-6"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            Advancing biomedical engineering, one student at a time.
          </h2>
          <p className="text-white/45 text-[0.9375rem] leading-[1.75] font-light">
            Log in to access events, blog posts, the career resources advisor, and your member dashboard.
          </p>
        </div>

      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-4">
            Welcome back
          </p>
          <h1
            className="text-3xl font-medium text-[#1A1A1A] mb-2 tracking-[-0.01em]"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            Sign in
          </h1>
          <p className="text-[0.9375rem] text-[#6B7280] font-light mb-10">
            Use your <span className="text-[#00629B] font-medium">@ufl.edu</span> email to log in instantly.
          </p>

          {/* Message */}
          {message && (
            <div
              className={`mb-6 px-4 py-3 text-[0.875rem] border-l-[3px] ${
                isError
                  ? "border-l-red-500 bg-red-50 text-red-700"
                  : "border-l-[#00629B] bg-[#F0F7FC] text-[#1A1A1A]"
              }`}
              dangerouslySetInnerHTML={{ __html: message }}
            />
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@ufl.edu"
                className={`${inputCls} ${
                  email && !email.toLowerCase().endsWith("@ufl.edu")
                    ? "border-red-400 focus:border-red-500"
                    : ""
                }`}
              />
              {email && !email.toLowerCase().endsWith("@ufl.edu") && (
                <p className="mt-1.5 text-[0.8125rem] text-red-600">
                  Must be a @ufl.edu address
                </p>
              )}
            </div>

            {showPasswordInput && (
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className={inputCls}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                (email && !email.toLowerCase().endsWith("@ufl.edu")) ||
                (showPasswordInput && (!password || password.trim() === ""))
              }
              className="w-full py-3 px-4 bg-[#1A1A1A] hover:bg-[#772583] text-white text-[0.875rem] font-medium tracking-wide transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-[0.9375rem] text-[#6B7280] font-light text-center">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/auth/register")}
              className="text-[#772583] cursor-pointer hover:underline font-medium"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
