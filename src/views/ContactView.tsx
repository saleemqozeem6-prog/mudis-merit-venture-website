import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/initialData';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  Send, 
  CheckCircle2, 
  Navigation
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { addInquiry, generateWhatsAppInquiryUrl } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState('Furniture Production / Purchase');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    addInquiry({
      customerName: name,
      phone,
      email: email || undefined,
      serviceType,
      message,
    });

    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-16 space-y-16">
      {/* Contact Banner */}
      <section className="container">
        <div className="bg-[#092744] text-white p-8 sm:p-12 relative overflow-hidden shadow-md">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="section-tag text-[#f5b82e] text-[11px] font-extrabold tracking-[2px] uppercase block mb-1">
              GET IN TOUCH
            </span>
            <h1 className="font-serif text-[32px] sm:text-[44px] font-bold text-white tracking-tight leading-tight">
              Contact MUDIS MERIT VENTURE
            </h1>
            <p className="text-white/80 text-[14px] sm:text-[15px] leading-relaxed">
              We welcome showroom visits, custom measurement appointments, foam dimension inquiries, and commercial furniture projects across Ibadan and South-Western Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Details & Form */}
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details & Direct Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 border border-[#e5e8eb] shadow-xs space-y-6">
              <h3 className="font-serif font-bold text-xl text-[#092744]">
                Showroom & Workshop Address
              </h3>

              <div className="space-y-4 text-xs text-[#75808b]">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 bg-[#eaf2f9] text-[#123b68] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#123b68]" />
                  </div>
                  <div>
                    <strong className="block text-[#092744] font-bold text-sm">
                      Ojoo Workshop & Facility
                    </strong>
                    <p className="mt-1 leading-relaxed text-[#75808b]">
                      No. 1, Foam and Furniture,
                      <br />
                      Beside Tipper Garage, Akinbile,
                      <br />
                      Arulogun Road, Ojoo, Ibadan,
                      <br />
                      Oyo State, Nigeria.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 bg-[#eaf2f9] text-[#123b68] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#123b68]" />
                  </div>
                  <div>
                    <strong className="block text-[#092744] font-bold text-sm">
                      Phone Call
                    </strong>
                    <a
                      href={`tel:${COMPANY_INFO.phoneRaw}`}
                      className="text-[#123b68] font-bold hover:underline text-sm"
                    >
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 bg-emerald-50 text-[#159447] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-[#159447]" />
                  </div>
                  <div>
                    <strong className="block text-[#092744] font-bold text-sm">
                      WhatsApp Line
                    </strong>
                    <a
                      href={COMPANY_INFO.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#159447] font-bold hover:underline text-sm"
                    >
                      +234 803 430 5578 (Direct Chat)
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 bg-[#eaf2f9] text-[#123b68] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#123b68]" />
                  </div>
                  <div>
                    <strong className="block text-[#092744] font-bold text-sm">
                      Working Hours
                    </strong>
                    <p className="mt-0.5 text-[#75808b]">
                      Mon – Sat: 8:00 AM – 6:30 PM
                      <br />
                      Sunday: Special Appointment / Urgent Orders
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Quick Action Buttons */}
              <div className="pt-2 border-t border-[#e5e8eb] grid grid-cols-2 gap-3">
                <a
                  href={COMPANY_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp text-center"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`tel:${COMPANY_INFO.phoneRaw}`}
                  className="btn btn-primary text-center"
                >
                  <Phone className="w-4 h-4 text-white" />
                  <span>Call Us</span>
                </a>
              </div>
            </div>

            {/* Ibadan Route Directions Helper */}
            <div className="bg-[#eaf2f9] p-6 border border-[#d2e2f1] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#123b68]">
                <Navigation className="w-4 h-4 text-[#e97822]" />
                <span>How to Find Us in Ibadan</span>
              </div>
              <p className="text-xs text-[#3f4b57] leading-relaxed">
                <strong>From Ojoo Roundabout:</strong> Drive onto Arulogun Road heading towards Akinbile. Continue past the junction until you reach the well-known <strong>Tipper Garage</strong> landmark on your right. Mudis Merit Venture is immediately adjacent to the garage.
              </p>
              <p className="text-xs text-[#3f4b57] leading-relaxed">
                <strong>From Moniya / Iseyin Expressway:</strong> Exit towards Ojoo and turn directly into Arulogun Road. Call <span className="font-bold text-[#092744]">0803 430 5578</span> for real-time guidance if needed.
              </p>
            </div>
          </div>

          {/* Interactive Message / Quote Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 border border-[#e5e8eb] shadow-xs">
              <div className="mb-6 space-y-1">
                <span className="section-tag text-[#e97822] text-[11px] font-extrabold tracking-[2px] uppercase block mb-1">
                  SEND AN ENQUIRY
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#092744]">
                  Request a Quote or Consultation
                </h3>
                <p className="text-xs text-[#75808b]">
                  Fill in your requirements below. Our workshop manager will reach out with pricing and timeline details.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-serif font-bold text-emerald-900">
                    Thank You, {name}!
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                    Your inquiry has been successfully recorded. A representative from Mudis Merit Venture will contact you via {phone} shortly.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <a
                      href={generateWhatsAppInquiryUrl(serviceType, message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Also Send Via WhatsApp</span>
                    </a>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setMessage('');
                      }}
                      className="px-4 py-2 border border-[#e5e8eb] bg-white text-[#092744] text-xs font-bold"
                    >
                      Submit Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#092744] uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mr. Babatunde Adeyemi"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#092744] uppercase tracking-wider mb-1.5">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0803 XXX XXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#092744] uppercase tracking-wider mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#092744] uppercase tracking-wider mb-1.5">
                        Service Category *
                      </label>
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 border border-[#e5e8eb] bg-white focus:outline-none focus:border-[#123b68]"
                      >
                        <option value="Furniture Production / Purchase">Furniture Production / Purchase</option>
                        <option value="Foam Slicing & Cutting">Foam Slicing & Custom Cutting</option>
                        <option value="Custom Upholstery & Restoration">Custom Upholstery & Restoration</option>
                        <option value="Orthopaedic Mattress Order">Orthopaedic Mattress Order</option>
                        <option value="Bulk School / Hotel Furnishing">Bulk School / Hotel Furnishing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#092744] uppercase tracking-wider mb-1.5">
                      Describe Your Project or Request *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please specify room dimensions, preferred colors, quantities, or delivery location in Ibadan..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full text-xs p-3.5 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full btn btn-primary text-center"
                    >
                      <Send className="w-4 h-4 text-white" />
                      <span>Send Inquiry to Mudis Merit Venture</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
