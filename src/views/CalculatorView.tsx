import React from 'react';
import { FoamCalculator } from '../components/FoamCalculator';

export const CalculatorView: React.FC = () => {
  return (
    <div className="container py-12 sm:py-16 space-y-12">
      {/* Dimension Calculator Tool */}
      <FoamCalculator />

      {/* Guide & Standard Dimensions for Ibadan / Nigerian Furniture */}
      <div className="bg-white border border-[#e5e8eb] p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-serif font-bold text-[#092744]">
          Standard Nigerian Mattress & Cushion Dimensions Reference
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#75808b]">
          <div className="bg-[#f6f7f8] p-5 space-y-2 border border-[#e5e8eb]">
            <strong className="text-[#092744] font-bold block text-sm">
              Standard Bed Sizes
            </strong>
            <ul className="space-y-1.5 leading-relaxed">
              <li>· <strong>6ft x 6ft (King):</strong> 72 inches x 72 inches</li>
              <li>· <strong>4.5ft x 6ft (Full / Double):</strong> 54 inches x 72 inches</li>
              <li>· <strong>4ft x 6ft (Queen Single):</strong> 48 inches x 72 inches</li>
              <li>· <strong>3ft x 6ft (Single / Student):</strong> 36 inches x 72 inches</li>
              <li>· <strong>6ft x 7ft (Super King):</strong> 72 inches x 84 inches</li>
            </ul>
          </div>

          <div className="bg-[#f6f7f8] p-5 space-y-2 border border-[#e5e8eb]">
            <strong className="text-[#092744] font-bold block text-sm">
              Recommended Sofa Foam Thickness
            </strong>
            <ul className="space-y-1.5 leading-relaxed">
              <li>· <strong>Seat Base Cushion:</strong> 4" to 6" High Density (D20–D24)</li>
              <li>· <strong>Plush Soft Backrest:</strong> 3" to 4" Medium Density</li>
              <li>· <strong>Dining Chair Pad:</strong> 2" to 3" High Density</li>
              <li>· <strong>Armrest & Wrap:</strong> 1" to 2" Flexible Sheet Foam</li>
              <li>· <strong>Bed Headboard Tufting:</strong> 2" to 4" High Density</li>
            </ul>
          </div>

          <div className="bg-[#f6f7f8] p-5 space-y-2 border border-[#e5e8eb]">
            <strong className="text-[#092744] font-bold block text-sm">
              Why Foam Density Matters
            </strong>
            <p className="leading-relaxed">
              Cheap low-density foams collapse and sag within months under tropical heat and body weight. At Mudis Merit Venture, we cut genuine high-density cellular foam that maintains its rebound and structural integrity for years.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
