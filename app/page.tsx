import { Suspense } from 'react';
import Hero from '@/components/Hero';
import FeaturedCars from '@/components/FeaturedCars';
import ChooseByBrand from '@/components/ChooseByBrand';
import ChooseByCarType from '@/components/ChooseByCarType';
import AvailableCars from '@/components/AvailableCars';
import SoldCars from '@/components/SoldCars';
import Footer from '@/components/Footer';
import About from '@/components/About';
import TrustBar from '@/components/TrustBar';
import WhatsAppChat from '@/components/WhatsAppChat';

interface SearchParams {
  brand?: string;
  carType?: string;
}

// Add revalidation to prevent excessive requests
export const revalidate = 3600; // Revalidate every hour

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <main>
      <Hero />
      
      {/* Load featured cars immediately */}
      <Suspense fallback={<div className="py-20 text-center">Loading featured cars...</div>}>
        <FeaturedCars />
      </Suspense>

      {/* Static components - no data fetching */}
      <ChooseByBrand />
      <About />
      <ChooseByCarType />
      <TrustBar />

      {/* Lazy load available cars */}
      <Suspense fallback={<div className="py-20 text-center">Loading cars...</div>}>
        <AvailableCars filters={params} />
      </Suspense>

      {/* Lazy load sold cars */}
      <Suspense fallback={<div className="py-20 text-center">Loading sold cars...</div>}>
        <SoldCars />
      </Suspense>

      <Footer />
      <WhatsAppChat/>
    </main>
  );
}