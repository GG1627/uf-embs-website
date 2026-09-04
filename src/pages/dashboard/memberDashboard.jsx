import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../components/ui/Snackbar";
import { IoMdHeart } from "react-icons/io";
import { FaQrcode } from "react-icons/fa";
import { careerFields } from "../../data/careerFields";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

const inputCls =
  "w-full px-3 py-2.5 text-[0.9375rem] border border-[#D0CCC4] bg-white text-[#1A1A1A] placeholder-[#AAAAAA] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-200";

const selectCls =
  "w-full px-3 py-2.5 text-[0.9375rem] border border-[#D0CCC4] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-200 appearance-none";

const Spinner = () => (
  <svg className="w-5 h-5 animate-spin text-[#6B7280]" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export default function MemberDashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [favoriteFields, setFavoriteFields]         = useState([]);
  const [selectedCareer, setSelectedCareer]         = useState(null);
  const [userStats, setUserStats]                   = useState({ points: 0, events_attended: 0 });
  const [eventCode, setEventCode]                   = useState("");
  const [showQRScanner, setShowQRScanner]           = useState(false);
  const [nationalMemberStatus, setNationalMemberStatus] = useState(null);
  const [showNationalMemberUpdate, setShowNationalMemberUpdate] = useState(false);
  const [selectedNationalStatus, setSelectedNationalStatus] = useState("");
  const [userMajor, setUserMajor]                   = useState(null);
  const [showMajorUpdate, setShowMajorUpdate]       = useState(false);
  const [selectedMajor, setSelectedMajor]           = useState("");
  const [customMajor, setCustomMajor]               = useState("");
  const [eventsAttended, setEventsAttended]         = useState([]);
  const [eventsLoading, setEventsLoading]           = useState(true);
  const [statsLoading, setStatsLoading]             = useState(true);
  const [favoritesLoading, setFavoritesLoading]     = useState(true);
  const [semesterStats, setSemesterStats]           = useState({
    fallPoints: 0, springPoints: 0, fallEvents: 0, springEvents: 0, loading: true,
  });

  const majorOptions = [
    "Biomedical Engineering", "Electrical Engineering", "Computer Science",
    "Computer Engineering", "Biology", "Biochemistry", "Mechanical Engineering", "Other",
  ];

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchFavoriteFields();
      fetchEventsAttended();
      checkNationalMemberStatus();
      checkMajorStatus();
      fetchSemesterStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      setStatsLoading(true);
      const { data, error } = await supabase
        .from("members")
        .select("points, events_attended, national_member, major")
        .eq("user_id", user.id)
        .single();
      if (error) { setUserStats({ points: 0, events_attended: 0 }); return; }
      if (data) {
        setUserStats({ points: data.points || 0, events_attended: data.events_attended || 0 });
        setNationalMemberStatus(data.national_member);
        setUserMajor(data.major);
      }
    } catch { setUserStats({ points: 0, events_attended: 0 }); }
    finally { setStatsLoading(false); }
  };

  const fetchSemesterStats = async () => {
    try {
      setSemesterStats((p) => ({ ...p, loading: true }));
      const springCutoff = new Date("2026-01-01T00:00:00.000Z");
      const { data, error } = await supabase
        .from("event_attendance")
        .select("claimed_at, events(points)")
        .eq("member_id", user.id);
      if (error || !data) { setSemesterStats({ fallPoints: 0, springPoints: 0, fallEvents: 0, springEvents: 0, loading: false }); return; }
      let fp = 0, sp = 0, fe = 0, se = 0;
      data.forEach((r) => {
        const pts = r.events?.points || 0;
        if (r.claimed_at && new Date(r.claimed_at) >= springCutoff) { sp += pts; se += 1; }
        else { fp += pts; fe += 1; }
      });
      setSemesterStats({ fallPoints: fp, springPoints: sp, fallEvents: fe, springEvents: se, loading: false });
    } catch { setSemesterStats({ fallPoints: 0, springPoints: 0, fallEvents: 0, springEvents: 0, loading: false }); }
  };

  const checkNationalMemberStatus = async () => {
    const { data } = await supabase.from("members").select("national_member").eq("user_id", user.id).single();
    if (data) { setNationalMemberStatus(data.national_member); setShowNationalMemberUpdate(data.national_member === null); }
  };

  const checkMajorStatus = async () => {
    const { data } = await supabase.from("members").select("major").eq("user_id", user.id).single();
    if (data) { setUserMajor(data.major); setShowMajorUpdate(data.major === null); }
  };

  const updateNationalMemberStatus = async () => {
    if (!selectedNationalStatus) { showSnackbar("Please select your status", { customColor: "#b00000" }); return; }
    const { error } = await supabase.from("members").update({ national_member: selectedNationalStatus }).eq("user_id", user.id);
    if (error) { showSnackbar("Error: " + error.message, { customColor: "#b00000" }); return; }
    setNationalMemberStatus(selectedNationalStatus);
    setShowNationalMemberUpdate(false);
    setSelectedNationalStatus("");
    showSnackbar("Membership status updated!", { customColor: "#007377" });
  };

  const updateMajor = async () => {
    if (!selectedMajor) { showSnackbar("Please select your major", { customColor: "#b00000" }); return; }
    const finalMajor = selectedMajor === "Other" ? customMajor : selectedMajor;
    if (!finalMajor?.trim()) { showSnackbar("Please enter your major", { customColor: "#b00000" }); return; }
    const { error } = await supabase.from("members").update({ major: finalMajor }).eq("user_id", user.id);
    if (error) { showSnackbar("Error: " + error.message, { customColor: "#b00000" }); return; }
    setUserMajor(finalMajor);
    setShowMajorUpdate(false);
    setSelectedMajor("");
    setCustomMajor("");
    showSnackbar("Major updated!", { customColor: "#007377" });
  };

  const fetchEventsAttended = async () => {
    try {
      setEventsLoading(true);
      const { data, error } = await supabase
        .from("event_attendance")
        .select("event_id, events(id, name, start_time, points)")
        .eq("member_id", user.id)
        .order("events(start_time)", { ascending: false });
      if (error) { setEventsAttended([]); return; }
      setEventsAttended((data || []).filter((i) => i.events !== null).map((i) => i.events));
    } catch { setEventsAttended([]); }
    finally { setEventsLoading(false); }
  };

  const fetchFavoriteFields = async () => {
    try {
      setFavoritesLoading(true);
      const { data, error } = await supabase.from("favorite_careers").select("career_name").eq("user_id", user.id);
      if (error) { setFavoriteFields([]); return; }
      setFavoriteFields((data || []).map((f) => careerFields.find((c) => c.name === f.career_name)).filter(Boolean));
    } catch { setFavoriteFields([]); }
    finally { setFavoritesLoading(false); }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) { showSnackbar("Error logging out", { customColor: "#b00000" }); return; }
    showSnackbar("Logged out successfully!", { customColor: "#009623" });
    navigate("/");
  };

  const getEventId = async (code) => {
    const { data: event, error } = await supabase.from("events").select("id, points, name, end_time").eq("code", code).single();
    if (error || !event) { showSnackbar("No event found with that code", { customColor: "#b00000" }); return null; }
    return event.id;
  };

  const performCheckIn = async (code) => {
    if (!code?.trim()) { showSnackbar("Invalid event code", { customColor: "#b00000" }); return; }
    const eventId = await getEventId(code);
    if (!eventId) return;
    const { data, error } = await supabase.rpc("claim_event", { p_member_id: user.id, p_event_id: eventId, p_code: code });
    if (error) { showSnackbar("Error checking in: " + error.message, { customColor: "#b00000" }); return; }
    if (data === "Points claimed successfully!") {
      showSnackbar("Checked in! Points added.", { customColor: "#007377" });
      setEventCode("");
      fetchUserStats();
      fetchEventsAttended();
    } else {
      showSnackbar(data || "Check-in failed", { customColor: "#b00000" });
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!eventCode?.trim()) { showSnackbar("Please enter an event code", { customColor: "#b00000" }); return; }
    await performCheckIn(eventCode);
  };

  const handleQRScan = async (result) => {
    if (!result) return;
    let text = typeof result === "string" ? result : result.text || result.rawValue || (Array.isArray(result) && (result[0]?.text || result[0]?.rawValue));
    if (!text) { showSnackbar("Invalid QR code", { customColor: "#b00000" }); return; }
    let code = text.trim();
    try {
      const url = new URL(text);
      const cp = url.searchParams.get("code");
      if (cp?.trim()) code = cp.trim();
    } catch { /* not a URL, use raw text */ }
    setShowQRScanner(false);
    setEventCode(code);
    showSnackbar("QR scanned! Processing...", { customColor: "#007377" });
    await performCheckIn(code);
  };

  // ── derived ────────────────────────────────────────────────────────────────
  const total  = userStats.points;
  const spring = semesterStats.springPoints;
  const rawFall = semesterStats.fallPoints;
  const fall   = rawFall + Math.max(0, total - (rawFall + spring));
  const isOfficerEligible = !semesterStats.loading && !statsLoading && (fall >= 7 || spring >= 12);

  const firstName = user?.user_metadata?.first_name || "";

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-[#F8F6F1]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10 pt-32 pb-20">

        {/* ── Page header ────────────────────────────────────────────────── */}
        <div className="mb-12">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-4">
            Member Dashboard
          </p>
          <h1
            style={{ fontFamily: "'Lora', Georgia, serif" }}
            className="text-4xl md:text-[2.75rem] font-medium leading-[1.12] tracking-[-0.01em] text-[#1A1A1A]"
          >
            {firstName ? `Welcome back, ${firstName}.` : "Welcome back."}
          </h1>
        </div>

        {/* ── Officer eligibility banner ──────────────────────────────────── */}
        {isOfficerEligible && (
          <div className="mb-8 bg-[#1A1A1A] px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-8 h-8 bg-[#772583]/20 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[#772583]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.95 2.878c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-1">
                Milestone Reached
              </p>
              <p className="text-white text-[0.9375rem] font-medium leading-snug">
                You're eligible to apply for an Officer position. Keep an eye out for applications!
              </p>
            </div>
          </div>
        )}

        {/* ── Alerts: national member + major ────────────────────────────── */}
        {(showNationalMemberUpdate || showMajorUpdate) && (
          <div className="mb-8 space-y-4">
            {showNationalMemberUpdate && (
              <div className="border-l-[3px] border-l-[#772583] bg-white border border-[#E8E4DD] px-6 py-5">
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-3">
                  Action Required
                </p>
                <h2 style={{ fontFamily: "'Lora', Georgia, serif" }}
                  className="text-xl font-medium text-[#1A1A1A] mb-2">
                  Are you a national IEEE EMBS member?
                </h2>
                <p className="text-[0.9375rem] text-[#6B7280] font-light mb-5">
                  Let us know so we can provide you with the best experience.
                </p>
                <div className="flex gap-6 mb-5">
                  {["yes", "no"].map((val) => (
                    <label key={val} className="flex items-center gap-2.5 cursor-pointer">
                      <div className="relative">
                        <input type="radio" name="natStatus" value={val} checked={selectedNationalStatus === val}
                          onChange={(e) => setSelectedNationalStatus(e.target.value)} className="sr-only peer" />
                        <div className="w-4 h-4 border border-[#D0CCC4] peer-checked:border-[#772583] transition-colors duration-200 flex items-center justify-center">
                          <div className="w-2 h-2 bg-[#772583] opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                        </div>
                      </div>
                      <span className="text-[0.9375rem] text-[#4A4A4A] font-light capitalize">{val === "yes" ? "Yes" : "No"}</span>
                    </label>
                  ))}
                </div>
                <button onClick={updateNationalMemberStatus}
                  className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#772583] text-white text-[0.875rem] font-medium tracking-wide transition-colors duration-200 cursor-pointer">
                  Save Status
                </button>
              </div>
            )}

            {showMajorUpdate && (
              <div className="border-l-[3px] border-l-[#00629B] bg-white border border-[#E8E4DD] px-6 py-5">
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00629B] mb-3">
                  Action Required
                </p>
                <h2 style={{ fontFamily: "'Lora', Georgia, serif" }}
                  className="text-xl font-medium text-[#1A1A1A] mb-2">
                  What's your major?
                </h2>
                <p className="text-[0.9375rem] text-[#6B7280] font-light mb-5">
                  Help us surface relevant opportunities and resources for you.
                </p>
                <div className="space-y-3 max-w-xs">
                  <div className="relative">
                    <select value={selectedMajor} onChange={(e) => setSelectedMajor(e.target.value)} className={selectCls}>
                      <option value="">Select your major</option>
                      {majorOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="w-3.5 h-3.5 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {selectedMajor === "Other" && (
                    <input type="text" value={customMajor} onChange={(e) => setCustomMajor(e.target.value)}
                      placeholder="Enter your major" className={inputCls} />
                  )}
                </div>
                <button onClick={updateMajor}
                  className="mt-5 px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#00629B] text-white text-[0.875rem] font-medium tracking-wide transition-colors duration-200 cursor-pointer">
                  Save Major
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Stats row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 border border-[#E8E4DD] divide-x divide-y md:divide-y-0 divide-[#E8E4DD] bg-white mb-8">
          {[
            { label: "Total Points", value: statsLoading ? null : userStats.points.toLocaleString(), accent: "text-[#772583]" },
            { label: "Events Attended", value: statsLoading ? null : userStats.events_attended, accent: "text-[#00629B]" },
            { label: "Fall '25 Points", value: semesterStats.loading ? null : fall.toLocaleString(), accent: "text-[#772583]" },
            { label: "Spring '26 Points", value: semesterStats.loading ? null : spring.toLocaleString(), accent: "text-[#00629B]" },
          ].map(({ label, value, accent }) => (
            <div key={label} className="flex flex-col items-center py-8 px-4 gap-2">
              {value === null ? (
                <Spinner />
              ) : (
                <span style={{ fontFamily: "'Lora', Georgia, serif" }}
                  className={`text-[2.25rem] font-medium leading-none ${accent}`}>
                  {value}
                </span>
              )}
              <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#8A8A8A] text-center">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Check-in ───────────────────────────────────────────────────── */}
        <section className="bg-white border border-[#E8E4DD] px-6 md:px-8 py-8 mb-8">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00629B] mb-4">
            Event Check-In
          </p>
          <h2 style={{ fontFamily: "'Lora', Georgia, serif" }}
            className="text-2xl font-medium text-[#1A1A1A] mb-2">
            Scan or enter your event code.
          </h2>
          <p className="text-[0.9375rem] text-[#6B7280] font-light mb-6">
            Earn points every time you attend an event.
          </p>
          <form onSubmit={handleCheckIn} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter event code"
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value)}
              className={`${inputCls} flex-1`}
            />
            <button
              type="button"
              onClick={() => setShowQRScanner(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 border border-[#D0CCC4] hover:border-[#1A1A1A] text-[#4A4A4A] hover:text-[#1A1A1A] text-[0.875rem] font-medium tracking-wide transition-colors duration-200 cursor-pointer shrink-0"
            >
              <FaQrcode className="text-base" />
              Scan QR
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 bg-[#1A1A1A] hover:bg-[#00629B] text-white text-[0.875rem] font-medium tracking-wide transition-colors duration-200 cursor-pointer shrink-0"
            >
              Check In
            </button>
          </form>
        </section>

        {/* ── QR Scanner modal ───────────────────────────────────────────── */}
        {showQRScanner && (
          <div className="fixed inset-0 bg-[#1A1A1A]/70 flex items-center justify-center z-50 px-6">
            <div className="bg-white border border-[#E8E4DD] w-full max-w-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DD]">
                <p style={{ fontFamily: "'Lora', Georgia, serif" }}
                  className="text-lg font-medium text-[#1A1A1A]">
                  Scan QR Code
                </p>
                <button onClick={() => setShowQRScanner(false)}
                  className="text-[#9A9A9A] hover:text-[#1A1A1A] transition-colors duration-200 cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="overflow-hidden border border-[#E8E4DD]">
                  <Scanner
                    onScan={handleQRScan}
                    onError={() => showSnackbar("Camera access denied", { customColor: "#b00000" })}
                    constraints={{ facingMode: "environment" }}
                    styles={{ container: { width: "100%", height: "260px" } }}
                  />
                </div>
                <p className="text-[0.8125rem] text-[#9A9A9A] font-light text-center">
                  Position the QR code within the frame. Ensure good lighting.
                </p>
                <button onClick={() => setShowQRScanner(false)}
                  className="w-full py-2.5 border border-[#D0CCC4] hover:border-[#1A1A1A] text-[#4A4A4A] hover:text-[#1A1A1A] text-[0.875rem] font-medium tracking-wide transition-colors duration-200 cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Main two-column grid ────────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Events attended — 2/3 */}
          <section className="md:col-span-2 bg-white border border-[#E8E4DD] px-6 md:px-8 py-8">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-4">
              History
            </p>
            <h2 style={{ fontFamily: "'Lora', Georgia, serif" }}
              className="text-2xl font-medium text-[#1A1A1A] mb-6">
              Events Attended
            </h2>

            {eventsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Spinner />
              </div>
            ) : eventsAttended.length > 0 ? (
              <div className="divide-y divide-[#E8E4DD]">
                {eventsAttended.map((event, i) => (
                  <div key={event.id || i} className="flex items-start justify-between gap-4 py-4 group">
                    <div className="min-w-0">
                      <p className="text-[0.9375rem] font-medium text-[#1A1A1A] leading-snug mb-1 group-hover:text-[#00629B] transition-colors duration-200">
                        {event.name}
                      </p>
                      {event.start_time && (
                        <p className="text-[0.8125rem] text-[#9A9A9A] font-light">
                          {new Date(event.start_time).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          {" · "}
                          {new Date(event.start_time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}
                    </div>
                    {event.points && (
                      <span className="shrink-0 text-[11px] font-semibold tracking-[0.12em] uppercase px-2.5 py-1 bg-[#00629B]/8 text-[#00629B] border border-[#00629B]/20">
                        +{event.points} pts
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center border-t border-[#E8E4DD]">
                <p className="text-[0.9375rem] text-[#9A9A9A] font-light mb-1">No events yet.</p>
                <p className="text-[0.8125rem] text-[#C0BCC4] font-light">
                  Use the check-in section above to get started.
                </p>
              </div>
            )}
          </section>

          {/* Favorites — 1/3 */}
          <section className="bg-white border border-[#E8E4DD] px-6 py-8">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-4">
              Saved
            </p>
            <h2 style={{ fontFamily: "'Lora', Georgia, serif" }}
              className="text-2xl font-medium text-[#1A1A1A] mb-6">
              Favorite Fields
            </h2>

            {favoritesLoading ? (
              <div className="flex items-center justify-center py-10">
                <Spinner />
              </div>
            ) : favoriteFields.length > 0 ? (
              <div className="space-y-1">
                {favoriteFields.map((career, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCareer(selectedCareer?.name === career.name ? null : career)}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors duration-200 cursor-pointer border ${
                      selectedCareer?.name === career.name
                        ? "border-[#772583]/30 bg-[#772583]/5 text-[#772583]"
                        : "border-transparent hover:bg-[#F8F6F1] text-[#4A4A4A]"
                    }`}
                  >
                    <IoMdHeart className={`shrink-0 text-base ${selectedCareer?.name === career.name ? "text-[#772583]" : "text-[#D0CCC4]"}`} />
                    <span className="text-[0.9375rem] font-medium leading-snug">{career.name}</span>
                  </button>
                ))}

                {selectedCareer && (
                  <div className="mt-4 pt-4 border-t border-[#E8E4DD] space-y-4">
                    {selectedCareer.description && (
                      <p className="text-[0.8125rem] text-[#6B7280] font-light leading-relaxed">
                        {selectedCareer.description}
                      </p>
                    )}
                    {selectedCareer.skills?.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#8A8A8A] mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedCareer.skills.map((s, i) => (
                            <span key={i} className="px-2 py-1 bg-[#1A1A1A] text-white text-[11px] font-medium">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedCareer.professors?.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#8A8A8A] mb-2">Professors</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedCareer.professors.map((p, i) => {
                            const name = typeof p === "string" ? p : p.name;
                            return <span key={i} className="px-2 py-1 border border-[#E8E4DD] text-[#4A4A4A] text-[11px]">{name}</span>;
                          })}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => navigate("/resources")}
                      className="text-[0.8125rem] text-[#00629B] hover:text-[#772583] font-medium transition-colors duration-200 cursor-pointer"
                    >
                      Explore in Resources →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-10 text-center border-t border-[#E8E4DD]">
                <IoMdHeart className="text-[#E8E4DD] text-2xl mx-auto mb-3" />
                <p className="text-[0.9375rem] text-[#9A9A9A] font-light mb-1">No favorites yet.</p>
                <button
                  onClick={() => navigate("/resources")}
                  className="text-[0.8125rem] text-[#00629B] hover:text-[#772583] font-medium transition-colors duration-200 cursor-pointer"
                >
                  Browse career fields →
                </button>
              </div>
            )}
          </section>
        </div>

        {/* ── Footer actions ─────────────────────────────────────────────── */}
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-[#E8E4DD]">
          <div>
            <p className="text-[0.8125rem] text-[#9A9A9A] font-light">
              Signed in as <span className="text-[#4A4A4A]">{user?.email}</span>
            </p>
            {userMajor && (
              <p className="text-[0.8125rem] text-[#9A9A9A] font-light">
                Major: <span className="text-[#4A4A4A]">{userMajor}</span>
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 border border-[#D0CCC4] hover:border-[#1A1A1A] text-[#6B7280] hover:text-[#1A1A1A] text-[0.875rem] font-medium tracking-wide transition-colors duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}
