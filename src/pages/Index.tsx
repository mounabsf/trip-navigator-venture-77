
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PopularDestinations from '@/components/PopularDestinations';
import Features from '@/components/Features';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <PopularDestinations />
      <Features />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
