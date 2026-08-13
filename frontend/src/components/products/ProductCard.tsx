// frontend/src/components/products/ProductCard.tsx
import React from 'react';
import { Card, Text, Button } from '@telegram-apps/telegram-ui';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Проверяем, есть ли изображения и является ли первое URL
  const image = product.images?.[0] || '';
  const isImageUrl = image.startsWith('http://') || image.startsWith('https://');

  return (
    <Card>
      <div style={{ padding: '12px' }}>
        {/* Если это URL — показываем <img>, иначе эмодзи */}
        {isImageUrl ? (
          <img
            src={image}
            alt={product.name}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '8px',
            }}
          />
        ) : (
          <div style={{ fontSize: '48px', textAlign: 'center' }}>
            {image || '📦'}
          </div>
        )}

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