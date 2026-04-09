import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useSnackbar } from "../../components/ui/Snackbar";
import SponsorshipPacketBook from "../../components/ui/SponsorshipPacketBook";
import Footer from "../../components/layout/Footer";
import { FaInstagram, FaDiscord, FaLinkedin } from "react-icons/fa";

const inputCls =
  "w-full px-4 py-3 border border-[#D0CCC4] bg-white text-[#1A1A1A] text-[0.875rem] placeholder-[#AAAAAA] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-200";

const CONTACT_INFO = [
  {
    label: "Email",
    value: "ieeeembsuf@gmail.com",
    href: "mailto:ieeeembsuf@gmail.com",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Location",
    value: "University of Florida, Gainesville FL",
    href: null,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Meetings",
    value: "General Body Meetings. Check the events page for times.",
    href: "/events",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/ieee_embs_uf", icon: <FaInstagram className="w-4 h-4" /> },
  { label: "Discord",   href: "https://discord.gg/dSeBes8Ywx",           icon: <FaDiscord   className="w-4 h-4" /> },
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/ieee-embs-uf/", icon: <FaLinkedin className="w-4 h-4" /> },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    anonymous: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-feedback", { body: formData });
      if (error) throw error;
      if (data?.ok) {
        showSnackbar("Thank you for your feedback! We'll get back to you soon.", { severity: "success", customColor: "#772583" });
        setFormData({ name: "", email: "", subject: "", message: "", anonymous: false });
      } else {
        throw new Error(data?.error || "Failed to send feedback");
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      showSnackbar("Failed to send feedback. Please try again later.", { severity: "error", customColor: "#b00000" });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Get <em className="not-italic text-[#00629B]">in Touch</em>
            </h1>
            <p className="text-[1rem] text-[#4A4A4A] font-light leading-[1.75] max-w-sm md:text-right md:pb-1">
              Questions, feedback, or interested in partnering? We would love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* ── Form + contact info ───────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-24">

          {/* Form */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-5">
              Feedback Form
            </p>
            <h2
              style={{ fontFamily: "'Lora', Georgia, serif" }}
              className="text-2xl md:text-[2rem] font-medium leading-[1.25] tracking-[-0.01em] text-[#1A1A1A] mb-2"
            >
              Share your thoughts.
            </h2>
            <p className="text-[0.9375rem] text-[#6B7280] font-light leading-[1.75] mb-8">
              Suggestions, bug reports, or general feedback. We read everything.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={formData.anonymous}
                  required={!formData.anonymous}
                  placeholder="Your full name"
                  className={`${inputCls} ${formData.anonymous ? "bg-[#F8F6F1] text-[#AAAAAA] cursor-not-allowed" : ""}`}
                />
              </div>

              {/* Anonymous toggle */}
              <label className="flex items-center gap-2.5 cursor-pointer group w-fit">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="anonymous"
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-[#D0CCC4] peer-checked:bg-[#772583] transition-colors duration-200" />
                  <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white transition-transform duration-200 peer-checked:translate-x-4" />
                </div>
                <span className="text-[0.8125rem] text-[#4A4A4A] font-light select-none">Stay anonymous</span>
              </label>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={formData.anonymous}
                  required={!formData.anonymous}
                  placeholder="your.email@ufl.edu"
                  className={`${inputCls} ${formData.anonymous ? "bg-[#F8F6F1] text-[#AAAAAA] cursor-not-allowed" : ""}`}
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="What is this about?"
                  className={inputCls}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7280] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder="Tell us what is on your mind"
                  className={`${inputCls} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-[#1A1A1A] hover:bg-[#772583] text-white text-[0.875rem] font-medium tracking-wide transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div className="flex flex-col justify-between gap-12 pl-6 border-l-2 border-[#00629B]/20">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00629B] mb-5">
                Contact Info
              </p>
              <h2
                style={{ fontFamily: "'Lora', Georgia, serif" }}
                className="text-2xl md:text-[2rem] font-medium leading-[1.25] tracking-[-0.01em] text-[#1A1A1A] mb-8"
              >
                Other ways to reach us.
              </h2>

              <div className="space-y-6">
                {CONTACT_INFO.map(({ label, value, href, icon }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-8 h-8 border border-[#E8E4DD] flex items-center justify-center shrink-0 text-[#00629B] mt-0.5">
                      {icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#8A8A8A] mb-1">{label}</p>
                      {href ? (
                        <a href={href} className="text-[0.9375rem] text-[#1A1A1A] font-light hover:text-[#00629B] transition-colors duration-200">
                          {value}
                        </a>
                      ) : (
                        <p className="text-[0.9375rem] text-[#1A1A1A] font-light">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Socials */}
            <div className="border-t border-[#E8E4DD] pt-8">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#8A8A8A] mb-5">
                Follow Along
              </p>
              <div className="flex items-center gap-4">
                {SOCIALS.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 border border-[#D0CCC4] hover:border-[#1A1A1A] flex items-center justify-center text-[#6B7280] hover:text-[#1A1A1A] transition-colors duration-200"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sponsorship packet ────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#F8F6F1] border-t border-[#E8E4DD]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 items-start">
            {/* Left label column */}
            <div className="md:col-span-2">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-5">
                Partnerships
              </p>
              <h2
                style={{ fontFamily: "'Lora', Georgia, serif" }}
                className="text-2xl md:text-[2rem] font-medium leading-[1.25] tracking-[-0.01em] text-[#1A1A1A] mb-5"
              >
                Interested in sponsoring UF EMBS?
              </h2>
              <p className="text-[0.9375rem] text-[#6B7280] font-light leading-[1.75] mb-8">
                Browse our sponsorship packet to learn about partnership tiers, what we offer, and how to get involved.
              </p>
              <a
                href="/Sponsorship_Packet.pdf"
                download="IEEE_EMBS_Sponsorship_Packet.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] hover:bg-[#772583] text-white text-[0.875rem] font-medium tracking-wide transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </a>
            </div>

            {/* Book */}
            <div className="md:col-span-3 flex items-center justify-center">
              <SponsorshipPacketBook />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
