export type PageView = 
  | 'home' 
  | 'mission' 
  | 'vision' 
  | 'products' 
  | 'calculator'
  | 'gallery' 
  | 'contact' 
  | 'admin';

export interface Product {
  id: string;
  name: string;
  category: 'foam' | 'furniture' | 'mattress' | 'office';
  subcategory: string;
  price: number; // in NGN
  image: string;
  description: string;
  dimensions?: string;
  densityOrMaterial?: string;
  warranty?: string;
  inStock: boolean;
  featured?: boolean;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: 'chair' | 'scissors' | 'penRuler' | 'wrench' | 'truck' | 'shieldCheck';
  features: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'sofas' | 'foam' | 'mattresses' | 'workshop' | 'installations';
  imageUrl: string;
  caption: string;
  dimensions?: string;
  mediaType?: 'photo' | 'video';
  videoUrl?: string;
  createdAt?: string;
}

export interface CustomerInquiry {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  serviceType: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'completed';
}

export interface CustomFoamCalculation {
  lengthInches: number;
  widthInches: number;
  thicknessInches: number;
  densityGrade: 'medium' | 'high-density' | 'super-high-density' | 'orthopaedic-bonded';
  quantity: number;
  useCase: string;
  estimatedPriceNaira: number;
}
