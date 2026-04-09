import { FaHeartbeat, FaUserFriends, FaMicroscope, FaGlobeAmericas, FaFlask, FaTrophy } from "react-icons/fa";
import labImage from "../../assets/images/recognition-scientists-lab2x.avif";
import Footer from "../../components/layout/Footer";
import { Link } from "react-router-dom";

const stats = [
  { value: "200+", label: "Active Members" },
  { value: "11+",  label: "Majors Represented" },
  { value: "20+",  label: "Events Per Year" },
  { value: "11k+", label: "Global EMBS Members" },
];

const pillars = [
  {
    icon: <FaMicroscope />,
    title: "Interdisciplinary Projects",
    body: "Workshops, technical projects, and design challenges that bridge engineering and health sciences.",
  },
  {
    icon: <FaUserFriends />,
    title: "Inclusive Community",
    body: "Open to students of all levels and backgrounds. No prior experience required.",
  },
  {
    icon: <FaHeartbeat />,
    title: "Healthcare Innovation",
    body: "Explore AI in diagnostics, wearable biosensors, neural engineering, and the future of medtech.",
  },
  {
    icon: <FaFlask />,
    title: "Research Exposure",
    body: "Connect members with faculty mentors, labs, and research opportunities across UF's campus.",
  },
  {
    icon: <FaTrophy />,
    title: "Competitions & Designathons",
    body: "Annual design challenges where teams prototype solutions to real biomedical engineering problems.",
  },
  {
    icon: <FaGlobeAmericas />,
    title: "Industry Connections",
    body: "Speaker series and networking nights with professionals across medicine, biotech, and engineering.",
  },
];

