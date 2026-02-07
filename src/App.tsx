import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Missions } from './pages/Missions';
import { Focus } from './pages/Focus';
import { Oracle } from './pages/Oracle';
import { Academics } from './pages/Academics';
import { Tribunal } from './pages/Tribunal';
import { Vault } from './pages/Vault';
import { Market } from './pages/Market';
import { Commander } from './pages/Commander';
import { AdminDashboard } from './pages/Admin';
import { Login } from './pages/Login';
import { Galaxy } from './pages/Galaxy';
import { Squad } from './pages/Squad';
import { Nexus } from './pages/Nexus';
import { Prophet } from './pages/Prophet';
import { useStore } from './store/useStore';

// Protected Route Wrapper
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { currentUser } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: location } });
    } else if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      navigate('/'); // Redirect unauthorized access to home
    }
  }, [currentUser, navigate, allowedRoles, location]);

  if (!currentUser) return null;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="missions" element={<Missions />} />
          <Route path="focus" element={<Focus />} />
          <Route path="oracle" element={<Oracle />} />
          <Route path="prophet" element={<Prophet />} />
          <Route path="academics" element={<Academics />} />
          <Route path="nexus" element={<Nexus />} />
          <Route path="galaxy" element={<Galaxy />} />
          <Route path="squad" element={<Squad />} />
          <Route path="tribunal" element={<Tribunal />} />
          <Route path="vault" element={<Vault />} />
          <Route path="market" element={<Market />} />
          
          {/* Parent Only Route */}
          <Route path="commander" element={
            <ProtectedRoute allowedRoles={['parent']}>
              <Commander />
            </ProtectedRoute>
          } />

          {/* Admin Only Route */}
          <Route path="admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
