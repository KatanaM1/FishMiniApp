import { Button, Text, Card, Badge } from '@telegram-apps/telegram-ui';
import type { Product } from '../../types';

interface AdminProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export const AdminProductList = ({ 
  products, 
  onEdit, 
  onDelete 
}: AdminProductListProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {products.length === 0 ? (
        <Text style={{ textAlign: 'center', color: 'var(--tg-theme-hint-color)' }}>
          Товаров пока нет
        </Text>
      ) : (
        products.map(product => (
          <Card key={product.id} style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Text weight="2">{product.name}</Text>
                  <Badge 
                    type="number"   // ✅ добавлено
                    mode={product.is_active ? 'primary' : 'critical'}
                    style={{ fontSize: '11px' }}
                  >
                    {product.is_active ? 'Активен' : 'Неактивен'}
                  </Badge>
                </div>
                <Text style={{ 
                  fontSize: '14px', 
                  color: 'var(--tg-theme-hint-color)' 
                }}>
                  {product.price} ₽ • В наличии: {product.stock}
                </Text>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button 
                  size="m" 
                  mode="outline"
                  onClick={() => onEdit(product)}
                >
                  ✏️
                </Button>
                <Button 
                  size="m" 
                  mode="outline"
                  style={{ color: 'var(--tg-theme-destructive-text-color)' }}
                  onClick={() => onDelete(product.id)}
                >
                  🗑️
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};