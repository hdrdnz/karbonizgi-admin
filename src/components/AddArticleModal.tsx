import { useState } from 'react';
import { addArticle } from '../services/api';

interface AddArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: any) => void;
}

const emptySection = { subtitle: '', type: 'paragraph', content: '', items: [] };

const AddArticleModal = ({ isOpen, onClose, onSave }: AddArticleModalProps) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [sections, setSections] = useState<any[]>([{ ...emptySection }]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddSection = () => {
    setSections([...sections, { ...emptySection }]);
  };

  const handleSectionChange = (index: number, field: string, value: any) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const handleSave = async () => {
    const article = { title, image, sections };
    try {
      await addArticle(article);
      setSuccessMessage('Makale başarıyla eklendi!');
      setTimeout(() => setSuccessMessage(null), 3000);
      onSave(article);
      onClose();
    } catch (error) {
      console.error('Makale eklenirken hata oluştu:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
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
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          width: '600px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#2D3B2D' }}>Yeni Makale Ekle</h3>
          <div style={{ 
            overflowY: 'auto',
            flex: 1,
            paddingRight: '0.5rem',
            marginRight: '-0.5rem',
          }}>
            <input
              type="text"
              placeholder="Başlık"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                borderRadius: '0.375rem',
                border: '1px solid #E5E7EB',
              }}
            />
            <input
              type="text"
              placeholder="Resim URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                borderRadius: '0.375rem',
                border: '1px solid #E5E7EB',
              }}
            />
            {sections.map((section, index) => (
              <div key={index} style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Alt Başlık"
                  value={section.subtitle}
                  onChange={(e) => handleSectionChange(index, 'subtitle', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #E5E7EB',
                  }}
                />
                <select
                  value={section.type}
                  onChange={(e) => handleSectionChange(index, 'type', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <option value="paragraph">Paragraf</option>
                  <option value="list">Liste</option>
                </select>
                {section.type === 'paragraph' ? (
                  <textarea
                    placeholder="İçerik"
                    value={section.content}
                    onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      marginBottom: '0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #E5E7EB',
                      minHeight: '100px',
                    }}
                  />
                ) : (
                  <div>
                    {section.items.map((item: { title: string; content: string }, itemIndex: number) => (
                      <div key={itemIndex} style={{ marginBottom: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="Başlık"
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...section.items];
                            newItems[itemIndex].title = e.target.value;
                            handleSectionChange(index, 'items', newItems);
                          }}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            marginBottom: '0.5rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #E5E7EB',
                          }}
                        />
                        <input
                          type="text"
                          placeholder="İçerik"
                          value={item.content}
                          onChange={(e) => {
                            const newItems = [...section.items];
                            newItems[itemIndex].content = e.target.value;
                            handleSectionChange(index, 'items', newItems);
                          }}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            marginBottom: '0.5rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #E5E7EB',
                          }}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newItems = [...section.items, { title: '', content: '' }];
                        handleSectionChange(index, 'items', newItems);
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #E5E7EB',
                        background: '#F3F7F3',
                        cursor: 'pointer',
                      }}
                    >
                      + Liste Öğesi Ekle
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={handleAddSection}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid #E5E7EB',
                background: '#F3F7F3',
                cursor: 'pointer',
                marginBottom: '1rem',
              }}
            >
              + Bölüm Ekle
            </button>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #E5E7EB',
          }}>
            <button
              onClick={onClose}
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
              onClick={handleSave}
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
    </>
  );
};

export default AddArticleModal; 