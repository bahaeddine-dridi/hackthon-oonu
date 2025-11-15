import { useState } from 'react';
import { Admin } from '../../App';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Shield, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (admin: Admin) => void;
  language: 'ar' | 'fr';
  onLanguageChange: (lang: 'ar' | 'fr') => void;
  onBackToStudent: () => void;
}

const translations = {
  ar: {
    title: 'لوحة تحكم المدير',
    subtitle: 'OOUN Admin Panel',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    login: 'تسجيل الدخول',
    backToStudent: 'العودة لتسجيل دخول الطالب',
    footer: '© OOUN — Diwan des Oeuvres Universitaires du Nord',
    placeholder: {
      email: 'أدخل البريد الإلكتروني',
      password: 'أدخل كلمة المرور'
    }
  },
  fr: {
    title: 'Panneau d\'administration',
    subtitle: 'OOUN Admin Panel',
    email: 'Email',
    password: 'Mot de passe',
    login: 'Se connecter',
    backToStudent: 'Retour connexion étudiant',
    footer: '© OOUN — Diwan des Oeuvres Universitaires du Nord',
    placeholder: {
      email: 'Entrez votre email',
      password: 'Entrez votre mot de passe'
    }
  }
};

export function AdminLogin({ onLogin, language, onLanguageChange, onBackToStudent }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock admin login
    const mockAdmin: Admin = {
      id: 'admin001',
      name: 'Mohamed Administrateur',
      email: email || 'admin@ooun.tn',
      role: 'Super Admin'
    };
    
    onLogin(mockAdmin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={onBackToStudent}
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToStudent}
          </Button>
          <div className="flex gap-2">
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
        </div>

        {/* Admin Login Card */}
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-blue-900 mb-1">{t.title}</h1>
            <p className="text-slate-600">{t.subtitle}</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                {t.email}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.placeholder.email}
                className="h-11"
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
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-900 hover:bg-blue-800 text-white"
            >
              {t.login}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          {t.footer}
        </p>
      </div>
    </div>
  );
}
