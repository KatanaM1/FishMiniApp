// frontend/src/api/client.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API для товаров
export const productsApi = {
  // Получить все товары
  getAll: () => api.get('/api/products'),
  
  // Получить товары по магазину
  getByStore: (storeId: number) => api.get(`/api/products/store/${storeId}`),
  
  // Получить товар по ID
  getById: (id: number) => api.get(`/api/products/${id}`),
  
  // Создать товар
  create: (data: any) => api.post('/api/products', data),
  
  // Обновить товар
  update: (id: number, data: any) => api.put(`/api/products/${id}`, data),
  
  // Удалить товар
  delete: (id: number) => api.delete(`/api/products/${id}`),
};