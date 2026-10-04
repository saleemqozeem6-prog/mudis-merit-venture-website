import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ServiceItem, CustomerInquiry, GalleryItem } from '../types';
import { 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  MessageCircle, 
  RotateCcw, 
  Package, 
  Wrench, 
  Inbox, 
  LogOut,
  ShieldAlert,
  Database,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Edit3,
  Upload,
  Image as ImageIcon,
  Save,
  X,
  Ruler,
  Layers,
  Video,
  Play,
  Film,
  Hammer
} from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

const PRESET_IMAGES = [
  { label: 'Living Room Sofa', url: '/src/assets/images/custom_sofa_living_1791093566797.jpg' },
  { label: 'Foam & Mattress', url: '/src/assets/images/foam_mattress_craft_1791093554667.jpg' },
  { label: 'Showroom Suite', url: '/src/assets/images/hero_furniture_foam_1791093541655.jpg' },
];

export const AdminView: React.FC = () => {
  const { 
    isAdminLoggedIn, 
    setIsAdminLoggedIn, 
    firebaseUser,
    loginWithGoogle,
    logoutAdmin,
    isFirebaseConnected,
    services, 
    addService, 
    deleteService,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    inquiries,
    updateInquiryStatus,
    resetAllDataToDefaults,
    setCurrentView
  } = useApp();

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'workshop' | 'services' | 'inquiries' | 'database'>('products');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // In-app Delete Confirmation states (Replaces blocked window.confirm)
  const [confirmDeleteProdId, setConfirmDeleteProdId] = useState<string | null>(null);
  const [confirmDeleteSrvId, setConfirmDeleteSrvId] = useState<string | null>(null);
  const [confirmDeleteGalId, setConfirmDeleteGalId] = useState<string | null>(null);

  // Service Form State
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceIcon, setNewServiceIcon] = useState<'chair' | 'scissors' | 'penRuler' | 'wrench'>('chair');
  const [newServiceFeatures, setNewServiceFeatures] = useState('');

  // Add Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'foam' | 'furniture' | 'mattress' | 'office'>('furniture');
  const [newProdSubcategory, setNewProdSubcategory] = useState('Living Room');
  const [newProdPrice, setNewProdPrice] = useState<number>(150000);
  const [newProdImage, setNewProdImage] = useState<string>('/src/assets/images/custom_sofa_living_1791093566797.jpg');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdDimensions, setNewProdDimensions] = useState('6ft x 6ft');
  const [newProdMaterial, setNewProdMaterial] = useState('Solid Hardwood + High Density Foam');
  const [newProdWarranty, setNewProdWarranty] = useState('3 Years Warranty');

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdPrice, setEditProdPrice] = useState<number>(0);
  const [editProdCategory, setEditProdCategory] = useState<'foam' | 'furniture' | 'mattress' | 'office'>('furniture');
  const [editProdSubcategory, setEditProdSubcategory] = useState('');
  const [editProdImage, setEditProdImage] = useState('');
  const [editProdDesc, setEditProdDesc] = useState('');
  const [editProdDimensions, setEditProdDimensions] = useState('');
  const [editProdMaterial, setEditProdMaterial] = useState('');
  const [editProdWarranty, setEditProdWarranty] = useState('');
  const [editProdInStock, setEditProdInStock] = useState(true);

  // Inline Quick-Price Edit State
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlinePriceVal, setInlinePriceVal] = useState<number>(0);

  // Workshop & Framing Media Form State (Photos & Videos)
  const [workshopMediaType, setWorkshopMediaType] = useState<'photo' | 'video'>('photo');
  const [workshopTitle, setWorkshopTitle] = useState('');
  const [workshopImageUrl, setWorkshopImageUrl] = useState('/src/assets/images/custom_sofa_living_1791093566797.jpg');
  const [workshopVideoUrl, setWorkshopVideoUrl] = useState('');
  const [workshopCaption, setWorkshopCaption] = useState('');
  const [workshopDimensions, setWorkshopDimensions] = useState('Seasoned Hardwood Framework');

  const notifySuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin123' || passwordInput === 'admin' || passwordInput === 'mudis') {
      setIsAdminLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      setIsAdminLoggedIn(true);
    } catch (err) {
      console.error(err);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Image Upload Handlers (converts to data URL)
  const handleNewProdImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) setNewProdImage(res);
    };
    reader.readAsDataURL(file);
  };

  const handleEditProdImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) setEditProdImage(res);
    };
    reader.readAsDataURL(file);
  };

  const handleWorkshopPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) setWorkshopImageUrl(res);
    };
    reader.readAsDataURL(file);
  };

  // Submit Add Service
  const handleAddServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle.trim() || !newServiceDesc.trim()) return;

    await addService({
      number: String(services.length + 1).padStart(2, '0'),
      title: newServiceTitle,
      description: newServiceDesc,
      iconName: newServiceIcon,
      features: newServiceFeatures
        ? newServiceFeatures.split(',').map((s) => s.trim()).filter(Boolean)
        : ['High standard workmanship', 'Quality materials'],
    });

    setNewServiceTitle('');
    setNewServiceDesc('');
    setNewServiceFeatures('');
    notifySuccess('New service saved directly to Firebase Firestore!');
  };

  // Submit Add Product
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    await addProduct({
      name: newProdName,
      category: newProdCategory,
      subcategory: newProdSubcategory,
      price: Number(newProdPrice),
      image: newProdImage || (newProdCategory === 'foam' 
        ? '/src/assets/images/foam_mattress_craft_1791093554667.jpg' 
        : '/src/assets/images/custom_sofa_living_1791093566797.jpg'),
      description: newProdDesc || 'Premium handcrafted item made in Ibadan.',
      dimensions: newProdDimensions,
      densityOrMaterial: newProdMaterial,
      warranty: newProdWarranty,
      inStock: true,
      featured: false,
    });

    setNewProdName('');
    setNewProdDesc('');
    notifySuccess('Product added directly to Firebase Firestore catalog!');
  };

  // Submit Add Workshop Photo / Video
  const handleAddWorkshopMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workshopTitle.trim()) return;

    await addGalleryItem({
      title: workshopTitle.trim(),
      category: 'workshop',
      imageUrl: workshopImageUrl || '/src/assets/images/custom_sofa_living_1791093566797.jpg',
      caption: workshopCaption.trim() || 'Workshop craftsmanship and hardwood framing at Ojoo, Ibadan.',
      dimensions: workshopDimensions.trim(),
      mediaType: workshopMediaType,
      videoUrl: workshopMediaType === 'video' ? workshopVideoUrl.trim() : '',
    });

    setWorkshopTitle('');
    setWorkshopCaption('');
    setWorkshopVideoUrl('');
    notifySuccess(`Added ${workshopMediaType === 'video' ? 'video' : 'photo'} to Workshop & Framing!`);
  };

  // Open Edit Product Modal
  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setEditProdName(prod.name);
    setEditProdPrice(prod.price);
    setEditProdCategory(prod.category);
    setEditProdSubcategory(prod.subcategory || '');
    setEditProdImage(prod.image || '');
    setEditProdDesc(prod.description || '');
    setEditProdDimensions(prod.dimensions || '');
    setEditProdMaterial(prod.densityOrMaterial || '');
    setEditProdWarranty(prod.warranty || '');
    setEditProdInStock(prod.inStock ?? true);
  };

  // Save Edit Product Modal
  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editProdName.trim()) return;

    await updateProduct(editingProduct.id, {
      name: editProdName.trim(),
      price: Number(editProdPrice),
      category: editProdCategory,
      subcategory: editProdSubcategory.trim(),
      image: editProdImage,
      description: editProdDesc.trim(),
      dimensions: editProdDimensions.trim(),
      densityOrMaterial: editProdMaterial.trim(),
      warranty: editProdWarranty.trim(),
      inStock: editProdInStock,
    });

    setEditingProduct(null);
    notifySuccess(`Updated "${editProdName}" in Firestore!`);
  };

  // Inline Price Save
  const handleSaveInlinePrice = async (prodId: string) => {
    if (inlinePriceVal < 0) return;
    await updateProduct(prodId, { price: inlinePriceVal });
    setInlineEditingId(null);
    notifySuccess('Price updated in Firestore!');
  };

  // Filter workshop media
  const workshopMediaItems = gallery.filter((item) => item.category === 'workshop');

  // If not logged in, show authentication portal
  if (!isAdminLoggedIn && !firebaseUser) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="max-w-md w-full bg-white border border-[#e5e8eb] shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#092744] text-[#f5b82e] flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#092744]">
              Administrator Access
            </h2>
            <p className="text-xs text-[#75808b]">
              Firebase Backend & Management Dashboard for Mudis Merit Venture
            </p>
          </div>

          {/* Firebase Google Auth Button */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#e5e8eb] hover:border-[#123b68] bg-white hover:bg-[#f6f7f8] text-[#092744] font-bold text-xs transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{googleLoading ? 'Signing in with Google...' : 'Sign In with Google (Firebase)'}</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-[#e5e8eb] w-full"></div>
              <span className="bg-white px-3 text-[11px] text-[#75808b] uppercase font-bold tracking-wider absolute">
                Or Use Passcode
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#092744] uppercase tracking-wider mb-1.5">
                Admin Passcode
              </label>
              <input
                type="password"
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
              />
              {loginError && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Incorrect password. Try "admin123".
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary text-center"
            >
              Sign In to Dashboard
            </button>
          </form>

          {/* Quick Demo Access Helper */}
          <div className="pt-4 border-t border-[#e5e8eb] flex items-center justify-between text-xs">
            <span className="text-[#75808b]">Passcode: <code className="bg-[#f6f7f8] px-1.5 py-0.5 font-mono text-[#092744] font-bold">admin123</code></span>
            <button
              type="button"
              onClick={() => {
                setPasswordInput('admin123');
                setIsAdminLoggedIn(true);
              }}
              className="text-[#e97822] font-bold hover:underline"
            >
              Quick Demo Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 sm:py-12 space-y-8">
      {/* Toast Notification */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Dashboard Top Header */}
      <div className="bg-[#092744] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#f5b82e]">
            <Unlock className="w-3.5 h-3.5" />
            <span>MUDIS MERIT VENTURE · FIREBASE BACKEND PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Company Content & Inquiries Dashboard
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-white/80">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/60 rounded text-emerald-300 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Firestore Connected
            </span>
            {firebaseUser ? (
              <span className="inline-flex items-center gap-1.5 text-white/90">
                <UserCheck className="w-3.5 h-3.5 text-[#f5b82e]" />
                <span>{firebaseUser.email}</span>
              </span>
            ) : (
              <span className="text-[#f5b82e]">Admin Mode (Authenticated)</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentView('home')}
            className="btn btn-outline"
          >
            View Live Site
          </button>
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-900/80 hover:bg-rose-900 text-white text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e5e8eb] pb-3">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-[#123b68] text-white shadow-xs'
              : 'text-[#53606d] hover:text-[#123b68] bg-[#f6f7f8]'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Product Catalog & Prices ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('workshop')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'workshop'
              ? 'bg-[#123b68] text-white shadow-xs'
              : 'text-[#53606d] hover:text-[#123b68] bg-[#f6f7f8]'
          }`}
        >
          <Hammer className="w-3.5 h-3.5 text-[#f5b82e]" />
          <span>Workshop & Framing Media ({workshopMediaItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'services'
              ? 'bg-[#123b68] text-white shadow-xs'
              : 'text-[#53606d] hover:text-[#123b68] bg-[#f6f7f8]'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Services Manager ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'inquiries'
              ? 'bg-[#123b68] text-white shadow-xs'
              : 'text-[#53606d] hover:text-[#123b68] bg-[#f6f7f8]'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Customer Inquiries ({inquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'database'
              ? 'bg-[#123b68] text-white shadow-xs'
              : 'text-[#53606d] hover:text-[#123b68] bg-[#f6f7f8]'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Database & Config</span>
        </button>
      </div>

      {/* ================= TAB 1: PRODUCT CATALOG & PRICES ================= */}
      {activeTab === 'products' && (
        <div className="space-y-8">
          {/* Add New Product Form */}
          <div className="bg-white p-6 border border-[#e5e8eb] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#e5e8eb] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#092744] font-serif flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#e97822]" />
                  <span>Add New Product to Firestore Catalog</span>
                </h3>
                <p className="text-xs text-[#75808b]">
                  Add foam, mattresses, cushions, or custom furniture pieces.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#092744] mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6x6 Royal Orthopaedic High Density Mattress"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#092744] mb-1">Price in Naira (₦)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68] font-bold text-[#092744]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#092744] mb-1">Department</label>
                  <select
                    value={newProdCategory}
                    onChange={(e: any) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e8eb] bg-white"
                  >
                    <option value="furniture">Furniture</option>
                    <option value="foam">Foam & Mattresses</option>
                    <option value="office">Office & Corporate</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#092744] mb-1">Subcategory</label>
                  <input
                    type="text"
                    placeholder="e.g. Living Room, Mattresses, Bedding"
                    value={newProdSubcategory}
                    onChange={(e) => setNewProdSubcategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e8eb]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#092744] mb-1">Dimensions</label>
                  <input
                    type="text"
                    placeholder="e.g. 6ft x 6ft x 10 inches"
                    value={newProdDimensions}
                    onChange={(e) => setNewProdDimensions(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e8eb]"
                  />
                </div>
              </div>

              {/* IMAGE SELECTION & REMOVAL FOR NEW PRODUCT */}
              <div className="bg-[#f6f7f8] p-4 border border-[#e5e8eb] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#092744] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#e97822]" />
                    <span>Product Image Selector</span>
                  </span>
                  {newProdImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setNewProdImage('');
                        notifySuccess('Image cleared from form');
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 bg-white px-2 py-0.5 border border-rose-200"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete / Clear Image</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-28 h-20 bg-white border border-[#e5e8eb] flex items-center justify-center shrink-0 overflow-hidden relative">
                    {newProdImage ? (
                      <img src={newProdImage} alt="New Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-[#75808b]">No Image</span>
                    )}
                  </div>

                  <div className="space-y-2 flex-1 w-full text-xs">
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#123b68] text-[#123b68] hover:bg-[#eaf2f9] font-bold cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Device Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleNewProdImageUpload}
                          className="hidden"
                        />
                      </label>

                      <div className="flex flex-wrap gap-1">
                        {PRESET_IMAGES.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setNewProdImage(preset.url)}
                            className="px-2 py-1 bg-white border border-[#e5e8eb] hover:border-[#123b68] text-[11px]"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Or paste external image URL..."
                      value={newProdImage.startsWith('data:') ? '(Uploaded Device Image)' : newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      className="w-full px-2 py-1 border border-[#e5e8eb] bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#092744] mb-1">Density & Core Material</label>
                  <input
                    type="text"
                    placeholder="e.g. D24 High Density + Nigerian Teak"
                    value={newProdMaterial}
                    onChange={(e) => setNewProdMaterial(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e8eb]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#092744] mb-1">Warranty Period</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Years Warranty"
                    value={newProdWarranty}
                    onChange={(e) => setNewProdWarranty(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e8eb]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#092744] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Item details, timber, fabric, firmness..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Product to Firestore</span>
                </button>
              </div>
            </form>
          </div>

          {/* ACTIVE PRODUCTS IN FIRESTORE TABLE (WITH EDIT, INLINE PRICE & IMAGE DELETE) */}
          <div className="bg-white border border-[#e5e8eb] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#e5e8eb] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="font-bold text-[#092744] text-sm">
                  Active Catalog in Firestore ({products.length} Products)
                </h3>
                <p className="text-xs text-[#75808b]">
                  Edit prices directly in the table, manage images, or open full edit modal.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f6f7f8] text-[#092744] font-bold border-b border-[#e5e8eb]">
                  <tr>
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">Product Details</th>
                    <th className="py-3 px-4">Price (₦)</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e8eb]">
                  {products.map((prod) => {
                    const isInline = inlineEditingId === prod.id;
                    const isConfirmingDelete = confirmDeleteProdId === prod.id;

                    return (
                      <tr key={prod.id} className="hover:bg-[#f6f7f8]/50">
                        {/* Image Preview & Direct Delete Button */}
                        <td className="py-3 px-4 w-24">
                          <div className="w-16 h-14 bg-[#f6f7f8] border border-[#e5e8eb] overflow-hidden relative group shrink-0">
                            {prod.image ? (
                              <>
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await updateProduct(prod.id, { image: '' });
                                    notifySuccess(`Image removed from "${prod.name}"`);
                                  }}
                                  title="Click to delete this image"
                                  className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                >
                                  <Trash2 className="w-4 h-4 text-rose-300" />
                                </button>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-[#75808b] text-center p-0.5">
                                No Img
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Title & Category */}
                        <td className="py-3 px-4">
                          <strong className="block text-[#092744] font-bold text-xs">{prod.name}</strong>
                          <span className="text-[11px] text-[#75808b]">
                            {prod.category} · {prod.subcategory || 'Standard'} · {prod.dimensions}
                          </span>
                        </td>

                        {/* Price (with Inline Edit) */}
                        <td className="py-3 px-4">
                          {isInline ? (
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#092744]">₦</span>
                              <input
                                type="number"
                                min={0}
                                value={inlinePriceVal}
                                onChange={(e) => setInlinePriceVal(Number(e.target.value))}
                                className="w-24 px-1.5 py-1 border border-[#123b68] font-bold text-xs"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveInlinePrice(prod.id)}
                                className="px-2 py-1 bg-[#123b68] text-white font-bold text-[10px]"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setInlineEditingId(null)}
                                className="px-1.5 py-1 text-neutral-400 hover:text-black text-[10px]"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-bold tabular-nums text-[#092744]">
                                ₦{prod.price.toLocaleString()}
                              </span>
                              <button
                                onClick={() => {
                                  setInlineEditingId(prod.id);
                                  setInlinePriceVal(prod.price);
                                }}
                                title="Quick edit price"
                                className="text-[#e97822] hover:text-[#d7610d] p-0.5"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Stock Status */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={async () => {
                              await updateProduct(prod.id, { inStock: !prod.inStock });
                              notifySuccess(`Stock status toggled for ${prod.name}`);
                            }}
                            className={`px-2.5 py-1 text-[11px] font-bold transition-colors ${
                              prod.inStock
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            }`}
                          >
                            {prod.inStock ? '✓ In Stock' : '🔨 Built to Order'}
                          </button>
                        </td>

                        {/* Action Buttons with In-App Delete Confirmation */}
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#eaf2f9] hover:bg-[#d5e6f5] text-[#123b68] font-bold text-xs"
                            title="Edit all product info and image"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit All</span>
                          </button>

                          {/* IN-APP CONFIRMATION (REPLACES BLOCKED BROWSER CONFIRM) */}
                          {isConfirmingDelete ? (
                            <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-300 p-1 rounded">
                              <span className="text-[10px] text-rose-700 font-bold">Delete?</span>
                              <button
                                onClick={async () => {
                                  await deleteProduct(prod.id);
                                  setConfirmDeleteProdId(null);
                                  notifySuccess(`Deleted "${prod.name}" from Firestore`);
                                }}
                                className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-xs"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setConfirmDeleteProdId(null)}
                                className="px-1.5 py-0.5 text-neutral-500 hover:text-black font-semibold text-[10px]"
                              >
                                No
                              </button>
                            </span>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteProdId(prod.id)}
                              className="inline-flex items-center gap-1 p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: WORKSHOP & FRAMING MEDIA (PHOTOS & VIDEOS) ================= */}
      {activeTab === 'workshop' && (
        <div className="space-y-8">
          {/* Add Workshop Media Form */}
          <div className="bg-white p-6 border border-[#e5e8eb] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#e5e8eb] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#092744] font-serif flex items-center gap-2">
                  <Hammer className="w-4 h-4 text-[#e97822]" />
                  <span>Add Workshop & Framing Photo or Video</span>
                </h3>
                <p className="text-xs text-[#75808b]">
                  Upload photos and videos of sofa skeletons, hardwood cutting, wood joinery, and showroom assembly at Ojoo.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddWorkshopMediaSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Media Type Switcher */}
                <div>
                  <label className="block font-bold text-[#092744] mb-1">Media Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWorkshopMediaType('photo')}
                      className={`flex items-center justify-center gap-1.5 py-2 font-bold border transition-colors ${
                        workshopMediaType === 'photo'
                          ? 'bg-[#123b68] text-white border-[#123b68]'
                          : 'bg-[#f6f7f8] text-[#53606d] border-[#e5e8eb]'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWorkshopMediaType('video')}
                      className={`flex items-center justify-center gap-1.5 py-2 font-bold border transition-colors ${
                        workshopMediaType === 'video'
                          ? 'bg-[#e97822] text-white border-[#e97822]'
                          : 'bg-[#f6f7f8] text-[#53606d] border-[#e5e8eb]'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Video</span>
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#092744] mb-1">
                    {workshopMediaType === 'video' ? 'Video Title' : 'Photo Title'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      workshopMediaType === 'video'
                        ? 'e.g. Live Timber Joinery & Frame Assembling at Ojoo Workshop'
                        : 'e.g. Solid Teakwood Living Room Frame Structure'
                    }
                    value={workshopTitle}
                    onChange={(e) => setWorkshopTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                  />
                </div>
              </div>

              {/* VIDEO URL INPUT IF VIDEO */}
              {workshopMediaType === 'video' && (
                <div className="bg-[#fff9f2] p-4 border border-[#f5b82e]/50 space-y-2">
                  <label className="block font-bold text-[#092744] text-xs flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-[#e97822]" />
                    <span>Video URL (YouTube embed/link, Vimeo, or direct MP4 URL)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://www.youtube.com/watch?v=... or https://example.com/workshop-video.mp4"
                    value={workshopVideoUrl}
                    onChange={(e) => setWorkshopVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e8eb] bg-white focus:outline-none focus:border-[#e97822]"
                  />
                  <p className="text-[11px] text-[#75808b]">
                    Paste any YouTube, Vimeo, or direct MP4 link. Visitors will be able to play this video right on the Workshop & Framing gallery.
                  </p>
                </div>
              )}

              {/* PHOTO / COVER IMAGE SELECTOR */}
              <div className="bg-[#f6f7f8] p-4 border border-[#e5e8eb] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#092744] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#e97822]" />
                    <span>{workshopMediaType === 'video' ? 'Video Thumbnail / Cover Photo' : 'Workshop Photo'}</span>
                  </span>
                  {workshopImageUrl && (
                    <button
                      type="button"
                      onClick={() => setWorkshopImageUrl('')}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 bg-white px-2 py-0.5 border border-rose-200"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete / Clear Photo</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-28 h-20 bg-white border border-[#e5e8eb] flex items-center justify-center shrink-0 overflow-hidden relative">
                    {workshopImageUrl ? (
                      <img src={workshopImageUrl} alt="Workshop Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-[#75808b]">No Image</span>
                    )}
                  </div>

                  <div className="space-y-2 flex-1 w-full text-xs">
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#123b68] text-[#123b68] hover:bg-[#eaf2f9] font-bold cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Device Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleWorkshopPhotoUpload}
                          className="hidden"
                        />
                      </label>

                      <div className="flex flex-wrap gap-1">
                        {PRESET_IMAGES.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setWorkshopImageUrl(preset.url)}
                            className="px-2 py-1 bg-white border border-[#e5e8eb] hover:border-[#123b68] text-[11px]"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Or paste external photo URL..."
                      value={workshopImageUrl.startsWith('data:') ? '(Uploaded Device Image)' : workshopImageUrl}
                      onChange={(e) => setWorkshopImageUrl(e.target.value)}
                      className="w-full px-2 py-1 border border-[#e5e8eb] bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#092744] mb-1">Specifications / Joinery Timber</label>
                  <input
                    type="text"
                    placeholder="e.g. Treated Araba & Mahogany Timber"
                    value={workshopDimensions}
                    onChange={(e) => setWorkshopDimensions(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e8eb]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#092744] mb-1">Caption / Craft Details</label>
                  <input
                    type="text"
                    placeholder="e.g. Handcrafted hardwood framework with heavy-duty braces"
                    value={workshopCaption}
                    onChange={(e) => setWorkshopCaption(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e8eb]"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish to Workshop & Framing Gallery</span>
                </button>
              </div>
            </form>
          </div>

          {/* ACTIVE WORKSHOP & FRAMING MEDIA LIST */}
          <div className="bg-white border border-[#e5e8eb] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#e5e8eb] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[#092744] text-sm">
                  Active Workshop & Framing Media ({workshopMediaItems.length} items)
                </h3>
                <p className="text-xs text-[#75808b]">
                  Photos and videos visible to website visitors on the Workshop & Framing gallery tab.
                </p>
              </div>
            </div>

            {workshopMediaItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#75808b]">
                No workshop items yet. Use the form above to publish your first workshop photo or video!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {workshopMediaItems.map((item) => {
                  const isConfirming = confirmDeleteGalId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="bg-[#f6f7f8] border border-[#e5e8eb] overflow-hidden flex flex-col justify-between"
                    >
                      <div className="relative aspect-16/10 bg-neutral-900 overflow-hidden group">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/50 text-xs">
                            No Photo
                          </div>
                        )}

                        {item.mediaType === 'video' && (
                          <div className="absolute top-2 left-2 bg-[#e97822] text-white text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 shadow-sm">
                            <Play className="w-3 h-3 fill-current" />
                            <span>VIDEO</span>
                          </div>
                        )}

                        <div className="absolute top-2 right-2">
                          {isConfirming ? (
                            <div className="bg-white/95 p-1 rounded shadow-md flex items-center gap-1 border border-rose-300">
                              <span className="text-[10px] text-rose-700 font-bold px-1">Delete?</span>
                              <button
                                onClick={async () => {
                                  await deleteGalleryItem(item.id);
                                  setConfirmDeleteGalId(null);
                                  notifySuccess(`Deleted "${item.title}"`);
                                }}
                                className="bg-rose-600 text-white px-2 py-0.5 font-bold text-[10px]"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setConfirmDeleteGalId(null)}
                                className="text-neutral-600 px-1 text-[10px]"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteGalId(item.id)}
                              className="w-7 h-7 bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center rounded-full transition-colors"
                              title="Delete photo / video"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 space-y-1">
                        <strong className="block text-xs font-bold text-[#092744]">
                          {item.title}
                        </strong>
                        <p className="text-[11px] text-[#75808b] line-clamp-2">
                          {item.caption}
                        </p>
                        {item.dimensions && (
                          <span className="text-[10px] font-mono text-[#123b68] block pt-1">
                            Spec: {item.dimensions}
                          </span>
                        )}
                        {item.videoUrl && (
                          <span className="text-[10px] text-emerald-700 truncate block">
                            🎥 {item.videoUrl}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: SERVICES MANAGER ================= */}
      {activeTab === 'services' && (
        <div className="space-y-8">
          <div className="bg-white p-6 border border-[#e5e8eb] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#092744] font-serif flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#e97822]" />
              <span>Add New Service Offering (Saves to Firestore)</span>
            </h3>

            <form onSubmit={handleAddServiceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#092744] mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hotel & Hostel Bulk Mattressing"
                  value={newServiceTitle}
                  onChange={(e) => setNewServiceTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#092744] mb-1">Icon Representation</label>
                <select
                  value={newServiceIcon}
                  onChange={(e: any) => setNewServiceIcon(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e8eb] bg-white"
                >
                  <option value="chair">Chair / Furniture</option>
                  <option value="scissors">Scissors / Cutting</option>
                  <option value="penRuler">Design / Drafting</option>
                  <option value="wrench">Wrench / Repair & Finishing</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-[#092744] mb-1">Service Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe what customers receive..."
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-[#092744] mb-1">
                  Bullet Features (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bulk discounts, Free delivery in Ojoo, 3-year warranty"
                  value={newServiceFeatures}
                  onChange={(e) => setNewServiceFeatures(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                />
              </div>

              <div className="md:col-span-2 pt-1">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Publish Service to Firestore
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#092744]">
              Active Firestore Services ({services.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((srv) => {
                const isConfirming = confirmDeleteSrvId === srv.id;

                return (
                  <div
                    key={srv.id}
                    className="bg-white p-6 border border-[#e5e8eb] shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-[#e5e8eb]">
                        <span className="text-xs font-bold text-[#e97822]">
                          #{srv.number}
                        </span>

                        {isConfirming ? (
                          <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded">
                            <span className="text-[10px] text-rose-700 font-bold">Delete?</span>
                            <button
                              onClick={async () => {
                                await deleteService(srv.id);
                                setConfirmDeleteSrvId(null);
                                notifySuccess('Service removed from Firestore');
                              }}
                              className="px-2 py-0.5 bg-rose-600 text-white font-bold text-[10px]"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDeleteSrvId(null)}
                              className="px-1 text-neutral-500 text-[10px]"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteSrvId(srv.id)}
                            className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                            title="Delete service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <h4 className="font-bold text-[#092744] mt-2 font-serif text-base">
                        {srv.title}
                      </h4>
                      <p className="text-xs text-[#75808b] mt-1 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    {srv.features && (
                      <div className="pt-2 border-t border-[#e5e8eb] space-y-1 text-[11px] text-[#75808b]">
                        {srv.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f5b82e]" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: CUSTOMER INQUIRIES & QUOTE REQUESTS ================= */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#092744]">
              Customer Leads & Cut Calculations from Firestore
            </h3>
            <span className="text-xs text-[#75808b] font-medium">
              Synchronized real-time from contact forms and calculator
            </span>
          </div>

          {inquiries.length === 0 ? (
            <div className="bg-white p-12 text-center border border-[#e5e8eb] text-xs text-[#75808b]">
              No customer inquiries recorded in Firestore yet.
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => {
                const customerCleanPhone = inq.phone.replace(/[^0-9]/g, '');
                const directWhatsAppHref = `https://wa.me/234${customerCleanPhone.replace(/^0/, '')}?text=${encodeURIComponent(
                  `Hello ${inq.customerName}, this is Mudis Merit Venture regarding your inquiry for ${inq.serviceType}.`
                )}`;

                return (
                  <div
                    key={inq.id}
                    className="bg-white p-5 border border-[#e5e8eb] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-3">
                        <strong className="text-[#092744] font-bold text-sm">
                          {inq.customerName}
                        </strong>
                        <span className="text-xs text-[#75808b]">· {inq.phone}</span>
                        {inq.email && <span className="text-xs text-[#75808b]">· {inq.email}</span>}
                        <span className="text-[11px] font-mono text-neutral-400">
                          {inq.createdAt}
                        </span>
                      </div>

                      <div className="text-xs text-[#e97822] font-bold">
                        Service: {inq.serviceType}
                      </div>

                      <p className="text-xs text-[#3f4b57] bg-[#f6f7f8] p-2.5 border border-[#e5e8eb]">
                        "{inq.message}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={inq.status}
                        onChange={async (e: any) => {
                          await updateInquiryStatus(inq.id, e.target.value);
                          notifySuccess(`Lead status updated to ${e.target.value}`);
                        }}
                        className={`text-xs px-2.5 py-1.5 font-bold border ${
                          inq.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : inq.status === 'contacted'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="new">New Lead</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed / Sold</option>
                      </select>

                      <a
                        href={directWhatsAppHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#159447] text-white text-xs font-bold hover:bg-[#107a3a] transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat Client</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 5: DATABASE & CONFIG DIAGNOSTICS ================= */}
      {activeTab === 'database' && (
        <div className="bg-white p-6 border border-[#e5e8eb] shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#092744] font-serif flex items-center gap-2">
              <Database className="w-4 h-4 text-[#123b68]" />
              <span>Firebase Firestore Configuration & Status</span>
            </h3>
            <p className="text-xs text-[#75808b] mt-1">
              Active cloud parameters provisioned for Mudis Merit Venture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#f6f7f8] border border-[#e5e8eb] space-y-1">
              <span className="text-[#75808b] font-semibold">Firebase Project ID:</span>
              <p className="font-mono font-bold text-[#092744]">{firebaseConfig.projectId}</p>
            </div>

            <div className="p-4 bg-[#f6f7f8] border border-[#e5e8eb] space-y-1">
              <span className="text-[#75808b] font-semibold">Firestore Database ID:</span>
              <p className="font-mono font-bold text-[#092744]">{firebaseConfig.firestoreDatabaseId}</p>
            </div>

            <div className="p-4 bg-[#f6f7f8] border border-[#e5e8eb] space-y-1">
              <span className="text-[#75808b] font-semibold">Authentication Domain:</span>
              <p className="font-mono font-bold text-[#092744]">{firebaseConfig.authDomain}</p>
            </div>

            <div className="p-4 bg-[#f6f7f8] border border-[#e5e8eb] space-y-1">
              <span className="text-[#75808b] font-semibold">Bootstrapped Master Admin:</span>
              <p className="font-mono font-bold text-[#159447]">saleemqozeem6@gmail.com</p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e5e8eb] flex items-center justify-between text-xs text-[#75808b]">
            <span>Need to re-seed demo products and default services to Firestore?</span>
            <button
              type="button"
              onClick={async () => {
                await resetAllDataToDefaults();
                notifySuccess('Database re-seeded with initial company catalog!');
              }}
              className="flex items-center gap-1.5 text-[#75808b] hover:text-[#092744] underline font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-seed Defaults to Firestore</span>
            </button>
          </div>
        </div>
      )}

      {/* FULL EDIT PRODUCT MODAL (POPUP) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white max-w-2xl w-full border border-[#e5e8eb] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e5e8eb] pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#092744]">
                  Edit Product & Image
                </h3>
                <span className="text-xs text-[#75808b]">
                  ID: {editingProduct.id} · Saves directly to Firestore
                </span>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="w-7 h-7 bg-[#f6f7f8] hover:bg-[#e5e8eb] flex items-center justify-center text-[#092744]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-4 text-xs">
              {/* IMAGE MANAGER */}
              <div className="bg-[#f6f7f8] p-3 border border-[#e5e8eb] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#092744] uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-[#e97822]" />
                    <span>Product Image</span>
                  </span>
                  {editProdImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditProdImage('');
                        notifySuccess('Image removed from preview (Click Save to update database)');
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 bg-white px-2 py-0.5 border border-rose-200"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete / Remove Image</span>
                    </button>
                  )}
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-24 h-20 bg-white border border-[#e5e8eb] flex items-center justify-center shrink-0 overflow-hidden relative">
                    {editProdImage ? (
                      <img src={editProdImage} alt="Edit Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-[#75808b]">No Image</span>
                    )}
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#123b68] text-[#123b68] font-bold cursor-pointer hover:bg-[#eaf2f9]">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditProdImageUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="flex flex-wrap gap-1">
                      {PRESET_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditProdImage(preset.url)}
                          className="px-2 py-0.5 bg-white border border-[#e5e8eb] hover:border-[#123b68] text-[10px]"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Or paste external image URL..."
                      value={editProdImage.startsWith('data:') ? '(Uploaded Device Image)' : editProdImage}
                      onChange={(e) => setEditProdImage(e.target.value)}
                      className="w-full px-2 py-1 border border-[#e5e8eb] bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* CORE FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#092744] mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={editProdName}
                    onChange={(e) => setEditProdName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#092744] mb-1">Price in Naira (₦)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 font-bold text-[#e97822]">₦</span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editProdPrice}
                      onChange={(e) => setEditProdPrice(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 border border-[#e5e8eb] font-bold text-[#092744]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#092744] mb-1">Department</label>
                  <select
                    value={editProdCategory}
                    onChange={(e: any) => setEditProdCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e8eb] bg-white"
                  >
                    <option value="furniture">Furniture</option>
                    <option value="foam">Foam & Mattresses</option>
                    <option value="office">Office & Corporate</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#092744] mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={editProdSubcategory}
                    onChange={(e) => setEditProdSubcategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e8eb]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#092744] mb-1">Stock Status</label>
                  <select
                    value={editProdInStock ? 'true' : 'false'}
                    onChange={(e) => setEditProdInStock(e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-[#e5e8eb] bg-white font-bold"
                  >
                    <option value="true">✓ In Stock</option>
                    <option value="false">🔨 Built to Order</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#092744] mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={editProdDimensions}
                    onChange={(e) => setEditProdDimensions(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e8eb]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#092744] mb-1">Density & Materials</label>
                  <input
                    type="text"
                    value={editProdMaterial}
                    onChange={(e) => setEditProdMaterial(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e8eb]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#092744] mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editProdDesc}
                    onChange={(e) => setEditProdDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e8eb]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e5e8eb]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-[#e5e8eb] text-[#092744] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes to Firestore</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
