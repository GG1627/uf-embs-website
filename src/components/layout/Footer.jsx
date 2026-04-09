import { FaInstagram, FaDiscord, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const QUICK_LINKS = [
  { label: "Home",      to: "/" },
  { label: "About",     to: "/about" },
  { label: "Events",    to: "/events" },
  { label: "Team",      to: "/team" },
  { label: "Blog",      to: "/blog" },
];

const BRANCHES = [
  { label: "Research",    to: "/research" },
  { label: "Projects",    to: "/projects" },
  { label: "Outreach",    to: "/outreach" },
  { label: "Workshops",   to: "/workshops" },
  { label: "Industry",    to: "/industry" },
  { label: "Networking",  to: "/networking" },
];

const RESOURCES = [
  { label: "Resources",   to: "/resources" },
  { label: "Contact",     to: "/contact" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/ieee_embs_uf?utm_source=ig_web_button_share_sheet&igsh=YTR4aGdhMmRibjI3",
    icon: <FaInstagram className="w-4 h-4" />,
  },
  {
    label: "Discord",
    href: "https://discord.gg/dSeBes8Ywx",
    icon: <FaDiscord className="w-4 h-4" />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/ieee-embs-uf/",
    icon: <FaLinkedin className="w-4 h-4" />,
  },
];

function FooterCol({ heading, links }) {
  return (
    <div>
      <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/40 mb-5">
        {heading}
      </p>
      <ul className="space-y-3">
        {links.map(({ label, to }) => (
          <li key={to}>
            <Link
              to={to}
              className="text-[0.875rem] font-light text-white/55 hover:text-white transition-colors duration-200"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="w-full bg-[#111110]"
    >
      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">

          {/* Brand */}
          <div className="lg:col-span-2">
            <h2
              style={{ fontFamily: "'Lora', Georgia, serif" }}
              className="text-[1.5rem] font-medium text-white mb-4 tracking-[-0.01em]"
            >
              UF EMBS
            </h2>
            <p className="text-white/50 text-[0.875rem] leading-[1.75] font-light max-w-xs mb-8">
              Engineering in Medicine &amp; Biology Society at the University
              of Florida, fostering innovation and connecting students with
              the world of biomedical engineering.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-4">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/40 hover:text-white transition-colors duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          <FooterCol heading="Quick Links" links={QUICK_LINKS} />
          <FooterCol heading="Branches"    links={BRANCHES} />

          {/* Resources + external */}
          <div>
            <FooterCol heading="Resources" links={RESOURCES} />
            <div className="mt-8 pt-6 border-t border-white/[0.07]">
              <a
                href="https://www.embs.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[0.875rem] font-light text-white/40 hover:text-white transition-colors duration-200 group"
              >
                IEEE EMBS Global
                <span className="inline-block group-hover:translate-x-0.5 transition-transform duration-200">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
          <p className="text-[0.75rem] font-light text-white/30">
            © {new Date().getFullYear()} UF EMBS. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-[0.75rem] font-light text-white/30">
            <Link to="/contact" className="hover:text-white/60 transition-colors duration-200">
              Feedback
            </Link>
            <span aria-hidden="true">·</span>
            <span>University of Florida</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