export default function About() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen flex flex-col bg-[#F8F6F1]">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-28 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00629B] mb-7">
            University of Florida · IEEE EMBS
          </p>
          <h1
            style={{ fontFamily: "'Lora', Georgia, serif" }}
            className="text-5xl md:text-6xl lg:text-[4.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-[#1A1A1A] mb-8 max-w-3xl"
          >
            At the intersection of <em className="not-italic text-[#00629B]">engineering</em> and medicine.
          </h1>
          <p className="text-[1.125rem] text-[#4A4A4A] font-light leading-[1.75] max-w-2xl">
            We are a student-led chapter of the world's largest biomedical engineering society,
            building community, opportunity, and innovation at UF.
          </p>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-[#E8E4DD] bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#E8E4DD]">
          {stats.map(({ value, label }, i) => (
            <div key={label} className="flex flex-col items-center py-12 px-6">
              <span
                style={{ fontFamily: "'Lora', Georgia, serif" }}
                className={`text-[2.75rem] font-medium leading-none mb-2 ${i % 2 === 0 ? "text-[#00629B]" : "text-[#772583]"}`}
              >
                {value}
              </span>
              <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#8A8A8A] text-center">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-[#F8F6F1]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-7">
              Our Mission
            </p>
            <h2
              style={{ fontFamily: "'Lora', Georgia, serif" }}
              className="text-3xl md:text-[2.25rem] font-medium leading-[1.25] tracking-[-0.01em] text-[#1A1A1A] mb-7"
            >
              Building the next generation of biomedical engineers at UF.
            </h2>
            <p className="text-[#4A4A4A] text-[1rem] leading-[1.8] font-light mb-5 pl-4 border-l-2 border-[#00629B]/30">
              The EMBS chapter at the University of Florida is a student-led
              organization focused on empowering engineers to innovate at the
              intersection of healthcare and technology. Our mission is to
              provide students with the tools, connections, and experiences
              needed to grow academically, professionally, and personally.
            </p>
            <p className="text-[#4A4A4A] text-[1rem] leading-[1.8] font-light">
              With students from 11+ majors, we connect everyone to mentorship,
              industry insights, and hands-on opportunities to contribute to the
              field of engineering in medicine.
            </p>
          </div>

          <figure>
            <div className="relative overflow-hidden rounded-sm" style={{ boxShadow: "0 2px 40px rgba(26,26,26,0.10)" }}>
              <img
                src={labImage}
                alt="Biomedical Innovation"
                className="w-full h-auto object-cover"
              />
              {/* Subtle warm overlay to tie the image into the page palette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/10 to-transparent pointer-events-none" />
            </div>
            <figcaption className="text-[11px] text-[#9A9A9A] mt-4 font-light text-center tracking-wide">
              Image courtesy of{" "}
              <a
                href="https://www.embs.org/awards/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9A9A9A] underline underline-offset-2 hover:text-[#00629B] transition-colors duration-200"
              >
                IEEE EMBS
              </a>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── About IEEE EMBS ───────────────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] py-28 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12 items-start">
          {/* Left label */}
          <div className="md:col-span-1 md:pt-1">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#6B9FC4] whitespace-nowrap">
              About IEEE EMBS
            </p>
          </div>
          {/* Right content */}
          <div className="md:col-span-4">
            <h2
              style={{ fontFamily: "'Lora', Georgia, serif" }}
              className="text-3xl md:text-[2.25rem] font-medium leading-[1.25] tracking-[-0.01em] text-white mb-7"
            >
              The world's largest international society of biomedical engineers.
            </h2>
            <p className="text-white/60 text-[1rem] leading-[1.8] font-light mb-4">
              IEEE EMBS has over 11,000 members across 97 countries. It advances
              research and collaboration in medical imaging, wearable technology,
              neural engineering, and health systems.
            </p>
            <p className="text-white/60 text-[1rem] leading-[1.8] font-light mb-10">
              Our UF chapter is one of the student branches carrying that mission forward,
              translating global vision into local action on campus.
            </p>
            <a
              href="https://www.embs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white text-[0.875rem] font-medium tracking-wide border-b border-white/30 pb-0.5 hover:border-white transition-colors duration-200 group"
            >
              Visit the official EMBS website
              <span className="group-hover:translate-x-0.5 transition-transform duration-200 inline-block">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Pillars ───────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 grid md:grid-cols-5 gap-6 items-end">
            <div className="md:col-span-3">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00629B] mb-5">
                What We Do
              </p>
              <h2
                style={{ fontFamily: "'Lora', Georgia, serif" }}
                className="text-3xl md:text-[2.25rem] font-medium leading-[1.25] tracking-[-0.01em] text-[#1A1A1A]"
              >
                Six pillars that define our work.
              </h2>
            </div>
            <p className="md:col-span-2 text-[#6B7280] text-[0.9375rem] leading-[1.75] font-light self-end">
              From lab benches to conference rooms, we give students the experiences
              that matter most.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E8E4DD]">
            {pillars.map(({ icon, title, body }, i) => (
              <div
                key={title}
                className="bg-white p-8 flex flex-col gap-5 hover:bg-[#F8F6F1] transition-colors duration-300 group relative overflow-hidden"
              >
                {/* Colored top accent line on hover */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${i % 2 === 0 ? "bg-[#00629B]" : "bg-[#772583]"}`} />
                <div className={`w-9 h-9 flex items-center justify-center text-[1rem] ${i % 2 === 0 ? "bg-[#00629B]/8 text-[#00629B]" : "bg-[#772583]/8 text-[#772583]"} group-hover:bg-opacity-100 transition-colors duration-300`}>
                  {icon}
                </div>
                <div>
                  <h3
                    style={{ fontFamily: "'Lora', Georgia, serif" }}
                    className="text-[1.0625rem] font-medium text-[#1A1A1A] mb-2 leading-snug"
                  >
                    {title}
                  </h3>
                  <p className="text-[#6B7280] text-[0.875rem] leading-[1.75] font-light">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-[#F8F6F1] border-t border-[#E8E4DD]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-5">
              Get Involved
            </p>
            <h2
              style={{ fontFamily: "'Lora', Georgia, serif" }}
              className="text-3xl md:text-[2.5rem] font-medium leading-[1.2] tracking-[-0.01em] text-[#1A1A1A]"
            >
              Ready to be part of something meaningful?
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/contact"
              className="px-7 py-3 bg-[#1A1A1A] text-white text-[0.875rem] font-medium tracking-wide hover:bg-[#00629B] transition-colors duration-300 text-center"
            >
              Contact Us
            </Link>
            <Link
              to="/team"
              className="px-7 py-3 bg-transparent text-[#1A1A1A] text-[0.875rem] font-medium tracking-wide border border-[#D0CCC4] hover:border-[#1A1A1A] transition-colors duration-300 text-center"
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
