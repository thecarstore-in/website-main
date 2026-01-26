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

interface SearchParams {
  brand?: string;
  carType?: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Await searchParams to unwrap the Promise
  const params = await searchParams;

  return (
    <main>
      <Hero />
      
      <Suspense fallback={<div className="py-20 text-center">Loading featured cars...</div>}>
        <FeaturedCars />
      </Suspense>

      <ChooseByBrand />
      <About/>
      <ChooseByCarType />
      <TrustBar/>

      <Suspense fallback={<div className="py-20 text-center">Loading cars...</div>}>
        <AvailableCars filters={params} />
      </Suspense>

      <Suspense fallback={<div className="py-20 text-center">Loading sold cars...</div>}>
        <SoldCars />
      </Suspense>

      <Footer />
    </main>
  );
}