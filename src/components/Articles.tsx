import { useState, useEffect } from 'react';
import AddArticleModal from './AddArticleModal.tsx';
import EditArticleModal from './EditArticleModal';
import { fetchArticles } from '../services/api.ts';
import { Article } from '../services/api.ts';

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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <button
        onClick={() => setSelectedIndex(null)}
        style={{ marginBottom: 24, background: '#E5E7EB', color: '#14532D', border: 'none', borderRadius: 6, padding: '0.5rem 1.5rem', fontWeight: 500, cursor: 'pointer' }}
      >
        ← Geri
      </button>
      <button
        onClick={() => setEditingIndex(selectedIndex)}
        style={{ float: 'right', background: '#166534', color: 'white', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer', fontWeight: 500 }}
      >
        Düzenle
      </button>
      <h2 style={{ color: '#14532D', fontSize: '1.5rem', fontWeight: 600 }}>{article.title}</h2>
      <img src={article.image} alt={article.title} style={{ width: '100%', maxHeight: 320, objectFit: 'contain', borderRadius: 8, margin: '1rem 0' }} />
      {article.sections.map((section, sidx) => (
        <div key={sidx} style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#166534', fontSize: '1.1rem', fontWeight: 500, marginBottom: 8 }}>{section.subtitle}</h3>
          {section.type === 'paragraph' && (
            <p style={{ color: '#374151', fontSize: '1rem', lineHeight: 1.7 }}>{section.content}</p>
          )}
          {section.type === 'list' && section.items && (
            <ul style={{ paddingLeft: 24, color: '#374151', fontSize: '1rem', lineHeight: 1.7 }}>
              {section.items.map((item, iidx) => (
                <li key={iidx} style={{ marginBottom: 8 }}>
                  <strong>{item.title}:</strong> {item.content}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <EditArticleModal
        isOpen={editingIndex === selectedIndex}
        onClose={() => setEditingIndex(null)}
        article={article}
        onSave={updated => {
          setArticles(prev => prev.map((a, i) => i === selectedIndex ? updated : a));
          setEditingIndex(null);
        }}
      />
    </div>
  );
};

export default Articles; 