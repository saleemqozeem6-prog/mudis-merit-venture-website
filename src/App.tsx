/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { ProductModal } from './components/ProductModal';
import { HomeView } from './views/HomeView';
import { MissionView } from './views/MissionView';
import { VisionView } from './views/VisionView';
import { ProductsView } from './views/ProductsView';
import { GalleryView } from './views/GalleryView';
import { ContactView } from './views/ContactView';
import { AdminView } from './views/AdminView';
import { CalculatorView } from './views/CalculatorView';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#1E2022]">
      {/* Top Header */}
      <Header />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'mission' && <MissionView />}
        {currentView === 'vision' && <VisionView />}
        {currentView === 'products' && <ProductsView />}
        {currentView === 'calculator' && <CalculatorView />}
        {currentView === 'gallery' && <GalleryView />}
        {currentView === 'contact' && <ContactView />}
        {currentView === 'admin' && <AdminView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Call & WhatsApp Buttons */}
      <FloatingActions />

      {/* Product Inspection & WhatsApp Order Modal */}
      <ProductModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
