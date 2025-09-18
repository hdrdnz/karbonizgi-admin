import { useState, useEffect } from 'react';
import AddArticleModal from './AddArticleModal.tsx';
import { fetchArticles } from '../services/api.ts';
import { Article } from '../services/api.ts';
import axios from 'axios';

export interface ArticleSection {
  subtitle: string;
  type: 'paragraph' | 'list';
  content?: string;
  items?: { title: string; content: string }[];
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchArticles();
        setArticles(data);
      } catch (err) {
        setError('Makaleler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAddArticle = (article: Article) => {
    setArticles(prev => [article, ...prev]);
    setIsAddModalOpen(false);
  };

  // Liste görünümü
  if (selectedIndex === null) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#2D3B2D', fontSize: '2rem', fontWeight: 'bold' }}>Makaleler</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
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
          >
            + Makale Ekle
          </button>
        </div>
        {loading && <div>Yükleniyor...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {!loading && !error && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {articles.map((article, idx) => (
              <li key={idx} style={{
                background: 'white',
                borderRadius: 8,
                boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                marginBottom: 16,
                padding: '1rem 1.5rem',
                cursor: 'pointer',
                color: '#14532D',
                fontWeight: 500,
                fontSize: '1.1rem',
                transition: 'all 0.2s',
                border: '2px solid #E5E7EB',
              }}
                onClick={() => setSelectedIndex(idx)}
              >
                {article.title}
              </li>
            ))}
          </ul>
        )}
        <AddArticleModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddArticle} />
      </div>
    );
  }

  // Detay görünümü
  const article = articles[selectedIndex];

  const handleDeleteArticle = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = {
        'X-Admin-Token': import.meta.env.VITE_X_ADMIN_TOKEN,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const params = new URLSearchParams();
      params.append('title', article.title);
      await axios.post(`${BASE_URL}/delete-data`, params, { headers });
      setSuccessMessage('Makale başarıyla silindi!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setArticles(prev => prev.filter((_, idx) => idx !== selectedIndex));
      setSelectedIndex(null);
    } catch (err: any) {
      alert('Makale silinirken hata oluştu!');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <button
          onClick={handleDeleteArticle}
          style={{ padding: '0.75rem 1.5rem', borderRadius: 6, border: 'none', background: '#DC2626', color: 'white', cursor: 'pointer', fontWeight: 500 }}
        >
          Sil
        </button>
      </div>
      <button
        onClick={() => setSelectedIndex(null)}
        style={{ marginBottom: '1rem', background: 'none', border: 'none', color: '#2D3B2D', cursor: 'pointer', fontWeight: 500 }}
      >
        ← Geri
      </button>
      <h2 style={{ color: '#14532D', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{article.title}</h2>
      <img src={article.image} alt={article.title} style={{ width: '100%', borderRadius: 8, marginBottom: 16 }} />
      {article.sections.map((section, idx) => (
        <div key={idx} style={{ marginBottom: 16 }}>
          <h4 style={{ color: '#166534', fontWeight: 600 }}>{section.subtitle}</h4>
          {section.type === 'paragraph' && <p>{section.content}</p>}
          {section.type === 'list' && Array.isArray(section.items) && (
            <ul>
              {section.items.map((item: any, iidx: number) => (
                <li key={iidx}><b>{item.title}:</b> {item.content}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Articles; 