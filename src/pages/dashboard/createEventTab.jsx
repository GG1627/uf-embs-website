import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "../../lib/supabase";
import { useSnackbar } from "../../components/ui/Snackbar";
import { useAuth } from "../auth/AuthContext";

export default function CreateEventTab() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventPoints, setEventPoints] = useState("");
  const [eventCode, setEventCode] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventQrcode, setEventQrcode] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [eventType, setEventType] = useState("");
  const [foodPresent, setFoodPresent] = useState("");
  const [isVirtual, setIsVirtual] = useState("");
  const [activeEvents, setActiveEvents] = useState([]);
  const [loadingActiveEvents, setLoadingActiveEvents] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingUpcomingEvents, setLoadingUpcomingEvents] = useState(true);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [flyerFile, setFlyerFile] = useState(null);
  const [flyerUrl, setFlyerUrl] = useState("");
  const [uploadingFlyer, setUploadingFlyer] = useState(false);

  // Edit modal state
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [editFlyerFile, setEditFlyerFile] = useState(null);

  const { showSnackbar } = useSnackbar();
  const { user } = useAuth();

  // Event type options with points mapping
  const eventTypeOptions = [
    { value: "gbm", label: "GBM", points: 1 },
    { value: "industry_speaker", label: "Industry Speaker", points: 2 },
    { value: "academia_speaker", label: "Academia Speaker", points: 3 },
    { value: "workshop", label: "Workshop", points: 3 },
    { value: "competition", label: "Competitions", points: 4 },
    { value: "fundraising", label: "Fundraising", points: null }, // Variable points
  ];

  // Auto-update QR code when event code changes
  useEffect(() => {
    if (eventCode.trim()) {
      setEventQrcode(eventCode);
      setShowQRCode(true);
    } else {
      setEventQrcode("");
      setShowQRCode(false);
    }
  }, [eventCode]);

  // Auto-fill points when event type changes
  useEffect(() => {
    if (eventType) {
      const selectedType = eventTypeOptions.find(option => option.value === eventType);
      if (selectedType && selectedType.points !== null) {
        setEventPoints(selectedType.points.toString());
      } else if (eventType === "fundraising") {
        setEventPoints(""); // Clear for fundraising to allow manual input
      }
    }
  }, [eventType]);

  // Fetch active and upcoming events on component mount
  useEffect(() => {
    fetchActiveEvents();
    fetchUpcomingEvents();
  }, []);

  // Function to deactivate expired events (events where end_time has passed)
  const deactivateExpiredEvents = async () => {
    try {
      const currentTime = new Date().toISOString();
      
      // Update all events where end_time < currentTime and is_active = true
      const { error } = await supabase
        .from("events")
        .update({ is_active: false })
        .lt("end_time", currentTime)
        .eq("is_active", true);

      if (error) {
        console.error("Error deactivating expired events:", error);
        // Don't show snackbar here as this is a background operation
      }
    } catch (error) {
      console.error("Error deactivating expired events:", error);
    }
  };

  // Function to fetch active events
  const fetchActiveEvents = async () => {
    try {
      setLoadingActiveEvents(true);
      // First, deactivate any expired events
      await deactivateExpiredEvents();
      
      const currentTime = new Date().toISOString();

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .lte("start_time", currentTime)
        .gte("end_time", currentTime)
        .eq("is_active", true)
        .order("start_time", { ascending: false });

      if (error) {
        console.error("Error fetching active events:", error);
        showSnackbar("Error fetching active events", {
          customColor: "#dc2626",
        });
        setActiveEvents([]);
      } else {
        setActiveEvents(data || []);
      }
    } catch (error) {
      console.error("Error fetching active events:", error);
      setActiveEvents([]);
    } finally {
      setLoadingActiveEvents(false);
    }
  };

  // Function to fetch upcoming events
  const fetchUpcomingEvents = async () => {
    try {
      setLoadingUpcomingEvents(true);
      // First, deactivate any expired events
      await deactivateExpiredEvents();
      
      const currentTime = new Date().toISOString();

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gt("start_time", currentTime)
        .eq("is_active", true)
        .order("start_time", { ascending: true })
        .limit(3);

      if (error) {
        console.error("Error fetching upcoming events:", error);
        showSnackbar("Error fetching upcoming events", {
          customColor: "#dc2626",
        });
        setUpcomingEvents([]);
      } else {
        setUpcomingEvents(data || []);
      }
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      setUpcomingEvents([]);
    } finally {
      setLoadingUpcomingEvents(false);
    }
  };

  // Function to upload flyer to Supabase storage
  const uploadFlyer = async (file) => {
    try {
      setUploadingFlyer(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `event-flyers/${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading flyer:", error);
      throw error;
    } finally {
      setUploadingFlyer(false);
    }
  };

  // Simple string similarity check (Dice's coefficient)
  const stringSimilarity = (a, b) => {
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const s1 = normalize(a);
    const s2 = normalize(b);
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
      if (count > 0) {
        bigrams.set(pair, count - 1);
        matches++;
      }
    }
    return (2 * matches) / (s1.length - 1 + (s2.length - 1));
  };

  // Check Google Calendar for duplicates, then create if none found
  const checkAndCreateGoogleCalendarEvent = async (
    name, date, startTime, endTime, desc, loc
  ) => {
    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    const CALENDAR_ID = import.meta.env.VITE_CALENDAR_ID;

    if (!API_KEY || !CALENDAR_ID) {
      console.warn("Missing Google Calendar API key or Calendar ID");
      return "error";
    }

    try {
      // Fetch events for that specific day
      const dayStart = `${date}T00:00:00-05:00`;
      const dayEnd = `${date}T23:59:59-05:00`;

      const params = new URLSearchParams({
        key: API_KEY,
        singleEvents: "true",
        timeMin: new Date(dayStart).toISOString(),
        timeMax: new Date(dayEnd).toISOString(),
      });

      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          CALENDAR_ID
        )}/events?${params}`
      );

      if (!res.ok) {
        console.error("Error fetching calendar events for duplicate check");
        // If we can't check, go ahead and create anyway
        return await createGoogleCalendarEvent(name, date, startTime, endTime, desc, loc);
      }

      const data = await res.json();
      const existingEvents = data.items || [];

      // Check if any existing event is similar (60%+ name match)
      const isDuplicate = existingEvents.some(
        (event) => stringSimilarity(event.summary || "", name) >= 0.6
      );

      if (isDuplicate) {
        console.log("Similar event found in Google Calendar, skipping creation");
        return "skipped";
      }

      // No duplicate found — create the event
      return await createGoogleCalendarEvent(name, date, startTime, endTime, desc, loc);
    } catch (err) {
      console.error("Duplicate check error:", err);
      // If duplicate check fails, still try to create
      return await createGoogleCalendarEvent(name, date, startTime, endTime, desc, loc);
    }
  };

  // Create event in Google Calendar via edge function
  const createGoogleCalendarEvent = async (
    name, date, startTime, endTime, desc, loc
  ) => {
    try {
      const gcalRes = await supabase.functions.invoke(
        "create-google-calendar-event",
        {
          body: {
            name,
            date,
            startTime,
            endTime,
            description: desc || "",
            location: loc || "",
          },
        }
      );

      if (gcalRes.error || (gcalRes.data && !gcalRes.data.ok)) {
        console.error(
          "Google Calendar error:",
          gcalRes.error || gcalRes.data?.error
        );
        showSnackbar("Event added but failed to sync to Google Calendar", {
          customColor: "#f59e0b",
        });
        return "error";
      }

      // Clear Google Calendar cache so the new event shows up immediately
      localStorage.removeItem("google_calendar_events");
      showSnackbar("Event added & synced to Google Calendar!", {
        customColor: "#007377",
      });
      return "created";
    } catch (gcalErr) {
      console.error("Google Calendar sync error:", gcalErr);
      showSnackbar("Event added but failed to sync to Google Calendar", {
        customColor: "#f59e0b",
      });
      return "error";
    }
  };

  // Function to add event to database
  const addEvent = async (e) => {
    e.preventDefault();

    // Upload flyer if present
    let uploadedFlyerUrl = flyerUrl;
    if (flyerFile) {
      try {
        uploadedFlyerUrl = await uploadFlyer(flyerFile);
      } catch (error) {
        showSnackbar("Error uploading flyer. Please try again.", {
          customColor: "#dc2626",
        });
        return;
      }
    }

    // Combine date and time into proper timestamp format with timezone
    // Create local date/time and convert to UTC for storage
    const startDateTime = new Date(
      `${eventDate}T${eventStartTime}:00`
    ).toISOString();
    const endDateTime = new Date(
      `${eventDate}T${eventEndTime}:00`
    ).toISOString();

    const { data, error } = await supabase.from("events").insert({
      name: eventName,
      date: eventDate, // Use the original date selected by user (already in YYYY-MM-DD format)
      points: eventPoints,
      code: eventCode,
      start_time: startDateTime,
      end_time: endDateTime,
      event_type: eventType,
      food_present: foodPresent === "yes",
      is_virtual: isVirtual === "yes",
      description: description || null,
      location: location || null,
      flyer_url: uploadedFlyerUrl || null,
      is_active: true,
      created_by: user?.id || null,
    });

    if (error) {
      console.error("Supabase error:", error);
      showSnackbar("Error adding event", { customColor: "#dc2626" });
    } else {
      console.log(data);

      // Check for duplicate in Google Calendar before creating
      const shouldCreateInCalendar = await checkAndCreateGoogleCalendarEvent(
        eventName,
        eventDate,
        eventStartTime,
        eventEndTime,
        description,
        location
      );

      if (shouldCreateInCalendar === "skipped") {
        showSnackbar(
          "Event saved — similar event already in Google Calendar, skipping calendar creation",
          { customColor: "#f59e0b" }
        );
      }

      setEventName("");
      setEventDate("");
      setEventPoints("");
      setEventCode("");
      setEventStartTime("");
      setEventEndTime("");
      setEventQrcode("");
      setShowQRCode(false);
      setEventType("");
      setFoodPresent("");
      setIsVirtual("");
      setDescription("");
      setLocation("");
      setFlyerFile(null);
      setFlyerUrl("");
      // Reset file input
      const fileInput = document.getElementById("event-flyer");
      if (fileInput) fileInput.value = "";
      // Refresh active and upcoming events after adding a new event
      fetchActiveEvents();
      fetchUpcomingEvents();
    }
  };

  // Open edit modal with event data pre-populated
  const openEditModal = (event) => {
    // Extract time from ISO timestamps
    const startDate = new Date(event.start_time);
    const endDate = new Date(event.end_time);
    const pad = (n) => n.toString().padStart(2, "0");

    setEditForm({
      name: event.name || "",
      date: event.date || "",
      points: event.points?.toString() || "",
      code: event.code || "",
      startTime: `${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`,
      endTime: `${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`,
      eventType: event.event_type || "",
      foodPresent: event.food_present ? "yes" : "no",
      isVirtual: event.is_virtual ? "yes" : "no",
      description: event.description || "",
      location: event.location || "",
      flyerUrl: event.flyer_url || "",
    });
    setEditFlyerFile(null);
    setEditingEvent(event);
  };

  // Save edited event to Supabase
  const saveEventEdit = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;

    setSavingEdit(true);
    try {
      // Upload new flyer if one was selected
      let uploadedFlyerUrl = editForm.flyerUrl;
      if (editFlyerFile) {
        uploadedFlyerUrl = await uploadFlyer(editFlyerFile);
      }

      const startDateTime = new Date(
        `${editForm.date}T${editForm.startTime}:00`
      ).toISOString();
      const endDateTime = new Date(
        `${editForm.date}T${editForm.endTime}:00`
      ).toISOString();

      const { error } = await supabase
        .from("events")
        .update({
          name: editForm.name,
          date: editForm.date,
          points: parseInt(editForm.points),
          code: editForm.code,
          start_time: startDateTime,
          end_time: endDateTime,
          event_type: editForm.eventType,
          food_present: editForm.foodPresent === "yes",
          is_virtual: editForm.isVirtual === "yes",
          description: editForm.description || null,
          location: editForm.location || null,
          flyer_url: uploadedFlyerUrl || null,
        })
        .eq("id", editingEvent.id);

      if (error) {
        console.error("Error updating event:", error);
        showSnackbar("Error updating event", { customColor: "#dc2626" });
      } else {
        showSnackbar("Event updated successfully!", { customColor: "#007377" });
        setEditingEvent(null);
        fetchActiveEvents();
        fetchUpcomingEvents();
      }
    } catch (error) {
      console.error("Error updating event:", error);
      showSnackbar("Error updating event", { customColor: "#dc2626" });
    } finally {
      setSavingEdit(false);
    }
  };

  // Function to generate random code
  const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setEventCode(result);
  };

  // Function to download QR code as image
  const downloadQRCode = (eventCode, eventName) => {
    // Create a temporary canvas to render the QR code
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = 300; // Larger size for better quality
    canvas.width = size;
    canvas.height = size;

    // Create a temporary SVG element with the QR code
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
      </svg>
    `;

    // Use html2canvas alternative - create QR code manually or use the library's canvas method
    // For now, we'll use a simpler approach with the QRCode library that can generate canvas
    import("qrcode")
      .then((QRCode) => {
        QRCode.toCanvas(
          canvas,
          `https://www.ufembs.com/checkin?code=${eventCode}`,
          {
            width: size,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          },
          (error) => {
            if (error) {
              console.error("Error generating QR code:", error);
              showSnackbar("Error generating QR code for download", {
                customColor: "#dc2626",
              });
              return;
            }

            // Convert canvas to blob and download
            canvas.toBlob((blob) => {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.download = `${eventName || eventCode}_QR_Code.png`;
              link.href = url;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);

              showSnackbar("QR code downloaded successfully", {
                customColor: "#007377",
              });
            }, "image/png");
          }
        );
      })
      .catch(() => {
        // Fallback method using SVG to canvas conversion
        const svgElement = document.querySelector(
          `#qr-${eventCode.replace(/[^a-zA-Z0-9]/g, "")}`
        );
        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const svgBlob = new Blob([svgData], {
            type: "image/svg+xml;charset=utf-8",
          });
          const url = URL.createObjectURL(svgBlob);
          const link = document.createElement("a");
          link.download = `${eventName || eventCode}_QR_Code.svg`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          showSnackbar("QR code downloaded as SVG", { customColor: "#007377" });
        } else {
          showSnackbar("Error: Could not find QR code to download", {
            customColor: "#dc2626",
          });
        }
      });
  };

  return (
    <>
      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditingEvent(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-sleek mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                Edit Event
              </h2>
              <button
                onClick={() => setEditingEvent(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={saveEventEdit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select
                    required
                    value={editForm.eventType}
                    onChange={(e) => {
                      const newType = e.target.value;
                      const selectedType = eventTypeOptions.find((o) => o.value === newType);
                      setEditForm({
                        ...editForm,
                        eventType: newType,
                        points:
                          selectedType && selectedType.points !== null
                            ? selectedType.points.toString()
                            : editForm.points,
                      });
                    }}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  >
                    <option value="">Select event type</option>
                    {eventTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Provided
                  </label>
                  <select
                    required
                    value={editForm.foodPresent}
                    onChange={(e) => setEditForm({ ...editForm, foodPresent: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Virtual or In-Person
                  </label>
                  <select
                    required
                    value={editForm.isVirtual}
                    onChange={(e) => setEditForm({ ...editForm, isVirtual: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  >
                    <option value="yes">Virtual</option>
                    <option value="no">In-Person</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    required
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Points
                  </label>
                  <input
                    type="number"
                    required
                    value={editForm.points}
                    onChange={(e) => setEditForm({ ...editForm, points: e.target.value })}
                    disabled={editForm.eventType && editForm.eventType !== "fundraising"}
                    className={`block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 ${
                      editForm.eventType && editForm.eventType !== "fundraising"
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={editForm.startTime}
                    onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={editForm.endTime}
                    onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 resize-none"
                    placeholder="Event description (optional)"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                    placeholder="Event location (optional)"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Code
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.code}
                    onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Flyer
                    <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                  </label>
                  {editForm.flyerUrl && !editFlyerFile && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">Current flyer:</p>
                      <img
                        src={editForm.flyerUrl}
                        alt="Current flyer"
                        className="max-w-full h-auto rounded-lg border border-gray-200 max-h-32 object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setEditFlyerFile(file);
                    }}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className={`flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all duration-200 shadow-lg ${
                    savingEdit ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Events */}
          <div className="space-y-8">
            {/* Active Events */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-fit">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  Active Events
                </h2>
                <button
                  onClick={() => {
                    fetchActiveEvents();
                    fetchUpcomingEvents();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                  title="Refresh events"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>

              {loadingActiveEvents ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                  <span className="ml-3 text-gray-600">
                    Loading active events...
                  </span>
                </div>
              ) : activeEvents.length > 0 ? (
                <div className="space-y-6 max-h-[600px] overflow-y-auto scrollbar-sleek">
                  {activeEvents.map((event) => (
                    <div
                      key={event.id}
                      className="border border-gray-100 rounded-xl p-6 hover:shadow-sm transition-all duration-200 bg-gray-50/30"
                    >
                      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            {event.name}
                          </h3>
                          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span>
                                {new Date(
                                  event.start_time
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-yellow-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              <span>{event.points} points</span>
                            </div>
                            <div className="flex items-center gap-2 col-span-2">
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>
                                {new Date(event.start_time).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}{" "}
                                -{" "}
                                {new Date(event.end_time).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="bg-gray-900 rounded-xl p-5 text-white">
                            <p className="text-sm font-medium mb-2 text-gray-300">
                              Event Code
                            </p>
                            <p className="text-2xl font-mono font-bold tracking-wider">
                              {event.code}
                            </p>
                          </div>
                        </div>

                        <div className="flex-shrink-0 flex flex-col items-center">
                          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                            <QRCodeSVG
                              id={`qr-${event.code.replace(
                                /[^a-zA-Z0-9]/g,
                                ""
                              )}`}
                              value={`https://www.ufembs.com/checkin?code=${event.code}`}
                              size={100}
                              level="H"
                              className="block"
                            />
                          </div>
                          <p className="mt-2 text-xs text-gray-500 text-center font-medium">
                            Scan to check in
                          </p>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() =>
                                downloadQRCode(event.code, event.name)
                              }
                              className="px-4 py-2 bg-gray-800 text-white text-xs font-medium rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-1 transition-all duration-200 hover:cursor-pointer flex items-center gap-2"
                              title="Download QR code"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                />
                              </svg>
                              Download
                            </button>
                            <button
                              onClick={() => openEditModal(event)}
                              className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 transition-all duration-200 hover:cursor-pointer flex items-center gap-2"
                              title="Edit event"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-300 mb-4">
                    <svg
                      className="mx-auto h-16 w-16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3zM9 5h6M9 11h6m-6 4h6"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-xl font-medium mb-2">
                    No active events
                  </p>
                  <p className="text-gray-400">
                    Create an event to start tracking attendance
                  </p>
                </div>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-fit">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  Upcoming Events
                </h2>
              </div>

              {loadingUpcomingEvents ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                  <span className="ml-3 text-gray-600">
                    Loading upcoming events...
                  </span>
                </div>
              ) : upcomingEvents.length > 0 ? (
                <div className="space-y-6 max-h-[600px] overflow-y-auto scrollbar-sleek">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="border border-gray-100 rounded-xl p-6 hover:shadow-sm transition-all duration-200 bg-gray-50/30"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        {/* Left Column - Event Details */}
                        <div className="flex-1 space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {event.name}
                          </h3>

                          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span>
                                {new Date(
                                  event.start_time
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-yellow-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              <span>{event.points} points</span>
                            </div>
                            <div className="flex items-center gap-2 col-span-2">
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>
                                {new Date(event.start_time).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}{" "}
                                -{" "}
                                {new Date(event.end_time).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="bg-gray-900 rounded-xl p-5 text-white">
                            <p className="text-sm font-medium mb-2 text-gray-300">
                              Event Code
                            </p>
                            <p className="text-2xl font-mono font-bold tracking-wider">
                              {event.code}
                            </p>
                          </div>

                          <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                            <button
                              onClick={() => openEditModal(event)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors duration-200 hover:cursor-pointer"
                              title="Edit event"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Starts in{" "}
                              {(() => {
                                const now = new Date();
                                const startTime = new Date(event.start_time);
                                const diffMs = startTime - now;
                                const diffHours = Math.ceil(
                                  diffMs / (1000 * 60 * 60)
                                );
                                const diffDays = Math.ceil(
                                  diffMs / (1000 * 60 * 60 * 24)
                                );

                                if (diffHours <= 24) {
                                  return `${diffHours} hour${
                                    diffHours !== 1 ? "s" : ""
                                  }`;
                                } else {
                                  return `${diffDays} day${
                                    diffDays !== 1 ? "s" : ""
                                  }`;
                                }
                              })()}
                            </span>
                          </div>
                        </div>

                        {/* Right Column - QR Code */}
                        <div className="flex-shrink-0 flex flex-col items-center space-y-3">
                          <div className="bg-white p-3 rounded-lg border-2 border-gray-200 shadow-sm">
                            <QRCodeSVG
                              id={`qr-upcoming-${event.code.replace(
                                /[^a-zA-Z0-9]/g,
                                ""
                              )}`}
                              value={`https://www.ufembs.com/checkin?code=${event.code}`}
                              size={80}
                              level="H"
                              className="block"
                            />
                          </div>
                          <p className="text-xs text-gray-500 text-center font-medium">
                            QR Code
                          </p>
                          <button
                            onClick={() =>
                              downloadQRCode(event.code, event.name)
                            }
                            className="px-4 py-2 bg-gray-800 text-white text-xs font-medium rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-1 transition-all duration-200 hover:cursor-pointer flex items-center gap-2"
                            title="Download QR code"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                              />
                            </svg>
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-300 mb-4">
                    <svg
                      className="mx-auto h-16 w-16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-xl font-medium mb-2">
                    No upcoming events
                  </p>
                  <p className="text-gray-400">
                    Create an event to see it here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Add Event Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-fit">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              Create New Event
            </h2>

            <form onSubmit={addEvent} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label
                    htmlFor="event-name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Event Name
                  </label>
                  <input
                    id="event-name"
                    type="text"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all duration-200"
                    placeholder="Enter event name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="event-type"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Event Type
                  </label>
                  <select
                    id="event-type"
                    required
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all duration-200"
                  >
                    <option value="">Select event type</option>
                    {eventTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="food-present"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Food Provided
                  </label>
                  <select
                    id="food-present"
                    required
                    value={foodPresent}
                    onChange={(e) => setFoodPresent(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all duration-200"
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="is-virtual"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Virtual or In-Person
                  </label>
                  <select
                    id="is-virtual"
                    required
                    value={isVirtual}
                    onChange={(e) => setIsVirtual(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all duration-200"
                  >
                    <option value="">Select option</option>
                    <option value="yes">Virtual</option>
                    <option value="no">In-Person</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="event-date"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Event Date
                  </label>
                  <input
                    id="event-date"
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="event-points"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Event Points
                    {eventType && eventType !== "fundraising" && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Auto-filled based on event type)
                      </span>
                    )}
                    {eventType === "fundraising" && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Variable - enter custom amount)
                      </span>
                    )}
                  </label>
                  <input
                    id="event-points"
                    type="number"
                    required
                    value={eventPoints}
                    onChange={(e) => setEventPoints(e.target.value)}
                    disabled={eventType && eventType !== "fundraising"}
                    className={`block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all duration-200 ${
                      eventType && eventType !== "fundraising" 
                        ? "bg-gray-100 cursor-not-allowed" 
                        : ""
                    }`}
                    placeholder={eventType === "fundraising" ? "Enter points" : "Points"}
                  />
                </div>

                <div>
                  <label
                    htmlFor="event-start-time"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Start Time
                  </label>
                  <input
                    id="event-start-time"
                    type="time"
                    required
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="event-end-time"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    End Time
                  </label>
                  <input
                    id="event-end-time"
                    type="time"
                    required
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all duration-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="event-description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="event-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all duration-200 resize-none"
                    placeholder="Enter event description (optional)"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="event-location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Location
                  </label>
                  <input
                    id="event-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all duration-200"
                    placeholder="Enter event location (optional)"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="event-flyer"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Event Flyer
                    <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                  </label>
                  <div className="space-y-2">
                    <input
                      id="event-flyer"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFlyerFile(file);
                          // Create preview URL
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFlyerUrl(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:cursor-pointer"
                    />
                    {flyerUrl && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">Preview:</p>
                        <img
                          src={flyerUrl}
                          alt="Flyer preview"
                          className="max-w-full h-auto rounded-lg border border-gray-200 max-h-48 object-contain"
                        />
                        {flyerFile && (
                          <button
                            type="button"
                            onClick={() => {
                              setFlyerFile(null);
                              setFlyerUrl("");
                              const fileInput = document.getElementById("event-flyer");
                              if (fileInput) fileInput.value = "";
                            }}
                            className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            Remove flyer
                          </button>
                        )}
                      </div>
                    )}
                    {uploadingFlyer && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                        <span>Uploading flyer...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="event-code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event Code
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="bg-gray-800 text-sm text-white px-4 py-2 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all duration-200 hover:cursor-pointer font-medium"
                  >
                    Generate Code
                  </button>
                </div>
                <input
                  id="event-code"
                  type="text"
                  required
                  value={eventCode}
                  onChange={(e) => setEventCode(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all duration-200 font-mono"
                  placeholder="Enter or generate event code"
                />
              </div>

              {/* QR Code Preview */}
              <div className="border-t border-gray-100 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  QR Code Preview
                </label>
                {showQRCode && eventQrcode ? (
                  <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <QRCodeSVG
                        id={`qr-preview-${eventQrcode.replace(
                          /[^a-zA-Z0-9]/g,
                          ""
                        )}`}
                        value={`https://www.ufembs.com/checkin?code=${eventQrcode}`}
                        size={120}
                        level="H"
                      />
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-700">
                      Code:{" "}
                      <span className="font-mono text-gray-900">
                        {eventQrcode}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500 text-center mb-3">
                      Students will scan this to check in
                    </p>
                    <button
                      type="button"
                      onClick={() => downloadQRCode(eventQrcode, eventName)}
                      className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all duration-200 hover:cursor-pointer flex items-center gap-2"
                      title="Download QR code"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                        />
                      </svg>
                      Download QR Code
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-8 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mb-3">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M12 12V8"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      QR code will appear when you enter an event code
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={uploadingFlyer}
                className={`w-full px-6 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl ${
                  uploadingFlyer
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:cursor-pointer"
                }`}
              >
                {uploadingFlyer ? "Uploading..." : "Create Event"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
