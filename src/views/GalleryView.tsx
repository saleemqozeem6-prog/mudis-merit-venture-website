import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GalleryItem } from '../types';
import { 
  X, 
  MessageCircle, 
  Maximize2, 
  ArrowRight, 
  Play, 
  Trash2, 
  Plus, 
  Video, 
  Image as ImageIcon, 
  Upload,
  CheckCircle2,
  Hammer
} from 'lucide-react';

const PRESET_WORKSHOP_IMAGES = [
  { label: 'Living Room Sofa Framing', url: '/src/assets/images/custom_sofa_living_1791093566797.jpg' },
  { label: 'Foam Cutting & Mattress Craft', url: '/src/assets/images/foam_mattress_craft_1791093554667.jpg' },
  { label: 'Showroom Suite Workshop', url: '/src/assets/images/hero_furniture_foam_1791093541655.jpg' },
];

export const GalleryView: React.FC = () => {
  const { 
    gallery, 
    addGalleryItem, 
    deleteGalleryItem, 
    generateWhatsAppInquiryUrl, 
    setCurrentView 
  } = useApp();

  const [filter, setFilter] = useState<string>('workshop');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [showAddMediaModal, setShowAddMediaModal] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Quick Add Media Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'workshop' | 'sofas' | 'foam' | 'mattresses' | 'installations'>('workshop');
  const [newMediaType, setNewMediaType] = useState<'photo' | 'video'>('photo');
  const [newImageUrl, setNewImageUrl] = useState('/src/assets/images/custom_sofa_living_1791093566797.jpg');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newDimensions, setNewDimensions] = useState('Seasoned Hardwood Framework');

  const notifyToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) setNewImageUrl(res);
    };
    reader.readAsDataURL(file);
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await addGalleryItem({
      title: newTitle.trim(),
      category: newCategory,
      imageUrl: newImageUrl || '/src/assets/images/custom_sofa_living_1791093566797.jpg',
      caption: newCaption.trim() || 'Workshop craftsmanship and hardwood framing at Ojoo, Ibadan.',
      dimensions: newDimensions.trim(),
      mediaType: newMediaType,
      videoUrl: newMediaType === 'video' ? newVideoUrl.trim() : '',
    });

    setNewTitle('');
    setNewCaption('');
    setNewVideoUrl('');
    setShowAddMediaModal(false);
    notifyToast(`Added new ${newMediaType === 'video' ? 'video' : 'photo'} to ${newCategory === 'workshop' ? 'Workshop & Framing' : 'Gallery'}!`);
  };

  const handleDeleteItem = async (id: string, title: string) => {
    await deleteGalleryItem(id);
    setConfirmDeleteId(null);
    if (activeItem?.id === id) {
      setActiveItem(null);
    }
    notifyToast(`Deleted "${title}"`);
  };

  const getEmbedVideoUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return url;
  };

  const filteredGallery = gallery.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <div className="py-12 sm:py-16 space-y-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Gallery Header */}
      <section className="container">
        <div className="bg-[#092744] text-white p-8 sm:p-12 relative overflow-hidden shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="section-tag text-[#f5b82e] text-[11px] font-extrabold tracking-[2px] uppercase block mb-1">
              MUDIS MERIT PORTFOLIO & WORKSHOP
            </span>
            <h1 className="font-serif text-[32px] sm:text-[44px] font-bold text-white tracking-tight leading-tight">
              Our Craftsmanship & Showroom Gallery
            </h1>
            <p className="text-white/80 text-[14px] sm:text-[15px] leading-relaxed">
              Explore customer furniture installations, high-density foam cutting blocks, orthopaedic mattresses, and live workshop framing videos from our Ojoo, Ibadan workshop.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setNewCategory(filter === 'all' ? 'workshop' : (filter as any));
                setShowAddMediaModal(true);
              }}
              className="btn btn-primary shadow-lg shadow-[#e97822]/20 flex items-center gap-2 text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Add Photo or Video</span>
            </button>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Quick Add Bar */}
      <section className="container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e8eb] pb-4 mb-8">
          <div className="flex items-center gap-1.5 p-1 bg-[#f6f7f8] border border-[#e5e8eb] overflow-x-auto">
            <button
              onClick={() => setFilter('workshop')}
              className={`px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                filter === 'workshop' ? 'bg-[#123b68] text-white shadow-xs' : 'text-[#53606d] hover:text-[#123b68]'
              }`}
            >
              <Hammer className="w-3.5 h-3.5 text-[#f5b82e]" />
              <span>Workshop & Framing</span>
            </button>
            <button
              onClick={() => setFilter('sofas')}
              className={`px-4 py-2 text-xs font-bold transition-all ${
                filter === 'sofas' ? 'bg-[#123b68] text-white shadow-xs' : 'text-[#53606d] hover:text-[#123b68]'
              }`}
            >
              Finished Sofas & Parlours
            </button>
            <button
              onClick={() => setFilter('foam')}
              className={`px-4 py-2 text-xs font-bold transition-all ${
                filter === 'foam' ? 'bg-[#123b68] text-white shadow-xs' : 'text-[#53606d] hover:text-[#123b68]'
              }`}
            >
              Foam Sizing & Cores
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-xs font-bold transition-all ${
                filter === 'all' ? 'bg-[#123b68] text-white shadow-xs' : 'text-[#53606d] hover:text-[#123b68]'
              }`}
            >
              All Portfolio
            </button>
          </div>

          <div className="text-xs text-[#75808b]">
            Showing <strong className="text-[#092744] font-bold">{filteredGallery.length}</strong> items
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredGallery.length === 0 ? (
          <div className="bg-[#f6f7f8] border border-[#e5e8eb] p-12 text-center text-xs text-[#75808b] space-y-3">
            <p>No media found in this category.</p>
            <button
              onClick={() => {
                setNewCategory(filter === 'all' ? 'workshop' : (filter as any));
                setShowAddMediaModal(true);
              }}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Item</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => {
              const isConfirming = confirmDeleteId === item.id;
              const isVideo = item.mediaType === 'video';

              return (
                <div
                  key={item.id}
                  className="group bg-white border border-[#e5e8eb] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between relative"
                >
                  {/* Media Preview Box */}
                  <div 
                    onClick={() => setActiveItem(item)}
                    className="relative aspect-4/3 overflow-hidden bg-neutral-900 cursor-pointer"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50 text-xs">
                        No Image
                      </div>
                    )}

                    {/* Video Badge / Play Button */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-[#e97822] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Category Tag */}
                    <div className="absolute top-3 left-3 bg-[#092744] text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider flex items-center gap-1">
                      {isVideo && <Video className="w-3 h-3 text-[#f5b82e]" />}
                      <span>{item.category}</span>
                    </div>

                    {/* Direct Delete Button on Card */}
                    <div 
                      className="absolute top-3 right-3 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isConfirming ? (
                        <div className="bg-white/95 border border-rose-300 p-1 rounded shadow-lg flex items-center gap-1 animate-in fade-in">
                          <span className="text-[10px] text-rose-700 font-bold px-1">Delete?</span>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.title)}
                            className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-xs"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-1 text-neutral-500 hover:text-black text-[10px]"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="w-7 h-7 bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center rounded-full transition-colors shadow-sm"
                          title="Delete this photo / video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Caption & Specs */}
                  <div 
                    onClick={() => setActiveItem(item)}
                    className="p-5 space-y-2 cursor-pointer"
                  >
                    <h3 className="font-serif font-bold text-[#092744] text-base group-hover:text-[#123b68] transition-colors flex items-center justify-between">
                      <span>{item.title}</span>
                      {isVideo && <span className="text-xs text-[#e97822] font-bold">Watch Video</span>}
                    </h3>
                    <p className="text-xs text-[#75808b] leading-relaxed">
                      {item.caption}
                    </p>
                    {item.dimensions && (
                      <div className="pt-2 text-[11px] text-[#123b68] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Hammer className="w-3 h-3 text-[#e97822]" />
                        <span>Spec: {item.dimensions}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= LIGHTBOX / VIDEO PLAYER MODAL ================= */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative bg-white max-w-3xl w-full overflow-hidden shadow-2xl border border-[#e5e8eb]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Screen (Photo or Video Player) */}
            <div className="relative aspect-16/10 bg-black flex items-center justify-center overflow-hidden">
              {activeItem.mediaType === 'video' && activeItem.videoUrl ? (
                activeItem.videoUrl.includes('youtube.com') || activeItem.videoUrl.includes('youtu.be') || activeItem.videoUrl.includes('vimeo.com') ? (
                  <iframe
                    src={getEmbedVideoUrl(activeItem.videoUrl)}
                    title={activeItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    src={activeItem.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Details & Actions */}
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e5e8eb] pb-3">
                <div>
                  <span className="section-tag text-[#e97822] text-[11px] font-extrabold tracking-[2px] uppercase block mb-1">
                    {activeItem.category} · {activeItem.mediaType === 'video' ? 'Workshop Video' : 'Workshop Photography'}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#092744]">
                    {activeItem.title}
                  </h3>
                </div>

                {/* Direct Delete in Modal */}
                <button
                  type="button"
                  onClick={() => handleDeleteItem(activeItem.id, activeItem.title)}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1.5 p-1.5 bg-rose-50 border border-rose-200 self-start"
                  title="Delete this item from Firestore"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete This {activeItem.mediaType === 'video' ? 'Video' : 'Photo'}</span>
                </button>
              </div>

              <p className="text-sm text-[#75808b] leading-relaxed">
                {activeItem.caption}
              </p>

              {activeItem.dimensions && (
                <div className="text-xs font-semibold text-[#092744]">
                  <strong>Specifications: </strong>{activeItem.dimensions}
                </div>
              )}

              <div className="pt-2 border-t border-[#e5e8eb] flex flex-wrap items-center justify-between gap-3">
                <a
                  href={generateWhatsAppInquiryUrl(
                    `Inquiry about: ${activeItem.title}`,
                    `I saw "${activeItem.title}" in your workshop & framing gallery. Can you build or supply something similar for me in Ibadan?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Request Custom Build on WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    setActiveItem(null);
                    setCurrentView('calculator');
                  }}
                  className="text-link text-xs font-bold"
                >
                  <span>Need Custom Foam Cutting?</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD WORKSHOP PHOTO / VIDEO MODAL ================= */}
      {showAddMediaModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
        >
          <div className="bg-white max-w-xl w-full border border-[#e5e8eb] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#e5e8eb] pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#092744] flex items-center gap-2">
                  <Hammer className="w-4 h-4 text-[#e97822]" />
                  <span>Add Workshop & Framing Media</span>
                </h3>
                <span className="text-xs text-[#75808b]">
                  Saves directly to Firebase Firestore
                </span>
              </div>
              <button
                onClick={() => setShowAddMediaModal(false)}
                className="w-7 h-7 bg-[#f6f7f8] hover:bg-[#e5e8eb] flex items-center justify-center text-[#092744]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMedia} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div>
                <label className="block font-bold text-[#092744] mb-1">Media Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewMediaType('photo')}
                    className={`py-2 px-3 font-bold flex items-center justify-center gap-2 border transition-colors ${
                      newMediaType === 'photo'
                        ? 'bg-[#123b68] text-white border-[#123b68]'
                        : 'bg-[#f6f7f8] text-[#53606d] border-[#e5e8eb]'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMediaType('video')}
                    className={`py-2 px-3 font-bold flex items-center justify-center gap-2 border transition-colors ${
                      newMediaType === 'video'
                        ? 'bg-[#e97822] text-white border-[#e97822]'
                        : 'bg-[#f6f7f8] text-[#53606d] border-[#e5e8eb]'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Video</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#092744] mb-1">
                  {newMediaType === 'video' ? 'Video Title' : 'Photo Title'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    newMediaType === 'video'
                      ? 'e.g. Hardwood Joinery & Framing Assembly at Ojoo'
                      : 'e.g. Solid Teakwood Parlour Skeleton Structure'
                  }
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e8eb] focus:outline-none focus:border-[#123b68]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#092744] mb-1">Target Category</label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e8eb] bg-white font-bold"
                >
                  <option value="workshop">🔨 Workshop & Framing</option>
                  <option value="sofas">🛋️ Finished Sofas & Parlours</option>
                  <option value="foam">📐 Foam Sizing & Cores</option>
                  <option value="mattresses">🛏️ Mattresses</option>
                </select>
              </div>

              {/* If Video: URL Input */}
              {newMediaType === 'video' && (
                <div className="bg-[#fff8f0] p-3 border border-[#f5b82e] space-y-1">
                  <label className="block font-bold text-[#092744]">Video Link / URL</label>
                  <input
                    type="text"
                    required
                    placeholder="https://www.youtube.com/watch?v=... or direct MP4 link"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#e5e8eb] bg-white"
                  />
                  <span className="text-[10px] text-[#75808b] block">
                    Supports YouTube, Vimeo, or direct MP4 video streams.
                  </span>
                </div>
              )}

              {/* Photo / Cover Photo Selector */}
              <div className="bg-[#f6f7f8] p-3 border border-[#e5e8eb] space-y-2">
                <span className="font-bold text-[#092744] block">
                  {newMediaType === 'video' ? 'Video Cover / Thumbnail Photo' : 'Upload or Select Photo'}
                </span>

                <div className="flex gap-3 items-center">
                  <div className="w-20 h-16 bg-white border border-[#e5e8eb] shrink-0 overflow-hidden">
                    {newImageUrl ? (
                      <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] text-[#75808b] flex items-center justify-center h-full">No Photo</span>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <label className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#123b68] text-[#123b68] font-bold cursor-pointer hover:bg-[#eaf2f9]">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="flex flex-wrap gap-1">
                      {PRESET_WORKSHOP_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewImageUrl(preset.url)}
                          className="px-1.5 py-0.5 bg-white border border-[#e5e8eb] text-[10px]"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#092744] mb-1">Specifications (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Treated Araba Timber + 4x3 Braces"
                  value={newDimensions}
                  onChange={(e) => setNewDimensions(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e8eb]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#092744] mb-1">Caption / Craft Details</label>
                <textarea
                  rows={2}
                  placeholder="Describe framing, foam core, or client installation..."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e8eb]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e5e8eb]">
                <button
                  type="button"
                  onClick={() => setShowAddMediaModal(false)}
                  className="px-4 py-2 border border-[#e5e8eb] text-[#092744] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Publish to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
