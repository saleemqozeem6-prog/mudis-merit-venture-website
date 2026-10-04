import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/initialData';
import { 
  X, 
  MessageCircle, 
  Phone, 
  Check, 
  ShieldCheck, 
  Ruler, 
  Layers, 
  Edit3, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  Eye, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Living Room Sofa', url: '/src/assets/images/custom_sofa_living_1791093566797.jpg' },
  { label: 'Foam & Mattress', url: '/src/assets/images/foam_mattress_craft_1791093554667.jpg' },
  { label: 'Showroom Suite', url: '/src/assets/images/hero_furniture_foam_1791093541655.jpg' },
];

export const ProductModal: React.FC = () => {
  const { 
    selectedProductForModal, 
    setSelectedProductForModal, 
    generateWhatsAppOrderUrl,
    updateProduct,
    deleteProduct,
    isAdminLoggedIn,
    firebaseUser
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [imageDeletedToast, setImageDeletedToast] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editCategory, setEditCategory] = useState<'foam' | 'furniture' | 'mattress' | 'office'>('furniture');
  const [editSubcategory, setEditSubcategory] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDimensions, setEditDimensions] = useState('');
  const [editDensityOrMaterial, setEditDensityOrMaterial] = useState('');
  const [editWarranty, setEditWarranty] = useState('');
  const [editInStock, setEditInStock] = useState(true);

  // Sync state when product opens or changes
  useEffect(() => {
    if (selectedProductForModal) {
      setEditName(selectedProductForModal.name || '');
      setEditPrice(selectedProductForModal.price || 0);
      setEditCategory(selectedProductForModal.category || 'furniture');
      setEditSubcategory(selectedProductForModal.subcategory || '');
      setEditImage(selectedProductForModal.image || '');
      setEditDescription(selectedProductForModal.description || '');
      setEditDimensions(selectedProductForModal.dimensions || '');
      setEditDensityOrMaterial(selectedProductForModal.densityOrMaterial || '');
      setEditWarranty(selectedProductForModal.warranty || '');
      setEditInStock(selectedProductForModal.inStock ?? true);
      setIsEditing(false);
      setSaveSuccess(false);
    }
  }, [selectedProductForModal]);

  if (!selectedProductForModal) return null;

  const product = selectedProductForModal;
  const whatsappUrl = generateWhatsAppOrderUrl(product, customNote);

  // Handle local file upload (converts to data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit client-side preview to ~1MB
    if (file.size > 2 * 1024 * 1024) {
      alert('Please select an image smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setEditImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save changes directly to Firestore
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || editPrice < 0) return;

    const updatedData = {
      name: editName.trim(),
      price: Number(editPrice),
      category: editCategory,
      subcategory: editSubcategory.trim(),
      image: editImage,
      description: editDescription.trim(),
      dimensions: editDimensions.trim(),
      densityOrMaterial: editDensityOrMaterial.trim(),
      warranty: editWarranty.trim(),
      inStock: editInStock,
    };

    await updateProduct(product.id, updatedData);

    // Update current active modal product view
    setSelectedProductForModal({
      ...product,
      ...updatedData,
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 1200);
  };

  // Delete product with in-app confirmation
  const executeDeleteProduct = async () => {
    await deleteProduct(product.id);
    setSelectedProductForModal(null);
  };

  // Immediate delete image action
  const handleDeleteImageImmediately = async () => {
    setEditImage('');
    await updateProduct(product.id, { image: '' });
    setSelectedProductForModal({
      ...product,
      image: '',
    });
    setImageDeletedToast(true);
    setTimeout(() => setImageDeletedToast(false), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div
        className="relative bg-white max-w-3xl w-full overflow-hidden shadow-2xl border border-[#e5e8eb] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="bg-[#092744] text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-[#123b68]">
          <div className="flex items-center gap-2">
            <span className="text-[#f5b82e] font-bold uppercase tracking-wider text-[11px]">
              {isEditing ? 'Editing Product Mode' : 'Product Information'}
            </span>
            {saveSuccess && (
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
                <Check className="w-3 h-3" />
                Saved to Firestore!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Edit Button */}
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 px-2.5 py-1 font-bold text-xs transition-colors rounded-xs ${
                isEditing
                  ? 'bg-[#e97822] text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isEditing ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Mode</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-[#f5b82e]" />
                  <span>Edit Product</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={() => setSelectedProductForModal(null)}
              className="w-7 h-7 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center rounded-xs transition-colors"
              aria-label="Close product view"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= EDIT MODE ================= */}
        {isEditing ? (
          <form onSubmit={handleSaveChanges} className="p-5 sm:p-7 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="border-b border-[#e5e8eb] pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#092744]">
                  Edit Product Information
                </h3>
                <p className="text-xs text-[#75808b]">
                  Updates are saved directly to Firebase Firestore in real-time.
                </p>
              </div>
              {confirmDeleteModal ? (
                <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 p-1.5 rounded">
                  <span className="text-xs text-rose-700 font-bold">Permanently delete?</span>
                  <button
                    type="button"
                    onClick={executeDeleteProduct}
                    className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xs"
                  >
                    Yes, Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteModal(false)}
                    className="px-1.5 py-0.5 text-neutral-600 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteModal(true)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 p-1 hover:bg-rose-50 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Product</span>
                </button>
              )}
            </div>

            {/* IMAGE MANAGEMENT SECTION */}
            <div className="bg-[#f6f7f8] p-4 border border-[#e5e8eb] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#092744] uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#e97822]" />
                  <span>Product Image</span>
                </label>
                {editImage ? (
                  <button
                    type="button"
                    onClick={() => setEditImage('')}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 bg-white px-2.5 py-1 border border-rose-200 shadow-2xs hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Image</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 border border-amber-200">
                    No image set (Placeholder will show)
                  </span>
                )}
              </div>

              {/* Image Preview Box */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-36 h-28 bg-white border border-[#e5e8eb] overflow-hidden flex items-center justify-center shrink-0 relative">
                  {editImage ? (
                    <>
                      <img
                        src={editImage}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setEditImage('')}
                        title="Delete this image"
                        className="absolute top-1 right-1 w-6 h-6 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-rose-700 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-2 text-[#75808b]">
                      <ImageIcon className="w-6 h-6 mx-auto mb-1 text-neutral-300" />
                      <span className="text-[10px] block">No Image</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1 w-full text-xs">
                  {/* File Upload Trigger */}
                  <div>
                    <span className="text-[11px] font-semibold text-[#092744] block mb-1">
                      Upload from phone or computer:
                    </span>
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#123b68] text-[#123b68] hover:bg-[#eaf2f9] font-bold cursor-pointer transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose New Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Preset Quick Select */}
                  <div>
                    <span className="text-[11px] font-semibold text-[#092744] block mb-1">
                      Or select from workshop presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditImage(preset.url)}
                          className="px-2 py-1 bg-white border border-[#e5e8eb] hover:border-[#123b68] text-[#3f4b57] text-[11px] font-medium"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom URL Input */}
                  <div>
                    <input
                      type="text"
                      placeholder="Or paste external image URL..."
                      value={editImage.startsWith('data:') ? '(Uploaded Image Data)' : editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-[#e5e8eb] bg-white focus:outline-none focus:border-[#123b68]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCT CORE DETAILS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-[#092744] mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                />
              </div>

              {/* Price Editor */}
              <div>
                <label className="block font-bold text-[#092744] mb-1">
                  Price in Naira (₦)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 font-bold text-[#e97822]">₦</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 border border-[#e5e8eb] font-bold text-[#092744] focus:outline-none focus:border-[#123b68]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#092744] mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={(e: any) => setEditCategory(e.target.value)}
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
                  value={editSubcategory}
                  onChange={(e) => setEditSubcategory(e.target.value)}
                  placeholder="e.g. Living Room, Mattresses"
                  className="w-full px-3 py-2 border border-[#e5e8eb]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#092744] mb-1">Stock Status</label>
                <select
                  value={editInStock ? 'true' : 'false'}
                  onChange={(e) => setEditInStock(e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-[#e5e8eb] bg-white font-bold"
                >
                  <option value="true">✓ In Stock (Available Now)</option>
                  <option value="false">🔨 Built to Order</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#092744] mb-1">Dimensions</label>
                <input
                  type="text"
                  value={editDimensions}
                  onChange={(e) => setEditDimensions(e.target.value)}
                  placeholder="e.g. 6ft x 6ft x 10 inches"
                  className="w-full px-3 py-2 border border-[#e5e8eb]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#092744] mb-1">Core & Density / Material</label>
                <input
                  type="text"
                  value={editDensityOrMaterial}
                  onChange={(e) => setEditDensityOrMaterial(e.target.value)}
                  placeholder="e.g. High Density D24 + Teak Wood"
                  className="w-full px-3 py-2 border border-[#e5e8eb]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#092744] mb-1">Warranty</label>
                <input
                  type="text"
                  value={editWarranty}
                  onChange={(e) => setEditWarranty(e.target.value)}
                  placeholder="e.g. 5 Years Warranty"
                  className="w-full px-3 py-2 border border-[#e5e8eb]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-bold text-[#092744] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                />
              </div>
            </div>

            {/* SAVE & CANCEL BUTTONS */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#e5e8eb]">
              <div className="text-xs text-[#75808b]">
                New Price: <strong className="text-[#092744] font-bold text-sm">₦{Number(editPrice).toLocaleString()}</strong>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 sm:flex-none px-4 py-2 border border-[#e5e8eb] hover:bg-[#f6f7f8] text-[#092744] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none btn btn-primary flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes to Firestore</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* ================= VIEW MODE ================= */
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Column */}
            <div className="relative bg-[#f6f7f8] min-h-[260px] md:min-h-[420px] flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="text-center p-8 text-[#75808b]">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
                  <p className="text-xs font-semibold">No Image Set</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 text-xs text-[#e97822] font-bold underline"
                  >
                    Add / Upload Image
                  </button>
                </div>
              )}

              <div className="absolute bottom-3 left-3 bg-[#092744] text-white text-xs px-2.5 py-1 font-bold tracking-wide uppercase">
                {product.category === 'foam' ? 'Foam & Mattress' : 'Bespoke Furniture'}
              </div>

              {/* Quick Image Delete & Edit Buttons right on the view image */}
              <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-2.5 py-1 bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1 rounded-xs transition-colors"
                >
                  <Edit3 className="w-3 h-3 text-[#f5b82e]" />
                  <span>Edit Info & Price</span>
                </button>
                {product.image && (
                  <button
                    onClick={handleDeleteImageImmediately}
                    className="px-2.5 py-1 bg-rose-900/80 hover:bg-rose-800 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1 rounded-xs transition-colors shadow-sm"
                    title="Directly delete this photo"
                  >
                    <Trash2 className="w-3 h-3 text-rose-300" />
                    <span>Delete Photo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Details Column */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="section-tag text-[#e97822] text-[11px] font-extrabold tracking-[2px] uppercase block mb-1">
                      {product.subcategory || product.category}
                    </span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-[#123b68] hover:text-[#e97822] font-bold inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Price / Details</span>
                    </button>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#092744] leading-snug">
                    {product.name}
                  </h3>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2.5 bg-[#f6f7f8] p-3 border border-[#e5e8eb]">
                  <span className="text-2xl sm:text-3xl font-bold text-[#092744] tabular-nums font-sans">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    product.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    {product.inStock ? 'Available in Ibadan' : 'Built to Order'}
                  </span>
                </div>

                <p className="text-sm text-[#75808b] leading-relaxed">
                  {product.description}
                </p>

                {/* Technical Specifications */}
                <div className="border-t border-[#e5e8eb] pt-3 space-y-2 text-xs text-[#3f4b57]">
                  {product.dimensions && (
                    <div className="flex items-start gap-2">
                      <Ruler className="w-4 h-4 text-[#e97822] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#092744]">Dimensions: </span>
                        {product.dimensions}
                      </div>
                    </div>
                  )}
                  {product.densityOrMaterial && (
                    <div className="flex items-start gap-2">
                      <Layers className="w-4 h-4 text-[#e97822] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#092744]">Core & Material: </span>
                        {product.densityOrMaterial}
                      </div>
                    </div>
                  )}
                  {product.warranty && (
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#159447] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#092744]">Warranty: </span>
                        {product.warranty}
                      </div>
                    </div>
                  )}
                </div>

                {/* Optional Custom Request field */}
                <div className="pt-1">
                  <label className="block text-xs font-bold text-[#092744] mb-1">
                    Custom size, fabric color, or delivery note (optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Need royal blue velvet or 12-inch thickness"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                  />
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-6 space-y-2.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn btn-whatsapp text-center"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Order on WhatsApp</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${COMPANY_INFO.phoneRaw}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#eaf2f9] hover:bg-[#d5e6f5] text-[#123b68] font-bold text-xs text-center transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#123b68]" />
                    <span>Call Showroom</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `MUDIS MERIT VENTURE: ${product.name} (₦${product.price.toLocaleString()}) - Tel: ${COMPANY_INFO.phone}`
                      );
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 border border-[#e5e8eb] hover:bg-[#f6f7f8] text-[#092744] text-xs font-semibold transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                    <span>{copied ? 'Details Copied' : 'Share / Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
