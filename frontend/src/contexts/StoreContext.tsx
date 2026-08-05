// frontend/src/contexts/StoreContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Store } from '../types';

interface StoreContextType {
  currentStore: Store | null;
  setCurrentStore: (store: Store) => void;
  stores: Store[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  
  const stores: Store[] = [
    { 
      id: 1, 
      name: '🎣 Рыболовный магазин', 
      slug: 'fishing',
      description: 'Всё для рыбалки',
      is_active: true 
    },
    { 
      id: 2, 
      name: '🚗 Автозапчасти', 
      slug: 'autoparts',
      description: 'Запчасти для авто',
      is_active: true 
    }
  ];

  return (
    <StoreContext.Provider value={{ currentStore, setCurrentStore, stores }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};