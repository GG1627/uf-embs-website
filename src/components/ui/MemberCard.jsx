import defaultAvatar from "../../assets/default-avatar.png";
import { FaLinkedin } from "react-icons/fa";

export default function MemberCard({ name, position, linkedin, imgURL }) {
  return (
    <div className="group flex flex-col items-center text-center">
      {/* Portrait */}
      <div className="relative w-full aspect-square overflow-hidden mb-4 bg-[#F0EDE8]">
        <img
          src={imgURL || defaultAvatar}
          alt={`${name} - ${position}`}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          decoding="async"
        />
        {/* Subtle warm overlay on hover */}
        <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/5 transition-colors duration-500" />
      </div>

      {/* Text */}
      <div className="w-full">
        <h3
          style={{ fontFamily: "'Lora', Georgia, serif" }}
          className="text-[1rem] font-medium text-[#1A1A1A] leading-snug mb-0.5"
        >
          {name}
        </h3>
        <p className="text-[0.8125rem] text-[#8A8A8A] font-light tracking-wide mb-3">
          {position}
        </p>
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} on LinkedIn`}
            className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium text-[#6B7280] hover:text-[#00629B] transition-colors duration-200"
          >
            <FaLinkedin className="w-3.5 h-3.5" />
            LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}
