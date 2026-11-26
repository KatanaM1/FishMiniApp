// frontend/src/pages/HomePage.tsx
import { useState, useEffect, useMemo } from 'react';
import { Text, Button } from '@telegram-apps/telegram-ui';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { ProductCard } from '../components/products/ProductCard';
import { useStore } from '../contexts/StoreContext';
import { db } from '../firebase';
import { CATEGORIES } from '../constants/categories';
import { AUTO_CATEGORIES } from '../constants/autoCategories';
import type { Product } from '../types';

type StoreType = 'fishing' | 'auto';

type StoreLike = { name?: string; type?: string } | null | undefined;

// Определяем тип магазина.
// Приоритет: если есть поле `type` — используем его,
// иначе — эвристика по названию магазина.
const getStoreType = (store?: StoreLike): StoreType => {
  if (!store) return 'fishing';
  const src = (store.type || store.name || '').toLowerCase();
  if (
    src.includes('auto') ||
    src.includes('авто') ||
    src.includes('запчаст')
  ) {
    return 'auto';
  }
  return 'fishing';
};

// Возвращает нужный набор категорий для магазина
const getCategoriesForStore = (store?: StoreLike): readonly string[] => {
  return getStoreType(store) === 'auto' ? AUTO_CATEGORIES : CATEGORIES;
};

export const HomePage = () => {
  const { stores, currentStore, setCurrentStore } = useStore();
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // '' = все

  // Если магазины загрузились, а текущий не выбран — выбираем первый
  useEffect(() => {
    if (stores.length > 0 && !currentStore) {
      setCurrentStore(stores[0]);
    }
  }, [stores, currentStore, setCurrentStore]);

  // Синхронизация ID магазина
  useEffect(() => {
    if (currentStore) {
      setSelectedStoreId(currentStore.id);
    }
  }, [currentStore]);

  // Сбрасываем выбранную категорию при переключении магазина,
  // т.к. набор категорий другой
  useEffect(() => {
    setSelectedCategory('');
  }, [currentStore?.id]);

  // Активный набор категорий для текущего магазина
  const categories = useMemo(
    () => getCategoriesForStore(currentStore),
    [currentStore]
  );

  // Запрос к Firestore
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('store_id', '==', selectedStoreId));
  const [snapshot, loading, error] = useCollection(q);

  const allProducts: Product[] =
    (snapshot?.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]) || [];

  // Фильтрация по категории
  const filteredProducts = selectedCategory
    ? allProducts.filter((p) => p.category === selectedCategory)
    : allProducts;

  if (stores.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Text>Нет доступных магазинов</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      {/* Меню категорий */}
      <div style={{ marginBottom: '16px' }}>
        {/* Первая строка: "Все" */}
        <div style={{ marginBottom: '8px' }}>
          <Button
            size="s"
            mode={selectedCategory === '' ? 'filled' : 'outline'}
            onClick={() => setSelectedCategory('')}
            style={{
              whiteSpace: 'nowrap',
              padding: '0 12px',
              minWidth: 'auto',
            }}
          >
            Все
          </Button>
        </div>

        {/* Категории: переносятся на новую строку, если не влезают */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {categories.map((cat) => (
            <Button
              key={cat}
              size="s"
              mode={selectedCategory === cat ? 'filled' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
              style={{
                whiteSpace: 'nowrap',
                padding: '0 12px',
                minWidth: 'auto',
              }}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {loading && <Text>Загрузка товаров...</Text>}
      {error && <Text style={{ color: 'red' }}>Ошибка: {error.message}</Text>}

      {!loading && !error && (
        filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text>Нет товаров в этой категории</Text>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )
      )}
    </div>
  );
};