import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../components/ui/Snackbar";
import { IoMdHeart } from "react-icons/io";
import { FaQrcode, FaCamera, FaExclamationTriangle } from "react-icons/fa";
import { careerFields } from "../../data/careerFields";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
} from "@mui/material";

export default function MemberDashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [favoriteFields, setFavoriteFields] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [userStats, setUserStats] = useState({ points: 0, eventsAttended: 0 });
  const [eventCode, setEventCode] = useState("");
  const [eventId, setEventId] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [nationalMemberStatus, setNationalMemberStatus] = useState(null);
  const [showNationalMemberUpdate, setShowNationalMemberUpdate] =
    useState(false);
  const [selectedNationalStatus, setSelectedNationalStatus] = useState("");
  const [userMajor, setUserMajor] = useState(null);
  const [showMajorUpdate, setShowMajorUpdate] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [customMajor, setCustomMajor] = useState("");
  const [eventsAttended, setEventsAttended] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [semesterStats, setSemesterStats] = useState({
    fallPoints: 0,
    springPoints: 0,
    fallEvents: 0,
    springEvents: 0,
    loading: true,
  });

  // Major options
  const majorOptions = [
    "Biomedical Engineering",
    "Electrical Engineering", 
    "Computer Science",
    "Computer Engineering",
    "Biology",
    "Biochemistry",
    "Mechanical Engineering",
    "Other"
  ];

  useEffect(() => {
    if (user) {
      console.log("🎯 Dashboard useEffect triggered with user:", user);
      fetchUserStats();
      fetchFavoriteFields();
      fetchEventsAttended();
      checkNationalMemberStatus();
      checkMajorStatus();
      fetchSemesterStats();
    } else {
      console.log("⚠️ Dashboard useEffect triggered but no user found");
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      setStatsLoading(true);
      console.log("🔍 Fetching user stats for user:", {
        userId: user.id,
        userEmail: user.email,
        userMetadata: user.user_metadata,
      });

      console.log("📊 Attempting to fetch real user stats from database...");

      // Try to get real user stats from members table
      const { data, error } = await supabase
        .from("members")
        .select(
          "points, events_attended, first_name, last_name, email, national_member, major"
        )
        .eq("user_id", user.id)
        .single();

      console.log("📊 User stats query result:", { data, error });

      if (error) {
        console.error("❌ Error fetching user stats:", error);
        // Fallback to defaults if query fails
        console.log("🔄 Falling back to default values");
        setUserStats({
          points: 0,
          events_attended: 0,
        });
        showSnackbar("Using default stats - database query failed", {
          customColor: "#ff9800",
        });
        setStatsLoading(false);
        return;
      }

      if (data) {
        console.log("✅ Successfully fetched user stats:", data);
        setUserStats({
          points: data.points || 0,
          events_attended: data.events_attended || 0,
        });
        // Also set the national member status and major
        setNationalMemberStatus(data.national_member);
        setUserMajor(data.major);
        console.log("🎯 Set user stats:", {
          points: data.points || 0,
          events_attended: data.events_attended || 0,
          national_member: data.national_member,
          major: data.major,
        });
      } else {
        console.log("⚠️ No user data found in members table");
        setUserStats({
          points: 0,
          events_attended: 0,
        });
        showSnackbar("User not found in database", {
          customColor: "#ff9800",
        });
        setStatsLoading(false);
      }
    } catch (error) {
      console.error("❌ Exception in fetchUserStats:", error);
      setUserStats({
        points: 0,
        events_attended: 0,
      });
      showSnackbar("Error fetching user stats: " + error.message, {
        customColor: "#b00000",
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch semester breakdown (Fall 2025 / Spring 2026)
  const fetchSemesterStats = async () => {
    try {
      setSemesterStats((prev) => ({ ...prev, loading: true }));
      // Spring 2026 starts Jan 1 2026
      const springCutoff = new Date("2026-01-01T00:00:00.000Z");

      const { data, error } = await supabase
        .from("event_attendance")
        .select("claimed_at, events(points)")
        .eq("member_id", user.id);

      if (error || !data) {
        setSemesterStats({ fallPoints: 0, springPoints: 0, fallEvents: 0, springEvents: 0, loading: false });
        return;
      }

      let fallPoints = 0, springPoints = 0, fallEvents = 0, springEvents = 0;
      data.forEach((record) => {
        const pts = record.events?.points || 0;
        if (record.claimed_at && new Date(record.claimed_at) >= springCutoff) {
          springPoints += pts;
          springEvents += 1;
        } else {
          fallPoints += pts;
          fallEvents += 1;
        }
      });

      setSemesterStats({ fallPoints, springPoints, fallEvents, springEvents, loading: false });
    } catch (err) {
      console.error("Error fetching semester stats:", err);
      setSemesterStats({ fallPoints: 0, springPoints: 0, fallEvents: 0, springEvents: 0, loading: false });
    }
  };

  const checkNationalMemberStatus = async () => {
    try {
      console.log("🏛️ Checking national member status for user:", user.id);

      const { data, error } = await supabase
        .from("members")
        .select("national_member")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("❌ Error checking national member status:", error);
        return;
      }

      if (data) {
        setNationalMemberStatus(data.national_member);
        setShowNationalMemberUpdate(data.national_member === null);
        console.log("🏛️ National member status:", data.national_member);
      }
    } catch (error) {
      console.error("❌ Exception checking national member status:", error);
    }
  };

  const checkMajorStatus = async () => {
    try {
      console.log("🎓 Checking major status for user:", user.id);

      const { data, error } = await supabase
        .from("members")
        .select("major")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("❌ Error checking major status:", error);
        return;
      }

      if (data) {
        setUserMajor(data.major);
        setShowMajorUpdate(data.major === null);
        console.log("🎓 Major status:", data.major);
      }
    } catch (error) {
      console.error("❌ Exception checking major status:", error);
    }
  };

  const updateNationalMemberStatus = async () => {
    if (!selectedNationalStatus) {
      showSnackbar("Please select your national membership status", {
        customColor: "#b00000",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("members")
        .update({ national_member: selectedNationalStatus })
        .eq("user_id", user.id);

      if (error) {
        console.error("❌ Error updating national member status:", error);
        showSnackbar("Error updating status: " + error.message, {
          customColor: "#b00000",
        });
        return;
      }

      // Update local state
      setNationalMemberStatus(selectedNationalStatus);
      setShowNationalMemberUpdate(false);
      setSelectedNationalStatus("");

      showSnackbar("National membership status updated successfully!", {
        customColor: "#007377",
      });

      console.log(
        "✅ Successfully updated national member status:",
        selectedNationalStatus
      );
    } catch (error) {
      console.error("❌ Exception updating national member status:", error);
      showSnackbar("Error updating status", {
        customColor: "#b00000",
      });
    }
  };

  const updateMajor = async () => {
    if (!selectedMajor) {
      showSnackbar("Please select your major", {
        customColor: "#b00000",
      });
      return;
    }

    // Determine the final major value
    const finalMajor = selectedMajor === "Other" ? customMajor : selectedMajor;
    
    if (!finalMajor || !finalMajor.trim()) {
      showSnackbar("Please enter your major", {
        customColor: "#b00000",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("members")
        .update({ major: finalMajor })
        .eq("user_id", user.id);

      if (error) {
        console.error("❌ Error updating major:", error);
        showSnackbar("Error updating major: " + error.message, {
          customColor: "#b00000",
        });
        return;
      }

      // Update local state
      setUserMajor(finalMajor);
      setShowMajorUpdate(false);
      setSelectedMajor("");
      setCustomMajor("");

      showSnackbar("Major updated successfully!", {
        customColor: "#007377",
      });

      console.log("✅ Successfully updated major:", finalMajor);
    } catch (error) {
      console.error("❌ Exception updating major:", error);
      showSnackbar("Error updating major", {
        customColor: "#b00000",
      });
    }
  };

  const fetchEventsAttended = async () => {
    try {
      setEventsLoading(true);
      const { data, error } = await supabase
        .from("event_attendance")
        .select(
          `
          event_id,
          events (
            id,
            name,
            start_time,
            points
          )
        `
        )
        .eq("member_id", user.id)
        .order("events(start_time)", { ascending: false });

      console.log("🔍 Events attended query result:", { data, error });

      if (error) {
        console.error("❌ Error fetching events attended:", error);
        setEventsAttended([]);
        showSnackbar("Error fetching events attended", {
          customColor: "#b00000",
        });
        setEventsLoading(false);
        return;
      }

      if (data) {
        // Filter out any null events and extract the event details
        const validEvents = data
          .filter((item) => item.events !== null)
          .map((item) => item.events);

        console.log("✅ Successfully fetched events attended:", validEvents);
        setEventsAttended(validEvents);
      } else {
        console.log("📝 No events attended found for user");
        setEventsAttended([]);
      }
    } catch (error) {
      console.error("❌ Exception fetching events attended:", error);
      setEventsAttended([]);
      showSnackbar("Error fetching events: " + error.message, {
        customColor: "#b00000",
      });
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchFavoriteFields = async () => {
    try {
      setFavoritesLoading(true);
      console.log("❤️ Fetching favorite careers for user:", user.email);
      console.log(
        "🔍 Attempting to fetch real favorite careers from database..."
      );

      const { data, error } = await supabase
        .from("favorite_careers")
        .select("career_name, created_at")
        .eq("user_id", user.id);

      console.log("❤️ Favorite careers query result:", { data, error });

      if (error) {
        console.error("❌ Error fetching favorites:", error);
        // Fallback to empty array if query fails
        console.log("🔄 Falling back to empty favorites array");
        setFavoriteFields([]);
        showSnackbar("Using empty favorites - database query failed", {
          customColor: "#ff9800",
        });
        setFavoritesLoading(false);
        return;
      }

      if (data) {
        console.log("✅ Successfully fetched favorite careers:", data);

        const favoritesWithInfo = data
          .map((favorite) => {
            const careerInfo = careerFields.find(
              (field) => field.name === favorite.career_name
            );
            console.log(
              `🔍 Looking up career "${favorite.career_name}":`,
              careerInfo ? "Found" : "Not found"
            );
            return careerInfo;
          })
          .filter(Boolean);

        console.log("🎯 Processed favorite careers:", favoritesWithInfo);
        setFavoriteFields(favoritesWithInfo);

        if (favoritesWithInfo.length > 0) {
          console.log(
            "✅ Successfully fetched favorite careers:",
            favoritesWithInfo
          );
        }
      } else {
        console.log("📝 No favorite careers found for user");
        setFavoriteFields([]);
      }
    } catch (error) {
      console.error("❌ Exception fetching favorite careers:", error);
      setFavoriteFields([]); // Fallback to empty array
      showSnackbar("Error fetching favorite careers: " + error.message, {
        customColor: "#b00000",
      });
    } finally {
      setFavoritesLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        showSnackbar("Error logging out: " + error.message, {
          customColor: "#b00000",
        });
      } else {
        showSnackbar("Logged out successfully!", {
          customColor: "#009623",
        });
        navigate("/");
      }
    } catch (error) {
      showSnackbar("Error logging out. Please try again.", {
        customColor: "#b00000",
      });
    }
  };

  // get the event id from supabase
  const getEventId = async (code) => {
    console.log("Looking for event with code:", code);

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, points, name, end_time")
      .eq("code", code)
      .single();

    console.log("Event query result:", { event, eventError });

    if (eventError) {
      console.error("Event query error:", eventError);
      showSnackbar("Error finding event: " + eventError.message, {
        customColor: "#b00000",
      });
      return null;
    }

    if (!event) {
      showSnackbar("No event found with that code", {
        customColor: "#b00000",
      });
      return null;
    }

    // Check if event is still active -- remove logging when done
    const now = new Date();
    const endTime = new Date(event.end_time);

    console.log("Time comparison:", {
      now: now.toISOString(),
      endTime: endTime.toISOString(),
      isExpired: endTime < now,
    });

    console.log("Found valid event:", event);
    return event.id;
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();

    if (!eventCode || !eventCode.trim()) {
      showSnackbar("Please enter an event code", {
        customColor: "#b00000",
      });
      return;
    }

    if (!user?.id) {
      showSnackbar("Missing user data. Please try logging in again.", {
        customColor: "#b00000",
      });
      return;
    }

    // Use the same check-in logic as QR scanning
    await performCheckIn(eventCode);
  };

  // Handle QR code scan result
  const handleQRScan = async (result) => {
    console.log("QR Scan result:", result); // Debug log

    if (result) {
      // Extract the actual text from the result - handle different result formats
      let scannedText = null;

      if (typeof result === "string") {
        scannedText = result;
      } else if (result.text) {
        scannedText = result.text;
      } else if (result.rawValue) {
        scannedText = result.rawValue;
      } else if (Array.isArray(result) && result.length > 0) {
        scannedText = result[0].text || result[0].rawValue || result[0];
      }

      console.log("Extracted scanned text:", scannedText); // Debug log

      if (scannedText && typeof scannedText === "string") {
        let extractedCode = null;

        try {
          // Try to extract code from URL first
          const url = new URL(scannedText);
          const codeParam = url.searchParams.get("code");

          // Accept URLs from multiple domains
          const validDomains = ["www.ufembs.com"];
          const isValidDomain = validDomains.some((domain) =>
            url.hostname.includes(domain)
          );

          if (codeParam && codeParam.trim() && isValidDomain) {
            extractedCode = codeParam.trim();
          } else if (codeParam && codeParam.trim()) {
            // Accept code even if domain doesn't match (for flexibility)
            extractedCode = codeParam.trim();
          } else {
            // If URL doesn't have a valid code parameter, use the full URL as code
            extractedCode = scannedText.trim();
          }
        } catch (error) {
          // If it's not a URL, use the scanned text directly as the code
          extractedCode = scannedText.trim();
        }

        console.log("Extracted code:", extractedCode); // Debug log

        if (extractedCode) {
          // Close the scanner immediately
          setShowQRScanner(false);

          // Set the event code
          setEventCode(extractedCode);

          // Show scanning success message
          showSnackbar("QR code scanned! Processing check-in...", {
            customColor: "#007377",
          });

          // Automatically trigger check-in
          await performCheckIn(extractedCode);
        } else {
          showSnackbar("Invalid QR code - no code found", {
            customColor: "#b00000",
          });
        }
      } else {
        showSnackbar("Invalid QR code format", {
          customColor: "#b00000",
        });
      }
    }
  };

  // Separate function to handle the actual check-in logic
  const performCheckIn = async (code) => {
    if (!code || !code.trim()) {
      showSnackbar("Invalid event code", {
        customColor: "#b00000",
      });
      return;
    }

    const eventId = await getEventId(code);

    console.log("User ID:", user.id);
    console.log("Event ID:", eventId);
    console.log("Code:", code);

    if (!eventId) {
      // Error already shown in getEventId
      return;
    }

    if (!user?.id) {
      showSnackbar("Missing user data. Please try logging in again.", {
        customColor: "#b00000",
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc("claim_event", {
        p_member_id: user.id,
        p_event_id: eventId,
        p_code: code,
      });

      console.log("RPC Response:", { data, error });

      if (error) {
        console.error("Supabase RPC error:", error);
        showSnackbar("Error checking in: " + error.message, {
          customColor: "#b00000",
        });
      } else {
        console.log("Function returned:", data);

        // Check the return value from the function
        if (data === "Points claimed successfully!") {
          showSnackbar(
            "Checked in successfully! Points added to your account.",
            {
              customColor: "#007377",
            }
          );
          setEventCode(""); // Clear the input after successful check-in
          // Refresh user stats and events attended
          fetchUserStats();
          fetchEventsAttended();
        } else {
          // Function returned an error message
          showSnackbar(data || "Check-in failed", {
            customColor: "#b00000",
          });
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      showSnackbar("Unexpected error occurred", {
        customColor: "#b00000",
      });
    }
  };

  // Handle QR scanner errors
  const handleQRError = (error) => {
    console.error("QR Scanner error:", error);
    showSnackbar("Camera access denied or QR scanner error", {
      customColor: "#b00000",
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-12">
        <div className="justify-center items-center flex-col flex mt-16">
          <div className="w-full max-w-7xl mb-6 sm:mb-8 px-2 sm:px-4 md:px-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#009ca6] mb-2">
              Welcome to Your Dashboard
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl">
              Track your points and progress with UF EMBS!
            </p>
          </div>

          {/* Officer Eligibility Badge */}
          {!semesterStats.loading && !statsLoading && (() => {
            const total = userStats.points;
            const spring = semesterStats.springPoints;
            const rawFall = semesterStats.fallPoints;
            const remainder = Math.max(0, total - (rawFall + spring));
            const fall = rawFall + remainder;
            return fall >= 7 || spring >= 12;
          })() && (
            <div className="w-full max-w-7xl px-2 sm:px-4 md:px-0 mb-6">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#005a5e] via-[#007377] to-[#009ca6] p-px shadow-xl">
                <div className="relative rounded-2xl bg-gradient-to-r from-[#005a5e]/95 via-[#007377]/90 to-[#009ca6]/85 px-6 py-5 flex flex-col sm:flex-row items-center gap-4">
                  {/* Animated glow ring */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.95 2.878c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* Text */}
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-0.5">
                      🎉 Milestone Reached
                    </p>
                    <h2 className="text-white text-xl sm:text-2xl font-bold leading-snug">
                      You're eligible to apply for an Officer position!
                    </h2>
                    <p className="text-white/70 text-sm mt-1">
                      You've met the points requirement — keep an eye out for officer applications when they open!
                    </p>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
                  <div className="absolute -bottom-8 -right-2 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* National Member Status Update Section */}
          {showNationalMemberUpdate && (
            <div className="w-full max-w-7xl px-2 sm:px-4 md:px-0 mb-6">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 p-4 sm:p-6 rounded-xl shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <FaExclamationTriangle className="text-red-500 text-lg" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-red-800 text-xl sm:text-2xl font-bold mb-2">
                      Update Your Membership Status
                    </h2>
                    <p className="text-red-700 text-base sm:text-lg mb-4">
                      Please let us know if you are a national IEEE EMBS member
                      to help us provide you with the best experience.
                    </p>

                    <div className="space-y-3">
                      <FormControl component="fieldset">
                        <RadioGroup
                          value={selectedNationalStatus}
                          onChange={(e) =>
                            setSelectedNationalStatus(e.target.value)
                          }
                          sx={{
                            "& .MuiFormControlLabel-root": {
                              marginBottom: "4px",
                            },
                          }}
                        >
                          <FormControlLabel
                            value="yes"
                            control={
                              <Radio
                                sx={{
                                  color: "#dc2626",
                                  "&.Mui-checked": {
                                    color: "#dc2626",
                                  },
                                }}
                              />
                            }
                            label="Yes, I am a national IEEE EMBS member"
                            sx={{
                              "& .MuiFormControlLabel-label": {
                                fontSize: "16px",
                                color: "#7f1d1d",
                                fontWeight: "500",
                              },
                            }}
                          />
                          <FormControlLabel
                            value="no"
                            control={
                              <Radio
                                sx={{
                                  color: "#dc2626",
                                  "&.Mui-checked": {
                                    color: "#dc2626",
                                  },
                                }}
                              />
                            }
                            label="No, I am not a national IEEE EMBS member"
                            sx={{
                              "& .MuiFormControlLabel-label": {
                                fontSize: "16px",
                                color: "#7f1d1d",
                                fontWeight: "500",
                              },
                            }}
                          />
                        </RadioGroup>
                      </FormControl>

                      <div className="pt-2">
                        <button
                          onClick={updateNationalMemberStatus}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Update Status
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Major Update Section */}
          {showMajorUpdate && (
            <div className="w-full max-w-7xl px-2 sm:px-4 md:px-0 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-4 sm:p-6 rounded-xl shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-blue-800 text-xl sm:text-2xl font-bold mb-2">
                      Update Your Major
                    </h2>
                    <p className="text-blue-700 text-base sm:text-lg mb-4">
                      Please let us know your major to help us provide you with relevant information and opportunities.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                          Select your major
                        </label>
                        <select
                          value={selectedMajor}
                          onChange={(e) => setSelectedMajor(e.target.value)}
                          className="block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                        >
                          <option value="">Select your major</option>
                          {majorOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedMajor === "Other" && (
                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-2">
                            Please specify your major
                          </label>
                          <input
                            type="text"
                            value={customMajor}
                            onChange={(e) => setCustomMajor(e.target.value)}
                            className="block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your major"
                          />
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          onClick={updateMajor}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Update Major
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full max-w-7xl px-2 sm:px-4 md:px-0 mb-6">
            <div className="flex flex-col gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 sm:p-6 rounded-xl w-full shadow-sm items-start">
              <h1 className="text-[#009ca6] text-xl sm:text-2xl md:text-3xl font-bold uppercase">
                Event Check In
              </h1>
              <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed">
                Scan the QR code or enter the event code to check in and earn
                points!
              </p>
              <div className="w-full space-y-4">
                <form
                  onSubmit={handleCheckIn}
                  className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
                >
                  <div className="flex-1 sm:min-w-0">
                    <input
                      type="text"
                      placeholder="Enter event code"
                      value={eventCode}
                      onChange={(e) => setEventCode(e.target.value)}
                      className="w-full px-4 py-3 border bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#009ca6] focus:border-[#009ca6] border-gray-300 text-base"
                    />
                  </div>
                  <div className="flex gap-3 sm:flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowQRScanner(true)}
                      className="flex-1 sm:flex-none px-4 py-3 bg-[#007377] text-white rounded-lg shadow-sm hover:bg-[#005c60] focus:outline-none focus:ring-2 focus:ring-[#007377] focus:ring-offset-2 hover:cursor-pointer flex items-center justify-center gap-2 font-medium transition-colors duration-200"
                    >
                      <FaQrcode className="text-lg" />
                      <span className="sm:hidden">Scan QR Code</span>
                      <span className="hidden sm:inline">Scan QR</span>
                    </button>
                    <button
                      type="submit"
                      className="flex-1 sm:flex-none px-6 py-3 bg-[#009ca6] text-white rounded-lg shadow-sm hover:bg-[#007377] focus:outline-none focus:ring-2 focus:ring-[#009ca6] focus:ring-offset-2 hover:cursor-pointer font-medium transition-colors duration-200"
                    >
                      Check In
                    </button>
                  </div>
                </form>

                {/* QR Scanner Modal */}
                {showQRScanner && (
                  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
                      <div className="flex justify-between items-center p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#009ca6] rounded-lg">
                            <FaCamera className="text-white text-lg" />
                          </div>
                          <h3 className="text-xl font-bold text-[#009ca6]">
                            Scan QR Code
                          </h3>
                        </div>
                        <button
                          onClick={() => setShowQRScanner(false)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <svg
                            className="w-6 h-6 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="p-6">
                        <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                          <Scanner
                            onScan={(result) => handleQRScan(result)}
                            onError={handleQRError}
                            constraints={{ facingMode: "environment" }}
                            styles={{
                              container: {
                                width: "100%",
                                height: "280px",
                                borderRadius: "8px",
                              },
                            }}
                          />
                          {/* Scanning overlay */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 border-2 border-transparent">
                              <div className="absolute top-4 left-4 w-6 h-6 border-l-4 border-t-4 border-[#009ca6] rounded-tl-lg"></div>
                              <div className="absolute top-4 right-4 w-6 h-6 border-r-4 border-t-4 border-[#009ca6] rounded-tr-lg"></div>
                              <div className="absolute bottom-4 left-4 w-6 h-6 border-l-4 border-b-4 border-[#009ca6] rounded-bl-lg"></div>
                              <div className="absolute bottom-4 right-4 w-6 h-6 border-r-4 border-b-4 border-[#009ca6] rounded-br-lg"></div>
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">
                            Position the QR code within the frame to scan
                          </p>
                          <p className="text-xs text-gray-500">
                            Make sure you have good lighting and hold your
                            device steady
                          </p>
                        </div>

                        <button
                          onClick={() => setShowQRScanner(false)}
                          className="w-full mt-6 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 w-full max-w-7xl px-2 sm:px-4 md:px-0">
            {/* Left column - 2/3 width */}
            <div className="flex flex-col gap-4 w-full md:w-2/3">
              {/* Top row - 2 boxes */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-2 bg-[#c5ebec] border-2 border-[#87d7db] p-4 sm:p-6 rounded-lg w-full sm:w-1/2 min-h-[120px] items-center sm:items-start justify-center">
                  <h1 className="text-[#009ca6] text-xl sm:text-2xl md:text-3xl font-bold uppercase text-center sm:text-left">
                    Points
                  </h1>
                  {statsLoading ? (
                    <div className="flex items-center justify-center flex-1">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 rounded-2xl flex items-center justify-center shadow-lg">
                          <svg
                            className="w-8 h-8 text-[#007377] animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-[#009ca6] text-3xl sm:text-5xl md:text-8xl font-bold leading-none">
                        {userStats.points.toLocaleString()}
                      </h1>
                      {!semesterStats.loading && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {(() => {
                            const total = userStats.points;
                            const spring = semesterStats.springPoints;
                            const rawFall = semesterStats.fallPoints;
                            const remainder = Math.max(0, total - (rawFall + spring));
                            const fall = rawFall + remainder;
                            return (
                              <>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#007377]/15 border border-[#007377]/30 text-[#005a5e] text-xs font-semibold">
                                  Fall '25: {fall.toLocaleString()}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#009ca6]/15 border border-[#009ca6]/30 text-[#007377] text-xs font-semibold">
                                  Spring '26: {spring.toLocaleString()}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </>
                  )}
                  <div className="w-full h-1 bg-[#007377] rounded"></div>
                </div>
                <div className="flex flex-col gap-2 bg-[#c5ebec] border-2 border-[#87d7db] p-4 sm:p-6 rounded-lg w-full sm:w-1/2 min-h-[120px] items-center sm:items-start justify-center">
                  <h1 className="text-[#009ca6] text-xl sm:text-2xl md:text-3xl font-bold uppercase text-center sm:text-left leading-tight">
                    Events Attended
                  </h1>
                  {statsLoading ? (
                    <div className="flex items-center justify-center flex-1">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 rounded-2xl flex items-center justify-center shadow-lg">
                          <svg
                            className="w-8 h-8 text-[#007377] animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-[#009ca6] text-3xl sm:text-5xl md:text-8xl font-bold leading-none">
                        {userStats.events_attended}
                      </h1>
                      {!semesterStats.loading && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#007377]/15 border border-[#007377]/30 text-[#005a5e] text-xs font-semibold">
                            Fall '25: {semesterStats.fallEvents}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#009ca6]/15 border border-[#009ca6]/30 text-[#007377] text-xs font-semibold">
                            Spring '26: {semesterStats.springEvents}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="w-full h-1 bg-[#007377] rounded"></div>
                </div>
              </div>
              {/* Bottom box - full width of left column */}
              <div className="flex flex-col gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 sm:p-6 rounded-lg w-full min-h-[200px] items-start">
                <h1 className="text-[#009ca6] text-xl sm:text-2xl md:text-3xl font-bold uppercase">
                  Events Attended
                </h1>
                {/* Events in a responsive grid format */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3 w-full">
                  {eventsLoading ? (
                    // Loading state
                    <div className="col-span-full text-center py-12">
                      <div className="relative mx-auto mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                          <svg
                            className="w-10 h-10 text-[#007377] animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                        {/* Animated decorative dots */}
                        <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#009ca6] rounded-full opacity-60 animate-pulse"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#007377] rounded-full opacity-40 animate-pulse delay-300"></div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-[#009ca6] text-xl font-bold">
                          Loading Events
                        </h3>
                        <p className="text-gray-600 text-base leading-relaxed">
                          Fetching your attended events...
                        </p>
                      </div>
                    </div>
                  ) : eventsAttended.length > 0 ? (
                    eventsAttended.map((event, index) => (
                      <div
                        key={event.id || index}
                        className="group relative bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4 hover:from-white/60 hover:to-white/40 hover:border-white/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                      >
                        {/* Main content */}
                        <div className="flex flex-col gap-3">
                          {/* Event name */}
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-[#009ca6] text-lg sm:text-xl font-bold leading-tight group-hover:text-[#007377] transition-colors duration-200">
                              {event.name}
                            </h3>
                            {event.points && (
                              <div className="flex-shrink-0 bg-gradient-to-r from-[#009ca6] to-[#007377] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                +{event.points} pts
                              </div>
                            )}
                          </div>

                          {/* Event details */}
                          <div className="flex flex-col gap-2">
                            {event.start_time && (
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-4 h-4 text-[#007377] flex-shrink-0"
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
                                <span className="text-gray-700 text-sm font-medium">
                                  {new Date(
                                    event.start_time
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  {new Date(
                                    event.start_time
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-2">
                      <div className="relative mx-auto mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                          <svg
                            className="w-10 h-10 text-[#007377]"
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
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-[#009ca6] text-xl font-bold">
                          No Events Yet
                        </h3>
                        <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
                          Check in to your first event to see it here! Each
                          event you attend will appear with details and points
                          earned.
                        </p>
                      </div>

                      {/* Call to action hint */}
                      <div className="mt-6 inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm border border-white/40 rounded-lg px-4 py-2">
                        <svg
                          className="w-4 h-4 text-[#007377]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                        <span className="text-[#007377] text-sm font-medium">
                          Use the check-in section above to get started
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right column - 1/3 width */}
            <div className="flex flex-col gap-4 w-full md:w-1/3">
              {/* Top box */}
              <div
                className={`flex flex-col gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 sm:p-6 rounded-lg w-full items-start ${
                  selectedCareer ? "h-auto" : "min-h-[200px] md:h-auto"
                }`}
              >
                <h1 className="text-[#009ca6] text-xl sm:text-2xl md:text-3xl font-bold uppercase">
                  Favorite Careers
                </h1>
                <div
                  className={`flex flex-col gap-3 w-full ${
                    !selectedCareer
                      ? "overflow-y-auto max-h-60 md:max-h-none"
                      : ""
                  }`}
                >
                  {favoritesLoading ? (
                    <div className="text-center py-8">
                      <div className="relative mx-auto mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                          <svg
                            className="w-8 h-8 text-[#007377] animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      <p className="text-gray-600 text-base leading-relaxed">
                        Loading favorite careers...
                      </p>
                    </div>
                  ) : favoriteFields.length > 0 ? (
                    favoriteFields.map((career, index) => (
                      <div
                        key={index}
                        className={`flex items-center cursor-pointer hover:bg-[#b3e5e7] rounded-lg p-3 transition-colors duration-200 ${
                          selectedCareer?.name === career.name
                            ? "bg-[#b3e5e7] ring-2 ring-[#007377]/20"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedCareer(
                            selectedCareer?.name === career.name ? null : career
                          )
                        }
                      >
                        <IoMdHeart className="text-[#007377] text-xl sm:text-2xl mr-3 flex-shrink-0" />
                        <h1 className="text-[#009ca6] text-lg sm:text-xl md:text-2xl font-semibold leading-tight">
                          {career.name}
                        </h1>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <IoMdHeart className="text-[#007377] text-2xl" />
                      </div>
                      <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                        No favorite careers yet. Visit the Careers page to add
                        some!
                      </p>
                    </div>
                  )}
                </div>

                {/* Career Details Section */}
                {selectedCareer && (
                  <div className="mt-4 bg-white rounded-lg border border-[#87d7db] p-4 sm:p-6 w-full">
                    {selectedCareer.description && (
                      <p className="text-gray-600 text-sm sm:text-base mb-4 leading-relaxed">
                        {selectedCareer.description}
                      </p>
                    )}

                    {selectedCareer.professors &&
                      selectedCareer.professors.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-[#009ca6] font-semibold mb-3 text-sm sm:text-base">
                            Professors
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedCareer.professors.map((professor, idx) => {
                              const isString = typeof professor === "string";
                              const professorName = isString
                                ? professor
                                : professor.name;
                              const hasLinks =
                                !isString &&
                                (professor.linkedin || professor.lab);

                              return (
                                <div key={idx} className="flex flex-col gap-1">
                                  <span className="bg-[#e4e6ec] text-[#007377] px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium">
                                    {professorName}
                                  </span>
                                  {hasLinks && (
                                    <div className="flex gap-1 justify-center">
                                      {professor.linkedin && (
                                        <a
                                          href={professor.linkedin}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[#007377] hover:text-[#005c60] text-xs"
                                          title="LinkedIn"
                                        >
                                          LinkedIn
                                        </a>
                                      )}
                                      {professor.lab && (
                                        <a
                                          href={professor.lab}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[#007377] hover:text-[#005c60] text-xs"
                                          title="Lab"
                                        >
                                          Lab
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    {selectedCareer.companies &&
                      selectedCareer.companies.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-[#009ca6] font-semibold mb-3 text-sm sm:text-base">
                            Companies
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            {selectedCareer.companies.map((company, idx) => (
                              <div
                                key={idx}
                                className="bg-[#f8f9fa] p-3 rounded-lg text-xs sm:text-sm font-medium text-gray-700"
                              >
                                {company}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {selectedCareer.skills &&
                      selectedCareer.skills.length > 0 && (
                        <div>
                          <h3 className="text-[#009ca6] font-semibold mb-3 text-sm sm:text-base">
                            Required Skills
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedCareer.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="bg-[#007377] text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
              {/* Bottom box */}
              <div className="flex flex-col gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 sm:p-6 rounded-lg w-full min-h-[120px] md:h-56 items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#007377] text-xl font-bold">?</span>
                  </div>
                  <h1 className="text-[#009ca6] text-lg sm:text-xl md:text-2xl font-bold uppercase mb-2">
                    Coming Soon
                  </h1>
                  <p className="text-gray-600 text-sm">
                    More features will be added here
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-7xl px-2 sm:px-4 md:px-0 mt-8">
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto mx-auto block bg-[#96529a] hover:bg-[#772583] text-white px-6 py-3 rounded-lg cursor-pointer transition-all duration-200 font-medium shadow-lg hover:shadow-xl focus:outline-none"
            >
              <span className="flex items-center justify-center gap-2">
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
