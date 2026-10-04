import React from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/initialData';
import { Target, CheckCircle2, MessageCircle, Phone, ArrowRight } from 'lucide-react';

export const MissionView: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="py-12 sm:py-16 space-y-16">
      {/* Header Banner */}
      <section className="container">
        <div className="bg-[#092744] text-white p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-md">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden md:block">
            <img
              src="/src/assets/images/workshop_carpentry_cutting_1791093578434.jpg"
              alt="Artisanal craftsmanship"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="section-tag text-[#f5b82e] text-[11px] font-extrabold tracking-[2px] uppercase block mb-1">
              OUR COMMITMENT & PURPOSE
            </span>

            <h1 className="font-serif text-[36px] sm:text-[50px] leading-[1.1] font-bold text-white tracking-tight">
              Our Mission at Mudis Merit Venture
            </h1>

            <p className="text-white/80 text-[16px] leading-relaxed">
              To deliver uncompromising comfort, durable craftsmanship, and accessible foam and furniture solutions that enrich homes, institutions, and workspaces throughout Ibadan, Oyo State, and South-Western Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="container">
        <div className="section-heading center max-w-[700px] mx-auto text-center mb-14">
          <span className="section-tag text-[#e97822] text-[11px] font-extrabold tracking-[2px] uppercase block mb-2">
            GUIDING STANDARDS
          </span>
          <h2 className="font-serif text-[32px] sm:text-[44px] text-[#092744] font-bold leading-[1.15] mb-3">
            How we fulfill our promise daily
          </h2>
          <p className="text-[#75808b] text-[15px] leading-relaxed">
            Every mattress cut, sofa frame assembled, and upholstery stitch is guided by four foundational commitments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 border border-[#e5e8eb] shadow-xs space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#eaf2f9] text-[#123b68] flex items-center justify-center font-bold text-lg font-serif">
              01
            </div>
            <h3 className="text-xl font-bold text-[#092744] font-serif">
              Honest Raw Materials & Zero Sag
            </h3>
            <p className="text-[#75808b] text-[14px] leading-relaxed">
              We reject substandard chalky foam fillers. We utilize only high-resilience, certified polyurethane and orthopaedic rebonded cores tested for durability. Our furniture frames use seasoned, pest-treated Nigerian hardwoods (Mahogany, Teak, and Obeche) to guarantee no warping or squeaking.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#159447]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tested for 5+ years of daily resilience</span>
            </div>
          </div>

          <div className="bg-white p-8 border border-[#e5e8eb] shadow-xs space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#eaf2f9] text-[#123b68] flex items-center justify-center font-bold text-lg font-serif">
              02
            </div>
            <h3 className="text-xl font-bold text-[#092744] font-serif">
              Ergonomic Spinal Health & Rest
            </h3>
            <p className="text-[#75808b] text-[14px] leading-relaxed">
              Sleep is the foundation of health. Our mattress and sofa cushion designs prioritize proper spinal alignment, pressure point relief, and proper ventilation. Whether you require soft luxury or physician-recommended orthopaedic firmness, we tailor the exact density for your body.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#159447]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Anatomically calibrated firmness grades</span>
            </div>
          </div>

          <div className="bg-white p-8 border border-[#e5e8eb] shadow-xs space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#eaf2f9] text-[#123b68] flex items-center justify-center font-bold text-lg font-serif">
              03
            </div>
            <h3 className="text-xl font-bold text-[#092744] font-serif">
              Empowering Local Ibadan Artisans
            </h3>
            <p className="text-[#75808b] text-[14px] leading-relaxed">
              Based at Akinbile along Arulogun Road, Ojoo, we actively train youth apprentices and master craftspeople in traditional joinery, modern pattern cutting, foam slicing, and precision upholstery sewing, creating sustainable community livelihood in Oyo State.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#159447]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Proudly indigenous manufacturing</span>
            </div>
          </div>

          <div className="bg-white p-8 border border-[#e5e8eb] shadow-xs space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#eaf2f9] text-[#123b68] flex items-center justify-center font-bold text-lg font-serif">
              04
            </div>
            <h3 className="text-xl font-bold text-[#092744] font-serif">
              Direct Workshop Value & Transparency
            </h3>
            <p className="text-[#75808b] text-[14px] leading-relaxed">
              By controlling our own foam cutting machinery and woodworking floor, we eliminate third-party markup fees. Customers receive luxury showroom finishes at direct factory-to-consumer prices with upfront timeline delivery commitments.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#159447]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Direct workshop prices in Nigerian Naira</span>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Visit Banner */}
      <section className="container">
        <div className="bg-[#f6f7f8] p-8 sm:p-10 border border-[#e5e8eb] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold font-serif text-[#092744]">
              Visit our workshop to inspect our foam batches & timber
            </h3>
            <p className="text-[#75808b] text-[14px]">
              Located beside Tipper Garage, Akinbile, Arulogun Road, Ojoo, Ibadan.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('products')}
              className="btn btn-primary"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
