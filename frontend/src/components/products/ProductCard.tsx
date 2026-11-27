// frontend/src/components/products/ProductCard.tsx
import React, { useState } from 'react';
import { Card, Text } from '@telegram-apps/telegram-ui';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const image = product.images?.[0] || '';
  const isImageUrl = image.startsWith('http://') || image.startsWith('https://');
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      style={{
        backgroundColor: '#1e1e1e',
        borderRadius: '2vh',
        border: '1px solid #3a3a3a',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          // если картинки нет — не резервируем 50vh, иначе будет пустота
          minHeight: isImageUrl ? '50vh' : 'auto',
          width: '92vw',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          padding: '2.5vh 4vw',
          boxSizing: 'border-box',
          margin: '0 auto',
          backgroundColor: 'transparent',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Блок изображения рендерим ТОЛЬКО если есть настоящий URL */}
        {isImageUrl && (
          <div
            style={{
              position: isHovered ? 'absolute' : 'relative',
              top: isHovered ? 0 : 'auto',
              left: isHovered ? 0 : 'auto',
              width: '100%',
              height: isHovered ? '100%' : '25vh',
              zIndex: isHovered ? 10 : 1,
              backgroundColor: '#2a2a2a',
              borderRadius: '1.5vh',
              overflow: 'hidden',
              transition: 'none',
              marginBottom: isHovered ? 0 : '1.5vh',
            }}
          >
            <img
              src={image}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transform: isHovered ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          </div>
        )}

        {/* Текст и цена */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            opacity: isHovered && isImageUrl ? 0 : 1,
            transition: 'opacity 0.2s ease',
            pointerEvents: isHovered && isImageUrl ? 'none' : 'auto',
          }}
        >
          <div style={{ marginBottom: '0.8vh' }}>
            <Text
              weight="2"
              style={{
                fontSize: '2.8vh',
                fontWeight: 'bold',
                color: '#ffffff',
                wordBreak: 'break-word',
                lineHeight: 1.3,
              }}
            >
              {product.name}
            </Text>
          </div>

          <div style={{ flex: 1, marginBottom: '1.5vh' }}>
            <Text
              style={{
                fontSize: '2vh',
                color: '#b0b0b0',
                wordBreak: 'break-word',
                lineHeight: 1.4,
              }}
            >
              {product.description}
            </Text>
          </div>

          <div
            style={{
              backgroundColor: '#3390ec',
              borderRadius: '1.5vh',
              padding: '1.5vh 2vw',
              textAlign: 'center',
              marginTop: 'auto',
            }}
          >
            <Text
              weight="3"
              style={{
                fontSize: '4vh',
                color: '#ffffff',
                fontWeight: 'bold',
              }}
            >
              {product.price} ₽
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
};