import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageView } from '../types';
import { COMPANY_INFO } from '../data/initialData';
import { Phone, MessageCircle, Menu, X, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; view: PageView }[] = [
    { label: 'Home', view: 'home' },
    { label: 'Mission', view: 'mission' },
    { label: 'Vision', view: 'vision' },
    { label: 'Products & Services', view: 'products' },
    { label: 'Foam Calculator', view: 'calculator' },
    { label: 'Gallery', view: 'gallery' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleNavClick = (view: PageView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header sticky top-0 z-40 bg-white shadow-xs">
      {/* Top trust strip */}
      <div className="bg-[#092744] text-[#d6e3ef] text-xs py-1.5 px-4 border-b border-[#123b68]/40">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#f5b82e] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ojoo, Ibadan Showroom & Workshop</span>
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="hidden sm:inline text-white/80">Beside Tipper Garage, Akinbile, Arulogun Road</span>
          </div>
          <div className="flex items-center gap-4 text-white/80">
            <span className="hidden md:inline">Mon–Sat: 8:00 AM – 6:30 PM</span>
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="text-white hover:text-[#f5b82e] font-semibold flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3 h-3 text-[#f5b82e]" />
              <span>{COMPANY_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="container nav-wrapper">
        {/* Brand */}
        <button
          onClick={() => handleNavClick('home')}
          className="brand text-left focus:outline-none"
        >
          <div className="brand-mark">
            MM
          </div>
          <div className="brand-text">
            <strong>MUDIS MERIT</strong>
            <span>FOAM & FURNITURE</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className={isActive ? 'active' : ''}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Nav Actions */}
        <div className="nav-actions">
          <a
            href={COMPANY_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-whatsapp"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="menu-toggle"
            id="menuToggle"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'show !block' : ''}`} id="mobileMenu">
        {navLinks.map((link) => {
          const isActive = currentView === link.view;
          return (
            <button
              key={link.view}
              onClick={() => handleNavClick(link.view)}
              className={isActive ? '!text-[#e97822] font-bold' : ''}
            >
              {link.label}
            </button>
          );
        })}

        <a
          href={COMPANY_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-order"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Order on WhatsApp</span>
        </a>
      </div>
    </header>
  );
};
