import React from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/initialData';
import { MEDIA_ASSETS } from '../assets/mediaAssets';
import { Compass, Sparkles, Building2, Layers } from 'lucide-react';

export const VisionView: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="py-12 sm:py-16 space-y-16">
      {/* Vision Header Banner */}
      <section className="container">
        <div className="bg-[#092744] text-white p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-md">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 pointer-events-none hidden md:block">
            <img
              src={MEDIA_ASSETS.hero}
              alt="Visionary interiors"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="section-tag text-[#f5b82e] text-[11px] font-extrabold tracking-[2px] uppercase block mb-1">
              LONG-TERM ASPIRATIONS
            </span>

            <h1 className="font-serif text-[36px] sm:text-[50px] leading-[1.1] font-bold text-white tracking-tight">
              Our Vision for Mudis Merit Venture
            </h1>

            <p className="text-white/80 text-[16px] leading-relaxed">
              To be recognised as South-Western Nigeria’s benchmark provider of orthopaedic foam solutions, durable handcrafted living room suites, and sustainable interior furniture that elevates everyday African living.
            </p>
          </div>
        </div>
      </section>

      {/* Strategic Horizons */}
      <section className="container">
        <div className="section-heading center max-w-[700px] mx-auto text-center mb-14">
          <span className="section-tag text-[#e97822] text-[11px] font-extrabold tracking-[2px] uppercase block mb-2">
            THE PATH FORWARD
          </span>
          <h2 className="font-serif text-[32px] sm:text-[44px] text-[#092744] font-bold leading-[1.15] mb-3">
            Building for the next generation
          </h2>
          <p className="text-[#75808b] text-[15px] leading-relaxed">
            Our strategic vision focuses on technical expansion, sustainable material reuse, and regional supply leadership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 border border-[#e5e8eb] shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-[#eaf2f9] text-[#123b68] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#123b68]" />
              </div>
              <h3 className="text-lg font-bold text-[#092744] font-serif">
                Regional Hospitality & Corporate Partner
              </h3>
              <p className="text-[#75808b] text-[14px] leading-relaxed">
                Becoming the primary bulk supplier of custom hotel mattresses, executive boardroom seating, and student housing furnishings for premier institutions throughout Ibadan, Oyo, and neighboring states.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e5e8eb] text-xs text-[#123b68] font-bold uppercase tracking-wider">
              Commercial Contract Scalability
            </div>
          </div>

          <div className="bg-white p-8 border border-[#e5e8eb] shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-[#eaf2f9] text-[#123b68] flex items-center justify-center">
                <Layers className="w-6 h-6 text-[#123b68]" />
              </div>
              <h3 className="text-lg font-bold text-[#092744] font-serif">
                Eco-Friendly Rebonded Foam Innovation
              </h3>
              <p className="text-[#75808b] text-[14px] leading-relaxed">
                Advancing our zero-waste manufacturing protocol by transforming virgin polyurethane offcuts into ultra-dense bonded orthopaedic cores, reducing environmental impact while creating superior spinal-support mattresses.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e5e8eb] text-xs text-[#123b68] font-bold uppercase tracking-wider">
              100% Circular Foam Recovery
            </div>
          </div>

          <div className="bg-white p-8 border border-[#e5e8eb] shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-[#eaf2f9] text-[#123b68] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#123b68]" />
              </div>
              <h3 className="text-lg font-bold text-[#092744] font-serif">
                Digital Custom Tailoring & Sizing
              </h3>
              <p className="text-[#75808b] text-[14px] leading-relaxed">
                Allowing customers anywhere in Nigeria to configure custom foam dimensions, select fabric swatches, calculate live estimates, and receive doorstep delivery with total quality guarantees.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e5e8eb] text-xs text-[#123b68] font-bold uppercase tracking-wider">
              Modern Digital Convenience
            </div>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="container">
        <div className="bg-[#092744] text-white p-8 sm:p-12 text-center space-y-4 shadow-md">
          <span className="section-tag text-[#f5b82e] text-[11px] font-extrabold tracking-[2px] uppercase block mb-2">
            THE FOUNDER'S PLEDGE
          </span>
          <blockquote className="font-serif text-[22px] sm:text-[28px] italic text-white max-w-2xl mx-auto leading-relaxed">
            "Comfort should never be a luxury that wears out in six months. At Mudis Merit Venture, we engineer furniture and foam products that withstand the test of real family and commercial life."
          </blockquote>
          <div className="pt-2 text-xs text-white/70">
            <strong className="text-white block text-sm font-sans not-italic">
              Mudis Merit Venture Management
            </strong>
            <span>Ojoo, Ibadan, Oyo State</span>
          </div>
        </div>
      </section>
    </div>
  );
};
