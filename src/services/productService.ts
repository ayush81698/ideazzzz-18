
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageurl: string; 
  category?: string;
  stock?: number;
  discount?: string;
  featured?: boolean;
  created_at?: string;
  model_url?: string | null;
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
    console.log("Adding product to Supabase:", product);
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        description: product.description,
        price: product.price,
        imageurl: product.imageurl,
        category: product.category || null,
        stock: product.stock || null,
        discount: product.discount || null,
        featured: product.featured || false,
        model_url: product.model_url || null
      }])
      .select();
      
    if (error) {
      console.error('Error adding product:', error);
      throw error;
    }
    
    console.log("Supabase response after adding:", data);
    return data?.[0] || null;
  } catch (error) {
    console.error('Error in addProduct service:', error);
    return null;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
  try {
    console.log("Updating product with ID:", id);
    console.log("Update data:", product);
    
    const { data, error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        price: product.price,
        imageurl: product.imageurl,
        category: product.category,
        stock: product.stock,
        discount: product.discount,
        featured: product.featured,
        model_url: product.model_url
      })
      .eq('id', id)
      .select();
      
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
    
    console.log("Supabase response after update:", data);
    return data?.[0] || null;
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
