import { useState, useEffect, useRef } from "react";
import Footer from "../../components/layout/Footer";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import {
  FaLinkedin, FaGithub, FaReddit, FaWikipediaW, FaBlog,
} from "react-icons/fa";
import {
  MdScience, MdDescription, MdArticle, MdSchool, MdWeb, MdCode,
} from "react-icons/md";
import { SiArxiv } from "react-icons/si";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../../lib/supabase";
import { useSnackbar } from "../../components/ui/Snackbar";
import { careerFields } from "../../data/careerFields";

// ── System prompt built from the careerFields data ──────────────────────────
const CAREER_CONTEXT = careerFields.map((f) => {
  const parts = [`Field: ${f.name}`, `Description: ${f.description}`];
  if (f.skills?.length)    parts.push(`Key skills: ${f.skills.join(", ")}`);
  if (f.classes?.length)   parts.push(`UF courses: ${f.classes.join("; ")}`);
  if (f.companies?.length) parts.push(`Top employers: ${f.companies.join(", ")}`);
  const profs = [
    ...(f.uf_research_professors  || []),
    ...(f.uf_teaching_professors  || []),
  ].map((p) => (typeof p === "string" ? p : p.name));
  if (profs.length) parts.push(`UF faculty: ${profs.join(", ")}`);
  return parts.join(" | ");
}).join("\n");

const SYSTEM_PROMPT = `You are an expert academic and career advisor for UF EMBS (IEEE Engineering in Medicine and Biology Society at the University of Florida). Your role is to help students — especially those curious about switching majors or exploring biomedical engineering subfields — make informed decisions.

You have deep knowledge of the following career fields available to UF students in biomedical engineering:

${CAREER_CONTEXT}

Guidelines:
- Be warm, direct, and specific. Do not give vague platitudes.
- When asked about switching majors or choosing a path, ask about the student's interests, current major, and goals before giving advice.
- Reference specific UF courses, professors, and skills from the data above when relevant.
- If a student mentions a specific field, give concrete next steps: courses to take, professors to reach out to, skills to build.
- Keep responses concise but substantive. Use short paragraphs, not walls of text.
- Never fabricate course numbers or professor names. Only cite what is in your knowledge above.
- If asked something outside your scope, say so honestly and redirect to relevant resources.`;

// ── Link type icon helper ────────────────────────────────────────────────────
function LinkIcon({ type }) {
  const icons = {
    github: <FaGithub size={11} />,
    documentation: <MdDescription size={11} />,
    tutorial: <MdSchool size={11} />,
    article: <MdArticle size={11} />,
    arxiv: <SiArxiv size={11} />,
    wikipedia: <FaWikipediaW size={11} />,
    reddit: <FaReddit size={11} />,
    blog: <FaBlog size={11} />,
    website: <MdWeb size={11} />,
  };
  const labels = {
    github: "GitHub", documentation: "Docs", tutorial: "Tutorial",
    article: "Article", arxiv: "arXiv", wikipedia: "Wikipedia",
    reddit: "Reddit", blog: "Blog", website: "Website",
  };
  return (
    <span className="inline-flex items-center gap-1">
      {icons[type] || <MdCode size={11} />}
      {labels[type] || "Resource"}
    </span>
  );
}

