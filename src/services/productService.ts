
import { supabase } from "@/integrations/supabase/client";
import { CreateProductParams, Product, UpdateProductParams } from "@/types/products";

// Re-export the Product type so it can be imported from this module
export type { Product } from "@/types/products";

// Define the database response type to include the usdz_url field
interface ProductDatabaseResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  imageurl: string | null;
  model_url: string | null;
  usdz_url: string | null;
  created_at: string;
  category: string | null;
  discount: string | null;
  featured: boolean | null;
  stock: number | null;
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  // Map database schema to our Product interface
  return (data as ProductDatabaseResponse[] || []).map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    images: item.imageurl ? [item.imageurl] : [],  // Convert imageurl to images array
    imageurl: item.imageurl, // Include the original imageurl field for backward compatibility
    model_url: item.model_url,
    usdz_url: item.usdz_url,  // Access the usdz_url field directly
    created_at: item.created_at,
    category: item.category,
    discount: item.discount,
    featured: item.featured,
    stock: item.stock
  }));
}

// Export the fetchProducts function that Shop and ProductPage need
export async function fetchProducts(): Promise<Product[]> {
  return getAllProducts();
}

export async function createProduct(params: CreateProductParams): Promise<Product> {
  // Convert our API format to database schema
  const dbProduct = {
    name: params.name,
    description: params.description,
    price: params.price,
    imageurl: params.images && params.images.length > 0 ? params.images[0] : null,
    model_url: params.model_url,
    usdz_url: params.usdz_url,  // Include the usdz_url field
    category: params.category,
    discount: params.discount,
    featured: params.featured,
    stock: params.stock
  };

  const { data, error } = await supabase
    .from("products")
    .insert([dbProduct])
    .select()
    .single();

  if (error) throw error;
  
  // Convert back to our Product interface
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    images: data.imageurl ? [data.imageurl] : [],
    imageurl: data.imageurl, // Include for backward compatibility
    model_url: data.model_url,
    usdz_url: (data as ProductDatabaseResponse).usdz_url,  // Cast to ProductDatabaseResponse to access usdz_url
    created_at: data.created_at,
    category: data.category,
    discount: data.discount,
    featured: data.featured,
    stock: data.stock
  };
}

export async function updateProduct(params: UpdateProductParams): Promise<Product> {
  const { id, ...updateData } = params;
  
  // Convert our API format to database schema
  const dbUpdateData: any = { ...updateData };
  
  // Handle the conversion from images array to imageurl
  if (updateData.images) {
    dbUpdateData.imageurl = updateData.images.length > 0 ? updateData.images[0] : null;
    delete dbUpdateData.images;
  }

  const { data, error } = await supabase
    .from("products")
    .update(dbUpdateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  
  // Convert back to our Product interface
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    images: data.imageurl ? [data.imageurl] : [],
    imageurl: data.imageurl, // Include for backward compatibility
    model_url: data.model_url,
    usdz_url: (data as ProductDatabaseResponse).usdz_url,  // Cast to ProductDatabaseResponse to access usdz_url
    created_at: data.created_at,
    category: data.category,
    discount: data.discount,
    featured: data.featured,
    stock: data.stock
  };
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
