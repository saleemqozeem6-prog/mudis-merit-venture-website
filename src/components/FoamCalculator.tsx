import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Scissors, MessageCircle, CheckCircle2, Send } from 'lucide-react';

export const FoamCalculator: React.FC = () => {
  const { addInquiry, generateWhatsAppInquiryUrl } = useApp();

  const [useCase, setUseCase] = useState('Sofa Cushion / Upholstery');
  const [unit, setUnit] = useState<'inches' | 'feet'>('inches');
  const [lengthVal, setLengthVal] = useState<number>(24);
  const [widthVal, setWidthVal] = useState<number>(24);
  const [thicknessVal, setThicknessVal] = useState<number>(4);
  const [density, setDensity] = useState<'medium' | 'high-density' | 'super-high-density' | 'orthopaedic-bonded'>('high-density');
  const [quantity, setQuantity] = useState<number>(4);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Convert to inches for calculation
  const lengthInches = unit === 'feet' ? lengthVal * 12 : lengthVal;
  const widthInches = unit === 'feet' ? widthVal * 12 : widthVal;
  const thicknessInches = thicknessVal;

  // Rate per cubic inch based on density in NGN
  const rates: Record<string, number> = {
    'medium': 4.2,
    'high-density': 6.5,
    'super-high-density': 8.8,
    'orthopaedic-bonded': 11.5,
  };

  const cubicInches = lengthInches * widthInches * thicknessInches;
  const unitPrice = Math.max(1500, Math.round(cubicInches * rates[density]));
  const totalPrice = unitPrice * quantity;

  const handleWhatsAppOrder = () => {
    const specs = `Requested Custom Foam Cut:
- Application: ${useCase}
- Dimensions: ${lengthInches}" Length × ${widthInches}" Width × ${thicknessInches}" Thickness
- Density Grade: ${density.toUpperCase()}
- Quantity: ${quantity} piece(s)
- Estimated Cost: ₦${totalPrice.toLocaleString()} (₦${unitPrice.toLocaleString()}/unit)`;

    const url = generateWhatsAppInquiryUrl('Custom Foam Sizing & Quote', specs);
    window.open(url, '_blank');
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim() || !customerName.trim()) return;

    addInquiry({
      customerName,
      phone: customerPhone,
      serviceType: 'Custom Foam Cut Calculation',
      message: `Cut Quote: ${useCase} | ${lengthInches}"x${widthInches}"x${thicknessInches}" | ${density} | Qty: ${quantity} | Est: ₦${totalPrice.toLocaleString()}`,
    });

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-white border border-[#e5e8eb] shadow-sm p-6 sm:p-8 lg:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="section-tag text-[#e97822] text-[11px] font-extrabold tracking-[2px] uppercase block mb-2">
            PRECISION FOAM SIZING ENGINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#092744] tracking-tight">
            Custom Foam Dimension & Price Estimator
          </h2>
          <p className="text-sm text-[#75808b] mt-2 max-w-xl mx-auto leading-relaxed">
            Input your exact measurements for sofa cushions, mattresses, bench padding, or industrial cuts. We cut and finish to precise millimetre tolerances at our Ojoo, Ibadan facility.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Section */}
          <div className="lg:col-span-7 space-y-5">
            {/* Purpose */}
            <div>
              <label className="block text-xs font-bold text-[#092744] uppercase tracking-wider mb-1.5">
                Intended Application
              </label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="w-full text-sm py-2.5 px-3 border border-[#e5e8eb] bg-[#f6f7f8] focus:bg-white focus:outline-none focus:border-[#123b68]"
              >
                <option value="Sofa Seat Cushion">Sofa Seat Cushion (High Rebound)</option>
                <option value="Sofa Backrest Cushion">Sofa Backrest Cushion (Softer Comfort)</option>
                <option value="Mattress Core / Daybed">Mattress Core / Custom Daybed</option>
                <option value="Dining Chair / Bench Pad">Dining Chair / Bench Pad</option>
                <option value="Baby Cot / Crib Foam">Baby Cot / Crib Foam</option>
                <option value="Acoustic / Sound Isolation">Acoustic / Wall Sound Isolation</option>
                <option value="School / Commercial Bulk Padding">School / Commercial Bulk Padding</option>
              </select>
            </div>

            {/* Dimension Units */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#092744] uppercase tracking-wider">
                Measurement Unit
              </span>
              <div className="flex items-center bg-[#f6f7f8] p-1 border border-[#e5e8eb] text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setUnit('inches')}
                  className={`px-3 py-1 transition-colors ${
                    unit === 'inches' ? 'bg-[#123b68] text-white shadow-xs' : 'text-[#75808b]'
                  }`}
                >
                  Inches (")
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('feet')}
                  className={`px-3 py-1 transition-colors ${
                    unit === 'feet' ? 'bg-[#123b68] text-white shadow-xs' : 'text-[#75808b]'
                  }`}
                >
                  Feet (ft)
                </button>
              </div>
            </div>

            {/* Dimensions Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-[#75808b] font-medium mb-1">
                  Length ({unit === 'inches' ? 'in' : 'ft'})
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={lengthVal}
                  onChange={(e) => setLengthVal(Math.max(1, Number(e.target.value)))}
                  className="w-full text-sm font-semibold py-2 px-3 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#75808b] font-medium mb-1">
                  Width ({unit === 'inches' ? 'in' : 'ft'})
                </label>
                <input
                  type="number"
                  min="1"
                  max="96"
                  value={widthVal}
                  onChange={(e) => setWidthVal(Math.max(1, Number(e.target.value)))}
                  className="w-full text-sm font-semibold py-2 px-3 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#75808b] font-medium mb-1">
                  Thickness (in)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={thicknessVal}
                  onChange={(e) => setThicknessVal(Math.max(1, Number(e.target.value)))}
                  className="w-full text-sm font-semibold py-2 px-3 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                />
              </div>
            </div>

            {/* Density Grade */}
            <div>
              <label className="block text-xs font-bold text-[#092744] uppercase tracking-wider mb-2">
                Select Density Grade
              </label>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => setDensity('medium')}
                  className={`p-3.5 border text-left transition-all ${
                    density === 'medium'
                      ? 'border-[#123b68] bg-[#eaf2f9] ring-1 ring-[#123b68]'
                      : 'border-[#e5e8eb] hover:border-[#123b68]/40'
                  }`}
                >
                  <strong className="block font-bold text-[#092744]">Medium Density</strong>
                  <span className="text-[11px] text-[#75808b]">Soft to medium support for back pillows</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDensity('high-density')}
                  className={`p-3.5 border text-left transition-all ${
                    density === 'high-density'
                      ? 'border-[#123b68] bg-[#eaf2f9] ring-1 ring-[#123b68]'
                      : 'border-[#e5e8eb] hover:border-[#123b68]/40'
                  }`}
                >
                  <strong className="block font-bold text-[#092744]">High Density (D20)</strong>
                  <span className="text-[11px] text-[#75808b]">Standard for sofa seats & mattresses</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDensity('super-high-density')}
                  className={`p-3.5 border text-left transition-all ${
                    density === 'super-high-density'
                      ? 'border-[#123b68] bg-[#eaf2f9] ring-1 ring-[#123b68]'
                      : 'border-[#e5e8eb] hover:border-[#123b68]/40'
                  }`}
                >
                  <strong className="block font-bold text-[#092744]">Super High (D24)</strong>
                  <span className="text-[11px] text-[#75808b]">Resilient heavy-duty, zero sag over years</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDensity('orthopaedic-bonded')}
                  className={`p-3.5 border text-left transition-all ${
                    density === 'orthopaedic-bonded'
                      ? 'border-[#123b68] bg-[#eaf2f9] ring-1 ring-[#123b68]'
                      : 'border-[#e5e8eb] hover:border-[#123b68]/40'
                  }`}
                >
                  <strong className="block font-bold text-[#092744]">Rebonded Orthopaedic</strong>
                  <span className="text-[11px] text-[#75808b]">Maximum spinal rigidity & core therapy</span>
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-[#092744] uppercase tracking-wider">
                Quantity Needed
              </span>
              <div className="flex items-center border border-[#e5e8eb]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 bg-[#f6f7f8] hover:bg-[#e5e8eb] text-[#092744] text-sm font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold tabular-nums text-[#092744]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1.5 bg-[#f6f7f8] hover:bg-[#e5e8eb] text-[#092744] text-sm font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Output Card */}
          <div className="lg:col-span-5 bg-[#092744] text-white p-6 sm:p-7 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs uppercase tracking-wider text-[#d6e3ef] font-bold">
                  Summary Estimation
                </span>
                <span className="text-xs bg-[#123b68] text-[#f5b82e] px-2.5 py-0.5 font-bold">
                  {quantity} pc{quantity > 1 ? 's' : ''}
                </span>
              </div>

              <div>
                <span className="text-xs text-white/70">Calculated Total</span>
                <div className="text-3xl sm:text-4xl font-bold font-sans text-white tabular-nums tracking-tight mt-0.5">
                  ₦{totalPrice.toLocaleString()}
                </div>
                <div className="text-xs text-white/75 mt-1">
                  ≈ ₦{unitPrice.toLocaleString()} per piece
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-white/85 bg-[#071c30] p-4 border border-white/10">
                <div className="flex justify-between">
                  <span className="text-white/60">Dimensions:</span>
                  <span className="font-bold text-white">
                    {lengthInches}" × {widthInches}" × {thicknessInches}"
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Grade:</span>
                  <span className="font-bold text-[#f5b82e] capitalize">
                    {density.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Application:</span>
                  <span className="font-bold text-white truncate max-w-[170px]">
                    {useCase}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Production Hub:</span>
                  <span className="text-white">Ojoo Workshop, Ibadan</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full btn btn-whatsapp text-center"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Send Cut Order on WhatsApp</span>
              </button>
            </div>

            {/* Quick Callback form */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#f5b82e] mb-2">
                Or Request Workshop Callback
              </span>

              {submitted ? (
                <div className="flex items-center gap-2 p-3 bg-emerald-950/80 border border-emerald-500 rounded text-emerald-200 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Request saved! Our workshop team will call you shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="text-xs px-2.5 py-2 bg-[#071c30] border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#f5b82e]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone / WhatsApp"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="text-xs px-2.5 py-2 bg-[#071c30] border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#f5b82e]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#123b68] hover:bg-[#e97822] text-white text-xs font-bold transition-colors"
                  >
                    <Send className="w-3 h-3 text-[#f5b82e]" />
                    <span>Submit for In-Person Consultation</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
