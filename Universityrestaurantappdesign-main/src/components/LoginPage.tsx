import { useState } from 'react';
import { User } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Building2 } from 'lucide-react';
import { authService } from '../services/auth.service';
import { handleApiError } from '../utils/helpers';

interface LoginPageProps {
  onLogin: (user: User) => void;
  language: 'ar' | 'fr';
  onLanguageChange: (lang: 'ar' | 'fr') => void;
  onShowAdminLogin: () => void;
}

const translations = {
  ar: {
    title: 'منصة المطاعم الجامعية',
    subtitle: 'OOUN',
    studentId: 'رقم الطالب (CIN)',
    password: 'كلمة المرور',
    login: 'تسجيل الدخول',
    adminLogin: 'تسجيل دخول المدير',
    footer: '© OOUN — Diwan des Oeuvres Universitaires du Nord',
    placeholder: {
      studentId: 'أدخل رقم البطاقة الجامعية',
      password: 'أدخل كلمة المرور'
    }
  },
  fr: {
    title: 'Plateforme des Restaurants Universitaires',
    subtitle: 'OOUN',
    studentId: 'Numéro étudiant (CIN)',
    password: 'Mot de passe',
    login: 'Se connecter',
    adminLogin: 'Connexion Admin',
    footer: '© OOUN — Diwan des Oeuvres Universitaires du Nord',
    placeholder: {
      studentId: 'Entrez votre numéro étudiant',
      password: 'Entrez votre mot de passe'
    }
  }
};

export function LoginPage({ onLogin, language, onLanguageChange, onShowAdminLogin }: LoginPageProps) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.studentLogin({
        student_id: studentId,
        password: password,
      });

      if (result.student) {
        const user: User = {
          id: result.student.student_id,
          name: result.student.name,
          university: result.student.university,
          email: result.student.email,
          points: result.student.points,
          balance: result.student.wallet_balance,
        };
        onLogin(user);
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => onLanguageChange('ar')}
            className={`px-3 py-1 rounded-md transition-colors ${
              language === 'ar' 
                ? 'bg-blue-900 text-white' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            عربي
          </button>
          <button
            onClick={() => onLanguageChange('fr')}
            className={`px-3 py-1 rounded-md transition-colors ${
              language === 'fr' 
                ? 'bg-blue-900 text-white' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Français
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-blue-900 mb-1">{t.title}</h1>
            <p className="text-slate-600">{t.subtitle}</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="studentId" className="text-slate-700">
                {t.studentId}
              </Label>
              <Input
                id="studentId"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder={t.placeholder.studentId}
                className="h-11"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">
                {t.password}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.placeholder.password}
                className="h-11"
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-900 hover:bg-blue-800 text-white"
              disabled={loading}
            >
              {loading ? 'Logging in...' : t.login}
            </Button>
          </form>

          {/* Admin Login Button */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <Button
              type="button"
              onClick={onShowAdminLogin}
              variant="outline"
              className="w-full h-11 border-blue-900 text-blue-900 hover:bg-blue-50"
            >
              {t.adminLogin}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          {t.footer}
        </p>
      </div>
    </div>
  );
}