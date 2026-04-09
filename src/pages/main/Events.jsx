import Footer from "../../components/layout/Footer";
import { LuCalendarDays } from "react-icons/lu";

export default function Events() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen flex flex-col bg-[#F8F6F1]">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-16 px-6 border-b border-[#E8E4DD]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-7">
            University of Florida · IEEE EMBS
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h1
              style={{ fontFamily: "'Lora', Georgia, serif" }}
              className="text-5xl md:text-[4rem] font-medium leading-[1.12] tracking-[-0.01em] text-[#1A1A1A]"
            >
              Events &amp; <em className="not-italic text-[#772583]">Calendar</em>
            </h1>
            <p className="text-[1rem] text-[#4A4A4A] font-light leading-[1.75] max-w-sm md:text-right md:pb-1">
              Workshops, networking nights, design challenges, and more. All in one place.
            </p>
          </div>
        </div>
      </section>

      {/* ── Calendar ──────────────────────────────────────────────────────── */}
      <section className="flex-1 bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Section label */}
          <div className="flex items-center gap-2.5 mb-8">
            <LuCalendarDays className="w-4 h-4 text-[#00629B]" />
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00629B]">
              Chapter Calendar
            </p>
          </div>

          {/* Calendar embed */}
          <div
            className="overflow-hidden border border-[#E8E4DD] border-l-[3px] border-l-[#772583]"
            style={{ boxShadow: "0 2px 24px rgba(26,26,26,0.06)" }}
          >
            <iframe
              src="https://calendar.google.com/calendar/embed?src=41f1ab6a263431af2451ca9507cd60a97d9eefed70ea92a3b22a6fa305346931%40group.calendar.google.com&ctz=America%2FNew_York"
              style={{ border: 0, display: "block" }}
              width="100%"
              height="720"
              frameBorder="0"
              scrolling="no"
              title="UF EMBS Calendar"
            />
          </div>

          {/* Helper note */}
          <p className="mt-5 text-[0.8125rem] font-light text-[#9A9A9A]">
            All times shown in Eastern Time (ET). Events are updated in real time.
            Can't see the calendar?{" "}
            <a
              href="https://calendar.google.com/calendar/r?cid=41f1ab6a263431af2451ca9507cd60a97d9eefed70ea92a3b22a6fa305346931%40group.calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00629B] underline underline-offset-2 hover:text-[#772583] transition-colors duration-200"
            >
              Open in Google Calendar
            </a>
            .
          </p>
        </div>
      </section>

      {/* ── Stay in the loop strip ────────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#6B9FC4] mb-4">
              Stay in the loop
            </p>
            <h2
              style={{ fontFamily: "'Lora', Georgia, serif" }}
              className="text-2xl md:text-[2rem] font-medium leading-[1.25] tracking-[-0.01em] text-white max-w-md"
            >
              Never miss an event. Join our Discord for real-time updates.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="https://discord.gg/dSeBes8Ywx"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 bg-white text-[#1A1A1A] text-[0.875rem] font-medium tracking-wide hover:bg-[#F8F6F1] transition-colors duration-300 text-center"
            >
              Join our Discord
            </a>
            <a
              href="https://www.instagram.com/ieee_embs_uf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 bg-transparent text-white text-[0.875rem] font-medium tracking-wide border border-white/20 hover:border-white/50 transition-colors duration-300 text-center"
            >
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
