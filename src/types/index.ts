export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  material: 'pla' | 'resina';
  category: string;
  specifications: Record<string, any>;
  stock: number;
  featured: boolean;
  customizable: boolean;
  image_url: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  customization?: Record<string, any>;
}
