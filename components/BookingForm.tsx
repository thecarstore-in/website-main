'use client';

import { useState } from 'react';
import { Car } from '@/lib/types';

interface BookingFormProps {
  car: Car;
}

export default function BookingForm({ car }: BookingFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone) {
      alert('Please enter your name and phone number');
      return;
    }

    setIsSubmitting(true);

    // Format WhatsApp message
    const message = `Hi, I'm interested in booking the ${car.brand} ${car.model}${
      car.variant ? ` ${car.variant}` : ''
    }.%0A%0AName: ${name}%0APhone: ${phone}%0A%0APlease contact me for more details.`;

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    setIsSubmitting(false);
  };

  const handleWhatsAppQuery = () => {
    const message = `Hi, I have a query about the ${car.brand} ${car.model}${
      car.variant ? ` ${car.variant}` : ''
    }.`;

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="border border-black p-6 bg-white text-black">
        <h3 className="text-xl font-bold mb-6">Book This Vehicle</h3>
        
        <form onSubmit={handleBookVehicle} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full border border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
              className="w-full border border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="hover:rounded-2xl w-full bg-black text-white px-6 py-4 font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {isSubmitting ? 'Opening WhatsApp...' : 'Book Vehicle on WhatsApp'}
          </button>
        </form>
      </div>

      <button
        onClick={handleWhatsAppQuery}
        className="hover:rounded-2xl text-black w-full border-2 border-black px-6 py-4 font-medium hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Have Questions? Chat on WhatsApp
      </button>
    </div>
  );
}