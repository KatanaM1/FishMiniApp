// frontend/src/types.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
  store_id: number;
  stock: number;
  is_active: boolean;
  category?: string;          // ← добавить
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  userId: number;              // или string, если используется Firebase Auth
  userName?: string;
  userUsername?: string;
  items: OrderItem[];
  total: number;
  address: string;
  comment?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  product: Product;            // или можно хранить только id + название + цену, но для простоты оставим Product
  quantity: number;
}

export interface Store {
  id: number;
  name: string;
  slug?: string;
  description: string;
  is_active: boolean;
  // другие поля, если нужны
}

export interface CartItem extends Product {
  quantity: number;
}

// Если нужно, можно экспортировать тип для создания товара без id
export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type OrderInput = Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>;