// ── AI Advisor chat component ────────────────────────────────────────────────
function AdvisorChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm the UF EMBS AI Advisor. I can help you explore biomedical engineering career fields, understand what UF courses and professors are relevant to your interests, and think through major or concentration decisions. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...nextMessages,
          ],
          temperature: 0.65,
          max_tokens: 800,
        }),
      });

      if (!res.ok) throw new Error(`Groq API error: ${res.status}`);
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? "Sorry, I could not generate a response. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Groq error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong connecting to the advisor. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    // Auto-grow textarea
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  const SUGGESTIONS = [
    "I'm thinking of switching to BME, where do I start?",
    "I'm a BME freshman, where do I start?",
    "What UF courses are best for medical imaging?",
    "What companies hire UF BME graduates?",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Message thread */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scrollbar-sleek px-6 py-6 space-y-5 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-6 h-6 border border-[#00629B]/30 bg-[#00629B]/8 flex items-center justify-center shrink-0 mr-3 mt-0.5">
                <span className="text-[8px] font-bold text-[#00629B]">AI</span>
              </div>
            )}
            <div
              className={`max-w-[78%] text-[0.875rem] leading-[1.75] font-light whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-[#1A1A1A] text-white px-4 py-3"
                  : "text-[#1A1A1A]"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 border border-[#00629B]/30 bg-[#00629B]/8 flex items-center justify-center shrink-0 mr-3 mt-0.5">
              <span className="text-[8px] font-bold text-[#00629B]">AI</span>
            </div>
            <div className="flex items-center gap-1.5 py-2">
              <span className="w-1.5 h-1.5 bg-[#D0CCC4] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-[#D0CCC4] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-[#D0CCC4] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Suggestions — only on first message */}
        {messages.length === 1 && !loading && (
          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                className="text-[0.75rem] font-light text-[#6B7280] border border-[#D0CCC4] px-3 py-1.5 hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors duration-200"
              >
                {s}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Input bar */}
      <div className="border-t border-[#E8E4DD] px-4 py-3 flex items-end gap-3 bg-white">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask about BME careers, courses, or major decisions..."
          rows={1}
          disabled={loading}
          className="flex-1 resize-none text-[0.875rem] text-[#1A1A1A] placeholder-[#AAAAAA] font-light focus:outline-none leading-[1.6] py-1 bg-transparent disabled:opacity-60 max-h-[160px] overflow-y-auto"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="shrink-0 w-8 h-8 bg-[#1A1A1A] hover:bg-[#772583] disabled:bg-[#D0CCC4] disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200 self-end mb-0.5"
        >
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function Resources() {
  const [selectedField, setSelectedField] = useState(null);
  const [favoriteFields, setFavoriteFields] = useState([]);
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (user) fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    const { data } = await supabase
      .from("favorite_careers")
      .select("career_name")
      .eq("user_id", user.id);
    if (data) setFavoriteFields(data.map((item) => item.career_name));
  };

  const toggleFavorite = async (careerName) => {
    if (!user) {
      showSnackbar("Log in to save favorites!", { customColor: "#b00000" });
      return;
    }
    const isFavorited = favoriteFields.includes(careerName);
    if (isFavorited) {
      const { error } = await supabase
        .from("favorite_careers").delete()
        .eq("user_id", user.id).eq("career_name", careerName);
      if (!error) setFavoriteFields((prev) => prev.filter((n) => n !== careerName));
    } else {
      const { error } = await supabase
        .from("favorite_careers").insert([{ user_id: user.id, career_name: careerName }]);
      if (!error) setFavoriteFields((prev) => [...prev, careerName]);
    }
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen flex flex-col bg-[#F8F6F1]">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
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
              Career <em className="not-italic text-[#00629B]">Fields</em>
            </h1>
            <p className="text-[1rem] text-[#4A4A4A] font-light leading-[1.75] max-w-sm md:text-right md:pb-1">
              Explore {careerFields.length} biomedical engineering specializations and the opportunities each one opens.
            </p>
          </div>
        </div>
      </section>

      {/* ── Career pills + AI advisor ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white flex-1">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* Career field pills */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-6">
              Explore Fields
            </p>
            <div className="flex flex-wrap gap-2">
              {careerFields.map((field, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedField(index)}
                  className={`text-[0.8125rem] font-medium px-4 py-2 border transition-colors duration-200 cursor-pointer ${
                    selectedField === index
                      ? "bg-[#772583] text-white border-[#772583]"
                      : "bg-white text-[#4A4A4A] border-[#D0CCC4] hover:border-[#772583] hover:text-[#772583]"
                  }`}
                >
                  {field.name}
                </button>
              ))}
            </div>
          </div>

          {/* AI Advisor section */}
          <div>
            <div className="mb-8 grid md:grid-cols-5 gap-6 items-end">
              <div className="md:col-span-3">
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00629B] mb-4">
                  AI Advisor
                </p>
                <h2
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                  className="text-2xl md:text-[2rem] font-medium leading-[1.25] tracking-[-0.01em] text-[#1A1A1A]"
                >
                  Not sure which path is right for you?
                </h2>
              </div>
              <p className="md:col-span-2 text-[0.9375rem] text-[#6B7280] font-light leading-[1.75] self-end">
                Ask about BME careers, UF courses, switching majors, or what skills to build. The advisor knows UF's specific offerings.
              </p>
            </div>

            <div
              className="border border-[#00629B]/20 border-l-[3px] border-l-[#00629B] flex flex-col"
              style={{ height: "520px", background: "linear-gradient(to bottom, #F0F7FC, #ffffff)", boxShadow: "0 2px 24px rgba(0,98,155,0.08)" }}
            >
              <AdvisorChat />
            </div>

            <p className="text-[11px] text-[#9A9A9A] font-light mt-3 tracking-wide">
              Powered by Llama 3.3 70B via Groq. Responses are AI-generated and may contain inaccuracies. Always verify course and faculty information with UF directly.
            </p>
          </div>
        </div>
      </section>

      {/* ── Career detail modal ──────────────────────────────────────────── */}
      {selectedField !== null && careerFields[selectedField] && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-white max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col"
            style={{ boxShadow: "0 8px 48px rgba(26,26,26,0.18)" }}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between p-8 border-b border-[#E8E4DD] shrink-0">
              <div className="flex-1 pr-8">
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#772583] mb-3">
                  Career Field
                </p>
                <h2
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                  className="text-3xl md:text-[2.25rem] font-medium leading-[1.2] tracking-[-0.01em] text-[#1A1A1A] mb-3"
                >
                  {careerFields[selectedField].name}
                </h2>
                {careerFields[selectedField].description && (
                  <p className="text-[1rem] text-[#4A4A4A] font-light leading-[1.75]">
                    {careerFields[selectedField].description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => toggleFavorite(careerFields[selectedField].name)}
                  className="text-xl transition-transform duration-200 hover:scale-110"
                  title={favoriteFields.includes(careerFields[selectedField].name) ? "Remove from favorites" : "Save to favorites"}
                >
                  {favoriteFields.includes(careerFields[selectedField].name)
                    ? <IoMdHeart className="text-[#c0392b]" />
                    : <IoMdHeartEmpty className="text-[#D0CCC4] hover:text-[#9A9A9A]" />}
                </button>
                <button
                  onClick={() => setSelectedField(null)}
                  className="w-8 h-8 border border-[#E8E4DD] hover:border-[#1A1A1A] flex items-center justify-center transition-colors duration-200"
                >
                  <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto scrollbar-sleek p-8 flex-1">
              <div className={`grid grid-cols-1 ${careerFields[selectedField].image ? "lg:grid-cols-3" : ""} gap-8`}>

                {/* Image */}
                {careerFields[selectedField].image && (
                  <div className="lg:col-span-1">
                    <div className="sticky top-0 overflow-hidden border border-[#E8E4DD]">
                      <img
                        src={careerFields[selectedField].image}
                        alt={careerFields[selectedField].name}
                        className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className={`space-y-6 ${careerFields[selectedField].image ? "lg:col-span-2" : "lg:col-span-3"}`}>

                  {/* Professors row */}
                  <div className={`grid gap-5 ${
                    careerFields[selectedField].uf_research_professors && careerFields[selectedField].uf_teaching_professors
                      ? "md:grid-cols-2" : "grid-cols-1"
                  }`}>
                    {/* UF Research Professors */}
                    {careerFields[selectedField].uf_research_professors && (
                      <ProfessorBlock
                        title="UF Research Faculty"
                        label="Research"
                        professors={careerFields[selectedField].uf_research_professors}
                        showLab
                      />
                    )}
                    {/* UF Teaching Professors */}
                    {careerFields[selectedField].uf_teaching_professors && (
                      <ProfessorBlock
                        title="UF Teaching Faculty"
                        label="Teaching"
                        professors={careerFields[selectedField].uf_teaching_professors}
                      />
                    )}
                  </div>

                  {/* External Professors */}
                  {careerFields[selectedField].external_professors && (
                    <ProfessorBlock
                      title="External Faculty"
                      label="External"
                      professors={careerFields[selectedField].external_professors}
                      showLab
                    />
                  )}

                  {/* Skills + Companies */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {careerFields[selectedField].skills && (
                      <InfoBlock title="Relevant Skills" label="Skills">
                        <div className="flex flex-wrap gap-1.5">
                          {careerFields[selectedField].skills.map((skill, i) => (
                            <span key={i} className="px-2.5 py-1 bg-[#1A1A1A] text-white text-[11px] font-medium tracking-wide">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </InfoBlock>
                    )}
                    {careerFields[selectedField].companies && (
                      <InfoBlock title="Top Employers" label="Companies">
                        <div className="space-y-1">
                          {careerFields[selectedField].companies.map((company, i) => (
                            <div key={i} className="text-[0.875rem] text-[#4A4A4A] font-light py-1.5 border-b border-[#F0EDE8] last:border-0">
                              {company}
                            </div>
                          ))}
                        </div>
                      </InfoBlock>
                    )}
                  </div>

                  {/* UF Courses */}
                  {careerFields[selectedField].classes?.length > 0 && (
                    <InfoBlock title="Related UF Courses" label="Courses">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {careerFields[selectedField].classes.map((c, i) => (
                          <div key={i} className="text-[0.8125rem] text-[#4A4A4A] font-light py-2 px-3 bg-[#F8F6F1] border-l-2 border-[#00629B]/30">
                            {c}
                          </div>
                        ))}
                      </div>
                    </InfoBlock>
                  )}

                  {/* Project Ideas */}
                  {careerFields[selectedField].projectIdeas?.length > 0 && (
                    <InfoBlock title="Project Ideas" label="Projects">
                      <div className="space-y-4">
                        {careerFields[selectedField].projectIdeas.map((project, i) => {
                          const text  = typeof project === "string" ? project : project.text;
                          const links = typeof project === "object" ? project.links : null;
                          return (
                            <div key={i} className="border-l-2 border-[#E8E4DD] pl-4 py-1">
                              <p className="text-[0.875rem] text-[#4A4A4A] font-light leading-[1.75] mb-2">{text}</p>
                              {links?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {links.map((link, li) => (
                                    <a
                                      key={li}
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#D0CCC4] text-[11px] font-medium text-[#4A4A4A] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors duration-200"
                                    >
                                      <LinkIcon type={link.type} />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </InfoBlock>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// ── Shared modal sub-components ──────────────────────────────────────────────
function InfoBlock({ title, label, children }) {
  return (
    <div className="border border-[#E8E4DD] p-5">
      <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#8A8A8A] mb-1">{label}</p>
      <h3 style={{ fontFamily: "'Lora', Georgia, serif" }}
        className="text-[1rem] font-medium text-[#1A1A1A] mb-4">{title}</h3>
      {children}
    </div>
  );
}

function ProfessorBlock({ title, label, professors, showLab = false }) {
  return (
    <InfoBlock title={title} label={label}>
      <div className="space-y-2">
        {professors.map((professor, i) => {
          const name = typeof professor === "string" ? professor : professor.name;
          const data = typeof professor === "object" ? professor : null;
          return (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[#F0EDE8] last:border-0">
              <span className="text-[0.875rem] text-[#1A1A1A] font-light">{name}</span>
              {data && (
                <div className="flex gap-3">
                  {data.linkedin && (
                    <a href={data.linkedin} target="_blank" rel="noopener noreferrer"
                      className="text-[#AAAAAA] hover:text-[#00629B] transition-colors duration-200">
                      <FaLinkedin size={14} />
                    </a>
                  )}
                  {showLab && data.lab && (
                    <a href={data.lab} target="_blank" rel="noopener noreferrer"
                      className="text-[#AAAAAA] hover:text-[#772583] transition-colors duration-200">
                      <MdScience size={14} />
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </InfoBlock>
  );
}
