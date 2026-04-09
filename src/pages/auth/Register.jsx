import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { supabase } from "../../lib/supabase";

const inputCls =
  "w-full px-3 py-2.5 text-[0.9375rem] border border-[#D0CCC4] bg-white text-[#1A1A1A] placeholder-[#AAAAAA] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-200";

const selectCls =
  "w-full px-3 py-2.5 text-[0.9375rem] border border-[#D0CCC4] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-200 appearance-none";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [major, setMajor] = useState("");
  const [customMajor, setCustomMajor] = useState("");
  const [nationalMember, setNationalMember] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();

  const majorOptions = [
    "Biomedical Engineering",
    "Electrical Engineering",
    "Computer Science",
    "Computer Engineering",
    "Biology",
    "Biochemistry",
    "Mechanical Engineering",
    "Other",
  ];

  async function handleSignUp(e) {
    e.preventDefault();
    if (loading) return;

    if (!email.toLowerCase().endsWith("@ufl.edu")) {
      setMessage("Error: Please use your @ufl.edu email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data: existingMember, error: checkError } = await supabase
        .from("members")
        .select("*")
        .eq("email", email.toLowerCase())
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        setMessage("Error: " + checkError.message);
        return;
      }

      if (existingMember) {
        setMessage("You already have an account. Redirecting to login...");
        setTimeout(() => {
          navigate("/auth/login", { state: { email } });
        }, 1750);
        return;
      }

      const finalMajor = major === "Other" ? customMajor : major;
      const { error } = await signUp(email, firstName, lastName, finalMajor, nationalMember);

      if (error) {
        setMessage("Error: " + error.message);
      } else {
        setMessage("Account created! Redirecting to home...");
        setTimeout(() => navigate("/"), 2000);
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
            Join the chapter. Shape the future of biomedical engineering at UF.
          </h2>
          <p className="text-white/45 text-[0.9375rem] leading-[1.75] font-light">
            Create your account to access events, resources, and connect with students across 11+ majors.
          </p>
        </div>

      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00629B] mb-4">
            Get started
          </p>
          <h1
            className="text-3xl font-medium text-[#1A1A1A] mb-2 tracking-[-0.01em]"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            Create your account
          </h1>
          <p className="text-[0.9375rem] text-[#6B7280] font-light mb-10">
            Use your <span className="text-[#00629B] font-medium">@ufl.edu</span> email to get started instantly.
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

          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Email */}
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
                <p className="mt-1.5 text-[0.8125rem] text-red-600">Must be a @ufl.edu address</p>
              )}
            </div>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Major */}
            <div>
              <label className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">
                Major
              </label>
              <div className="relative">
                <select
                  required
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select your major</option>
                  {majorOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="w-3.5 h-3.5 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {major === "Other" && (
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">
                  Specify Major
                </label>
                <input
                  type="text"
                  required
                  value={customMajor}
                  onChange={(e) => setCustomMajor(e.target.value)}
                  placeholder="Your major"
                  className={inputCls}
                />
              </div>
            )}

            {/* National member */}
            <div>
              <label className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-3">
                IEEE EMBS National Member?
              </label>
              <div className="flex gap-6">
                {["yes", "no"].map((val) => (
                  <label key={val} className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        name="nationalMember"
                        value={val}
                        checked={nationalMember === val}
                        onChange={(e) => setNationalMember(e.target.value)}
                        className="sr-only peer"
                      />
                      <div className="w-4 h-4 border border-[#D0CCC4] peer-checked:border-[#772583] transition-colors duration-200 flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#772583] opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                      </div>
                    </div>
                    <span className="text-[0.9375rem] text-[#4A4A4A] font-light capitalize">
                      {val === "yes" ? "Yes" : "No"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                (email && !email.toLowerCase().endsWith("@ufl.edu")) ||
                !major ||
                (major === "Other" && !customMajor) ||
                !nationalMember
              }
              className="w-full py-3 px-4 bg-[#1A1A1A] hover:bg-[#00629B] text-white text-[0.875rem] font-medium tracking-wide transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-[0.9375rem] text-[#6B7280] font-light text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/auth/login")}
              className="text-[#772583] cursor-pointer hover:underline font-medium"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
