// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { StoreProvider } from './contexts/StoreContext';
import { CartProvider } from './contexts/CartContext';
import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/admin/AdminPage';
import { StoreSelector } from './components/common/StoreSelector';
import '@telegram-apps/telegram-ui/dist/styles.css';
import './App.css';

function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <AppRoot>
          <BrowserRouter>
            <div className="app">
              <StoreSelector />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </div>
          </BrowserRouter>
        </AppRoot>
      </CartProvider>
    </StoreProvider>
  );
}

export default App;