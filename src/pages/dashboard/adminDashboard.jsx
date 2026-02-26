import { useState, useEffect } from "react";
import StatsTab from "./statsTab";
import CreateEventTab from "./createEventTab";
import MemberDashboard from "./memberDashboard";
import { gradientPresets } from "../../styles/ieeeColors";
import GradientMesh from "../../components/ui/GradientMesh";
import { FaRegEye } from "react-icons/fa";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("stats"); // Default to stats tab
  const [isMemberView, setIsMemberView] = useState(false); // Toggle member preview

  // Control body overflow based on active tab
  useEffect(() => {
    if (isMemberView) {
      document.body.style.overflow = "auto";
    } else if (activeTab === "stats") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeTab, isMemberView]);

  const tabs = [
    {
      id: "stats",
      name: "Stats",
    },
    {
      id: "create-event",
      name: "Create Event",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "stats":
        return <StatsTab />;
      case "create-event":
        return <CreateEventTab />;
      default:
        return <StatsTab />;
    }
  };

  // If member view is active, render the member dashboard with a preview banner
  if (isMemberView) {
    return (
      <div className="relative">
        {/* Preview Banner - positioned below the navbar (h-16 = top-16, z-index below navbar's z-10000) */}
        <div className="fixed top-16 left-0 right-0 z-[9999] bg-[#8f0900] text-white px-4 py-2 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold text-sm sm:text-base">
              Previewing as Member
            </span>
          </div>
          <button
            onClick={() => setIsMemberView(false)}
            className="bg-white text-[#8f0900] px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Exit Preview
          </button>
        </div>
        {/* Push content down to account for the fixed banner */}
        <div className="pt-10">
          <MemberDashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 z-0">
        <GradientMesh
          colors={gradientPresets.outreach}
          baseGradient="linear-gradient(to bottom, #c9faff, #f0f9ff, #f0f9ff)"
        />
      </div>

      {/* Tab Navigation */}
      <div className="relative z-10 bg-transparent sticky top-0 mt-19 mb-[-3px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-0 text-lg font-medium transition-all hover:cursor-pointer duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? "text-[#000000] border-[#000000]"
                    : "text-gray-500 border-gray-200 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}

            {/* Member View Toggle */}
            <button
              onClick={() => setIsMemberView(true)}
              className="ml-4 flex items-center gap-1.5 px-4 py-1 rounded-[10px] bg-white hover:bg-gray-200 text-gray-800 hover:text-gray-800 text-sm font-medium transition-all duration-200 border border-gray-800 cursor-pointer"
              title="Preview dashboard as a member"
            >
              <FaRegEye className="w-5 h-5"/>
              Member View
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 pt-0 relative z-10">{renderTabContent()}</div>
    </div>
  );
}
