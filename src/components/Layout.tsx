import { ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { updateAdmin,resetAdminPassword } from '../services/api';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Admin modalı için başlangıç state
const initialAdminForm = { firstname: '', lastname: '', email: '', password: '' };

interface LayoutProps {
  children: ReactNode;
  onPageChange?: (page: string) => void;
  onLogout?: () => void;
}

const Layout = ({ children, onPageChange, onLogout }: LayoutProps) => {
  const [activeMenu, setActiveMenu] = useState('anasayfa');
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');
  const [adminId, setAdminId] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [adminForm, setAdminForm] = useState(initialAdminForm);
  const [resetPassword, setResetPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'X-Admin-Token': import.meta.env.VITE_X_ADMIN_TOKEN,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }
    const fetchAdminInfo = async () => {
      try {
        const response = await axios.get(`${BASE_URL}`, {
          headers: getAuthHeaders()
        });
        if (response.data.status === 'success') {
          setAdminEmail(response.data.data.Email);
          setAdminId(response.data.data.Id);
          setAdminForm({
            firstname: response.data.data.Firstname || '',
            lastname: response.data.data.Lastname || '',
            email: response.data.data.Email || '',
            password: ''
          });
        }
      } catch (error) {
        console.error('Admin bilgileri alınırken hata oluştu:', error);
      }
    };
    fetchAdminInfo();
  }, [navigate]);

  const handleResetPasswordSave = async () => {
    if (!resetPassword) {
      alert('Lütfen yeni şifreyi girin.');
      return;
    }
    if (!adminId) {
      alert('Admin ID bulunamadı!');
      return;
    }
    console.log('Resetting password...');
    const result = await resetAdminPassword(adminId, resetPassword);
    if (result.success) {
      setSuccessMessage(result.message);
      setResetPassword(''); // Clear password field on success
      setShowEditModal(false); // Modalı kapat
    } else {
      alert(result.message);
    }
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
          padding: '0 1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="/carbon-footprint-earth.png" alt="Karbon İzgi Logo" style={{ height: 32, width: 'auto', borderRadius: '0.25rem', background: '#fff', padding: 2 }} />
            <h1 style={{
              color: '#E8F5E9',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: 0
            }}>Karbonizgi</h1>
          </div>
          <p style={{ color: '#A5D6A7', fontSize: '0.875rem', marginTop: '0.5rem' }}>Admin Panel</p>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src="/carbon-footprint-earth.png" alt="Karbon İzgi Logo" style={{ height: 36, width: 'auto', borderRadius: '0.25rem' }} />
            <h2 style={{
              color: '#2D3B2D',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              {menuItems.find(item => item.id === activeMenu)?.label}
            </h2>
          </div>

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
              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#2D3B2D' }}>{adminEmail ? adminEmail : 'Giriş yapılmadı'}</p>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              title="Bilgileri Düzenle"
              style={{
                background: '#2D3B2D',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.35rem 0.7rem',
                fontWeight: 500,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 0,
                minHeight: 0,
              }}
            >
              ✏️
            </button>
            <button
              onClick={onLogout}
              title="Çıkış Yap"
              style={{
                background: '#6B4F27',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.35rem 0.7rem',
                fontWeight: 500,
                fontSize: '1rem',
                cursor: 'pointer',
                marginLeft: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 0,
                minHeight: 0,
              }}
            >
              ➡️
            </button>
          </div>
        </header>

        <main style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          flex: 1,
        }}>
          {successMessage && (
            <div style={{
              backgroundColor: '#D1FAE5',
              color: '#065F46',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{successMessage}</span>
              <button
                onClick={() => setSuccessMessage(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#065F46',
                  cursor: 'pointer',
                  fontSize: '1.25rem'
                }}
              >
                ×
              </button>
            </div>
          )}
          {children}
        </main>
      </div>

      {/* Bilgileri Düzenle Modalı */}
      {showEditModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div style={{ background: 'white', borderRadius: '0.5rem', padding: '2rem', width: 400 }}>
            <h3 style={{ color: '#2D3B2D', marginBottom: '1.5rem' }}>Bilgileri Düzenle</h3>
            <input 
              type="text" 
              placeholder="Ad" 
              value={adminForm.firstname} 
              onChange={e => setAdminForm(f => ({ ...f, firstname: e.target.value }))} 
              style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #E5E7EB' }} 
            />
            <input 
              type="text" 
              placeholder="Soyad" 
              value={adminForm.lastname} 
              onChange={e => setAdminForm(f => ({ ...f, lastname: e.target.value }))} 
              style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #E5E7EB' }} 
            />
            <input 
              type="email" 
              placeholder="E-posta" 
              value={adminForm.email} 
              onChange={e => setAdminForm(f => ({ ...f, email: e.target.value }))} 
              style={{ width: '100%', marginBottom: '1.5rem', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #E5E7EB' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button 
                onClick={async () => {
                  try {
                    if (!adminId) {
                      alert('Admin ID bulunamadı!');
                      return;
                    }
                    const result = await updateAdmin(adminId, {
                      name: adminForm.firstname,
                      last_name: adminForm.lastname,
                      email: adminForm.email
                    });
                    if (result.success) {
                      setSuccessMessage(result.message);
                      setShowEditModal(false);
                      // Güncelleme başarılı olduktan sonra admin bilgilerini yenile
                      const response = await axios.get(`${BASE_URL}`, {
                        headers: getAuthHeaders()
                      });
                      if (response.data.status === 'success') {
                        setAdminEmail(response.data.data.Email);
                        setAdminId(response.data.data.Id);
                        setAdminForm({
                          firstname: response.data.data.Firstname || '',
                          lastname: response.data.data.Lastname || '',
                          email: response.data.data.Email || '',
                          password: ''
                        });
                      }
                    } else {
                      alert(result.message);
                    }
                  } catch (error) {
                    alert('Bilgiler güncellenirken bir hata oluştu!');
                  }
                }} 
                style={{ padding: '0.75rem 1.5rem', borderRadius: '0.375rem', border: 'none', background: '#2D3B2D', color: 'white', cursor: 'pointer' }}
              >
                Kaydet
              </button>
            </div>
            
            <div style={{ borderTop: '1px solid #E5E7EB', margin: '1.5rem 0 1rem 0', paddingTop: '1.5rem' }}>
              <h4 style={{ color: '#2D3B2D', fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Şifre Sıfırla</h4>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Yeni Şifre" 
                  value={resetPassword} 
                  onChange={e => setResetPassword(e.target.value)} 
                  style={{ 
                    width: '90%', 
                    marginBottom: '1rem', 
                    padding: '0.75rem', 
                    paddingRight: '2.5rem',
                    borderRadius: '0.375rem', 
                    border: '1px solid #E5E7EB' 
                  }} 
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    color: '#6B7280'
                  }}
                >
                  {showPassword ? '👁️' : '🔒'}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={handleResetPasswordSave} 
                  style={{ 
                    padding: '0.5rem 1.25rem', 
                    borderRadius: '0.375rem', 
                    border: 'none', 
                    background: '#6B4F27', 
                    color: 'white', 
                    cursor: 'pointer', 
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>🔒</span> Şifreyi Kaydet
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => setShowEditModal(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.375rem', border: '1px solid #E5E7EB', background: 'white', color: '#2D3B2D', cursor: 'pointer' }}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout; 