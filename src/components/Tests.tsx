import { useState, useEffect } from 'react';
import AddTestModal from './AddTestModal';
import { fetchTests, addTest, TestQuestion } from '../services/api';
import axios from 'axios';

const individualCategoryTranslations = {
  diet: 'Diyet',
  energy: 'Enerji',
  housing: 'Ev',
  transport: 'Ulaşım',
  waste_recycling: 'Geri Dönüşüm'
};

const corporateCategoryTranslations = {
  industry: 'Endüstri',
  energy_transportation: 'Enerji & Ulaşım',
  service_trade: 'Hizmet & Ticaret',
  public_waste_management: 'Atık Yönetimi'
};

const Tests = () => {
  const [testType, setTestType] = useState<'individual' | 'corporate'>('individual');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('diet');

  
  const [tests, setTests] = useState<{ [category: string]: TestQuestion[] }>({});

 
  const loadTests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchTests(testType === 'individual' ? 'person' : 'company');
      setTests(response);
    } catch (err) {
      setError('Testler yüklenirken bir hata oluştu');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, [testType]);

  useEffect(() => {
    if (testType === 'individual') setSelectedCategory('diet');
    else setSelectedCategory('industry'); // Kurumsal için ilk kategori 'industry' olsun
  }, [testType]);

  const categoryTranslations = testType === 'individual' ? individualCategoryTranslations : corporateCategoryTranslations;
  const filteredTests = tests[selectedCategory] || [];

  const handleAddSave = async (newTest: TestQuestion, category: string) => {
    const result = await addTest(testType === 'individual' ? 'person' : 'company', category, newTest);
    if (result) {
      setSuccessMessage('Test başarıyla eklendi!');
      await loadTests();
      setIsAddModalOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      alert('Test eklenirken bir hata oluştu!');
    }
  };

  const handleDelete = async (testKey: string) => {
    if (window.confirm('Bu testi silmek istediğinizden emin misiniz?')) {
      try {
        const token = localStorage.getItem('admin_token');
        const params = new URLSearchParams();
        params.append('question_type', testType === 'individual' ? 'person' : 'company');
        params.append('question_key', testKey);
        params.append('category', selectedCategory);
        const headers = {
          'X-Admin-Token': import.meta.env.VITE_X_ADMIN_TOKEN,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'application/x-www-form-urlencoded',
        };
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/delete-test`, params, { headers });
        if (response.status === 200) {
          setSuccessMessage('Test başarıyla silindi!');
          setTimeout(() => setSuccessMessage(null), 3000);
        }
        await loadTests();
      } catch (err) {
        setError('Test silinirken bir hata oluştu');
        console.error(err);
      }
    }
  };

  return (
    <div>
      {/* Hata Mesajı */}
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#FEE2E2',
          color: '#DC2626',
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {/* Test Tipi Seçimi ve Yeni Test Ekleme Butonu */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem'
        }}>
          <button
            onClick={() => setTestType('individual')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: testType === 'individual' ? '#2D3B2D' : '#F3F7F3',
              color: testType === 'individual' ? '#E8F5E9' : '#2D3B2D',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            Bireysel Testler
          </button>
          <button
            onClick={() => setTestType('corporate')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: testType === 'corporate' ? '#2D3B2D' : '#F3F7F3',
              color: testType === 'corporate' ? '#E8F5E9' : '#2D3B2D',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            Kurumsal Testler
          </button>
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
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>+</span>
          Yeni Test Ekle
        </button>
      </div>

      {/* Kategoriler */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '2rem'
      }}>
        {Object.entries(categoryTranslations).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selectedCategory === key ? '#2D3B2D' : '#F3F7F3',
              color: selectedCategory === key ? '#E8F5E9' : '#2D3B2D',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Yükleniyor Göstergesi */}
      {isLoading && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#2D3B2D'
        }}>
          Yükleniyor...
        </div>
      )}

      {/* Testler Tablosu */}
      {!isLoading && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{
                backgroundColor: '#F3F7F3',
                borderBottom: '2px solid #E5E7EB'
              }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#2D3B2D' }}>Soru</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#2D3B2D' }}>Seçenekler</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#2D3B2D' }}>Emisyon Etkisi</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#2D3B2D' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((test) => (
                <tr key={test.key} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '1rem', color: '#2D3B2D' }}>{test.question}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {Object.entries(test.options).map(([key, option]) => (
                        <div key={key} style={{ color: '#4B5563', fontSize: '0.875rem' }}>
                          {key}: {option.text}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {Object.entries(test.options).map(([key, option]) => {
                        const emissionValue = parseInt(option.emission, 10);
                        return (
                          <div key={key} style={{
                            color: emissionValue <= 0 ? '#059669' : '#DC2626',
                            fontSize: '0.875rem'
                          }}>
                            {emissionValue > 0 ? '+' : ''}{option.emission}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleDelete(test.key)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          border: 'none',
                          backgroundColor: '#DC2626',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Yeni Test Ekleme Modalı */}
      <AddTestModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSave}
        testType={testType}
      />

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

export default Tests; 