import { useState, useEffect } from "react";
import StatsTab from "./statsTab";
import CreateEventTab from "./createEventTab";
import MemberDashboard from "./memberDashboard";

export default function AdminDashboard() {
  const [activeTab, setActiveTab]     = useState("stats");
  const [isMemberView, setIsMemberView] = useState(false);

  useEffect(() => {
    if (isMemberView) {
      document.body.style.overflow = "auto";
    } else if (activeTab === "stats") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [activeTab, isMemberView]);

  const tabs = [
    { id: "stats",        name: "Stats" },
    { id: "create-event", name: "Create Event" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "stats":        return <StatsTab />;
      case "create-event": return <CreateEventTab />;
      default:             return <StatsTab />;
    }
  };

  if (isMemberView) {
    return (
      <div className="relative">
        {/* Preview banner — sits flush under the fixed navbar */}
        <div className="fixed top-16 left-0 right-0 z-[9999] bg-[#1A1A1A] border-b border-[#772583]/40 px-6 py-2.5 flex items-center justify-between"
          style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-[#772583]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span className="text-white/70 text-[0.8125rem] font-medium tracking-wide">
              Previewing as Member
            </span>
          </div>
          <button
            onClick={() => setIsMemberView(false)}
            className="px-4 py-1.5 border border-[#D0CCC4] hover:border-white text-white text-[0.8125rem] font-medium tracking-wide transition-colors duration-200 cursor-pointer"
          >
            Exit Preview
          </button>
        </div>
        <div className="pt-10">
          <MemberDashboard />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F3F1EC] flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Tab navigation */}
      <div className="sticky top-16 z-[9998] bg-[#17191D] border-b border-white/10 shadow-[0_8px_24px_rgba(23,25,29,0.08)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-8 h-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative h-full text-[0.8125rem] font-medium tracking-wide transition-colors duration-200 cursor-pointer ${
                  activeTab === tab.id ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab.name}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-[#772583]" />
                )}
              </button>
            ))}

            <div className="ml-auto">
              <button
                onClick={() => setIsMemberView(true)}
                className="flex items-center gap-2 px-4 py-1.5 border border-white/20 hover:border-white/50 text-white/50 hover:text-white text-[0.8125rem] font-medium tracking-wide transition-colors duration-200 cursor-pointer"
                title="Preview dashboard as a member"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Member View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="admin-workspace-theme flex-1">{renderTabContent()}</div>
    </div>
  );
}
