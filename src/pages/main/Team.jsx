import MemberCard from "../../components/ui/MemberCard";
import Footer from "../../components/layout/Footer";
import { Link } from "react-router-dom";
import {
  executiveBoard,
  techLeads,
  digitalMedia,
  outreachAndOperations,
  advisors,
  pastBoards,
} from "../../data/members";

const sections = [
  {
    label:       "Leadership",
    labelColor:  "text-[#772583]",
    title:       "Executive Board",
    description: "The leadership team guiding strategy, community, and vision.",
    members:     executiveBoard,
    cols:        "sm:grid-cols-2 lg:grid-cols-4",
  },
  {
    label:       "Technical",
    labelColor:  "text-[#00629B]",
    title:       "Tech Leads",
    description: "Engineers and researchers driving our technical initiatives.",
    members:     techLeads,
    cols:        "sm:grid-cols-2 lg:grid-cols-4",
  },
  {
    label:       "Creative",
    labelColor:  "text-[#772583]",
    title:       "Digital Media",
    description: "Building and shaping the digital presence of UF EMBS.",
    members:     digitalMedia,
    cols:        "sm:grid-cols-2 lg:grid-cols-4",
  },
  {
    label:       "Community",
    labelColor:  "text-[#00629B]",
    title:       "Outreach and Operations",
    description: "Connecting our community and expanding our reach on campus.",
    members:     outreachAndOperations,
    cols:        "sm:grid-cols-2 lg:grid-cols-4",
  },
  {
    label:       "Faculty",
    labelColor:  "text-[#772583]",
    title:       "Advisors",
    description: "Faculty and industry mentors who guide our work and growth.",
    members:     advisors,
    cols:        "sm:grid-cols-2 lg:grid-cols-3",
  },
];

export default function Team() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen flex flex-col bg-[#F8F6F1]">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 border-b border-[#E8E4DD]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00629B] mb-7">
            University of Florida · IEEE EMBS
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h1
              style={{ fontFamily: "'Lora', Georgia, serif" }}
              className="text-5xl md:text-[4rem] font-medium leading-[1.1] tracking-[-0.01em] text-[#1A1A1A]"
            >
              Meet <em className="not-italic text-[#772583]">the Team</em>
            </h1>
            <p className="text-[1rem] text-[#4A4A4A] font-light leading-[1.75] max-w-sm md:text-right md:pb-1">
              The people who make UF EMBS run, from the executive board to faculty advisors.
            </p>
          </div>
        </div>
      </section>

      {/* ── Member sections ───────────────────────────────────────────────── */}
      <div className="flex-1">
        {sections.map(({ label, labelColor, title, description, members, cols }, si) => (
          <section
            key={title}
            className={`py-20 px-6 ${si % 2 === 0 ? "bg-[#F8F6F1]" : "bg-white"}`}
          >
            <div className="max-w-5xl mx-auto">
              {/* Section header */}
              <div className="mb-12 grid md:grid-cols-5 gap-6 items-end">
                <div className="md:col-span-3">
                  <p className={`text-[11px] font-semibold tracking-[0.22em] uppercase mb-4 ${labelColor}`}>
                    {label}
                  </p>
                  <h2
                    style={{ fontFamily: "'Lora', Georgia, serif" }}
                    className="text-2xl md:text-[2rem] font-medium leading-[1.25] tracking-[-0.01em] text-[#1A1A1A]"
                  >
                    {title}
                  </h2>
                </div>
                <p className="md:col-span-2 text-[0.9375rem] text-[#6B7280] font-light leading-[1.75] self-end">
                  {description}
                </p>
              </div>

              {/* Cards grid */}
              <div className={`grid ${cols} gap-x-8 gap-y-12`}>
                {members.map((member, index) => (
                  <MemberCard
                    key={index}
                    name={member.name}
                    position={member.position}
                    linkedin={member.linkedin}
                    imgURL={member.imgURL}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ── Past boards ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#F8F6F1] border-t border-[#E8E4DD]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#8A8A8A] mb-4">
              Alumni
            </p>
            <h2
              style={{ fontFamily: "'Lora', Georgia, serif" }}
              className="text-2xl md:text-[2rem] font-medium leading-[1.25] tracking-[-0.01em] text-[#1A1A1A]"
            >
              Past Boards
            </h2>
          </div>

          <div className="space-y-16">
            {pastBoards.map(({ year, members }) => (
              <div key={year}>
                {/* Year divider */}
                <div className="flex items-center gap-4 mb-10">
                  <span
                    style={{ fontFamily: "'Lora', Georgia, serif" }}
                    className="text-[1.125rem] font-medium text-[#00629B] shrink-0"
                  >
                    {year}
                  </span>
                  <div className="h-px flex-1" style={{ background: "linear-gradient(to right, #00629B30, #E8E4DD)" }} />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                  {members.map((member, i) => (
                    <MemberCard
                      key={i}
                      name={member.name}
                      position={member.position}
                      linkedin={member.linkedin}
                      imgURL={member.imgURL}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA strip ─────────────────────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#6B9FC4] mb-4">
              Join Us
            </p>
            <h2
              style={{ fontFamily: "'Lora', Georgia, serif" }}
              className="text-2xl md:text-[2rem] font-medium leading-[1.25] tracking-[-0.01em] text-white max-w-md"
            >
              Interested in becoming part of the team?
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/contact"
              className="px-7 py-3 bg-white text-[#1A1A1A] text-[0.875rem] font-medium tracking-wide hover:bg-[#F8F6F1] transition-colors duration-300 text-center"
            >
              Contact Us
            </Link>
            <Link
              to="/about"
              className="px-7 py-3 bg-transparent text-white text-[0.875rem] font-medium tracking-wide border border-white/20 hover:border-white/50 transition-colors duration-300 text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
