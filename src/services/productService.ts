
import { supabase } from "@/integrations/supabase/client";
import { CreateProductParams, Product, UpdateProductParams } from "@/types/products";

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createProduct(params: CreateProductParams): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert([params])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(params: UpdateProductParams): Promise<Product> {
  const { id, ...updateData } = params;
  const { data, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
