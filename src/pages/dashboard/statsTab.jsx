import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid } from "@mui/x-data-grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { RiRobot3Line } from "react-icons/ri";
import { VscPerson } from "react-icons/vsc";

import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "../../lib/supabase";

// Center icon component for donut chart
function PieCenterLabel({ size = 32 }) {
  const { width, height, left, top } = useDrawingArea();
  const centerX = left + width / 2;
  const centerY = top + height / 2;
  return (
    <foreignObject
      x={centerX - size / 2}
      y={centerY - size / 2}
      width={size}
      height={size}
      style={{ overflow: 'visible', pointerEvents: 'none' }}
    >
      <div
        // @ts-ignore
        xmlns="http://www.w3.org/1999/xhtml"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}
      >
        <VscPerson style={{ color: 'rgba(255,255,255,0.35)', width: size, height: size }} />
      </div>
    </foreignObject>
  );
}

// Events columns
const eventsColumns = [
  {
    field: "eventName",
    headerName: "Event Name",
    flex: 2,
    align: "left",
    headerAlign: "left",
    editable: true,
  },
  {
    field: "cost",
    headerName: "Cost ($)",
    type: "number",
    flex: 1,
    align: "left",
    headerAlign: "left",
    editable: true,
    valueFormatter: (value) => {
      if (value === null || value === undefined) return "$0.00";
      return `$${Number(value).toFixed(2)}`;
    },
  },
  {
    field: "date",
    headerName: "Date",
    flex: 1,
    align: "left",
    headerAlign: "left",
    editable: true,
    valueGetter: (params) => {
      if (!params) return "No date";
      const dateStr = params.substring(0, 10); // Get "2025-10-06"
      const [year, month, day] = dateStr.split("-");
      return `${month}/${day}/${year}`;
    },
  },
  {
    field: "points",
    headerName: "Points",
    type: "number",
    flex: 1,
    align: "left",
    headerAlign: "left",
    editable: true,
  },
  {
    field: "code",
    headerName: "Code",
    flex: 1,
    align: "left",
    headerAlign: "left",
    editable: true,
  },
  {
    field: "attendees",
    headerName: "Attendees",
    type: "number",
    flex: 1,
    align: "left",
    headerAlign: "left",
    editable: false,
  },
];

// Members columns
const membersColumns = [
  {
    field: "name",
    headerName: "Name",
    flex: 1.5,
    align: "left",
    headerAlign: "left",
    editable: true,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 2,
    align: "left",
    headerAlign: "left",
    editable: true,
  },
  {
    field: "points",
    headerName: "Points",
    type: "number",
    flex: 1,
    align: "left",
    headerAlign: "left",
    editable: true,
  },
  {
    field: "national_member",
    headerName: "National Member",
    flex: 1,
    align: "left",
    headerAlign: "left",
    editable: true,
    renderCell: (params) => {
      return params.value === "yes" ? "Yes" : "No";
    },
  },
];

// Events data will be fetched from Supabase

// Major abbreviation map (case-insensitive, covers common UF EMBS member majors)
const MAJOR_ABBREVIATIONS = {
  'biomedical engineering': 'BME',
  'computer science': 'CS',
  'computer engineering': 'CpE',
  'electrical engineering': 'EE',
  'mechanical engineering': 'MechE',
  'chemical engineering': 'ChemE',
  'civil engineering': 'CivilE',
  'environmental engineering': 'EnvE',
  'aerospace engineering': 'AeroE',
  'industrial engineering': 'IndustrialE',
  'industrial and systems engineering': 'ISE',
  'materials science and engineering': 'MSE',
  'nuclear engineering': 'NucE',
  'biology': 'Bio',
  'biotechnology': 'Biotech',
  'microbiology': 'Micro',
  'biochemistry': 'Biochem',
  'chemistry': 'Chem',
  'neuroscience': 'Neuro',
};

/** Returns the abbreviation for a major name, or the original if not found */
const abbreviateMajor = (major) => {
  if (!major) return major;
  return MAJOR_ABBREVIATIONS[major.trim().toLowerCase()] || major;
};

// Helper functions for academic year filtering
const getCurrentAcademicYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed, August = 7
  if (month >= 7) return `${year}-${year + 1}`;
  return `${year - 1}-${year}`;
};

// update this in the future for setting academic year
const getAcademicYearOptions = () => {
  const current = getCurrentAcademicYear();
  const startYear = parseInt(current.split("-")[0]);
  return [
    `${startYear}-${startYear + 1}`,
  ];
};

const getDateRange = (academicYear, semester) => {
  const [startYear, endYear] = academicYear.split("-").map(Number);
  if (semester === "fall") {
    return { startDate: `${startYear}-08-01`, endDate: `${startYear}-12-31` };
  } else if (semester === "spring") {
    return { startDate: `${endYear}-01-01`, endDate: `${endYear}-07-31` };
  }
  return { startDate: `${startYear}-08-01`, endDate: `${endYear}-07-31` };
};

