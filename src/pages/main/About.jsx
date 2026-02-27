import { FaHeartbeat, FaUserFriends, FaMicroscope, FaGlobeAmericas, FaFlask, FaTrophy } from "react-icons/fa";
import { LuDna } from "react-icons/lu";
import labImage from "../../assets/images/recognition-scientists-lab2x.avif";
import Footer from "../../components/layout/Footer";
import GradientMesh from "../../components/ui/GradientMesh";
import { gradientPresets } from "../../styles/ieeeColors";
import { Link } from "react-router-dom";

const stats = [
  { value: "200+", label: "Active Members" },
  { value: "11+",  label: "Majors Represented" },
  { value: "20+",  label: "Events Per Year" },
  { value: "11k+", label: "Global EMBS Members" },
];

const pillars = [
  {
    icon: <FaMicroscope className="w-6 h-6" />,
    color: "#00629b",
    bg: "bg-[#00629b]/10",
    border: "border-[#00629b]/20",
    title: "Interdisciplinary Projects",
    body: "Workshops, technical projects, and design challenges that bridge engineering and health sciences.",
  },
  {
    icon: <FaUserFriends className="w-6 h-6" />,
    color: "#772583",
    bg: "bg-[#772583]/10",
    border: "border-[#772583]/20",
    title: "Inclusive Community",
    body: "Open to students of all levels and backgrounds. No prior experience required.",
  },
  {
    icon: <FaHeartbeat className="w-6 h-6" />,
    color: "#00A3AD",
    bg: "bg-[#00A3AD]/10",
    border: "border-[#00A3AD]/20",
    title: "Healthcare Innovation",
    body: "Explore AI in diagnostics, wearable biosensors, neural engineering, and the future of medtech.",
  },
  {
    icon: <FaFlask className="w-6 h-6" />,
    color: "#7A9A01",
    bg: "bg-[#7A9A01]/10",
    border: "border-[#7A9A01]/20",
    title: "Research Exposure",
    body: "Connect members with faculty mentors, labs, and research opportunities across UF's campus.",
  },
  {
    icon: <FaTrophy className="w-6 h-6" />,
    color: "#FFB81C",
    bg: "bg-[#FFB81C]/10",
    border: "border-[#FFB81C]/20",
    title: "Competitions & Designathons",
    body: "Annual design challenges where teams prototype solutions to real biomedical engineering problems.",
  },
  {
    icon: <FaGlobeAmericas className="w-6 h-6" />,
    color: "#F05A28",
    bg: "bg-[#F05A28]/10",
    border: "border-[#F05A28]/20",
    title: "Industry Connections",
    body: "Speaker series and networking nights with professionals across medicine, biotech, and engineering.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <GradientMesh
          colors={gradientPresets.research}
          baseGradient="linear-gradient(to bottom, #e8f4ff, #f0f9ff, #f9fafb)"
        />
      </div>

      {/* Hero */}
      <section className="relative pt-24 pb-12 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-[#00629b]/20 text-[#00629b] text-sm font-medium mb-6">
            <LuDna className="w-4 h-4" />
            University of Florida Chapter
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 tracking-tight mb-4">
            Who We Are
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
            A student community at the crossroads of engineering and medicine.
          </p>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="relative z-10 mb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-xl grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200/60">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center py-8 px-4 first:rounded-l-2xl last:rounded-r-2xl">
                <span className="text-4xl md:text-5xl font-light text-[#00629b] tracking-tight leading-none mb-2">
                  {value}
                </span>
                <span className="text-sm text-gray-500 font-medium tracking-wide uppercase text-center">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pb-24">

          {/* Mission Section */}
          <section className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#00629b] mb-3">Our Mission</p>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight mb-6 leading-snug">
                Building the next generation of biomedical engineers at UF
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4 font-light">
                The EMBS chapter at the University of Florida is a student-led
                organization focused on empowering engineers to innovate at the
                intersection of healthcare and technology. Our mission is to
                provide students with the tools, connections, and experiences
                needed to grow academically, professionally, and personally.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed font-light">
                With students from 11+ majors, we connect everyone to mentorship,
                industry insights, and hands-on opportunities to contribute to the
                field of engineering in medicine.
              </p>
            </div>
            <figure className="flex flex-col items-center">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={labImage}
                  alt="Biomedical Innovation"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <figcaption className="text-xs text-gray-400 mt-3 text-center">
                Image courtesy of{" "}
                <a
                  href="https://www.embs.org/awards/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#00629b] transition-colors"
                >
                  IEEE EMBS
                </a>
              </figcaption>
            </figure>
          </section>

          {/* About IEEE EMBS */}
          <section className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-xl p-10 md:p-14">
            <div className="max-w-4xl">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#772583] mb-3">About IEEE EMBS</p>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight mb-5 leading-snug">
                IEEE Engineering in Medicine &amp; Biology Society
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed font-light mb-6">
                IEEE EMBS is the world's largest international society of biomedical
                engineers, with over 11,000 members across 97 countries. It advances
                research and collaboration in medical imaging, wearable technology,
                neural engineering, and health systems. Our UF chapter is one of the
                student branches carrying that mission forward.
              </p>
              <a
                href="https://www.embs.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#00629b] font-medium hover:gap-3 transition-all duration-200 group"
              >
                Visit the official EMBS website
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
              </a>
            </div>
          </section>

          {/* Pillars Grid */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
                What we do
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pillars.map(({ icon, color, bg, border, title, body }) => (
                <div
                  key={title}
                  className={`bg-white/60 backdrop-blur-md rounded-2xl border ${border} shadow-sm hover:shadow-lg transition-shadow duration-300 p-7 flex flex-col gap-4`}
                >
                  <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center`} style={{ color }}>
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-light">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-xl p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight mb-4">
              Ready to get involved?
            </h2>
            <p className="text-gray-600 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-8">
              Join 200+ students working at the intersection of engineering and
              healthcare. No prior experience needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="px-8 py-3 rounded-full bg-[#00629b] text-white font-medium text-sm tracking-wide hover:bg-[#004f7a] transition-colors duration-200 shadow-lg shadow-[#00629b]/30"
              >
                Contact Us
              </Link>
              <Link
                to="/team"
                className="px-8 py-3 rounded-full bg-white/80 text-gray-700 font-medium text-sm tracking-wide border border-gray-200 hover:bg-white hover:border-gray-300 transition-all duration-200"
              >
                Meet the Team
              </Link>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}
