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

const getCurrentAcademicYearDetails = (date = new Date()) => {
  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
  }).formatToParts(date);
  const calendarYear = Number(dateParts.find((part) => part.type === "year")?.value);
  const calendarMonth = Number(dateParts.find((part) => part.type === "month")?.value);
  const startYear = calendarMonth >= 8 ? calendarYear : calendarYear - 1;
  const endYear = startYear + 1;

  return {
    label: `${startYear}-${endYear}`,
    fallLabel: `Fall '${String(startYear).slice(-2)} Points`,
    springLabel: `Spring '${String(endYear).slice(-2)} Points`,
    startDate: `${startYear}-08-01T00:00:00-04:00`,
    springStartDate: `${endYear}-01-01T00:00:00-05:00`,
    endDate: `${endYear}-08-01T00:00:00-04:00`,
  };
};

export default function MemberDashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [favoriteFields, setFavoriteFields]         = useState([]);
  const [selectedCareer, setSelectedCareer]         = useState(null);
  const [eventCode, setEventCode]                   = useState("");
  const [showQRScanner, setShowQRScanner]           = useState(false);
  const [showNationalMemberUpdate, setShowNationalMemberUpdate] = useState(false);
  const [selectedNationalStatus, setSelectedNationalStatus] = useState("");
  const [userMajor, setUserMajor]                   = useState(null);
  const [showMajorUpdate, setShowMajorUpdate]       = useState(false);
  const [selectedMajor, setSelectedMajor]           = useState("");
  const [customMajor, setCustomMajor]               = useState("");
  const [eventsAttended, setEventsAttended]         = useState([]);
  const [eventsLoading, setEventsLoading]           = useState(true);
  const [favoritesLoading, setFavoritesLoading]     = useState(true);
  const [academicYearStats, setAcademicYearStats]   = useState({
    totalPoints: 0, totalEvents: 0, fallPoints: 0, springPoints: 0, loading: true,
  });

  const academicYear = getCurrentAcademicYearDetails();

  const majorOptions = [
    "Biomedical Engineering", "Electrical Engineering", "Computer Science",
    "Computer Engineering", "Biology", "Biochemistry", "Mechanical Engineering", "Other",
  ];

  useEffect(() => {
    if (user) {
      fetchFavoriteFields();
      fetchAcademicYearActivity();
      checkNationalMemberStatus();
      checkMajorStatus();
    }
  }, [user]);

  const fetchAcademicYearActivity = async () => {
    try {
      setEventsLoading(true);
      setAcademicYearStats((previous) => ({ ...previous, loading: true }));
      const { data, error } = await supabase
        .from("event_attendance")
        .select("event_id, points_awarded, events!inner(id, name, start_time, points)")
        .eq("member_id", user.id)
        .gte("events.start_time", academicYear.startDate)
        .lt("events.start_time", academicYear.endDate);

      if (error) throw error;

      const attendedEvents = (data || [])
        .filter((row) => row.events)
        .map((row) => ({
          ...row.events,
          points: row.points_awarded ?? row.events.points ?? 0,
        }))
        .sort((first, second) => new Date(second.start_time) - new Date(first.start_time));

      let fallPoints = 0;
      let springPoints = 0;
      attendedEvents.forEach((event) => {
        if (new Date(event.start_time) < new Date(academicYear.springStartDate)) {
          fallPoints += event.points;
        } else {
          springPoints += event.points;
        }
      });

      setEventsAttended(attendedEvents);
      setAcademicYearStats({
        totalPoints: fallPoints + springPoints,
        totalEvents: attendedEvents.length,
        fallPoints,
        springPoints,
        loading: false,
      });
    } catch {
      setEventsAttended([]);
      setAcademicYearStats({ totalPoints: 0, totalEvents: 0, fallPoints: 0, springPoints: 0, loading: false });
    } finally {
      setEventsLoading(false);
    }
  };

  const checkNationalMemberStatus = async () => {
    const { data } = await supabase.from("members").select("national_member").eq("user_id", user.id).single();
    if (data) setShowNationalMemberUpdate(data.national_member === null);
  };

  const checkMajorStatus = async () => {
    const { data } = await supabase.from("members").select("major").eq("user_id", user.id).single();
    if (data) { setUserMajor(data.major); setShowMajorUpdate(data.major === null); }
  };

  const updateNationalMemberStatus = async () => {
    if (!selectedNationalStatus) { showSnackbar("Please select your status", { customColor: "#b00000" }); return; }
    const { error } = await supabase.from("members").update({ national_member: selectedNationalStatus }).eq("user_id", user.id);
    if (error) { showSnackbar("Error: " + error.message, { customColor: "#b00000" }); return; }
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
      fetchAcademicYearActivity();
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
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#772583]">
            Current Academic Year
          </p>
          <p className="text-[0.8125rem] text-[#6B7280]">{academicYear.label}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 border border-[#E8E4DD] divide-x divide-y md:divide-y-0 divide-[#E8E4DD] bg-white mb-8">
          {[
            { label: "Total Points", value: academicYearStats.loading ? null : academicYearStats.totalPoints.toLocaleString(), accent: "text-[#772583]" },
            { label: "Events Attended", value: academicYearStats.loading ? null : academicYearStats.totalEvents, accent: "text-[#00629B]" },
            { label: academicYear.fallLabel, value: academicYearStats.loading ? null : academicYearStats.fallPoints.toLocaleString(), accent: "text-[#772583]" },
            { label: academicYear.springLabel, value: academicYearStats.loading ? null : academicYearStats.springPoints.toLocaleString(), accent: "text-[#00629B]" },
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
              Events Attended · {academicYear.label}
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
                <p className="text-[0.9375rem] text-[#9A9A9A] font-light mb-1">No events attended this academic year.</p>
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
