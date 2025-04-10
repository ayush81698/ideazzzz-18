
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  model_url?: string;
  usdz_url?: string;
  created_at: string;
  // Additional fields used in the Shop component
  category?: string;
  discount?: string;
  featured?: boolean;
  stock?: number;
  imageurl?: string; // Keep this for backward compatibility
}

export interface CreateProductParams {
  name: string;
  description: string;
  price: number;
  images: string[];
  model_url?: string;
  usdz_url?: string;
  category?: string;
  discount?: string;
  featured?: boolean;
  stock?: number;
}

export interface UpdateProductParams {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  images?: string[];
  model_url?: string;
  usdz_url?: string;
  category?: string;
  discount?: string;
  featured?: boolean;
  stock?: number;
}
