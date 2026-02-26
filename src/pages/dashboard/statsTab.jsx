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
        <VscPerson style={{ color: 'rgba(255,255,255,0.85)', width: size, height: size }} />
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
      '#E4E4DE', '#C4C5BA', '#8AA5C4', '#D9B18E',
      '#C79AA9', '#8B7B6A', '#2F3A4A', '#A9B3C2',
      '#B8C9A3', '#D4C5A9', '#7A8FA6', '#C2A8BF',
      '#A3B8B0', '#D6B89A', '#6E7B8B', '#BDB5A6',
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
        return `${id} — ${value} members (${percentage}%)`;
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
    <div className="mx-auto">
      <div className="h-[calc(100vh-6.5rem)] flex flex-col overflow-hidden p-2">
        <div className="bg-[#000000]/0 rounded-xl flex-1 flex gap-3 p-2 overflow-hidden">
          <div className="bg-[#000000]/50 flex-[0.8] rounded-3xl p-4 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <h1 className="text-4xl font-bold italic text-[#8ed8f8]">
                {currentData.title}
              </h1>
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
            <div className="w-full h-px bg-white mb-2"></div>
            <div className="flex-1 min-h-0 w-full overflow-hidden">
              {category === "ai-predictions" ? (
                <div className="h-full flex gap-4">
                  {/* Left side - Predictions List (2/3 width) */}
                  <div className="flex-[2] bg-gradient-to-br from-gray-900/50 to-gray-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col min-h-0">
                    {loadingPredictions ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                          <p className="text-white text-lg">Loading predictions...</p>
                        </div>
                      </div>
                    ) : upcomingEventsPredictions.length > 0 ? (
                      <div className="space-y-4 overflow-y-auto scrollbar-dark">
                        <div className="mb-6 flex-shrink-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center border border-white/30">
                              <RiRobot3Line className="h-5 w-5 text-white"/>
                            </div>
                            <h3 className="text-white text-2xl font-semibold">AI Predictions</h3>
                          </div>
                          <p className="text-gray-400 text-sm ml-[52px]">Machine learning predictions vs actual attendance</p>
                        </div>
                        <div className="space-y-3">
                        {upcomingEventsPredictions.map((event) => (
                          <div
                            key={event.id}
                            className="bg-gradient-to-br from-gray-800/50 to-gray-900/40 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all duration-200 hover:shadow-lg"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="text-white text-lg font-semibold mb-3">{event.name}</h4>
                                <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
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
                                      {new Date(event.start_time).toLocaleDateString()}
                                    </span>
                                  </div>
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
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    <span>
                                      {new Date(event.start_time).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
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
                                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                      />
                                    </svg>
                                    <span className="uppercase font-medium">{event.event_type?.replace('_', ' ') || 'UNKNOWN'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-shrink-0 flex flex-col gap-2">
                                {event.is_past ? (
                                  <>
                                    <div className="flex gap-2">
                                      <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/30 rounded-xl p-3 min-w-[90px] text-center shadow-lg">
                                        <p className="text-gray-300 text-xs font-medium mb-1 uppercase tracking-wide">Predicted</p>
                                        <p className="text-2xl font-bold text-white mb-1">{event.predicted_attendance || 0}</p>
                                        <p className="text-gray-400 text-xs">attendees</p>
                                      </div>
                                      <div className="bg-gradient-to-br from-[#8ed8f8]/20 to-[#8ed8f8]/10 backdrop-blur-sm border border-[#8ed8f8]/30 rounded-xl p-3 min-w-[90px] text-center shadow-lg">
                                        <p className="text-[#8ed8f8] text-xs font-medium mb-1 uppercase tracking-wide">Actual</p>
                                        <p className="text-2xl font-bold text-white mb-1">{event.actual_attendance}</p>
                                        <p className="text-gray-400 text-xs">attendees</p>
                                      </div>
                                    </div>
                                    {/* Accuracy badge */}
                                    {(() => {
                                      const pred = event.predicted_attendance || 0;
                                      const actual = event.actual_attendance;
                                      if (pred === 0) return null;
                                      const accuracy = Math.max(0, Math.round((1 - Math.abs(actual - pred) / pred) * 100));
                                      const color = accuracy >= 80 ? "text-green-400 border-green-400/30 bg-green-400/10" : accuracy >= 60 ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" : "text-red-400 border-red-400/30 bg-red-400/10";
                                      return (
                                        <div className={`border rounded-lg px-3 py-1.5 text-center text-xs font-semibold ${color}`}>
                                          {accuracy}% accurate
                                        </div>
                                      );
                                    })()}
                                  </>
                                ) : (
                                  <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/30 rounded-xl p-4 min-w-[120px] text-center shadow-lg">
                                    <p className="text-gray-300 text-xs font-medium mb-1 uppercase tracking-wide">Prediction</p>
                                    <p className="text-3xl font-bold text-white mb-1">{event.predicted_attendance || 0}</p>
                                    <p className="text-gray-400 text-xs">attendees</p>
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
                        <div className="text-center">
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
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                              />
                            </svg>
                          </div>
                          <p className="text-white text-lg mb-2">No Events with Predictions</p>
                          <p className="text-gray-400 text-sm">Run the AI model on events to see predictions here</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right side - Coming Soon (1/3 width) */}
                  <div className="flex-[1] bg-gradient-to-br from-gray-900/50 to-gray-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center border border-white/30 mx-auto mb-6">
                        <svg
                          className="w-10 h-10 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-white text-2xl font-semibold mb-3">More Cool AI Features</h3>
                      <p className="text-gray-400 text-lg mb-6">Coming Soon</p>
                      <div className="mt-6 space-y-3 text-left">
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Attendance trend analysis</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Optimal event timing suggestions</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Member engagement insights</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : category === "charts" ? (
                <div className="h-full flex gap-4">
                  {/* Left side - Charts (2/3 width) */}
                    <div className="flex-[2] bg-gradient-to-br from-gray-900/50 to-gray-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col min-h-0">
                    {/* Chart Selection Tabs */}
                    <Tabs
                      value={selectedChart}
                      onChange={(e, newValue) => setSelectedChart(newValue)}
                      sx={{
                        mb: 4,
                        flexShrink: 0,
                        '& .MuiTab-root': {
                          color: 'rgba(255,255,255,0.5)',
                          fontSize: '14px',
                          fontWeight: '500',
                          textTransform: 'none',
                          minHeight: '48px',
                          transition: 'color 0.2s ease',
                          '&.Mui-selected': {
                            color: 'white',
                            fontWeight: '600',
                          },
                          '&:hover': {
                            color: 'rgba(255,255,255,0.75)',
                          },
                        },
                        '& .MuiTabs-indicator': {
                          backgroundColor: 'white',
                          height: '2px',
                          borderRadius: '1px',
                        },
                      }}
                    >
                      <Tab label="Event Attendance Trends" />
                      <Tab label="Event Type Analysis" />
                      <Tab label="Member Growth" />
                    </Tabs>

                    {/* Chart Container */}
                    <div ref={chartContainerRef} className="flex-1 relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] rounded-2xl border border-white/10 min-h-0 backdrop-blur-sm">
                      {selectedChart === 0 && (
                        <div className="absolute inset-0 flex flex-col">
                          <div className="mb-3 mt-3 flex justify-between gap-3 px-4">
                            <div className="bg-gradient-to-br from-[#c4b5fd]/20 to-[#c4b5fd]/8 backdrop-blur-sm border border-[#c4b5fd]/30 p-3 rounded-xl flex-1 shadow-sm">
                              <h3 className="text-white/90 text-xs font-medium mb-1.5 uppercase tracking-wide">Avg. with Food</h3>
                              <p className="text-xl font-semibold text-[#e9d5ff]">
                                {attendanceOverTimeData[0]?.overallAvgWithFood || 0}
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-[#06b6d4]/20 to-[#06b6d4]/8 backdrop-blur-sm border border-[#06b6d4]/30 p-3 rounded-xl flex-1 shadow-sm">
                              <h3 className="text-white/90 text-xs font-medium mb-1.5 uppercase tracking-wide">Avg. without Food</h3>
                              <p className="text-xl font-semibold text-[#67e8f9]">
                                {attendanceOverTimeData[0]?.overallAvgWithoutFood || 0}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <button
                                onClick={() => setShowFoodLines(!showFoodLines)}
                                className={`max-w-24 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                  showFoodLines 
                                    ? 'bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/8 border border-[#10b981]/30 text-white/85 hover:border-[#10b981]/40 hover:cursor-pointer' 
                                    : 'bg-gradient-to-br from-gray-700/20 to-gray-800/10 border border-gray-600/20 text-gray-500 hover:border-gray-600/30 hover:cursor-pointer'
                                }`}
                              >
                                {showFoodLines ? 'Hide Food Lines' : 'Show Food Lines'}
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
                                  color: '#c4b5fd',
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
                                    color: '#06b6d4',
                                    showMark: false,
                                    curve: 'linear',
                                    strokeWidth: 2,
                                    strokeDasharray: '6 4',
                                    valueFormatter: (value) => `${value} avg. attendees (with food)`,
                                  },
                                  {
                                    dataKey: 'overallAvgWithoutFood',
                                    label: 'Avg. without Food',
                                    color: '#10b981',
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
                            <div className="bg-gradient-to-br from-[#fca5a5]/20 to-[#fca5a5]/8 backdrop-blur-sm border border-[#fca5a5]/30 p-3 rounded-xl flex-1 shadow-sm">
                              <h3 className="text-white/90 text-xs font-medium mb-1.5 uppercase tracking-wide">Most Popular</h3>
                              <p className="text-xl font-semibold text-[#fca5a5] truncate">
                                {eventTypeData.length > 0 ? eventTypeData.reduce((max, type) => 
                                  type.avgAttendance > max.avgAttendance ? type : max
                                ).type : 'None'}
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-[#06b6d4]/20 to-[#06b6d4]/8 backdrop-blur-sm border border-[#06b6d4]/30 p-3 rounded-xl flex-1 shadow-sm">
                              <h3 className="text-white/90 text-xs font-medium mb-1.5 uppercase tracking-wide">Total Types</h3>
                              <p className="text-xl font-semibold text-[#67e8f9]">
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
                                  color: '#c4b5fd',
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
                                <div className="text-center">
                                  <p className="text-white text-lg mb-2">No Event Data Available</p>
                                  <p className="text-gray-400 text-sm">Add some events with attendance to see the chart</p>
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
                                color: '#c4b5fd',
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

                  {/* Right side - Pie Chart (1/3 width) */}
                  <div className="flex-[1] bg-gradient-to-br from-gray-900/50 to-gray-800/40 backdrop-blur-xl border border-white/10 rounded-3xl px-6 pb-12 pt-6 flex flex-col overflow-y-auto scrollbar-dark">
                    <h3 className="text-white text-xl font-semibold mb-3 text-center tracking-tight">Major Distribution</h3>
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
                        <div className="text-center">
                          <p className="text-white text-lg mb-2">No Major Data Available</p>
                          <p className="text-gray-400 text-sm">Members need to set their major to see distribution</p>
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
          <div className="bg-[#000000]/50 flex-[0.2] rounded-3xl p-4 space-y-3 overflow-y-auto scrollbar-dark">
            {/* Filter Section */}
            <div className="mt-3">
              <h2 className="text-xl font-bold text-white mb-2">
                Filter by Category
              </h2>
              <div className="w-full h-[1px] bg-white mb-4"></div>
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
              <h2 className="text-xl font-bold text-white mb-2">
                Academic Year
              </h2>
              <div className="w-full h-[1px] bg-white mb-4"></div>
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
                <h2 className="text-xl font-bold text-white mb-2">
                  Download Attendance
                </h2>
                <div className="w-full h-px bg-white mb-4"></div>
                <div className="space-y-3">
                  <button
                    onClick={() => downloadAttendees("TXT")}
                    className="w-full px-4 py-2 bg-[#121212]/90 hover:bg-[#121212] text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A3AD] focus:ring-offset-2 hover:cursor-pointer"
                  >
                    TXT
                  </button>
                  <button
                    onClick={() => downloadAttendees("EXCEL")}
                    className="w-full px-4 py-2 bg-[#121212]/90 hover:bg-[#121212] text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A3AD] focus:ring-offset-2 hover:cursor-pointer"
                  >
                    EXCEL
                  </button>
                </div>
              </div>
            )}

            {/* Download Members - Only show for Members */}
            {category === "members" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Download Members
                </h2>
                <div className="w-full h-px bg-white mb-4"></div>
                <div className="space-y-3">
                  <button
                    onClick={() => downloadMembers("TXT")}
                    className="w-full px-4 py-2 bg-[#121212]/90 hover:bg-[#121212] text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A3AD] focus:ring-offset-2 hover:cursor-pointer"
                  >
                    TXT
                  </button>
                  <button
                    onClick={() => downloadMembers("EXCEL")}
                    className="w-full px-4 py-2 bg-[#121212]/90 hover:bg-[#121212] text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A3AD] focus:ring-offset-2 hover:cursor-pointer"
                  >
                    EXCEL
                  </button>
                </div>
              </div>
            )}

            {/* Extra Stats Section - Only show for Members */}
            {category === "members" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Extra Stats
                </h2>
                <div className="w-full h-px bg-white mb-4"></div>
                <div className="space-y-4">
                  <div className="bg-[#121212]/50 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-1">
                      Total Members
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {membersData.length}
                    </div>
                  </div>
                  <div className="bg-[#121212]/50 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-1">
                      National Members
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {
                        membersData.filter(
                          (member) => member.national_member === "yes"
                        ).length
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Charts Info Section - Only show for Charts */}
            {category === "charts" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Analytics Overview
                </h2>
                <div className="w-full h-px bg-white mb-4"></div>
                <div className="space-y-4">
                  <div className="bg-[#121212]/50 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-1">
                      Total Events
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {attendanceOverTimeData.length}
                    </div>
                  </div>
                  <div className="bg-[#121212]/50 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-1">
                      Total Attendance
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {attendanceOverTimeData.reduce((sum, event) => sum + event.attendance, 0)}
                    </div>
                  </div>
                  <div className="bg-[#121212]/50 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-1">
                      Avg. Attendance
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {attendanceOverTimeData.length > 0 
                        ? Math.round(attendanceOverTimeData.reduce((sum, event) => sum + event.attendance, 0) / attendanceOverTimeData.length)
                        : 0
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Predictions Info Section */}
            {category === "ai-predictions" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Predictions Overview
                </h2>
                <div className="w-full h-px bg-white mb-4"></div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-1">
                      Events with Predictions
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {upcomingEventsPredictions.length}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-1">
                      Avg. Predicted Attendance
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {upcomingEventsPredictions.length > 0
                        ? Math.round(
                            upcomingEventsPredictions.reduce(
                              (sum, event) => sum + (event.predicted_attendance || 0),
                              0
                            ) / upcomingEventsPredictions.length
                          )
                        : 0
                      }
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-1">
                      Total Predicted
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {upcomingEventsPredictions.reduce(
                        (sum, event) => sum + (event.predicted_attendance || 0),
                        0
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
