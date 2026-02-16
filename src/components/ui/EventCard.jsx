import { LuClock } from "react-icons/lu";
import { LuMapPin } from "react-icons/lu";

export default function EventCard({
  eventName,
  location,
  date,
  time,
  description,
  onCardClick,
}) {
  return (
    <div
      onClick={onCardClick}
      className="group relative cursor-pointer h-full"
      style={{
        perspective: "1000px",
      }}
    >
      {/* Main Card */}
      <div
        className="relative rounded-3xl overflow-hidden transition-all duration-500 ease-out h-full"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5), 0 0px 10px rgba(255, 255, 255, 0.4)",
          transform: "translateY(0)",
          minHeight: "320px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.6), 0 0px 40px rgba(255, 255, 255, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5), 0 0px 40px rgba(255, 255, 255, 0.4)";
        }}
      >
        {/* Subtle gradient overlay */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(135deg, rgba(119, 37, 131, 0.03) 0%, rgba(156, 30, 150, 0.03) 100%)",
          }}
        />

        {/* Content Container */}
        <div className="relative p-8 flex flex-col flex-1">
          {/* Event Name */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 tracking-tight leading-tight mb-2">
              {eventName}
            </h3>
            <div 
              className="h-0.5 w-12 rounded-full transition-all duration-500"
              style={{
                background: "linear-gradient(90deg, #772583 0%, #9C1E96 100%)",
                width: "24px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.width = "48px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.width = "24px";
              }}
            />
          </div>

          {/* Details Grid */}
          <div className="space-y-5 mb-2">
            {/* Location */}
            <div className="flex items-start gap-4">
              <div 
                className="flex-shrink-0 p-2.5 rounded-xl transition-all duration-300"
                style={{
                  background: "rgba(119, 37, 131, 0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(119, 37, 131, 0.12)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(119, 37, 131, 0.08)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <LuMapPin className="text-[#772583] text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Location
                </p>
                <p className="text-gray-900 text-base font-medium leading-snug">
                  {location}
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-4">
              <div 
                className="flex-shrink-0 p-2.5 rounded-xl transition-all duration-300"
                style={{
                  background: "rgba(119, 37, 131, 0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(119, 37, 131, 0.12)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(119, 37, 131, 0.08)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <LuClock className="text-[#772583] text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Date & Time
                </p>
                <p className="text-gray-900 text-base font-medium leading-snug">
                  {date}
                </p>
                <p className="text-gray-600 text-sm mt-0.5 font-normal">
                  {time}
                </p>
              </div>
            </div>
          </div>

          {/* Description - Always reserve space */}
          <div className="pt-2 border-t border-gray-200 mt-auto">
            {description &&
              description.trim() &&
              description !== "No description available" &&
              !description.trim().startsWith("<a") ? (
                <>
                  <p
                    className="text-sm text-gray-600 leading-relaxed font-normal"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: "1.6",
                      minHeight: "3.2em",
                    }}
                  >
                    {description}
                  </p>
                  {description.length > 100 && (
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xs font-medium text-[#772583] group-hover:text-[#9C1E96] transition-colors duration-300">
                        Read more
                      </span>
                      <svg 
                        className="w-3 h-3 text-[#772583] group-hover:text-[#9C1E96] group-hover:translate-x-1 transition-all duration-300" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ minHeight: "3.2em" }} />
              )}
          </div>
        </div>

        {/* Shine effect on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
            transform: "translateX(-100%)",
            animation: "shimmer 1.5s ease-in-out",
          }}
        />
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(200%) translateY(200%) rotate(45deg);
          }
        }
      `}</style>
    </div>
  );
}
