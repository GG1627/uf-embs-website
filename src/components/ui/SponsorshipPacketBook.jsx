import { useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Page1 from '../../assets/sponsorship_packet/Page1.jpg';
import Page2 from '../../assets/sponsorship_packet/Page2.jpg';
import Page3 from '../../assets/sponsorship_packet/Page3.jpg';
import Page4 from '../../assets/sponsorship_packet/Page4.jpg';
import Page5 from '../../assets/sponsorship_packet/Page5.jpg';
import Page6 from '../../assets/sponsorship_packet/Page6.jpg';
import Page7 from '../../assets/sponsorship_packet/Page7.jpg';

export default function SponsorshipPacketBook() {
  const bookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 7;

  const nextPage = () => {
    if (bookRef.current && currentPage < totalPages - 1) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (bookRef.current && currentPage > 0) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const onPageFlip = (e) => {
    setCurrentPage(e.data);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center overflow-hidden">
      <div className="border border-[#1A1A1A]/20" style={{ boxShadow: "0 2px 24px rgba(26,26,26,0.10)" }}>
      <HTMLFlipBook
        ref={bookRef}
        width={520}
        height={680}
        size="fixed"
        minWidth={420}
        maxWidth={620}
        minHeight={570}
        maxHeight={780}
        showCover={false}
        showShadow={false}
        maxShadowOpacity={0}
        flippingTime={800}
        onFlip={onPageFlip}
        clickEventForward="bottom"
        clickEventBackward="bottom"
        useMouseEvents={true}
        style={{ cursor: 'pointer' }}
      >
        <div><img src={Page1} alt="Cover - Page 1" className="w-full h-full object-contain" /></div>
        <div><img src={Page2} alt="Page 2" className="w-full h-full object-contain" /></div>
        <div><img src={Page3} alt="Page 3" className="w-full h-full object-contain" /></div>
        <div><img src={Page4} alt="Page 4" className="w-full h-full object-contain" /></div>
        <div><img src={Page5} alt="Page 5" className="w-full h-full object-contain" /></div>
        <div><img src={Page6} alt="Page 6" className="w-full h-full object-contain" /></div>
        <div><img src={Page7} alt="Page 7" className="w-full h-full object-contain" /></div>
      </HTMLFlipBook>
      </div>

      {/* Navigation arrows */}
      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          aria-label="Previous page"
          className={`w-9 h-9 border flex items-center justify-center transition-colors duration-200 ${
            currentPage === 0
              ? "border-[#E8E4DD] text-[#D0CCC4] cursor-not-allowed"
              : "border-[#D0CCC4] text-[#4A4A4A] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#8A8A8A] min-w-[4rem] text-center">
          {currentPage + 1} / {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          aria-label="Next page"
          className={`w-9 h-9 border flex items-center justify-center transition-colors duration-200 ${
            currentPage === totalPages - 1
              ? "border-[#E8E4DD] text-[#D0CCC4] cursor-not-allowed"
              : "border-[#D0CCC4] text-[#4A4A4A] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
