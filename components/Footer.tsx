import Link from 'next/link';
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-900">
      {/* Main Footer */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-12 md:grid-cols-4 lg:grid-cols-12 text-center md:text-left">

            {/* Brand */}
            <div className="md:col-span-2 lg:col-span-4 space-y-6 mx-auto md:mx-0">
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-2xl font-bold tracking-tight text-black mb-3">
                  The Car Store
                </h3>
                <div className="w-16 h-1 bg-black rounded-full mb-4"></div>
              </div>

              <p className="text-sm text-gray-800 leading-relaxed max-w-sm mx-auto md:mx-0">
                A curated marketplace for premium pre-owned vehicles, built on
                transparency, quality, and trust. Your journey to finding the
                perfect car starts here.
              </p>

              {/* Social */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-black">
                  Connect With Us
                </p>
                <div className="flex gap-3 justify-center md:justify-start">
                  <a
                    href="https://www.instagram.com/thecarstore_guwahati"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all"
                  >
                    <FaInstagram size={18} />
                  </a>

                  <a
                    href="https://www.facebook.com/profile.php?id=100063880484633"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all"
                  >
                    <FaFacebookF size={18} />
                  </a>

                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all"
                  >
                    <FaYoutube size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-1 lg:col-span-2 space-y-4">
              <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <nav className="flex flex-col gap-3 text-sm items-center md:items-start">
                {[
                  ['/#inventory', 'Browse Inventory'],
                  ['#types', 'Body Types'],
                  ['#brands', 'Popular Brands'],
                  ['#about', 'About Us'],
                ].map(([href, label]) => (
                  <Link
                    key={label}
                    href={href}
                    className="text-gray-800 hover:text-black transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-black transition-colors"></span>
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Customer Care */}
            <div className="md:col-span-1 lg:col-span-3 space-y-4">
              <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-4">
                Customer Care
              </h4>

              <div className="flex flex-col gap-6 text-sm items-center md:items-start">
                {/* Phone */}
                <div className="flex items-start gap-3 text-gray-800">
                  <div className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center">
                    <FaPhoneAlt size={14} />
                  </div>
                  <div className="space-y-1 text-center md:text-left">
                    <p className="text-xs text-gray-500">Call Us</p>
                    <Link href="tel:+918135843184" className="block font-medium">
                      +91 81358 43184
                    </Link>
                    <Link href="tel:+919706713213" className="block font-medium">
                      +91 97067 13213
                    </Link>
                  </div>
                </div>

                {/* Email */}
                <Link
                  href="mailto:thecarstore.in@gmail.com"
                  className="flex items-center gap-3 text-gray-800 hover:text-black transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center">
                    <FaEnvelope size={14} />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs text-gray-500">Email Us</p>
                    <p className="font-medium">thecarstore.in@gmail.com</p>
                  </div>
                </Link>

                {/* Map */}
                <Link
                  href="https://www.google.com/maps?q=The+Car+Store"
                  target="_blank"
                  className="flex items-center gap-3 text-gray-800 hover:text-black transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center">
                    <FaMapMarkerAlt size={14} />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs text-gray-500">Visit Us</p>
                    <p className="font-medium">View on Map →</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Map Embed */}
            <div className="md:col-span-4 lg:col-span-3 space-y-4 text-center md:text-left">
              <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-4">
                Find Us
              </h4>
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden max-w-sm mx-auto md:mx-0">
                <iframe
                  src="https://www.google.com/maps?q=The+Car+Store&output=embed"
                  width="100%"
                  height="200"
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-800">
            <p>© {currentYear} The Car Store. All rights reserved.</p>

            <div className="flex items-center gap-4">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <span>•</span>
              <Link href="/terms-of-service">Terms of Service</Link>
              <span>•</span>
              <Link href="/sitemap">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
