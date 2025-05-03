import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  onPageChange?: (page: string) => void;
  onLogout?: () => void;
}

const Layout = ({ children, onPageChange, onLogout }: LayoutProps) => {
  const [activeMenu, setActiveMenu] = useState('anasayfa');
  const navigate = useNavigate();

  const menuItems = [
    { id: 'anasayfa', label: 'Anasayfa', icon: '🏠', path: '' },
    { id: 'testler', label: 'Testler', icon: '📋', path: 'testler' },
    { id: 'kullanicilar', label: 'Kullanıcılar', icon: '👥', path: 'kullanicilar' },
    { id: 'makaleler', label: 'Makaleler', icon: '📚', path: 'makaleler' },
    { id: 'soru-cevap', label: 'Soru Cevap', icon: '❓', path: 'soru-cevap' },
  ];

  const handleMenuClick = (menuId: string, path: string) => {
    setActiveMenu(menuId);
    navigate(`/admin/${path}`);
    onPageChange?.(menuId);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {}
      <div style={{
        width: '280px',
        backgroundColor: '#2D3B2D',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
      }}>
        {/* Logo */}
        <div style={{
          marginBottom: '3rem',
          padding: '0 1rem'
        }}>
          <h1 style={{
            color: '#E8F5E9',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>Karbonİzgi</h1>
          <p style={{ color: '#A5D6A7', fontSize: '0.875rem' }}>Admin Panel</p>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id, item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0.75rem 1rem',
                marginBottom: '0.5rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: activeMenu === item.id ? '#3E513E' : 'transparent',
                color: activeMenu === item.id ? '#E8F5E9' : '#A5D6A7',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left',
                fontSize: '0.875rem',
              }}
            >
              <span style={{ marginRight: '0.75rem', fontSize: '1.25rem' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div style={{
        marginLeft: '280px',
        flex: 1,
        backgroundColor: '#F3F7F3', 
        minHeight: '100vh',
        padding: '2rem'
      }}>
        <header style={{
          backgroundColor: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '0.5rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            color: '#2D3B2D',
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            {menuItems.find(item => item.id === activeMenu)?.label}
          </h2>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.5rem',
            color: '#2D3B2D',
            backgroundColor: '#F3F7F3',
            borderRadius: '0.5rem',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#A5D6A7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem',
              fontSize: '1.25rem'
            }}>
              👤
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#2D3B2D' }}>Admin Kullanıcı</p>
              <p style={{ fontSize: '0.75rem', color: '#4B5563' }}>admin@karbonizgi.com</p>
            </div>
            <button
              onClick={onLogout}
              style={{
                background: '#6B4F27',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.5rem 1.25rem',
                fontWeight: 500,
                fontSize: '1rem',
                cursor: 'pointer',
                marginLeft: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
              }}
            >
              Çıkış Yap
            </button>
          </div>
        </header>

        <main style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 