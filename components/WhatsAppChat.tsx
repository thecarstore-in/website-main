'use client';

import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppChat() {
  const phoneNumber = '918135843184';
  const message = encodeURIComponent(
    'Hi, I am interested in a car listed on your website.'
  );

  const [autoVisible, setAutoVisible] = useState(false);

  useEffect(() => {
    const showBubble = () => {
      setAutoVisible(true);
      setTimeout(() => setAutoVisible(false), 5000);
    };

    // show once after load
    showBubble();

    const interval = setInterval(showBubble, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Pop text */}
      <div
        className={`
          hidden md:block
          bg-white text-black
          px-4 py-2 rounded-full
          text-sm font-medium
          shadow-lg
          border border-black
          transition-all duration-300
          ${
            autoVisible
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-4 pointer-events-none'
          }
        `}
      >
        Have any questions? <span className="font-bold">Talk to us</span>
      </div>

      {/* WhatsApp button */}
      <a
        href={`https://wa.me/${phoneNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setAutoVisible(true)}
        onMouseLeave={() => setAutoVisible(false)}
        className="
          flex items-center justify-center
          w-14 h-14 rounded-full
          bg-[#25D366] text-white
          shadow-xl
          transition-transform duration-300
          hover:scale-110
          active:scale-95
        "
      >
        <FaWhatsapp className="text-3xl" />
      </a>
    </div>
  );
}