export default function StatsTab() {
  const [category, setCategory] = React.useState("events");
  const [membersData, setMembersData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  
  // Charts data states
  const [attendanceOverTimeData, setAttendanceOverTimeData] = useState([]);
  const [eventTypeData, setEventTypeData] = useState([]);
  const [memberCountOverTimeData, setMemberCountOverTimeData] = useState([]);
  const [selectedChart, setSelectedChart] = useState(0);
  const [majorDistributionData, setMajorDistributionData] = useState([]);
  const [showFoodLines, setShowFoodLines] = useState(true);
  const [chartHeight, setChartHeight] = useState(400);
  const chartContainerRef = useRef(null);
  const isXs = useMediaQuery('(max-width:480px)');
  const isSm = useMediaQuery('(max-width:768px)');
  const isMd = useMediaQuery('(max-width:1380px)');
  const isLg = useMediaQuery('(max-width:1540px)');
  const isXl = useMediaQuery('(max-width:1930px)');
  const pieChartSize = isXs ? 180 : isSm ? 200 : isMd ? 280 : isLg ? 320 : isXl ? 370 : 360;
  const radiusSize   = isXs ? 40  : isSm ? 50  : isMd ? 65  : isLg ? 80  : isXl ? 90  : 90;
  const [upcomingEventsPredictions, setUpcomingEventsPredictions] = useState([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  // Academic year and semester filter
  const [academicYear, setAcademicYear] = useState(getCurrentAcademicYear());
  const [selectedSemester, setSelectedSemester] = useState(null);

  const handleChange = (event) => {
    setCategory(event.target.value);
    setSelectedEventId(null); // Clear selection when switching categories
  };

  // Download attendee data for selected event
  const downloadAttendees = async (format) => {
    if (!selectedEventId) {
      alert("Please select an event to download attendance data.");
      return;
    }

    try {
      // Get attendee data for selected event
      const { data: attendanceData, error } = await supabase
        .from("event_attendance")
        .select(
          `
          event_id,
          member_id,
          members (
            first_name,
            last_name,
            email
          )
        `
        )
        .eq("event_id", selectedEventId);

      if (error) {
        console.error("Error fetching attendance data:", error);
        alert("Error fetching attendance data. Please try again.");
        return;
      }

      if (!attendanceData || attendanceData.length === 0) {
        alert("No attendance data found for the selected events.");
        return;
      }

      // Transform data for export
      const exportData = attendanceData.map((record) => ({
        name: `${record.members?.first_name || ""} ${
          record.members?.last_name || ""
        }`.trim(),
        email: record.members?.email || "",
      }));

      // Create filename with current date
      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `event_attendance_${currentDate}`;

      if (format === "CSV") {
        downloadCSV(exportData, filename);
      } else if (format === "TXT") {
        downloadTXT(exportData, filename);
      } else if (format === "EXCEL") {
        downloadExcel(exportData, filename);
      }
    } catch (error) {
      console.error("Error downloading attendance data:", error);
      alert("Error downloading attendance data. Please try again.");
    }
  };

  // Download as CSV
  const downloadCSV = (data, filename) => {
    const headers = ["Name", "Email"];
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        [`"${row.name || ""}"`, `"${row.email || ""}"`].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  // Download as TXT
  const downloadTXT = (data, filename) => {
    const txtContent = data
      .map((row) => `${row.name || ""} - ${row.email || ""}`)
      .join("\n");

    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.txt`;
    link.click();
  };

  // Download as Excel (CSV format for Excel compatibility)
  const downloadExcel = (data, filename) => {
    downloadCSV(data, filename.replace(".csv", ".xlsx"));
  };

  // Download member info (uses already-filtered membersData)
  const downloadMembers = (format) => {
    if (!membersData || membersData.length === 0) {
      alert("No member data to download.");
      return;
    }

    const semesterLabel = selectedSemester
      ? `_${selectedSemester}_${selectedSemester === "fall" ? academicYear.split("-")[0] : academicYear.split("-")[1]}`
      : `_${academicYear}`;
    const filename = `members${semesterLabel}`;

    if (format === "TXT") {
      const txtContent = membersData
        .map((m) => `${m.name || ""} | ${m.email || ""} | Points: ${m.points ?? 0} | National: ${m.national_member === "yes" ? "Yes" : "No"}`)
        .join("\n");
      const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.txt`;
      link.click();
    } else if (format === "EXCEL") {
      const headers = ["Name", "Email", "Points", "National Member"];
      const csvContent = [
        headers.join(","),
        ...membersData.map((m) =>
          [
            `"${m.name || ""}"`,
            `"${m.email || ""}"`,
            m.points ?? 0,
            `"${m.national_member === "yes" ? "Yes" : "No"}"`,
          ].join(",")
        ),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.xlsx`;
      link.click();
    }
  };

  // Fetch events data from Supabase with attendee counts
  const fetchEventsData = async () => {
    try {
      setLoadingEvents(true);
      const { startDate, endDate } = getDateRange(academicYear, selectedSemester);
      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select("id, name, date, points, code, event_type, food_present, cost")
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: false });

      if (eventsError) {
        console.error("Error fetching events:", eventsError);
        setEventsData([]);
        return;
      }

      // Batch fetch all attendance counts in a single query (instead of N+1)
      const eventIds = (events || []).map(e => e.id);
      const attendanceCountMap = {};
      if (eventIds.length > 0) {
        const { data: attendanceRows } = await supabase
          .from("event_attendance")
          .select("event_id")
          .in("event_id", eventIds);
        (attendanceRows || []).forEach(row => {
          attendanceCountMap[row.event_id] = (attendanceCountMap[row.event_id] || 0) + 1;
        });
      }

      const eventsWithAttendees = (events || []).map(event => ({
        ...event,
        eventName: event.name,
        attendees: attendanceCountMap[event.id] || 0,
      }));

      setEventsData(eventsWithAttendees);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEventsData([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Fetch members data from Supabase
  const fetchMembersData = async () => {
    try {
      setLoadingMembers(true);
      const { startDate, endDate } = getDateRange(academicYear, selectedSemester);

      const { data, error } = await supabase.rpc(
        "get_members_with_filtered_points",
        {
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate + "T23:59:59").toISOString(),
        }
      );

      if (error) {
        console.error("Error fetching members:", error);
        setMembersData([]);
      } else {
        const transformedData = (data || []).map((member) => ({
          ...member,
          name: `${member.first_name || ""} ${member.last_name || ""}`.trim(),
        }));
        setMembersData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembersData([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  // Fetch charts data
  const fetchChartsData = async () => {
    try {
      setLoadingCharts(true);
      
      // Fetch events with attendance data
      const { startDate, endDate } = getDateRange(academicYear, selectedSemester);
      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select("id, name, date, event_type, food_present")
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: true });

      if (eventsError) {
        console.error("Error fetching events for charts:", eventsError);
        return;
      }

      // Batch fetch all attendance counts in a single query (instead of N+1)
      const chartEventIds = (events || []).map(e => e.id);
      const chartAttendanceMap = {};
      if (chartEventIds.length > 0) {
        const { data: chartAttendanceRows } = await supabase
          .from("event_attendance")
          .select("event_id")
          .in("event_id", chartEventIds);
        (chartAttendanceRows || []).forEach(row => {
          chartAttendanceMap[row.event_id] = (chartAttendanceMap[row.event_id] || 0) + 1;
        });
      }

      const eventsWithAttendance = (events || []).map(event => ({
        ...event,
        attendance: chartAttendanceMap[event.id] || 0,
        date: new Date(event.date),
      }));

      // Calculate various attendance metrics
      const eventTypes = [...new Set(eventsWithAttendance.map(e => e.event_type || 'Unknown'))];
      
      // Calculate averages by event type and food presence
      const typeStats = eventTypes.reduce((acc, type) => {
        const eventsOfType = eventsWithAttendance.filter(e => (e.event_type || 'Unknown') === type);
        const foodEvents = eventsOfType.filter(e => e.food_present === true);
        const noFoodEvents = eventsOfType.filter(e => e.food_present === false);
        
        acc[type] = {
          avgWithFood: foodEvents.length > 0 
            ? Math.round(foodEvents.reduce((sum, e) => sum + e.attendance, 0) / foodEvents.length)
            : 0,
          avgWithoutFood: noFoodEvents.length > 0
            ? Math.round(noFoodEvents.reduce((sum, e) => sum + e.attendance, 0) / noFoodEvents.length)
            : 0,
          totalEvents: eventsOfType.length,
          foodEvents: foodEvents.length,
          noFoodEvents: noFoodEvents.length,
          totalAttendance: eventsOfType.reduce((sum, e) => sum + e.attendance, 0),
        };
        return acc;
      }, {});

      // Overall food vs no food stats
      const allFoodEvents = eventsWithAttendance.filter(e => e.food_present === true);
      const allNoFoodEvents = eventsWithAttendance.filter(e => e.food_present === false);
      const overallStats = {
        avgWithFood: allFoodEvents.length > 0
          ? Math.round(allFoodEvents.reduce((sum, e) => sum + e.attendance, 0) / allFoodEvents.length)
          : 0,
        avgWithoutFood: allNoFoodEvents.length > 0
          ? Math.round(allNoFoodEvents.reduce((sum, e) => sum + e.attendance, 0) / allNoFoodEvents.length)
          : 0,
      };

      // Enhanced attendance over time data
      const attendanceOverTime = eventsWithAttendance.map(event => ({
        date: event.date,
        attendance: Number(event.attendance) || 0,
        name: event.name,
        hasFood: event.food_present,
        type: event.event_type || 'Unknown',
        typeAvgWithFood: Number(typeStats[event.event_type || 'Unknown']?.avgWithFood) || 0,
        typeAvgWithoutFood: Number(typeStats[event.event_type || 'Unknown']?.avgWithoutFood) || 0,
        overallAvgWithFood: Number(overallStats.avgWithFood) || 0,
        overallAvgWithoutFood: Number(overallStats.avgWithoutFood) || 0,
      }));

      // Event type analysis data - simplified for bar chart
      const eventTypeAnalysis = Object.entries(typeStats).map(([type, stats]) => {
        const avgAttendance = stats.totalEvents > 0 
          ? Math.round(stats.totalAttendance / stats.totalEvents) 
          : 0;
        
        return {
          type: type.replace('_', ' ').toUpperCase(),
          avgAttendance: Number(avgAttendance) || 0,
          totalEvents: Number(stats.totalEvents) || 0,
          totalAttendance: Number(stats.totalAttendance) || 0,
          avgWithFood: Number(stats.avgWithFood) || 0,
          avgWithoutFood: Number(stats.avgWithoutFood) || 0,
        };
      }).filter(item => item.avgAttendance > 0); // Only show event types with attendance

      setAttendanceOverTimeData(attendanceOverTime);
      setEventTypeData(eventTypeAnalysis);

      // 4. Member count over time — real cumulative growth from members.created_at
      const { data: membersRaw, error: membersError } = await supabase
        .from("members")
        .select("created_at")
        .order("created_at", { ascending: true });

      if (!membersError && membersRaw && membersRaw.length > 0) {
        // Build cumulative count: one data point per unique date
        const countByDate = {};
        membersRaw.forEach((m) => {
          const day = m.created_at
            ? new Date(m.created_at).toISOString().split("T")[0]
            : null;
          if (day) countByDate[day] = (countByDate[day] || 0) + 1;
        });

        let cumulative = 0;
        const memberCountData = Object.entries(countByDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([day, count]) => {
            cumulative += count;
            return { date: new Date(day), memberCount: cumulative };
          });

        setMemberCountOverTimeData(memberCountData);
      } else {
        setMemberCountOverTimeData([]);
      }

    } catch (error) {
      console.error("Error fetching charts data:", error);
    } finally {
      setLoadingCharts(false);
    }
  };

  // Fetch major distribution data
  const fetchMajorData = async () => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("major")
        .not("major", "is", null);

      if (error) {
        console.error("Error fetching major data:", error);
        return;
      }

      // Count occurrences of each major
      const majorCounts = {};
      (data || []).forEach(member => {
        const major = member.major || "Unknown";
        majorCounts[major] = (majorCounts[major] || 0) + 1;
      });

      // Convert to array format for PieChart
      const totalMembers = data?.length || 0;
      const majorData = Object.entries(majorCounts).map(([major, count]) => ({
        id: major,
        value: count,
        label: major,
        percentage: totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0,
      }));

      // Sort by count descending
      majorData.sort((a, b) => b.value - a.value);
      
      setMajorDistributionData(majorData);
    } catch (error) {
      console.error("Error fetching major data:", error);
    }
  };

  // Fetch all events with AI predictions (past and future)
  const fetchUpcomingEventsPredictions = async () => {
    try {
      setLoadingPredictions(true);
      const { startDate, endDate } = getDateRange(academicYear, selectedSemester);

      const { data: events, error } = await supabase
        .from("events")
        .select("id, name, date, start_time, end_time, points, code, event_type, predicted_attendance")
        .gte("date", startDate)
        .lte("date", endDate)
        .gt("predicted_attendance", 0)
        .order("start_time", { ascending: false });

      if (error) {
        console.error("Error fetching events predictions:", error);
        setUpcomingEventsPredictions([]);
        return;
      }

      // Batch fetch actual attendance counts in a single query (instead of N+1)
      const now = new Date();
      const pastEvents = (events || []).filter(e => new Date(e.start_time) < now);
      const pastEventIds = pastEvents.map(e => e.id);
      const predAttendanceMap = {};
      if (pastEventIds.length > 0) {
        const { data: predAttendanceRows } = await supabase
          .from("event_attendance")
          .select("event_id")
          .in("event_id", pastEventIds);
        (predAttendanceRows || []).forEach(row => {
          predAttendanceMap[row.event_id] = (predAttendanceMap[row.event_id] || 0) + 1;
        });
      }

      const eventsWithActual = (events || []).map(event => {
        const isPast = new Date(event.start_time) < now;
        return {
          ...event,
          actual_attendance: isPast ? (predAttendanceMap[event.id] || 0) : null,
          is_past: isPast,
        };
      });

      setUpcomingEventsPredictions(eventsWithActual);
    } catch (error) {
      console.error("Error fetching events predictions:", error);
      setUpcomingEventsPredictions([]);
    } finally {
      setLoadingPredictions(false);
    }
  };

  // Update chart height based on container size (debounced with rAF)
  useEffect(() => {
    let rafId = null;
    const updateChartHeight = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (chartContainerRef.current && category === "charts") {
          const height = chartContainerRef.current.clientHeight;
          if (height > 0) {
            setChartHeight(Math.max(300, height - 120));
          }
        }
      });
    };

    // Initial measurement
    const timeoutId = setTimeout(updateChartHeight, 100);
    window.addEventListener('resize', updateChartHeight);
    
    // Use ResizeObserver for more accurate measurements if available
    let resizeObserver;
    if (chartContainerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateChartHeight);
      resizeObserver.observe(chartContainerRef.current);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateChartHeight);
      if (resizeObserver && chartContainerRef.current) {
        resizeObserver.unobserve(chartContainerRef.current);
      }
    };
  }, [category, selectedChart]);

  // Fetch data when component mounts or filters change
  useEffect(() => {
    if (category === "members") {
      fetchMembersData();
    } else if (category === "events") {
      fetchEventsData();
    } else if (category === "charts") {
      fetchChartsData();
      fetchMajorData();
    } else if (category === "ai-predictions") {
      fetchUpcomingEventsPredictions();
    }
  }, [category, academicYear, selectedSemester]);

  // Memoize PieChart series to avoid expensive re-computation every render
  const pieChartSeries = useMemo(() => {
    if (majorDistributionData.length === 0) return [];
    const colors = [
      '#772583', '#00629B', '#5A5A5A', '#9A7598',
      '#4A7A9A', '#8A8A8A', '#6B4A6B', '#3D7A9E',
      '#A090A8', '#5C7D8C', '#7A6B8A', '#4A6B7A',
      '#9A8A78', '#6A5A72', '#5A6B78', '#8A7A88',
    ];
    const totalMembers = majorDistributionData.reduce((sum, item) => sum + item.value, 0);
    return [{
      innerRadius: radiusSize,
      data: majorDistributionData.map((item, index) => ({
        id: item.id,
        value: item.value,
        label: abbreviateMajor(item.label),
        color: colors[index % colors.length],
      })),
      valueFormatter: ({ id, value }) => {
        const percentage = totalMembers > 0 ? Math.round((value / totalMembers) * 100) : 0;
        return `${id}, ${value} members (${percentage}%)`;
      },
      highlightScope: { fade: 'global', highlight: 'item' },
      highlighted: { additionalRadius: 2 },
      cornerRadius: 3,
      paddingAngle: 1,
    }];
  }, [majorDistributionData, radiusSize]);

  // Get current data based on selection
  const getCurrentData = () => {
    if (category === "events") {
      return {
        columns: eventsColumns,
        rows: eventsData,
        title: "UF EMBS Events",
        loading: loadingEvents,
      };
    } else if (category === "members") {
      return {
        columns: membersColumns,
        rows: membersData,
        title: "UF EMBS Members",
        loading: loadingMembers,
      };
    } else if (category === "ai-predictions") {
      return {
        title: "AI Predictions",
        loading: loadingPredictions,
      };
    } else {
      return {
        title: "UF EMBS Analytics",
        loading: loadingCharts,
      };
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden p-2 pt-19">
        <div className="bg-[#000000]/0 flex-1 flex gap-2 p-2 overflow-hidden">
          <div className="bg-[#111110] border border-white/[0.06] flex-[0.8] p-4 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-1">Admin</p>
                <h1 style={{ fontFamily: "'Lora', Georgia, serif" }}
                  className="text-2xl font-medium text-white">
                  {currentData.title}
                </h1>
              </div>
              {(category === "events" || category === "members" || category === "charts" || category === "ai-predictions") && (
                <a
                  href="https://drive.google.com/drive/folders/19__MFdwXfXCmIwoJ2Y4z2P1xdTxnjCGp?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {/* Google Drive logo */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.3 78" className="w-5 h-5 flex-shrink-0">
                    <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0a15.92 15.92 0 001.95 8z" fill="#0066da"/>
                    <path d="M43.65 25L29.9 1.2a15.4 15.4 0 00-3.3 3.3L1.95 48.55A15.92 15.92 0 000 56.5h27.5z" fill="#00ac47"/>
                    <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25a15.92 15.92 0 001.95-8H60.8l5.85 11.65z" fill="#ea4335"/>
                    <path d="M43.65 25L57.4 1.2C56.05.45 54.5 0 52.85 0H34.45c-1.65 0-3.2.45-4.55 1.2z" fill="#00832d"/>
                    <path d="M60.8 56.5H27.5L13.75 80.1c1.35.75 2.9 1.2 4.55 1.2h50.7c1.65 0 3.2-.45 4.55-1.2z" fill="#2684fc"/>
                    <path d="M73.4 26.45l-13-22.55a15.4 15.4 0 00-3.3-3.3L43.65 25l16.85 31.5H87.3a15.92 15.92 0 00-1.95-8z" fill="#ffba00"/>
                  </svg>
                  <span className="font-semibold tracking-tight">
                    <span style={{ color: '#4285F4' }}>G</span>
                    <span style={{ color: '#EA4335' }}>o</span>
                    <span style={{ color: '#FBBC05' }}>o</span>
                    <span style={{ color: '#4285F4' }}>g</span>
                    <span style={{ color: '#34A853' }}>l</span>
                    <span style={{ color: '#EA4335' }}>e</span>
                    <span style={{ color: '#111827' }}> Drive</span>
                  </span>
                </a>
              )}
            </div>
            <div className="w-full h-px bg-white/[0.07] mb-2"></div>
            <div className="flex-1 min-h-0 w-full overflow-hidden">
              {category === "ai-predictions" ? (
                <div className="h-full flex gap-3">
                  <div className="flex-[2] bg-[#141414] border border-white/[0.06] p-6 flex flex-col min-h-0">
                    {loadingPredictions ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/10 border-t-[#772583] mx-auto mb-3"></div>
                          <p className="text-white/50 text-[0.9375rem] font-light">Loading predictions…</p>
                        </div>
                      </div>
                    ) : upcomingEventsPredictions.length > 0 ? (
                      <div className="space-y-4 overflow-y-auto scrollbar-dark">
                        <div className="mb-6 flex-shrink-0 border-b border-white/[0.07] pb-5">
                          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-2">AI / ML</p>
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 bg-[#772583]/10 flex items-center justify-center border border-[#772583]/25 shrink-0">
                              <RiRobot3Line className="h-4 w-4 text-[#772583]" />
                            </div>
                            <div>
                              <h3 style={{ fontFamily: "'Lora', Georgia, serif" }} className="text-xl font-medium text-white">Predictions</h3>
                              <p className="text-white/40 text-[0.8125rem] font-light mt-1">Model output compared to actual turnout</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                        {upcomingEventsPredictions.map((event) => (
                          <div
                            key={event.id}
                            className="border border-white/[0.07] bg-[#111110] p-5 hover:border-white/[0.12] transition-colors duration-200"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <h4 style={{ fontFamily: "'Lora', Georgia, serif" }} className="text-white text-[1.0625rem] font-medium mb-3 leading-snug">{event.name}</h4>
                                <div className="grid grid-cols-2 gap-3 text-[0.8125rem] text-white/50">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-3.5 h-3.5 text-white/25 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{new Date(event.start_time).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <svg className="w-3.5 h-3.5 text-white/25 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{new Date(event.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <svg className="w-3.5 h-3.5 text-[#00629B]/80 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    <span>{event.points} points</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <svg className="w-3.5 h-3.5 text-white/25 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    <span className="uppercase tracking-wide text-[11px] font-medium text-white/45">{event.event_type?.replace('_', ' ') || 'UNKNOWN'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-shrink-0 flex flex-col gap-2">
                                {event.is_past ? (
                                  <>
                                    <div className="flex gap-2">
                                      <div className="border border-[#772583]/30 bg-[#772583]/5 p-3 min-w-[88px] text-center">
                                        <p className="text-[#772583] text-[11px] font-semibold tracking-[0.14em] uppercase mb-1">Predicted</p>
                                        <p style={{ fontFamily: "'Lora', Georgia, serif" }} className="text-2xl font-medium text-white mb-0.5">{event.predicted_attendance || 0}</p>
                                        <p className="text-white/35 text-[11px]">attendees</p>
                                      </div>
                                      <div className="border border-[#00629B]/30 bg-[#00629B]/5 p-3 min-w-[88px] text-center">
                                        <p className="text-[#00629B] text-[11px] font-semibold tracking-[0.14em] uppercase mb-1">Actual</p>
                                        <p style={{ fontFamily: "'Lora', Georgia, serif" }} className="text-2xl font-medium text-white mb-0.5">{event.actual_attendance}</p>
                                        <p className="text-white/35 text-[11px]">attendees</p>
                                      </div>
                                    </div>
                                    {(() => {
                                      const pred = event.predicted_attendance || 0;
                                      const actual = event.actual_attendance;
                                      if (pred === 0) return null;
                                      const accuracy = Math.max(0, Math.round((1 - Math.abs(actual - pred) / pred) * 100));
                                      const color = accuracy >= 80
                                        ? "text-emerald-400/90 border-emerald-400/25 bg-emerald-400/5"
                                        : accuracy >= 60
                                          ? "text-amber-400/90 border-amber-400/25 bg-amber-400/5"
                                          : "text-rose-400/90 border-rose-400/25 bg-rose-400/5";
                                      return (
                                        <div className={`border px-3 py-1.5 text-center text-[11px] font-semibold tracking-wide ${color}`}>
                                          {accuracy}% match
                                        </div>
                                      );
                                    })()}
                                  </>
                                ) : (
                                  <div className="border border-white/15 bg-[#1A1A1A] p-4 min-w-[120px] text-center">
                                    <p className="text-white/45 text-[11px] font-semibold tracking-[0.14em] uppercase mb-1">Prediction</p>
                                    <p style={{ fontFamily: "'Lora', Georgia, serif" }} className="text-3xl font-medium text-white mb-0.5">{event.predicted_attendance || 0}</p>
                                    <p className="text-white/35 text-[11px]">attendees</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center px-4">
                          <div className="text-white/20 mb-4">
                            <svg className="mx-auto h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <p style={{ fontFamily: "'Lora', Georgia, serif" }} className="text-white text-lg font-medium mb-2">No predictions yet</p>
                          <p className="text-white/40 text-[0.8125rem] font-light">Run the model on events with prediction fields to populate this list.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-[1] bg-[#141414] border border-white/[0.06] p-6 flex flex-col justify-center min-h-0 overflow-y-auto scrollbar-dark">
                    <div className="text-center max-w-[240px] mx-auto">
                      <div className="w-14 h-14 bg-[#00629B]/10 flex items-center justify-center border border-[#00629B]/25 mx-auto mb-5">
                        <svg className="w-7 h-7 text-[#00629B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00629B] mb-2">Roadmap</p>
                      <h3 style={{ fontFamily: "'Lora', Georgia, serif" }} className="text-white text-xl font-medium mb-2">More AI tools</h3>
                      <p className="text-white/40 text-[0.8125rem] font-light mb-6">Coming soon</p>
                      <div className="space-y-2.5 text-left border-t border-white/[0.07] pt-5">
                        {['Attendance trend analysis', 'Optimal event timing', 'Member engagement insights'].map((label) => (
                          <div key={label} className="flex items-start gap-2.5 text-white/50 text-[0.8125rem]">
                            <svg className="w-3.5 h-3.5 text-[#772583]/70 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-light">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : category === "charts" ? (
                <div className="h-full flex gap-3">
                    <div className="flex-[2] bg-[#141414] border border-white/[0.06] p-6 flex flex-col min-h-0">
                    <Tabs
                      value={selectedChart}
                      onChange={(e, newValue) => setSelectedChart(newValue)}
                      sx={{
                        mb: 3,
                        flexShrink: 0,
                        fontFamily: "'Inter', sans-serif",
                        '& .MuiTab-root': {
                          color: 'rgba(255,255,255,0.4)',
                          fontSize: '13px',
                          fontWeight: 500,
                          textTransform: 'none',
                          minHeight: '44px',
                          transition: 'color 0.2s ease',
                          '&.Mui-selected': {
                            color: '#ffffff',
                            fontWeight: 600,
                          },
                          '&:hover': {
                            color: 'rgba(255,255,255,0.7)',
                          },
                        },
                        '& .MuiTabs-indicator': {
                          backgroundColor: '#772583',
                          height: '2px',
                        },
                      }}
                    >
                      <Tab label="Event Attendance Trends" />
                      <Tab label="Event Type Analysis" />
                      <Tab label="Member Growth" />
                    </Tabs>

                    <div ref={chartContainerRef} className="flex-1 relative bg-[#111110] border border-white/[0.07] min-h-0">
                      {selectedChart === 0 && (
                        <div className="absolute inset-0 flex flex-col">
                          <div className="mb-3 mt-3 flex justify-between gap-3 px-4">
                            <div className="border border-[#772583]/25 bg-[#772583]/5 p-3 flex-1">
                              <h3 className="text-white/45 text-[11px] font-semibold mb-1.5 uppercase tracking-[0.14em]">Avg. with food</h3>
                              <p style={{ fontFamily: "'Lora', Georgia, serif" }} className="text-xl font-medium text-[#772583]">
                                {attendanceOverTimeData[0]?.overallAvgWithFood || 0}
                              </p>
                            </div>
                            <div className="border border-[#00629B]/25 bg-[#00629B]/5 p-3 flex-1">
                              <h3 className="text-white/45 text-[11px] font-semibold mb-1.5 uppercase tracking-[0.14em]">Avg. without food</h3>
                              <p style={{ fontFamily: "'Lora', Georgia, serif" }} className="text-xl font-medium text-[#6B9FC4]">
                                {attendanceOverTimeData[0]?.overallAvgWithoutFood || 0}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={() => setShowFoodLines(!showFoodLines)}
                                className={`max-w-28 px-3 py-2 border text-[11px] font-semibold tracking-wide transition-colors duration-200 cursor-pointer ${
                                  showFoodLines
                                    ? 'border-white/20 text-white/70 hover:border-white/35 bg-white/[0.04]'
                                    : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/60'
                                }`}
                              >
                                {showFoodLines ? 'Hide food lines' : 'Show food lines'}
                              </button>
                            </div>
                          </div>
                          <div className="flex-1 relative min-h-0">
                            <LineChart
                              xAxis={[{
                                dataKey: 'date',
                                scaleType: 'time',
                                valueFormatter: (value) => value ? new Date(value).toLocaleDateString() : '',
                                tickLabelStyle: { fill: 'rgba(255,255,255,0.65)', fontSize: 11 },
                                axisLine: { stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 },
                                tickLine: { stroke: 'rgba(255,255,255,0.15)' },
                              }]}
                              yAxis={[{
                                tickLabelStyle: { fill: 'rgba(255,255,255,0.65)', fontSize: 11 },
                                axisLine: { stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 },
                                tickLine: { stroke: 'rgba(255,255,255,0.15)' },
                              }]}
                              series={[
                                {
                                  dataKey: 'attendance',
                                  label: 'Event Attendance',
                                  color: '#772583',
                                  showMark: true,
                                  curve: 'linear',
                                  strokeWidth: 2.5,
                                  valueFormatter: (value, ctx) => {
                                    if (!ctx || !attendanceOverTimeData || !attendanceOverTimeData[ctx.index]) return `${value} attendees`;
                                    const point = attendanceOverTimeData[ctx.index];
                                    return `${point.name || 'Unknown Event'}\n${value} attendees\n${point.type || 'Unknown Type'}\n${point.hasFood ? 'Food Provided' : 'No Food'}`;
                                  },
                                },
                                ...(showFoodLines ? [
                                  {
                                    dataKey: 'overallAvgWithFood',
                                    label: 'Avg. with Food',
                                    color: '#00629B',
                                    showMark: false,
                                    curve: 'linear',
                                    strokeWidth: 2,
                                    strokeDasharray: '6 4',
                                    valueFormatter: (value) => `${value} avg. attendees (with food)`,
                                  },
                                  {
                                    dataKey: 'overallAvgWithoutFood',
                                    label: 'Avg. without Food',
                                    color: '#8A8A8A',
                                    showMark: false,
                                    curve: 'linear',
                                    strokeWidth: 2,
                                    strokeDasharray: '6 4',
                                    valueFormatter: (value) => `${value} avg. attendees (no food)`,
                                  }
                                ] : [])
                              ]}
                              dataset={attendanceOverTimeData}
                              height={chartHeight}
                              margin={{ left: 60, right: 60, top: 40, bottom: 40 }}
                              slotProps={{
                                legend: {
                                  direction: 'row',
                                  position: { vertical: 'top', horizontal: 'middle' },
                                  padding: 0,
                                },
                              }}
                              sx={{
                                width: '100%',
                                '& .MuiChartsLegend-root': {
                                  fill: 'rgba(255,255,255,0.75)',
                                },
                                '& .MuiChartsLegend-mark': {
                                  fill: 'rgba(255,255,255,0.75)',
                                },
                                '& .MuiChartsLegend-label': {
                                  fill: 'rgba(255,255,255,0.75) !important',
                                  color: 'rgba(255,255,255,0.75) !important',
                                  fontSize: '12px',
                                },
                                '& .MuiChartsAxis-line': {
                                  stroke: 'rgba(255,255,255,0.75) !important',
                                },
                                '& .MuiChartsAxis-tick': {
                                  stroke: 'rgba(255,255,255,0.75) !important',
                                },
                                '& .MuiChartsAxis-root': {
                                  '& .MuiChartsAxis-line': {
                                    stroke: 'rgba(255,255,255,0.75) !important',
                                  },
                                  '& .MuiChartsAxis-tick': {
                                    stroke: 'rgba(255,255,255,0.75) !important',
                                  },
                                },
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {selectedChart === 1 && (
                        <div className="absolute inset-0 flex flex-col">
                          <div className="mb-3 mt-3 flex justify-between gap-3 px-4">
                            <div className="border border-[#772583]/25 bg-[#772583]/5 p-3 flex-1 min-w-0">
                              <h3 className="text-white/45 text-[11px] font-semibold mb-1.5 uppercase tracking-[0.14em]">Most popular</h3>
                              <p style={{ fontFamily: "'Lora', Georgia, serif" }} className="text-xl font-medium text-[#772583] truncate">
                                {eventTypeData.length > 0 ? eventTypeData.reduce((max, type) =>
                                  type.avgAttendance > max.avgAttendance ? type : max
                                ).type : 'None'}
                              </p>
                            </div>
                            <div className="border border-[#00629B]/25 bg-[#00629B]/5 p-3 flex-1">
                              <h3 className="text-white/45 text-[11px] font-semibold mb-1.5 uppercase tracking-[0.14em]">Total types</h3>
                              <p style={{ fontFamily: "'Lora', Georgia, serif" }} className="text-xl font-medium text-[#6B9FC4]">
                                {eventTypeData.length}
                              </p>
                            </div>
                          </div>
                          <div className="flex-1 relative min-h-0">
                            {eventTypeData.length > 0 ? (
                              <BarChart
                              xAxis={[{
                                dataKey: 'type',
                                scaleType: 'band',
                                tickLabelStyle: { fill: 'rgba(255,255,255,0.65)', fontSize: 11 },
                                axisLine: { stroke: 'rgba(255,255,255,0.75)', strokeWidth: 1 },
                                tickLine: { stroke: 'rgba(255,255,255,0.75)' },
                              }]}
                              yAxis={[{
                                tickLabelStyle: { fill: 'rgba(255,255,255,0.65)', fontSize: 11 },
                                axisLine: { stroke: 'rgba(255,255,255,0.75)', strokeWidth: 1 },
                                tickLine: { stroke: 'rgba(255,255,255,0.75)' },
                              }]}
                                series={[{
                                  dataKey: 'avgAttendance',
                                  label: 'Average Attendance',
                                  color: '#772583',
                                  valueFormatter: (value) => `${value} attendees`,
                                }]}
                                dataset={eventTypeData}
                                height={chartHeight}
                                margin={{ left: 60, right: 60, top: 40, bottom: 40 }}
                                slotProps={{
                                  legend: {
                                    direction: 'row',
                                    position: { vertical: 'top', horizontal: 'middle' },
                                    padding: 0,
                                  },
                                }}
                                sx={{
                                  width: '100%',
                                  '& .MuiChartsLegend-root': {
                                    fill: 'rgba(255,255,255,0.85)',
                                  },
                                  '& .MuiChartsLegend-mark': {
                                    fill: 'rgba(255,255,255,0.85)',
                                  },
                                  '& .MuiChartsLegend-label': {
                                    fill: 'rgba(255,255,255,0.85) !important',
                                    color: 'rgba(255,255,255,0.85) !important',
                                    fontSize: '12px',
                                  },
                                  '& .MuiChartsAxis-line': {
                                    stroke: 'rgba(255,255,255,0.75)',
                                  },
                                  '& .MuiChartsAxis-tick': {
                                    stroke: 'rgba(255,255,255,0.75)',
                                  },
                                }}
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <div className="text-center px-4">
                                  <p style={{ fontFamily: "'Lora', Georgia, serif" }} className="text-white text-lg font-medium mb-2">No event data</p>
                                  <p className="text-white/40 text-[0.8125rem] font-light">Add events with attendance to populate this chart.</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedChart === 2 && (
                        <div className="absolute inset-0 flex flex-col">
                          <div className="flex-1 relative min-h-0">
                            <LineChart
                              xAxis={[{
                                dataKey: 'date',
                                scaleType: 'time',
                                valueFormatter: (value) => value ? new Date(value).toLocaleDateString() : '',
                                tickLabelStyle: { fill: 'rgba(255,255,255,0.65)', fontSize: 11 },
                                axisLine: { stroke: 'rgba(255,255,255,0.75)', strokeWidth: 1 },
                                tickLine: { stroke: 'rgba(255,255,255,0.75)' },
                              }]}
                              yAxis={[{
                                tickLabelStyle: { fill: 'rgba(255,255,255,0.65)', fontSize: 11 },
                                axisLine: { stroke: 'rgba(255,255,255,0.75)', strokeWidth: 1 },
                                tickLine: { stroke: 'rgba(255,255,255,0.75)' },
                              }]}
                              series={[{
                                dataKey: 'memberCount',
                                label: 'Total Members',
                                color: '#772583',
                                showMark: true,
                                curve: 'linear',
                                strokeWidth: 2.5,
                                valueFormatter: (value) => `${value} members`,
                              }]}
                              dataset={memberCountOverTimeData}
                              height={chartHeight}
                              margin={{ left: 60, right: 60, top: 40, bottom: 40 }}
                              slotProps={{
                                legend: {
                                  direction: 'row',
                                  position: { vertical: 'top', horizontal: 'middle' },
                                  padding: 0,
                                },
                              }}
                              sx={{
                                width: '100%',
                                '& .MuiChartsLegend-root': {
                                  fill: 'rgba(255,255,255,0.85)',
                                },
                                '& .MuiChartsLegend-mark': {
                                  fill: 'rgba(255,255,255,0.85)',
                                },
                                '& .MuiChartsLegend-label': {
                                  fill: 'rgba(255,255,255,0.85) !important',
                                  color: 'rgba(255,255,255,0.85) !important',
                                  fontSize: '12px',
                                },
                                '& .MuiChartsAxis-line': {
                                  stroke: 'rgba(255,255,255,0.75) !important',
                                },
                                '& .MuiChartsAxis-tick': {
                                  stroke: 'rgba(255,255,255,0.75) !important',
                                },
                                '& .MuiChartsAxis-root': {
                                  '& .MuiChartsAxis-line': {
                                    stroke: 'rgba(255,255,255,0.75) !important',
                                  },
                                  '& .MuiChartsAxis-tick': {
                                    stroke: 'rgba(255,255,255,0.75) !important',
                                  },
                                },
                              }}
                            />
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  <div className="flex-[1] bg-[#141414] border border-white/[0.06] px-5 py-6 flex flex-col overflow-y-auto scrollbar-dark min-h-0">
                    <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00629B] mb-2 text-center">Analytics</p>
                    <h3 style={{ fontFamily: "'Lora', Georgia, serif" }} className="text-white text-lg font-medium mb-4 text-center">Major distribution</h3>
                    <div className="flex-1 flex items-center justify-center">
                      {majorDistributionData.length > 0 ? (
                        <PieChart
                          series={pieChartSeries}
                          width={pieChartSize}
                          height={pieChartSize}
                          slotProps={{
                            legend: {
                              direction: 'row',
                              position: { vertical: 'bottom', horizontal: 'middle' },
                              padding: 0,
                              itemMarkWidth: 12,
                              itemMarkHeight: 12,
                              markGap: 5,
                              itemGap: 12,
                            },
                          }}
                          sx={{
                            '& .MuiChartsLegend-root': {
                              fill: 'rgba(255,255,255,0.85)',
                              transform: 'translateY(26px)',
                            },
                            '& .MuiChartsLegend-mark': {
                              fill: 'rgba(255,255,255,0.85)',
                            },
                            '& .MuiChartsLegend-label': {
                              fill: 'rgba(255,255,255,0.85) !important',
                              fontSize: '11px',
                              color: 'rgba(255,255,255,0.85) !important',
                              '@media (min-width: 1280px)': {
                                fontSize: '10px',
                              },
                              '@media (min-width: 1380px)': {
                                fontSize: '12px',
                              },
                              '@media (min-width: 1480px)': {
                                fontSize: '14px',
                              },
                              '@media (min-width: 1680px)': {
                                fontSize: '18px',
                              },
                            },
                          }}
                        >
                          <PieCenterLabel size={Math.round(pieChartSize * 32 / 100)} />
                        </PieChart>
                      ) : (
                        <div className="text-center px-2">
                          <p style={{ fontFamily: "'Lora', Georgia, serif" }} className="text-white text-lg font-medium mb-2">No major data</p>
                          <p className="text-white/40 text-[0.8125rem] font-light">Members can set a major on the member dashboard to fill this chart.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
              <DataGrid
                rows={currentData.rows || []}
                columns={currentData.columns || []}
                loading={currentData.loading}
                disableMultipleSelection
                disableRowSelectionOnClick={false}
                onRowClick={(params) => {
                  if (category === "events") {
                    setSelectedEventId(params.id);
                  }
                }}
                selectionModel={selectedEventId ? [selectedEventId] : []}
                hideFooterSelectedRowCount
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 30, page: 0 },
                  },
                }}
                pageSizeOptions={[30, 50, 100]}
                sx={{
                  height: "100%",
                  width: "100%",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "white",
                  "& .MuiDataGrid-virtualScroller": {
                    overflowY: "auto",
                    backgroundColor: "transparent",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#6877FF",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    color: "black",
                  },
                  "& .MuiDataGrid-row": {
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(40, 40, 40, 0.4)",
                      "&:hover": {
                        backgroundColor: "rgba(100, 100, 100, 0.4)",
                      },
                    },
                  },

                  "& .MuiDataGrid-cell": {
                    color: "white",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "& .MuiTablePagination-displayedRows": {
                    color: "rgb(255, 255, 255)",
                  },
                  "& .MuiTablePagination-actions": {
                    color: "rgb(255, 255, 255)",
                  },
                  "& .MuiTablePagination-selectLabel": {
                    color: "rgb(255, 255, 255)",
                  },
                  "& .MuiTablePagination-actions svg": {
                    color: "rgb(255, 255, 255)",
                  },
                  "& .MuiTablePagination-select": {
                    color: "rgb(255, 255, 255)",
                  },
                  "& .MuiDataGrid-selectedRowCount": {
                    color: "rgb(255, 255, 255)",
                  },
                  "& .MuiSelect-icon": {
                    color: "rgb(255, 255, 255)",
                  },
                  "& .MuiCheckbox-root": {
                    color: "rgb(255, 255, 255)",
                  },
                  "& .MuiCheckbox-root.Mui-checked": {
                    color: "#836BFF",
                  },
                  "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
                    color: "#666666",
                  },
                  "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root.Mui-checked":
                    {
                      color: "#666666",
                    },
                }}
              />
              )}
            </div>
          </div>
          {/* RIGHT SIDEBAR */}
          <div className="bg-[#111110] border border-white/[0.06] flex-[0.2] p-4 space-y-5 overflow-y-auto scrollbar-dark">
            {/* Filter Section */}
            <div className="mt-2">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-1">Filter</p>
              <h2 className="text-[0.9375rem] font-medium text-white mb-3">Category</h2>
              <div className="w-full h-px bg-white/[0.07] mb-4"></div>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel
                    id="category-select-label"
                    sx={{
                      color: "white",
                      "&.Mui-focused": {
                        color: "white",
                      },
                    }}
                  >
                    Category
                  </InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={category}
                    label="Category"
                    onChange={handleChange}
                    sx={{
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      "& .MuiSelect-icon": {
                        color: "white",
                      },
                    }}
                  >
                    <MenuItem value="events">Events</MenuItem>
                    <MenuItem value="members">Members</MenuItem>
                    <MenuItem value="charts">Charts</MenuItem>
                    <MenuItem value="ai-predictions">AI Predictions</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>

            {/* Academic Year Filter */}
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00629B] mb-1">Filter</p>
              <h2 className="text-[0.9375rem] font-medium text-white mb-3">Academic Year</h2>
              <div className="w-full h-px bg-white/[0.07] mb-4"></div>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel
                    id="academic-year-label"
                    sx={{
                      color: "white",
                      "&.Mui-focused": {
                        color: "white",
                      },
                    }}
                  >
                    Year
                  </InputLabel>
                  <Select
                    labelId="academic-year-label"
                    id="academic-year-select"
                    value={academicYear}
                    label="Year"
                    onChange={(e) => setAcademicYear(e.target.value)}
                    sx={{
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      "& .MuiSelect-icon": {
                        color: "white",
                      },
                    }}
                  >
                    {getAcademicYearOptions().map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Semester Radio Group */}
              <div className="mt-4">
                <FormControl component="fieldset">
                  <RadioGroup
                    value={selectedSemester || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedSemester(value === selectedSemester ? null : value);
                    }}
                  >
                    <FormControlLabel
                      value="spring"
                      control={
                        <Radio
                          sx={{
                            color: "rgba(255,255,255,0.5)",
                            "&.Mui-checked": { color: "#8ed8f8" },
                          }}
                          onClick={() => {
                            if (selectedSemester === "spring") setSelectedSemester(null);
                          }}
                        />
                      }
                      label={
                        <span className="text-white text-sm">
                          Spring {academicYear.split("-")[1]}
                        </span>
                      }
                    />
                    <FormControlLabel
                      value="fall"
                      control={
                        <Radio
                          sx={{
                            color: "rgba(255,255,255,0.5)",
                            "&.Mui-checked": { color: "#8ed8f8" },
                          }}
                          onClick={() => {
                            if (selectedSemester === "fall") setSelectedSemester(null);
                          }}
                        />
                      }
                      label={
                        <span className="text-white text-sm">
                          Fall {academicYear.split("-")[0]}
                        </span>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>

            {/* Download Section - Only show for Events */}
            {category === "events" && (
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-1">Export</p>
                <h2 className="text-[0.9375rem] font-medium text-white mb-3">Download Attendance</h2>
                <div className="w-full h-px bg-white/[0.07] mb-4"></div>
                <div className="space-y-3">
                  <button onClick={() => downloadAttendees("TXT")}
                    className="w-full px-4 py-2 border border-white/10 hover:border-white/30 text-white/50 hover:text-white text-[0.8125rem] font-medium tracking-wide transition-colors duration-200 cursor-pointer">
                    TXT
                  </button>
                  <button onClick={() => downloadAttendees("EXCEL")}
                    className="w-full px-4 py-2 border border-white/10 hover:border-white/30 text-white/50 hover:text-white text-[0.8125rem] font-medium tracking-wide transition-colors duration-200 cursor-pointer">
                    EXCEL
                  </button>
                </div>
              </div>
            )}

            {/* Download Members - Only show for Members */}
            {category === "members" && (
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-1">Export</p>
                <h2 className="text-[0.9375rem] font-medium text-white mb-3">Download Members</h2>
                <div className="w-full h-px bg-white/[0.07] mb-4"></div>
                <div className="space-y-3">
                  <button onClick={() => downloadMembers("TXT")}
                    className="w-full px-4 py-2 border border-white/10 hover:border-white/30 text-white/50 hover:text-white text-[0.8125rem] font-medium tracking-wide transition-colors duration-200 cursor-pointer">
                    TXT
                  </button>
                  <button onClick={() => downloadMembers("EXCEL")}
                    className="w-full px-4 py-2 border border-white/10 hover:border-white/30 text-white/50 hover:text-white text-[0.8125rem] font-medium tracking-wide transition-colors duration-200 cursor-pointer">
                    EXCEL
                  </button>
                </div>
              </div>
            )}

            {/* Extra Stats Section - Only show for Members */}
            {category === "members" && (
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00629B] mb-1">Overview</p>
                <h2 className="text-[0.9375rem] font-medium text-white mb-3">Extra Stats</h2>
                <div className="w-full h-px bg-white/[0.07] mb-4"></div>
                <div className="space-y-3">
                  <div className="border border-white/[0.07] p-3">
                    <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/30 mb-1">Total Members</div>
                    <div className="text-2xl font-medium text-white" style={{ fontFamily: "'Lora', Georgia, serif" }}>{membersData.length}</div>
                  </div>
                  <div className="border border-white/[0.07] p-3">
                    <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/30 mb-1">National Members</div>
                    <div className="text-2xl font-medium text-white" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                      {membersData.filter((m) => m.national_member === "yes").length}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Charts Info Section - Only show for Charts */}
            {category === "charts" && (
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00629B] mb-1">Overview</p>
                <h2 className="text-[0.9375rem] font-medium text-white mb-3">Analytics</h2>
                <div className="w-full h-px bg-white/[0.07] mb-4"></div>
                <div className="space-y-3">
                  {[
                    { label: "Total Events", value: attendanceOverTimeData.length },
                    { label: "Total Attendance", value: attendanceOverTimeData.reduce((s, e) => s + e.attendance, 0) },
                    { label: "Avg. Attendance", value: attendanceOverTimeData.length > 0 ? Math.round(attendanceOverTimeData.reduce((s, e) => s + e.attendance, 0) / attendanceOverTimeData.length) : 0 },
                  ].map(({ label, value }) => (
                    <div key={label} className="border border-white/[0.07] p-3">
                      <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/30 mb-1">{label}</div>
                      <div className="text-2xl font-medium text-white" style={{ fontFamily: "'Lora', Georgia, serif" }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Predictions Info Section */}
            {category === "ai-predictions" && (
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-1">AI</p>
                <h2 className="text-[0.9375rem] font-medium text-white mb-3">Predictions Overview</h2>
                <div className="w-full h-px bg-white/[0.07] mb-4"></div>
                <div className="space-y-3">
                  {[
                    { label: "Events w/ Predictions", value: upcomingEventsPredictions.length },
                    { label: "Avg. Predicted", value: upcomingEventsPredictions.length > 0 ? Math.round(upcomingEventsPredictions.reduce((s, e) => s + (e.predicted_attendance || 0), 0) / upcomingEventsPredictions.length) : 0 },
                    { label: "Total Predicted", value: upcomingEventsPredictions.reduce((s, e) => s + (e.predicted_attendance || 0), 0) },
                  ].map(({ label, value }) => (
                    <div key={label} className="border border-white/[0.07] p-3">
                      <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/30 mb-1">{label}</div>
                      <div className="text-2xl font-medium text-white" style={{ fontFamily: "'Lora', Georgia, serif" }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
