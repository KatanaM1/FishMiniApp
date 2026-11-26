// frontend/src/components/admin/AdminProductForm.tsx
import { useState, useRef, useMemo, useEffect } from 'react';
import { Text, Input, Button, Select } from '@telegram-apps/telegram-ui';
import { uploadToImgBB } from '../../utils/uploadImage';
import { CATEGORIES } from '../../constants/categories';
import { AUTO_CATEGORIES } from '../../constants/autoCategories';
import type { Product, Store } from '../../types';

interface AdminProductFormProps {
  product?: Product | null;
  stores: Store[];
  onSubmit: (data: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

// Определяем тип магазина по полю `type` или по названию
const getStoreType = (store?: { name?: string; type?: string } | null): 'fishing' | 'auto' => {
  if (!store) return 'fishing';
  const src = (store.type || store.name || '').toLowerCase();
  if (src.includes('auto') || src.includes('авто') || src.includes('запчаст')) {
    return 'auto';
  }
  return 'fishing';
};

export const AdminProductForm = ({ product, stores, onSubmit, onCancel }: AdminProductFormProps) => {
  // Основные поля
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [storeId, setStoreId] = useState<number>(product?.store_id || stores[0]?.id || 0);
  const [stock, setStock] = useState(product?.stock?.toString() || '0');
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [category, setCategory] = useState(product?.category || '');

  // Изображения
  const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ⬇ Категории зависят от магазина, выбранного в форме
  const selectedStore = useMemo(
    () => stores.find((s) => s.id === storeId) || null,
    [stores, storeId]
  );

const categories = useMemo<readonly string[]>(
  () => (getStoreType(selectedStore) === 'auto' ? AUTO_CATEGORIES : CATEGORIES),
  [selectedStore]
);

  // Если магазин сменили, а текущая категория в новый список не входит —
  // сбрасываем её (чтобы не сохранить «Леска» для автозапчастей)
  useEffect(() => {
    if (category && !categories.includes(category)) {
      setCategory('');
    }
  }, [categories]); // eslint-disable-line react-hooks/exhaustive-deps

  // Обработчики для изображений
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImageFiles(prev => [...prev, ...files]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeNewFile = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url: string) => {
    setExistingImages(prev => prev.filter(img => img !== url));
  };

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];
      for (const file of newImageFiles) {
        const url = await uploadToImgBB(file);
        uploadedUrls.push(url);
      }

      const allImages = [...existingImages, ...uploadedUrls];

  const productData: Omit<Product, 'id'> = {
  name,
  price: parseFloat(price) || 0,
  store_id: storeId,
  stock: parseInt(stock) || 0,
  is_active: isActive,
};
      if (description) productData.description = description;
if (allImages.length > 0) productData.images = allImages;
if (category) productData.category = category;

      await onSubmit(productData);
      onCancel();
    } catch (error) {
      console.error('Ошибка загрузки изображений:', error);
      alert('Не удалось загрузить изображения. Проверьте API-ключ ImgBB.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Название */}
      <div style={{ marginBottom: 12 }}>
        <Text>Название *</Text>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите название"
          required
        />
      </div>

      {/* Цена */}
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

      {/* Описание */}
      <div style={{ marginBottom: 12 }}>
        <Text>Описание</Text>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Описание товара"
        />
      </div>

      {/* Магазин — ВАЖНО: переносим ВЫШЕ категории,
          чтобы категории пересчитывались от выбора магазина */}
      <div style={{ marginBottom: 12 }}>
        <Text>Магазин</Text>
        <Select
          value={storeId}
          onChange={(e) => setStoreId(Number(e.target.value))}
          style={{ width: '100%' }}
        >
          {stores.map(store => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Категория — список берётся из categories (зависит от магазина) */}
      <div style={{ marginBottom: 12 }}>
        <Text>Категория</Text>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: '100%' }}
        >
          <option value="">Без категории</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </div>

      {/* Изображения */}
      <div style={{ marginBottom: 12 }}>
        <Text>Изображения</Text>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ marginBottom: '8px' }}
        />

        {existingImages.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            {existingImages.map((url, idx) => (
              <div key={idx} style={{ position: 'relative', width: 80, height: 80 }}>
                <img
                  src={url}
                  alt={`product-${idx}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {newImageFiles.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {newImageFiles.map((file, idx) => (
              <div key={idx} style={{ position: 'relative', width: 80, height: 80 }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`new-${idx}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                />
                <button
                  type="button"
                  onClick={() => removeNewFile(idx)}
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Количество на складе */}
      <div style={{ marginBottom: 12 }}>
        <Text>Количество на складе</Text>
        <Input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="0"
        />
      </div>

      {/* Активен */}
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

      {/* Кнопки */}
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="submit" mode="filled" disabled={uploading}>
          {uploading ? 'Загрузка...' : (product ? 'Сохранить' : 'Добавить')}
        </Button>
        <Button type="button" mode="outline" onClick={onCancel} disabled={uploading}>
          Отмена
        </Button>
      </div>
    </form>
  );
};