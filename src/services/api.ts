import axios, { AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const ADMIN_TOKEN = import.meta.env.VITE_X_ADMIN_TOKEN;
console.log("BASE_URL:",BASE_URL)

// Axios instance oluştur
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Admin-Token': ADMIN_TOKEN,
  }
});

// API yanıt tipleri
export interface TestOption {
  text: string;
  emission: number;
}

export interface TestQuestion {
  key: string;
  question: string;
  options: {
    [key: string]: TestOption;
  };
}

export interface TestResponse {
  [category: string]: TestQuestion[];
  diet: TestQuestion[];
  energy: TestQuestion[];
  housing: TestQuestion[];
  transport: TestQuestion[];
  waste_recycling: TestQuestion[];
}

export interface ArticleSection {
  subtitle: string;
  type: string;
  content?: string;
  items?: { title: string; content: string }[];
}

export interface Article {
  title: string;
  image: string;
  sections: ArticleSection[];
}

export interface User {
  Id: number;
  Email: string;
  Firstname: string;
  Lastname: string;
  Password: string;
  Username: string;
  UserType: string;
  CompanyName?: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface UserInfo {
  UserId: number;
  Email: string;
  UserName: string;
  FirstName: string;
  LastName: string;
  UserType: string;
}

// Testleri getir
export const fetchTests = async (type: 'person' | 'company'): Promise<TestResponse> => {
  try {
    const response: AxiosResponse<TestResponse> = await api.get('/test', {
      params: { type },
      headers: getAuthHeaders(),
    });

    // Response'u detaylı loglayalım
    console.log('API Response:', {
      status: response.status,
      data: response.data
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Hatası:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(`API isteği başarısız: ${error.message}`);
    }
    throw error;
  }
};

// Yeni test ekle
export const addTest = async (type: 'person' | 'company', test: TestQuestion): Promise<void> => {
  try {
    const response = await api.post('/test', test, {
      params: { type },
      headers: getAuthHeaders(),
    });
    console.log('Test Ekleme Başarılı:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Test Ekleme Hatası:', error.response?.data);
      throw new Error(`Test eklenemedi: ${error.message}`);
    }
    throw error;
  }
};

// Test güncelle
export const updateTest = async (type: 'person' | 'company', test: TestQuestion): Promise<void> => {
  try {
    const response = await api.put('/test', test, {
      params: { type },
      headers: getAuthHeaders(),
    });
    console.log('Test Güncelleme Başarılı:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Test Güncelleme Hatası:', error.response?.data);
      throw new Error(`Test güncellenemedi: ${error.message}`);
    }
    throw error;
  }
};

// Test sil
export const deleteTest = async (type: 'person' | 'company', testKey: string): Promise<void> => {
  try {
    const response = await api.delete('/test', {
      params: { type, key: testKey },
      headers: getAuthHeaders(),
    });
    console.log('Test Silme Başarılı:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Test Silme Hatası:', error.response?.data);
      throw new Error(`Test silinemedi: ${error.message}`);
    }
    throw error;
  }
};

// Login fonksiyonu
export const login = async (email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/login`, {
    email,
    password
  }, {
    headers: {
      'X-Admin-Token': ADMIN_TOKEN,
      'Content-Type': 'application/json',
    }
  });
  const token = response.data?.data?.token;
  if (token) {
    localStorage.setItem('admin_token', token);
  }
  return response.data;
};

// Token'ı header'a ekleyen yardımcı fonksiyon
const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'X-Admin-Token': ADMIN_TOKEN,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchArticles = async (): Promise<Article[]> => {
  const response = await axios.get(`${BASE_URL}/data`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const fetchComments = async (userType: 'person' | 'company') => {
  const response = await axios.get(`${BASE_URL}/comments?user_type=${userType}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const addComment = async (userType: 'person' | 'company', comment: { question: string; answer: string }) => {
  const response = await axios.post(`${BASE_URL}/add-comment`, {
    comment,
    user_type: userType
  }, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const addArticle = async (article: Article) => {
  const response = await axios.post(`${BASE_URL}/add-data`, article, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const fetchUsers = async (userType: 'person' | 'company'): Promise<User[]> => {
  const response = await axios.get(`${BASE_URL}/users?user_type=${userType}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateUser = async (user: UserInfo) => {
  const response = await axios.post(`${BASE_URL}/update-user`, user, {
    headers: getAuthHeaders()
  });
  return response.data;
}; 