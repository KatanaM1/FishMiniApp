// frontend/src/components/products/ProductCard.tsx
import React from 'react';
import { Card, Text, Button } from '@telegram-apps/telegram-ui';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const image = product.images?.[0] || '';
  const isImageUrl = image.startsWith('http://') || image.startsWith('https://');

  return (
    <Card>
      <div
        style={{
          minHeight: '50vh',
          width: '80vw',
          maxWidth: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2vh 3vw',
          boxSizing: 'border-box',
          margin: '0 auto',
        }}
      >
        {/* Изображение */}
        <div>
          {isImageUrl ? (
            <img
              src={image}
              alt={product.name}
              style={{
                width: '100%',
                height: '25vh',
                objectFit: 'contain',
                objectPosition: 'center',
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                borderRadius: '2vh',
                marginBottom: '1.5vh',
              }}
            />
          ) : (
            <div
              style={{
                fontSize: '8vh',
                textAlign: 'center',
                height: '25vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--tg-theme-secondary-bg-color)',
                borderRadius: '2vh',
                marginBottom: '1.5vh',
              }}
            >
              {image || '📦'}
            </div>
          )}

          <Text
            weight="2"
            style={{
              fontSize: '2.5vh',
              marginBottom: '1vh',
              wordBreak: 'break-word',
              lineHeight: 1.2,
            }}
          >
            {product.name}
          </Text>

          <Text
            style={{
              color: 'var(--tg-theme-hint-color)',
              fontSize: '2vh',
              wordBreak: 'break-word',
              lineHeight: 1.4,
              marginBottom: '1vh',
            }}
          >
            {product.description}
          </Text>
        </div>

        <div>
          <div
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color)',
              padding: '1.5vh 2vw',
              borderRadius: '1.5vh',
              marginBottom: '2vh',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: '2vh', color: 'var(--tg-theme-hint-color)' }}>
              Цена:
            </Text>
            <Text
              weight="3"
              style={{
                fontSize: '3.5vh',
                color: 'var(--tg-theme-button-color)',
                fontWeight: 'bold',
              }}
            >
              {product.price} ₽
            </Text>
          </div>

          <Button
            size="m"
            stretched
            onClick={onAddToCart}
            disabled={product.stock === 0}
            style={{
              fontSize: '2.2vh',
              padding: '1.5vh 0',
            }}
          >
            {product.stock > 0 ? '➕ В корзину' : '❌ Нет в наличии'}
          </Button>
        </div>
      </div>
    </Card>
  );
};