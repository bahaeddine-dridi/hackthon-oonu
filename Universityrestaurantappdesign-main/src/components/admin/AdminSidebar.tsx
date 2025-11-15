import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  BarChart3, 
  Sparkles, 
  MessageSquare 
} from 'lucide-react';

type AdminPage = 'admin-dashboard' | 'admin-menu' | 'admin-students' | 'admin-stats' | 'admin-ai' | 'admin-reviews';

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: AdminPage) => void;
  language: 'ar' | 'fr';
  isOpen?: boolean;
}

const translations = {
  ar: {
    dashboard: 'لوحة التحكم',
    menuManagement: 'إدارة القائمة',
    students: 'إدارة الطلاب',
    statistics: 'الإحصائيات',
    aiRecommendations: 'توصيات الذكاء الاصطناعي',
    reviews: 'تقييمات الطلاب'
  },
  fr: {
    dashboard: 'Tableau de bord',
    menuManagement: 'Gestion du menu',
    students: 'Gestion étudiants',
    statistics: 'Statistiques',
    aiRecommendations: 'Recommandations IA',
    reviews: 'Évaluations étudiants'
  }
};

export function AdminSidebar({ currentPage, onNavigate, language, isOpen = true }: AdminSidebarProps) {
  const t = translations[language];

  const menuItems = [
    { icon: LayoutDashboard, label: t.dashboard, page: 'admin-dashboard' as AdminPage },
    { icon: Calendar, label: t.menuManagement, page: 'admin-menu' as AdminPage },
    { icon: Users, label: t.students, page: 'admin-students' as AdminPage },
    { icon: BarChart3, label: t.statistics, page: 'admin-stats' as AdminPage },
    { icon: Sparkles, label: t.aiRecommendations, page: 'admin-ai' as AdminPage },
    { icon: MessageSquare, label: t.reviews, page: 'admin-reviews' as AdminPage },
  ];

  return (
    <div className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      fixed md:static inset-y-0 left-0 z-20
      w-64 bg-white border-r border-slate-200
      transition-transform duration-300 ease-in-out
    `}>
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.page
                  ? 'bg-blue-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
