
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageurl: string; // Changed from imageUrl to imageurl to match DB column
  category?: string;
  stock?: number;
  discount?: string;
  featured?: boolean;
  created_at?: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchProducts service:', error);
    return [];
  }
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
      
    if (error) {
      console.error('Error adding product:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in addProduct service:', error);
    return null;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateProduct service:', error);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteProduct service:', error);
    return false;
  }
};

// Add a function to fetch a single product by ID
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchProductById service:', error);
    return null;
  }
};
