import { useState, useEffect } from 'react';
import EditTestModal from './EditTestModal';
import AddTestModal from './AddTestModal';
import { fetchTests, addTest, updateTest, deleteTest, TestQuestion } from '../services/api';

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
  const [editingTest, setEditingTest] = useState<TestQuestion | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleEditClick = (test: TestQuestion) => {
    setEditingTest(test);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (updatedTest: TestQuestion) => {
    try {
      await updateTest(testType === 'individual' ? 'person' : 'company', updatedTest);
      await loadTests();
      setIsEditModalOpen(false);
      setEditingTest(null);
    } catch (err) {
      setError('Test güncellenirken bir hata oluştu');
      console.error(err);
    }
  };

  const handleAddSave = async (newTest: TestQuestion) => {
    try {
      await addTest(testType === 'individual' ? 'person' : 'company', newTest);
      await loadTests();
      setIsAddModalOpen(false);
    } catch (err) {
      setError('Test eklenirken bir hata oluştu');
      console.error(err);
    }
  };

  const handleDelete = async (testKey: string) => {
    if (window.confirm('Bu testi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteTest(testType === 'individual' ? 'person' : 'company', testKey);
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
                      {Object.entries(test.options).map(([key, option]) => (
                        <div key={key} style={{
                          color: option.emission <= 0 ? '#059669' : '#DC2626',
                          fontSize: '0.875rem'
                        }}>
                          {option.emission > 0 ? '+' : ''}{option.emission}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEditClick(test)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          border: 'none',
                          backgroundColor: '#2D3B2D',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Düzenle
                      </button>
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

      {/* Düzenleme Modalı */}
      <EditTestModal
        test={editingTest}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTest(null);
        }}
        onSave={handleEditSave}
      />

      {/* Yeni Test Ekleme Modalı */}
      <AddTestModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSave}
        testType={testType}
      />
    </div>
  );
};

export default Tests; 