// frontend/src/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import { Text} from '@telegram-apps/telegram-ui';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { ProductCard } from '../components/products/ProductCard';
import { useStore } from '../contexts/StoreContext';
import { db } from '../firebase';
import type { Product } from '../types';

export const HomePage = () => {
  const { stores, currentStore, setCurrentStore } = useStore();
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  // Автоматически выбираем первый магазин при загрузке
  useEffect(() => {
    if (stores.length > 0 && !currentStore) {
      setCurrentStore(stores[0]);
    }
  }, [stores, currentStore, setCurrentStore]);

  // Синхронизируем локальный стейт с выбранным магазином из контекста
  useEffect(() => {
    if (currentStore) {
      setSelectedStoreId(currentStore.id);
    }
  }, [currentStore]);

  // Запрос к Firestore: получаем товары только для выбранного магазина
  const productsRef = collection(db, 'products');
  const q = selectedStoreId
    ? query(productsRef, where('store_id', '==', selectedStoreId))
    : query(productsRef); // если магазин не выбран – показываем все (или можно пустой массив)

  const [snapshot, loading, error] = useCollection(q);

  // Преобразуем данные из Firestore
  const products: Product[] = snapshot?.docs.map((doc) => ({
    id: doc.id, // Firebase генерирует строковый id
    ...doc.data(),
  })) as Product[] || [];

  const handleAddToCart = (product: Product) => {
    // TODO: реализовать добавление в корзину (через контекст или стейт)
    alert(`Добавлено в корзину: ${product.name}`);
  };

  // Если магазинов нет – показываем сообщение
  if (stores.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Text>Нет доступных магазинов</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>

      {/* Загрузка */}
      {loading && <Text>Загрузка товаров...</Text>}

      {/* Ошибка */}
      {error && <Text style={{ color: 'red' }}>Ошибка загрузки: {error.message}</Text>}

      {/* Список товаров */}
      {!loading && !error && (
        products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text>В этом магазине пока нет товаров</Text>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};