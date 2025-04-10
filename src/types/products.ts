
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  model_url?: string;
  usdz_url?: string;
  created_at: string;
}

export interface CreateProductParams {
  name: string;
  description: string;
  price: number;
  images: string[];
  model_url?: string;
  usdz_url?: string;
}

export interface UpdateProductParams {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  images?: string[];
  model_url?: string;
  usdz_url?: string;
}
