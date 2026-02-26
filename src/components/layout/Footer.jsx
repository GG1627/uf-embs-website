import { FaInstagram, FaDiscord, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-[#000000]/60 border-t border-white/[0.08]">
      {/* Main Footer Content */}
      <div className="w-full h-auto min-h-[400px] md:min-h-[360px] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-16 lg:gap-20">
            {/* Brand Section - Wider on desktop */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2">
              <h2 className="text-[28px] md:text-[32px] font-semibold text-white mb-5 tracking-[-0.02em]" style={{ fontFamily: "'Georgia', serif" }}>
                UF EMBS
              </h2>
              <p className="text-white/60 text-[15px] leading-[1.6] mb-8 max-w-sm font-light">
                Engineering in Medicine & Biology Society at the University of Florida. 
                Fostering innovation in biomedical engineering and connecting students 
                with industry professionals.
              </p>
              {/* Social Media */}
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/ieee_embs_uf?utm_source=ig_web_button_share_sheet&igsh=YTR4aGdhMmRibjI3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative text-white/50 hover:text-white transition-all duration-200 ease-out"
                  aria-label="Instagram"
                >
                  <div className="absolute inset-0 -m-2 rounded-full bg-white/0 group-hover:bg-white/5 transition-all duration-200"></div>
                  <FaInstagram className="w-[18px] h-[18px] relative z-10" />
                </a>
                <a
                  href="https://discord.gg/dSeBes8Ywx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative text-white/50 hover:text-white transition-all duration-200 ease-out"
                  aria-label="Discord"
                >
                  <div className="absolute inset-0 -m-2 rounded-full bg-white/0 group-hover:bg-white/5 transition-all duration-200"></div>
                  <FaDiscord className="w-[18px] h-[18px] relative z-10" />
                </a>
                <a
                  href="https://www.linkedin.com/company/ieee-embs-uf/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative text-white/50 hover:text-white transition-all duration-200 ease-out"
                  aria-label="LinkedIn"
                >
                  <div className="absolute inset-0 -m-2 rounded-full bg-white/0 group-hover:bg-white/5 transition-all duration-200"></div>
                  <FaLinkedin className="w-[18px] h-[18px] relative z-10" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <h3 className="text-white/90 font-medium text-[13px] mb-6 uppercase tracking-[0.08em]">
                Quick Links
              </h3>
              <ul className="space-y-3.5">
                <li>
                  <Link
                    to="/"
                    className="group relative inline-block text-white/60 hover:text-white text-[15px] font-light transition-colors duration-200 ease-out"
                  >
                    <span className="relative z-10">Home</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-200 ease-out"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="group relative inline-block text-white/60 hover:text-white text-[15px] font-light transition-colors duration-200 ease-out"
                  >
                    <span className="relative z-10">About</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-200 ease-out"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events"
                    className="group relative inline-block text-white/60 hover:text-white text-[15px] font-light transition-colors duration-200 ease-out"
                  >
                    <span className="relative z-10">Events</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-200 ease-out"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/team"
                    className="group relative inline-block text-white/60 hover:text-white text-[15px] font-light transition-colors duration-200 ease-out"
                  >
                    <span className="relative z-10">Team</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-200 ease-out"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="group relative inline-block text-white/60 hover:text-white text-[15px] font-light transition-colors duration-200 ease-out"
                  >
                    <span className="relative z-10">Blog</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-200 ease-out"></span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Branches */}
            <div className="col-span-1">
              <h3 className="text-white/90 font-medium text-[13px] mb-6 uppercase tracking-[0.08em]">
                Branches
              </h3>
              <ul className="space-y-3.5">
                <li>
                  <Link
                    to="/research"
                    className="group relative inline-block text-white/60 hover:text-white text-[15px] font-light transition-colors duration-200 ease-out"
                  >
                    <span className="relative z-10">Research</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-200 ease-out"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects"
                    className="group relative inline-block text-white/60 hover:text-white text-[15px] font-light transition-colors duration-200 ease-out"
                  >
                    <span className="relative z-10">Projects</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-200 ease-out"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/outreach"
                    className="group relative inline-block text-white/60 hover:text-white text-[15px] font-light transition-colors duration-200 ease-out"
                  >
                    <span className="relative z-10">Outreach</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-200 ease-out"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/workshops"
                    className="group relative inline-block text-white/60 hover:text-white text-[15px] font-light transition-colors duration-200 ease-out"
                  >
                    <span className="relative z-10">Workshops</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-200 ease-out"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/industry"
                    className="group relative inline-block text-white/60 hover:text-white text-[15px] font-light transition-colors duration-200 ease-out"
                  >
                    <span className="relative z-10">Industry</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-200 ease-out"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/networking"
                    className="group relative inline-block text-white/60 hover:text-white text-[15px] font-light transition-colors duration-200 ease-out"
                  >
                    <span className="relative z-10">Networking</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-200 ease-out"></span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources & Contact */}
            <div className="col-span-1">
              <h3 className="text-white/90 font-medium text-[13px] mb-6 uppercase tracking-[0.08em]">
                Resources
              </h3>
              <ul className="space-y-3.5 mb-8">
                <li>
                  <Link
                    to="/resources"
                    className="group relative inline-block text-white/60 hover:text-white text-[15px] font-light transition-colors duration-200 ease-out"
                  >
                    <span className="relative z-10">Resources</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-200 ease-out"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="group relative inline-block text-white/60 hover:text-white text-[15px] font-light transition-colors duration-200 ease-out"
                  >
                    <span className="relative z-10">Contact</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-200 ease-out"></span>
                  </Link>
                </li>
              </ul>
              <div className="pt-6 border-t border-white/60">
                <a
                  href="https://www.embs.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-1.5 text-white/60 hover:text-white text-[15px] font-light transition-colors duration-200 ease-out"
                >
                  <span>IEEE EMBS</span>
                  <span className="inline-block transform group-hover:translate-x-0.5 transition-transform duration-200 ease-out">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full h-16 md:h-14 border-t border-white/[0.08] bg-[#000000]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 h-full">
          <div className="flex flex-col md:flex-row items-center justify-between h-full">
            <p className="text-white/50 text-[13px] text-center md:text-left mb-2 md:mb-0 font-light">
              Copyright © {new Date().getFullYear()} UF EMBS. All rights reserved.
            </p>
            <div className="flex items-center gap-5 text-[13px] font-light">
              <Link
                to="/contact"
                className="text-white/50 hover:text-white/80 transition-colors duration-200 ease-out"
              >
                Feedback
              </Link>
              <span className="text-white/20">·</span>
              <span className="text-white/50">
                University of Florida
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
