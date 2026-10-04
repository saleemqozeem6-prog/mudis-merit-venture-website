import React from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/initialData';
import { Settings, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Company Column */}
          <div className="footer-company">
            <div className="brand footer-brand">
              <div className="brand-mark">
                MM
              </div>
              <div className="brand-text">
                <strong>MUDIS MERIT</strong>
                <span>FOAM & FURNITURE</span>
              </div>
            </div>

            <p>
              Quality foam and furniture solutions for comfortable living in Ibadan, Oyo State.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="footer-column">
            <h4>Navigation</h4>
            <button
              onClick={() => setCurrentView('home')}
              className="text-left"
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('mission')}
              className="text-left"
            >
              Mission
            </button>
            <button
              onClick={() => setCurrentView('vision')}
              className="text-left"
            >
              Vision
            </button>
            <button
              onClick={() => setCurrentView('products')}
              className="text-left"
            >
              Products & Services
            </button>
            <button
              onClick={() => setCurrentView('calculator')}
              className="text-left"
            >
              Foam Calculator
            </button>
            <button
              onClick={() => setCurrentView('gallery')}
              className="text-left"
            >
              Gallery
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className="text-left"
            >
              Contact
            </button>
          </div>

          {/* Contact Column */}
          <div className="footer-column">
            <h4>Contact</h4>
            <p>
              No. 1, Foam and Furniture,
              <br />
              Beside Tipper Garage,
              <br />
              Akinbile, Arulogun Road,
              <br />
              Ojoo, Ibadan,
              <br />
              Oyo State, Nigeria.
            </p>
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="!text-white font-semibold mt-1 block"
            >
              0803 430 5578
            </a>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Us
            </a>
          </div>

          {/* Quick Order Column */}
          <div className="footer-column">
            <h4>Quick Order</h4>
            <p>
              Have a product enquiry? Send us a message directly.
            </p>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-order"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <p>
            © 2026 MUDIS MERIT VENTURE. All Rights Reserved.
          </p>
          <button
            onClick={() => setCurrentView('admin')}
            className="admin-link"
            title="Administrator Portal"
            aria-label="Administrator"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
