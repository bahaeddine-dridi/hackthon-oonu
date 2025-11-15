import { Button } from '../ui/button';
import { Admin } from '../../App';
import { Shield, LogOut, Menu } from 'lucide-react';

interface AdminHeaderProps {
  admin: Admin;
  language: 'ar' | 'fr';
  onLogout: () => void;
  onToggleSidebar?: () => void;
}

const translations = {
  ar: {
    admin: 'المدير',
    logout: 'تسجيل الخروج'
  },
  fr: {
    admin: 'Admin',
    logout: 'Déconnexion'
  }
};

export function AdminHeader({ admin, language, onLogout, onToggleSidebar }: AdminHeaderProps) {
  const t = translations[language];

  return (
    <div className="bg-blue-900 text-white px-4 py-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <Button
              onClick={onToggleSidebar}
              variant="ghost"
              className="text-white hover:bg-blue-800 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            <div>
              <p className="text-sm text-blue-200">{t.admin}</p>
              <p className="text-white">{admin.name}</p>
            </div>
          </div>
        </div>
        <Button
          onClick={onLogout}
          variant="ghost"
          className="text-white hover:bg-blue-800"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
