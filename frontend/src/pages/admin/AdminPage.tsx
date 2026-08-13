// frontend/src/pages/admin/AdminPage.tsx
import { useState, useEffect } from 'react';
import { Button, Text } from '@telegram-apps/telegram-ui';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminProductForm } from '../../components/admin/AdminProductForm';
import { AdminProductList } from '../../components/admin/AdminProductList';
import { AdminLogin } from '../../components/admin/AdminLogin';
import { useStore } from '../../contexts/StoreContext';
import { api } from '../../api/api';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import type { Product } from '../../types';

export const AdminPage = () => {
  const { stores, currentStore, setCurrentStore } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // для ожидания проверки авторизации

  // Слушаем изменения состояния авторизации
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Автовыбор магазина
  useEffect(() => {
    if (stores.length > 0 && !currentStore) {
      setCurrentStore(stores[0]);
    }
  }, [stores, currentStore, setCurrentStore]);

  // Загрузка товаров при смене магазина
  useEffect(() => {
    if (currentStore && user) {
      loadProducts();
    }
  }, [currentStore, user]);

  const loadProducts = async () => {
    if (!currentStore) return;
    try {
      const data = await api.getProducts();
      const filtered = data.filter((p: Product) => p.store_id === currentStore.id);
      setProducts(filtered);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <Text>Проверка авторизации...</Text>
      </div>
    );
  }

  // Если пользователь не авторизован — показываем форму входа
  if (!user) {
    return <AdminLogin />;
  }

  // --- Обработчики (добавление/редактирование/удаление) остаются без изменений ---
  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const newProduct = await api.addProduct({
        ...productData,
        store_id: currentStore!.id,
      });
      setProducts([...products, newProduct]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Ошибка добавления товара:', error);
    }
  };

  const handleUpdateProduct = async (productData: Omit<Product, 'id'>) => {
    if (!editingProduct) return;
    try {
      const updated = await api.updateProduct(editingProduct.id, productData);
      setProducts(products.map(p => p.id === updated.id ? updated : p));
      setEditingProduct(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Ошибка обновления товара:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Удалить товар?')) return;
    try {
      await api.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Ошибка удаления товара:', error);
    }
  };

  // --- Рендер админки ---
  return (
    <AdminLayout title={currentStore?.name || 'Админка'}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <Button size="s" mode="outline" onClick={handleLogout}>
          🚪 Выйти
        </Button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <Text style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)' }}>
          Выберите магазин для управления:
        </Text>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
          {stores.map(store => (
            <Button
              key={store.id}
              size="s"
              mode={currentStore?.id === store.id ? 'filled' : 'outline'}
              onClick={() => setCurrentStore(store)}
            >
              {store.name}
            </Button>
          ))}
        </div>
      </div>

      {!isFormOpen && (
        <Button stretched style={{ marginBottom: '16px' }} onClick={() => setIsFormOpen(true)}>
          + Добавить товар
        </Button>
      )}

      {isFormOpen && (
        <div style={{
          marginBottom: '16px',
          padding: '16px',
          background: 'var(--tg-theme-secondary-bg-color)',
          borderRadius: '12px'
        }}>
          <Text weight="2" style={{ marginBottom: '12px' }}>
            {editingProduct ? 'Редактировать товар' : 'Новый товар'}
          </Text>
          <AdminProductForm
            product={editingProduct}
            stores={stores}
            onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingProduct(null);
            }}
          />
        </div>
      )}

      <AdminProductList
        products={products}
        onEdit={(product) => {
          setEditingProduct(product);
          setIsFormOpen(true);
        }}
        onDelete={handleDeleteProduct}
      />

      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: 'var(--tg-theme-secondary-bg-color)',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-around'
      }}>
        <div>
          <Text style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)' }}>
            Всего товаров
          </Text>
          <Text weight="3" style={{ fontSize: '20px' }}>
            {products.length}
          </Text>
        </div>
        <div>
          <Text style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)' }}>
            Активных
          </Text>
          <Text weight="3" style={{ fontSize: '20px' }}>
            {products.filter(p => p.is_active).length}
          </Text>
        </div>
        <div>
          <Text style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)' }}>
            Нет в наличии
          </Text>
          <Text weight="3" style={{ fontSize: '20px' }}>
            {products.filter(p => p.stock === 0).length}
          </Text>
        </div>
      </div>
    </AdminLayout>
  );
};