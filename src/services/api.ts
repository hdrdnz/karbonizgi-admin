import axios, { AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const ADMIN_TOKEN = import.meta.env.VITE_X_ADMIN_TOKEN;
console.log("BASE_URL:", BASE_URL)


const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Admin-Token': ADMIN_TOKEN,
  }
});

export interface TestOption {
  text: string;
  emission: string;
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

export const addTest = async (type: 'person' | 'company', category: string, test: TestQuestion): Promise<boolean> => {
  try {
    const options = Object.fromEntries(
      Object.entries(test.options).map(([key, opt]) => [key.toUpperCase(), { text: opt.text, emission: parseFloat(opt.emission) }])
    );
    const body = {
      key: test.key,
      question: test.question,
      options
    };
    const response = await axios.post(`${BASE_URL}/add-test/${type}/${category}`, body, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    console.log('Test Ekleme Başarılı:', response.data);
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Test Ekleme Hatası:', error.response?.data);
      return false;
    }
    return false;
  }
};

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

export const deleteComment = async (question: string, questionType: 'person' | 'company') => {
  const params = new URLSearchParams();
  params.append('question', question);
  params.append('question_type', questionType);
  const response = await axios.post(`${BASE_URL}/delete-comment`, params, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const updateAdmin = async (adminId: number, adminData: { name: string; last_name: string; email: string }) => {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await api.post(`${BASE_URL}/update-admin/${adminId}`, adminData, {
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': ADMIN_TOKEN,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (response.status === 200 && response.data.status === 'success') {
      return { success: true, message: response.data.message || 'Admin bilgileri başarıyla güncellendi!' };
    } else {
      return { success: false, message: response.data.message || 'Admin bilgileri güncellenirken bir hata oluştu.' };
    }
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || 'Admin bilgileri güncellenirken bir hata oluştu.' };
  }
};

export const fetchAdminInfo = async () => {
  // ... existing code ...
};

export const resetAdminPassword = async (adminId: number, password: string) => {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await api.post(`${BASE_URL}/reset-admin/${adminId}`, { password }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Admin-Token': ADMIN_TOKEN,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (response.status === 200 && response.data.status === 'success') {
      return { success: true, message: response.data.message || 'Şifre başarıyla sıfırlandı!' };
    } else {
      return { success: false, message: response.data.message || 'Şifre sıfırlanırken bir hata oluştu.' };
    }
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || 'Şifre sıfırlanırken bir hata oluştu.' };
  }
}; 