import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Scissors, MessageCircle, ArrowRight, ChevronRight } from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { 
    products, 
    selectedCategoryFilter, 
    setSelectedCategoryFilter, 
    searchQuery, 
    setSearchQuery, 
    setSelectedProductForModal,
    setCurrentView,
    generateWhatsAppOrderUrl
  } = useApp();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategoryFilter === 'all' ||
        (selectedCategoryFilter === 'foam' && (p.category === 'foam' || p.category === 'mattress')) ||
        (selectedCategoryFilter === 'furniture' && p.category === 'furniture') ||
        (selectedCategoryFilter === 'office' && p.category === 'office');

      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategoryFilter, searchQuery]);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'foam', label: 'Foam & Mattresses' },
    { id: 'furniture', label: 'Living & Bedroom Furniture' },
    { id: 'office', label: 'Office & Corporate' },
  ];

  return (
    <div className="py-12 sm:py-16 space-y-12">
      {/* Top Banner */}
      <section className="container">
        <div className="bg-[#092744] text-white p-8 sm:p-12 relative overflow-hidden shadow-md">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="section-tag text-[#f5b82e] text-[11px] font-extrabold tracking-[2px] uppercase block mb-1">
              PRODUCT CATALOG & SERVICES
            </span>
            <h1 className="font-serif text-[32px] sm:text-[44px] font-bold text-white tracking-tight leading-tight">
              Quality Foam & Handcrafted Furniture
            </h1>
            <p className="text-white/80 text-[14px] sm:text-[15px] leading-relaxed">
              Explore our range of orthopaedic mattresses, custom high-density foam cuts, luxury parlour suites, and institutional furnishing built in Ibadan.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Controls */}
      <section className="container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e5e8eb]">
          {/* Functional Category Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-[#f6f7f8] border border-[#e5e8eb] overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategoryFilter === cat.id
                    ? 'bg-[#123b68] text-white shadow-xs'
                    : 'text-[#53606d] hover:text-[#123b68]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px] max-w-md">
            <Search className="w-4 h-4 text-[#75808b] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search mattresses, sofas, cuts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 border border-[#e5e8eb] bg-white focus:outline-none focus:border-[#123b68] focus:ring-1 focus:ring-[#123b68]"
            />
          </div>
        </div>

        {/* Custom Sizing Banner Callout */}
        <div className="my-8 p-6 bg-[#eaf2f9] border border-[#d2e2f1] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-[#123b68] text-[#f5b82e] flex items-center justify-center shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-[#092744] text-[15px] font-bold block">
                Need a specific foam size or density not listed here?
              </strong>
              <p className="text-[#75808b] text-[13px]">
                We custom-cut foam blocks to any inch dimension for sofas, daybeds, and benches.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('calculator')}
            className="btn btn-primary whitespace-nowrap"
          >
            <span>Open Foam Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#e5e8eb]">
            <p className="text-sm font-semibold text-[#75808b]">No products found matching your search.</p>
            <button
              onClick={() => {
                setSelectedCategoryFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-bold text-[#e97822] hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProductForModal(product)}
                className="bg-white border border-[#e5e8eb] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 bg-[#f6f7f8] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#092744] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                    {product.subcategory}
                  </div>
                  {product.inStock ? (
                    <div className="absolute top-2.5 right-2.5 bg-[#159447] text-white text-[10px] font-bold px-2 py-0.5">
                      In Stock
                    </div>
                  ) : null}
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#092744] group-hover:text-[#123b68] transition-colors leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-[12px] text-[#75808b] mt-1.5 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#e5e8eb] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#75808b] block">
                        Price
                      </span>
                      <span className="text-[17px] font-bold text-[#092744] tabular-nums">
                        ₦{product.price.toLocaleString()}
                      </span>
                    </div>

                    <a
                      href={generateWhatsAppOrderUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-9 h-9 grid place-items-center bg-[#159447] hover:bg-[#107a3a] text-white transition-colors shadow-xs"
                      title="Direct WhatsApp Order"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Delivery trust strip */}
      <section className="container">
        <div className="bg-[#f6f7f8] p-8 border border-[#e5e8eb]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#75808b]">
            <div className="space-y-1.5">
              <strong className="text-[#092744] text-[14px] block font-bold">
                Delivery in Ibadan & Surrounds
              </strong>
              <p className="leading-relaxed">
                Same-day and next-day delivery available across Ojoo, Bodija, UI, Ring Road, Akobo, Iwo Road, and throughout Oyo State.
              </p>
            </div>
            <div className="space-y-1.5">
              <strong className="text-[#092744] text-[14px] block font-bold">
                Inspection & Custom Fitting
              </strong>
              <p className="leading-relaxed">
                Visit our Akinbile workshop to inspect mattress cores, test foam densities, or have our carpenters take measurements for custom parlour sets.
              </p>
            </div>
            <div className="space-y-1.5">
              <strong className="text-[#092744] text-[14px] block font-bold">
                Direct WhatsApp Inquiries
              </strong>
              <p className="leading-relaxed">
                Send pictures of any furniture design you love, and our master craftsman will provide a quote and timber specifications within minutes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
