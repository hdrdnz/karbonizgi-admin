import { useState, useEffect } from 'react';
import { fetchUsers, User, updateUser, UserInfo } from '../services/api';
import axios from 'axios';

const tabStyle = (active: boolean) => ({
  padding: '0.75rem 2rem',
  borderRadius: '0.5rem 0.5rem 0 0',
  background: active ? '#3E513E' : '#E8F5E9',
  color: active ? '#E8F5E9' : '#2D3B2D',
  fontWeight: 600,
  cursor: 'pointer',
  border: 'none',
  outline: 'none',
  marginRight: '1rem',
  fontSize: '1rem',
  transition: 'all 0.2s',
});

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Users = () => {
  const [tab, setTab] = useState<'bireysel' | 'kurumsal'>('bireysel');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<Partial<User & { password: string }>>({});
  const [addPasswordVisible, setAddPasswordVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchUsers(tab === 'bireysel' ? 'person' : 'company');
        setUsers(data);
      } catch (err) {
        setError('Kullanıcılar yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [tab]);

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditForm({ ...user });
  };

  const handleEditChange = (field: keyof User, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    if (!editingUser) return;
    if (!editForm.Firstname || !editForm.Lastname || !editForm.Email || !editForm.Username || (tab === 'kurumsal' && !editForm.CompanyName)) {
      alert('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    const userInfo: UserInfo = {
      UserId: editingUser.Id,
      Email: editForm.Email || '',
      UserName: editForm.Username || '',
      FirstName: editForm.Firstname || '',
      LastName: editForm.Lastname || '',
      UserType: editingUser.UserType,
    };
    try {
      await updateUser(userInfo);
      setUsers(prev => prev.map(u => u.Id === editingUser.Id ? { ...u, ...editForm } : u));
      setSuccessMessage('Kullanıcı başarıyla güncellendi!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert('Kullanıcı güncellenirken hata oluştu!');
      }
    }
    setEditingUser(null);
    setEditForm({});
  };

  const handleAddChange = (field: string, value: string) => {
    setAddForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSave = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = {
        'X-Admin-Token': import.meta.env.VITE_X_ADMIN_TOKEN,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      };
      const body = {
        email: addForm.Email || '',
        first_name: addForm.Firstname || '',
        last_name: addForm.Lastname || '',
        user_name: addForm.Username || '',
        user_type: addForm.UserType === 'person' ? 'person' : 'company',
        password: addForm.password || '',
        company_name: addForm.UserType === 'company' ? addForm.CompanyName || '' : '',
      };
      await axios.post(`${BASE_URL}/add-user`, body, { headers });
      setSuccessMessage('Kullanıcı başarıyla eklendi!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setIsAddModalOpen(false);
      setAddForm({});
      setAddPasswordVisible(false);
      // Yeni kullanıcıyı tekrar fetch etmek için kullanıcıları yeniden yükleyebilirsiniz
      const data = await fetchUsers(tab === 'bireysel' ? 'person' : 'company');
      setUsers(data);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert('Kullanıcı eklenirken hata oluştu!');
      }
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = {
        'X-Admin-Token': import.meta.env.VITE_X_ADMIN_TOKEN,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      await axios.post(`${BASE_URL}/delete-user`, { userId }, { headers });
      setUsers(prev => prev.filter(u => u.Id !== userId));
      setSuccessMessage('Kullanıcı başarıyla silindi!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert('Kullanıcı silinirken hata oluştu!');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', marginBottom: '2rem' }}>
        <button style={tabStyle(tab === 'bireysel')} onClick={() => setTab('bireysel')}>Bireysel</button>
        <button style={tabStyle(tab === 'kurumsal')} onClick={() => setTab('kurumsal')}>Kurumsal</button>
        <button
          style={{
            marginLeft: 'auto',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            backgroundColor: '#2D3B2D',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
          }}
          onClick={() => { setAddForm({ UserType: 'person' }); setIsAddModalOpen(true); }}
        >
          + Kullanıcı Ekle
        </button>
      </div>
      {loading && <div>Yükleniyor...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr style={{ background: '#F3F7F3', color: '#2D3B2D' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Ad</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Soyad</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>E-posta</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Kullanıcı Adı</th>
                {tab === 'kurumsal' && <th style={{ padding: '0.75rem', textAlign: 'left' }}>Şirket Adı</th>}
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Oluşturulma</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.Id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '0.75rem' }}>{user.Id}</td>
                  <td style={{ padding: '0.75rem' }}>{user.Firstname}</td>
                  <td style={{ padding: '0.75rem' }}>{user.Lastname}</td>
                  <td style={{ padding: '0.75rem' }}>{user.Email}</td>
                  <td style={{ padding: '0.75rem' }}>{user.Username}</td>
                  {tab === 'kurumsal' && <td style={{ padding: '0.75rem' }}>{user.CompanyName}</td>}
                  <td style={{ padding: '0.75rem' }}>{new Date(user.CreatedAt).toLocaleDateString('tr-TR')}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button style={{
                      marginRight: '0.5rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      backgroundColor: '#2D3B2D',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }} onClick={() => handleEditClick(user)}>Düzenle</button>
                    <button style={{
                      marginRight: '0.5rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      backgroundColor: '#166534',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }} onClick={() => { setResetUser(user); setNewPassword(''); }}>Şifre Sıfırla</button>
                    <button style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      backgroundColor: '#B91C1C',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }} onClick={() => handleDeleteUser(user.Id)}>Sil</button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={tab === 'kurumsal' ? 8 : 7} style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
                    Kullanıcı bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Düzenle Modalı */}
      {editingUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            width: '400px',
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#2D3B2D' }}>Kullanıcıyı Düzenle</h3>
            <label style={{ color: '#2D3B2D', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Ad</label>
            <input
              type="text"
              value={editForm.Firstname || ''}
              onChange={e => handleEditChange('Firstname', e.target.value)}
              placeholder="Ad"
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.375rem', border: '1px solid #E5E7EB' }}
            />
            <label style={{ color: '#2D3B2D', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Soyad</label>
            <input
              type="text"
              value={editForm.Lastname || ''}
              onChange={e => handleEditChange('Lastname', e.target.value)}
              placeholder="Soyad"
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.375rem', border: '1px solid #E5E7EB' }}
            />
            <label style={{ color: '#2D3B2D', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>E-posta</label>
            <input
              type="email"
              value={editForm.Email || ''}
              onChange={e => handleEditChange('Email', e.target.value)}
              placeholder="E-posta"
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.375rem', border: '1px solid #E5E7EB' }}
            />
            <label style={{ color: '#2D3B2D', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Kullanıcı Adı</label>
            <input
              type="text"
              value={editForm.Username || ''}
              onChange={e => handleEditChange('Username', e.target.value)}
              placeholder="Kullanıcı Adı"
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.375rem', border: '1px solid #E5E7EB' }}
            />
            {tab === 'kurumsal' && (
              <>
                <label style={{ color: '#2D3B2D', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Şirket Adı</label>
                <input
                  type="text"
                  value={editForm.CompanyName || ''}
                  onChange={e => handleEditChange('CompanyName', e.target.value)}
                  placeholder="Şirket Adı"
                  style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.375rem', border: '1px solid #E5E7EB' }}
                />
              </>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                onClick={() => { setEditingUser(null); setEditForm({}); }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #E5E7EB',
                  marginRight: '1rem',
                  cursor: 'pointer',
                }}
              >
                İptal
              </button>
              <button
                onClick={handleEditSave}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  background: '#2D3B2D',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Şifre Sıfırla Modalı */}
      {resetUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            width: '400px',
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#2D3B2D' }}>Şifre Sıfırla</h3>
            <label style={{ color: '#2D3B2D', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Yeni Şifre</label>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input
                type={showResetPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Yeni şifre"
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #E5E7EB',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
              <span
                onClick={() => setShowResetPassword(v => !v)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: '#2D3B2D',
                  fontSize: '1.5rem',
                  userSelect: 'none',
                  lineHeight: 1
                }}
                title={showResetPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
              >
                {showResetPassword ? '🔓' : '🔒'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                onClick={() => { setResetUser(null); setNewPassword(''); }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #E5E7EB',
                  marginRight: '1rem',
                  cursor: 'pointer',
                }}
              >
                İptal
              </button>
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('admin_token');
                    const params = new URLSearchParams();
                    params.append('userId', String(resetUser?.Id));
                    params.append('password', newPassword);
                    const headers = {
                      'X-Admin-Token': import.meta.env.VITE_X_ADMIN_TOKEN,
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      'Content-Type': 'application/x-www-form-urlencoded',
                    };
                    const response = await axios.post(`${BASE_URL}/reset-password`, params, { headers });
                    if (response.status === 200) {
                      setSuccessMessage('Şifre başarıyla sıfırlandı!');
                      setTimeout(() => setSuccessMessage(null), 3000);
                    }
                  } catch (err: any) {
                    if (err.response && err.response.data && err.response.data.message) {
                      alert(err.response.data.message);
                    } else {
                      alert('Şifre sıfırlanırken hata oluştu!');
                    }
                  }
                  setResetUser(null);
                  setNewPassword('');
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  background: '#2D3B2D',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Kullanıcı Ekle Modalı */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            width: '400px',
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#2D3B2D' }}>Kullanıcı Ekle</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#2D3B2D', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Kullanıcı Tipi:</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="userType" 
                    value="person" 
                    checked={addForm.UserType === 'person'} 
                    onChange={() => handleAddChange('UserType', 'person')} 
                    style={{ marginRight: '0.5rem' }} 
                  />
                  Bireysel
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="userType" 
                    value="company" 
                    checked={addForm.UserType === 'company'} 
                    onChange={() => handleAddChange('UserType', 'company')} 
                    style={{ marginRight: '0.5rem' }} 
                  />
                  Kurumsal
                </label>
              </div>
            </div>
            <label style={{ color: '#2D3B2D', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Ad</label>
            <input
              type="text"
              value={addForm.Firstname || ''}
              onChange={e => handleAddChange('Firstname', e.target.value)}
              placeholder="Ad"
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.375rem', border: '1px solid #E5E7EB' }}
            />
            <label style={{ color: '#2D3B2D', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Soyad</label>
            <input
              type="text"
              value={addForm.Lastname || ''}
              onChange={e => handleAddChange('Lastname', e.target.value)}
              placeholder="Soyad"
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.375rem', border: '1px solid #E5E7EB' }}
            />
            <label style={{ color: '#2D3B2D', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>E-posta</label>
            <input
              type="email"
              value={addForm.Email || ''}
              onChange={e => handleAddChange('Email', e.target.value)}
              placeholder="E-posta"
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.375rem', border: '1px solid #E5E7EB' }}
            />
            <label style={{ color: '#2D3B2D', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Kullanıcı Adı</label>
            <input
              type="text"
              value={addForm.Username || ''}
              onChange={e => handleAddChange('Username', e.target.value)}
              placeholder="Kullanıcı Adı"
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.375rem', border: '1px solid #E5E7EB' }}
            />
            {addForm.UserType === 'company' && (
              <>
                <label style={{ color: '#2D3B2D', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Şirket Adı</label>
                <input
                  type="text"
                  value={addForm.CompanyName || ''}
                  onChange={e => handleAddChange('CompanyName', e.target.value)}
                  placeholder="Şirket Adı"
                  style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.375rem', border: '1px solid #E5E7EB' }}
                />
              </>
            )}
            <label style={{ color: '#2D3B2D', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Şifre</label>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input
                type={addPasswordVisible ? 'text' : 'password'}
                value={addForm.password || ''}
                onChange={e => handleAddChange('password', e.target.value)}
                placeholder="Şifre"
                style={{ width: '90%', padding: '0.75rem 2.5rem 0.75rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #E5E7EB' }}
              />
              <span
                onClick={() => setAddPasswordVisible(v => !v)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: '#2D3B2D',
                  fontSize: '1.2rem',
                  userSelect: 'none',
                }}
                title={addPasswordVisible ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
              >
                {addPasswordVisible ? '🔓' : '🔒'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                onClick={() => { setIsAddModalOpen(false); setAddForm({ UserType: 'person' }); setAddPasswordVisible(false); }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #E5E7EB',
                  marginRight: '1rem',
                  cursor: 'pointer',
                }}
              >
                İptal
              </button>
              <button
                onClick={handleAddSave}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  background: '#2D3B2D',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          background: '#4CAF50',
          color: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 2000,
        }}>
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Users; 