import React from 'react';
import { COMPANY_INFO } from '../data/initialData';
import { Phone, MessageCircle } from 'lucide-react';

export const FloatingActions: React.FC = () => {
  return (
    <div className="floating-contact">
      {/* Floating Call */}
      <a
        href={`tel:${COMPANY_INFO.phoneRaw}`}
        className="floating-call"
        aria-label="Call MUDIS MERIT VENTURE"
        title="Call 0803 430 5578"
      >
        <Phone className="w-5 h-5 text-white" />
      </a>

      {/* Floating WhatsApp */}
      <a
        href={COMPANY_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
        aria-label="WhatsApp MUDIS MERIT VENTURE"
        title="WhatsApp 0803 430 5578"
      >
        <MessageCircle className="w-6 h-6 fill-current text-white" />
      </a>
    </div>
  );
};
