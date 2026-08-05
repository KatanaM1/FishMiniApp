// frontend/src/components/admin/AdminProductForm.tsx
import { useState } from 'react';
import { Text, Input, Button, Select } from '@telegram-apps/telegram-ui';
import type { Product, Store } from '../../types';

interface AdminProductFormProps {
  product?: Product | null;           // может быть undefined для нового товара
  stores: Store[];
  onSubmit: (data: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

export const AdminProductForm = ({ product, stores, onSubmit, onCancel }: AdminProductFormProps) => {
  // Устанавливаем начальные значения с защитой от undefined
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [images, setImages] = useState(product?.images?.join(', ') || ''); // массив → строка через запятую
  const [storeId, setStoreId] = useState(product?.store_id || stores[0]?.id || 0);
  const [stock, setStock] = useState(product?.stock?.toString() || '0');
  const [isActive, setIsActive] = useState(product?.is_active ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Преобразуем строку images обратно в массив (удаляем пробелы, разделяем по запятой)
    const imagesArray = images.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    const productData: Omit<Product, 'id'> = {
      name,
      price: parseFloat(price) || 0,
      description: description || undefined, // если пусто, то undefined
      images: imagesArray.length > 0 ? imagesArray : undefined,
      store_id: storeId,
      stock: parseInt(stock) || 0,
      is_active: isActive,
    };
    
    onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 12 }}>
        <Text>Название *</Text>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите название"
          required
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <Text>Цена *</Text>
        <Input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Введите цену"
          required
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <Text>Описание</Text>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Описание товара"
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <Text>Изображения (эмодзи через запятую)</Text>
        <Input
          value={images}
          onChange={(e) => setImages(e.target.value)}
          placeholder="🍎, 📦, ⭐"
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <Text>Магазин</Text>
        <Select
          value={storeId}
          onChange={(e) => setStoreId(Number(e.target.value))}
        >
          {stores.map(store => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </Select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Text>Количество на складе</Text>
        <Input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="0"
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Активен
        </label>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="submit" mode="filled">
          {product ? 'Сохранить' : 'Добавить'}
        </Button>
        <Button type="button" mode="outline" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
};