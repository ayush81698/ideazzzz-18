
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  stock?: number;
  imageurl: string;
  discount?: string;
  featured?: boolean;
  model_url?: string;
}
