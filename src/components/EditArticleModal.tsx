import { useState, useEffect } from 'react';
import { Article } from '../services/api';

interface EditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
  onSave: (article: Article) => void;
}

const emptySection = { subtitle: '', type: 'paragraph', content: '', items: [] };

const EditArticleModal = ({ isOpen, onClose, article, onSave }: EditArticleModalProps) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [sections, setSections] = useState<any[]>([{ ...emptySection }]);

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setImage(article.image);
      setSections(article.sections.map(s => ({ ...emptySection, ...s })));
    }
  }, [article]);

  if (!isOpen || !article) return null;

  const handleSectionChange = (idx: number, field: string, value: any) => {
    setSections(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const handleSectionTypeChange = (idx: number, type: 'paragraph' | 'list') => {
    setSections(prev => prev.map((s, i) =>
      i === idx ? { ...s, type, content: type === 'paragraph' ? '' : undefined, items: type === 'list' ? [{ title: '', content: '' }] : undefined } : s
    ));
  };

  const handleSectionItemChange = (sidx: number, iidx: number, field: string, value: string) => {
    setSections(prev => prev.map((s, i) =>
      i === sidx ? { ...s, items: s.items.map((item: any, j: number) => j === iidx ? { ...item, [field]: value } : item) } : s
    ));
  };

  const addSection = () => setSections(prev => [...prev, { ...emptySection }]);
  const removeSection = (idx: number) => setSections(prev => prev.filter((_, i) => i !== idx));
  const addListItem = (sidx: number) => setSections(prev => prev.map((s, i) => i === sidx ? { ...s, items: [...(s.items || []), { title: '', content: '' }] } : s));
  const removeListItem = (sidx: number, iidx: number) => setSections(prev => prev.map((s, i) => i === sidx ? { ...s, items: s.items.filter((_: any, j: number) => j !== iidx) } : s));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, image, sections });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', borderRadius: 8, padding: 32, width: 500, maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ color: '#14532D', fontSize: '1.3rem', fontWeight: 600, marginBottom: 24 }}>Makale Düzenle</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#2D3B2D', fontWeight: 500 }}>Başlık</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #E5E7EB', marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#2D3B2D', fontWeight: 500 }}>Görsel Linki</label>
            <input value={image} onChange={e => setImage(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #E5E7EB', marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#2D3B2D', fontWeight: 500 }}>Bölümler</label>
            {sections.map((section, idx) => (
              <div key={idx} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: 12, marginBottom: 12 }}>
                <div style={{ marginBottom: 8 }}>
                  <label>Alt Başlık</label>
                  <input value={section.subtitle} onChange={e => handleSectionChange(idx, 'subtitle', e.target.value)} required style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #E5E7EB', marginTop: 2 }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label>Tip</label>
                  <select value={section.type} onChange={e => handleSectionTypeChange(idx, e.target.value as 'paragraph' | 'list')} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #E5E7EB', marginTop: 2 }}>
                    <option value="paragraph">Paragraf</option>
                    <option value="list">Liste</option>
                  </select>
                </div>
                {section.type === 'paragraph' && (
                  <div style={{ marginBottom: 8 }}>
                    <label>İçerik</label>
                    <textarea value={section.content} onChange={e => handleSectionChange(idx, 'content', e.target.value)} required style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #E5E7EB', marginTop: 2, minHeight: 60 }} />
                  </div>
                )}
                {section.type === 'list' && (
                  <div>
                    <label>Liste Maddeleri</label>
                    {(section.items || []).map((item: any, iidx: number) => (
                      <div key={iidx} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                        <input value={item.title} onChange={e => handleSectionItemChange(idx, iidx, 'title', e.target.value)} placeholder="Başlık" required style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #E5E7EB' }} />
                        <input value={item.content} onChange={e => handleSectionItemChange(idx, iidx, 'content', e.target.value)} placeholder="Açıklama" required style={{ flex: 2, padding: 6, borderRadius: 4, border: '1px solid #E5E7EB' }} />
                        <button type="button" onClick={() => removeListItem(idx, iidx)} style={{ background: '#DC2626', color: 'white', border: 'none', borderRadius: 4, padding: '0 8px', cursor: 'pointer' }}>-</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addListItem(idx)} style={{ background: '#2D3B2D', color: 'white', border: 'none', borderRadius: 4, padding: '2px 10px', marginTop: 4, cursor: 'pointer' }}>+ Madde Ekle</button>
                  </div>
                )}
                <button type="button" onClick={() => removeSection(idx)} style={{ background: '#DC2626', color: 'white', border: 'none', borderRadius: 4, padding: '2px 10px', marginTop: 8, cursor: 'pointer' }}>Bölümü Sil</button>
              </div>
            ))}
            <button type="button" onClick={addSection} style={{ background: '#2D3B2D', color: 'white', border: 'none', borderRadius: 4, padding: '6px 16px', marginTop: 8, cursor: 'pointer' }}>+ Bölüm Ekle</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', borderRadius: 6, border: '1px solid #E5E7EB', background: 'white', color: '#2D3B2D', cursor: 'pointer', fontWeight: 500 }}>İptal</button>
            <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: 6, border: 'none', background: '#2D3B2D', color: 'white', cursor: 'pointer', fontWeight: 500 }}>Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArticleModal; 