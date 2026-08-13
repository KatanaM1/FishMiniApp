// frontend/src/components/admin/AdminLogin.tsx
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { Button, Text } from '@telegram-apps/telegram-ui';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Вход успешен — компонент перерендерится и AdminPage покажет админку
    } catch (err: any) {
      setError('Неверный email или пароль');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: '20px' }}>
      <Text weight="2" style={{ fontSize: '24px', display: 'block', textAlign: 'center', marginBottom: '20px' }}>
        Вход в админ-панель
      </Text>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          disabled={loading}
        />
        {error && <Text style={{ color: 'red', marginBottom: '10px' }}>{error}</Text>}
        <Button type="submit" stretched disabled={loading} style={{ padding: '12px' }}>
          {loading ? 'Вход...' : 'Войти'}
        </Button>
      </form>
    </div>
  );
};