import React, { createContext, useContext, useState, useEffect } from 'react';
import { PageView, Product, ServiceItem, GalleryItem, CustomerInquiry } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SERVICES, INITIAL_GALLERY, INITIAL_INQUIRIES, COMPANY_INFO } from '../data/initialData';
import { db, auth, handleFirestoreError, OperationType, signInWithGoogle, signOutAdmin } from '../firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AppContextType {
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id'>) => Promise<void>;
  updateService: (id: string, service: Partial<ServiceItem>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  updateGalleryItem: (id: string, update: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  inquiries: CustomerInquiry[];
  addInquiry: (inquiry: Omit<CustomerInquiry, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateInquiryStatus: (id: string, status: CustomerInquiry['status']) => Promise<void>;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  firebaseUser: User | null;
  loginWithGoogle: () => Promise<void>;
  logoutAdmin: () => Promise<void>;
  isFirebaseConnected: boolean;
  generateWhatsAppOrderUrl: (product: Product, customNote?: string) => string;
  generateWhatsAppInquiryUrl: (topic: string, details: string) => string;
  resetAllDataToDefaults: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize current view from hash or default to 'home'
  const [currentView, setCurrentView] = useState<PageView>(() => {
    try {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (['home', 'mission', 'vision', 'products', 'calculator', 'gallery', 'contact', 'admin'].includes(hash)) {
        return hash as PageView;
      }
    } catch {}
    return 'home';
  });

  // Listen to browser hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (['home', 'mission', 'vision', 'products', 'calculator', 'gallery', 'contact', 'admin'].includes(hash)) {
        setCurrentView(hash as PageView);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeView = (view: PageView) => {
    setCurrentView(view);
    if (view === 'home') {
      history.pushState(null, '', window.location.pathname);
    } else {
      window.location.hash = view;
    }
  };

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Authentication States
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  // Products, Services, Gallery, Inquiries
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mm_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('mm_services');
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('mm_gallery');
      return saved ? JSON.parse(saved) : INITIAL_GALLERY;
    } catch {
      return INITIAL_GALLERY;
    }
  });

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('mm_inquiries');
      return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  });

  // Track Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        // If logged in via Google, check if authorized admin
        if (user.email === 'saleemqozeem6@gmail.com') {
          setIsAdminLoggedIn(true);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync Products from Firestore
  useEffect(() => {
    const productsPath = 'products';
    const unsub = onSnapshot(
      collection(db, productsPath),
      async (snapshot) => {
        if (!snapshot.empty) {
          const loadedProducts = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Product, 'id'>),
          }));
          setProducts(loadedProducts);
          localStorage.setItem('mm_products', JSON.stringify(loadedProducts));
        } else {
          // Seed initial products to Firestore if collection is empty
          try {
            for (const prod of INITIAL_PRODUCTS) {
              await setDoc(doc(db, 'products', prod.id), {
                name: prod.name,
                category: prod.category,
                subcategory: prod.subcategory,
                price: prod.price,
                image: prod.image,
                description: prod.description,
                dimensions: prod.dimensions || '',
                densityOrMaterial: prod.densityOrMaterial || '',
                warranty: prod.warranty || '',
                inStock: prod.inStock,
                featured: prod.featured || false,
                createdAt: new Date().toISOString(),
              });
            }
          } catch (seedErr) {
            console.warn('Initial product seed note:', seedErr);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, productsPath);
        setIsFirebaseConnected(false);
      }
    );
    return () => unsub();
  }, []);

  // Sync Services from Firestore
  useEffect(() => {
    const servicesPath = 'services';
    const unsub = onSnapshot(
      collection(db, servicesPath),
      async (snapshot) => {
        if (!snapshot.empty) {
          const loadedServices = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<ServiceItem, 'id'>),
          }));
          // Sort by number
          loadedServices.sort((a, b) => a.number.localeCompare(b.number));
          setServices(loadedServices);
          localStorage.setItem('mm_services', JSON.stringify(loadedServices));
        } else {
          // Seed initial services to Firestore if collection is empty
          try {
            for (const srv of INITIAL_SERVICES) {
              await setDoc(doc(db, 'services', srv.id), {
                number: srv.number,
                title: srv.title,
                description: srv.description,
                iconName: srv.iconName,
                features: srv.features || [],
              });
            }
          } catch (seedErr) {
            console.warn('Initial service seed note:', seedErr);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, servicesPath);
      }
    );
    return () => unsub();
  }, []);

  // Sync Gallery & Workshop Media from Firestore
  useEffect(() => {
    const galleryPath = 'gallery';
    const unsub = onSnapshot(
      collection(db, galleryPath),
      async (snapshot) => {
        if (!snapshot.empty) {
          const loadedGallery = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<GalleryItem, 'id'>),
          }));
          setGallery(loadedGallery);
          localStorage.setItem('mm_gallery', JSON.stringify(loadedGallery));
        } else {
          // Seed initial gallery items if empty
          try {
            for (const item of INITIAL_GALLERY) {
              await setDoc(doc(db, 'gallery', item.id), {
                title: item.title,
                category: item.category,
                imageUrl: item.imageUrl,
                caption: item.caption,
                dimensions: item.dimensions || '',
                mediaType: 'photo',
                videoUrl: '',
                createdAt: new Date().toISOString(),
              });
            }
          } catch (seedErr) {
            console.warn('Initial gallery seed note:', seedErr);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, galleryPath);
      }
    );
    return () => unsub();
  }, []);

  // Sync Inquiries from Firestore (Only when authorized admin or listening safely)
  useEffect(() => {
    if (!isAdminLoggedIn && !firebaseUser) return;
    const inquiriesPath = 'inquiries';
    const unsub = onSnapshot(
      collection(db, inquiriesPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedInquiries = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<CustomerInquiry, 'id'>),
          }));
          setInquiries(loadedInquiries);
          localStorage.setItem('mm_inquiries', JSON.stringify(loadedInquiries));
        }
      },
      (error) => {
        console.warn('Inquiries sync note:', error);
      }
    );
    return () => unsub();
  }, [isAdminLoggedIn, firebaseUser]);

  // Scroll to top whenever view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Product Operations (Firestore Backend)
  const addProduct = async (product: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = { ...product, id };

    // Optimistic UI update
    setProducts((prev) => [newProduct, ...prev]);

    try {
      await setDoc(doc(db, 'products', id), {
        name: product.name,
        category: product.category,
        subcategory: product.subcategory || '',
        price: product.price,
        image: product.image,
        description: product.description,
        dimensions: product.dimensions || '',
        densityOrMaterial: product.densityOrMaterial || '',
        warranty: product.warranty || '',
        inStock: product.inStock,
        featured: product.featured || false,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `products/${id}`);
    }
  };

  const updateProduct = async (id: string, productUpdate: Partial<Product>) => {
    const existing = products.find((p) => p.id === id);
    const merged: Product = existing
      ? { ...existing, ...productUpdate }
      : ({
          id,
          name: 'Product',
          category: 'furniture',
          subcategory: '',
          price: 0,
          image: '',
          description: '',
          dimensions: '',
          densityOrMaterial: '',
          warranty: '',
          inStock: true,
          ...productUpdate,
        } as Product);

    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...productUpdate } : p)));

    try {
      await setDoc(
        doc(db, 'products', id),
        {
          name: merged.name,
          category: merged.category,
          subcategory: merged.subcategory || '',
          price: Number(merged.price),
          image: merged.image || '',
          description: merged.description || '',
          dimensions: merged.dimensions || '',
          densityOrMaterial: merged.densityOrMaterial || '',
          warranty: merged.warranty || '',
          inStock: merged.inStock,
          featured: merged.featured || false,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  };

  // Service Operations (Firestore Backend)
  const addService = async (service: Omit<ServiceItem, 'id'>) => {
    const id = `srv-${Date.now()}`;
    const newService: ServiceItem = { ...service, id };

    setServices((prev) => [...prev, newService]);

    try {
      await setDoc(doc(db, 'services', id), {
        number: service.number,
        title: service.title,
        description: service.description,
        iconName: service.iconName,
        features: service.features || [],
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `services/${id}`);
    }
  };

  const updateService = async (id: string, serviceUpdate: Partial<ServiceItem>) => {
    const existing = services.find((s) => s.id === id);
    const merged: ServiceItem = existing
      ? { ...existing, ...serviceUpdate }
      : ({
          id,
          number: '01',
          title: 'Service',
          description: '',
          iconName: 'chair',
          features: [],
          ...serviceUpdate,
        } as ServiceItem);

    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...serviceUpdate } : s)));

    try {
      await setDoc(
        doc(db, 'services', id),
        {
          number: merged.number,
          title: merged.title,
          description: merged.description,
          iconName: merged.iconName,
          features: merged.features || [],
        },
        { merge: true }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `services/${id}`);
    }
  };

  const deleteService = async (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));

    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `services/${id}`);
    }
  };

  // Gallery & Workshop Media Operations (Firestore Backend)
  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    const id = `gal-${Date.now()}`;
    const newGalleryItem: GalleryItem = {
      ...item,
      id,
      mediaType: item.mediaType || 'photo',
      createdAt: new Date().toISOString(),
    };

    setGallery((prev) => [newGalleryItem, ...prev]);

    try {
      await setDoc(doc(db, 'gallery', id), {
        title: item.title,
        category: item.category,
        imageUrl: item.imageUrl || '',
        caption: item.caption,
        dimensions: item.dimensions || '',
        mediaType: item.mediaType || 'photo',
        videoUrl: item.videoUrl || '',
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `gallery/${id}`);
    }
  };

  const updateGalleryItem = async (id: string, update: Partial<GalleryItem>) => {
    setGallery((prev) => prev.map((g) => (g.id === id ? { ...g, ...update } : g)));

    try {
      await setDoc(doc(db, 'gallery', id), update, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `gallery/${id}`);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));

    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
    }
  };

  // Inquiry Operations (Firestore Backend)
  const addInquiry = async (inquiry: Omit<CustomerInquiry, 'id' | 'createdAt' | 'status'>) => {
    const id = `inq-${Date.now()}`;
    const createdAt = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const newInquiry: CustomerInquiry = {
      ...inquiry,
      id,
      createdAt,
      status: 'new',
    };

    setInquiries((prev) => [newInquiry, ...prev]);

    try {
      await setDoc(doc(db, 'inquiries', id), {
        customerName: inquiry.customerName,
        phone: inquiry.phone,
        email: inquiry.email || '',
        serviceType: inquiry.serviceType,
        message: inquiry.message,
        status: 'new',
        createdAt,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `inquiries/${id}`);
    }
  };

  const updateInquiryStatus = async (id: string, status: CustomerInquiry['status']) => {
    setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)));

    try {
      await updateDoc(doc(db, 'inquiries', id), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `inquiries/${id}`);
    }
  };

  // Google Authentication Functions
  const loginWithGoogle = async () => {
    const user = await signInWithGoogle();
    setFirebaseUser(user);
    if (user.email === 'saleemqozeem6@gmail.com') {
      setIsAdminLoggedIn(true);
    }
  };

  const logoutAdmin = async () => {
    await signOutAdmin();
    setFirebaseUser(null);
    setIsAdminLoggedIn(false);
  };

  const generateWhatsAppOrderUrl = (product: Product, customNote?: string) => {
    const text = `Hello Mudis Merit Venture,\n\nI am interested in ordering:\n*Product:* ${product.name}\n*Price:* ₦${product.price.toLocaleString()}\n${product.dimensions ? `*Dimensions:* ${product.dimensions}\n` : ''}${customNote ? `*Custom Specification:* ${customNote}\n` : ''}\nPlease let me know availability and delivery options within Ibadan or nearby locations. Thank you!`;
    return `https://wa.me/2348034305578?text=${encodeURIComponent(text)}`;
  };

  const generateWhatsAppInquiryUrl = (topic: string, details: string) => {
    const text = `Hello Mudis Merit Venture,\n\nI have an enquiry regarding *${topic}*:\n${details}\n\nPlease advise on pricing, timeline, or visiting your workshop at Ojoo, Ibadan. Thank you!`;
    return `https://wa.me/2348034305578?text=${encodeURIComponent(text)}`;
  };

  const resetAllDataToDefaults = async () => {
    setProducts(INITIAL_PRODUCTS);
    setServices(INITIAL_SERVICES);
    setGallery(INITIAL_GALLERY);
    setInquiries(INITIAL_INQUIRIES);
    localStorage.removeItem('mm_products');
    localStorage.removeItem('mm_services');
    localStorage.removeItem('mm_gallery');
    localStorage.removeItem('mm_inquiries');

    // Also re-seed to Firestore
    try {
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), {
          ...prod,
          createdAt: new Date().toISOString(),
        });
      }
      for (const srv of INITIAL_SERVICES) {
        await setDoc(doc(db, 'services', srv.id), srv);
      }
    } catch (err) {
      console.warn('Reset seed note:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView: changeView,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        searchQuery,
        setSearchQuery,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        services,
        addService,
        updateService,
        deleteService,
        gallery,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        inquiries,
        addInquiry,
        updateInquiryStatus,
        selectedProductForModal,
        setSelectedProductForModal,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        firebaseUser,
        loginWithGoogle,
        logoutAdmin,
        isFirebaseConnected,
        generateWhatsAppOrderUrl,
        generateWhatsAppInquiryUrl,
        resetAllDataToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
