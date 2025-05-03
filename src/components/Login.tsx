import { useState } from 'react';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<any>;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await onLogin(email, password);
      if (res?.status === 'error' && res?.message) {
        setError(res.message);
      }
    } catch (err: any) {
      setError('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>Karbonİzgi</h1>
          <p style={{ color: '#6b7280' }}>Admin Panel</p>
        </div>
        {error && (
          <div style={{
            background: '#FEE2E2',
            color: '#DC2626',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: 500
          }}>{error}</div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="email" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              E-posta Adresi
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '95%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                fontSize: '0.875rem'
              }}
              placeholder="ornek@email.com"
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Şifre
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '90%',
                padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                fontSize: '0.875rem'
              }}
              placeholder="••••••••"
              required
            />
            <span
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '2.5rem',
                cursor: 'pointer',
                color: '#374151',
                fontSize: '1.2rem',
                userSelect: 'none',
              }}
              title={showPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              marginTop: '0.5rem'
            }}
            disabled={loading}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 