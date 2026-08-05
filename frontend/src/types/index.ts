// frontend/src/types.ts

export interface Product {
  id: string;          // Firebase генерирует строковый id
  name: string;
  price: number;
  description?: string;
  images?: string[];   // массив эмодзи или URL картинок
  store_id: number;    // идентификатор магазина
  stock: number;       // количество на складе
  is_active: boolean;  // активен ли товар
  category?: string;
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
  // другие поля, если нужны
}

// Если нужно, можно экспортировать тип для создания товара без id
export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type OrderInput = Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>;