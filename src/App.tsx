import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout'
import Home from './components/Home'
import Tests from './components/Tests'
import Articles from './components/Articles'
import SoruCevap from './components/SoruCevap.tsx'
import Users from './components/Users.tsx'
import Login from './components/Login'
import { JSX, useState } from 'react'
import { login } from './services/api'
import ComingSoon from './components/ComingSoon.tsx'
import Privacy from './components/Privacy'

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('admin_token');
  const location = useLocation();
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('admin_token'));

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await login(email, password);
      if (res?.data?.token) {
        setIsAuthenticated(true);
        return res;
      }
      return res;
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        return { status: 'error', message: err.response.data.message };
      }
      return { status: 'error', message: 'Bir hata oluştu.' };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ComingSoon />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route
          path="/admin/login"
          element={
            isAuthenticated
              ? <Navigate to="/admin" replace />
              : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/admin/*"
          element={
            <RequireAuth>
              <Layout onLogout={handleLogout}>
                <Routes>
                  <Route path="" element={<Home />} />
                  <Route path="testler" element={<Tests />} />
                  <Route path="makaleler" element={<Articles />} />
                  <Route path="soru-cevap" element={<SoruCevap />} />
                  <Route path="kullanicilar" element={<Users />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </Layout>
            </RequireAuth>
          }
        />
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </Router>
  )
}

export default App
