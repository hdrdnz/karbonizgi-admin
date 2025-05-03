import { useState, useEffect } from 'react';
import { fetchComments, addComment } from '../services/api';


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

const SoruCevap = () => {
  const [tab, setTab] = useState<'bireysel' | 'kurumsal'>('bireysel');
  const [sorular, setSorular] = useState<{ question: string; answer: string }[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchComments(tab === 'bireysel' ? 'person' : 'company');
        setSorular(data);
      } catch (err) {
        setError('Veriler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [tab]);

  const handleAddQuestion = async (newQuestion: { question: string; answer: string; userType: 'person' | 'company' }) => {
    setAddLoading(true);
    setAddError(null);
    try {
      await addComment(newQuestion.userType, { question: newQuestion.question, answer: newQuestion.answer });
      setSorular(prev => [{ question: newQuestion.question, answer: newQuestion.answer }, ...prev]);
      setIsAddModalOpen(false);
      setSuccessMessage('Soru başarıyla eklendi!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setAddError('Soru eklenirken hata oluştu');
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditQuestion = (index: number, updatedQuestion: { question: string; answer: string }) => {
    setSorular(prev => prev.map((item, idx) => idx === index ? updatedQuestion : item));
    setEditingIndex(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex' }}>
          <button style={tabStyle(tab === 'bireysel')} onClick={() => setTab('bireysel')}>Bireysel</button>
          <button style={tabStyle(tab === 'kurumsal')} onClick={() => setTab('kurumsal')}>Kurumsal</button>
        </div>
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
          + Yeni Soru Ekle
        </button>
      </div>
      {loading && <div>Yükleniyor...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && (
        <div>
          {sorular.map((item, idx) => (
            <div key={idx} style={{
              background: '#F3F7F3',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              padding: '1.25rem 1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              position: 'relative',
            }}>
              <div style={{ fontWeight: 600, color: '#2D3B2D', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                {item.question}
              </div>
              <div style={{ color: '#3E513E', fontSize: '1rem' }}>
                {item.answer}
              </div>
              <button
                onClick={() => setEditingIndex(idx)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#166534',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 16px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Düzenle
              </button>
            </div>
          ))}
          {sorular.length === 0 && (
            <div style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>Henüz soru eklenmedi.</div>
          )}
        </div>
      )}
      {/* Add Modal */}
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
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            width: '500px',
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#2D3B2D' }}>Yeni Soru Ekle</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#2D3B2D' }}>Kullanıcı Tipi:</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" name="userType" value="person" defaultChecked style={{ marginRight: '0.5rem' }} />
                  Bireysel
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" name="userType" value="company" style={{ marginRight: '0.5rem' }} />
                  Kurumsal
                </label>
              </div>
            </div>
            <input
              type="text"
              id="questionInput"
              placeholder="Soru"
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                borderRadius: '0.375rem',
                border: '1px solid #E5E7EB',
              }}
            />
            <textarea
              id="answerInput"
              placeholder="Cevap"
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                borderRadius: '0.375rem',
                border: '1px solid #E5E7EB',
                minHeight: '100px',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsAddModalOpen(false)}
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
                onClick={() => {
                  const userType = document.querySelector('input[name="userType"]:checked')?.getAttribute('value') as 'person' | 'company';
                  const question = (document.getElementById('questionInput') as HTMLInputElement).value;
                  const answer = (document.getElementById('answerInput') as HTMLTextAreaElement).value;
                  handleAddQuestion({ question, answer, userType });
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  background: '#2D3B2D',
                  color: 'white',
                  cursor: 'pointer',
                }}
                disabled={addLoading}
              >
                {addLoading ? 'Ekleniyor...' : 'Kaydet'}
              </button>
            </div>
            {addError && <div style={{ color: 'red', marginTop: '1rem' }}>{addError}</div>}
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {editingIndex !== null && (
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
            width: '500px',
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#2D3B2D' }}>Soru Düzenle</h3>
            <input
              type="text"
              defaultValue={sorular[editingIndex].question}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                borderRadius: '0.375rem',
                border: '1px solid #E5E7EB',
              }}
            />
            <textarea
              defaultValue={sorular[editingIndex].answer}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                borderRadius: '0.375rem',
                border: '1px solid #E5E7EB',
                minHeight: '100px',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setEditingIndex(null)}
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
                onClick={() => handleEditQuestion(editingIndex, { question: 'Düzenlenmiş Soru', answer: 'Düzenlenmiş Cevap' })}
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
          zIndex: 1000,
        }}>
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default SoruCevap; 