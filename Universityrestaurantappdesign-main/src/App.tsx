import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { WeeklyMenu } from './components/WeeklyMenu';
import { ReservationSystem } from './components/ReservationSystem';
import { Wallet } from './components/Wallet';
import { Feedback } from './components/Feedback';
import { Profile } from './components/Profile';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminMenuManagement } from './components/admin/AdminMenuManagement';
import { AdminStudentManagement } from './components/admin/AdminStudentManagement';
import { AdminStatistics } from './components/admin/AdminStatistics';
import { AdminRecommendations } from './components/admin/AdminRecommendations';
import { AdminReviews } from './components/admin/AdminReviews';

type StudentPage = 'login' | 'dashboard' | 'menu' | 'reservation' | 'wallet' | 'feedback' | 'profile';
type AdminPage = 'admin-login' | 'admin-dashboard' | 'admin-menu' | 'admin-students' | 'admin-stats' | 'admin-ai' | 'admin-reviews';
type Page = StudentPage | AdminPage;
type Language = 'ar' | 'fr';

export interface User {
  id: string;
  name: string;
  university: string;
  email: string;
  points: number;
  balance: number;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [language, setLanguage] = useState<Language>('ar');
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleAdminLogin = (adminData: Admin) => {
    setAdmin(adminData);
    setCurrentPage('admin-dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setAdmin(null);
    setCurrentPage('login');
  };

  const handleShowAdminLogin = () => {
    setCurrentPage('admin-login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleLogin} 
          language={language} 
          onLanguageChange={setLanguage}
          onShowAdminLogin={handleShowAdminLogin}
        />
      )}

      {currentPage === 'admin-login' && (
        <AdminLogin
          onLogin={handleAdminLogin}
          language={language}
          onLanguageChange={setLanguage}
          onBackToStudent={() => setCurrentPage('login')}
        />
      )}
      
      {currentPage !== 'login' && currentPage !== 'admin-login' && user && !admin && (
        <>
          {currentPage === 'dashboard' && (
            <Dashboard 
              user={user}
              language={language}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
            />
          )}
          
          {currentPage === 'menu' && (
            <WeeklyMenu 
              language={language}
              onNavigate={setCurrentPage}
              user={user}
            />
          )}
          
          {currentPage === 'reservation' && (
            <ReservationSystem 
              language={language}
              onNavigate={setCurrentPage}
              user={user}
            />
          )}
          
          {currentPage === 'wallet' && (
            <Wallet 
              language={language}
              onNavigate={setCurrentPage}
              user={user}
            />
          )}
          
          {currentPage === 'feedback' && (
            <Feedback 
              language={language}
              onNavigate={setCurrentPage}
              user={user}
            />
          )}
          
          {currentPage === 'profile' && (
            <Profile 
              language={language}
              onNavigate={setCurrentPage}
              user={user}
              onUpdateUser={setUser}
            />
          )}
        </>
      )}

      {admin && (
        <>
          {currentPage === 'admin-dashboard' && (
            <AdminDashboard
              admin={admin}
              language={language}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
            />
          )}

          {currentPage === 'admin-menu' && (
            <AdminMenuManagement
              language={language}
              onNavigate={setCurrentPage}
              admin={admin}
            />
          )}

          {currentPage === 'admin-students' && (
            <AdminStudentManagement
              language={language}
              onNavigate={setCurrentPage}
              admin={admin}
            />
          )}

          {currentPage === 'admin-stats' && (
            <AdminStatistics
              language={language}
              onNavigate={setCurrentPage}
              admin={admin}
            />
          )}

          {currentPage === 'admin-ai' && (
            <AdminRecommendations
              language={language}
              onNavigate={setCurrentPage}
              admin={admin}
            />
          )}

          {currentPage === 'admin-reviews' && (
            <AdminReviews
              language={language}
              onNavigate={setCurrentPage}
              admin={admin}
            />
          )}
        </>
      )}
    </div>
  );
}