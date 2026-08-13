// frontend/src/components/products/ProductCard.tsx
import React from 'react';
import { Card, Text, Button } from '@telegram-apps/telegram-ui';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const image = product.images?.[0] || '📦';

  return (
    <Card>
      <div style={{ padding: '12px' }}>
        <div style={{ fontSize: '48px', textAlign: 'center' }}>{image}</div>
        <Text weight="2">{product.name}</Text>
        <Text style={{ color: 'var(--tg-theme-hint-color)' }}>{product.description}</Text>
        <Text weight="3" style={{ fontSize: '18px', marginTop: '8px' }}>
          {product.price} ₽
        </Text>
        <Button
          size="m"
          stretched
          style={{ marginTop: '12px' }}
          onClick={onAddToCart}
          disabled={product.stock === 0} 
        >
          {product.stock > 0 ? '➕ В корзину' : '❌ Нет в наличии'}
        </Button>
      </div>
    </Card>
  );
};