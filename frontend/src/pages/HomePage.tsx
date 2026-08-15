// frontend/src/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import { Text, Button } from '@telegram-apps/telegram-ui';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { ProductCard } from '../components/products/ProductCard';
import { useStore } from '../contexts/StoreContext';
import { db } from '../firebase';
import { CATEGORIES } from '../constants/categories';
import type { Product } from '../types';

export const HomePage = () => {
  const { stores, currentStore, setCurrentStore } = useStore();
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // '' = все

  useEffect(() => {
    if (stores.length > 0 && !currentStore) {
      setCurrentStore(stores[0]);
    }
  }, [stores, currentStore, setCurrentStore]);

  useEffect(() => {
    if (currentStore) {
      setSelectedStoreId(currentStore.id);
    }
  }, [currentStore]);

  // Запрос к Firestore
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('store_id', '==', selectedStoreId));
  const [snapshot, loading, error] = useCollection(q);

  const allProducts: Product[] = snapshot?.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[] || [];

  // Фильтрация по категории
  const filteredProducts = selectedCategory
    ? allProducts.filter(p => p.category === selectedCategory)
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

      {/* Меню категорий (как на Ozon) */}
<div
  style={{
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '12px',
    marginBottom: '16px',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    // скрыть скроллбар в Firefox
  }}
>
  <Button
    size="s"
    mode={selectedCategory === '' ? 'filled' : 'outline'}
    onClick={() => setSelectedCategory('')}
    style={{
      flexShrink: 0,
      whiteSpace: 'nowrap',
      minWidth: 'fit-content',
      padding: '0 12px',
    }}
  >
    Все
  </Button>
  {CATEGORIES.map((cat) => (
    <Button
      key={cat}
      size="s"
      mode={selectedCategory === cat ? 'filled' : 'outline'}
      onClick={() => setSelectedCategory(cat)}
      style={{
        flexShrink: 0,
        whiteSpace: 'nowrap',
        minWidth: '80px',
        padding: '0 12px',
      }}
    >
      {cat}
    </Button>
  ))}
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
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};