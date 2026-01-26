import {
  FaCar,
  FaShieldAlt,
  FaCertificate,
} from 'react-icons/fa';

export default function TrustBar() {
  return (
    <div className="border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
              <FaShieldAlt className="text-white" size={20} />
            </div>
            <div>
              <p className="font-bold text-white mb-1">Verified Listings</p>
              <p className="text-xs text-gray-400">Every vehicle thoroughly inspected</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
              <FaCertificate className="text-white" size={20} />
            </div>
            <div>
              <p className="font-bold text-white mb-1">Quality Assured</p>
              <p className="text-xs text-gray-400">Premium pre-owned vehicles only</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
              <FaCar className="text-white" size={20} />
            </div>
            <div>
              <p className="font-bold text-white mb-1">Best Price Guaranteed</p>
              <p className="text-xs text-gray-400">Competitive market pricing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}