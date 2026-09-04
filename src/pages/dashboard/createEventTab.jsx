import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "../../lib/supabase";
import { useSnackbar } from "../../components/ui/Snackbar";
import { useAuth } from "../auth/AuthContext";
import { TBD_START_TIME, TBD_END_TIME, isTimeTBD } from "../../lib/eventTime";

const fieldCls =
  "w-full px-3 py-2.5 text-[0.9375rem] border border-[#2E2E2E] bg-[#1A1A1A] text-white placeholder-white/25 focus:outline-none focus:border-white/40 transition-colors duration-200";

const labelCls = "block text-[11px] font-semibold tracking-[0.16em] uppercase text-white/40 mb-2";

const SectionHeading = ({ label, title }) => (
  <div className="mb-6">
    <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-2">{label}</p>
    <h2 style={{ fontFamily: "'Lora', Georgia, serif" }}
      className="text-2xl font-medium text-white">{title}</h2>
  </div>
);

export default function CreateEventTab() {
  const [eventName, setEventName]           = useState("");
  const [eventDate, setEventDate]           = useState("");
  const [eventPoints, setEventPoints]       = useState("");
  const [eventCode, setEventCode]           = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime]     = useState("");
  const [timeTBD, setTimeTBD]               = useState(false);
  const [eventQrcode, setEventQrcode]       = useState("");
  const [showQRCode, setShowQRCode]         = useState(false);
  const [eventType, setEventType]           = useState("");
  const [foodPresent, setFoodPresent]       = useState("");
  const [isVirtual, setIsVirtual]           = useState("");
  const [activeEvents, setActiveEvents]     = useState([]);
  const [loadingActiveEvents, setLoadingActiveEvents]   = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingUpcomingEvents, setLoadingUpcomingEvents] = useState(true);
  const [description, setDescription]       = useState("");
  const [location, setLocation]             = useState("");
  const [flyerFile, setFlyerFile]           = useState(null);
  const [flyerUrl, setFlyerUrl]             = useState("");
  const [uploadingFlyer, setUploadingFlyer] = useState(false);

  const [editingEvent, setEditingEvent]     = useState(null);
  const [editForm, setEditForm]             = useState({});
  const [savingEdit, setSavingEdit]         = useState(false);
  const [editFlyerFile, setEditFlyerFile]   = useState(null);

  const { showSnackbar } = useSnackbar();
  const { user } = useAuth();

  const eventTypeOptions = [
    { value: "gbm",              label: "GBM",              points: 1 },
    { value: "industry_speaker", label: "Industry Speaker", points: 2 },
    { value: "social",           label: "Social",           points: 2 },
    { value: "academia_speaker", label: "Academia Speaker", points: 3 },
    { value: "workshop",         label: "Workshop",         points: 3 },
    { value: "competition",      label: "Competitions",     points: 4 },
    { value: "fundraising",      label: "Fundraising",      points: null },
  ];

  useEffect(() => {
    if (eventCode.trim()) { setEventQrcode(eventCode); setShowQRCode(true); }
    else { setEventQrcode(""); setShowQRCode(false); }
  }, [eventCode]);

  useEffect(() => {
    if (eventType) {
      const sel = eventTypeOptions.find((o) => o.value === eventType);
      if (sel && sel.points !== null) setEventPoints(sel.points.toString());
      else if (eventType === "fundraising") setEventPoints("");
    }
  }, [eventType]);

  useEffect(() => { fetchActiveEvents(); fetchUpcomingEvents(); }, []);

  const deactivateExpiredEvents = async () => {
    const currentTime = new Date().toISOString();
    await supabase.from("events").update({ is_active: false }).lt("end_time", currentTime).eq("is_active", true);
  };

  const fetchActiveEvents = async () => {
    try {
      setLoadingActiveEvents(true);
      await deactivateExpiredEvents();
      const currentTime = new Date().toISOString();
      const { data, error } = await supabase.from("events").select("*")
        .lte("start_time", currentTime).gte("end_time", currentTime).eq("is_active", true)
        .order("start_time", { ascending: false });
      setActiveEvents(error ? [] : (data || []));
    } catch { setActiveEvents([]); }
    finally { setLoadingActiveEvents(false); }
  };

  const fetchUpcomingEvents = async () => {
    try {
      setLoadingUpcomingEvents(true);
      await deactivateExpiredEvents();
      const currentTime = new Date().toISOString();
      const { data, error } = await supabase.from("events").select("*")
        .gt("start_time", currentTime).eq("is_active", true)
        .order("start_time", { ascending: true }).limit(3);
      setUpcomingEvents(error ? [] : (data || []));
    } catch { setUpcomingEvents([]); }
    finally { setLoadingUpcomingEvents(false); }
  };

  const uploadFlyer = async (file) => {
    try {
      setUploadingFlyer(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `event-flyers/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("blog-images").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("blog-images").getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) { console.error("Error uploading flyer:", error); throw error; }
    finally { setUploadingFlyer(false); }
  };

  const stringSimilarity = (a, b) => {
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const s1 = normalize(a); const s2 = normalize(b);
    if (s1 === s2) return 1;
    if (s1.length < 2 || s2.length < 2) return 0;
    const bigrams = new Map();
    for (let i = 0; i < s1.length - 1; i++) {
      const pair = s1.substring(i, i + 2);
      bigrams.set(pair, (bigrams.get(pair) || 0) + 1);
    }
    let matches = 0;
    for (let i = 0; i < s2.length - 1; i++) {
      const pair = s2.substring(i, i + 2);
      const count = bigrams.get(pair) || 0;
      if (count > 0) { bigrams.set(pair, count - 1); matches++; }
    }
    return (2 * matches) / (s1.length - 1 + (s2.length - 1));
  };

  const createGoogleCalendarEvent = async (name, date, startTime, endTime, desc, loc, allDay) => {
    try {
      const gcalRes = await supabase.functions.invoke("create-google-calendar-event", {
        body: { name, date, startTime, endTime, description: desc || "", location: loc || "", allDay: !!allDay },
      });
      if (gcalRes.error || (gcalRes.data && !gcalRes.data.ok)) {
        showSnackbar("Event added but failed to sync to Google Calendar", { customColor: "#f59e0b" });
        return "error";
      }
      localStorage.removeItem("google_calendar_events");
      showSnackbar("Event added & synced to Google Calendar!", { customColor: "#007377" });
      return "created";
    } catch {
      showSnackbar("Event added but failed to sync to Google Calendar", { customColor: "#f59e0b" });
      return "error";
    }
  };

  const checkAndCreateGoogleCalendarEvent = async (name, date, startTime, endTime, desc, loc, allDay) => {
    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    const CALENDAR_ID = import.meta.env.VITE_CALENDAR_ID;
    if (!API_KEY || !CALENDAR_ID) return "error";
    try {
      const dayStart = `${date}T00:00:00-05:00`;
      const dayEnd   = `${date}T23:59:59-05:00`;
      const params = new URLSearchParams({ key: API_KEY, singleEvents: "true", timeMin: new Date(dayStart).toISOString(), timeMax: new Date(dayEnd).toISOString() });
      const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?${params}`);
      if (!res.ok) return await createGoogleCalendarEvent(name, date, startTime, endTime, desc, loc, allDay);
      const data = await res.json();
      const isDuplicate = (data.items || []).some((e) => stringSimilarity(e.summary || "", name) >= 0.6);
      if (isDuplicate) return "skipped";
      return await createGoogleCalendarEvent(name, date, startTime, endTime, desc, loc, allDay);
    } catch { return await createGoogleCalendarEvent(name, date, startTime, endTime, desc, loc, allDay); }
  };

  const addEvent = async (e) => {
    e.preventDefault();
    let uploadedFlyerUrl = flyerUrl;
    if (flyerFile) {
      try { uploadedFlyerUrl = await uploadFlyer(flyerFile); }
      catch { showSnackbar("Error uploading flyer. Please try again.", { customColor: "#dc2626" }); return; }
    }
    const startTime = timeTBD ? TBD_START_TIME : eventStartTime;
    const endTime   = timeTBD ? TBD_END_TIME : eventEndTime;
    const startDateTime = new Date(`${eventDate}T${startTime}:00`).toISOString();
    const endDateTime   = new Date(`${eventDate}T${endTime}:00`).toISOString();
    const { data, error } = await supabase.from("events").insert({
      name: eventName, date: eventDate, points: eventPoints, code: eventCode,
      start_time: startDateTime, end_time: endDateTime, event_type: eventType,
      food_present: foodPresent === "yes", is_virtual: isVirtual === "yes",
      description: description || null, location: location || null,
      flyer_url: uploadedFlyerUrl || null, is_active: true, created_by: user?.id || null,
    });
    if (error) { showSnackbar("Error adding event", { customColor: "#dc2626" }); return; }
    console.log(data);
    const calResult = await checkAndCreateGoogleCalendarEvent(eventName, eventDate, startTime, endTime, description, location, timeTBD);
    if (calResult === "skipped") showSnackbar("Event saved — similar event already in Google Calendar", { customColor: "#f59e0b" });
    setEventName(""); setEventDate(""); setEventPoints(""); setEventCode("");
    setEventStartTime(""); setEventEndTime(""); setTimeTBD(false); setEventQrcode(""); setShowQRCode(false);
    setEventType(""); setFoodPresent(""); setIsVirtual(""); setDescription(""); setLocation("");
    setFlyerFile(null); setFlyerUrl("");
    const fileInput = document.getElementById("event-flyer");
    if (fileInput) fileInput.value = "";
    fetchActiveEvents(); fetchUpcomingEvents();
  };

  const openEditModal = (event) => {
    const startDate = new Date(event.start_time);
    const endDate   = new Date(event.end_time);
    const pad = (n) => n.toString().padStart(2, "0");
    setEditForm({
      name: event.name || "", date: event.date || "", points: event.points?.toString() || "",
      code: event.code || "",
      startTime: `${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`,
      endTime:   `${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`,
      timeTBD: isTimeTBD(event.start_time, event.end_time),
      eventType: event.event_type || "", foodPresent: event.food_present ? "yes" : "no",
      isVirtual: event.is_virtual ? "yes" : "no", description: event.description || "",
      location: event.location || "", flyerUrl: event.flyer_url || "",
    });
    setEditFlyerFile(null);
    setEditingEvent(event);
  };

  const saveEventEdit = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    setSavingEdit(true);
    try {
      let uploadedFlyerUrl = editForm.flyerUrl;
      if (editFlyerFile) uploadedFlyerUrl = await uploadFlyer(editFlyerFile);
      const startTime = editForm.timeTBD ? TBD_START_TIME : editForm.startTime;
      const endTime   = editForm.timeTBD ? TBD_END_TIME : editForm.endTime;
      const startDateTime = new Date(`${editForm.date}T${startTime}:00`).toISOString();
      const endDateTime   = new Date(`${editForm.date}T${endTime}:00`).toISOString();
      const { error } = await supabase.from("events").update({
        name: editForm.name, date: editForm.date, points: parseInt(editForm.points),
        code: editForm.code, start_time: startDateTime, end_time: endDateTime,
        event_type: editForm.eventType, food_present: editForm.foodPresent === "yes",
        is_virtual: editForm.isVirtual === "yes", description: editForm.description || null,
        location: editForm.location || null, flyer_url: uploadedFlyerUrl || null,
      }).eq("id", editingEvent.id);
      if (error) { showSnackbar("Error updating event", { customColor: "#dc2626" }); return; }
      showSnackbar("Event updated!", { customColor: "#007377" });
      setEditingEvent(null); fetchActiveEvents(); fetchUpcomingEvents();
    } catch { showSnackbar("Error updating event", { customColor: "#dc2626" }); }
    finally { setSavingEdit(false); }
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    setEventCode(Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join(""));
  };

  const downloadQRCode = (code, name) => {
    const canvas = document.createElement("canvas");
    const size = 300;
    canvas.width = size; canvas.height = size;
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvas, `https://www.ufembs.com/checkin?code=${code}`, { width: size, margin: 2, color: { dark: "#000000", light: "#FFFFFF" } }, (err) => {
        if (err) { showSnackbar("Error generating QR code", { customColor: "#dc2626" }); return; }
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `${name || code}_QR_Code.png`; link.href = url;
          document.body.appendChild(link); link.click(); document.body.removeChild(link);
          URL.revokeObjectURL(url);
          showSnackbar("QR code downloaded!", { customColor: "#007377" });
        }, "image/png");
      });
    }).catch(() => {
      const svgEl = document.querySelector(`#qr-${code.replace(/[^a-zA-Z0-9]/g, "")}`);
      if (svgEl) {
        const svgData = new XMLSerializer().serializeToString(svgEl);
        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${name || code}_QR_Code.svg`; link.href = url;
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showSnackbar("QR code downloaded as SVG", { customColor: "#007377" });
      }
    });
  };

  // ── small reusable event meta row ──────────────────────────────────────────
  const EventMeta = ({ icon, children }) => (
    <div className="flex items-center gap-2 text-[0.8125rem] text-white/50">
      <span className="text-white/30 shrink-0">{icon}</span>
      {children}
    </div>
  );

  const CalIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
  const ClockIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  const StarIcon = () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );

  const EventCard = ({ event, showQR = true }) => {
    const startStr = new Date(event.start_time).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const timeRange = isTimeTBD(event.start_time, event.end_time)
      ? "Time TBD"
      : `${new Date(event.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${new Date(event.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    return (
      <div className="border border-[#2E2E2E] bg-[#181818] p-5 flex flex-col lg:flex-row gap-5">
        <div className="flex-1 space-y-3">
          <p className="text-white font-medium text-[0.9375rem] leading-snug">{event.name}</p>
          <div className="space-y-1.5">
            <EventMeta icon={<CalIcon />}>{startStr}</EventMeta>
            <EventMeta icon={<ClockIcon />}>{timeRange}</EventMeta>
            <EventMeta icon={<StarIcon />}>{event.points} pts</EventMeta>
          </div>
          <div className="bg-[#111110] border border-[#2E2E2E] px-4 py-3">
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-white/30 mb-1">Event Code</p>
            <p className="font-mono text-xl font-bold text-white tracking-widest">{event.code}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => downloadQRCode(event.code, event.name)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#2E2E2E] hover:border-white/30 text-white/50 hover:text-white text-[0.75rem] font-medium tracking-wide transition-colors duration-200 cursor-pointer">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Download QR
            </button>
            <button onClick={() => openEditModal(event)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#772583]/15 border border-[#772583]/30 hover:bg-[#772583]/25 text-[#772583] text-[0.75rem] font-medium tracking-wide transition-colors duration-200 cursor-pointer">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          </div>
        </div>
        {showQR && (
          <div className="shrink-0 flex flex-col items-center gap-2">
            <div className="bg-white p-3">
              <QRCodeSVG
                id={`qr-${event.code.replace(/[^a-zA-Z0-9]/g, "")}`}
                value={`https://www.ufembs.com/checkin?code=${event.code}`}
                size={88} level="H"
              />
            </div>
            <p className="text-[11px] text-white/30 font-medium">Scan to check in</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* ── Edit modal ───────────────────────────────────────────────────── */}
      {editingEvent && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center px-4"
          style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="absolute inset-0 bg-[#111110]/80" onClick={() => setEditingEvent(null)} />
          <div className="relative bg-[#1A1A1A] border border-[#2E2E2E] w-full max-w-2xl max-h-[88vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#2E2E2E]">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-1">Admin</p>
                <h2 style={{ fontFamily: "'Lora', Georgia, serif" }}
                  className="text-xl font-medium text-white">Edit Event</h2>
              </div>
              <button onClick={() => setEditingEvent(null)}
                className="text-white/30 hover:text-white transition-colors duration-200 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={saveEventEdit} className="p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelCls}>Event Name</label>
                  <input type="text" required value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Event Type</label>
                  <select required value={editForm.eventType}
                    onChange={(e) => {
                      const sel = eventTypeOptions.find((o) => o.value === e.target.value);
                      setEditForm({ ...editForm, eventType: e.target.value,
                        points: sel && sel.points !== null ? sel.points.toString() : editForm.points });
                    }}
                    className={fieldCls}>
                    <option value="">Select type</option>
                    {eventTypeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Food Provided</label>
                  <select required value={editForm.foodPresent}
                    onChange={(e) => setEditForm({ ...editForm, foodPresent: e.target.value })}
                    className={fieldCls}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Format</label>
                  <select required value={editForm.isVirtual}
                    onChange={(e) => setEditForm({ ...editForm, isVirtual: e.target.value })}
                    className={fieldCls}>
                    <option value="yes">Virtual</option>
                    <option value="no">In-Person</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Date</label>
                  <input type="date" required value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Points</label>
                  <input type="number" required value={editForm.points}
                    onChange={(e) => setEditForm({ ...editForm, points: e.target.value })}
                    disabled={editForm.eventType && editForm.eventType !== "fundraising"}
                    className={`${fieldCls} ${editForm.eventType && editForm.eventType !== "fundraising" ? "opacity-40 cursor-not-allowed" : ""}`} />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2.5 cursor-pointer group w-fit">
                    <div className="relative">
                      <input type="checkbox" checked={!!editForm.timeTBD}
                        onChange={(e) => setEditForm({ ...editForm, timeTBD: e.target.checked })}
                        className="sr-only peer" />
                      <div className="w-8 h-4 bg-[#2E2E2E] peer-checked:bg-[#772583] transition-colors duration-200" />
                      <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white transition-transform duration-200 peer-checked:translate-x-4" />
                    </div>
                    <span className="text-[0.8125rem] text-white/50 font-light select-none">Time TBD</span>
                  </label>
                </div>
                {!editForm.timeTBD && (
                  <>
                    <div>
                      <label className={labelCls}>Start Time</label>
                      <input type="time" required value={editForm.startTime}
                        onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                        className={fieldCls} />
                    </div>
                    <div>
                      <label className={labelCls}>End Time</label>
                      <input type="time" required value={editForm.endTime}
                        onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                        className={fieldCls} />
                    </div>
                  </>
                )}
                <div className="md:col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3} placeholder="Optional"
                    className={`${fieldCls} resize-none`} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Location</label>
                  <input type="text" value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="Optional" className={fieldCls} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Event Code</label>
                  <input type="text" required value={editForm.code}
                    onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                    className={`${fieldCls} font-mono`} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Event Flyer <span className="normal-case tracking-normal font-normal text-white/20 ml-1">(optional)</span></label>
                  {editForm.flyerUrl && !editFlyerFile && (
                    <img src={editForm.flyerUrl} alt="Current flyer" className="mb-3 max-h-28 object-contain border border-[#2E2E2E]" />
                  )}
                  <input type="file" accept="image/*"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) setEditFlyerFile(f); }}
                    className={`${fieldCls} file:mr-4 file:py-1 file:px-3 file:border-0 file:text-xs file:font-semibold file:bg-[#2E2E2E] file:text-white/60 hover:file:bg-[#3E3E3E] file:cursor-pointer`} />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingEvent(null)}
                  className="flex-1 py-3 border border-[#2E2E2E] hover:border-white/30 text-white/50 hover:text-white text-[0.875rem] font-medium tracking-wide transition-colors duration-200 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={savingEdit}
                  className={`flex-1 py-3 bg-[#1A1A1A] border border-[#772583] hover:bg-[#772583]/20 text-[#772583] text-[0.875rem] font-medium tracking-wide transition-colors duration-200 ${savingEdit ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}>
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Main layout ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24"
        style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT: Active + Upcoming events ─────────────────────────────── */}
          <div className="space-y-10">
            {/* Active */}
            <div>
              <div className="flex items-start justify-between mb-6">
                <SectionHeading label="Live Now" title="Active Events" />
                <button onClick={() => { fetchActiveEvents(); fetchUpcomingEvents(); }}
                  className="text-white/30 hover:text-white transition-colors duration-200 cursor-pointer p-1 mt-1" title="Refresh">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

              {loadingActiveEvents ? (
                <div className="border border-[#2E2E2E] py-14 flex items-center justify-center gap-3 text-white/30">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-[0.8125rem]">Loading…</span>
                </div>
              ) : activeEvents.length > 0 ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {activeEvents.map((ev) => <EventCard key={ev.id} event={ev} />)}
                </div>
              ) : (
                <div className="border border-[#2E2E2E] py-14 text-center">
                  <p className="text-[0.9375rem] text-white/30 font-light">No active events right now.</p>
                </div>
              )}
            </div>

            {/* Upcoming */}
            <div>
              <SectionHeading label="On Deck" title="Upcoming Events" />
              {loadingUpcomingEvents ? (
                <div className="border border-[#2E2E2E] py-14 flex items-center justify-center gap-3 text-white/30">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-[0.8125rem]">Loading…</span>
                </div>
              ) : upcomingEvents.length > 0 ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {upcomingEvents.map((ev) => {
                    const now = new Date();
                    const start = new Date(ev.start_time);
                    const diffMs = start - now;
                    const diffH = Math.ceil(diffMs / (1000 * 60 * 60));
                    const diffD = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                    const countdownLabel = diffH <= 24 ? `${diffH}h` : `${diffD}d`;
                    return (
                      <div key={ev.id}>
                        <EventCard event={ev} />
                        <div className="border-x border-b border-[#2E2E2E] px-5 py-2 flex items-center gap-2">
                          <ClockIcon />
                          <span className="text-[0.75rem] text-white/30">Starts in {countdownLabel}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="border border-[#2E2E2E] py-14 text-center">
                  <p className="text-[0.9375rem] text-white/30 font-light">No upcoming events.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Create form ─────────────────────────────────────────── */}
          <div>
            <SectionHeading label="Admin" title="Create New Event" />
            <form onSubmit={addEvent} className="space-y-4 border border-[#2E2E2E] p-8 bg-[#141414]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelCls} htmlFor="event-name">Event Name</label>
                  <input id="event-name" type="text" required placeholder="Enter event name"
                    value={eventName} onChange={(e) => setEventName(e.target.value)} className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="event-type">Event Type</label>
                  <select id="event-type" required value={eventType}
                    onChange={(e) => setEventType(e.target.value)} className={fieldCls}>
                    <option value="">Select type</option>
                    {eventTypeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="food-present">Food Provided</label>
                  <select id="food-present" required value={foodPresent}
                    onChange={(e) => setFoodPresent(e.target.value)} className={fieldCls}>
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="is-virtual">Format</label>
                  <select id="is-virtual" required value={isVirtual}
                    onChange={(e) => setIsVirtual(e.target.value)} className={fieldCls}>
                    <option value="">Select option</option>
                    <option value="yes">Virtual</option>
                    <option value="no">In-Person</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="event-date">Date</label>
                  <input id="event-date" type="date" required value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)} className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="event-points">
                    Points
                    {eventType && eventType !== "fundraising" && (
                      <span className="ml-2 normal-case tracking-normal font-normal text-white/20">(auto-filled)</span>
                    )}
                    {eventType === "fundraising" && (
                      <span className="ml-2 normal-case tracking-normal font-normal text-white/20">(variable)</span>
                    )}
                  </label>
                  <input id="event-points" type="number" required value={eventPoints}
                    onChange={(e) => setEventPoints(e.target.value)}
                    disabled={eventType && eventType !== "fundraising"}
                    placeholder={eventType === "fundraising" ? "Enter points" : "Points"}
                    className={`${fieldCls} ${eventType && eventType !== "fundraising" ? "opacity-40 cursor-not-allowed" : ""}`} />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2.5 cursor-pointer group w-fit">
                    <div className="relative">
                      <input type="checkbox" checked={timeTBD}
                        onChange={(e) => setTimeTBD(e.target.checked)}
                        className="sr-only peer" />
                      <div className="w-8 h-4 bg-[#2E2E2E] peer-checked:bg-[#772583] transition-colors duration-200" />
                      <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white transition-transform duration-200 peer-checked:translate-x-4" />
                    </div>
                    <span className="text-[0.8125rem] text-white/50 font-light select-none">Time TBD</span>
                  </label>
                </div>
                {!timeTBD && (
                  <>
                    <div>
                      <label className={labelCls} htmlFor="event-start-time">Start Time</label>
                      <input id="event-start-time" type="time" required value={eventStartTime}
                        onChange={(e) => setEventStartTime(e.target.value)} className={fieldCls} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="event-end-time">End Time</label>
                      <input id="event-end-time" type="time" required value={eventEndTime}
                        onChange={(e) => setEventEndTime(e.target.value)} className={fieldCls} />
                    </div>
                  </>
                )}
                <div className="md:col-span-2">
                  <label className={labelCls} htmlFor="event-description">Description <span className="normal-case tracking-normal font-normal text-white/20">(optional)</span></label>
                  <textarea id="event-description" rows={3} value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Event description" className={`${fieldCls} resize-none`} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls} htmlFor="event-location">Location <span className="normal-case tracking-normal font-normal text-white/20">(optional)</span></label>
                  <input id="event-location" type="text" value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Event location" className={fieldCls} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls} htmlFor="event-flyer">Flyer <span className="normal-case tracking-normal font-normal text-white/20">(optional)</span></label>
                  <input id="event-flyer" type="file" accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setFlyerFile(f);
                        const reader = new FileReader();
                        reader.onloadend = () => setFlyerUrl(reader.result);
                        reader.readAsDataURL(f);
                      }
                    }}
                    className={`${fieldCls} file:mr-4 file:py-1 file:px-3 file:border-0 file:text-xs file:font-semibold file:bg-[#2E2E2E] file:text-white/60 hover:file:bg-[#3E3E3E] file:cursor-pointer`} />
                  {flyerUrl && (
                    <div className="mt-3 space-y-2">
                      <img src={flyerUrl} alt="Flyer preview" className="max-h-36 object-contain border border-[#2E2E2E]" />
                      <button type="button" onClick={() => { setFlyerFile(null); setFlyerUrl(""); const fi = document.getElementById("event-flyer"); if (fi) fi.value = ""; }}
                        className="text-[0.75rem] text-[#772583] hover:text-[#a040b0] font-medium transition-colors duration-200 cursor-pointer">
                        Remove flyer
                      </button>
                    </div>
                  )}
                  {uploadingFlyer && (
                    <div className="flex items-center gap-2 mt-2 text-[0.8125rem] text-white/30">
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Uploading flyer…
                    </div>
                  )}
                </div>
              </div>

              {/* Event code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelCls} htmlFor="event-code" style={{ marginBottom: 0 }}>Event Code</label>
                  <button type="button" onClick={generateRandomCode}
                    className="text-[0.75rem] text-white/40 hover:text-white border border-[#2E2E2E] hover:border-white/30 px-3 py-1 font-medium tracking-wide transition-colors duration-200 cursor-pointer">
                    Generate
                  </button>
                </div>
                <input id="event-code" type="text" required value={eventCode}
                  onChange={(e) => setEventCode(e.target.value)}
                  placeholder="Enter or generate code" className={`${fieldCls} font-mono`} />
              </div>

              {/* QR preview */}
              <div className="border-t border-[#2E2E2E] pt-5">
                <p className={labelCls}>QR Code Preview</p>
                {showQRCode && eventQrcode ? (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <div className="bg-white p-3">
                      <QRCodeSVG
                        id={`qr-preview-${eventQrcode.replace(/[^a-zA-Z0-9]/g, "")}`}
                        value={`https://www.ufembs.com/checkin?code=${eventQrcode}`}
                        size={110} level="H"
                      />
                    </div>
                    <p className="text-[0.8125rem] text-white/40 font-mono">{eventQrcode}</p>
                    <button type="button" onClick={() => downloadQRCode(eventQrcode, eventName)}
                      className="flex items-center gap-2 px-4 py-2 border border-[#2E2E2E] hover:border-white/30 text-white/40 hover:text-white text-[0.8125rem] font-medium transition-colors duration-200 cursor-pointer">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                      Download QR Code
                    </button>
                  </div>
                ) : (
                  <div className="border border-[#2E2E2E] border-dashed py-10 flex flex-col items-center gap-2 text-white/20">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M12 12V8" />
                    </svg>
                    <p className="text-[0.8125rem] font-light">Enter an event code to preview</p>
                  </div>
                )}
              </div>

              <button type="submit" disabled={uploadingFlyer}
                className={`w-full py-3.5 bg-[#1A1A1A] border border-[#772583] hover:bg-[#772583]/15 text-[#772583] font-medium text-[0.9375rem] tracking-wide transition-colors duration-200 ${uploadingFlyer ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}>
                {uploadingFlyer ? "Uploading…" : "Create Event"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}
