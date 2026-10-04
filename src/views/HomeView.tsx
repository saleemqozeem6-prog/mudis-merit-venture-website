import React from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/initialData';
import { 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  Award, 
  Armchair, 
  Hammer, 
  HeartHandshake, 
  Scissors, 
  PenTool, 
  Wrench, 
  ChevronRight
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setCurrentView, setSelectedCategoryFilter, services, gallery } = useApp();

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'chair':
        return <Armchair className="w-7 h-7 text-[#e97822]" />;
      case 'scissors':
        return <Scissors className="w-7 h-7 text-[#e97822]" />;
      case 'penRuler':
        return <PenTool className="w-7 h-7 text-[#e97822]" />;
      case 'wrench':
      default:
        return <Wrench className="w-7 h-7 text-[#e97822]" />;
    }
  };

  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="hero relative min-h-[680px] lg:min-h-[720px] flex items-center overflow-hidden">
        {/* Background Image with Rich Multi-stop Contrast Scrim */}
        <div className="hero-overlay absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_furniture_foam_1791093541655.jpg"
            alt="Mudis Merit Venture foam and furniture Ibadan"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-[1.02] transition-transform duration-1000"
          />
          {/* Deep Navy to Translucent Gradient Scrim for high legibility */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, rgba(7, 28, 48, 0.96) 0%, rgba(7, 28, 48, 0.88) 48%, rgba(7, 28, 48, 0.42) 100%)'
            }}
          />
          {/* Bottom subtle shade */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#071c30]/60 to-transparent" />
        </div>

        <div className="container hero-content relative z-10 py-16 sm:py-24">
          {/* Hero Copy */}
          <div className="hero-copy">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#092744]/90 border border-[#f5b82e]/50 text-[#f5b82e] text-[11px] font-extrabold tracking-[2.2px] uppercase mb-5 backdrop-blur-xs shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#f5b82e] animate-pulse"></span>
              FOAM & FURNITURE COMPANY · IBADAN
            </div>

            <h1 className="hero-heading font-serif text-[42px] sm:text-[58px] lg:text-[72px] leading-[1.04] tracking-[-1.5px] font-bold text-white mb-5 drop-shadow-md">
              Quality Foam & Furniture
              <span className="block mt-1.5 font-serif italic text-[#f5b82e] bg-gradient-to-r from-[#f5b82e] via-[#ffc95c] to-[#e97822] bg-clip-text text-transparent">
                For Comfortable Living.
              </span>
            </h1>

            <p className="text-white/90 text-[16px] sm:text-[18px] leading-[1.7] max-w-[640px] mb-6">
              Quality foam products and professionally crafted furniture designed for homes, offices, hotels, businesses and comfortable living spaces in Ibadan and Oyo State.
            </p>

            {/* Quality & Trust Highlights */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-white/90 mb-8">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#f5b82e]/20 text-[#f5b82e] flex items-center justify-center font-bold text-xs">✓</span>
                100% High Density Foam
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#f5b82e]/20 text-[#f5b82e] flex items-center justify-center font-bold text-xs">✓</span>
                Solid Hardwood Framing
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#f5b82e]/20 text-[#f5b82e] flex items-center justify-center font-bold text-xs">✓</span>
                Fast Delivery in Ibadan
              </span>
            </div>

            <div className="hero-buttons flex flex-wrap gap-3">
              <button
                onClick={() => setCurrentView('products')}
                className="btn btn-primary shadow-lg shadow-[#e97822]/25"
              >
                <span>View Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp shadow-lg shadow-[#159447]/25"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Order on WhatsApp</span>
              </a>

              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="btn btn-outline hover:bg-white/10"
              >
                <Phone className="w-4 h-4 text-[#f5b82e]" />
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* Hero Side Trust Card */}
          <div className="hero-side">
            <div className="hero-info bg-[#092744]/75 backdrop-blur-md p-6 rounded-sm border border-[#f5b82e]/30 shadow-xl space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/15">
                <span className="text-[#f5b82e] text-[11px] font-extrabold tracking-[1.8px] uppercase">
                  VISIT SHOWROOM
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <strong className="block text-2xl font-serif font-bold text-white">
                Ojoo, Ibadan
              </strong>
              <p className="text-[13px] text-white/80 leading-relaxed">
                No. 1, Beside Tipper Garage,
                <br />
                Akinbile, Arulogun Road,
                <br />
                Oyo State, Nigeria.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('contact')}
                  className="text-[#f5b82e] hover:text-white text-xs font-bold inline-flex items-center gap-1 transition-colors"
                >
                  <span>View Route & Directions</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTRODUCTION ================= */}
      <section className="intro-section section">
        <div className="container intro-grid">
          {/* Image with label */}
          <div className="section-image furniture-image relative rounded-sm overflow-hidden">
            <img
              src="/src/assets/images/custom_sofa_living_1791093566797.jpg"
              alt="Mudis Merit Venture Furniture"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover min-h-[420px]"
            />
            <div className="absolute inset-0 bg-[#0a2237]/10" />
            <div className="image-label">
              <span>01</span>
              Quality & Comfort
            </div>
          </div>

          {/* Content */}
          <div className="intro-content">
            <span className="section-tag">
              ABOUT MUDIS MERIT VENTURE
            </span>

            <h2>
              Furniture and foam products made with comfort in mind.
            </h2>

            <p>
              MUDIS MERIT VENTURE is a foam and furniture company serving customers in Ibadan and beyond. We focus on providing quality products that combine comfort, functionality and lasting value.
            </p>

            <p>
              From foam products to furniture solutions, our goal is to help customers create comfortable homes, offices and commercial spaces.
            </p>

            <button
              onClick={() => setCurrentView('mission')}
              className="text-link"
            >
              <span>Discover Our Mission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="why-section section section-light">
        <div className="container">
          <div className="section-heading center">
            <span className="section-tag">
              WHY CHOOSE US
            </span>

            <h2>
              Built around quality, comfort and trust.
            </h2>

            <p>
              We focus on delivering products and service that customers can confidently rely on.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-number">01</div>
              <Award className="w-7 h-7 text-[#e97822] mb-6" />
              <h3>Quality Products</h3>
              <p>
                Products selected and produced with attention to quality, comfort and practical use.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-number">02</div>
              <Armchair className="w-7 h-7 text-[#e97822] mb-6" />
              <h3>Comfort</h3>
              <p>
                Furniture and foam solutions designed to make everyday spaces more comfortable.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-number">03</div>
              <Hammer className="w-7 h-7 text-[#e97822] mb-6" />
              <h3>Craftsmanship</h3>
              <p>
                Professional attention to detail across our furniture and customization services.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-number">04</div>
              <HeartHandshake className="w-7 h-7 text-[#e97822] mb-6" />
              <h3>Customer Focus</h3>
              <p>
                We put customer needs, communication and satisfaction at the centre of our service.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS & CATEGORIES ================= */}
      <section className="products-section section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <span className="section-tag">
                OUR PRODUCTS
              </span>
              <h2>
                Explore our foam & furniture range.
              </h2>
            </div>
            <button
              onClick={() => setCurrentView('products')}
              className="text-link"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="category-grid">
            {/* Foam Card */}
            <div
              onClick={() => {
                setSelectedCategoryFilter('foam');
                setCurrentView('products');
              }}
              className="category-card foam-card cursor-pointer group"
            >
              <img
                src="/src/assets/images/foam_mattress_craft_1791093554667.jpg"
                alt="Foam Products"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(0deg, rgba(8,31,51,0.92) 0%, rgba(8,31,51,0.2) 100%)'
                }}
              />
              <div className="category-content relative z-10">
                <span>01</span>
                <h3>Foam Products</h3>
                <p>
                  Explore foam solutions for mattresses, upholstery, cushions and furniture.
                </p>
                <strong className="group-hover:text-[#f5b82e] transition-colors">
                  <span>Explore Foam</span>
                  <ArrowRight className="w-4 h-4" />
                </strong>
              </div>
            </div>

            {/* Furniture Card */}
            <div
              onClick={() => {
                setSelectedCategoryFilter('furniture');
                setCurrentView('products');
              }}
              className="category-card furniture-card cursor-pointer group"
            >
              <img
                src="/src/assets/images/hero_furniture_foam_1791093541655.jpg"
                alt="Furniture"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(0deg, rgba(8,31,51,0.92) 0%, rgba(8,31,51,0.2) 100%)'
                }}
              />
              <div className="category-content relative z-10">
                <span>02</span>
                <h3>Furniture</h3>
                <p>
                  Furniture solutions for homes, offices, hotels and customized spaces.
                </p>
                <strong className="group-hover:text-[#f5b82e] transition-colors">
                  <span>Explore Furniture</span>
                  <ArrowRight className="w-4 h-4" />
                </strong>
              </div>
            </div>
          </div>

          {/* Quick interactive Foam Calculator CTA strip */}
          <div className="mt-8 p-6 bg-[#eaf2f9] border border-[#d2e2f1] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-[#123b68] text-white flex items-center justify-center shrink-0">
                <Scissors className="w-5 h-5 text-[#f5b82e]" />
              </div>
              <div>
                <strong className="text-[#092744] text-[15px] block font-bold">
                  Need Custom Foam Slicing or Re-padding?
                </strong>
                <p className="text-[#75808b] text-[13px]">
                  Calculate exact dimensions, density and real-time prices in Naira (₦) for your project.
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('calculator')}
              className="btn btn-primary whitespace-nowrap"
            >
              <span>Calculate Foam Price</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="services-section section section-dark">
        <div className="container">
          <div className="section-heading light-heading">
            <span className="section-tag">
              WHAT WE DO
            </span>

            <h2>
              Furniture & foam solutions.
            </h2>

            <p>
              Services can be updated directly from the administrator dashboard.
            </p>
          </div>

          <div className="service-grid" id="servicesContainer">
            {services.map((service) => (
              <div
                key={service.id}
                className="service-card flex flex-col justify-between"
              >
                <div>
                  <span>{service.number}</span>
                  <div className="mb-5">
                    {getServiceIcon(service.iconName)}
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>

                {service.features && (
                  <div className="pt-4 border-t border-white/10 space-y-1 text-[11px] text-white/50">
                    {service.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f5b82e]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GALLERY PREVIEW ================= */}
      <section className="gallery-preview section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <span className="section-tag">
                OUR WORK
              </span>
              <h2>
                A look at our work and products.
              </h2>
            </div>
            <button
              onClick={() => setCurrentView('gallery')}
              className="text-link"
            >
              <span>View Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="gallery-grid" id="galleryPreview">
            {gallery.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => setCurrentView('gallery')}
                className="group relative rounded-sm overflow-hidden bg-[#f6f7f8] min-h-[260px] cursor-pointer shadow-xs"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-[260px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#092744]/90 via-[#092744]/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-5 text-white">
                  <span className="text-[10px] text-[#f5b82e] font-bold uppercase tracking-wider mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-[16px] font-bold leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/70 mt-1 line-clamp-1">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <span className="section-tag">
              READY TO ORDER?
            </span>
            <h2>
              Let's help you find the right solution.
            </h2>
            <p>
              Contact MUDIS MERIT VENTURE for product enquiries, furniture projects and foam needs.
            </p>
          </div>

          <div className="cta-actions">
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Us</span>
            </a>

            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="btn btn-light"
            >
              <Phone className="w-4 h-4 text-[#123b68]" />
              <span>Call 0803 430 5578</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};
