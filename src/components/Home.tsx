import { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const ADMIN_TOKEN = import.meta.env.VITE_X_ADMIN_TOKEN;

const Home = () => {
  const [stats, setStats] = useState({
    User: 0,
    Makale: 0,
    Person: 0,
    Company: 0
  });
  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'X-Admin-Token': ADMIN_TOKEN,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/total`, {
          headers: getAuthHeaders()
        });
        console.log("response:",response)
        if (response.data.status === 'success') {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Veriler alınırken hata oluştu:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div style={{ background: '#F3F7F3', padding: '2rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(44, 62, 80, 0.07)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2D3B2D' }}>Toplam Kullanıcı 👥</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3E513E', textAlign: 'center' }}>{stats.User}</p>
        </div>
        <div style={{ background: '#F3F7F3', padding: '2rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(44, 62, 80, 0.07)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2D3B2D' }}>Toplam Makale 📚</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3E513E', textAlign: 'center' }}>{stats.Makale}</p>
        </div>
        <div style={{ background: '#F3F7F3', padding: '2rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(44, 62, 80, 0.07)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2D3B2D' }}>Bireysel Test 👤</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3E513E', textAlign: 'center' }}>{stats.Person}</p>
        </div>
        <div style={{ background: '#F3F7F3', padding: '2rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(44, 62, 80, 0.07)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2D3B2D' }}>Kurumsal Test 🏢</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3E513E', textAlign: 'center' }}>{stats.Company}</p>
        </div>
      </div>

      {/* Recent Activities */}
    </div>
  );
};

export default Home; 