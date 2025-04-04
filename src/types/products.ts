
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageurl: string;
  discount?: string;
  category?: string;
  featured?: boolean;
  stock?: number;
  created_at?: string;
  model_url?: string | null;
}
