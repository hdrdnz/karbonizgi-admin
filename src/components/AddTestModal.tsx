import { useState } from 'react';
import { TestQuestion } from '../services/api';
interface AddTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (test: TestQuestion) => void;
  testType: 'individual' | 'corporate';
}

const AddTestModal = ({ isOpen, onClose, onSave, testType }: AddTestModalProps) => {
  // Bireysel test kategorileri
  const individualCategories = [
    'Enerji',
    'Ulaşım',
    'Diyet',
    'Geri Dönüşüm',
    'Alışveriş',
    'Ev'
  ];

  // Kurumsal test kategorileri
  const corporateCategories = [
    'Endüstri',
    'Enerji & Ulaşım',
    'Hizmet & Ticaret',
    'Atık Yönetimi'
  ];

  const categories = testType === 'individual' ? individualCategories : corporateCategories;

  const [newTest, setNewTest] = useState<TestQuestion>({
    key: '',
    question: '',
    options: {
      A: { text: '', emission: 0 },
      B: { text: '', emission: 0 },
      C: { text: '', emission: 0 },
      D: { text: '', emission: 0 },
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(newTest);
    // Formu sıfırla
    setNewTest({
      key: '',
      question: '',
      options: {
        A: { text: '', emission: 0 },
        B: { text: '', emission: 0 },
        C: { text: '', emission: 0 },
        D: { text: '', emission: 0 },
      }
    });
  };

  const handleOptionChange = (
    optionKey: string,
    field: 'text' | 'emission',
    value: string | number
  ) => {
    setNewTest((prev: TestQuestion) => ({
      ...prev,
      options: {
        ...prev.options,
        [optionKey]: {
          ...prev.options[optionKey],
          [field]: field === 'emission' ? Number(value) : value
        }
      }
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '2rem',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{
          color: '#2D3B2D',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem'
        }}>
          Yeni {testType === 'individual' ? 'Bireysel' : 'Kurumsal'} Test Ekle
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Kategori Seçimi */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="category"
              style={{
                display: 'block',
                color: '#2D3B2D',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}
            >
              Kategori
            </label>
            <select
              id="category"
              value={newTest.key}
              onChange={(e) => setNewTest(prev => ({ ...prev, category: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #E5E7EB',
                fontSize: '0.875rem',
                backgroundColor: 'white'
              }}
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Soru */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="question"
              style={{
                display: 'block',
                color: '#2D3B2D',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}
            >
              Soru
            </label>
            <input
              type="text"
              id="question"
              value={newTest.question}
              onChange={(e) => setNewTest((prev: TestQuestion) => ({ ...prev, question: e.target.value }))}
              placeholder="Sorunuzu buraya yazın"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #E5E7EB',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* Soru Key'i */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="key"
              style={{
                display: 'block',
                color: '#2D3B2D',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}
            >
              Soru Anahtarı
            </label>
            <input
              type="text"
              id="key"
              value={newTest.key}
              placeholder="Benzersiz anahtar (ör: meat_consumption)"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #E5E7EB',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* Seçenekler */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
              color: '#2D3B2D',
              fontSize: '1rem',
              fontWeight: '500',
              marginBottom: '1rem'
            }}>
              Seçenekler
            </h3>
            {Object.entries(newTest.options).map(([key, option]) => (
              <div key={key} style={{
                marginBottom: '1rem',
                padding: '1rem',
                backgroundColor: '#F3F7F3',
                borderRadius: '0.375rem'
              }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label
                    htmlFor={`option-${key}-text`}
                    style={{
                      display: 'block',
                      color: '#2D3B2D',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Seçenek {key}
                  </label>
                  <input
                    type="text"
                    id={`option-${key}-text`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(key, 'text', e.target.value)}
                    placeholder={`${key} seçeneğinin metnini yazın`}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #E5E7EB',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`option-${key}-emission`}
                    style={{
                      display: 'block',
                      color: '#2D3B2D',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Emisyon Değeri
                  </label>
                  <input
                    type="number"
                    id={`option-${key}-emission`}
                    value={option.emission}
                    onChange={(e) => handleOptionChange(key, 'emission', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #E5E7EB',
                      fontSize: '0.875rem'
                    }}
                  />
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    marginTop: '0.25rem'
                  }}>
                    Not: Negatif değerler olumlu etkiyi, pozitif değerler olumsuz etkiyi gösterir
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Butonlar */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            marginTop: '2rem'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #E5E7EB',
                backgroundColor: 'white',
                color: '#2D3B2D',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              İptal
            </button>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: '#2D3B2D',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestModal; 