// frontend/src/components/admin/AdminProductForm.tsx
import { useState, useRef } from 'react';
import { Text, Input, Button, Select } from '@telegram-apps/telegram-ui';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase';
import type { Product, Store } from '../../types';

interface AdminProductFormProps {
  product?: Product | null;
  stores: Store[];
  onSubmit: (data: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

export const AdminProductForm = ({ product, stores, onSubmit, onCancel }: AdminProductFormProps) => {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [storeId, setStoreId] = useState(product?.store_id || stores[0]?.id || 0);
  const [stock, setStock] = useState(product?.stock?.toString() || '0');
  const [isActive, setIsActive] = useState(product?.is_active ?? true);

  // Состояние для изображений
  const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Добавление файлов
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImageFiles(prev => [...prev, ...files]);
    }
    // Очищаем input, чтобы можно было выбрать те же файлы повторно
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Удаление нового файла (ещё не загружен)
  const removeNewFile = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Удаление существующего изображения (из Firestore)
  const removeExistingImage = async (url: string) => {
    try {
      // Удаляем файл из Storage (опционально)
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
    } catch (error) {
      console.warn('Не удалось удалить файл из Storage, возможно, ссылка не ведёт на Storage:', error);
    }
    setExistingImages(prev => prev.filter(img => img !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Загружаем новые файлы в Storage
      const uploadedUrls: string[] = [];
      for (const file of newImageFiles) {
        const fileRef = ref(storage, `products/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        uploadedUrls.push(url);
      }

      // Объединяем существующие и новые URL
      const allImages = [...existingImages, ...uploadedUrls];

      const productData: Omit<Product, 'id'> = {
        name,
        price: parseFloat(price) || 0,
        description: description || undefined,
        images: allImages.length > 0 ? allImages : undefined,
        store_id: storeId,
        stock: parseInt(stock) || 0,
        is_active: isActive,
      };

      await onSubmit(productData);
      onCancel(); // закрываем форму после успешного сохранения
    } catch (error) {
      console.error('Ошибка загрузки изображений:', error);
      alert('Не удалось загрузить изображения. Проверьте настройки Storage.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Поля формы (без изменений) */}
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

      {/* Блок изображений */}
      <div style={{ marginBottom: 12 }}>
        <Text>Изображения</Text>

        {/* Кнопка выбора файлов */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ marginBottom: '8px' }}
        />

        {/* Превью существующих изображений */}
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

        {/* Превью новых файлов (ещё не загружены) */}
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

      {/* Остальные поля: магазин, склад, активность */}
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