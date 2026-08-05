// frontend/src/components/common/StoreSelector.tsx
import { Button, Text } from '@telegram-apps/telegram-ui';
import { useStore } from '../../contexts/StoreContext';
import { Link } from 'react-router-dom';
import './StoreSelector.css';

export const StoreSelector = () => {
  const { currentStore, setCurrentStore, stores } = useStore();

  return (
    <div className="store-selector">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text weight="2" style={{ marginBottom: '8px' }}>
          Выберите магазин:
        </Text>
        <Link to="/admin" style={{ textDecoration: 'none' }}>
          <Button size="s" mode="outline">
            ⚙️ Админка
          </Button>
        </Link>
      </div>
      <div className="store-buttons">
        {stores.map(store => (
          <Button
            key={store.id}
            mode={currentStore?.id === store.id ? 'filled' : 'outline'}
            onClick={() => setCurrentStore(store)}
            style={{ flex: 1 }}
          >
            {store.name}
          </Button>
        ))}
      </div>
    </div>
  );
};