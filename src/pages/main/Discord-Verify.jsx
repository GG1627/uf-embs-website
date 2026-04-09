import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import { supabase } from "../../lib/supabase";
import { useSnackbar } from "../../components/ui/Snackbar";
const DiscordIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export default function DiscordVerify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const turnstileRef = useRef(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (!token) {
      setVerificationStatus("error");
      setErrorMessage("Missing verification token. Please use the link provided by the Discord bot.");
    }
  }, [token]);

  const handleCaptchaSuccess = (t) => setCaptchaToken(t);

  const handleCaptchaError = () => {
    setCaptchaToken(null);
    showSnackbar("CAPTCHA verification failed. Please try again.", { severity: "error" });
  };

  const handleVerify = async () => {
    if (!token) {
      setErrorMessage("Missing verification token.");
      setVerificationStatus("error");
      return;
    }
    if (!captchaToken) {
      showSnackbar("Please complete the CAPTCHA verification.", { severity: "warning" });
      return;
    }

    setIsVerifying(true);
    setErrorMessage("");

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) throw new Error("Supabase URL not configured");

      const response = await fetch(`${supabaseUrl}/functions/v1/discord-captcha-verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ verification_token: token, captcha_token: captchaToken }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Verification failed");

      if (data.success) {
        setVerificationStatus("success");
        showSnackbar("Verification successful! Return to Discord.", { severity: "success" });
      } else {
        throw new Error(data.error || "Verification failed");
      }
    } catch (error) {
      setVerificationStatus("error");
      setErrorMessage(error.message || "An error occurred. Please contact an officer.");
      showSnackbar(error.message || "Verification failed.", { severity: "error" });
      if (turnstileRef.current) turnstileRef.current.reset();
      setCaptchaToken(null);
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Shared card shell ──────────────────────────────────────────────────────
  const Card = ({ children }) => (
    <div
      className="min-h-screen bg-[#F8F6F1] flex flex-col items-center justify-center px-6 py-16"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="w-full max-w-sm bg-white border border-[#E8E4DD] px-8 py-10">
        {children}
      </div>
    </div>
  );

  // ── Success ────────────────────────────────────────────────────────────────
  if (verificationStatus === "success") {
    return (
      <Card>
        <div className="text-center">
          <div className="w-12 h-12 bg-[#00629B]/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-6 h-6 text-[#00629B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00629B] mb-3">
            Verified
          </p>
          <h1
            className="text-2xl font-medium text-[#1A1A1A] mb-3 tracking-[-0.01em]"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            You're all set
          </h1>
          <p className="text-[0.9375rem] text-[#6B7280] font-light leading-[1.75]">
            You've been successfully verified. Return to Discord — you should now see the full server.
          </p>
          <div className="mt-8 pt-6 border-t border-[#E8E4DD]">
            <p className="text-[0.8125rem] text-[#9A9A9A] font-light">
              Don't see the channels? Try refreshing Discord or contact an officer.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (verificationStatus === "error" || !token) {
    return (
      <Card>
        <div className="text-center">
          <div className="w-12 h-12 bg-red-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-red-500 mb-3">
            Failed
          </p>
          <h1
            className="text-2xl font-medium text-[#1A1A1A] mb-3 tracking-[-0.01em]"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            Verification failed
          </h1>
          <p className="text-[0.9375rem] text-[#6B7280] font-light leading-[1.75]">
            {errorMessage || "An error occurred during verification."}
          </p>
          <div className="mt-8 pt-6 border-t border-[#E8E4DD]">
            <p className="text-[0.8125rem] text-[#9A9A9A] font-light">
              Contact an officer in Discord if you continue to experience issues.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // ── Config error ───────────────────────────────────────────────────────────
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  if (!turnstileSiteKey) {
    return (
      <Card>
        <div className="text-center">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-red-500 mb-3">
            Configuration Error
          </p>
          <h1
            className="text-2xl font-medium text-[#1A1A1A] mb-3 tracking-[-0.01em]"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            CAPTCHA not configured
          </h1>
          <p className="text-[0.9375rem] text-[#6B7280] font-light">
            Please contact the site administrator.
          </p>
        </div>
      </Card>
    );
  }

  // ── Main verification form ─────────────────────────────────────────────────
  return (
    <Card>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-[#5865F2]/10 flex items-center justify-center mx-auto mb-5 text-[#5865F2]">
          <DiscordIcon />
        </div>
        <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-3">
          Discord Verification
        </p>
        <h1
          className="text-2xl font-medium text-[#1A1A1A] mb-2 tracking-[-0.01em]"
          style={{ fontFamily: "'Lora', Georgia, serif" }}
        >
          Verify your account
        </h1>
        <p className="text-[0.9375rem] text-[#6B7280] font-light leading-[1.75]">
          Complete the CAPTCHA below to unlock the Discord server.
        </p>
      </div>

      <div className="space-y-5">
        {/* CAPTCHA */}
        <div className="flex justify-center">
          <Turnstile
            ref={turnstileRef}
            siteKey={turnstileSiteKey}
            onSuccess={handleCaptchaSuccess}
            onError={handleCaptchaError}
            onExpire={() => {
              setCaptchaToken(null);
              showSnackbar("CAPTCHA expired. Please complete it again.", { severity: "warning" });
            }}
            options={{ theme: "light", size: "normal" }}
          />
        </div>

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={!captchaToken || isVerifying}
          className={`w-full py-3 px-4 text-[0.875rem] font-medium tracking-wide transition-colors duration-200 flex items-center justify-center gap-2 ${
            captchaToken && !isVerifying
              ? "bg-[#1A1A1A] hover:bg-[#772583] text-white cursor-pointer"
              : "bg-[#D0CCC4] text-[#9A9A9A] cursor-not-allowed"
          }`}
        >
          {isVerifying ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verifying...
            </>
          ) : (
            "Verify Discord Account"
          )}
        </button>

        <div className="pt-4 border-t border-[#E8E4DD]">
          <p className="text-[0.75rem] text-[#9A9A9A] font-light text-center leading-relaxed">
            This link expires in 15 minutes. Contact an officer in Discord if you need help.
          </p>
        </div>
      </div>
    </Card>
  );
}
