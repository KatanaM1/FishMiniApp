// frontend/src/components/admin/AdminLayout.tsx
import type { ReactNode } from 'react';
import { Text } from '@telegram-apps/telegram-ui';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  return (
    <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <Text weight="3" style={{ fontSize: '24px' }}>
          🛠️ {title}
        </Text>
      </div>
      {children}
    </div>
  );
};